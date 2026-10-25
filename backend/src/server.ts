import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { prisma } from './db.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const authTokenSecret = process.env.AUTH_TOKEN_SECRET

if (!authTokenSecret) {
  throw new Error('AUTH_TOKEN_SECRET is required')
}

const AUTH_TOKEN_TTL_SECONDS = 8 * 60 * 60

const createAuthToken = (admin: { id: number; username: string; displayName: string | null; role: 'OGA' | 'MANAGER' | 'CASHIER' }) => {
  const payload = {
    sub: admin.id,
    username: admin.username,
    displayName: admin.displayName,
    role: admin.role,
    exp: Math.floor(Date.now() / 1000) + AUTH_TOKEN_TTL_SECONDS
  }

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', authTokenSecret)
    .update(encodedPayload)
    .digest('base64url')

  return `${encodedPayload}.${signature}`
}

const readAuthToken = (token: string) => {
  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return null

  const expectedSignature = crypto
    .createHmac('sha256', authTokenSecret)
    .update(encodedPayload)
    .digest('base64url')

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'))
    if (!payload?.sub || !payload?.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload as {
      sub: number
      username: string
      displayName: string | null
      role?: 'OGA' | 'MANAGER' | 'CASHIER'
      exp: number
    }
  } catch {
    return null
  }
}

const getBearerToken = (req: express.Request) => {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  return header.slice(7).trim() || null
}


const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = getBearerToken(req)
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' })
  }

  const payload = readAuthToken(token)
  if (!payload) {
    return res.status(401).json({ message: 'Session expired or invalid.' })
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        status: true
      }
    })

    if (!admin || admin.status !== 'ACTIVE') {
      return res.status(401).json({ message: 'Account is not available.' })
    }

    res.locals.auth = admin
    return next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({ message: 'Unable to validate authentication.' })
  }
}

const requireRoles = (...roles: Array<'OGA' | 'MANAGER' | 'CASHIER'>) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const auth = res.locals.auth as { role: 'OGA' | 'MANAGER' | 'CASHIER' } | undefined

    if (!auth) {
      return res.status(401).json({ message: 'Authentication required.' })
    }

    if (!roles.includes(auth.role)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource.' })
    }

    return next()
  }
}

const requireManagement = [requireAuth, requireRoles('OGA', 'MANAGER')]
const requireCashier = [requireAuth, requireRoles('CASHIER')]

app.use(helmet())
const configuredOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean) ?? []

app.use(cors({
  origin: (origin, callback) => {
    // Allow browser requests from configured frontend origins.
    // During local development Vite may use ports such as 5173, 5174, 5175, etc.
    if (
      !origin ||
      configuredOrigins.includes(origin) ||
      /^https?:\/\/localhost:\d+$/.test(origin) ||
      /^https?:\/\/127\.0\.0\.1:\d+$/.test(origin)
    ) {
      callback(null, true)
      return
    }

    callback(new Error('Not allowed by CORS'))
  }
}))

app.use(express.json())

const loginSchema = z.object({
  userId: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200)
})

app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'User ID and password are required.' })
  }

  try {
    const admin = await prisma.adminUser.findUnique({ where: { username: parsed.data.userId } })

    if (!admin || admin.status !== 'ACTIVE') {
      return res.status(401).json({ message: 'Invalid User ID or password.' })
    }

    const passwordMatches = await bcrypt.compare(parsed.data.password, admin.passwordHash)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid User ID or password.' })
    }

    const token = createAuthToken(admin)

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'LOGIN',
        entity: 'AdminUser',
        entityId: String(admin.id),
        details: { username: admin.username, role: admin.role, loginAt: new Date().toISOString() }
      }
    })

    return res.json({
      message: 'Login successful.',
      token,
      expiresIn: AUTH_TOKEN_TTL_SECONDS,
      user: { id: admin.id, username: admin.username, displayName: admin.displayName, role: admin.role }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Unable to process login.' })
  }
})

app.get('/api/auth/me', requireAuth, async (_req, res) => {
  const auth = res.locals.auth as {
    id: number
    username: string
    displayName: string | null
    role: 'OGA' | 'MANAGER' | 'CASHIER'
  }

  return res.json({
    authenticated: true,
    user: {
      id: auth.id,
      username: auth.username,
      displayName: auth.displayName,
      role: auth.role
    }
  })
})

app.post('/api/auth/logout', async (req, res) => {
  const token = getBearerToken(req)
  const payload = token ? readAuthToken(token) : null

  if (payload) {
    try {
      await prisma.auditLog.create({
        data: {
          adminId: payload.sub,
          action: 'LOGOUT',
          entity: 'AdminUser',
          entityId: String(payload.sub),
          details: { logoutAt: new Date().toISOString() }
        }
      })
    } catch (error) {
      console.error('Logout audit error:', error)
    }
  }

  return res.json({ message: 'Logged out successfully.' })
})


const ensureStockAdjustmentTable = async () => {
  // Prisma prepared statements do not allow multiple SQL commands in one
  // $executeRawUnsafe call, so each DDL statement is executed separately.
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "stock_adjustments" (
      "id" SERIAL PRIMARY KEY,
      "company_id" INTEGER NOT NULL,
      "product_id" INTEGER NOT NULL,
      "ref_no" VARCHAR(80) NOT NULL,
      "entry_staff" VARCHAR(120) NOT NULL,
      "added_ctn_qty" NUMERIC(14, 2) NOT NULL DEFAULT 0,
      "added_unit_qty" NUMERIC(14, 2) NOT NULL DEFAULT 0,
      "year" INTEGER,
      "month" INTEGER,
      "date" DATE,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "stock_adjustments_company_id_idx"
      ON "stock_adjustments" ("company_id")
  `)

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "stock_adjustments_product_id_idx"
      ON "stock_adjustments" ("product_id")
  `)
}

const ensureStockPurchaseTable = async () => {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "stock_purchases" (
      "id" SERIAL PRIMARY KEY,
      "company_id" INTEGER NOT NULL,
      "product_id" INTEGER NOT NULL,
      "ref_no" VARCHAR(80) NOT NULL,
      "entry_staff" VARCHAR(120) NOT NULL,
      "added_ctn_qty" NUMERIC(14, 2) NOT NULL DEFAULT 0,
      "added_unit_qty" NUMERIC(14, 2) NOT NULL DEFAULT 0,
      "year" INTEGER,
      "month" INTEGER,
      "date" DATE,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "stock_purchases_company_id_idx"
      ON "stock_purchases" ("company_id")
  `)

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "stock_purchases_product_id_idx"
      ON "stock_purchases" ("product_id")
  `)
}

const ensureOpenStockPurchaseTable = async () => {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "open_stock_purchases" (
      "id" SERIAL PRIMARY KEY,
      "company_id" INTEGER NOT NULL,
      "product_id" INTEGER NOT NULL,
      "ref_no" VARCHAR(80) NOT NULL,
      "entry_staff" VARCHAR(120) NOT NULL,
      "added_ctn_qty" NUMERIC(14, 2) NOT NULL DEFAULT 0,
      "added_unit_qty" NUMERIC(14, 2) NOT NULL DEFAULT 0,
      "year" INTEGER,
      "month" INTEGER,
      "date" DATE,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "open_stock_purchases_company_id_idx"
      ON "open_stock_purchases" ("company_id")
  `)

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "open_stock_purchases_product_id_idx"
      ON "open_stock_purchases" ("product_id")
  `)
}

const getOpenStockBalances = async (companyId: number) => {
  const rows = await prisma.$queryRaw<Array<{
    productId: number
    ctnQty: number
    unitQty: number
  }>>`
    SELECT
      "product_id" AS "productId",
      COALESCE(SUM("added_ctn_qty"), 0)::float8 AS "ctnQty",
      COALESCE(SUM("added_unit_qty"), 0)::float8 AS "unitQty"
    FROM "open_stock_purchases"
    WHERE "company_id" = ${companyId}
    GROUP BY "product_id"
  `

  return new Map(rows.map((row) => [row.productId, {
    ctnQty: Number(row.ctnQty || 0),
    unitQty: Number(row.unitQty || 0)
  }]))
}

const getStockBalances = async (companyId: number) => {
  const adjustments = await prisma.$queryRaw<Array<{
    productId: number
    ctnQty: number
    unitQty: number
  }>>`
    SELECT
      "product_id" AS "productId",
      COALESCE(SUM("added_ctn_qty"), 0)::float8 AS "ctnQty",
      COALESCE(SUM("added_unit_qty"), 0)::float8 AS "unitQty"
    FROM "stock_adjustments"
    WHERE "company_id" = ${companyId}
    GROUP BY "product_id"
  `

  const purchases = await prisma.$queryRaw<Array<{
    productId: number
    ctnQty: number
    unitQty: number
  }>>`
    SELECT
      "product_id" AS "productId",
      COALESCE(SUM("added_ctn_qty"), 0)::float8 AS "ctnQty",
      COALESCE(SUM("added_unit_qty"), 0)::float8 AS "unitQty"
    FROM "stock_purchases"
    WHERE "company_id" = ${companyId}
    GROUP BY "product_id"
  `

  const openPurchases = await prisma.$queryRaw<Array<{
    productId: number
    ctnQty: number
    unitQty: number
  }>>`
    SELECT
      "product_id" AS "productId",
      COALESCE(SUM("added_ctn_qty"), 0)::float8 AS "ctnQty",
      COALESCE(SUM("added_unit_qty"), 0)::float8 AS "unitQty"
    FROM "open_stock_purchases"
    WHERE "company_id" = ${companyId}
    GROUP BY "product_id"
  `

  const balanceMap = new Map<number, { ctnQty: number; unitQty: number }>()

  for (const row of [...adjustments, ...purchases, ...openPurchases]) {
    const current = balanceMap.get(row.productId) || { ctnQty: 0, unitQty: 0 }
    current.ctnQty += Number(row.ctnQty || 0)
    current.unitQty += Number(row.unitQty || 0)
    balanceMap.set(row.productId, current)
  }

  return balanceMap
}

const getStockAdjustmentProducts = async (companyId: string) => {
  const company = await prisma.company.findUnique({
    where: { companyId },
    include: {
      products: {
        where: { status: 'ACTIVE' },
        orderBy: { id: 'asc' }
      }
    }
  })

  if (!company) return null

  const balanceMap = await getStockBalances(company.id)

  return {
    company,
    products: company.products.map((product) => {
      const balance = balanceMap.get(product.id)
      const ctn = Number(balance?.ctnQty || 0)
      const unit = Number(balance?.unitQty || 0)

      return {
        id: product.id,
        stockName: product.stockName,
        ctnSize: product.ctnSize,
        ctnCostPrice: product.ctnCostPrice,
        stockCtnQty: ctn,
        stockUnitQty: unit,
        stockBalance: `${ctn} ctn & ${unit}`
      }
    })
  }
}

const getStockPurchaseProducts = async (companyId: string) => {
  const company = await prisma.company.findUnique({
    where: { companyId },
    include: {
      products: {
        where: { status: 'ACTIVE' },
        orderBy: { id: 'asc' }
      }
    }
  })

  if (!company) return null

  const balanceMap = await getStockBalances(company.id)

  return {
    company,
    products: company.products.map((product) => {
      const balance = balanceMap.get(product.id)
      const ctn = Number(balance?.ctnQty || 0)
      const unit = Number(balance?.unitQty || 0)

      return {
        id: product.id,
        stockName: product.stockName,
        ctnSize: product.ctnSize,
        ctnCostPrice: product.ctnCostPrice,
        stockCtnQty: ctn,
        stockUnitQty: unit,
        stockBalance: `${ctn} ctn & ${unit}`
      }
    })
  }
}

app.get('/', async (_req, res) => {
  let database = 'unavailable'

  try {
    await prisma.$queryRaw`SELECT 1`
    database = 'connected'
  } catch {
    database = 'unavailable'
  }

  res.json({
    service: "THE LORD'S DOING BACKEND",
    status: 'online',
    database,
    message: 'Backend API is running.',
    endpoints: {
      health: 'GET /api/health',
      banks: [
        'GET /api/banks',
        'POST /api/banks',
        'PUT /api/banks/:id'
      ],
      nyp: [
        'GET /api/nyp',
        'POST /api/nyp',
        'GET /api/nyp/account-history?nypId=...&date=...',
        'GET /api/nyp/account-summary?nypId=...&date=...',
        'GET /api/nyp/debtors?date=...'
      ],
      companies: [
        'GET /api/companies',
        'POST /api/companies',
        'GET /api/companies/:id',
        'GET /api/company/account-history?companyId=...&date=...',
        'GET /api/company/account-summary?companyId=...&date=...',
        'GET /api/company/creditors?date=...'
      ],
      stockAdjustments: [
        'GET /api/stock-adjustments?companyId=...',
        'POST /api/stock-adjustments'
      ],
      stockBinCard: [
        'GET /api/stock-bin-card?companyId=...&productId=...&date=...'
      ],
      stockPurchases: [
        'GET /api/stock-purchases?companyId=...',
        'POST /api/stock-purchases'
      ],
      openStockPurchases: [
        'GET /api/open-stock-purchases?companyId=...',
        'POST /api/open-stock-purchases'
      ]
    }
  })
})

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, service: 'thelorddoing-backend', database: 'connected' })
  } catch {
    res.status(503).json({ ok: false, service: 'thelorddoing-backend', database: 'unavailable' })
  }
})

// Current business-data endpoints are management-only.
// Cashier-specific endpoints will be added separately for sales/checkout workflows.
app.get('/api/banks', ...requireManagement, async (_req, res) => {
  const banks = await prisma.bankAccount.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { id: 'asc' }
  })
  res.json(banks)
})

const bankSchema = z.object({
  accountId: z.string().min(1),
  bankName: z.string().min(1),
  accountName: z.string().min(1),
  accountNo: z.string().min(1),
  year: z.number().int().optional(),
  month: z.number().int().min(1).max(12).optional(),
  date: z.coerce.date().optional()
})

app.post('/api/banks', ...requireManagement, async (req, res) => {
  const parsed = bankSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid bank details', errors: parsed.error.flatten() })
  }

  try {
    const bank = await prisma.bankAccount.create({ data: parsed.data })
    res.status(201).json(bank)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Bank Account ID already exists' })
    }
    res.status(500).json({ message: 'Unable to create bank account' })
  }
})

app.put('/api/banks/:id', ...requireManagement, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid bank id' })

  const parsed = bankSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid bank details', errors: parsed.error.flatten() })
  }

  try {
    const bank = await prisma.bankAccount.update({
      where: { id },
      data: parsed.data
    })
    res.json(bank)
  } catch {
    res.status(404).json({ message: 'Bank account not found' })
  }
})

