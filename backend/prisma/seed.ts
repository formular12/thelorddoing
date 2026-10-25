import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const banks = [
  ['00000000000000000000000000', '', '', ''],
  ['Palmpay 9550515679', 'Palmpay', '9550515679', 'Serifat Folasade Olasoko'],
  ['Opay 8033900249', 'Opay', '8033900249', 'Serifat Folasade Olasoko opay'],
  ['Access Bank The lord Doing', 'Access Bank', 'The lord Doing', '0079202063'],
  ['Zenith Bank The lord Doing Zenith', 'Zenith Bank', 'The lord Doing Zenith', '1226046759'],
  ['UBA Bank The lord Doing UBA', 'UBA Bank', 'The lord Doing UBA', '1026061796'],
  ['UNILEVER ZENITH THE LORD DOING', 'UNILEVER ZENITH', 'THE LORD DOING', '1012135427'],
  ['WAMCO UBA THE LORD DOING', 'WAMCO UBA', 'THE LORD DOING', '1022442030'],
  ['WAMCO ZENITH THE LORD DOING', 'WAMCO ZENITH', 'THE LORD DOING', '1228511680'],
  ['WAMCO ACCESS THE LORD DOING', 'WAMCO ACCESS', 'THE LORD DOING', '0697333489']
] as const

const nyp = [
  ['000000000000000000000000', '000000000000000000000000'],
  ['ARADA IYA SHALLOM PETER', 'ARADA IYA SHALLOM PETER'],
  ['FMN MAYOWA EMMANUEL', 'FMN MAYOWA EMMANUEL'],
  ['GOLDEN PENNY JAMIU', 'GOLDEN PENNY JAMIU'],
  ['GOLDEN PENNY MR JOEL', 'GOLDEN PENNY MR JOEL'],
  ['GOLDEN PENNY SHOLA', 'GOLDEN PENNY SHOLA'],
  ['IYA SAHEED ORA', 'IYA SAHEED ORA'],
  ['MR SAMSON G PENNY', 'MR SAMSON G PENNY'],
  ['MRS ABIOYE IYA OBAARA', 'MRS ABIOYE IYA OBAARA'],
  ['SEMO SHOP STAFFS', 'SEMO SHOP STAFFS'],
  ['TLD PROVISION SHOP', 'TLD PROVISION SHOP'],
  ['UNIQUE STORE AROWOMOLE', 'UNIQUE STORE AROWOMOLE'],
  ['YAH SAMAD', 'YAH SAMAD']
] as const

async function main() {
  for (const [accountId, bankName, accountName, accountNo] of banks) {
    await prisma.bankAccount.upsert({
      where: { accountId },
      update: { bankName, accountName, accountNo },
      create: { accountId, bankName, accountName, accountNo }
    })
  }

  for (const [fullName, nypId] of nyp) {
    await prisma.nypCustomer.upsert({
      where: { nypId },
      update: { fullName },
      create: { fullName, nypId }
    })
  }

  await prisma.nypCustomer.update({
    where: { nypId: 'ARADA IYA SHALLOM PETER' },
    data: {
      totalSupplied: 15056400,
      totalPaid: 0,
      balance: 15056400,
      year: 2025,
      month: 5,
      date: new Date('2025-05-28')
    }
  })

  await prisma.nypCustomer.update({
    where: { nypId: 'FMN MAYOWA EMMANUEL' },
    data: {
      totalSupplied: 483100,
      totalPaid: 0,
      balance: 483100,
      year: 2026,
      month: 9,
      date: new Date('2026-09-26')
    }
  })

  const dangote = await prisma.company.upsert({
    where: { companyId: 'DANGOTE NIG PLC' },
    update: { companyName: 'DANGOTE NIG PLC' },
    create: { companyId: 'DANGOTE NIG PLC', companyName: 'DANGOTE NIG PLC' }
  })

  const products = [
    ['DANGOTE SALT 50KG',1,16730,17000,0,0,0],
    ['DANGOTE SALT X 20',1,7480,7600,0,0,0],
    ['DANGOTE SALT X 40',1,7730,7900,0,0,0],
    ['DANGOTE SALT X 80',1,8030,8150,0,0,0],
    ['DANGOTE SUGAR 50KG',1,28300,28600,0,0,0]
  ] as const

  for (const [stockName, ctnSize, cost, sell, half, qrt, unit] of products) {
    const existing = await prisma.product.findFirst({ where: { companyId: dangote.id, stockName } })
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { ctnSize, ctnCostPrice: cost, ctnSellingPrice: sell, halfCtnSelling: half, qrtSellingPrice: qrt, unitSellingPrice: unit }
      })
    } else {
      await prisma.product.create({
        data: { companyId: dangote.id, stockName, ctnSize, ctnCostPrice: cost, ctnSellingPrice: sell, halfCtnSelling: half, qrtSellingPrice: qrt, unitSellingPrice: unit }
      })
    }
  }

  console.log('Seed completed.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