app.get('/api/bank-analysis', ...requireManagement, async (req, res) => {
  const firstDate = String(req.query.firstDate || '').trim()
  const lastDate = String(req.query.lastDate || '').trim()
  const bankId = String(req.query.bankId || 'All Bank').trim()

  if (!firstDate || !lastDate) {
    return res.status(400).json({ message: 'First Date and Last Date are required.' })
  }

  const from = new Date(`${firstDate}T00:00:00.000`)
  const to = new Date(`${lastDate}T23:59:59.999`)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
    return res.status(400).json({ message: 'Invalid date range.' })
  }

  try {
    const bankFilter = bankId && bankId !== 'All Bank'
      ? { accountId: bankId }
      : undefined

    const banks = await prisma.bankAccount.findMany({
      where: { status: 'ACTIVE', ...(bankFilter ? bankFilter : {}) },
      select: { id: true, accountId: true, bankName: true, accountName: true, accountNo: true },
      orderBy: { id: 'asc' }
    })

    if (bankId !== 'All Bank' && banks.length === 0) {
      return res.status(404).json({ message: 'Bank account not found.' })
    }

    const bankIds = banks.map(bank => bank.id)
    const bankWhere = bankIds.length ? { in: bankIds } : { in: [-1] }

    const [companyPayments, nypPayments, cashSalePayments, deposits, lodgements, externalPayIns] = await Promise.all([
      prisma.companyPayment.findMany({
        where: { bankAccountId: bankWhere, paymentDate: { gte: from, lte: to } },
        select: { id: true, bankAccountId: true, amount: true, paymentMethod: true, reference: true, paymentDate: true, company: { select: { companyId: true, companyName: true } } },
        orderBy: [{ paymentDate: 'asc' }, { id: 'asc' }]
      }),
      prisma.nypPayment.findMany({
        where: { bankAccountId: bankWhere, paymentDate: { gte: from, lte: to } },
        select: { id: true, bankAccountId: true, amount: true, paymentMethod: true, reference: true, paymentDate: true, nypCustomer: { select: { nypId: true, fullName: true } } },
        orderBy: [{ paymentDate: 'asc' }, { id: 'asc' }]
      }),
      prisma.cashSalePayment.findMany({
        where: { bankAccountId: bankWhere, paymentDate: { gte: from, lte: to } },
        select: { id: true, bankAccountId: true, amount: true, paymentMethod: true, reference: true, paymentDate: true, sale: { select: { invoiceNo: true } } },
        orderBy: [{ paymentDate: 'asc' }, { id: 'asc' }]
      }),
      prisma.cashDeposit.findMany({
        where: { bankAccountId: bankWhere, depositDate: { gte: from, lte: to } },
        select: { id: true, bankAccountId: true, amount: true, reference: true, depositDate: true, note: true },
        orderBy: [{ depositDate: 'asc' }, { id: 'asc' }]
      }),
      prisma.bankLodgement.findMany({
        where: { bankAccountId: bankWhere, lodgementDate: { gte: from, lte: to } },
        select: { id: true, bankAccountId: true, amount: true, reference: true, lodgementDate: true, note: true },
        orderBy: [{ lodgementDate: 'asc' }, { id: 'asc' }]
      }),
      prisma.externalCashPayIn.findMany({
        where: { bankAccountId: bankWhere, payInDate: { gte: from, lte: to } },
        select: { id: true, bankAccountId: true, amount: true, source: true, reference: true, payInDate: true, note: true },
        orderBy: [{ payInDate: 'asc' }, { id: 'asc' }]
      })
    ])

    const rows = [
      ...companyPayments.map(item => ({
        id: item.id,
        date: item.paymentDate,
        source: 'Company Payment',
        description: `Payment To ${item.company.companyId}${item.company.companyName ? ` — ${item.company.companyName}` : ''}`,
        reference: item.reference || `COMPANY-PAY-${item.id}`,
        paymentMethod: item.paymentMethod,
        debit: Number(item.amount || 0),
        credit: 0
      })),
      ...nypPayments.map(item => ({
        id: item.id,
        date: item.paymentDate,
        source: 'NYP Payment',
        description: `Payment Received From ${item.nypCustomer.nypId}${item.nypCustomer.fullName ? ` — ${item.nypCustomer.fullName}` : ''}`,
        reference: item.reference || `NYP-PAY-${item.id}`,
        paymentMethod: item.paymentMethod,
        debit: 0,
        credit: Number(item.amount || 0)
      })),
      ...cashSalePayments.map(item => ({
        id: item.id,
        date: item.paymentDate,
        source: 'CashSales Payment',
        description: `Cash Sale ${item.sale.invoiceNo}`,
        reference: item.reference || item.sale.invoiceNo,
        paymentMethod: item.paymentMethod,
        debit: 0,
        credit: Number(item.amount || 0)
      })),
      ...deposits.map(item => ({
        id: item.id,
        date: item.depositDate,
        source: 'Cash Deposit',
        description: item.note || 'Cash deposited into bank',
        reference: item.reference || `DEPOSIT-${item.id}`,
        paymentMethod: 'BANK',
        debit: 0,
        credit: Number(item.amount || 0)
      })),
      ...lodgements.map(item => ({
        id: item.id,
        date: item.lodgementDate,
        source: 'Bank Lodgement',
        description: item.note || 'Bank lodgement',
        reference: item.reference || `LODGEMENT-${item.id}`,
        paymentMethod: 'BANK',
        debit: 0,
        credit: Number(item.amount || 0)
      })),
      ...externalPayIns.map(item => ({
        id: item.id,
        date: item.payInDate,
        source: 'External Cash PAY-IN',
        description: item.note || `External cash pay-in: ${item.source}`,
        reference: item.reference || `EXTERNAL-${item.id}`,
        paymentMethod: 'BANK',
        debit: 0,
        credit: Number(item.amount || 0)
      }))
    ].sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime()
      return dateDiff || a.id - b.id
    })

    let balance = 0
    const reportRows = rows.map(row => {
      balance += row.credit - row.debit
      return {
        ...row,
        date: new Date(row.date).toISOString().slice(0, 10),
        debit: Number(row.debit.toFixed(2)),
        credit: Number(row.credit.toFixed(2)),
        balance: Number(balance.toFixed(2))
      }
    })

    const totalDebit = reportRows.reduce((sum, row) => sum + row.debit, 0)
    const totalCredit = reportRows.reduce((sum, row) => sum + row.credit, 0)

    return res.json({
      firstDate,
      lastDate,
      bankId,
      banks,
      openingBalance: 0,
      rows: reportRows,
      totals: {
        debit: Number(totalDebit.toFixed(2)),
        credit: Number(totalCredit.toFixed(2))
      },
      closingBalance: Number((totalCredit - totalDebit).toFixed(2))
    })
  } catch (error) {
    console.error('Bank analysis report error:', error)
    return res.status(500).json({ message: 'Unable to load bank analysis report.' })
  }
})

const nypSchema = z.object({
  fullName: z.string().min(1),
  nypId: z.string().min(1),
  year: z.number().int().optional(),
  month: z.number().int().min(1).max(12).optional(),
  date: z.coerce.date().optional()
})


const cashSaleItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  rate: z.enum(['Carton', 'Half Ctn', 'Quarter Ctn', 'Unit']),
  qty: z.coerce.number().finite().positive(),
  discount: z.coerce.number().finite().nonnegative().default(0)
})

const cashSaleSchema = z.object({
  companyId: z.string().trim().min(1),
  customerName: z.string().trim().min(1).max(160),
  salesStaff: z.string().trim().min(1).max(120),
  saleDate: z.coerce.date().optional(),
  items: z.array(cashSaleItemSchema).min(1)
})

const nypSaleSchema = z.object({
  nypCustomerId: z.coerce.number().int().positive(),
  salesStaff: z.string().trim().min(1).max(120),
  saleDate: z.coerce.date().optional(),
  items: z.array(cashSaleItemSchema).min(1)
})

const cashSaleRateMultiplier = (rate: string, ctnSize: number) => {
  if (rate === 'Carton') return ctnSize
  if (rate === 'Half Ctn') return ctnSize / 2
  if (rate === 'Quarter Ctn') return ctnSize / 4
  return 1
}

const nextCashSaleInvoiceNo = async (tx: any) => {
  const latest = await tx.cashSale.findFirst({
    where: { invoiceNo: { startsWith: 'CS-' } },
    orderBy: { id: 'desc' },
    select: { invoiceNo: true }
  })
  const match = String(latest?.invoiceNo || '').match(/^CS-(\d+)$/)
  const next = match ? Number(match[1]) + 1 : 1
  return `CS-${String(next).padStart(4, '0')}`
}

const nextNypSaleInvoiceNo = async (tx: any) => {
  const latest = await tx.nypSale.findFirst({
    where: { invoiceNo: { startsWith: 'NYP-' } },
    orderBy: { id: 'desc' },
    select: { invoiceNo: true }
  })
  const match = String(latest?.invoiceNo || '').match(/^NYP-(\d+)$/)
  const next = match ? Number(match[1]) + 1 : 1
  return `NYP-${String(next).padStart(4, '0')}`
}

app.post('/api/cashsales', ...requireManagement, async (req, res) => {
  const parsed = cashSaleSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Customer, sales staff and at least one valid CashSales item are required.', errors: parsed.error.flatten() })
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.findUnique({
        where: { companyId: parsed.data.companyId },
       include: {
  products: {
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      stockName: true,
      ctnSize: true,
      ctnSellingPrice: true,
      halfCtnSelling: true,
      qrtSellingPrice: true,
      unitSellingPrice: true
    }
  }
}
      })
      if (!company) {
        const error = new Error('Selected stock company was not found.')
        ;(error as any).statusCode = 404
        throw error
      }

      const productMap = new Map(company.products.map((product: any) => [product.id, product]))
      const uniqueProductIds = [...new Set(parsed.data.items.map(item => item.productId))]
      const invalidProductId = uniqueProductIds.find(id => !productMap.has(id))
      if (invalidProductId) {
        const error = new Error('One or more selected stock items do not belong to the selected company.')
        ;(error as any).statusCode = 400
        throw error
      }

      const [soldLines, nypSoldLines] = await Promise.all([
        tx.cashSaleLine.findMany({
          where: { productId: { in: uniqueProductIds } },
          select: { productId: true, quantity: true }
        }),
        tx.nypSaleLine.findMany({
          where: { productId: { in: uniqueProductIds } },
          select: { productId: true, quantity: true }
        })
      ])

      const soldByProduct = new Map<number, number>()
      for (const line of [...soldLines, ...nypSoldLines]) {
        soldByProduct.set(
          line.productId,
          (soldByProduct.get(line.productId) || 0) + Number(line.quantity || 0)
        )
      }

      const stockBalance = await getStockBalances(company.id)
      const preparedItems = parsed.data.items.map(item => {
        const product = productMap.get(item.productId) as any
        const ctnSize = Number(product.ctnSize || 0)
        if (item.rate !== 'Unit' && ctnSize <= 0) {
          const error = new Error(`Stock item ${product.stockName} does not have a valid carton size.`)
          ;(error as any).statusCode = 400
          throw error
        }
        const baseQty = item.qty * cashSaleRateMultiplier(item.rate, ctnSize)
        const unitPrice = item.rate === 'Carton'
          ? 0
          : item.rate === 'Half Ctn'
            ? 0
            : item.rate === 'Quarter Ctn'
              ? 0
              : 0
        return { ...item, product, ctnSize, baseQty, unitPrice }
      })

      const requestedByProduct = new Map<number, number>()
      for (const item of preparedItems) {
        requestedByProduct.set(item.productId, (requestedByProduct.get(item.productId) || 0) + item.baseQty)
      }

      for (const [productId, requested] of requestedByProduct) {
        const product = productMap.get(productId) as any
        const balance = stockBalance.get(productId) || { ctnQty: 0, unitQty: 0 }
        const rawAvailable = Number(balance.ctnQty || 0) * Number(product.ctnSize || 0) + Number(balance.unitQty || 0)
        const alreadySold = soldByProduct.get(productId) || 0
        const available = rawAvailable - alreadySold
        if (requested > available + 0.000001) {
          const error = new Error(`Insufficient stock for ${product.stockName}. Available: ${available.toFixed(2)} base unit(s).`)
          ;(error as any).statusCode = 400
          throw error
        }
      }

      const itemsWithPrices = preparedItems.map(item => {
        const product = item.product as any
        const unitPrice = item.rate === 'Carton'
          ? Number(product.ctnSellingPrice || 0)
          : item.rate === 'Half Ctn'
            ? Number(product.halfCtnSelling || 0)
            : item.rate === 'Quarter Ctn'
              ? Number(product.qrtSellingPrice || 0)
              : Number(product.unitSellingPrice || 0)
        const lineTotal = Math.max(0, (item.qty * unitPrice) - item.discount)
        return { ...item, unitPrice, lineTotal }
      })

      const totalAmount = Number(itemsWithPrices.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2))
      if (totalAmount <= 0) {
        const error = new Error('CashSales total must be greater than zero.')
        ;(error as any).statusCode = 400
        throw error
      }

      const invoiceNo = await nextCashSaleInvoiceNo(tx)
      const sale = await tx.cashSale.create({
        data: {
          invoiceNo,
          saleDate: parsed.data.saleDate || new Date(),
          saleType: 'CASH',
          customerName: parsed.data.customerName,
          salesStaff: parsed.data.salesStaff,
          totalAmount,
          paidAmount: 0,
          balance: totalAmount,
          lines: {
            create: itemsWithPrices.map(item => ({
              productId: item.productId,
              quantity: item.baseQty,
              saleQty: item.qty,
              rate: item.rate,
              unitPrice: item.unitPrice,
              discount: item.discount,
              lineTotal: item.lineTotal
            }))
          }
        },
        include: { lines: { include: { product: { select: { stockName: true } } } } }
      })

      const auth = res.locals.auth as { id: number }
      await tx.auditLog.create({
        data: {
          adminId: auth.id,
          action: 'CREATE_CASHSALES',
          entity: 'CashSale',
          entityId: String(sale.id),
          details: { invoiceNo, customerName: parsed.data.customerName, salesStaff: parsed.data.salesStaff, totalAmount } as any
        }
      })

      return sale
    })

    res.status(201).json({
      message: 'CashSales submitted successfully and sent to CashSales Payment.',
      sale: {
        id: result.id,
        invoiceNo: result.invoiceNo,
        saleDate: result.saleDate,
        customerName: result.customerName,
        salesStaff: result.salesStaff,
        totalAmount: Number(result.totalAmount),
        paidAmount: Number(result.paidAmount),
        balance: Number(result.balance)
      }
    })
  } catch (error: any) {
    console.error('CashSales create error:', error)
    const statusCode = Number(error?.statusCode) || 500
    res.status(statusCode).json({ message: statusCode === 500 ? 'Unable to submit CashSales.' : error.message })
  }
})

app.get('/api/cashier/cashsales-reprint', ...requireCashier, async (req, res) => {
  const invoiceNo = String(req.query.refNo || '').trim()

  if (!invoiceNo) {
    return res.status(400).json({ message: 'A CashSales reference number is required.' })
  }

  try {
    const sale = await prisma.cashSale.findFirst({
      where: {
        invoiceNo,
        balance: { lte: 0.005 }
      },
      include: {
        lines: {
          include: {
            product: { select: { stockName: true } }
          },
          orderBy: { id: 'asc' }
        },
        payments: {
          include: {
            cashier: {
              select: {
                displayName: true,
                username: true
              }
            }
          },
          orderBy: { paymentDate: 'asc' }
        }
      }
    })

    if (!sale) {
      return res.status(404).json({
        message: 'Paid CashSales transaction was not found for that reference number.'
      })
    }

    const payments = sale.payments.map(payment => ({
      id: payment.id,
      amount: Number(payment.amount || 0),
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate,
      cashierName:
        payment.cashier?.displayName ||
        payment.cashier?.username ||
        null
    }))

    const transferAmount = payments
      .filter(payment => payment.paymentMethod === 'TRANSFER')
      .reduce((sum, payment) => sum + payment.amount, 0)

    const posAmount = payments
      .filter(payment => payment.paymentMethod === 'POS')
      .reduce((sum, payment) => sum + payment.amount, 0)

    const cashAmount = payments
      .filter(payment => payment.paymentMethod === 'CASH')
      .reduce((sum, payment) => sum + payment.amount, 0)

    const lastPayment = sale.payments[sale.payments.length - 1]

    const cashierName =
      lastPayment?.cashier?.displayName ||
      lastPayment?.cashier?.username ||
      null

    res.json({
      receipt: {
        id: sale.id,
        invoiceNo: sale.invoiceNo,
        saleDate: sale.saleDate,
        paymentDate: lastPayment?.paymentDate || sale.saleDate,
        customerName: sale.customerName,
        salesStaff: sale.salesStaff,
        cashierName,
        totalAmount: Number(sale.totalAmount || 0),
        totalPaid: Number(sale.paidAmount || 0),
        balance: Number(sale.balance || 0),
        transferAmount,
        posAmount,
        cashAmount,
        lines: sale.lines.map(line => ({
          id: line.id,
          stockName: line.product.stockName,
          quantity: Number(line.saleQty || line.quantity || 0),
          rate: line.rate,
          unitPrice: Number(line.unitPrice || 0),
          discount: Number(line.discount || 0),
          lineTotal: Number(line.lineTotal || 0)
        }))
      }
    })
  } catch (error) {
    console.error('CashSales reprint lookup error:', error)
    res.status(500).json({
      message: 'Unable to load CashSales reprint record.'
    })
  }
})

app.get('/api/nyp', ...requireManagement, async (_req, res) => {
  const customers = await prisma.nypCustomer.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { id: 'asc' }
  })
  res.json(customers)
})

app.post('/api/nyp', ...requireManagement, async (req, res) => {
  const parsed = nypSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid NYP details', errors: parsed.error.flatten() })
  }

  try {
    const customer = await prisma.nypCustomer.create({ data: parsed.data })
    res.status(201).json(customer)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'NYP ID already exists' })
    }
    res.status(500).json({ message: 'Unable to create NYP customer' })
  }
})


app.post('/api/nyp/sales', ...requireManagement, async (req, res) => {
  const parsed = nypSaleSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      message: 'NYP customer, sales staff and at least one valid supply item are required.',
      errors: parsed.error.flatten()
    })
  }

  const auth = res.locals.auth as {
    id: number
    username: string
    displayName: string | null
    role: 'OGA' | 'MANAGER' | 'CASHIER'
  }

  // Only OGA may credit an NYP sale to another staff member.
  // For all other management users, use the authenticated account name.
  const authenticatedStaff = String(
    auth.displayName || auth.username || ''
  ).trim()

  if (auth.role !== 'OGA') {
    if (!authenticatedStaff) {
      return res.status(400).json({
        message: 'Your account does not have a valid staff name.'
      })
    }
    parsed.data.salesStaff = authenticatedStaff
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.nypCustomer.findFirst({
        where: { id: parsed.data.nypCustomerId, status: 'ACTIVE' }
      })

      if (!customer) {
        const error = new Error('Selected NYP customer was not found or is inactive.')
        ;(error as any).statusCode = 404
        throw error
      }

      const uniqueProductIds = [...new Set(parsed.data.items.map(item => item.productId))]
      const products = await tx.product.findMany({
        where: { id: { in: uniqueProductIds }, status: 'ACTIVE' },
        select: {
          id: true,
          companyId: true,
          stockName: true,
          ctnSize: true,
          ctnSellingPrice: true,
          halfCtnSelling: true,
          qrtSellingPrice: true,
          unitSellingPrice: true
        }
      })

      const productMap = new Map(products.map(product => [product.id, product]))
      const invalidProductId = uniqueProductIds.find(id => !productMap.has(id))
      if (invalidProductId) {
        const error = new Error('One or more selected stock items are unavailable.')
        ;(error as any).statusCode = 400
        throw error
      }

      const [cashSoldLines, nypSoldLines] = await Promise.all([
        tx.cashSaleLine.findMany({
          where: { productId: { in: uniqueProductIds } },
          select: { productId: true, quantity: true }
        }),
        tx.nypSaleLine.findMany({
          where: { productId: { in: uniqueProductIds } },
          select: { productId: true, quantity: true }
        })
      ])

      const soldByProduct = new Map<number, number>()
      for (const line of [...cashSoldLines, ...nypSoldLines]) {
        soldByProduct.set(
          line.productId,
          (soldByProduct.get(line.productId) || 0) + Number(line.quantity || 0)
        )
      }

      const companyIds = [...new Set(products.map(product => product.companyId))]
      const stockBalances = new Map<number, Map<number, { ctnQty: number; unitQty: number }>>()
      for (const companyId of companyIds) {
        stockBalances.set(companyId, await getStockBalances(companyId))
      }

      const preparedItems = parsed.data.items.map(item => {
        const product = productMap.get(item.productId) as any
        const ctnSize = Number(product.ctnSize || 0)

        if (item.rate !== 'Unit' && ctnSize <= 0) {
          const error = new Error(`Stock item ${product.stockName} does not have a valid carton size.`)
          ;(error as any).statusCode = 400
          throw error
        }

        const baseQty = item.qty * cashSaleRateMultiplier(item.rate, ctnSize)
        const unitPrice = item.rate === 'Carton'
          ? Number(product.ctnSellingPrice || 0)
          : item.rate === 'Half Ctn'
            ? Number(product.halfCtnSelling || 0)
            : item.rate === 'Quarter Ctn'
              ? Number(product.qrtSellingPrice || 0)
              : Number(product.unitSellingPrice || 0)

        const lineTotal = Number(Math.max(0, item.qty * unitPrice - item.discount).toFixed(2))
        return { ...item, product, baseQty, unitPrice, lineTotal }
      })

      const requestedByProduct = new Map<number, number>()
      for (const item of preparedItems) {
        requestedByProduct.set(
          item.productId,
          (requestedByProduct.get(item.productId) || 0) + item.baseQty
        )
      }

      for (const [productId, requested] of requestedByProduct) {
        const product = productMap.get(productId) as any
        const balance = stockBalances.get(product.companyId)?.get(productId) || { ctnQty: 0, unitQty: 0 }
        const rawAvailable =
          Number(balance.ctnQty || 0) * Number(product.ctnSize || 0) +
          Number(balance.unitQty || 0)
        const available = rawAvailable - (soldByProduct.get(productId) || 0)

        if (requested > available + 0.000001) {
          const error = new Error(
            `Insufficient stock for ${product.stockName}. Available: ${available.toFixed(2)} base unit(s).`
          )
          ;(error as any).statusCode = 400
          throw error
        }
      }

      const totalAmount = Number(
        preparedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)
      )

      if (totalAmount <= 0) {
        const error = new Error('NYP supply total must be greater than zero.')
        ;(error as any).statusCode = 400
        throw error
      }

      const invoiceNo = await nextNypSaleInvoiceNo(tx)
      const sale = await tx.nypSale.create({
        data: {
          invoiceNo,
          nypCustomerId: customer.id,
          saleDate: parsed.data.saleDate || new Date(),
          totalAmount,
          lines: {
            create: preparedItems.map(item => ({
              productId: item.productId,
              quantity: item.baseQty,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal
            }))
          }
        },
        include: {
          nypCustomer: {
            select: { id: true, nypId: true, fullName: true }
          },
          lines: {
            include: { product: { select: { stockName: true } } },
            orderBy: { id: 'asc' }
          }
        }
      })

      await tx.nypCustomer.update({
        where: { id: customer.id },
        data: {
          totalSupplied: { increment: totalAmount },
          balance: { increment: totalAmount }
        }
      })

      const auth = res.locals.auth as { id: number }
      await tx.auditLog.create({
        data: {
          adminId: auth.id,
          action: 'CREATE_NYP_SALE',
          entity: 'NypSale',
          entityId: String(sale.id),
          details: {
            invoiceNo,
            nypCustomerId: customer.id,
            nypId: customer.nypId,
            customerName: customer.fullName,
            salesStaff: parsed.data.salesStaff,
            totalAmount
          } as any
        }
      })

      return sale
    })

    res.status(201).json({
      message: 'NYP supply submitted successfully and added to the customer credit account.',
      sale: {
        id: result.id,
        invoiceNo: result.invoiceNo,
        saleDate: result.saleDate,
        nypCustomer: result.nypCustomer,
        totalAmount: Number(result.totalAmount),
        lines: result.lines.map(line => ({
          id: line.id,
          stockName: line.product.stockName,
          quantity: Number(line.quantity),
          unitPrice: Number(line.unitPrice),
          lineTotal: Number(line.lineTotal)
        }))
      }
    })
  } catch (error: any) {
    console.error('NYP supply create error:', error)
    const statusCode = Number(error?.statusCode) || 500
    res.status(statusCode).json({
      message: statusCode === 500 ? 'Unable to submit NYP supply.' : error.message
    })
  }
})

app.get('/api/nyp/account-history', ...requireManagement, async (req, res) => {
  const nypId = String(req.query.nypId || '').trim()
  const date = String(req.query.date || '').trim()

  if (!nypId || !date) {
    return res.status(400).json({ message: 'NYP ID and date are required.' })
  }

  const parsedDate = new Date(`${date}T23:59:59.999`)
  if (Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date.' })
  }

  try {
    const customer = await prisma.nypCustomer.findFirst({
      where: { nypId, status: 'ACTIVE' },
      select: {
        id: true,
        nypId: true,
        fullName: true,
        totalSupplied: true,
        totalPaid: true,
        balance: true
      }
    })

    if (!customer) {
      return res.status(404).json({ message: 'NYP account not found.' })
    }

    const [sales, payments] = await Promise.all([
      prisma.nypSale.findMany({
        where: { nypCustomerId: customer.id, saleDate: { lte: parsedDate } },
        select: { id: true, invoiceNo: true, saleDate: true, totalAmount: true },
        orderBy: [{ saleDate: 'asc' }, { id: 'asc' }]
      }),
      prisma.nypPayment.findMany({
        where: { nypCustomerId: customer.id, paymentDate: { lte: parsedDate } },
        select: { id: true, reference: true, paymentDate: true, amount: true, paymentMethod: true },
        orderBy: [{ paymentDate: 'asc' }, { id: 'asc' }]
      })
    ])

    const events = [
      ...sales.map((sale) => ({
        id: sale.id,
        date: sale.saleDate,
        ref: sale.invoiceNo,
        description: 'NYP Stock Supply',
        supplyAmount: Number(sale.totalAmount || 0),
        paidAmount: 0
      })),
      ...payments.map((payment) => ({
        id: payment.id,
        date: payment.paymentDate,
        ref: payment.reference || `NYP-PMT-${payment.id}`,
        description: `NYP Payment (${payment.paymentMethod})`,
        supplyAmount: 0,
        paidAmount: Number(payment.amount || 0)
      }))
    ].sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime()
      return dateDiff || a.id - b.id
    })

    let runningBalance = 0

    const rows = events.map((event) => {
      runningBalance += event.supplyAmount - event.paidAmount
      return {
        date: new Date(event.date).toISOString().slice(0, 10),
        ref: event.ref,
        description: event.description,
        supplyAmount: event.supplyAmount,
        returnAmount: 0,
        damageAmount: 0,
        paidAmount: event.paidAmount,
        balance: runningBalance
      }
    })

    return res.json({
      customer,
      asOfDate: date,
      rows,
      totals: {
        supplyAmount: rows.reduce((sum, row) => sum + row.supplyAmount, 0),
        returnAmount: 0,
        damageAmount: 0,
        paidAmount: rows.reduce((sum, row) => sum + row.paidAmount, 0),
        balance: runningBalance
      }
    })
  } catch (error) {
    console.error('NYP account history error:', error)
    return res.status(500).json({ message: 'Unable to load NYP account history.' })
  }
})

app.get('/api/nyp/account-summary', ...requireManagement, async (req, res) => {
  const nypId = String(req.query.nypId || 'ALL NYP ACCOUNTS').trim()
  const date = String(req.query.date || '').trim()

  if (!date) {
    return res.status(400).json({ message: 'Date is required.' })
  }

  const parsedDate = new Date(`${date}T23:59:59.999`)
  if (Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date.' })
  }

  try {
    const customers = await prisma.nypCustomer.findMany({
      where: {
        status: 'ACTIVE',
        ...(nypId && nypId !== 'ALL NYP ACCOUNTS' ? { nypId } : {})
      },
      orderBy: { id: 'asc' }
    })

    const rows = await Promise.all(customers.map(async (customer) => {
      const [salesAggregate, paymentsAggregate] = await Promise.all([
        prisma.nypSale.aggregate({
          where: {
            nypCustomerId: customer.id,
            saleDate: { lte: parsedDate }
          },
          _sum: { totalAmount: true }
        }),
        prisma.nypPayment.aggregate({
          where: {
            nypCustomerId: customer.id,
            paymentDate: { lte: parsedDate }
          },
          _sum: { amount: true }
        })
      ])

      const supplyAmount = Number(salesAggregate._sum.totalAmount || 0)
      const paidAmount = Number(paymentsAggregate._sum.amount || 0)

      return {
        fullName: customer.fullName,
        nypId: customer.nypId,
        supplyAmount,
        returnAmount: 0,
        damageAmount: 0,
        paidAmount,
        balance: supplyAmount - paidAmount
      }
    }))

    return res.json({
      asOfDate: date,
      nypId,
      rows,
      totals: {
        supplyAmount: rows.reduce((sum, row) => sum + row.supplyAmount, 0),
        returnAmount: 0,
        damageAmount: 0,
        paidAmount: rows.reduce((sum, row) => sum + row.paidAmount, 0),
        balance: rows.reduce((sum, row) => sum + row.balance, 0)
      }
    })
  } catch (error) {
    console.error('NYP account summary error:', error)
    return res.status(500).json({ message: 'Unable to load NYP account summary.' })
  }
})

app.get('/api/nyp/debtors', ...requireManagement, async (req, res) => {
  const date = String(req.query.date || '').trim()

  if (!date) {
    return res.status(400).json({ message: 'Date is required.' })
  }

  const parsedDate = new Date(`${date}T23:59:59.999`)
  if (Number.isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: 'Invalid date.' })
  }

  try {
    const customers = await prisma.nypCustomer.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { id: 'asc' }
    })

    const allRows = await Promise.all(customers.map(async (customer) => {
      const [salesAggregate, paymentsAggregate] = await Promise.all([
        prisma.nypSale.aggregate({
          where: {
            nypCustomerId: customer.id,
            saleDate: { lte: parsedDate }
          },
          _sum: { totalAmount: true }
        }),
        prisma.nypPayment.aggregate({
          where: {
            nypCustomerId: customer.id,
            paymentDate: { lte: parsedDate }
          },
          _sum: { amount: true }
        })
      ])

      const supplyAmount = Number(salesAggregate._sum.totalAmount || 0)
      const paidAmount = Number(paymentsAggregate._sum.amount || 0)
      const balance = supplyAmount - paidAmount

      return {
        fullName: customer.fullName,
        nypId: customer.nypId,
        supplyAmount,
        returnAmount: 0,
        damageAmount: 0,
        paidAmount,
        balance
      }
    }))

    const rows = allRows
      .filter((row) => row.balance > 0)
      .sort((a, b) => b.balance - a.balance)

    return res.json({
      asOfDate: date,
      rows,
      totals: {
        debtors: rows.length,
        supplyAmount: rows.reduce((sum, row) => sum + row.supplyAmount, 0),
        returnAmount: 0,
        damageAmount: 0,
        paidAmount: rows.reduce((sum, row) => sum + row.paidAmount, 0),
        balance: rows.reduce((sum, row) => sum + row.balance, 0)
      }
    })
  } catch (error) {
    console.error('NYP debtors report error:', error)
    return res.status(500).json({ message: 'Unable to load NYP debtors report.' })
  }
})


app.get('/api/company/account-history', ...requireManagement, async (req, res) => {
  const companyId = String(req.query.companyId || '').trim()
  const date = String(req.query.date || '').trim()

  if (!companyId || !date) return res.status(400).json({ message: 'Company ID and date are required.' })

  const parsedDate = new Date(`${date}T23:59:59.999`)
  if (Number.isNaN(parsedDate.getTime())) return res.status(400).json({ message: 'Invalid date.' })

  try {
    const company = await prisma.company.findFirst({
      where: { companyId, status: 'ACTIVE' },
      select: { id: true, companyId: true, companyName: true }
    })

    if (!company) return res.status(404).json({ message: 'Company not found.' })

    const [purchases, payments] = await Promise.all([
      prisma.companyPurchase.findMany({
        where: { companyId: company.id, purchaseDate: { lte: parsedDate } },
        select: { id: true, invoiceNo: true, purchaseDate: true, totalAmount: true },
        orderBy: [{ purchaseDate: 'asc' }, { id: 'asc' }]
      }),
      prisma.companyPayment.findMany({
        where: { companyId: company.id, paymentDate: { lte: parsedDate } },
        select: { id: true, reference: true, paymentDate: true, amount: true, paymentMethod: true, note: true },
        orderBy: [{ paymentDate: 'asc' }, { id: 'asc' }]
      })
    ])

    const events = [
      ...purchases.map(p => ({
        id: p.id,
        date: p.purchaseDate,
        ref: p.invoiceNo || `PURCHASE-${p.id}`,
        description: 'Company Stock Supply',
        supplyAmount: Number(p.totalAmount || 0),
        paidAmount: 0
      })),
      ...payments.map(p => ({
        id: p.id,
        date: p.paymentDate,
        ref: p.reference || `PAYMENT-${p.id}`,
        description: `Payment To Company (${p.paymentMethod})`,
        supplyAmount: 0,
        paidAmount: Number(p.amount || 0)
      }))
    ].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
      return diff || a.id - b.id
    })

    let balance = 0
    const rows = events.map(event => {
      balance += event.supplyAmount - event.paidAmount
      return {
        date: new Date(event.date).toISOString().slice(0, 10),
        ref: event.ref,
        description: event.description,
        supplyAmount: event.supplyAmount,
        paidAmount: event.paidAmount,
        balance
      }
    })

    return res.json({
      company,
      asOfDate: date,
      rows,
      totals: {
        supplyAmount: rows.reduce((s, r) => s + r.supplyAmount, 0),
        paidAmount: rows.reduce((s, r) => s + r.paidAmount, 0),
        balance
      }
    })
  } catch (error) {
    console.error('Company account history error:', error)
    return res.status(500).json({ message: 'Unable to load company account history.' })
  }
})

app.get('/api/company/account-summary', ...requireManagement, async (req, res) => {
  const companyId = String(req.query.companyId || 'ALL COMPANIES').trim()
  const date = String(req.query.date || '').trim()

  if (!date) return res.status(400).json({ message: 'Date is required.' })

  const parsedDate = new Date(`${date}T23:59:59.999`)
  if (Number.isNaN(parsedDate.getTime())) return res.status(400).json({ message: 'Invalid date.' })

  try {
    const companies = await prisma.company.findMany({
      where: {
        status: 'ACTIVE',
        ...(companyId !== 'ALL COMPANIES' ? { companyId } : {})
      },
      orderBy: { id: 'asc' }
    })

    const rows = await Promise.all(companies.map(async company => {
      const [purchaseAgg, paymentAgg] = await Promise.all([
        prisma.companyPurchase.aggregate({
          where: { companyId: company.id, purchaseDate: { lte: parsedDate } },
          _sum: { totalAmount: true }
        }),
        prisma.companyPayment.aggregate({
          where: { companyId: company.id, paymentDate: { lte: parsedDate } },
          _sum: { amount: true }
        })
      ])

      const supplyAmount = Number(purchaseAgg._sum.totalAmount || 0)
      const paidAmount = Number(paymentAgg._sum.amount || 0)

      return {
        companyId: company.companyId,
        companyName: company.companyName,
        supplyAmount,
        paidAmount,
        balance: supplyAmount - paidAmount
      }
    }))

    return res.json({
      asOfDate: date,
      companyId,
      rows,
      totals: {
        supplyAmount: rows.reduce((s, r) => s + r.supplyAmount, 0),
        paidAmount: rows.reduce((s, r) => s + r.paidAmount, 0),
        balance: rows.reduce((s, r) => s + r.balance, 0)
      }
    })
  } catch (error) {
    console.error('Company account summary error:', error)
    return res.status(500).json({ message: 'Unable to load company account summary.' })
  }
})

app.get('/api/company/creditors', ...requireManagement, async (req, res) => {
  const date = String(req.query.date || '').trim()

  if (!date) return res.status(400).json({ message: 'Date is required.' })

  const parsedDate = new Date(`${date}T23:59:59.999`)
  if (Number.isNaN(parsedDate.getTime())) return res.status(400).json({ message: 'Invalid date.' })

  try {
    const companies = await prisma.company.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { id: 'asc' }
    })

    const allRows = await Promise.all(companies.map(async company => {
      const [purchaseAgg, paymentAgg] = await Promise.all([
        prisma.companyPurchase.aggregate({
          where: { companyId: company.id, purchaseDate: { lte: parsedDate } },
          _sum: { totalAmount: true }
        }),
        prisma.companyPayment.aggregate({
          where: { companyId: company.id, paymentDate: { lte: parsedDate } },
          _sum: { amount: true }
        })
      ])

      const supplyAmount = Number(purchaseAgg._sum.totalAmount || 0)
      const paidAmount = Number(paymentAgg._sum.amount || 0)
      const balance = supplyAmount - paidAmount

      return {
        companyId: company.companyId,
        companyName: company.companyName,
        supplyAmount,
        paidAmount,
        balance
      }
    }))

    const rows = allRows.filter(r => r.balance > 0).sort((a, b) => b.balance - a.balance)

    return res.json({
      asOfDate: date,
      rows,
      totals: {
        creditors: rows.length,
        supplyAmount: rows.reduce((s, r) => s + r.supplyAmount, 0),
        paidAmount: rows.reduce((s, r) => s + r.paidAmount, 0),
        balance: rows.reduce((s, r) => s + r.balance, 0)
      }
    })
  } catch (error) {
    console.error('Company creditors report error:', error)
    return res.status(500).json({ message: 'Unable to load company creditors report.' })
  }
})

app.get('/api/companies', ...requireManagement, async (_req, res) => {
  const companies = await prisma.company.findMany({
    where: { status: 'ACTIVE' },
    include: { products: { where: { status: 'ACTIVE' }, orderBy: { id: 'asc' } } },
    orderBy: { id: 'asc' }
  })
  res.json(companies)
})

const productSchema = z.object({
  stockName: z.string().min(1),
  ctnSize: z.coerce.number().nonnegative(),
  ctnCostPrice: z.coerce.number().nonnegative(),
  ctnSellingPrice: z.coerce.number().nonnegative(),
  halfCtnSelling: z.coerce.number().nonnegative().default(0),
  qrtSellingPrice: z.coerce.number().nonnegative().default(0),
  unitSellingPrice: z.coerce.number().nonnegative().default(0)
})

const companySchema = z.object({
  companyId: z.string().min(1),
  companyName: z.string().min(1),
  year: z.number().int().optional(),
  month: z.number().int().min(1).max(12).optional(),
  date: z.coerce.date().optional(),
  products: z.array(productSchema).default([])
})

app.post('/api/companies', ...requireManagement, async (req, res) => {
  const parsed = companySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid company details', errors: parsed.error.flatten() })
  }

  try {
    const company = await prisma.company.create({
      data: {
        companyId: parsed.data.companyId,
        companyName: parsed.data.companyName,
        year: parsed.data.year,
        month: parsed.data.month,
        date: parsed.data.date,
        products: { create: parsed.data.products }
      },
      include: { products: true }
    })
    res.status(201).json(company)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Company ID already exists' })
    }
    res.status(500).json({ message: 'Unable to create company' })
  }
})

app.put('/api/companies/:id', ...requireManagement, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid company id' })
  }

  const parsed = companySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid company details',
      errors: parsed.error.flatten()
    })
  }

  try {
    const company = await prisma.$transaction(async (tx) => {
      const existing = await tx.company.findUnique({
        where: { id },
        include: { products: true }
      })

      if (!existing) {
        return null
      }

      await tx.product.updateMany({
        where: {
          companyId: id,
          status: 'ACTIVE'
        },
        data: {
          status: 'INACTIVE'
        }
      })

      return tx.company.update({
        where: { id },
        data: {
          companyId: parsed.data.companyId,
          companyName: parsed.data.companyName,
          year: parsed.data.year,
          month: parsed.data.month,
          date: parsed.data.date,
          products: {
            create: parsed.data.products
          }
        },
        include: {
          products: {
            where: { status: 'ACTIVE' },
            orderBy: { id: 'asc' }
          }
        }
      })
    })

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    res.json(company)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Company ID already exists' })
    }

    res.status(500).json({ message: 'Unable to update company' })
  }
})

app.get('/api/companies/:id', ...requireManagement, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid company id' })

  const company = await prisma.company.findUnique({
    where: { id },
    include: { products: { where: { status: 'ACTIVE' }, orderBy: { id: 'asc' } } }
  })

  if (!company) return res.status(404).json({ message: 'Company not found' })
  res.json(company)
})


const stockBinCardQuerySchema = z.object({
  companyId: z.string().min(1),
  productId: z.coerce.number().int().positive(),
  date: z.coerce.date().optional()
})

app.get('/api/stock-bin-card', ...requireManagement, async (req, res) => {
  const parsed = stockBinCardQuerySchema.safeParse({
    companyId: String(req.query.companyId || '').trim(),
    productId: req.query.productId,
    date: req.query.date || undefined
  })

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Company ID and Product ID are required',
      errors: parsed.error.flatten()
    })
  }

  const { companyId, productId } = parsed.data
  const reportDate = parsed.data.date || new Date()
  const reportDateText = reportDate.toISOString().slice(0, 10)

  try {
    const company = await prisma.company.findUnique({
      where: { companyId },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          orderBy: { id: 'asc' }
        }
      }
    })

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const product = company.products.find((item) => item.id === productId)

    if (!product) {
      return res.status(404).json({ message: 'Product not found for selected company' })
    }

    const purchaseRows = await prisma.$queryRaw<Array<{
      id: number
      refNo: string
      date: string | null
      addedCtnQty: number
      addedUnitQty: number
      createdAt: Date
    }>>`
      SELECT
        "id" AS "id",
        "ref_no" AS "refNo",
        "date" AS "date",
        "added_ctn_qty"::float8 AS "addedCtnQty",
        "added_unit_qty"::float8 AS "addedUnitQty",
        "created_at" AS "createdAt"
      FROM "stock_purchases"
      WHERE "company_id" = ${company.id}
        AND "product_id" = ${productId}
        AND ("date" IS NULL OR "date" <= ${reportDateText}::date)
      ORDER BY COALESCE("date", "created_at") ASC, "id" ASC
    `

    const openingRows = await prisma.$queryRaw<Array<{
      id: number
      refNo: string
      date: string | null
      addedCtnQty: number
      addedUnitQty: number
      createdAt: Date
    }>>`
      SELECT
        "id" AS "id",
        "ref_no" AS "refNo",
        "date" AS "date",
        "added_ctn_qty"::float8 AS "addedCtnQty",
        "added_unit_qty"::float8 AS "addedUnitQty",
        "created_at" AS "createdAt"
      FROM "open_stock_purchases"
      WHERE "company_id" = ${company.id}
        AND "product_id" = ${productId}
        AND ("date" IS NULL OR "date" <= ${reportDateText}::date)
      ORDER BY COALESCE("date", "created_at") ASC, "id" ASC
    `

    const adjustmentRows = await prisma.$queryRaw<Array<{
      id: number
      refNo: string
      date: string | null
      addedCtnQty: number
      addedUnitQty: number
      createdAt: Date
    }>>`
      SELECT
        "id" AS "id",
        "ref_no" AS "refNo",
        "date" AS "date",
        "added_ctn_qty"::float8 AS "addedCtnQty",
        "added_unit_qty"::float8 AS "addedUnitQty",
        "created_at" AS "createdAt"
      FROM "stock_adjustments"
      WHERE "company_id" = ${company.id}
        AND "product_id" = ${productId}
        AND ("date" IS NULL OR "date" <= ${reportDateText}::date)
      ORDER BY COALESCE("date", "created_at") ASC, "id" ASC
    `

    const reportEnd = new Date(`${reportDateText}T23:59:59.999Z`)

    const [cashSaleLines, nypSaleLines] = await Promise.all([
      prisma.cashSaleLine.findMany({
        where: {
          productId,
          sale: {
            saleDate: { lte: reportEnd }
          }
        },
        include: {
          sale: {
            select: {
              invoiceNo: true,
              saleDate: true
            }
          }
        },
        orderBy: { id: 'asc' }
      }),
      prisma.nypSaleLine.findMany({
        where: {
          productId,
          sale: {
            saleDate: { lte: reportEnd }
          }
        },
        include: {
          sale: {
            select: {
              invoiceNo: true,
              saleDate: true
            }
          }
        },
        orderBy: { id: 'asc' }
      })
    ])

    const ctnSize = Number(product.ctnSize || 0)
    const unitCost = ctnSize > 0 ? Number(product.ctnCostPrice || 0) / ctnSize : 0

    const toNumber = (value: unknown) => Number(value || 0)

    const movementDate = (value: string | Date | null | undefined) => {
      if (!value) return reportDateText
      return value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10)
    }

    const movements: Array<{
      sortDate: string
      sortId: number
      date: string
      refNo: string
      description: string
      packSize: number
      receivedCtn: number
      receivedUnit: number
      issuedCtn: number
      issuedUnit: number
      damagedCtn: number
      damagedUnit: number
      returnedCtn: number
      returnedUnit: number
      amount: number
    }> = []

    purchaseRows.forEach((row) => {
      const ctn = toNumber(row.addedCtnQty)
      const unit = toNumber(row.addedUnitQty)
      movements.push({
        sortDate: movementDate(row.date || row.createdAt),
        sortId: row.id,
        date: movementDate(row.date || row.createdAt),
        refNo: row.refNo,
        description: 'Stock Purchase',
        packSize: ctnSize,
        receivedCtn: ctn,
        receivedUnit: unit,
        issuedCtn: 0,
        issuedUnit: 0,
        damagedCtn: 0,
        damagedUnit: 0,
        returnedCtn: 0,
        returnedUnit: 0,
        amount: (ctn * Number(product.ctnCostPrice || 0)) + (unit * unitCost)
      })
    })

    openingRows.forEach((row) => {
      const ctn = toNumber(row.addedCtnQty)
      const unit = toNumber(row.addedUnitQty)
      movements.push({
        sortDate: movementDate(row.date || row.createdAt),
        sortId: 1000000 + row.id,
        date: movementDate(row.date || row.createdAt),
        refNo: row.refNo,
        description: 'Opening Stock',
        packSize: ctnSize,
        receivedCtn: ctn,
        receivedUnit: unit,
        issuedCtn: 0,
        issuedUnit: 0,
        damagedCtn: 0,
        damagedUnit: 0,
        returnedCtn: 0,
        returnedUnit: 0,
        amount: (ctn * Number(product.ctnCostPrice || 0)) + (unit * unitCost)
      })
    })

    adjustmentRows.forEach((row) => {
      const ctn = toNumber(row.addedCtnQty)
      const unit = toNumber(row.addedUnitQty)
      movements.push({
        sortDate: movementDate(row.date || row.createdAt),
        sortId: 2000000 + row.id,
        date: movementDate(row.date || row.createdAt),
        refNo: row.refNo,
        description: 'Stock Adjustment',
        packSize: ctnSize,
        receivedCtn: ctn,
        receivedUnit: unit,
        issuedCtn: 0,
        issuedUnit: 0,
        damagedCtn: 0,
        damagedUnit: 0,
        returnedCtn: 0,
        returnedUnit: 0,
        amount: (ctn * Number(product.ctnCostPrice || 0)) + (unit * unitCost)
      })
    })

    cashSaleLines.forEach((line) => {
      const quantity = toNumber(line.quantity)
      const ctn = ctnSize > 0 ? Math.floor(quantity / ctnSize) : 0
      const unit = ctnSize > 0 ? quantity - (ctn * ctnSize) : quantity
      movements.push({
        sortDate: movementDate(line.sale.saleDate),
        sortId: 3000000 + line.id,
        date: movementDate(line.sale.saleDate),
        refNo: line.sale.invoiceNo,
        description: 'Cash Sale',
        packSize: ctnSize,
        receivedCtn: 0,
        receivedUnit: 0,
        issuedCtn: ctn,
        issuedUnit: unit,
        damagedCtn: 0,
        damagedUnit: 0,
        returnedCtn: 0,
        returnedUnit: 0,
        amount: toNumber(line.lineTotal)
      })
    })

    nypSaleLines.forEach((line) => {
      const quantity = toNumber(line.quantity)
      const ctn = ctnSize > 0 ? Math.floor(quantity / ctnSize) : 0
      const unit = ctnSize > 0 ? quantity - (ctn * ctnSize) : quantity
      movements.push({
        sortDate: movementDate(line.sale.saleDate),
        sortId: 4000000 + line.id,
        date: movementDate(line.sale.saleDate),
        refNo: line.sale.invoiceNo,
        description: 'NYP Sale',
        packSize: ctnSize,
        receivedCtn: 0,
        receivedUnit: 0,
        issuedCtn: ctn,
        issuedUnit: unit,
        damagedCtn: 0,
        damagedUnit: 0,
        returnedCtn: 0,
        returnedUnit: 0,
        amount: toNumber(line.lineTotal)
      })
    })

    movements.sort((a, b) =>
      a.sortDate.localeCompare(b.sortDate) || a.sortId - b.sortId
    )

    const toBaseUnits = (ctn: number, unit: number) =>
      (ctn * ctnSize) + unit

    const fromBaseUnits = (baseUnits: number) => {
      if (ctnSize <= 0) {
        return { ctn: 0, unit: baseUnits }
      }

      const ctn = Math.floor((baseUnits + 1e-9) / ctnSize)
      const unit = baseUnits - (ctn * ctnSize)

      return { ctn, unit }
    }

    let runningBaseUnits = 0

    const rows = movements.map((movement) => {
      const received = toBaseUnits(movement.receivedCtn, movement.receivedUnit)
      const issued = toBaseUnits(movement.issuedCtn, movement.issuedUnit)
      const damaged = toBaseUnits(movement.damagedCtn, movement.damagedUnit)
      const returned = toBaseUnits(movement.returnedCtn, movement.returnedUnit)

      runningBaseUnits += received - issued - damaged + returned

      const balance = fromBaseUnits(runningBaseUnits)

      return {
        date: movement.date,
        refNo: movement.refNo,
        description: movement.description,
        packSize: movement.packSize,
        stockReceived: {
          ctn: movement.receivedCtn,
          unit: movement.receivedUnit
        },
        stockIssued: {
          ctn: movement.issuedCtn,
          unit: movement.issuedUnit
        },
        stockDamaged: {
          ctn: movement.damagedCtn,
          unit: movement.damagedUnit
        },
        stockReturned: {
          ctn: movement.returnedCtn,
          unit: movement.returnedUnit
        },
        stockBalance: {
          ctn: balance.ctn,
          unit: balance.unit
        },
        amount: movement.amount,
        remark: movement.description
      }
    })

    const finalBalance = fromBaseUnits(runningBaseUnits)

    res.json({
      company: {
        id: company.id,
        companyId: company.companyId,
        companyName: company.companyName
      },
      product: {
        id: product.id,
        stockName: product.stockName,
        ctnSize: product.ctnSize,
        ctnCostPrice: product.ctnCostPrice,
        unitCostPrice: unitCost
      },
      reportDate: reportDateText,
      rows,
      summary: {
        currentStock: finalBalance,
        costValuation:
          (finalBalance.ctn * Number(product.ctnCostPrice || 0)) +
          (finalBalance.unit * unitCost)
      }
    })
  } catch (error) {
    console.error('Stock bin card error:', error)
    res.status(500).json({ message: 'Unable to load stock bin card' })
  }
})

const stockAdjustmentItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  addedCtnQty: z.coerce.number().nonnegative().default(0),
  addedUnitQty: z.coerce.number().nonnegative().default(0)
}).refine(
  (item) => item.addedCtnQty > 0 || item.addedUnitQty > 0,
  { message: 'Each adjustment must contain a quantity' }
)

const stockAdjustmentSchema = z.object({
  companyId: z.string().min(1),
  refNo: z.string().min(1).max(80),
  entryStaff: z.string().min(1).max(120),
  year: z.coerce.number().int().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  date: z.coerce.date().optional(),
  items: z.array(stockAdjustmentItemSchema).min(1)
})

app.get('/api/stock-adjustments', ...requireManagement, async (req, res) => {
  const companyId = String(req.query.companyId || '').trim()

  if (!companyId) {
    return res.status(400).json({ message: 'Company ID is required' })
  }

  try {
    const result = await getStockAdjustmentProducts(companyId)

    if (!result) {
      return res.status(404).json({ message: 'Company not found' })
    }

    res.json({
      company: {
        id: result.company.id,
        companyId: result.company.companyId,
        companyName: result.company.companyName
      },
      products: result.products
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load stock adjustment data' })
  }
})

app.post('/api/stock-adjustments', ...requireManagement, async (req, res) => {
  const parsed = stockAdjustmentSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid stock adjustment',
      errors: parsed.error.flatten()
    })
  }

  const { companyId, refNo, year, month, date, items } = parsed.data
  const auth = res.locals.auth as {
    username: string
    displayName: string | null
  }
  const entryStaff = String(auth.displayName || auth.username).trim()

  if (!entryStaff) {
    return res.status(400).json({
      message: 'Your account does not have a valid staff name.'
    })
  }

  try {
    const company = await prisma.company.findUnique({
      where: { companyId },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          select: { id: true }
        }
      }
    })

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const productIds = [...new Set(items.map((item) => item.productId))]
    const allowedProductIds = new Set(company.products.map((product) => product.id))
    const invalidProductId = productIds.find((id) => !allowedProductIds.has(id))

    if (invalidProductId) {
      return res.status(400).json({ message: 'One or more products do not belong to the selected company' })
    }

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.$executeRaw`
          INSERT INTO "stock_adjustments" (
            "company_id",
            "product_id",
            "ref_no",
            "entry_staff",
            "added_ctn_qty",
            "added_unit_qty",
            "year",
            "month",
            "date"
          )
          VALUES (
            ${company.id},
            ${item.productId},
            ${refNo},
            ${entryStaff},
            ${item.addedCtnQty},
            ${item.addedUnitQty},
            ${year ?? null},
            ${month ?? null},
            ${date ?? null}
          )
        `
      }
    })

    const result = await getStockAdjustmentProducts(companyId)

    res.status(201).json({
      message: 'Stock adjustment saved successfully',
      refNo,
      company: {
        id: company.id,
        companyId: company.companyId,
        companyName: company.companyName
      },
      products: result?.products || []
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Unable to save stock adjustment' })
  }
})

const stockPurchaseItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  addedCtnQty: z.coerce.number().nonnegative().default(0),
  addedUnitQty: z.coerce.number().nonnegative().default(0)
}).refine(
  (item) => item.addedCtnQty > 0 || item.addedUnitQty > 0,
  { message: 'Each purchase must contain a quantity' }
)

const stockPurchaseSchema = z.object({
  companyId: z.string().min(1),
  refNo: z.string().min(1).max(80),
  entryStaff: z.string().min(1).max(120),
  year: z.coerce.number().int().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  date: z.coerce.date().optional(),
  items: z.array(stockPurchaseItemSchema).min(1)
})

app.get('/api/stock-purchases', ...requireManagement, async (req, res) => {
  const companyId = String(req.query.companyId || '').trim()

  if (!companyId) {
    return res.status(400).json({ message: 'Company ID is required' })
  }

  try {
    const result = await getStockPurchaseProducts(companyId)

    if (!result) {
      return res.status(404).json({ message: 'Company not found' })
    }

    res.json({
      company: {
        id: result.company.id,
        companyId: result.company.companyId,
        companyName: result.company.companyName
      },
      products: result.products
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load stock purchase data' })
  }
})

app.post('/api/stock-purchases', ...requireManagement, async (req, res) => {
  const parsed = stockPurchaseSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid stock purchase',
      errors: parsed.error.flatten()
    })
  }

  const { companyId, refNo, year, month, date, items } = parsed.data
  const auth = res.locals.auth as {
    username: string
    displayName: string | null
  }
  const entryStaff = String(auth.displayName || auth.username).trim()

  if (!entryStaff) {
    return res.status(400).json({
      message: 'Your account does not have a valid staff name.'
    })
  }

  try {
    const company = await prisma.company.findUnique({
      where: { companyId },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          select: { id: true }
        }
      }
    })

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const productIds = [...new Set(items.map((item) => item.productId))]
    const allowedProductIds = new Set(company.products.map((product) => product.id))
    const invalidProductId = productIds.find((id) => !allowedProductIds.has(id))

    if (invalidProductId) {
      return res.status(400).json({ message: 'One or more products do not belong to the selected company' })
    }

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.$executeRaw`
          INSERT INTO "stock_purchases" (
            "company_id",
            "product_id",
            "ref_no",
            "entry_staff",
            "added_ctn_qty",
            "added_unit_qty",
            "year",
            "month",
            "date"
          )
          VALUES (
            ${company.id},
            ${item.productId},
            ${refNo},
            ${entryStaff},
            ${item.addedCtnQty},
            ${item.addedUnitQty},
            ${year ?? null},
            ${month ?? null},
            ${date ?? null}
          )
        `
      }
    })

    const result = await getStockPurchaseProducts(companyId)

    res.status(201).json({
      message: 'Stock purchase saved successfully',
      refNo,
      company: {
        id: company.id,
        companyId: company.companyId,
        companyName: company.companyName
      },
      products: result?.products || []
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Unable to save stock purchase' })
  }
})

const openStockPurchaseItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  addedCtnQty: z.coerce.number().nonnegative().default(0),
  addedUnitQty: z.coerce.number().nonnegative().default(0)
}).refine(
  (item) => item.addedCtnQty > 0 || item.addedUnitQty > 0,
  { message: 'Each opening purchase must contain a quantity' }
)

const openStockPurchaseSchema = z.object({
  companyId: z.string().min(1),
  refNo: z.string().min(1).max(80),
  entryStaff: z.string().min(1).max(120),
  year: z.coerce.number().int().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  date: z.coerce.date().optional(),
  items: z.array(openStockPurchaseItemSchema).min(1)
})

app.get('/api/open-stock-purchases', ...requireManagement, async (req, res) => {
  const companyId = String(req.query.companyId || '').trim()

  if (!companyId) {
    return res.status(400).json({ message: 'Company ID is required' })
  }

  try {
    const result = await getStockPurchaseProducts(companyId)

    if (!result) {
      return res.status(404).json({ message: 'Company not found' })
    }

    res.json({
      company: {
        id: result.company.id,
        companyId: result.company.companyId,
        companyName: result.company.companyName
      },
      products: result.products
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Unable to load open stock purchase data' })
  }
})

app.post('/api/open-stock-purchases', ...requireManagement, async (req, res) => {
  const parsed = openStockPurchaseSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid open stock purchase',
      errors: parsed.error.flatten()
    })
  }

  const { companyId, refNo, year, month, date, items } = parsed.data
  const auth = res.locals.auth as {
    username: string
    displayName: string | null
  }
  const entryStaff = String(auth.displayName || auth.username).trim()

  if (!entryStaff) {
    return res.status(400).json({
      message: 'Your account does not have a valid staff name.'
    })
  }

  try {
    const company = await prisma.company.findUnique({
      where: { companyId },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          select: { id: true }
        }
      }
    })

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const productIds = [...new Set(items.map((item) => item.productId))]
    const allowedProductIds = new Set(company.products.map((product) => product.id))
    const invalidProductId = productIds.find((id) => !allowedProductIds.has(id))

    if (invalidProductId) {
      return res.status(400).json({ message: 'One or more products do not belong to the selected company' })
    }

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.$executeRaw`
          INSERT INTO "open_stock_purchases" (
            "company_id",
            "product_id",
            "ref_no",
            "entry_staff",
            "added_ctn_qty",
            "added_unit_qty",
            "year",
            "month",
            "date"
          )
          VALUES (
            ${company.id},
            ${item.productId},
            ${refNo},
            ${entryStaff},
            ${item.addedCtnQty},
            ${item.addedUnitQty},
            ${year ?? null},
            ${month ?? null},
            ${date ?? null}
          )
        `
      }
    })

    const result = await getStockPurchaseProducts(companyId)

    res.status(201).json({
      message: 'Open stock purchase saved successfully',
      refNo,
      company: {
        id: company.id,
        companyId: company.companyId,
        companyName: company.companyName
      },
      products: result?.products || []
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ message: 'Unable to save open stock purchase' })
  }
})



// MD-CEO management reports. These endpoints are intentionally management-only.
const mdDateRange = (dateValue: string) => {
  const from = new Date(`${dateValue}T00:00:00.000`)
  const to = new Date(`${dateValue}T23:59:59.999`)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null
  return { gte: from, lte: to }
}

const mdPeriodRange = (mode: string, dateValue: string, monthValue: string, yearValue: string) => {
  if (mode === '24hrs' || mode === 'weekly') return mdDateRange(dateValue)
  const year = Number(yearValue)
  if (!Number.isInteger(year)) return null
  if (mode === 'yearly') return { gte: new Date(`${year}-01-01T00:00:00.000`), lte: new Date(`${year}-12-31T23:59:59.999`) }
  const month = Number(monthValue)
  if (!Number.isInteger(month) || month < 1 || month > 12) return null
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0)
  const end = new Date(year, month, 0, 23, 59, 59, 999)
  return { gte: start, lte: end }
}

app.get('/api/md-ceo/admin-users', ...requireManagement, async (_req, res) => {
  try {
    const users = await prisma.adminUser.findMany({
      select: { id: true, username: true, displayName: true, role: true, status: true, createdAt: true },
      orderBy: { id: 'asc' }
    })
    res.json({ users })
  } catch (error) {
    console.error('MD admin users error:', error)
    res.status(500).json({ message: 'Unable to load administrator information.' })
  }
})

app.get('/api/md-ceo/cashiers', ...requireManagement, async (_req, res) => {
  try {
    const cashiers = await prisma.adminUser.findMany({
      where: { role: 'CASHIER', status: { not: 'DELETED' } },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        status: true,
        createdAt: true
      },
      orderBy: [{ status: 'asc' }, { id: 'asc' }]
    })
    res.json({ cashiers })
  } catch (error) {
    console.error('Cashier list error:', error)
    res.status(500).json({ message: 'Unable to load cashier accounts.' })
  }
})

app.post('/api/md-ceo/cashiers', ...requireManagement, async (req, res) => {
  const parsed = z.object({
    username: z.string().trim().min(1).max(100),
    displayName: z.string().trim().min(1).max(150),
    password: z.string().min(6).max(200)
  }).safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'Username, name and a password of at least 6 characters are required.' })
  }

  try {
    const username = parsed.data.username
    const existing = await prisma.adminUser.findUnique({ where: { username } })
    if (existing) {
      return res.status(409).json({ message: 'That User ID is already in use.' })
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    const cashier = await prisma.adminUser.create({
      data: {
        username,
        displayName: parsed.data.displayName,
        passwordHash,
        role: 'CASHIER',
        status: 'ACTIVE'
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    const auth = res.locals.auth as { id: number }
    await prisma.auditLog.create({
      data: {
        adminId: auth.id,
        action: 'CREATE_CASHIER',
        entity: 'AdminUser',
        entityId: String(cashier.id),
        details: { username: cashier.username, displayName: cashier.displayName, role: 'CASHIER' } as any
      }
    })

    res.status(201).json({ cashier, message: 'Cashier account created successfully.' })
  } catch (error: any) {
    console.error('Cashier create error:', error)
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'That User ID is already in use.' })
    }
    res.status(500).json({ message: 'Unable to create cashier account.' })
  }
})

app.patch('/api/md-ceo/cashiers/:id', ...requireManagement, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'A valid cashier ID is required.' })

  const parsed = z.object({
    username: z.string().trim().min(1).max(100).optional(),
    displayName: z.string().trim().min(1).max(150).optional()
  }).refine(value => value.username !== undefined || value.displayName !== undefined, {
    message: 'At least one cashier field is required.'
  }).safeParse(req.body)

  if (!parsed.success) return res.status(400).json({ message: 'A valid User ID or name is required.' })

  try {
    const cashier = await prisma.adminUser.findFirst({
      where: { id, role: 'CASHIER', status: { not: 'DELETED' } },
      select: { id: true, username: true, displayName: true, role: true, status: true, createdAt: true }
    })
    if (!cashier) return res.status(404).json({ message: 'Cashier account not found.' })

    const updated = await prisma.adminUser.update({
      where: { id },
      data: {
        ...(parsed.data.username !== undefined ? { username: parsed.data.username } : {}),
        ...(parsed.data.displayName !== undefined ? { displayName: parsed.data.displayName } : {})
      },
      select: { id: true, username: true, displayName: true, role: true, status: true, createdAt: true }
    })

    const auth = res.locals.auth as { id: number }
    await prisma.auditLog.create({
      data: {
        adminId: auth.id,
        action: 'UPDATE_CASHIER',
        entity: 'AdminUser',
        entityId: String(id),
        details: { before: cashier, after: updated } as any
      }
    })

    res.json({ cashier: updated, message: 'Cashier account updated successfully.' })
  } catch (error: any) {
    console.error('Cashier update error:', error)
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'That User ID is already in use.' })
    }
    res.status(500).json({ message: 'Unable to update cashier account.' })
  }
})

app.patch('/api/md-ceo/cashiers/:id/status', ...requireManagement, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'A valid cashier ID is required.' })

  const parsed = z.object({ status: z.enum(['ACTIVE', 'INACTIVE']) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Status must be ACTIVE or INACTIVE.' })

  try {
    const cashier = await prisma.adminUser.findFirst({
      where: { id, role: 'CASHIER', status: { not: 'DELETED' } },
      select: { id: true, username: true, displayName: true, role: true, status: true }
    })
    if (!cashier) return res.status(404).json({ message: 'Cashier account not found.' })

    const updated = await prisma.adminUser.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, username: true, displayName: true, role: true, status: true, createdAt: true }
    })

    const auth = res.locals.auth as { id: number }
    await prisma.auditLog.create({
      data: {
        adminId: auth.id,
        action: parsed.data.status === 'ACTIVE' ? 'ACTIVATE_CASHIER' : 'DEACTIVATE_CASHIER',
        entity: 'AdminUser',
        entityId: String(id),
        details: { previousStatus: cashier.status, newStatus: parsed.data.status } as any
      }
    })

    res.json({ cashier: updated, message: `Cashier account ${parsed.data.status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully.` })
  } catch (error) {
    console.error('Cashier status error:', error)
    res.status(500).json({ message: 'Unable to update cashier account status.' })
  }
})

app.patch('/api/md-ceo/cashiers/:id/password', ...requireManagement, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'A valid cashier ID is required.' })

  const parsed = z.object({ password: z.string().min(6).max(200) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'A password of at least 6 characters is required.' })

  try {
    const cashier = await prisma.adminUser.findFirst({
      where: { id, role: 'CASHIER', status: { not: 'DELETED' } },
      select: { id: true, username: true, displayName: true }
    })
    if (!cashier) return res.status(404).json({ message: 'Cashier account not found.' })

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    await prisma.adminUser.update({ where: { id }, data: { passwordHash } })

    const auth = res.locals.auth as { id: number }
    await prisma.auditLog.create({
      data: {
        adminId: auth.id,
        action: 'RESET_CASHIER_PASSWORD',
        entity: 'AdminUser',
        entityId: String(id),
        details: { username: cashier.username } as any
      }
    })

    res.json({ message: 'Cashier password reset successfully.' })
  } catch (error) {
    console.error('Cashier password reset error:', error)
    res.status(500).json({ message: 'Unable to reset cashier password.' })
  }
})


// -----------------------------------------------------------------------------
// CASHIER DESK
// These endpoints are restricted to the logged-in CASHIER role. Every record
// created here is permanently attributed to that cashier through cashierId.
// -----------------------------------------------------------------------------

const cashierAmount = z.coerce.number().finite().positive()

app.get('/api/cashier/banks', ...requireCashier, async (_req, res) => {
  try {
    const banks = await prisma.bankAccount.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        accountId: true,
        bankName: true,
        accountName: true,
        accountNo: true
      },
      orderBy: { id: 'asc' }
    })
    res.json({ banks })
  } catch (error) {
    console.error('Cashier banks error:', error)
    res.status(500).json({ message: 'Unable to load active bank accounts.' })
  }
})



app.get('/api/cashier/cashsales-payment', ...requireCashier, async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100)
  try {
    const sales = await prisma.cashSale.findMany({
      where: { balance: { gt: 0 } },
      include: {
        lines: { include: { product: { select: { stockName: true } } }, orderBy: { id: 'asc' } }
      },
      orderBy: [{ saleDate: 'asc' }, { id: 'asc' }],
      take: limit
    })

    const rows = sales.map((sale) => ({
      id: sale.id,
      invoiceNo: sale.invoiceNo,
      saleDate: sale.saleDate,
      customerName: sale.customerName,
      salesStaff: sale.salesStaff,
      totalAmount: Number(sale.totalAmount || 0),
      paidAmount: Number(sale.paidAmount || 0),
      balance: Number(sale.balance || 0),
      lines: sale.lines.map((line) => ({
        id: line.id,
        stockName: line.product.stockName,
        quantity: Number(line.saleQty || line.quantity || 0),
        rate: line.rate,
        unitPrice: Number(line.unitPrice || 0),
        lineTotal: Number(line.lineTotal || 0),
        discount: 0
      }))
    }))

    res.json({ rows })
  } catch (error) {
    console.error('Cashier CashSales payment queue error:', error)
    res.status(500).json({ message: 'Unable to load CashSales Payment queue.' })
  }
})

app.post('/api/cashier/cashsales-payment/:id', ...requireCashier, async (req, res) => {
  const saleId = Number(req.params.id)
  if (!Number.isInteger(saleId) || saleId <= 0) return res.status(400).json({ message: 'Invalid CashSales transaction.' })

  const parsed = z.object({
    transferAmount: z.coerce.number().finite().nonnegative().default(0),
    posAmount: z.coerce.number().finite().nonnegative().default(0),
    cashAmount: z.coerce.number().finite().nonnegative().default(0)
  }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Enter valid Transfer, POS and Cash amounts.' })

  const auth = res.locals.auth as { id: number; displayName?: string | null; username?: string }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const sale = await tx.cashSale.findUnique({
        where: { id: saleId },
        include: { lines: { include: { product: { select: { stockName: true } } }, orderBy: { id: 'asc' } } }
      })
      if (!sale) {
        const error = new Error('CashSales transaction not found.')
        ;(error as any).statusCode = 404
        throw error
      }

      const totalDue = Number(sale.balance || 0)
      if (totalDue <= 0) {
        const error = new Error('This CashSales transaction has already been paid.')
        ;(error as any).statusCode = 400
        throw error
      }

      const transfer = Number(parsed.data.transferAmount || 0)
      const pos = Number(parsed.data.posAmount || 0)
      const cash = Number(parsed.data.cashAmount || 0)
      const paymentTotal = Number((transfer + pos + cash).toFixed(2))
      if (paymentTotal <= 0 || Math.abs(paymentTotal - totalDue) > 0.005) {
        const error = new Error(`Transfer + POS + Cash must equal the amount due of ${totalDue.toFixed(2)}.`)
        ;(error as any).statusCode = 400
        throw error
      }

      const paymentRows = []
      if (transfer > 0) paymentRows.push(await tx.cashSalePayment.create({ data: { saleId: sale.id, amount: transfer, paymentMethod: 'TRANSFER', reference: sale.invoiceNo, cashierId: auth.id } }))
      if (pos > 0) paymentRows.push(await tx.cashSalePayment.create({ data: { saleId: sale.id, amount: pos, paymentMethod: 'POS', reference: sale.invoiceNo, cashierId: auth.id } }))
      if (cash > 0) paymentRows.push(await tx.cashSalePayment.create({ data: { saleId: sale.id, amount: cash, paymentMethod: 'CASH', reference: sale.invoiceNo, cashierId: auth.id } }))

      const updated = await tx.cashSale.update({
        where: { id: sale.id },
        data: { paidAmount: { increment: paymentTotal }, balance: 0 },
        include: { lines: { include: { product: { select: { stockName: true } } }, orderBy: { id: 'asc' } } }
      })

      await tx.auditLog.create({
        data: {
          adminId: auth.id,
          action: 'CASHIER_CONFIRM_CASHSALES_PAYMENT',
          entity: 'CashSale',
          entityId: String(sale.id),
          details: { invoiceNo: sale.invoiceNo, transferAmount: transfer, posAmount: pos, cashAmount: cash, totalPaid: paymentTotal } as any
        }
      })

      return { sale: updated, paymentDate: paymentRows[paymentRows.length - 1]?.paymentDate || new Date(), transfer, pos, cash, paymentTotal }
    })

    res.status(201).json({
      message: 'CashSales payment confirmed successfully.',
      receipt: {
        invoiceNo: result.sale.invoiceNo,
        customerName: result.sale.customerName,
        salesStaff: result.sale.salesStaff,
        cashierName: auth.displayName || auth.username || 'Cashier',
        saleDate: result.sale.saleDate,
        paymentDate: result.paymentDate,
        totalAmount: Number(result.sale.totalAmount),
        totalPaid: result.paymentTotal,
        transferAmount: result.transfer,
        posAmount: result.pos,
        cashAmount: result.cash,
        lines: result.sale.lines.map((line) => ({
          id: line.id,
          stockName: line.product.stockName,
          quantity: Number(line.saleQty || line.quantity || 0),
          rate: line.rate,
          unitPrice: Number(line.unitPrice || 0),
          discount: Number(line.discount || 0),
          lineTotal: Number(line.lineTotal || 0)
        }))
      }
    })
  } catch (error: any) {
    console.error('Cashier CashSales payment error:', error)
    const statusCode = Number(error?.statusCode) || 500
    res.status(statusCode).json({ message: statusCode === 500 ? 'Unable to confirm CashSales payment.' : error.message })
  }
})

app.get('/api/cashier/nyp-customers', ...requireCashier, async (_req, res) => {
  try {
    const customers = await prisma.nypCustomer.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        nypId: true,
        fullName: true,
        totalSupplied: true,
        totalPaid: true,
        balance: true
      },
      orderBy: { id: 'asc' }
    })

    res.json({ customers })
  } catch (error) {
    console.error('Cashier NYP customer lookup error:', error)
    res.status(500).json({ message: 'Unable to load NYP accounts.' })
  }
})

app.get('/api/cashier/nyp-sales', ...requireCashier, async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100)

  try {
    const rows = await prisma.nypSale.findMany({
      include: {
        nypCustomer: {
          select: { id: true, nypId: true, fullName: true }
        },
        lines: {
          include: {
            product: {
              select: { id: true, stockName: true }
            }
          }
        }
      },
      orderBy: [{ saleDate: 'desc' }, { id: 'desc' }],
      take: limit
    })

    res.json({ rows })
  } catch (error) {
    console.error('Cashier NYP supplies error:', error)
    res.status(500).json({ message: 'Unable to load NYP supply invoices.' })
  }
})

app.get('/api/cashier/nyp-payments', ...requireCashier, async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100)
  const auth = res.locals.auth as { id: number }

  try {
    const rows = await prisma.nypPayment.findMany({
      where: { cashierId: auth.id },
      select: {
        id: true,
        amount: true,
        reference: true,
        paymentDate: true,
        paymentMethod: true,
        note: true,
        nypCustomer: {
          select: { nypId: true, fullName: true }
        },
        bankAccount: {
          select: { id: true, accountId: true, bankName: true, accountName: true }
        }
      },
      orderBy: { paymentDate: 'desc' },
      take: limit
    })

    res.json({ rows })
  } catch (error) {
    console.error('Cashier NYP payment history error:', error)
    res.status(500).json({ message: 'Unable to load your NYP payment records.' })
  }
})

app.post('/api/cashier/nyp-payments', ...requireCashier, async (req, res) => {
  const parsed = z.object({
    nypCustomerId: z.coerce.number().int().positive(),
    amount: cashierAmount,
    reference: z.string().trim().max(100).optional(),
    note: z.string().trim().max(500).optional()
  }).safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'NYP account and a valid positive amount are required.' })
  }

  const auth = res.locals.auth as { id: number }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.nypCustomer.findFirst({
        where: { id: parsed.data.nypCustomerId, status: 'ACTIVE' },
        select: {
          id: true,
          nypId: true,
          fullName: true,
          totalSupplied: true,
          totalPaid: true,
          balance: true
        }
      })

      if (!customer) {
        const error = new Error('NYP account not found or inactive.')
        ;(error as any).statusCode = 404
        throw error
      }

      const amount = parsed.data.amount
      const currentBalance = Number(customer.balance || 0)

      if (amount > currentBalance && currentBalance >= 0) {
        const error = new Error(`Payment cannot exceed the current NYP balance of ${currentBalance.toFixed(2)}.`)
        ;(error as any).statusCode = 400
        throw error
      }

      const payment = await tx.nypPayment.create({
        data: {
          nypCustomerId: customer.id,
          cashierId: auth.id,
          amount,
          paymentMethod: 'CASH',
          reference: parsed.data.reference || null,
          note: parsed.data.note || null
        },
        include: {
          nypCustomer: {
            select: { id: true, nypId: true, fullName: true }
          }
        }
      })

      const updatedCustomer = await tx.nypCustomer.update({
        where: { id: customer.id },
        data: {
          totalPaid: { increment: amount },
          balance: { decrement: amount }
        },
        select: {
          id: true,
          nypId: true,
          fullName: true,
          totalSupplied: true,
          totalPaid: true,
          balance: true
        }
      })

      await tx.auditLog.create({
        data: {
          adminId: auth.id,
          action: 'CASHIER_CREATE_NYP_PAYMENT',
          entity: 'NypPayment',
          entityId: String(payment.id),
          details: {
            nypCustomerId: customer.id,
            nypId: customer.nypId,
            amount,
            paymentMethod: 'CASH',
            reference: parsed.data.reference || null
          } as any
        }
      })

      return { payment, customer: updatedCustomer }
    })

    res.status(201).json({
      message: 'NYP Payment recorded successfully.',
      row: result.payment,
      customer: result.customer,
      receipt: {
        reference: result.payment.reference || `NYP-PMT-${result.payment.id}`,
        paymentMethod: result.payment.paymentMethod,
        amount: Number(result.payment.amount),
        paymentDate: result.payment.paymentDate
      }
    })
  } catch (error: any) {
    console.error('Cashier NYP payment create error:', error)
    const statusCode = Number(error?.statusCode) || 500
    res.status(statusCode).json({
      message: statusCode === 500 ? 'Unable to record NYP payment.' : error.message
    })
  }
})

app.get('/api/cashier/external-cash-payin', ...requireCashier, async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100)
  const auth = res.locals.auth as { id: number }

  try {
    const rows = await prisma.externalCashPayIn.findMany({
      where: { cashierId: auth.id },
      select: {
        id: true,
        amount: true,
        source: true,
        reference: true,
        payInDate: true,
        note: true,
        bankAccount: {
          select: { id: true, accountId: true, bankName: true, accountName: true }
        }
      },
      orderBy: { payInDate: 'desc' },
      take: limit
    })
    res.json({ rows })
  } catch (error) {
    console.error('Cashier external pay-in history error:', error)
    res.status(500).json({ message: 'Unable to load your external cash pay-in records.' })
  }
})

app.post('/api/cashier/external-cash-payin', ...requireCashier, async (req, res) => {
  const parsed = z.object({
    amount: cashierAmount,
    source: z.string().trim().min(1).max(200),
    bankAccountId: z.coerce.number().int().positive().nullable().optional(),
    reference: z.string().trim().max(100).optional(),
    note: z.string().trim().max(500).optional()
  }).safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'Source and a valid positive amount are required.' })
  }

  const auth = res.locals.auth as { id: number }

  try {
    if (parsed.data.bankAccountId) {
      const bank = await prisma.bankAccount.findFirst({
        where: { id: parsed.data.bankAccountId, status: 'ACTIVE' }
      })
      if (!bank) return res.status(400).json({ message: 'Selected bank account is not active.' })
    }

    const row = await prisma.externalCashPayIn.create({
      data: {
        cashierId: auth.id,
        amount: parsed.data.amount,
        source: parsed.data.source,
        bankAccountId: parsed.data.bankAccountId ?? null,
        reference: parsed.data.reference || null,
        note: parsed.data.note || null
      },
      include: {
        bankAccount: {
          select: { id: true, accountId: true, bankName: true, accountName: true }
        }
      }
    })

    await prisma.auditLog.create({
      data: {
        adminId: auth.id,
        action: 'CASHIER_CREATE_EXTERNAL_CASH_PAYIN',
        entity: 'ExternalCashPayIn',
        entityId: String(row.id),
        details: {
          amount: parsed.data.amount,
          source: parsed.data.source,
          reference: parsed.data.reference || null
        } as any
      }
    })

    res.status(201).json({ row, message: 'External Cash PAY-IN recorded successfully.' })
  } catch (error) {
    console.error('Cashier external pay-in create error:', error)
    res.status(500).json({ message: 'Unable to record external cash pay-in.' })
  }
})

app.get('/api/cashier/cash-deposits', ...requireCashier, async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100)
  const auth = res.locals.auth as { id: number }

  try {
    const rows = await prisma.cashDeposit.findMany({
      where: { cashierId: auth.id },
      select: {
        id: true,
        amount: true,
        depositDate: true,
        reference: true,
        note: true,
        bankAccount: {
          select: { id: true, accountId: true, bankName: true, accountName: true }
        }
      },
      orderBy: { depositDate: 'desc' },
      take: limit
    })
    res.json({ rows })
  } catch (error) {
    console.error('Cashier cash deposit history error:', error)
    res.status(500).json({ message: 'Unable to load your cash deposit records.' })
  }
})

app.post('/api/cashier/cash-deposits', ...requireCashier, async (req, res) => {
  const parsed = z.object({
    amount: cashierAmount,
    bankAccountId: z.coerce.number().int().positive().nullable().optional(),
    reference: z.string().trim().max(100).optional(),
    note: z.string().trim().max(500).optional()
  }).safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'A valid positive amount is required.' })
  }

  const auth = res.locals.auth as { id: number }

  try {
    if (parsed.data.bankAccountId) {
      const bank = await prisma.bankAccount.findFirst({
        where: { id: parsed.data.bankAccountId, status: 'ACTIVE' }
      })
      if (!bank) return res.status(400).json({ message: 'Selected bank account is not active.' })
    }

    const row = await prisma.cashDeposit.create({
      data: {
        cashierId: auth.id,
        amount: parsed.data.amount,
        bankAccountId: parsed.data.bankAccountId ?? null,
        reference: parsed.data.reference || null,
        note: parsed.data.note || null
      },
      include: {
        bankAccount: {
          select: { id: true, accountId: true, bankName: true, accountName: true }
        }
      }
    })

    await prisma.auditLog.create({
      data: {
        adminId: auth.id,
        action: 'CASHIER_CREATE_CASH_DEPOSIT',
        entity: 'CashDeposit',
        entityId: String(row.id),
        details: { amount: parsed.data.amount, reference: parsed.data.reference || null } as any
      }
    })

    res.status(201).json({ row, message: 'Cash Deposit recorded successfully.' })
  } catch (error) {
    console.error('Cashier cash deposit create error:', error)
    res.status(500).json({ message: 'Unable to record cash deposit.' })
  }
})

app.get('/api/cashier/expenses', ...requireCashier, async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100)
  const auth = res.locals.auth as { id: number }

  try {
    const rows = await prisma.expense.findMany({
      where: { cashierId: auth.id },
      select: {
        id: true,
        description: true,
        amount: true,
        expenseDate: true,
        category: true,
        note: true
      },
      orderBy: { expenseDate: 'desc' },
      take: limit
    })
    res.json({ rows })
  } catch (error) {
    console.error('Cashier expense history error:', error)
    res.status(500).json({ message: 'Unable to load your expense records.' })
  }
})

app.post('/api/cashier/expenses', ...requireCashier, async (req, res) => {
  const parsed = z.object({
    description: z.string().trim().min(1).max(250),
    amount: cashierAmount,
    category: z.string().trim().max(150).optional(),
    note: z.string().trim().max(500).optional()
  }).safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'Description and a valid positive amount are required.' })
  }

  const auth = res.locals.auth as { id: number }

  try {
    const row = await prisma.expense.create({
      data: {
        cashierId: auth.id,
        description: parsed.data.description,
        amount: parsed.data.amount,
        category: parsed.data.category || null,
        note: parsed.data.note || null
      }
    })

    await prisma.auditLog.create({
      data: {
        adminId: auth.id,
        action: 'CASHIER_CREATE_EXPENSE',
        entity: 'Expense',
        entityId: String(row.id),
        details: {
          description: parsed.data.description,
          amount: parsed.data.amount,
          category: parsed.data.category || null
        } as any
      }
    })

    res.status(201).json({ row, message: 'Expense recorded successfully.' })
  } catch (error) {
    console.error('Cashier expense create error:', error)
    res.status(500).json({ message: 'Unable to record expense.' })
  }
})

app.get('/api/cashier/bank-lodgements', ...requireCashier, async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100)
  const auth = res.locals.auth as { id: number }

  try {
    const rows = await prisma.bankLodgement.findMany({
      where: { cashierId: auth.id },
      select: {
        id: true,
        amount: true,
        lodgementDate: true,
        reference: true,
        note: true,
        bankAccount: {
          select: { id: true, accountId: true, bankName: true, accountName: true }
        }
      },
      orderBy: { lodgementDate: 'desc' },
      take: limit
    })
    res.json({ rows })
  } catch (error) {
    console.error('Cashier bank lodgement history error:', error)
    res.status(500).json({ message: 'Unable to load your bank lodgement records.' })
  }
})

app.post('/api/cashier/bank-lodgements', ...requireCashier, async (req, res) => {
  const parsed = z.object({
    bankAccountId: z.coerce.number().int().positive(),
    amount: cashierAmount,
    reference: z.string().trim().max(100).optional(),
    note: z.string().trim().max(500).optional()
  }).safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ message: 'Bank account and a valid positive amount are required.' })
  }

  const auth = res.locals.auth as { id: number }

  try {
    const bank = await prisma.bankAccount.findFirst({
      where: { id: parsed.data.bankAccountId, status: 'ACTIVE' }
    })
    if (!bank) return res.status(400).json({ message: 'Selected bank account is not active.' })

    const row = await prisma.bankLodgement.create({
      data: {
        cashierId: auth.id,
        bankAccountId: parsed.data.bankAccountId,
        amount: parsed.data.amount,
        reference: parsed.data.reference || null,
        note: parsed.data.note || null
      },
      include: {
        bankAccount: {
          select: { id: true, accountId: true, bankName: true, accountName: true }
        }
      }
    })

    await prisma.auditLog.create({
      data: {
        adminId: auth.id,
        action: 'CASHIER_CREATE_BANK_LODGEMENT',
        entity: 'BankLodgement',
        entityId: String(row.id),
        details: {
          amount: parsed.data.amount,
          bankAccountId: parsed.data.bankAccountId,
          reference: parsed.data.reference || null
        } as any
      }
    })

    res.status(201).json({ row, message: 'Bank Lodgement recorded successfully.' })
  } catch (error) {
    console.error('Cashier bank lodgement create error:', error)
    res.status(500).json({ message: 'Unable to record bank lodgement.' })
  }
})

app.post('/api/md-ceo/admin-code-check', ...requireManagement, async (req, res) => {
  const parsed = z.object({ adminId: z.string().trim().min(1), password: z.string().min(1) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Admin ID and password are required.' })
  try {
    const admin = await prisma.adminUser.findFirst({ where: { username: parsed.data.adminId, status: 'ACTIVE' } })
    if (!admin || !(await bcrypt.compare(parsed.data.password, admin.passwordHash))) {
      return res.status(401).json({ message: 'Administrator credentials are not valid.' })
    }
    res.json({ valid: true, message: 'Administrator credentials verified successfully.' })
  } catch (error) {
    console.error('MD admin code check error:', error)
    res.status(500).json({ message: 'Unable to verify administrator credentials.' })
  }
})

app.get('/api/md-ceo/cashsales-payment-status', ...requireManagement, async (req, res) => {
  const mode = String(req.query.mode || '24hrs').trim()
  const date = String(req.query.date || '').trim()
  const month = String(req.query.month || '').trim()
  const year = String(req.query.year || '').trim()

  const range = mdPeriodRange(mode, date, month, year)
  if (!range) {
    return res.status(400).json({ message: 'Invalid CashSales payment reporting period.' })
  }

  try {
    const sales = await prisma.cashSale.findMany({
      where: { saleDate: range },
      select: {
        id: true,
        invoiceNo: true,
        customerName: true,
        salesStaff: true,
        saleDate: true,
        totalAmount: true,
        paidAmount: true,
        balance: true
      },
      orderBy: [{ saleDate: 'asc' }, { id: 'asc' }]
    })

    const rows = sales.map(sale => {
      const total = Number(sale.totalAmount || 0)
      const paid = Number(sale.paidAmount || 0)
      return {
        ...sale,
        totalAmount: total,
        paidAmount: paid,
        balance: Math.max(0, Number(sale.balance || 0))
      }
    })

    const totals = rows.reduce(
      (acc, row) => ({
        total: acc.total + row.totalAmount,
        paid: acc.paid + row.paidAmount,
        balance: acc.balance + row.balance
      }),
      { total: 0, paid: 0, balance: 0 }
    )

    res.json({ mode, date, month, year, rows, total: totals.total, totals })
  } catch (error) {
    console.error('MD cash sales payment status error:', error)
    res.status(500).json({ message: 'Unable to load CashSales payment status.' })
  }
})

app.get('/api/md-ceo/external-cash-payin', ...requireManagement, async (req, res) => {
  const date = String(req.query.date || '').trim()
  const range = mdDateRange(date)
  if (!range) return res.status(400).json({ message: 'A valid date is required.' })
  try {
    const rows = await prisma.externalCashPayIn.findMany({ where: { payInDate: range }, select: { id: true, amount: true, source: true, reference: true, payInDate: true, note: true }, orderBy: [{ payInDate: 'asc' }, { id: 'asc' }] })
    const total = rows.reduce((n, r) => n + Number(r.amount || 0), 0)
    res.json({ date, rows, total, totals: { total } })
  } catch (error) {
    console.error('MD external cash pay-in error:', error)
    res.status(500).json({ message: 'Unable to load external cash pay-in report.' })
  }
})

app.get('/api/md-ceo/expenses', ...requireManagement, async (req, res) => {
  const date = String(req.query.date || '').trim()
  const range = mdDateRange(date)
  if (!range) return res.status(400).json({ message: 'A valid date is required.' })
  try {
    const rows = await prisma.expense.findMany({ where: { expenseDate: range }, orderBy: [{ expenseDate: 'asc' }, { id: 'asc' }] })
    const total = rows.reduce((n, r) => n + Number(r.amount || 0), 0)
    res.json({ date, rows, total, totals: { total } })
  } catch (error) {
    console.error('MD expenses error:', error)
    res.status(500).json({ message: 'Unable to load expenses report.' })
  }
})

app.get('/api/md-ceo/cash-deposits', ...requireManagement, async (req, res) => {
  const mode = String(req.query.mode || '24hrs')
  const date = String(req.query.date || '').trim()
  const month = String(req.query.month || '')
  const year = String(req.query.year || '')
  const range = mdPeriodRange(mode, date, month, year)
  if (!range) return res.status(400).json({ message: 'Invalid cash deposit reporting period.' })
  try {
    const rows = await prisma.cashDeposit.findMany({ where: { depositDate: range }, include: { bankAccount: { select: { accountId: true, bankName: true } } }, orderBy: [{ depositDate: 'asc' }, { id: 'asc' }] })
    const total = rows.reduce((n, r) => n + Number(r.amount || 0), 0)
    res.json({ mode, date, month, year, rows, total, totals: { total } })
  } catch (error) {
    console.error('MD cash deposit error:', error)
    res.status(500).json({ message: 'Unable to load cash deposit report.' })
  }
})

app.get('/api/md-ceo/banking', ...requireManagement, async (req, res) => {
  const mode = String(req.query.mode || '24hrs')
  let range: { gte: Date; lte: Date } | null = null
  if (mode === 'statement') {
    const firstDate = String(req.query.firstDate || '').trim()
    const lastDate = String(req.query.lastDate || '').trim()
    const first = mdDateRange(firstDate); const last = mdDateRange(lastDate)
    if (!first || !last || first.gte > last.lte) return res.status(400).json({ message: 'Invalid bank statement date range.' })
    range = { gte: first.gte, lte: last.lte }
  } else {
    range = mdPeriodRange(mode, String(req.query.date || '').trim(), String(req.query.month || ''), String(req.query.year || ''))
  }
  if (!range) return res.status(400).json({ message: 'Invalid banking reporting period.' })
  const bankId = String(req.query.bankId || 'All Bank')
  try {
    const bankWhere = bankId !== 'All Bank' ? { accountId: bankId } : undefined
    const banks = await prisma.bankAccount.findMany({ where: { status: 'ACTIVE', ...(bankWhere || {}) }, select: { id: true, accountId: true, bankName: true, accountName: true, accountNo: true } })
    const ids = banks.map(b => b.id)
    const rows = await prisma.bankLodgement.findMany({ where: { bankAccountId: { in: ids.length ? ids : [-1] }, lodgementDate: range }, include: { bankAccount: { select: { accountId: true, bankName: true } } }, orderBy: [{ lodgementDate: 'asc' }, { id: 'asc' }] })
    const total = rows.reduce((n, r) => n + Number(r.amount || 0), 0)
    res.json({ mode, bankId, banks, rows: rows.map(r => ({ ...r, amount: Number(r.amount || 0), date: r.lodgementDate })), total, totals: { total } })
  } catch (error) {
    console.error('MD banking report error:', error)
    res.status(500).json({ message: 'Unable to load banking report.' })
  }
})

app.get('/api/md-ceo/account-status-summary', ...requireManagement, async (req, res) => {
  const date = String(req.query.date || '').trim()
  const range = mdDateRange(date)
  if (!range) return res.status(400).json({ message: 'A valid date is required.' })
  const end = range.lte
  try {
    const [companies, nypCustomers] = await Promise.all([
      prisma.company.findMany({ where: { status: 'ACTIVE' }, select: { id: true, companyId: true, companyName: true }, orderBy: { companyName: 'asc' } }),
      prisma.nypCustomer.findMany({ where: { status: 'ACTIVE' }, select: { id: true, nypId: true, fullName: true }, orderBy: { fullName: 'asc' } })
    ])
    const companyRows = await Promise.all(companies.map(async c => {
      const [p, pay] = await Promise.all([
        prisma.companyPurchase.aggregate({ where: { companyId: c.id, purchaseDate: { lte: end } }, _sum: { totalAmount: true } }),
        prisma.companyPayment.aggregate({ where: { companyId: c.id, paymentDate: { lte: end } }, _sum: { amount: true } })
      ])
      const supplied = Number(p._sum.totalAmount || 0), paid = Number(pay._sum.amount || 0)
      return { type: 'Company', account: `${c.companyId} — ${c.companyName}`, supplied, paid, balance: supplied - paid }
    }))
    const nypRows = await Promise.all(nypCustomers.map(async n => {
      const [s, pay] = await Promise.all([
        prisma.nypSale.aggregate({ where: { nypCustomerId: n.id, saleDate: { lte: end } }, _sum: { totalAmount: true } }),
        prisma.nypPayment.aggregate({ where: { nypCustomerId: n.id, paymentDate: { lte: end } }, _sum: { amount: true } })
      ])
      const supplied = Number(s._sum.totalAmount || 0), paid = Number(pay._sum.amount || 0)
      return { type: 'NYP', account: `${n.nypId} — ${n.fullName}`, supplied, paid, balance: supplied - paid }
    }))
    const rows = [...companyRows, ...nypRows]
    const total = rows.reduce((n, r) => n + r.balance, 0)
    res.json({ date, rows, total, totals: { total, companies: companyRows.length, nyp: nypRows.length } })
  } catch (error) {
    console.error('MD account status summary error:', error)
    res.status(500).json({ message: 'Unable to load account status summary.' })
  }
})

app.get('/api/md-ceo/account-status-analysis', ...requireManagement, async (req, res) => {
  const date = String(req.query.date || '').trim()
  const range = mdDateRange(date)
  if (!range) return res.status(400).json({ message: 'A valid date is required.' })
  try {
    const summary = await prisma.$queryRaw<Array<{ type: string; accounts: bigint; outstanding: any }>>`
      SELECT 'Company'::text AS type, COUNT(*)::bigint AS accounts,
        COALESCE(SUM(p.total_amount - COALESCE(pay.total_paid, 0)), 0) AS outstanding
      FROM "Company" c
      LEFT JOIN (
        SELECT "companyId", SUM("totalAmount") AS total_amount FROM "CompanyPurchase" WHERE "purchaseDate" <= ${range.lte} GROUP BY "companyId"
      ) p ON p."companyId" = c.id
      LEFT JOIN (
        SELECT "companyId", SUM(amount) AS total_paid FROM "CompanyPayment" WHERE "paymentDate" <= ${range.lte} GROUP BY "companyId"
      ) pay ON pay."companyId" = c.id
      WHERE c.status = 'ACTIVE'
      UNION ALL
      SELECT 'NYP'::text AS type, COUNT(*)::bigint AS accounts,
        COALESCE(SUM(s.total_amount - COALESCE(pay.total_paid, 0)), 0) AS outstanding
      FROM "NypCustomer" n
      LEFT JOIN (
        SELECT "nypCustomerId", SUM("totalAmount") AS total_amount FROM "NypSale" WHERE "saleDate" <= ${range.lte} GROUP BY "nypCustomerId"
      ) s ON s."nypCustomerId" = n.id
      LEFT JOIN (
        SELECT "nypCustomerId", SUM(amount) AS total_paid FROM "NypPayment" WHERE "paymentDate" <= ${range.lte} GROUP BY "nypCustomerId"
      ) pay ON pay."nypCustomerId" = n.id
      WHERE n.status = 'ACTIVE'
    `
    const rows = summary.map(r => ({ type: r.type, account: `${r.type} Accounts`, supplied: 0, paid: 0, balance: Number(r.outstanding || 0), accounts: Number(r.accounts || 0) }))
    res.json({ date, rows, total: rows.reduce((n, r) => n + r.balance, 0), totals: { total: rows.reduce((n, r) => n + r.balance, 0) } })
  } catch (error) {
    console.error('MD account status analysis error:', error)
    res.status(500).json({ message: 'Unable to load account status analysis.' })
  }
})



// MD-CEO DESK 2: real deletion routes. Management access is required and every
// destructive operation also requires a fresh admin credential check.
const md2VerifyCredentials = async (adminId: string, password: string) => { const admin=await prisma.adminUser.findFirst({where:{username:adminId,status:'ACTIVE'}}); if(!admin || !(await bcrypt.compare(password,admin.passwordHash))) return null; return admin }
const md2Audit = async (adminId:number,action:string,entity:string,entityId:string,details:unknown) => { await prisma.auditLog.create({data:{adminId,action,entity,entityId,details:details as any}}) }
const md2DeleteAuth = async (req:express.Request,res:express.Response) => { const adminId=String(req.body?.adminId||'').trim(),password=String(req.body?.password||''); if(!adminId||!password){res.status(400).json({message:'Admin ID and password are required for deletion.'});return null} const admin=await md2VerifyCredentials(adminId,password); if(!admin){res.status(401).json({message:'Administrator credentials are not valid.'});return null} return admin }

app.delete('/api/md-ceo2/company-stock',...requireManagement,async(req,res)=>{const companyId=Number(req.body?.companyId);const ids=Array.isArray(req.body?.ids)?req.body.ids.map(Number).filter(Number.isInteger):[];if(!Number.isInteger(companyId)||!ids.length)return res.status(400).json({message:'A valid company and at least one stock record are required.'});const admin=await md2DeleteAuth(req,res);if(!admin)return;try{const r=await prisma.product.updateMany({where:{id:{in:ids},companyId,status:'ACTIVE'},data:{status:'DELETED'}});await md2Audit(admin.id,'DELETE_COMPANY_STOCK','Product',ids.join(','),{companyId,ids,affected:r.count,mode:'soft-delete'});res.json({message:`${r.count} company stock record${r.count===1?'':'s'} deleted successfully.`,count:r.count})}catch(e){console.error(e);res.status(500).json({message:'Unable to delete company stock records.'})}})
app.get('/api/md-ceo2/company-stock',...requireManagement,async(req,res)=>{const companyId=Number(req.query.companyId);if(!Number.isInteger(companyId))return res.status(400).json({message:'A valid company is required.'});try{res.json({rows:await prisma.product.findMany({where:{companyId,status:'ACTIVE'},orderBy:{id:'asc'}})})}catch(e){console.error(e);res.status(500).json({message:'Unable to load company stock.'})}})
app.get('/api/md-ceo2/stock',...requireManagement,async(_req,res)=>{try{res.json({rows:await prisma.product.findMany({where:{status:'ACTIVE'},orderBy:{id:'asc'}})})}catch(e){console.error(e);res.status(500).json({message:'Unable to load stock.'})}})
app.delete('/api/md-ceo2/stock',...requireManagement,async(req,res)=>{const ids=Array.isArray(req.body?.ids)?req.body.ids.map(Number).filter(Number.isInteger):[];if(!ids.length)return res.status(400).json({message:'No stock records were selected.'});const admin=await md2DeleteAuth(req,res);if(!admin)return;try{const r=await prisma.product.updateMany({where:{id:{in:ids},status:'ACTIVE'},data:{status:'DELETED'}});await md2Audit(admin.id,'DELETE_STOCK','Product',ids.join(','),{ids,affected:r.count,mode:'soft-delete'});res.json({message:`${r.count} stock record${r.count===1?'':'s'} deleted successfully.`,count:r.count})}catch(e){console.error(e);res.status(500).json({message:'Unable to delete stock records.'})}})
app.delete('/api/md-ceo2/products',...requireManagement,async(req,res)=>{const ids=Array.isArray(req.body?.ids)?req.body.ids.map(Number).filter(Number.isInteger):[];if(!ids.length)return res.status(400).json({message:'No stock records were selected.'});const admin=await md2DeleteAuth(req,res);if(!admin)return;try{const r=await prisma.product.updateMany({where:{id:{in:ids},status:'ACTIVE'},data:{status:'DELETED'}});await md2Audit(admin.id,'DELETE_STOCK','Product',ids.join(','),{ids,affected:r.count,mode:'soft-delete'});res.json({message:`${r.count} stock record${r.count===1?'':'s'} deleted successfully.`,count:r.count})}catch(e){console.error(e);res.status(500).json({message:'Unable to delete stock records.'})}})

app.get('/api/md-ceo2/nyp-accounts',...requireManagement,async(_req,res)=>{try{const cs=await prisma.nypCustomer.findMany({where:{status:'ACTIVE'},orderBy:{id:'asc'}});const rows=await Promise.all(cs.map(async c=>{const [s,p]=await Promise.all([prisma.nypSale.aggregate({where:{nypCustomerId:c.id},_sum:{totalAmount:true}}),prisma.nypPayment.aggregate({where:{nypCustomerId:c.id},_sum:{amount:true}})]);const supplied=Number(s._sum.totalAmount||0),paid=Number(p._sum.amount||0);return{id:c.id,nypId:c.nypId,fullName:c.fullName,supplied,paid,balance:supplied-paid}}));res.json({rows})}catch(e){console.error(e);res.status(500).json({message:'Unable to load NYP accounts.'})}})
app.delete('/api/md-ceo2/nyp-accounts',...requireManagement,async(req,res)=>{const ids=Array.isArray(req.body?.ids)?req.body.ids.map(Number).filter(Number.isInteger):[];if(!ids.length)return res.status(400).json({message:'No NYP accounts were selected.'});const admin=await md2DeleteAuth(req,res);if(!admin)return;try{const r=await prisma.nypCustomer.updateMany({where:{id:{in:ids},status:'ACTIVE'},data:{status:'DELETED'}});await md2Audit(admin.id,'DELETE_NYP_ACCOUNT','NypCustomer',ids.join(','),{ids,affected:r.count,mode:'soft-delete'});res.json({message:`${r.count} NYP account${r.count===1?'':'s'} deleted successfully.`,count:r.count})}catch(e){console.error(e);res.status(500).json({message:'Unable to delete NYP accounts.'})}})

app.get('/api/md-ceo2/company-accounts',...requireManagement,async(_req,res)=>{try{const cs=await prisma.company.findMany({where:{status:'ACTIVE'},orderBy:{id:'asc'}});const rows=await Promise.all(cs.map(async c=>{const [p,pay]=await Promise.all([prisma.companyPurchase.aggregate({where:{companyId:c.id},_sum:{totalAmount:true}}),prisma.companyPayment.aggregate({where:{companyId:c.id},_sum:{amount:true}})]);const supplied=Number(p._sum.totalAmount||0),paid=Number(pay._sum.amount||0);return{id:c.id,companyId:c.companyId,companyName:c.companyName,supplied,paid,balance:supplied-paid}}));res.json({rows})}catch(e){console.error(e);res.status(500).json({message:'Unable to load company accounts.'})}})
app.delete('/api/md-ceo2/company-accounts',...requireManagement,async(req,res)=>{const ids=Array.isArray(req.body?.ids)?req.body.ids.map(Number).filter(Number.isInteger):[];if(!ids.length)return res.status(400).json({message:'No company accounts were selected.'});const admin=await md2DeleteAuth(req,res);if(!admin)return;try{const r=await prisma.company.updateMany({where:{id:{in:ids},status:'ACTIVE'},data:{status:'DELETED'}});await md2Audit(admin.id,'DELETE_COMPANY_ACCOUNT','Company',ids.join(','),{ids,affected:r.count,mode:'soft-delete'});res.json({message:`${r.count} company account${r.count===1?'':'s'} deleted successfully.`,count:r.count})}catch(e){console.error(e);res.status(500).json({message:'Unable to delete company accounts.'})}})

const md2Rows=async(model:any,dateField:string)=>{const rs=await model.findMany({orderBy:[{[dateField]:'asc'},{id:'asc'}]});return rs.map((r:any)=>{const d=new Date(r[dateField]);return{id:r.id,date:d.toISOString().slice(0,10),month:d.toLocaleString('en-US',{month:'long'}),year:d.getFullYear(),amount:Number(r.amount||r.totalAmount||0),description:r.description||'',invoiceNo:r.invoiceNo||''}})}
const md2DeleteIds=async(req:express.Request,res:express.Response,model:any,action:string,entity:string)=>{const ids=Array.isArray(req.body?.ids)?req.body.ids.map(Number).filter(Number.isInteger):[];if(!ids.length){res.status(400).json({message:'No records were selected.'});return}const admin=await md2DeleteAuth(req,res);if(!admin)return;try{const r=await model.deleteMany({where:{id:{in:ids}}});await md2Audit(admin.id,action,entity,ids.join(','),{ids,affected:r.count});res.json({message:`${r.count} record${r.count===1?'':'s'} deleted successfully.`,count:r.count})}catch(e){console.error(e);res.status(500).json({message:'Unable to delete selected records.'})}}
app.get('/api/md-ceo2/bank-lodgements',...requireManagement,async(_req,res)=>{try{res.json({rows:await md2Rows(prisma.bankLodgement,'lodgementDate')})}catch(e){console.error(e);res.status(500).json({message:'Unable to load bank lodgements.'})}})
app.delete('/api/md-ceo2/bank-lodgements',...requireManagement,async(req,res)=>md2DeleteIds(req,res,prisma.bankLodgement,'DELETE_BANK_REPORT','BankLodgement'))
app.get('/api/md-ceo2/expenses',...requireManagement,async(_req,res)=>{try{res.json({rows:await md2Rows(prisma.expense,'expenseDate')})}catch(e){console.error(e);res.status(500).json({message:'Unable to load expenses.'})}})
app.delete('/api/md-ceo2/expenses',...requireManagement,async(req,res)=>md2DeleteIds(req,res,prisma.expense,'DELETE_EXPENSES_REPORT','Expense'))
app.get('/api/md-ceo2/cash-deposits',...requireManagement,async(_req,res)=>{try{res.json({rows:await md2Rows(prisma.cashDeposit,'depositDate')})}catch(e){console.error(e);res.status(500).json({message:'Unable to load cash deposits.'})}})
app.delete('/api/md-ceo2/cash-deposits',...requireManagement,async(req,res)=>md2DeleteIds(req,res,prisma.cashDeposit,'DELETE_CASH_DEPOSIT_REPORT','CashDeposit'))

app.get('/api/md-ceo2/cash-sales',...requireManagement,async(_req,res)=>{try{const rs=await prisma.cashSale.findMany({select:{id:true,invoiceNo:true,saleDate:true,totalAmount:true},orderBy:[{saleDate:'asc'},{id:'asc'}]});res.json({rows:rs.map(r=>{const d=new Date(r.saleDate);return{id:r.id,date:d.toISOString().slice(0,10),month:d.toLocaleString('en-US',{month:'long'}),year:d.getFullYear(),invoiceNo:r.invoiceNo,amount:Number(r.totalAmount||0)}})})}catch(e){console.error(e);res.status(500).json({message:'Unable to load CashSales.'})}})
app.delete('/api/md-ceo2/cash-sales',...requireManagement,async(req,res)=>{const ids=Array.isArray(req.body?.ids)?req.body.ids.map(Number).filter(Number.isInteger):[];if(!ids.length)return res.status(400).json({message:'No CashSales were selected.'});const admin=await md2DeleteAuth(req,res);if(!admin)return;try{const r=await prisma.$transaction(async tx=>{const ss=await tx.cashSale.findMany({where:{id:{in:ids}},include:{lines:true}});for(const s of ss)for(const l of s.lines)await tx.product.update({where:{id:l.productId},data:{quantityOnHand:{increment:l.quantity}}});return tx.cashSale.deleteMany({where:{id:{in:ids}}})});await md2Audit(admin.id,'DELETE_CASHSALES_REPORT','CashSale',ids.join(','),{ids,affected:r.count,stockReversed:true});res.json({message:`${r.count} CashSales record${r.count===1?'':'s'} deleted successfully.`,count:r.count})}catch(e){console.error(e);res.status(500).json({message:'Unable to delete CashSales records.'})}})

app.get('/api/md-ceo2/nyp-sales',...requireManagement,async(_req,res)=>{try{const rs=await prisma.nypSale.findMany({select:{id:true,invoiceNo:true,saleDate:true,totalAmount:true},orderBy:[{saleDate:'asc'},{id:'asc'}]});res.json({rows:rs.map(r=>{const d=new Date(r.saleDate);return{id:r.id,date:d.toISOString().slice(0,10),month:d.toLocaleString('en-US',{month:'long'}),year:d.getFullYear(),invoiceNo:r.invoiceNo,amount:Number(r.totalAmount||0)}})})}catch(e){console.error(e);res.status(500).json({message:'Unable to load NYPSales.'})}})
app.delete('/api/md-ceo2/nyp-sales',...requireManagement,async(req,res)=>{const ids=Array.isArray(req.body?.ids)?req.body.ids.map(Number).filter(Number.isInteger):[];if(!ids.length)return res.status(400).json({message:'No NYPSales were selected.'});const admin=await md2DeleteAuth(req,res);if(!admin)return;try{const r=await prisma.$transaction(async tx=>{const ss=await tx.nypSale.findMany({where:{id:{in:ids}},include:{lines:true}});const touched=new Set<number>();for(const s of ss){touched.add(s.nypCustomerId);for(const l of s.lines)await tx.product.update({where:{id:l.productId},data:{quantityOnHand:{increment:l.quantity}}})}const del=await tx.nypSale.deleteMany({where:{id:{in:ids}}});for(const id of touched){const [s,p]=await Promise.all([tx.nypSale.aggregate({where:{nypCustomerId:id},_sum:{totalAmount:true}}),tx.nypPayment.aggregate({where:{nypCustomerId:id},_sum:{amount:true}})]);await tx.nypCustomer.update({where:{id},data:{totalSupplied:s._sum.totalAmount||0,totalPaid:p._sum.amount||0,balance:Number(s._sum.totalAmount||0)-Number(p._sum.amount||0)}})}return del});await md2Audit(admin.id,'DELETE_NYPSALES_REPORT','NypSale',ids.join(','),{ids,affected:r.count,stockReversed:true});res.json({message:`${r.count} NYPSales record${r.count===1?'':'s'} deleted successfully.`,count:r.count})}catch(e){console.error(e);res.status(500).json({message:'Unable to delete NYPSales records.'})}})

const md2Periods=async(model:any,field:string)=>{const rs=await model.findMany({select:{id:true,[field]:true}});const m=new Map<string,any>();for(const r of rs){const d=new Date(r[field]),key=`${d.getFullYear()}-${d.getMonth()+1}`;if(!m.has(key))m.set(key,{id:key,year:d.getFullYear(),month:d.getMonth()+1,monthName:d.toLocaleString('en-US',{month:'long'}),count:0});m.get(key).count++}return [...m.values()].sort((a,b)=>a.year-b.year||a.month-b.month)}
app.get('/api/md-ceo2/stock-purchases',...requireManagement,async(_req,res)=>{try{res.json({rows:await md2Periods(prisma.companyPurchase,'purchaseDate')})}catch(e){console.error(e);res.status(500).json({message:'Unable to load stock purchase periods.'})}})
app.delete('/api/md-ceo2/stock-purchases',...requireManagement,async(req,res)=>{const ps=req.body?.periods;if(!Array.isArray(ps)||!ps.length)return res.status(400).json({message:'No stock purchase periods were selected.'});const admin=await md2DeleteAuth(req,res);if(!admin)return;try{const count=await prisma.$transaction(async tx=>{let n=0;for(const p of ps){const y=Number(p.year),m=Number(p.month),start=new Date(y,m-1,1),end=new Date(y,m,0,23,59,59,999);const rs=await tx.companyPurchase.findMany({where:{purchaseDate:{gte:start,lte:end}},include:{lines:true}});for(const r of rs)for(const l of r.lines)await tx.product.update({where:{id:l.productId},data:{quantityOnHand:{decrement:l.quantity}}});n+=(await tx.companyPurchase.deleteMany({where:{purchaseDate:{gte:start,lte:end}}})).count}return n});await md2Audit(admin.id,'DELETE_STOCK_PURCHASE_REPORT','CompanyPurchase','periods',{periods:ps,affected:count,stockReversed:true});res.json({message:`${count} stock purchase record${count===1?'':'s'} deleted successfully.`,count})}catch(e){console.error(e);res.status(500).json({message:'Unable to delete stock purchases.'})}})
app.get('/api/md-ceo2/stock-adjustments',...requireManagement,async(_req,res)=>{try{res.json({rows:await md2Periods(prisma.stockAdjustment,'adjustmentDate')})}catch(e){console.error(e);res.status(500).json({message:'Unable to load stock adjustment periods.'})}})
app.delete('/api/md-ceo2/stock-adjustments',...requireManagement,async(req,res)=>{const ps=req.body?.periods;if(!Array.isArray(ps)||!ps.length)return res.status(400).json({message:'No stock adjustment periods were selected.'});const admin=await md2DeleteAuth(req,res);if(!admin)return;try{const count=await prisma.$transaction(async tx=>{let n=0;for(const p of ps){const y=Number(p.year),m=Number(p.month),start=new Date(y,m-1,1),end=new Date(y,m,0,23,59,59,999);const rs=await tx.stockAdjustment.findMany({where:{adjustmentDate:{gte:start,lte:end}},include:{lines:true}});for(const r of rs)for(const l of r.lines){const delta=r.adjustmentType==='INCREASE'?-Number(l.quantity):Number(l.quantity);await tx.product.update({where:{id:l.productId},data:{quantityOnHand:{increment:delta}}})}n+=(await tx.stockAdjustment.deleteMany({where:{adjustmentDate:{gte:start,lte:end}}})).count}return n});await md2Audit(admin.id,'DELETE_STOCK_ADJUST_REPORT','StockAdjustment','periods',{periods:ps,affected:count,stockReversed:true});res.json({message:`${count} stock adjustment record${count===1?'':'s'} deleted successfully.`,count})}catch(e){console.error(e);res.status(500).json({message:'Unable to delete stock adjustments.'})}})
app.get('/api/md-ceo2/stock-bin-card',...requireManagement,async(_req,res)=>{try{const [p,a,c,n]=await Promise.all([prisma.companyPurchase.findMany({select:{purchaseDate:true}}),prisma.stockAdjustment.findMany({select:{adjustmentDate:true}}),prisma.cashSale.findMany({select:{saleDate:true}}),prisma.nypSale.findMany({select:{saleDate:true}})]);const m=new Map<string,number>();for(const x of p){const d=new Date(x.purchaseDate).toISOString().slice(0,10);m.set(d,(m.get(d)||0)+1)}for(const x of a){const d=new Date(x.adjustmentDate).toISOString().slice(0,10);m.set(d,(m.get(d)||0)+1)}for(const x of c){const d=new Date(x.saleDate).toISOString().slice(0,10);m.set(d,(m.get(d)||0)+1)}for(const x of n){const d=new Date(x.saleDate).toISOString().slice(0,10);m.set(d,(m.get(d)||0)+1)}res.json({rows:[...m.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([date,activityCount],i)=>({id:i+1,date,activityCount}))})}catch(e){console.error(e);res.status(500).json({message:'Unable to load stock bin card dates.'})}})
app.delete('/api/md-ceo2/stock-bin-card',...requireManagement,async(_req,res)=>res.status(409).json({message:'Stock Bin Card is a calculated report. There is no separate stored report record to delete.'}))
app.get('/api/md-ceo2/account-status-analysis',...requireManagement,async(_req,res)=>res.json({rows:[]}))
app.delete('/api/md-ceo2/account-status-analysis',...requireManagement,async(_req,res)=>res.status(409).json({message:'Account Status Analysis is calculated from live account transactions. There is no separate stored report record to delete.'}))

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error)
  res.status(500).json({ message: 'Internal server error' })
})

const start = async () => {
  await ensureStockAdjustmentTable()
  await ensureStockPurchaseTable()
  await ensureOpenStockPurchaseTable()

  app.listen(port, () => {
    console.log(`The Lord's Doing backend running on http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error('Unable to start backend:', error)
  process.exit(1)
})