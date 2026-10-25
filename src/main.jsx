import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'


const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
const AUTH_TOKEN_KEY = 'theLordDoingAuthToken'

const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  })

  if (response.status === 401) {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem('theLordDoingAuthUser')
  }

  return response
}

const administratorMenu = [
  'Bank Registration',
  'NYP Registration',
  'Company Registration',
  'Company Stock Adjustment',
  'Company Stock Purchase',
  'Stock Open Purchase',
  'Price Update',
  'Price List',
  'Company Goods Payment',
  'NYP Payment',
  'CashSales-Payment Status'
]

const mainMenu = [
  'Cashier',
  'CashSales',
  'NYP Sales'
]

const reports = [
  'Analysis Report',
  'Summary Report',
  'Stock Report'
]

const accounts = [
  'NYP Account',
  'Company Account',
  'Bank Analysis Report',
  'MD-CEO DESK',
  'MD-CEO DESK 2'
]

const bankAccounts = [
  'Add',
  'Palmpay 9550515679',
  'Opay 8033900249',
  'Access Bank The lord Doing',
  'Zenith Bank The lord Doing Zenith',
  'UBA Bank The lord Doing UBA',
  'UNILEVER ZENITH THE LORD DOING',
  'WAMCO UBA THE LORD DOING',
  'WAMCO ZENITH THE LORD DOING',
  'WAMCO ACCESS THE LORD DOING'
]

const bankDetails = {
  'Palmpay 9550515679': {
    bankName: 'Palmpay',
    accountName: '9550515679',
    accountNo: 'Serifat Folasade Olasoko'
  },

  'Opay 8033900249': {
    bankName: 'Opay',
    accountName: '8033900249',
    accountNo: 'Serifat Folasade Olasoko opay'
  },

  'Access Bank The lord Doing': {
    bankName: 'Access Bank',
    accountName: 'The lord Doing',
    accountNo: '0079202063'
  },

  'Zenith Bank The lord Doing Zenith': {
    bankName: 'Zenith Bank',
    accountName: 'The lord Doing Zenith',
    accountNo: '1226046759'
  },

  'UBA Bank The lord Doing UBA': {
    bankName: 'UBA Bank',
    accountName: 'The lord Doing UBA',
    accountNo: '1026061796'
  },

  'UNILEVER ZENITH THE LORD DOING': {
    bankName: 'UNILEVER ZENITH',
    accountName: 'THE LORD DOING',
    accountNo: '1012135427'
  },

  'WAMCO UBA THE LORD DOING': {
    bankName: 'WAMCO UBA',
    accountName: 'THE LORD DOING',
    accountNo: '1022442030'
  },

  'WAMCO ZENITH THE LORD DOING': {
    bankName: 'WAMCO ZENITH',
    accountName: 'THE LORD DOING',
    accountNo: '1228511680'
  },

  'WAMCO ACCESS THE LORD DOING': {
    bankName: 'WAMCO ACCESS',
    accountName: 'THE LORD DOING',
    accountNo: '0697333489'
  }
}

function Plus() {
  return <span className="menu-chevron" aria-hidden="true">›</span>
}

function Minus() {
  return <span className="menu-chevron open" aria-hidden="true">⌄</span>
}

function Monitor() {
  return (
    <div className="monitor-wrap">
      <div className="monitor">
        <div className="screen"></div>
        <div className="mlogo">C-Data</div>
      </div>

      <div className="neck"></div>
      <div className="base"></div>
    </div>
  )
}

function HomeDashboard({ onNavigate }) {
  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const kpis = [
    { label: "TODAY'S SALES", value: '—', note: 'Live sales total', action: 'CashSales' },
    { label: 'STOCK VALUE', value: '—', note: 'Current stock valuation', action: 'Stock Cost Valuation' },
    { label: 'NYP RECEIVABLES', value: '—', note: 'Outstanding customer balances', action: 'All Debtors Report' },
    { label: 'COMPANY PAYABLES', value: '—', note: 'Outstanding company balances', action: 'All Creditors Report' }
  ]

  return (
    <div className="home-dashboard">
      <div className="dashboard-heading">
        <div>
          <div className="dashboard-eyebrow">BUSINESS OVERVIEW</div>
          <h1>SEMO STORE DASHBOARD</h1>
          <p>Monitor sales, stock, accounts and business activity from one place.</p>
        </div>
        <div className="dashboard-date">{today}</div>
      </div>

      <div className="dashboard-kpis">
        {kpis.map((item) => (
          <button type="button" key={item.label} className="dashboard-kpi" onClick={() => onNavigate?.(item.action)}>
            <span className="kpi-label">{item.label}</span>
            <strong>{item.value}</strong>
            <span className="kpi-note">{item.note}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-grid dashboard-grid-main">
        <section className="dashboard-card dashboard-chart-card">
          <div className="dashboard-card-head">
            <div><span className="dashboard-card-label">PERFORMANCE</span><h2>Sales Overview</h2></div>
            <button type="button" onClick={() => onNavigate?.('CashSales')}>View Sales</button>
          </div>
          <div className="sales-placeholder">
            <div className="sales-placeholder-icon">₦</div>
            <strong>Sales analytics will appear here</strong>
            <span>Connect this dashboard to the sales records for daily and monthly performance.</span>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-head">
            <div><span className="dashboard-card-label">INVENTORY</span><h2>Stock Alerts</h2></div>
            <button type="button" onClick={() => onNavigate?.('Stock Balance')}>Stock</button>
          </div>
          <div className="alert-list">
            <div className="dashboard-alert"><span className="alert-dot neutral"></span><div><strong>Low Stock</strong><span>Live alert count will appear here</span></div></div>
            <div className="dashboard-alert"><span className="alert-dot neutral"></span><div><strong>Out of Stock</strong><span>Live alert count will appear here</span></div></div>
            <div className="dashboard-alert"><span className="alert-dot neutral"></span><div><strong>Reorder Required</strong><span>Live alert count will appear here</span></div></div>
          </div>
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="dashboard-card-head">
            <div><span className="dashboard-card-label">ACTIVITY</span><h2>Recent Transactions</h2></div>
            <button type="button" onClick={() => onNavigate?.('CashSales-Payment Status')}>Payments</button>
          </div>
          <div className="empty-dashboard-state">
            <strong>No recent transactions to display</strong>
            <span>Sales, payments and stock activity will appear here as records are created.</span>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-head">
            <div><span className="dashboard-card-label">FINANCE</span><h2>Financial Position</h2></div>
            <button type="button" onClick={() => onNavigate?.('Bank Activity Report')}>Banks</button>
          </div>
          <div className="financial-list">
            <div><span>Cash Sales</span><strong>—</strong></div>
            <div><span>NYP Payments</span><strong>—</strong></div>
            <div><span>Company Payments</span><strong>—</strong></div>
            <div><span>Bank Position</span><strong>—</strong></div>
          </div>
        </section>
      </div>

      <div className="dashboard-quick-actions">
        <div><span className="dashboard-card-label">QUICK ACCESS</span><h2>Common Operations</h2></div>
        <div className="quick-action-list">
          {['CashSales', 'NYP Sales', 'Stock Balance', 'Price Update'].map((item) => (
            <button type="button" key={item} onClick={() => onNavigate?.(item)}>{item}<span>›</span></button>
          ))}
        </div>
      </div>
    </div>
  )
}

function BankRegistration() {
  const [bankAccount, setBankAccount] = useState('')
  const [banks, setBanks] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showBankList, setShowBankList] = useState(false)
  const [form, setForm] = useState({
    bankName: '',
    accountName: '',
    accountNo: ''
  })

  const now = new Date()
  const year = now.getFullYear()
  const month = now.toLocaleString('en-US', { month: 'long' })
  const date = now.toISOString().slice(0, 10)

  useEffect(() => {
    let cancelled = false

    const loadNypCustomers = async () => {
    try {
      const response = await apiFetch('/api/cashier/nyp-customers')
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to load NYP accounts.')
      setNypCustomers(data.customers || [])
    } catch (error) {
      setNypCustomers([])
      setMessage(error.message || 'Unable to load NYP accounts.')
      setMessageType('error')
    }
  }

  const loadBanks = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await apiFetch('/api/banks')
        if (!response.ok) throw new Error('Unable to load bank accounts')

        const data = await response.json()
        if (!cancelled) setBanks(data)
      } catch {
        if (!cancelled) setError('Unable to connect to the backend.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadBanks()
    return () => { cancelled = true }
  }, [])

  const resetScreen = () => {
    setBankAccount('')
    setShowBankList(false)
    setSubmitted(false)
    setError('')
    setForm({ bankName: '', accountName: '', accountNo: '' })
  }

  const handleBankChange = (event) => {
    const value = event.target.value
    setBankAccount(value)
    setSubmitted(false)
    setError('')

    if (value === 'new') {
      setForm({ bankName: '', accountName: '', accountNo: '' })
    }
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setSubmitted(false)
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.bankName.trim() || !form.accountName.trim() || !form.accountNo.trim()) {
      setError('Please complete the bank details.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSubmitted(false)

      const response = await apiFetch('/api/banks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: `${form.bankName.trim()} ${form.accountName.trim()}`,
          bankName: form.bankName.trim(),
          accountName: form.accountName.trim(),
          accountNo: form.accountNo.trim(),
          year,
          month: now.getMonth() + 1,
          date
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to save bank details')
      }

      setBanks((current) => [...current, data])
      setBankAccount(data.accountId)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save bank details')
    } finally {
      setSaving(false)
    }
  }

  const openBankList = () => {
    setShowBankList(true)
    setBankAccount('')
    setSubmitted(false)
    setError('')
  }

  const selectedBank = banks.find((bank) => bank.accountId === bankAccount)

  const headerCellStyle = {
    background: '#148dc1',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '9px 10px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    textAlign: 'left'
  }

  const cellStyle = {
    padding: '9px 10px',
    borderBottom: '1px solid #dbe5ec',
    color: '#243b53',
    fontSize: '13px'
  }

  const inputStyle = {
    width: '100%',
    height: '36px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '5px',
    background: '#ffffff',
    padding: '6px 9px',
    color: '#173f7a',
    fontSize: '14px',
    outline: 'none'
  }

  const backButton = (
    <button
      type="button"
      onClick={resetScreen}
      style={{
        border: '1px solid #cbd5e1',
        background: '#ffffff',
        color: '#173f7a',
        borderRadius: '5px',
        padding: '7px 12px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      ← Back
    </button>
  )

  if (showBankList) {
    return (
      <div className="bank-page">
        <div className="screen-heading">
          <a href="#bank-registration" onClick={(event) => { event.preventDefault(); resetScreen() }}>
            BANK DETAILS REGISTRATION SCREEN
          </a>
          <a href="#bank-list" className="list-link">Bank Details List</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
          {backButton}
          <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: 'bold', fontSize: '15px' }}>
            BANK DETAILS LIST
          </div>
          <div style={{ width: '72px' }} />
        </div>

        <div
          style={{
            width: '96%',
            margin: '0 auto',
            border: '1px solid #dbe5ec',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,.06)'
          }}
        >
          <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
            Bank Details
          </div>

          <div style={{ maxHeight: '55vh', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: '760px' }}>
              <thead>
                <tr>
                  <th style={{ ...headerCellStyle, width: '55px' }}>S/N</th>
                  <th style={headerCellStyle}>Bank Name</th>
                  <th style={headerCellStyle}>Account Name</th>
                  <th style={headerCellStyle}>Account No.</th>
                  <th style={headerCellStyle}>Account Balance</th>
                  <th style={headerCellStyle}>Date Updated</th>
                </tr>
              </thead>
              <tbody>
                {banks.map((bank, index) => (
                  <tr key={bank.id || `${bank.accountId}-${index}`}>
                    <td style={{ ...cellStyle, color: '#d90000', width: '55px' }}>{index + 1}</td>
                    <td style={cellStyle}>{bank.bankName}</td>
                    <td style={cellStyle}>{bank.accountName}</td>
                    <td style={cellStyle}>{bank.accountNo}</td>
                    <td style={cellStyle}>—</td>
                    <td style={cellStyle}>
                      {bank.date ? new Date(bank.date).toISOString().slice(0, 10) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && <div className="saved">Loading bank details...</div>}
          {error && <div className="saved">{error}</div>}
          {!loading && !banks.length && !error && (
            <div className="saved">No bank accounts found.</div>
          )}
        </div>
      </div>
    )
  }

  if (bankAccount === 'new') {
    return (
      <div className="bank-page">
        <div className="screen-heading">
          <a href="#bank-registration">BANK DETAILS REGISTRATION SCREEN</a>
          <a href="#bank-list" className="list-link" onClick={openBankList}>Bank Details List</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
          {backButton}
          <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: 'bold', fontSize: '15px' }}>
            BANK DETAILS REGISTRATION
          </div>
          <div style={{ width: '72px' }} />
        </div>

        <div
          style={{
            width: '620px',
            maxWidth: '94%',
            margin: '10px auto',
            border: '1px solid #dbe5ec',
            borderRadius: '8px',
            background: '#f8fbfd',
            boxShadow: '0 2px 8px rgba(0,0,0,.06)',
            overflow: 'hidden'
          }}
        >
          <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
            Bank Details Registration
          </div>

          <div style={{ padding: '18px 22px' }}>
            {[
              ['Bank Name', 'bankName'],
              ['Account Name', 'accountName'],
              ['Account No.', 'accountNo']
            ].map(([label, name]) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ color: '#168ac0', fontWeight: 'bold', textAlign: 'right' }}>{label}</label>
                <input name={name} value={form[name]} onChange={handleFormChange} style={inputStyle} />
              </div>
            ))}

            {[
              ['Year', year],
              ['Month', month],
              ['Date', date]
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ color: '#168ac0', fontWeight: 'bold', textAlign: 'right' }}>{label}</label>
                <input value={value} readOnly style={inputStyle} />
              </div>
            ))}

            <button type="button" className="submit" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : 'Submit'}
            </button>

            {error && <div className="saved">{error}</div>}
            {submitted && <div className="saved">Submitted.</div>}
          </div>
        </div>
      </div>
    )
  }

  if (selectedBank) {
    return (
      <div className="bank-page">
        <div className="screen-heading">
          <a href="#bank-registration">BANK DETAILS REGISTRATION SCREEN</a>
          <a href="#bank-list" className="list-link" onClick={openBankList}>Bank Details List</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
          {backButton}
          <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: 'bold', fontSize: '15px' }}>
            BANK DETAILS
          </div>
          <div style={{ width: '72px' }} />
        </div>

        <div
          style={{
            width: '620px',
            maxWidth: '94%',
            margin: '10px auto',
            border: '1px solid #dbe5ec',
            borderRadius: '8px',
            background: '#f8fbfd',
            boxShadow: '0 2px 8px rgba(0,0,0,.06)',
            overflow: 'hidden'
          }}
        >
          <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
            Bank Account Details
          </div>

          <div style={{ padding: '18px 22px' }}>
            {[
              ['Bank Name', selectedBank.bankName],
              ['Account Name', selectedBank.accountName],
              ['Account No.', selectedBank.accountNo],
              ['Date Registered', selectedBank.date ? new Date(selectedBank.date).toISOString().slice(0, 10) : '']
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ color: '#168ac0', fontWeight: 'bold', textAlign: 'right' }}>{label}</label>
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', background: '#f1f5f9' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bank-page">
      <div className="screen-heading">
        <a href="#bank-registration">BANK DETAILS REGISTRATION SCREEN</a>
        <a href="#bank-list" className="list-link" onClick={openBankList}>Bank Details List</a>
      </div>

      <div style={{ color: '#d90000', fontWeight: 'bold', textAlign: 'center', padding: '10px 0 8px', fontSize: '15px' }}>
        BANK DETAILS REGISTRATION
      </div>

      <div
        style={{
          width: '62%',
          minWidth: '520px',
          margin: '10px auto',
          border: '1px solid #dbe5ec',
          borderRadius: '8px',
          background: '#f8fbfd',
          boxShadow: '0 2px 8px rgba(0,0,0,.06)',
          overflow: 'hidden'
        }}
      >
        <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
          List of Bank Accounts
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '18px' }}>
          <label style={{ color: '#168ac0', fontWeight: 'bold' }}>Bank Account ID:</label>

          <select
            value={bankAccount}
            onChange={handleBankChange}
            disabled={loading}
            style={{
              width: '330px',
              height: '34px',
              border: '1px solid #cbd5e1',
              borderRadius: '5px',
              background: '#fff',
              color: '#173f7a',
              fontWeight: 'bold',
              padding: '0 8px'
            }}
          >
            <option value="">------------Select------------</option>
            <option value="new">Add</option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.accountId}>
                {bank.accountId}
              </option>
            ))}
          </select>
        </div>

        {loading && <div className="saved">Loading bank accounts...</div>}
        {error && <div className="saved">{error}</div>}
      </div>
    </div>
  )
}

function NYPRegistration() {
  const [nypAccount, setNypAccount] = useState('')
  const [nypCustomers, setNypCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showNypList, setShowNypList] = useState(false)
  const [form, setForm] = useState({ fullName: '', nypId: '' })

  const now = new Date()
  const year = now.getFullYear()
  const month = now.toLocaleString('en-US', { month: 'long' })
  const date = now.toISOString().slice(0, 10)

  useEffect(() => {
    let cancelled = false

    const loadNypCustomers = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await apiFetch('/api/nyp')
        if (!response.ok) throw new Error('Unable to load NYP accounts')

        const data = await response.json()
        if (!cancelled) setNypCustomers(data)
      } catch {
        if (!cancelled) setError('Unable to connect to the backend.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadNypCustomers()
    return () => { cancelled = true }
  }, [])

  const resetScreen = () => {
    setNypAccount('')
    setShowNypList(false)
    setSubmitted(false)
    setError('')
    setForm({ fullName: '', nypId: '' })
  }

  const handleNypChange = (event) => {
    const value = event.target.value
    setNypAccount(value)
    setSubmitted(false)
    setError('')
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setSubmitted(false)
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.nypId.trim()) {
      setError('Please complete the NYP details.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSubmitted(false)

      const response = await apiFetch('/api/nyp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          nypId: form.nypId.trim(),
          year,
          month: now.getMonth() + 1,
          date
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to create NYP account')
      }

      setNypCustomers((current) => [...current, data])
      setNypAccount(data.nypId)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create NYP account')
    } finally {
      setSaving(false)
    }
  }

  const openNypList = () => {
    setShowNypList(true)
    setNypAccount('')
    setSubmitted(false)
    setError('')
  }

  const selectedCustomer = nypCustomers.find((customer) => customer.nypId === nypAccount)

  const headerCellStyle = {
    background: '#148dc1',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '9px 10px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    textAlign: 'left'
  }

  const cellStyle = {
    padding: '9px 10px',
    borderBottom: '1px solid #dbe5ec',
    color: '#243b53',
    fontSize: '13px'
  }

  const inputStyle = {
    width: '100%',
    height: '36px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '5px',
    background: '#ffffff',
    padding: '6px 9px',
    color: '#173f7a',
    fontSize: '14px',
    outline: 'none'
  }

  const backButton = (
    <button
      type="button"
      onClick={resetScreen}
      style={{
        border: '1px solid #cbd5e1',
        background: '#ffffff',
        color: '#173f7a',
        borderRadius: '5px',
        padding: '7px 12px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      ← Back
    </button>
  )

  if (showNypList) {
    return (
      <div className="bank-page">
        <div className="screen-heading">
          <a href="#nyp-registration" onClick={(event) => { event.preventDefault(); resetScreen() }}>
            NYP REGISTRATION SCREEN
          </a>
          <a href="#nyp-list" className="list-link">NYP Account List</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
          {backButton}
          <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: 'bold', fontSize: '15px' }}>
            NYP ACCOUNT LIST
          </div>
          <div style={{ width: '72px' }} />
        </div>

        <div
          style={{
            width: '96%',
            margin: '0 auto',
            border: '1px solid #dbe5ec',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,.06)'
          }}
        >
          <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
            NYP Accounts
          </div>

          <div style={{ maxHeight: '55vh', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: '760px' }}>
              <thead>
                <tr>
                  <th style={{ ...headerCellStyle, width: '55px' }}>S/N</th>
                  <th style={headerCellStyle}>Full Name</th>
                  <th style={headerCellStyle}>NYP ID</th>
                  <th style={headerCellStyle}>Date of Reg</th>
                </tr>
              </thead>
              <tbody>
                {nypCustomers.map((customer, index) => (
                  <tr key={customer.id || `${customer.nypId}-${index}`}>
                    <td style={{ ...cellStyle, color: '#d90000', width: '55px' }}>{index + 1}</td>
                    <td style={cellStyle}>{customer.fullName}</td>
                    <td style={cellStyle}>{customer.nypId}</td>
                    <td style={cellStyle}>
                      {customer.date ? new Date(customer.date).toISOString().slice(0, 10) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && <div className="saved">Loading NYP accounts...</div>}
          {error && <div className="saved">{error}</div>}
          {!loading && !nypCustomers.length && !error && (
            <div className="saved">No NYP accounts found.</div>
          )}
        </div>
      </div>
    )
  }

  if (nypAccount === 'new') {
    return (
      <div className="bank-page">
        <div className="screen-heading">
          <a href="#nyp-registration">NYP REGISTRATION SCREEN</a>
          <a href="#nyp-list" className="list-link" onClick={openNypList}>NYP Account List</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
          {backButton}
          <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: 'bold', fontSize: '15px' }}>
            NYP REGISTRATION
          </div>
          <div style={{ width: '72px' }} />
        </div>

        <div
          style={{
            width: '620px',
            maxWidth: '94%',
            margin: '10px auto',
            border: '1px solid #dbe5ec',
            borderRadius: '8px',
            background: '#f8fbfd',
            boxShadow: '0 2px 8px rgba(0,0,0,.06)',
            overflow: 'hidden'
          }}
        >
          <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
            NYP Registration
          </div>

          <div style={{ padding: '18px 22px' }}>
            {[
              ['Full Name', 'fullName'],
              ['NYP ID', 'nypId']
            ].map(([label, name]) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ color: '#168ac0', fontWeight: 'bold', textAlign: 'right' }}>{label}</label>
                <input name={name} value={form[name]} onChange={handleFormChange} style={inputStyle} />
              </div>
            ))}

            {[
              ['Year', year],
              ['Month', month],
              ['Date', date]
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ color: '#168ac0', fontWeight: 'bold', textAlign: 'right' }}>{label}</label>
                <input value={value} readOnly style={inputStyle} />
              </div>
            ))}

            <button type="button" className="submit" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : 'Submit'}
            </button>

            {error && <div className="saved">{error}</div>}
            {submitted && <div className="saved">Submitted.</div>}
          </div>
        </div>
      </div>
    )
  }

  if (selectedCustomer) {
    return (
      <div className="bank-page">
        <div className="screen-heading">
          <a href="#nyp-registration">NYP REGISTRATION SCREEN</a>
          <a href="#nyp-list" className="list-link" onClick={openNypList}>NYP Account List</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
          {backButton}
          <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: 'bold', fontSize: '15px' }}>
            NYP ACCOUNT DETAILS
          </div>
          <div style={{ width: '72px' }} />
        </div>

        <div
          style={{
            width: '680px',
            maxWidth: '94%',
            margin: '10px auto',
            border: '1px solid #dbe5ec',
            borderRadius: '8px',
            background: '#f8fbfd',
            boxShadow: '0 2px 8px rgba(0,0,0,.06)',
            overflow: 'hidden'
          }}
        >
          <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
            Account Summary
          </div>

          <div style={{ padding: '18px 22px' }}>
            {[
              ['Full Name', selectedCustomer.fullName],
              ['NYP ID', selectedCustomer.nypId],
              ['Total Supplied AMT', '0.00'],
              ['Total Paid AMT', '0.00'],
              ['New Payment', '0.00'],
              ['To Balance AMT', '0.00'],
              ['Date of Reg', selectedCustomer.date ? new Date(selectedCustomer.date).toISOString().slice(0, 10) : '']
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ color: '#168ac0', fontWeight: 'bold', textAlign: 'right' }}>{label}</label>
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', background: '#f1f5f9' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bank-page">
      <div className="screen-heading">
        <a href="#nyp-registration">NYP REGISTRATION SCREEN</a>
        <a href="#nyp-list" className="list-link" onClick={openNypList}>NYP Account List</a>
      </div>

      <div style={{ color: '#d90000', fontWeight: 'bold', textAlign: 'center', padding: '10px 0 8px', fontSize: '15px' }}>
        NYP REGISTRATION
      </div>

      <div
        style={{
          width: '62%',
          minWidth: '520px',
          margin: '10px auto',
          border: '1px solid #dbe5ec',
          borderRadius: '8px',
          background: '#f8fbfd',
          boxShadow: '0 2px 8px rgba(0,0,0,.06)',
          overflow: 'hidden'
        }}
      >
        <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
          List of NYP Accounts
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '18px' }}>
          <label style={{ color: '#168ac0', fontWeight: 'bold' }}>NYP ID:</label>

          <select
            value={nypAccount}
            onChange={handleNypChange}
            disabled={loading}
            style={{
              width: '330px',
              height: '34px',
              border: '1px solid #cbd5e1',
              borderRadius: '5px',
              background: '#fff',
              color: '#173f7a',
              fontWeight: 'bold',
              padding: '0 8px'
            }}
          >
            <option value="">------------Select------------</option>
            <option value="new">Add</option>
            {nypCustomers.map((customer) => (
              <option key={customer.id} value={customer.nypId}>
                {customer.nypId}
              </option>
            ))}
          </select>
        </div>

        {loading && <div className="saved">Loading NYP accounts...</div>}
        {error && <div className="saved">{error}</div>}
      </div>
    </div>
  )
}

function CompanyRegistration() {
  const [companyId, setCompanyId] = useState('')
  const [newCompanyId, setNewCompanyId] = useState('')
  const [companies, setCompanies] = useState([])
  const [rows, setRows] = useState([])
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const now = new Date()

  const year = now.getFullYear()

  const month = now.toLocaleString('en-US', {
    month: 'long'
  })

  const date = now.toISOString().slice(0, 10)

  const emptyRow = () => ({
    stockName: '',
    ctnSize: '',
    ctnCostPrice: '',
    ctnSellingPrice: '',
    halfCtnSellingPrice: '',
    qrtSellingPrice: '',
    unitSellingPrice: ''
  })

  const createBlankRows = (count) =>
    Array.from({ length: count }, () => emptyRow())

  const toFrontendRow = (product) => ({
    stockName: product.stockName ?? '',
    ctnSize: product.ctnSize ?? '',
    ctnCostPrice: product.ctnCostPrice ?? '',
    ctnSellingPrice: product.ctnSellingPrice ?? '',
    halfCtnSellingPrice: product.halfCtnSelling ?? '',
    qrtSellingPrice: product.qrtSellingPrice ?? '',
    unitSellingPrice: product.unitSellingPrice ?? ''
  })

  useEffect(() => {
    let cancelled = false

    const loadCompanies = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await apiFetch('/api/companies')

        if (!response.ok) {
          throw new Error('Unable to load companies')
        }

        const data = await response.json()

        if (!cancelled) {
          setCompanies(data)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to connect to the backend.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadCompanies()

    return () => {
      cancelled = true
    }
  }, [])

  const goBack = () => {
    setCompanyId('')
    setNewCompanyId('')
    setCompanyName('')
    setRows([])
    setError('')
    setMessage('')
  }

  const handleCompanyChange = async (event) => {
    const value = event.target.value

    setCompanyId(value)
    setError('')
    setMessage('')

    if (!value) {
      setCompanyName('')
      setRows([])
      return
    }

    if (value === 'new') {
      setCompanyName('')
      setNewCompanyId('')
      setRows(createBlankRows(1))
      return
    }

    const company = companies.find(
      (item) => item.companyId === value
    )

    if (company) {
      setCompanyName(company.companyName)
      setRows(
        company.products?.length
          ? company.products.map(toFrontendRow)
          : createBlankRows(1)
      )
    }
  }

  const updateRow = (index, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: value }
          : row
      )
    )
    setMessage('')
    setError('')
  }

  const addMoreRows = () => {
    setRows((currentRows) => [
      ...currentRows,
      ...createBlankRows(3)
    ])
  }

  const handleSubmit = async () => {
    const trimmedCompanyName = companyName.trim()
    const trimmedCompanyId = companyId === 'new'
      ? newCompanyId.trim()
      : companyId.trim()

    if (!trimmedCompanyName || !trimmedCompanyId) {
      setError('Please enter the Company Name and Company ID.')
      setMessage('')
      return
    }

    const products = rows
      .filter((row) => row.stockName.trim())
      .map((row) => ({
        stockName: row.stockName.trim(),
        ctnSize: Number(row.ctnSize || 0),
        ctnCostPrice: Number(row.ctnCostPrice || 0),
        ctnSellingPrice: Number(row.ctnSellingPrice || 0),
        halfCtnSelling: Number(row.halfCtnSellingPrice || 0),
        qrtSellingPrice: Number(row.qrtSellingPrice || 0),
        unitSellingPrice: Number(row.unitSellingPrice || 0)
      }))

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const isNew = companyId === 'new'

      const response = await apiFetch(
        isNew
          ? '/api/companies'
          : `/api/companies/${companies.find((item) => item.companyId === companyId)?.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            companyId: trimmedCompanyId,
            companyName: trimmedCompanyName,
            year,
            month: now.getMonth() + 1,
            date,
            products
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.message || 'Unable to save company'
        )
      }

      if (isNew) {
        setCompanies((current) => [...current, data])
        setCompanyId(data.companyId)
        setNewCompanyId('')
        setCompanyName(data.companyName)
        setRows(
          data.products?.length
            ? data.products.map(toFrontendRow)
            : createBlankRows(1)
        )
      } else {
        setCompanies((current) =>
          current.map((item) =>
            item.id === data.id ? data : item
          )
        )
        setRows(
          data.products?.length
            ? data.products.map(toFrontendRow)
            : createBlankRows(1)
        )
      }

      setMessage(isNew ? 'Company saved.' : 'Company updated.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save company'
      )
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    height: '34px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '5px',
    background: '#ffffff',
    padding: '5px 8px',
    color: '#173f7a',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    outline: 'none'
  }

  const headerCellStyle = {
    background: '#148dc1',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '9px 8px',
    borderRight: '1px solid rgba(255,255,255,.35)',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    textAlign: 'left'
  }

  const cellStyle = {
    padding: '5px',
    verticalAlign: 'middle',
    borderBottom: '1px solid #dbe5ec'
  }

  if (companyId) {
    const isNew = companyId === 'new'

    return (
      <div className="company-page">

        <div className="screen-heading">
          <a href="#company-registration">
            COMPANY AND STOCK NAME REGISTRATION SCREEN
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '8px 12px'
          }}
        >
          <button
            type="button"
            onClick={goBack}
            style={{
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#173f7a',
              borderRadius: '5px',
              padding: '7px 12px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Back
          </button>

          <div
            style={{
              color: '#d90000',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '15px',
              flex: 1
            }}
          >
            COMPANY AND STOCK NAME REGISTRATION
          </div>

          <div style={{ width: '72px' }} />
        </div>

        <div
          style={{
            width: '96%',
            margin: '0 auto',
            border: '1px solid #dbe5ec',
            borderRadius: '8px',
            background: '#f8fbfd',
            boxSizing: 'border-box',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,.06)'
          }}
        >

          <div
            style={{
              background: '#148dc1',
              color: '#ffffff',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '9px',
              fontSize: '14px'
            }}
          >
            Company and Stock Details
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.7fr .8fr 1fr 1fr',
              gap: '10px',
              padding: '12px'
            }}
          >
            <div>
              <div className="company-field-label">Company Name</div>
              <input
                type="text"
                value={companyName}
                onChange={(event) => {
                  setCompanyName(event.target.value)
                  setMessage('')
                  setError('')
                }}
                style={inputStyle}
                placeholder="Company name"
              />
            </div>

            <div>
              <div className="company-field-label">Company ID</div>
              <input
                type="text"
                value={isNew ? newCompanyId : companyId}
                onChange={(event) => {
                  if (isNew) {
                    setNewCompanyId(event.target.value)
                  }
                  setMessage('')
                  setError('')
                }}
                readOnly={!isNew}
                style={inputStyle}
                placeholder="Company ID"
              />
            </div>

            <div>
              <div className="company-field-label">Year</div>
              <input
                type="text"
                value={year}
                readOnly
                style={inputStyle}
              />
            </div>

            <div>
              <div className="company-field-label">Month</div>
              <input
                type="text"
                value={month}
                readOnly
                style={inputStyle}
              />
            </div>

            <div>
              <div className="company-field-label">Date</div>
              <input
                type="text"
                value={date}
                readOnly
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              margin: '0 12px',
              border: '1px solid #dbe5ec',
              borderRadius: '6px',
              overflow: 'auto',
              maxHeight: '52vh',
              background: '#ffffff'
            }}
          >
            <table
              style={{
                width: '100%',
                minWidth: '1080px',
                borderCollapse: 'separate',
                borderSpacing: 0,
                tableLayout: 'fixed'
              }}
            >
              <colgroup>
                <col style={{ width: '55px' }} />
                <col style={{ width: '27%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
              </colgroup>

              <thead>
                <tr>
                  <th style={headerCellStyle}>S/N</th>
                  <th style={headerCellStyle}>Stock Name</th>
                  <th style={headerCellStyle}>CTN Size</th>
                  <th style={headerCellStyle}>CTN Cost Price</th>
                  <th style={headerCellStyle}>CTN Selling Price</th>
                  <th style={headerCellStyle}>Half CTN Selling</th>
                  <th style={headerCellStyle}>QRT Selling</th>
                  <th style={headerCellStyle}>Unit Selling</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        ...cellStyle,
                        color: '#64748b',
                        fontSize: '13px',
                        textAlign: 'center'
                      }}
                    >
                      {index + 1}
                    </td>

                    {[
                      ['stockName', 'text'],
                      ['ctnSize', 'number'],
                      ['ctnCostPrice', 'number'],
                      ['ctnSellingPrice', 'number'],
                      ['halfCtnSellingPrice', 'number'],
                      ['qrtSellingPrice', 'number'],
                      ['unitSellingPrice', 'number']
                    ].map(([field, type]) => (
                      <td style={cellStyle} key={field}>
                        <input
                          type={type}
                          min={type === 'number' ? '0' : undefined}
                          step={type === 'number' ? '0.01' : undefined}
                          value={row[field]}
                          onChange={(event) =>
                            updateRow(
                              index,
                              field,
                              event.target.value
                            )
                          }
                          style={inputStyle}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              padding: '12px'
            }}
          >
            <button
              type="button"
              onClick={addMoreRows}
              style={{
                border: '1px solid #148dc1',
                background: '#ffffff',
                color: '#148dc1',
                borderRadius: '5px',
                padding: '8px 14px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              + Add 3 Rows
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="submit"
            >
              {saving ? 'Saving...' : isNew ? 'Save Company' : 'Save Changes'}
            </button>
          </div>

          {error && (
            <div className="saved" style={{ marginBottom: '10px' }}>
              {error}
            </div>
          )}

          {message && (
            <div className="saved" style={{ marginBottom: '10px' }}>
              {message}
            </div>
          )}

        </div>
      </div>
    )
  }

  return (
    <div className="company-page">

      <div className="screen-heading">
        <a href="#company-registration">
          COMPANY AND STOCK NAME REGISTRATION SCREEN
        </a>
      </div>

      <div
        style={{
          color: '#d90000',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '10px 0 8px',
          fontSize: '15px'
        }}
      >
        COMPANY AND STOCK NAME REGISTRATION
      </div>

      <div
        style={{
          width: '62%',
          minWidth: '520px',
          margin: '10px auto',
          border: '1px solid #dbe5ec',
          borderRadius: '8px',
          background: '#f8fbfd',
          boxShadow: '0 2px 8px rgba(0,0,0,.06)',
          overflow: 'hidden'
        }}
      >

        <div
          style={{
            background: '#148dc1',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '9px'
          }}
        >
          List of Companies
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '18px'
          }}
        >
          <label
            style={{
              color: '#168ac0',
              fontWeight: 'bold'
            }}
          >
            Company ID:
          </label>

          <select
            value={companyId}
            onChange={handleCompanyChange}
            disabled={loading}
            style={{
              width: '300px',
              height: '34px',
              border: '1px solid #cbd5e1',
              borderRadius: '5px',
              background: '#ffffff',
              color: '#173f7a',
              fontWeight: 'bold',
              padding: '0 8px'
            }}
          >
            <option value="">
              ------------Select------------
            </option>

            <option value="new">
              Add
            </option>

            {companies.map((company) => (
              <option
                key={company.id}
                value={company.companyId}
              >
                {company.companyId}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="saved">
            Loading companies...
          </div>
        )}

        {error && (
          <div className="saved">
            {error}
          </div>
        )}

      </div>
    </div>
  )
}

function CompanyStockAdjustment() {
  const [companyId, setCompanyId] = useState('')
  const [companies, setCompanies] = useState([])
  const [products, setProducts] = useState([])
  const [adjustments, setAdjustments] = useState({})
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [adjustmentMeta] = useState(() => {
    const createdAt = new Date()
    const year = createdAt.getFullYear()
    const month = createdAt.toLocaleString('en-US', { month: 'long' })
    const date = createdAt.toISOString().slice(0, 10)
    const refNo = `ADJ-${date.replace(/-/g, '')}-${String(createdAt.getHours()).padStart(2, '0')}${String(createdAt.getMinutes()).padStart(2, '0')}${String(createdAt.getSeconds()).padStart(2, '0')}`

    return {
      year,
      month,
      date,
      monthNumber: createdAt.getMonth() + 1,
      refNo,
      entryStaff: (() => {
        try {
          const user = JSON.parse(localStorage.getItem('theLordDoingAuthUser') || 'null')
          return user?.displayName || user?.username || ''
        } catch {
          return ''
        }
      })()
    }
  })

  const { year, month, date, monthNumber, refNo, entryStaff } = adjustmentMeta

  useEffect(() => {
    let cancelled = false

    const loadCompanies = async () => {
      try {
        setLoadingCompanies(true)
        setError('')

        const response = await apiFetch('/api/companies')
        if (!response.ok) throw new Error('Unable to load companies')

        const data = await response.json()
        if (!cancelled) setCompanies(data)
      } catch {
        if (!cancelled) setError('Unable to connect to the backend.')
      } finally {
        if (!cancelled) setLoadingCompanies(false)
      }
    }

    loadCompanies()
    return () => { cancelled = true }
  }, [])

  const loadProducts = async (selectedCompanyId) => {
    if (!selectedCompanyId) {
      setProducts([])
      setAdjustments({})
      return
    }

    try {
      setLoadingProducts(true)
      setError('')
      setMessage('')

      const response = await apiFetch(
        `/api/stock-adjustments?companyId=${encodeURIComponent(selectedCompanyId)}`
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to load stock')

      setProducts(data.products || [])
      setAdjustments({})
    } catch (err) {
      setProducts([])
      setAdjustments({})
      setError(err instanceof Error ? err.message : 'Unable to load stock')
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleCompanyChange = async (event) => {
    const value = event.target.value
    setCompanyId(value)
    setError('')
    setMessage('')
    await loadProducts(value)
  }

  const goBack = () => {
    setCompanyId('')
    setProducts([])
    setAdjustments({})
    setError('')
    setMessage('')
  }

  const updateAdjustment = (productId, field, value) => {
    setAdjustments((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value
      }
    }))
    setError('')
    setMessage('')
  }

  const getAdjustment = (productId, field) =>
    adjustments[productId]?.[field] ?? ''

  const handleSave = async () => {
    const items = products
      .map((product) => ({
        productId: product.id,
        addedCtnQty: Number(getAdjustment(product.id, 'addedCtn') || 0),
        addedUnitQty: Number(getAdjustment(product.id, 'addedUnit') || 0)
      }))
      .filter((item) => item.addedCtnQty > 0 || item.addedUnitQty > 0)

    if (!items.length) {
      setError('Enter at least one quantity to adjust before saving.')
      setMessage('')
      return
    }

    if (items.some((item) => !Number.isFinite(item.addedCtnQty) || !Number.isFinite(item.addedUnitQty))) {
      setError('Please enter valid quantities.')
      setMessage('')
      return
    }

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const response = await apiFetch('/api/stock-adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          refNo,
          entryStaff,
          year,
          month: monthNumber,
          date,
          items
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to save stock adjustment')

      setProducts(data.products || [])
      setAdjustments({})
      setMessage(`Stock adjustment saved successfully. Reference: ${data.refNo}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save stock adjustment')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    height: '36px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '5px',
    background: '#ffffff',
    padding: '6px 9px',
    color: '#173f7a',
    fontSize: '14px',
    outline: 'none'
  }

  const headerCellStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 3,
    background: '#148dc1',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '10px 9px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    textAlign: 'left',
    borderRight: '1px solid rgba(255,255,255,.35)'
  }

  const cellStyle = {
    padding: '7px 8px',
    borderBottom: '1px solid #e2e8f0',
    color: '#243b53',
    fontSize: '13px',
    verticalAlign: 'middle'
  }

  const selectedCompany = companies.find((company) => company.companyId === companyId)

  if (!companyId) {
    return (
      <div className="company-page">
        <div className="screen-heading">
          <a href="#stock-adjustment">STOCK ADJUSTMENT SCREEN</a>
        </div>

        <div style={{ color: '#d90000', fontWeight: 'bold', textAlign: 'center', padding: '10px 0 8px', fontSize: '15px' }}>
          STOCK ADJUSTMENT
        </div>

        <div style={{
          width: '620px',
          maxWidth: '94%',
          margin: '10px auto',
          border: '1px solid #dbe5ec',
          borderRadius: '8px',
          background: '#f8fbfd',
          boxShadow: '0 2px 8px rgba(0,0,0,.06)',
          overflow: 'hidden'
        }}>
          <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
            Select Company
          </div>

          <div style={{ padding: '20px 22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px', alignItems: 'center' }}>
              <label style={{ color: '#168ac0', fontWeight: 'bold', textAlign: 'right' }}>Company ID</label>
              <select
                value={companyId}
                onChange={handleCompanyChange}
                disabled={loadingCompanies}
                style={inputStyle}
              >
                <option value="">------------Select------------</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.companyId}>
                    {company.companyId}
                  </option>
                ))}
              </select>
            </div>

            {loadingCompanies && <div className="saved">Loading companies...</div>}
            {error && <div className="saved">{error}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="company-page">
      <div className="screen-heading">
        <a href="#stock-adjustment">STOCK ADJUSTMENT SCREEN</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
        <button
          type="button"
          onClick={goBack}
          style={{
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#173f7a',
            borderRadius: '5px',
            padding: '7px 12px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Back
        </button>
        <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: 'bold', fontSize: '15px' }}>
          STOCK ADJUSTMENT
        </div>
        <div style={{ width: '72px' }} />
      </div>

      <div style={{
        width: '96%',
        margin: '0 auto',
        border: '1px solid #dbe5ec',
        borderRadius: '8px',
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,.06)',
        overflow: 'hidden'
      }}>
        <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
          Stock Adjustment — {selectedCompany?.companyName || companyId}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1.6fr .7fr .8fr .9fr',
          gap: '8px',
          padding: '14px',
          background: '#f8fbfd',
          borderBottom: '1px solid #e2e8f0'
        }}>
          {[
            ['Ref No', refNo],
            ['Entry Staff', entryStaff],
            ['Company ID', companyId],
            ['Year', year],
            ['Month', month],
            ['Date', date]
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ color: '#168ac0', fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}>{label}</div>
              <input value={value} readOnly style={{ ...inputStyle, background: '#f1f5f9' }} />
            </div>
          ))}
        </div>

        <div style={{ maxHeight: '58vh', overflow: 'auto' }}>
          <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ ...headerCellStyle, width: '50px' }}>S/N</th>
                <th style={headerCellStyle}>Stock Balance</th>
                <th style={{ ...headerCellStyle, minWidth: '320px' }}>Stock Name</th>
                <th style={headerCellStyle}>CTN Size</th>
                <th style={headerCellStyle}>CTN Cost Price</th>
                <th style={{ ...headerCellStyle, minWidth: '125px' }}>Added CTN Qty</th>
                <th style={{ ...headerCellStyle, minWidth: '125px' }}>Added Unit Qty</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const addedCtn = getAdjustment(product.id, 'addedCtn')
                const addedUnit = getAdjustment(product.id, 'addedUnit')

                return (
                  <tr key={product.id} style={{ background: index % 2 === 0 ? '#ffffff' : '#f8fbfd' }}>
                    <td style={{ ...cellStyle, color: '#d90000', fontWeight: 'bold' }}>{index + 1}</td>
                    <td style={cellStyle}>
                      <div style={{ fontWeight: 'bold', color: '#173f7a', whiteSpace: 'nowrap' }}>
                        {product.stockBalance}
                      </div>
                    </td>
                    <td style={cellStyle}>{product.stockName}</td>
                    <td style={cellStyle}>{product.ctnSize}</td>
                    <td style={cellStyle}>{Number(product.ctnCostPrice || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={cellStyle}>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={addedCtn}
                        onChange={(event) => updateAdjustment(product.id, 'addedCtn', event.target.value)}
                        style={{
                          ...inputStyle,
                          borderColor: addedCtn ? '#148dc1' : '#cbd5e1',
                          fontWeight: addedCtn ? 'bold' : 'normal'
                        }}
                        placeholder="0"
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={addedUnit}
                        onChange={(event) => updateAdjustment(product.id, 'addedUnit', event.target.value)}
                        style={{
                          ...inputStyle,
                          borderColor: addedUnit ? '#148dc1' : '#cbd5e1',
                          fontWeight: addedUnit ? 'bold' : 'normal'
                        }}
                        placeholder="0"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {loadingProducts && <div className="saved">Loading stock...</div>}
        {!loadingProducts && !products.length && <div className="saved">No active stock found for this company.</div>}
        {error && <div className="saved">{error}</div>}
        {message && <div className="saved">{message}</div>}

        {products.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '18px' }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loadingProducts}
              className="submit"
              style={{ minWidth: '150px', opacity: saving ? .7 : 1 }}
            >
              {saving ? 'Saving...' : 'Save Adjustment'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function CompanyStockPurchase() {
  const [companyId, setCompanyId] = useState('')
  const [companies, setCompanies] = useState([])
  const [products, setProducts] = useState([])
  const [purchases, setPurchases] = useState({})
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [purchaseMeta] = useState(() => {
    const createdAt = new Date()
    const year = createdAt.getFullYear()
    const month = createdAt.toLocaleString('en-US', { month: 'long' })
    const date = createdAt.toISOString().slice(0, 10)
    const refNo = `PUR-${date.replace(/-/g, '')}-${String(createdAt.getHours()).padStart(2, '0')}${String(createdAt.getMinutes()).padStart(2, '0')}${String(createdAt.getSeconds()).padStart(2, '0')}`

    return {
      year,
      month,
      date,
      monthNumber: createdAt.getMonth() + 1,
      refNo,
      entryStaff: (() => {
        try {
          const user = JSON.parse(localStorage.getItem('theLordDoingAuthUser') || 'null')
          return user?.displayName || user?.username || ''
        } catch {
          return ''
        }
      })()
    }
  })

  const { year, month, date, monthNumber, refNo, entryStaff } = purchaseMeta

  useEffect(() => {
    let cancelled = false

    const loadCompanies = async () => {
      try {
        setLoadingCompanies(true)
        setError('')

        const response = await apiFetch('/api/companies')
        if (!response.ok) throw new Error('Unable to load companies')

        const data = await response.json()
        if (!cancelled) setCompanies(data)
      } catch {
        if (!cancelled) setError('Unable to connect to the backend.')
      } finally {
        if (!cancelled) setLoadingCompanies(false)
      }
    }

    loadCompanies()
    return () => { cancelled = true }
  }, [])

  const loadProducts = async (selectedCompanyId) => {
    if (!selectedCompanyId) {
      setProducts([])
      setPurchases({})
      return
    }

    try {
      setLoadingProducts(true)
      setError('')
      setMessage('')

      const response = await apiFetch(
        `/api/stock-purchases?companyId=${encodeURIComponent(selectedCompanyId)}`
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to load stock purchase data')

      setProducts(data.products || [])
      setPurchases({})
    } catch (err) {
      setProducts([])
      setPurchases({})
      setError(err instanceof Error ? err.message : 'Unable to load stock purchase data')
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleCompanyChange = async (event) => {
    const value = event.target.value
    setCompanyId(value)
    setError('')
    setMessage('')
    await loadProducts(value)
  }

  const goBack = () => {
    setCompanyId('')
    setProducts([])
    setPurchases({})
    setError('')
    setMessage('')
  }

  const updatePurchase = (productId, field, value) => {
    setPurchases((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value
      }
    }))
    setError('')
    setMessage('')
  }

  const getPurchase = (productId, field) =>
    purchases[productId]?.[field] ?? ''

  const handleSave = async () => {
    const items = products
      .map((product) => ({
        productId: product.id,
        addedCtnQty: Number(getPurchase(product.id, 'addedCtn') || 0),
        addedUnitQty: Number(getPurchase(product.id, 'addedUnit') || 0)
      }))
      .filter((item) => item.addedCtnQty > 0 || item.addedUnitQty > 0)

    if (!items.length) {
      setError('Enter at least one quantity to purchase before saving.')
      setMessage('')
      return
    }

    if (items.some((item) => !Number.isFinite(item.addedCtnQty) || !Number.isFinite(item.addedUnitQty))) {
      setError('Please enter valid quantities.')
      setMessage('')
      return
    }

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const response = await apiFetch('/api/stock-purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          refNo,
          entryStaff,
          year,
          month: monthNumber,
          date,
          items
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to save stock purchase')

      setProducts(data.products || [])
      setPurchases({})
      setMessage(`Stock purchase saved successfully. Reference: ${data.refNo}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save stock purchase')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    height: '36px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '5px',
    background: '#ffffff',
    padding: '6px 9px',
    color: '#173f7a',
    fontSize: '14px',
    outline: 'none'
  }

  const headerCellStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 3,
    background: '#148dc1',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '10px 9px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    textAlign: 'left',
    borderRight: '1px solid rgba(255,255,255,.35)'
  }

  const cellStyle = {
    padding: '7px 8px',
    borderBottom: '1px solid #e2e8f0',
    color: '#243b53',
    fontSize: '13px',
    verticalAlign: 'middle'
  }

  const selectedCompany = companies.find((company) => company.companyId === companyId)

  if (!companyId) {
    return (
      <div className="company-page">
        <div className="screen-heading">
          <a href="#stock-purchases">STOCK PURCHASES SCREEN</a>
        </div>

        <div style={{ color: '#d90000', fontWeight: 'bold', textAlign: 'center', padding: '10px 0 8px', fontSize: '15px' }}>
          STOCK PURCHASES
        </div>

        <div style={{
          width: '620px',
          maxWidth: '94%',
          margin: '0 auto',
          border: '1px solid #dbe3ec',
          borderRadius: '8px',
          background: '#ffffff',
          boxShadow: '0 4px 14px rgba(15,23,42,.06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#148dc1',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '11px',
            fontSize: '15px'
          }}>
            Company Stock Purchase
          </div>

          <div style={{ padding: '18px 20px 20px' }}>
            <label style={{ display: 'block', color: '#168ac0', fontWeight: 'bold', fontSize: '13px', marginBottom: '7px' }}>
              Company ID
            </label>

            <select
              value={companyId}
              onChange={handleCompanyChange}
              disabled={loadingCompanies}
              style={{ ...inputStyle, fontWeight: 'bold' }}
            >
              <option value="">------------Select------------</option>
              {companies.map((company) => (
                <option key={company.id} value={company.companyId}>
                  {company.companyId}
                </option>
              ))}
            </select>

            {loadingCompanies && <div className="saved">Loading companies...</div>}
            {error && <div className="saved">{error}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="company-page">
      <div className="screen-heading">
        <a href="#stock-purchases">STOCK PURCHASES SCREEN</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', margin: '8px 0 10px' }}>
        <button
          type="button"
          onClick={goBack}
          style={{
            background: '#ffffff',
            color: '#173f7a',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '8px 14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>

        <div style={{ color: '#d90000', fontWeight: 'bold', fontSize: '16px', marginRight: '8px' }}>
          STOCK PURCHASES
        </div>

        <div style={{ width: '90px' }} />
      </div>

      <div style={{
        width: '96%',
        margin: '0 auto',
        border: '1px solid #dbe3ec',
        borderRadius: '8px',
        background: '#ffffff',
        boxShadow: '0 4px 14px rgba(15,23,42,.06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#148dc1',
          color: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '11px',
          fontSize: '15px'
        }}>
          Stock Purchases — {selectedCompany?.companyName || companyId}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.15fr 1.8fr .75fr .85fr .9fr',
          gap: '8px',
          padding: '12px 12px 10px'
        }}>
          {[
            ['Ref No', refNo],
            ['Entry Staff', entryStaff],
            ['Company ID', companyId],
            ['Year', year],
            ['Month', month],
            ['Date', date]
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ color: '#168ac0', fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}>
                {label}
              </div>
              <input type="text" value={value} readOnly style={inputStyle} />
            </div>
          ))}
        </div>

        {loadingProducts ? (
          <div className="saved" style={{ margin: '10px 12px' }}>Loading stock...</div>
        ) : error ? (
          <div className="saved" style={{ margin: '10px 12px' }}>{error}</div>
        ) : products.length === 0 ? (
          <div className="saved" style={{ margin: '10px 12px' }}>No active stock found for this company.</div>
        ) : (
          <div style={{ maxHeight: '500px', overflow: 'auto', padding: '0 1px' }}>
            <table style={{ width: '100%', minWidth: '980px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '42px' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '31%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
              </colgroup>
              <thead>
                <tr>
                  {['s/n', 'Stock Balance', 'Stock Name', 'CTN Size', 'CTN Cost Price', 'Added CTN Qty', 'Added Unit Qty'].map((heading) => (
                    <th key={heading} style={headerCellStyle}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const addedCtn = getPurchase(product.id, 'addedCtn')
                  const addedUnit = getPurchase(product.id, 'addedUnit')

                  return (
                    <tr key={product.id}>
                      <td style={cellStyle}>{index + 1}</td>
                      <td style={{ ...cellStyle, fontWeight: 'bold', color: '#173f7a' }}>{product.stockBalance}</td>
                      <td style={cellStyle}>{product.stockName}</td>
                      <td style={cellStyle}>{product.ctnSize}</td>
                      <td style={cellStyle}>{Number(product.ctnCostPrice || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                      <td style={cellStyle}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={addedCtn}
                          onChange={(event) => updatePurchase(product.id, 'addedCtn', event.target.value)}
                          style={{ ...inputStyle, height: '34px' }}
                        />
                      </td>
                      <td style={cellStyle}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={addedUnit}
                          onChange={(event) => updatePurchase(product.id, 'addedUnit', event.target.value)}
                          style={{ ...inputStyle, height: '34px' }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {message && <div className="saved" style={{ margin: '12px' }}>{message}</div>}

        {products.length > 0 && !loadingProducts && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '18px 12px 22px' }}>
            <button
              type="button"
              className="submit"
              onClick={handleSave}
              disabled={saving}
              style={{ minWidth: '170px', height: '42px', opacity: saving ? .65 : 1 }}
            >
              {saving ? 'Saving...' : 'Save Purchase'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


function StockOpenPurchase() {
  const [companies, setCompanies] = useState([])
  const [companyId, setCompanyId] = useState('')
  const [products, setProducts] = useState([])
  const [openingEntries, setOpeningEntries] = useState({})
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [purchaseMeta] = useState(() => {
    const createdAt = new Date()
    const year = createdAt.getFullYear()
    const month = createdAt.toLocaleString('en-US', { month: 'long' })
    const date = createdAt.toISOString().slice(0, 10)
    const refNo = `OPEN-${date.replace(/-/g, '')}-${String(createdAt.getHours()).padStart(2, '0')}${String(createdAt.getMinutes()).padStart(2, '0')}${String(createdAt.getSeconds()).padStart(2, '0')}`

    return {
      year,
      month,
      date,
      monthNumber: createdAt.getMonth() + 1,
      refNo,
      entryStaff: (() => {
        try {
          const user = JSON.parse(localStorage.getItem('theLordDoingAuthUser') || 'null')
          return user?.displayName || user?.username || ''
        } catch {
          return ''
        }
      })()
    }
  })

  const { year, month, date, monthNumber, refNo, entryStaff } = purchaseMeta

  useEffect(() => {
    let cancelled = false

    const loadCompanies = async () => {
      try {
        setLoadingCompanies(true)
        setError('')

        const response = await apiFetch('/api/companies')
        if (!response.ok) throw new Error('Unable to load companies')

        const data = await response.json()
        if (!cancelled) setCompanies(data)
      } catch {
        if (!cancelled) setError('Unable to connect to the backend.')
      } finally {
        if (!cancelled) setLoadingCompanies(false)
      }
    }

    loadCompanies()
    return () => { cancelled = true }
  }, [])

  const loadProducts = async (selectedCompanyId) => {
    if (!selectedCompanyId) {
      setProducts([])
      setOpeningEntries({})
      return
    }

    try {
      setLoadingProducts(true)
      setError('')
      setMessage('')

      const response = await apiFetch(
        `/api/open-stock-purchases?companyId=${encodeURIComponent(selectedCompanyId)}`
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to load open stock purchase data')

      setProducts(data.products || [])
      setOpeningEntries({})
    } catch (err) {
      setProducts([])
      setOpeningEntries({})
      setError(err instanceof Error ? err.message : 'Unable to load open stock purchase data')
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleCompanyChange = async (event) => {
    const value = event.target.value
    setCompanyId(value)
    setError('')
    setMessage('')
    await loadProducts(value)
  }

  const goBack = () => {
    setCompanyId('')
    setProducts([])
    setOpeningEntries({})
    setError('')
    setMessage('')
  }

  const updateOpeningEntry = (productId, field, value) => {
    setOpeningEntries((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value
      }
    }))
    setError('')
    setMessage('')
  }

  const getOpeningEntry = (productId, field) =>
    openingEntries[productId]?.[field] ?? ''

  const handleSave = async () => {
    const items = products
      .map((product) => ({
        productId: product.id,
        addedCtnQty: Number(getOpeningEntry(product.id, 'addedCtn') || 0),
        addedUnitQty: Number(getOpeningEntry(product.id, 'addedUnit') || 0)
      }))
      .filter((item) => item.addedCtnQty > 0 || item.addedUnitQty > 0)

    if (!items.length) {
      setError('Enter at least one opening quantity before processing.')
      setMessage('')
      return
    }

    if (items.some((item) => !Number.isFinite(item.addedCtnQty) || !Number.isFinite(item.addedUnitQty))) {
      setError('Please enter valid quantities.')
      setMessage('')
      return
    }

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const response = await apiFetch('/api/open-stock-purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          refNo,
          entryStaff,
          year,
          month: monthNumber,
          date,
          items
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to save open stock purchase')

      setProducts(data.products || [])
      setOpeningEntries({})
      setMessage(`Opening stock saved successfully. Reference: ${data.refNo}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save open stock purchase')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    height: '36px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '5px',
    background: '#ffffff',
    padding: '6px 9px',
    color: '#173f7a',
    fontSize: '14px',
    outline: 'none'
  }

  const headerCellStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 3,
    background: '#148dc1',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '10px 9px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    textAlign: 'left',
    borderRight: '1px solid rgba(255,255,255,.35)'
  }

  const cellStyle = {
    padding: '7px 8px',
    borderBottom: '1px solid #e2e8f0',
    color: '#243b53',
    fontSize: '13px',
    verticalAlign: 'middle'
  }

  const selectedCompany = companies.find((company) => company.companyId === companyId)

  if (!companyId) {
    return (
      <div className="company-page">
        <div className="screen-heading">
          <a href="#open-stock-purchase">OPEN STOCK PURCHASE SCREEN</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', margin: '8px 0 10px' }}>
          <button
            type="button"
            onClick={goBack}
            style={{
              background: '#ffffff',
              color: '#173f7a',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '8px 14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>

          <div style={{ color: '#d90000', fontWeight: 'bold', fontSize: '16px', marginRight: '8px' }}>
            OPEN STOCK PURCHASE
          </div>

          <div style={{ width: '90px' }} />
        </div>

        <div style={{
          width: '620px',
          maxWidth: '94%',
          margin: '0 auto',
          border: '1px solid #dbe3ec',
          borderRadius: '8px',
          background: '#ffffff',
          boxShadow: '0 4px 14px rgba(15,23,42,.06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#148dc1',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '11px',
            fontSize: '15px'
          }}>
            Open Stock Purchase
          </div>

          <div style={{ padding: '18px 20px 20px' }}>
            <label style={{ display: 'block', color: '#168ac0', fontWeight: 'bold', fontSize: '13px', marginBottom: '7px' }}>
              Company ID
            </label>

            <select
              value={companyId}
              onChange={handleCompanyChange}
              disabled={loadingCompanies}
              style={{ ...inputStyle, fontWeight: 'bold' }}
            >
              <option value="">------------Select------------</option>
              {companies.map((company) => (
                <option key={company.id} value={company.companyId}>
                  {company.companyId}
                </option>
              ))}
            </select>

            {loadingCompanies && <div className="saved">Loading companies...</div>}
            {error && <div className="saved">{error}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="company-page">
      <div className="screen-heading">
        <a href="#open-stock-purchase">OPEN STOCK PURCHASE SCREEN</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', margin: '8px 0 10px' }}>
        <button
          type="button"
          onClick={goBack}
          style={{
            background: '#ffffff',
            color: '#173f7a',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '8px 14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>

        <div style={{ color: '#d90000', fontWeight: 'bold', fontSize: '16px', marginRight: '8px' }}>
          OPEN STOCK PURCHASE
        </div>

        <div style={{ width: '90px' }} />
      </div>

      <div style={{
        width: '96%',
        margin: '0 auto',
        border: '1px solid #dbe3ec',
        borderRadius: '8px',
        background: '#ffffff',
        boxShadow: '0 4px 14px rgba(15,23,42,.06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#148dc1',
          color: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '11px',
          fontSize: '15px'
        }}>
          Open Stock Purchase — {selectedCompany?.companyName || companyId}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.15fr 1.8fr .75fr .85fr .9fr',
          gap: '8px',
          padding: '12px 12px 10px'
        }}>
          {[
            ['Ref No', refNo],
            ['Entry Staff', entryStaff],
            ['Company ID', companyId],
            ['Year', year],
            ['Month', month],
            ['Date', date]
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ color: '#168ac0', fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}>
                {label}
              </div>
              <input type="text" value={value} readOnly style={inputStyle} />
            </div>
          ))}
        </div>

        {loadingProducts ? (
          <div className="saved" style={{ margin: '10px 12px' }}>Loading stock...</div>
        ) : error ? (
          <div className="saved" style={{ margin: '10px 12px' }}>{error}</div>
        ) : products.length === 0 ? (
          <div className="saved" style={{ margin: '10px 12px' }}>No active stock found for this company.</div>
        ) : (
          <div style={{ maxHeight: '500px', overflow: 'auto', padding: '0 1px' }}>
            <table style={{ width: '100%', minWidth: '1160px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '42px' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr>
                  {['s/n', 'Stock Balance', 'Stock Name', 'CTN Size', 'CTN Cost Price', 'CTN Selling Price', 'HALF Selling Price', 'Added CTN Qty', 'Added Unit Qty'].map((heading) => (
                    <th key={heading} style={headerCellStyle}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const addedCtn = getOpeningEntry(product.id, 'addedCtn')
                  const addedUnit = getOpeningEntry(product.id, 'addedUnit')

                  return (
                    <tr key={product.id}>
                      <td style={cellStyle}>{index + 1}</td>
                      <td style={{ ...cellStyle, fontWeight: 'bold', color: '#173f7a' }}>{product.stockBalance}</td>
                      <td style={cellStyle}>{product.stockName}</td>
                      <td style={cellStyle}>{product.ctnSize}</td>
                      <td style={cellStyle}>{Number(product.ctnCostPrice || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                      <td style={cellStyle}>{Number(product.ctnSellingPrice || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                      <td style={cellStyle}>{Number(product.halfCtnSelling || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                      <td style={cellStyle}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={addedCtn}
                          onChange={(event) => updateOpeningEntry(product.id, 'addedCtn', event.target.value)}
                          style={{ ...inputStyle, height: '34px' }}
                        />
                      </td>
                      <td style={cellStyle}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={addedUnit}
                          onChange={(event) => updateOpeningEntry(product.id, 'addedUnit', event.target.value)}
                          style={{ ...inputStyle, height: '34px' }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {message && <div className="saved" style={{ margin: '12px' }}>{message}</div>}

        {products.length > 0 && !loadingProducts && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '18px 12px 22px' }}>
            <button
              type="button"
              className="submit"
              onClick={handleSave}
              disabled={saving}
              style={{ minWidth: '190px', height: '42px', opacity: saving ? .65 : 1 }}
            >
              {saving ? 'Processing...' : 'Process Open Purchase'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


function PriceUpdate({ onBack }) {
  const stockData = {
    'AMAIZING DAY 45G X 50 PROMO PACK': {
      ctnSize: '5', ctnCost: '8580.00', ctnSelling: '9000.00', halfSelling: '0.00', qrtSelling: '0.00', unitSelling: '1820.00'
    },
    'AMAIZING DAY 6 X 650G PROMO PACK': {
      ctnSize: '6', ctnCost: '12385.00', ctnSelling: '12900.00', halfSelling: '6480.00', qrtSelling: '0.00', unitSelling: '0.00'
    },
    'Amaizing Day Breakfast Cereal 45g x 10': {
      ctnSize: '10', ctnCost: '17140.00', ctnSelling: '0.00', halfSelling: '0.00', qrtSelling: '0.00', unitSelling: '0.00'
    },
    'APTA MIL GROWING UP MILK 3 800G X 6': {
      ctnSize: '6', ctnCost: '92100.00', ctnSelling: '92700.00', halfSelling: '46400.00', qrtSelling: '0.00', unitSelling: '15500.00'
    }
  }

  const stockList = [
    'AMAIZING DAY 45G X 50 PROMO PACK',
    'AMAIZING DAY 6 X 650G PROMO PACK',
    'Amaizing Day Breakfast Cereal 45g x 10',
    'AMAIZING DAY CEREAL 600G X 6',
    'APTA MIL GROWING UP MILK 3 800G X 6',
    'AUNTIE B PASTA BIG',
    'AUNTIE B SEMOLINA 10KG',
    'AUNTIE B SEMOLINA 10KG NEW',
    'AUNTIE B SEMOLINA 1KG',
    'AUNTIE B SEMOLINA 1KG NEW',
    'AUNTIE B SEMOLINA 5KG',
    'AUNTIE B SLIM',
    'AUNTIE B SLIM NEW',
    'BAMA BIG X 12',
    'BAMA MEDIUM X 12',
    'BAMA SMALL X 12',
    'COMPLAN BABY FOOD 400G X 24',
    'DANGOTE SALT 50KG',
    'DANGOTE SALT X 20',
    'DANGOTE SALT X 40',
    'DANGOTE SALT X 80',
    'DANGOTE SUGAR 50KG',
    'GINO CURRY SATCHET 5G',
    'GINO MAX CHICKEN FLAVOUR X 60',
    'NOODLES JOLLOF 70G NEW',
    'NOODLES JOLLOF 70G NEWEST',
    'PRORICH MEDIUM BLUE X 48',
    'PRORICH MEDIUM RED X 48',
    'PRORICH PREMIUM WHITE X 48',
    'SEMO 1KG',
    'SEMO 10KG',
    'SEMO 2KG',
    'SEMO 500G',
    'SEMO 5KG',
    'SONIA TOMATO SACHET X 50',
    'SUPPREME 100G X 40',
    'SUPREME 120G X 40',
    'SUPREME 70G NEW X 40',
    'SUPREME 70G X 40',
    'SUPREME RICH SPICES 70G X 40',
    'T G Hot Pepper 5g x 12',
    'TOP CAFE X 12',
    'TOP CAFE X 12 NEW',
    'Vitali Ginger And Garlic Powder 5g x 18'
  ]

  const [selectedStock, setSelectedStock] = useState('')
  const [row, setRow] = useState(null)

  const selectStock = (value) => {
    setSelectedStock(value)

    if (value) {
      const data = stockData[value] || {
        ctnSize: '0',
        ctnCost: '0.00',
        ctnSelling: '0.00',
        halfSelling: '0.00',
        qrtSelling: '0.00',
        unitSelling: '0.00'
      }

      setRow({ stockName: value, ...data })
    } else {
      setRow(null)
    }
  }

  const updateField = (field, value) => {
    setRow((current) => ({ ...current, [field]: value }))
  }

  const submit = () => {
    // Preserve the existing screen behaviour. Backend persistence will be connected
    // separately when the Price Update backend flow is implemented.
    setSelectedStock('')
    setRow(null)
  }

  const resetScreen = () => {
    setSelectedStock('')
    setRow(null)
  }

  const headerCellStyle = {
    background: '#148dc1',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '10px 12px',
    whiteSpace: 'nowrap',
    fontSize: '13px',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    textAlign: 'left',
    borderRight: '1px solid rgba(255,255,255,.45)'
  }

  const cellStyle = {
    padding: '10px 12px',
    borderBottom: '1px solid #dbe5ec',
    color: '#243b53',
    fontSize: '13px',
    verticalAlign: 'middle'
  }

  const inputStyle = {
    width: '100%',
    height: '36px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '5px',
    background: '#ffffff',
    padding: '6px 9px',
    color: '#173f7a',
    fontSize: '14px',
    outline: 'none'
  }

  const backButton = (
    <button
      type="button"
      onClick={() => {
        resetScreen()
        if (onBack) onBack()
      }}
      style={{
        border: '1px solid #cbd5e1',
        background: '#ffffff',
        color: '#173f7a',
        borderRadius: '5px',
        padding: '7px 12px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      ← Back
    </button>
  )

  return (
    <div className="bank-page">
      <div className="screen-heading">
        <a href="#price-update">PRICE UPDATE SCREEN</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
        {backButton}
        <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: 'bold', fontSize: '15px' }}>
          PRICE UPDATE
        </div>
        <div style={{ width: '72px' }} />
      </div>

      <div
        style={{
          width: '96%',
          maxWidth: '1180px',
          margin: '0 auto 18px',
          border: '1px solid #dbe5ec',
          borderRadius: '8px',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,.06)',
          overflow: 'hidden'
        }}
      >
        <div style={{ background: '#148dc1', color: '#fff', fontWeight: 'bold', textAlign: 'center', padding: '9px', letterSpacing: '.5px' }}>
          Price Update
        </div>

        {!row ? (
          <div style={{ padding: '22px' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px', alignItems: 'center' }}>
              <label style={{ color: '#168ac0', fontWeight: 'bold', textAlign: 'right' }}>
                Stock Name
              </label>
              <select
                value={selectedStock}
                onChange={(event) => selectStock(event.target.value)}
                style={inputStyle}
              >
                <option value="">---------------- Select stock ----------------</option>
                {stockList.map((stock) => (
                  <option key={stock} value={stock}>{stock}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <>
            <div style={{ padding: '12px 14px 0', color: '#64748b', fontSize: '13px' }}>
              Update the selling prices for the selected stock item.
            </div>

            <div style={{ margin: '12px 14px 0', border: '1px solid #dbe5ec', borderRadius: '7px', overflow: 'hidden', background: '#ffffff' }}>
              <div style={{ maxHeight: '42vh', overflow: 'auto' }}>
                <table style={{ width: '100%', minWidth: '1080px', borderCollapse: 'separate', borderSpacing: 0 }}>
                  <colgroup>
                    <col style={{ width: '55px' }} />
                    <col style={{ width: '300px' }} />
                    <col style={{ width: '100px' }} />
                    <col style={{ width: '150px' }} />
                    <col style={{ width: '155px' }} />
                    <col style={{ width: '175px' }} />
                    <col style={{ width: '155px' }} />
                    <col style={{ width: '155px' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th style={{ ...headerCellStyle, width: '55px', textAlign: 'center' }}>S/N</th>
                      <th style={headerCellStyle}>Stock Name</th>
                      <th style={headerCellStyle}>CTN Size</th>
                      <th style={headerCellStyle}>CTN Cost Price</th>
                      <th style={headerCellStyle}>CTN Selling Price</th>
                      <th style={headerCellStyle}>Half CTN Selling Price</th>
                      <th style={headerCellStyle}>Qrt Selling Price</th>
                      <th style={headerCellStyle}>Unit Selling Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ ...cellStyle, color: '#d90000', textAlign: 'center', fontWeight: 'bold' }}>1</td>
                      {[
                        ['stockName', 'Stock Name'],
                        ['ctnSize', 'CTN Size'],
                        ['ctnCost', 'CTN Cost Price'],
                        ['ctnSelling', 'CTN Selling Price'],
                        ['halfSelling', 'Half CTN Selling Price'],
                        ['qrtSelling', 'Qrt Selling Price'],
                        ['unitSelling', 'Unit Selling Price']
                      ].map(([field, label]) => (
                        <td key={field} style={cellStyle}>
                          <input
                            aria-label={label}
                            value={row[field] ?? ''}
                            onChange={(event) => updateField(field, event.target.value)}
                            style={inputStyle}
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '18px 14px' }}>
              <button type="button" className="submit" onClick={submit}>
                Submit
              </button>
              <button
                type="button"
                onClick={resetScreen}
                style={{
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#173f7a',
                  borderRadius: '5px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Change Stock
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

const priceListCompanies = {
  'DANGOTE NIG PLC': [
    ['DANGOTE SALT 50KG','1','17000.00','0.00','0.00','0.00'],
    ['DANGOTE SALT X 20','1','7600.00','0.00','0.00','0.00'],
    ['DANGOTE SALT X 40','1','7900.00','0.00','0.00','0.00'],
    ['DANGOTE SALT X 80','1','8150.00','0.00','0.00','0.00'],
    ['DANGOTE SUGAR 50KG','1','28600.00','0.00','0.00','0.00']
  ],
  'FLOOR MILLS NIG PLC': [
    ['AMAIZING DAY 45G X 50 PROMO PACK','5','9000.00','0.00','0.00','1820.00'],
    ['AMAIZING DAY 6 X 650G PROMO PACK','6','12900.00','6480.00','0.00','0.00'],
    ['Amaizing Day Breakfast Cereal 45g x 10','10','0.00','0.00','0.00','0.00'],
    ['AMAIZING DAY CEREAL 600G X 6','6','12900.00','6480.00','0.00','0.00'],
    ['AUNTIE B PASTA BIG','1','14450.00','0.00','0.00','0.00'],
    ['AUNTIE B SEMOLINA 10KG','1','0.00','0.00','0.00','0.00'],
    ['AUNTIE B SEMOLINA 10KG NEW','1','10700.00','0.00','0.00','0.00'],
    ['AUNTIE B SEMOLINA 1KG','1','11050.00','0.00','0.00','0.00'],
    ['AUNTIE B SEMOLINA 1KG NEW','1','11050.00','0.00','0.00','0.00'],
    ['AUNTIE B SEMOLINA 5KG','1','5450.00','0.00','0.00','0.00'],
    ['AUNTIE B SLIM','1','14450.00','0.00','0.00','0.00'],
    ['AUNTIE B SLIM NEW','1','14450.00','0.00','0.00','0.00'],
    ['Golden Bite Chin Chin x 100 New','10','10000.00','5000.00','0.00','1000.00'],
    ['GOLDEN PENN C FLOUR 50KG','1','48000.00','0.00','0.00','0.00'],
    ['Golden Penny Chocolate Spread 14g x 20','20','14150.00','7100.00','3550.00','0.00'],
    ['Golden Penny Chocolate Spread 15 x 20','20','15000.00','7550.00','3775.00','0.00'],
    ['Golden Penny Chocolate Spread 325g x 24','24','47850.00','23950.00','12000.00','2050.00'],
    ['GOLDEN PENNY FLOUR 1KG','10','12100.00','6100.00','0.00','0.00'],
    ['GOLDEN PENNY GARRI 1KG X 10','1','16500.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY MARGARINE 10KG','1','11900.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY MAYONNAISE 15G X 20','20','15650.00','7850.00','3925.00','0.00'],
    ['GOLDEN PENNY MAYONNAISE 250G X 24','24','29100.00','14600.00','7300.00','0.00'],
    ['GOLDEN PENNY MAYONNAISE 450G X 12','12','24350.00','12200.00','6100.00','0.00'],
    ['GOLDEN PENNY OIL 25 LTS','1','30850.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY PURE SOYA OIL 1LIT X 12','12','39500.00','19800.00','9900.00','0.00'],
    ['GOLDEN PENNY PURE SOYA OIL 2.75LTR X 6','6','52300.00','26250.00','0.00','0.00'],
    ['GOLDEN PENNY PURE SOYA OIL 4LTS X 6','6','75300.00','37700.00','0.00','12600.00'],
    ['GOLDEN PENNY PURE SOYA OIL 5LITS X 4','4','45800.00','23000.00','0.00','0.00'],
    ['GOLDEN PENNY PURE SOYA OIL 75ML X 60','60','8950.00','4500.00','2250.00','0.00'],
    ['GOLDEN PENNY PURE VEG OIL 1LTR X 12','12','39500.00','19800.00','9900.00','0.00'],
    ['GOLDEN PENNY PURE VEG OIL 2.75LTR X 6','6','36800.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY PURE VEG OIL 4LTR X 6','6','75300.00','37700.00','0.00','12600.00'],
    ['GOLDEN PENNY PURE VEG OIL 5LITRS X 4','4','46200.00','23200.00','0.00','0.00'],
    ['GOLDEN PENNY PURE VEG OIL 750ML X 12','12','23700.00','11860.00','5940.00','0.00'],
    ['GOLDEN PENNY SOYA OIL 45ML X 60','60','9850.00','4950.00','0.00','0.00'],
    ['GOLDEN PENNY SPAGHETTI','1','18500.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY SPAGHETTI NEW','1','0.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY SPAGHETTINI','1','18550.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY SPAGHETTINI NEW','1','0.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY SPREAD 15G X 20 Sachet','20','11000.00','5555.00','2800.00','0.00'],
    ['Golden Penny Chocolate Spread 325g x 24','24','47850.00','23950.00','12000.00','2050.00'],
    ['Golden Penny Chocolate Spread 15 x 20','20','15000.00','7550.00','3775.00','0.00'],
    ['Golden Penny Veg Oil 4lts x 6 New','6','33900.00','17000.00','0.00','0.00'],
    ['GOLDEN PENNY PURE SOYA OIL 1LIT X 12','12','39500.00','19800.00','9900.00','0.00'],
    ['GOLDEN PENNY PURE SOYA OIL 5LITS X 4','4','45800.00','23000.00','0.00','0.00'],
    ['GOLDEN PENNY PURE VEG OIL 5LITS X 4','4','46200.00','23200.00','0.00','0.00'],
    ['GOLDEN PENNY SPAGHETTI NEW','1','0.00','0.00','0.00','0.00'],
    ['NOODLES JOLLOF 70G NEW','1','7650.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY TWIST BIG NEW','1','0.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY SPAGHETTINI NEW','1','0.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY PURE SOYA OIL 4LTS X 6','6','75300.00','37700.00','0.00','12600.00'],
    ['GOLDEN PENNY PURE SOYA OIL 2.75LTR X 6','6','52300.00','26250.00','0.00','0.00'],
    ['HONEYWELL SEMOLINA 900G X 10','1','13500.00','0.00','0.00','0.00'],
    ['HONEYWELL SEMOLINA 4.75G','1','7200.00','0.00','0.00','0.00'],
    ['HONEYWELL SEMOLINA 9.5G','1','14700.00','0.00','0.00','0.00'],
    ['HONEYWELL WHEATMEAL 900G X 10','1','10200.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY TOMATO JOS 60G X 50','1','6950.00','0.00','0.00','0.00'],
    ['AUNTIE B PASTA BIG','1','14450.00','0.00','0.00','0.00'],
    ['AUNTIE B SLIM NEW','1','14450.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY GARRI 1KG X 10','1','16500.00','0.00','0.00','0.00'],
    ['GOLDEN PENNY FLOUR 1KG','10','12100.00','6100.00','0.00','0.00'],
    ['HONEYWELL WHEATMEAL 4.75G','1','5000.00','0.00','0.00','0.00'],
    ['HONEYWELL SPAGHETTI1','1','0.00','0.00','0.00','0.00']
  ],
  'OTHERS': [
    ['APTAMIL GROWING UP MILK 3 800G X 6','6','92700.00','46400.00','0.00','15500.00'],
    ['COMPLAN BABY FOOD 400G X 24','24','172000.00','86000.00','43100.00','7200.00'],
    ['WAW COLOUR ANKARA 60G X 54','1','6300.00','0.00','0.00','0.00'],
    ['NITTOL ANTIBACK 60G X 54','1','6650.00','0.00','0.00','0.00'],
    ['T G Hot Pepper 5g x 12','12','6950.00','3500.00','0.00','0.00'],
    ['SUPREME RICH SPICES 70G X 40','1','6250.00','0.00','0.00','0.00'],
    ['TOP CAFE X 12','12','18550.00','9300.00','4650.00','0.00'],
    ['SUPREME 70G NEW X 40','1','7600.00','0.00','0.00','0.00'],
    ['TOP CAFE X 12 NEW','12','18550.00','9300.00','4650.00','0.00'],
    ['INDOMIE ONION 70G X 40','1','10500.00','0.00','0.00','0.00']
  ],
  'PRORICH TISSUES': [
    ['PRORICH MEDIUM BLUE X 48','1','5950.00','0.00','0.00','0.00'],
    ['PRORICH MEDIUM RED X 48','1','5950.00','0.00','0.00','0.00'],
    ['PRORICH PREMIUM WHITE X 48','1','8750.00','0.00','0.00','0.00']
  ],
  'SUPERBRAND GD': [
    ['Vitali Margarine Bread Spread 70g x 50','50','7500.00','3800.00','0.00','0.00'],
    ['Vitali Margarine Bread Spread 450g x 12','12','7800.00','3950.00','1980.00','0.00'],
    ['Vitali Margarine Bread Spread 70g x 50','50','7500.00','3780.00','0.00','0.00'],
    ['Vitali Ginger And Garlic Powder 5g x 18','18','3500.00','1750.00','0.00','200.00'],
    ['Vitali Margarine Bucket 10g','1','20000.00','0.00','0.00','0.00']
  ]
}
function PriceListPrint({ companyName, rows, allCompanies = false, onClose }) {
  const grouped = allCompanies
    ? [
        ['DANGOTE NIG PLC', priceListCompanies['DANGOTE NIG PLC']],
        ['FLOOR MILLS NIG PLC', priceListCompanies['FLOOR MILLS NIG PLC']],
        ['OTHERS', priceListCompanies['OTHERS']],
        ['PRORICH TISSUES', priceListCompanies['PRORICH TISSUES']],
        ['SUPERBRANDZ GLOBAL DISTRIBUTION', priceListCompanies['SUPERBRAND GD']]
      ]
    : [[companyName, rows]]

  const htmlRows = (items, startNumber = 1) => items.map((r, i) => `
    <tr>
      <td>${startNumber + i}</td>
      <td>${r[0]}</td>
      <td>${r[1]}</td>
      <td>${r[2]}</td>
      <td>${r[3]}</td>
      <td>${r[4]}</td>
      <td>${r[5]}</td>
    </tr>
  `).join('')

  const openPrintWindow = () => {
    const popup = window.open('', '_blank', 'width=1000,height=850')
    if (!popup) {
      window.alert('Please allow pop-ups for this site to open the print preview.')
      return
    }

    const content = grouped.map(([name, items], groupIndex) => `
      <section class="company-section">
        <h2>${name}: PRICE LIST</h2>
        <table>
          <thead><tr>
            <th>s/n</th><th>Stock Name</th><th>Pack Size</th>
            <th>CTN Selling Price</th><th>Half CTN Selling Price</th>
            <th>Qrt CTN Selling Price</th><th>Unit Selling Price</th>
          </tr></thead>
          <tbody>${htmlRows(items, allCompanies ? grouped.slice(0, groupIndex).reduce((sum, [, groupRows]) => sum + groupRows.length, 0) + 1 : 1)}</tbody>
        </table>
      </section>
    `).join('')

    popup.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Price List - ${companyName || 'All Companies'}</title>
          <style>
            *{box-sizing:border-box}
            body{font-family:Arial,sans-serif;background:#fff;color:#111;padding:24px;margin:0}
            .toolbar{display:flex;justify-content:center;gap:12px;margin:0 0 22px}
            .toolbar button{border:0;border-radius:5px;padding:9px 20px;font-weight:bold;cursor:pointer;font-size:14px}
            .print-btn{background:#148dc1;color:#fff}
            .close-btn{background:#64748b;color:#fff}
            h1{font-size:18px;text-align:center;color:#e00000;margin:0 0 6px}
            .address{text-align:center;font-weight:bold;font-size:13px;margin-bottom:4px}
            .phone{text-align:center;font-weight:bold;font-size:13px;margin-bottom:18px}
            h2{font-size:17px;text-align:center;color:#e00000;margin:14px 0 5px}
            table{border-collapse:collapse;width:100%;margin:0 auto 24px}
            th{background:#148dc1;color:white;padding:7px;border:1px solid #148dc1;font-size:12px;text-align:left}
            td{border:1px solid #cbd5e1;padding:6px;font-size:12px}
            @media print{
              body{padding:10px}
              .toolbar{display:none}
              .company-section{page-break-inside:avoid}
              th{print-color-adjust:exact;-webkit-print-color-adjust:exact}
            }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <button class="print-btn" onclick="window.print()">Print</button>
            <button class="close-btn" onclick="window.close()">Close</button>
          </div>
          <h1>THE LORD'S DOING GLOBAL CONCEPT SERVICES NIG. LTD</h1>
          <div class="address">SHOP: No 13 Idi Abeleke Ijoy Road, Ogobmoso, Oyo State.</div>
          <div class="phone">Gsm No: 08112953848</div>
          ${content}
          <div class="toolbar">
            <button class="print-btn" onclick="window.print()">Print</button>
            <button class="close-btn" onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `)
    popup.document.close()
    popup.focus()
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '45px'
    }}>
      <div style={{
        width: 'min(1050px, 94vw)',
        maxHeight: '88vh',
        overflowY: 'auto',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        boxShadow: '0 8px 28px rgba(0,0,0,.25)',
        padding: '18px 22px 20px'
      }}>
        <div style={{ color: '#e00000', fontWeight: 'bold', textAlign: 'center', fontSize: '17px' }}>
          THE LORD'S DOING GLOBAL CONCEPT SERVICES NIG. LTD
        </div>
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>
          SHOP: No 13 Idi Abeleke Ijoy Road, Ogobmoso, Oyo State.
        </div>
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', marginBottom: '14px' }}>
          Gsm No: 08112953848
        </div>

        {grouped.map(([name, items], groupIndex) => (
          <div key={`${name}-${groupIndex}`} style={{ marginBottom: '16px' }}>
            <div style={{
              color: '#e00000',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '16px',
              marginBottom: '6px'
            }}>
              {name}: PRICE LIST
            </div>
            <PriceListTable rows={items} startNumber={allCompanies ? (
              grouped.slice(0, groupIndex).reduce((sum, [, groupRows]) => sum + groupRows.length, 0) + 1
            ) : 1} />
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '14px' }}>
          <button
            type="button"
            onClick={openPrintWindow}
            style={{ border: 'none', borderRadius: '5px', background: '#148dc1', color: '#fff', padding: '9px 20px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Print
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ border: '1px solid #cbd5e1', borderRadius: '5px', background: '#fff', color: '#173f7a', padding: '9px 20px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function PriceListTable({ rows, startNumber = 1 }) {
  const headerCellStyle = {
    background: '#148dc1',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '9px 10px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    position: 'sticky',
    top: 0,
    zIndex: 5,
    textAlign: 'left',
    borderRight: '1px solid rgba(255,255,255,.35)'
  }

  const cellStyle = {
    padding: '9px 10px',
    borderBottom: '1px solid #dbe5ec',
    color: '#243b53',
    fontSize: '13px',
    background: '#ffffff'
  }

  return (
    <div style={{
      width: '100%',
      maxHeight: '55vh',
      overflow: 'auto',
      border: '1px solid #dbe5ec',
      borderRadius: '6px',
      background: '#ffffff'
    }}>
      <table style={{
        width: '100%',
        minWidth: '900px',
        borderCollapse: 'separate',
        borderSpacing: 0,
        background: '#ffffff'
      }}>
        <thead>
          <tr>
            <th style={{ ...headerCellStyle, width: '55px', textAlign: 'center' }}>S/N</th>
            <th style={headerCellStyle}>Stock Name</th>
            <th style={{ ...headerCellStyle, width: '90px' }}>Pack Size</th>
            <th style={{ ...headerCellStyle, width: '145px' }}>CTN Selling Price</th>
            <th style={{ ...headerCellStyle, width: '155px' }}>Half CTN Selling Price</th>
            <th style={{ ...headerCellStyle, width: '150px' }}>Qrt CTN Selling Price</th>
            <th style={{ ...headerCellStyle, width: '145px' }}>Unit Selling Price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r[0]}-${i}`}>
              <td style={{ ...cellStyle, color: '#d90000', textAlign: 'center' }}>{startNumber + i}</td>
              <td style={cellStyle}>{r[0]}</td>
              <td style={cellStyle}>{r[1]}</td>
              <td style={cellStyle}>{r[2]}</td>
              <td style={cellStyle}>{r[3]}</td>
              <td style={cellStyle}>{r[4]}</td>
              <td style={cellStyle}>{r[5]}</td>
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={7} style={{ ...cellStyle, textAlign: 'center', color: '#64748b', padding: '24px' }}>
                Select a company to display its price list.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function PriceList({ onBack }) {
  const [company, setCompany] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [showPrint, setShowPrint] = useState(false)

  const rows = company ? (priceListCompanies[company] || []) : []

  const companies = [
    ['DANGOTE NIG PLC', 'DANGOTE NIG PLC'],
    ['FLOOR MILLS NIG PLC', 'FLOOR MILLS NIG PLC'],
    ['OTHERS', 'OTHERS'],
    ['PRORICH TISSUES', 'PRORICH TISSUES'],
    ['SUPERBRAND GD', 'SUPERBRAND GD']
  ]

  const handleBack = () => {
    setCompany('')
    setShowAll(false)
    setShowPrint(false)
    if (onBack) onBack()
  }

  const selectCompany = (value) => {
    setCompany(value)
    setShowAll(false)
  }

  const displayAll = () => {
    setCompany('')
    setShowAll(true)
  }

  return (
    <div className="bank-page" style={{ minHeight: '100%' }}>
      <div className="screen-heading">
        <a href="#price-list" onClick={(event) => event.preventDefault()}>
          PRICE LIST SCREEN
        </a>
        <button
          type="button"
          onClick={displayAll}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#173f7a',
            fontWeight: 'bold',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0
          }}
        >
          Display All
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
        <button
          type="button"
          onClick={handleBack}
          style={{
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#173f7a',
            borderRadius: '5px',
            padding: '7px 12px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Back
        </button>
        <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: 'bold', fontSize: '15px' }}>
          {showAll ? 'ALL COMPANIES PRICE LIST' : 'PRICE LIST'}
        </div>
        <div style={{ width: '72px' }} />
      </div>

      {!showAll ? (
        <div style={{
          width: '96%',
          margin: '0 auto',
          border: '1px solid #dbe5ec',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,.06)'
        }}>
          <div style={{ background: '#148dc1', color: '#ffffff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
            Price List
          </div>

          <div style={{ padding: '16px 18px 12px', background: '#f8fbfd' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px minmax(240px, 420px)', gap: '12px', alignItems: 'center', maxWidth: '620px', margin: '0 auto' }}>
              <label style={{ color: '#168ac0', fontWeight: 'bold', textAlign: 'right' }}>Company ID:</label>
              <select
                value={company}
                onChange={(e) => selectCompany(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '5px',
                  background: '#ffffff',
                  padding: '6px 9px',
                  color: '#173f7a',
                  fontSize: '14px'
                }}
              >
                <option value="">---------------- Select Company ----------------</option>
                {companies.map(([label, value]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ padding: '0 12px 14px' }}>
            <div style={{ color: '#d90000', fontWeight: 'bold', textAlign: 'center', fontSize: '15px', padding: '8px 0' }}>
              {company ? `${company}: PRICE LIST` : 'Select a company to view its price list'}
            </div>
            <div>
              <PriceListTable rows={rows} />
            </div>

            <div style={{ textAlign: 'center', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => company && setShowPrint(true)}
                disabled={!company}
                style={{
                  border: 'none',
                  borderRadius: '5px',
                  background: company ? '#000000' : '#94a3b8',
                  color: '#ffffff',
                  padding: '9px 18px',
                  fontWeight: 'bold',
                  cursor: company ? 'pointer' : 'not-allowed'
                }}
              >
                Send To Printer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          width: '96%',
          margin: '0 auto',
          border: '1px solid #dbe5ec',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,.06)'
        }}>
          <div style={{ background: '#148dc1', color: '#ffffff', fontWeight: 'bold', textAlign: 'center', padding: '9px' }}>
            All Companies Price List
          </div>

          <div style={{ padding: '10px 12px 16px', maxHeight: '68vh', overflowY: 'auto' }}>
            {Object.entries(priceListCompanies).map(([name, rowsForCompany], index) => (
              <div key={name} style={{ marginBottom: '18px' }}>
                <div style={{ color: '#d90000', fontWeight: 'bold', textAlign: 'center', fontSize: '15px', padding: '7px 0' }}>
                  {name === 'SUPERBRAND GD' ? 'SUPERBRANDZ GLOBAL DISTRIBUTION' : name}: PRICE LIST
                </div>
                <div>
                  <PriceListTable
                    rows={rowsForCompany}
                    startNumber={Object.values(priceListCompanies)
                      .slice(0, index)
                      .reduce((sum, arr) => sum + arr.length, 0) + 1}
                  />
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', paddingTop: '2px' }}>
              <button
                type="button"
                onClick={() => setShowPrint(true)}
                style={{
                  border: 'none',
                  borderRadius: '5px',
                  background: '#000000',
                  color: '#ffffff',
                  padding: '9px 18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Send To Printer
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrint && (
        <PriceListPrint
          companyName={showAll ? 'ALL COMPANIES' : company}
          rows={showAll ? [] : rows}
          allCompanies={showAll}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  )
}


const companyPaymentOptions = [
  'DANGOTE NIG PLC',
  'FLOOR MILLS NIG PLC',
  'OTHERS',
  'PRORICH TISSUES',
  'SUPERBRAND GD',
  'test'
]

const companyPaymentBalances = {
  'FLOOR MILLS NIG PLC': '4,884,126,703.00',
  'OTHERS': '456,614,975.00',
  'PRORICH TISSUES': '2,858,200.00',
  'test': '14.00',
  'SUPERBRAND GD': '565,650.00'
}

const companyPaymentPrints = {
  'FLOOR MILLS NIG PLC': {
    refNo: 'SP-og1334',
    date: '2026-09-27',
    time: '00:00:00',
    companyName: 'FLOOR MILLS NIG PLC',
    companyId: 'FLOOR MILLS NIG PLC',
    balance: '4,884,126,703.00'
  },
  'OTHERS': {
    refNo: 'SP-og1333',
    date: '2026-09-26',
    time: '00:00:00',
    companyName: 'OTHERS',
    companyId: 'OTHERS',
    balance: '456,614,975.00'
  },
  'SUPERBRAND GD': {
    refNo: 'SP-og801',
    date: '2024-10-11',
    time: '00:00:00',
    companyName: 'SUPERBRANDZ GLOBAL DISTRIBUTION',
    companyId: 'SUPERBRAND GD',
    balance: '565,650.00'
  }
}

function CompanyPaymentSlip({ company, onClose, paymentAmount = '0.00' }) {
  const data = companyPaymentPrints[company] || {
    refNo: 'SP-og1334',
    date: '2026-09-29',
    time: '00:00:00',
    companyName: company,
    companyId: company,
    balance: companyPaymentBalances[company] || '0.00'
  }

  const doPrint = () => window.print()

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.42)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '34px 18px',
      overflowY: 'auto'
    }}>
      <div style={{
        width: '390px',
        maxWidth: '100%',
        background: '#ffffff',
        border: '1px solid #dbe5ec',
        borderRadius: '10px',
        boxShadow: '0 12px 32px rgba(15,23,42,.20)',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
        color: '#243b53'
      }}>
        <div style={{ background: '#148dc1', color: '#fff', padding: '11px 14px', fontWeight: '700', textAlign: 'center', fontSize: '15px' }}>
          Company Goods Payment Slip
        </div>

        <div style={{ padding: '16px 18px 10px', textAlign: 'center' }}>
          <div style={{ color: '#d90000', fontWeight: '800', fontSize: '16px', lineHeight: '1.2' }}>
            THE LORD'S DOING<br />
            GLOBAL CONCEPT SERVICES NIG. LTD
          </div>
          <div style={{ marginTop: '6px', fontSize: '11px', lineHeight: '1.35', fontWeight: '700', color: '#475569' }}>
            SHOP: No 13 Idi Abekele Road,<br />
            Ogbomoso, Oyo State.<br />
            Gsm No: 08112953848
          </div>
        </div>

        <div style={{ margin: '0 18px', border: '1px solid #dbe5ec', borderRadius: '7px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', background: '#f8fafc', fontSize: '11px', fontWeight: '700' }}>
            <div style={{ padding: '8px', borderRight: '1px solid #dbe5ec' }}>Ref No: {data.refNo}</div>
            <div style={{ padding: '8px' }}>Date: {data.date}</div>
          </div>
          <div style={{ padding: '8px', borderTop: '1px solid #dbe5ec', fontSize: '11px', fontWeight: '700' }}>
            Time: {data.time}
          </div>
        </div>

        <div style={{ padding: '14px 18px' }}>
          {[
            ['Company Name', data.companyName],
            ['Company ID', data.companyId],
            ['New Payment', paymentAmount || '0.00'],
            ['To Balance Amount', data.balance]
          ].map(([label, value], index) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '45% 55%', borderBottom: index === 3 ? 'none' : '1px solid #dbe5ec' }}>
              <div style={{ padding: '9px 8px', background: '#f8fafc', fontSize: '12px', fontWeight: '700', color: '#475569' }}>{label}</div>
              <div style={{ padding: '9px 8px', fontSize: index >= 2 ? '16px' : '12px', fontWeight: '700', color: index >= 2 ? '#d90000' : '#243b53', overflowWrap: 'anywhere' }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #dbe5ec', padding: '10px 18px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#475569' }}>
          Thanks for your patronage
        </div>

        <div style={{ borderTop: '1px solid #dbe5ec', padding: '9px 18px', background: '#fffbea', color: '#d90000', textAlign: 'center', fontSize: '10px', fontWeight: '700', lineHeight: '1.3' }}>
          POWERED BY: BATH TECHNOLOGIES<br />
          GSM: +234-803-419-2786<br />
          © 2017
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '12px 18px 16px' }}>
          <button type="button" onClick={onClose} style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#173f7a', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: '700' }}>
            Close
          </button>
          <button type="button" onClick={doPrint} style={{ border: '1px solid #148dc1', background: '#148dc1', color: '#fff', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', fontWeight: '700' }}>
            Print
          </button>
        </div>
      </div>
    </div>
  )
}

function CompanyGoodsPayment({ onBack }) {
  const [company, setCompany] = useState('')
  const [reprint, setReprint] = useState(false)
  const [showSlip, setShowSlip] = useState(false)
  const [newPayment, setNewPayment] = useState('')
  useEffect(() => {
    const token = localStorage.getItem('theLordDoingAuthToken')

    if (!token) {
      setIsAuthenticated(false)
      setAuthUser(null)
      return
    }

    let cancelled = false

    const validateSession = async () => {
      try {
        const response = await apiFetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || !data.user) {
          localStorage.removeItem('theLordDoingAuthToken')
          localStorage.removeItem('theLordDoingAuthUser')
          if (!cancelled) {
            setIsAuthenticated(false)
            setAuthUser(null)
          }
          return
        }

        localStorage.setItem('theLordDoingAuthUser', JSON.stringify(data.user))
        if (!cancelled) {
          setAuthUser(data.user)
          setIsAuthenticated(true)
        }
      } catch {
        // Keep the existing local session when the backend is temporarily unavailable.
      }
    }

    validateSession()

    return () => {
      cancelled = true
    }
  }, [])

  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const dateValue = '2026-09-29'
  const monthValue = 'September'
  const timeValue = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(now)

  const balance = companyPaymentBalances[company] || ''
  const isSuperbrand = company === 'SUPERBRAND GD'
  const displayCompanyName = isSuperbrand ? 'SUPERBRANDZ GLOBAL DISTRIBUTION' : company

  const resetScreen = () => {
    setCompany('')
    setNewPayment('')
    setShowSlip(false)
  }

  const selectCompany = (value) => {
    setCompany(value)
    setNewPayment('')
    setShowSlip(false)
  }

  const inputStyle = {
    width: '100%',
    height: '36px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    background: '#ffffff',
    color: '#173f7a',
    padding: '6px 9px',
    fontSize: '14px',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '700'
  }

  const companySelector = (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ background: '#148dc1', color: '#fff', padding: '10px 14px', fontWeight: '700', borderRadius: '8px 8px 0 0', textAlign: 'center' }}>
        . . . {reprint ? 'Company Goods Payment Slip Reprint' : 'Company Goods Payment Slip'} . . .
      </div>
      <div style={{ border: '1px solid #dbe5ec', borderTop: 'none', borderRadius: '0 0 8px 8px', background: '#fff', padding: '18px' }}>
        <label style={labelStyle}>Company ID</label>
        <select value={company} onChange={(e) => selectCompany(e.target.value)} style={inputStyle}>
          <option value="">---------------Select---------------</option>
          {companyPaymentOptions.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
          Select the company whose payment account you want to view.
        </div>
      </div>
    </div>
  )

  return (
    <div className="bank-page company-goods-payment-screen" style={{ minHeight: '100%', background: '#fff', color: '#243b53', fontFamily: 'Arial, sans-serif' }}>
      <div className="screen-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <span>COMPANY GOODS PAYMENT SCREEN</span>
        <button type="button" onClick={() => { setReprint(!reprint); resetScreen() }} style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#173f7a', borderRadius: '6px', padding: '7px 10px', cursor: 'pointer', fontWeight: '700' }}>
          {reprint ? '← New Payment' : 'Company Payment Slip Reprint'}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px' }}>
        <button type="button" onClick={onBack || resetScreen} style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#173f7a', borderRadius: '6px', padding: '7px 12px', cursor: 'pointer', fontWeight: '700' }}>
          ← Back
        </button>
        <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: '700', fontSize: '15px' }}>
          {reprint ? 'COMPANY PAYMENT SLIP REPRINT' : 'COMPANY GOODS PAYMENT'}
        </div>
        <div style={{ width: '70px' }} />
      </div>

      {showSlip ? (
        <CompanyPaymentSlip company={company} paymentAmount={newPayment} onClose={() => setShowSlip(false)} />
      ) : !company ? (
        <div style={{ padding: '0 12px 20px' }}>{companySelector}</div>
      ) : (
        <div style={{ padding: '0 12px 24px' }}>
          <div style={{ maxWidth: '980px', margin: '0 auto', border: '1px solid #dbe5ec', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,.05)', overflow: 'hidden' }}>
            <div style={{ background: '#148dc1', color: '#fff', padding: '10px 14px', fontWeight: '700', textAlign: 'center' }}>
              . . . Company Goods Payment Slip . . .
            </div>

            <div style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '10px', marginBottom: '16px' }}>
                {[
                  ['Ref No', 'WP-og1331'],
                  ['Staff', 'oga'],
                  ['Year', '2026'],
                  ['Month', monthValue],
                  ['Date', dateValue],
                  ['Time', timeValue]
                ].map(([label, value]) => (
                  <div key={label}>
                    <label style={labelStyle}>{label}</label>
                    <input value={value} readOnly style={inputStyle} />
                  </div>
                ))}
              </div>

              <div style={{ border: '1px solid #dbe5ec', borderRadius: '7px', overflow: 'hidden' }}>
                {[
                  ['Company Name', displayCompanyName],
                  ['Company ID', company],
                  ['Company Detail', ''],
                  ['To Balance Amount', balance]
                ].map(([label, value], index) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '30% 70%', borderBottom: index === 3 ? 'none' : '1px solid #dbe5ec' }}>
                    <div style={{ background: '#f8fafc', color: '#475569', padding: '10px', fontSize: '12px', fontWeight: '700' }}>{label}</div>
                    <div style={{ padding: '10px', fontSize: index === 3 ? '20px' : '13px', fontWeight: index === 3 ? '700' : '500', color: index === 3 || index < 2 ? '#d90000' : '#243b53', overflowWrap: 'anywhere' }}>{value || '—'}</div>
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '30% 70%' }}>
                  <div style={{ background: '#f8fafc', color: '#475569', padding: '10px', fontSize: '12px', fontWeight: '700' }}>New Payment</div>
                  <div style={{ padding: '7px' }}>
                    <input type="number" min="0" step="0.01" value={newPayment} onChange={(e) => setNewPayment(e.target.value)} placeholder="Enter payment amount" style={{ ...inputStyle, fontSize: '16px' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={resetScreen} style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#173f7a', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', fontWeight: '700' }}>
                  Change Company
                </button>
                <button type="button" onClick={() => setShowSlip(true)} disabled={!newPayment || Number(newPayment) <= 0} style={{ border: '1px solid #148dc1', background: (!newPayment || Number(newPayment) <= 0) ? '#cbd5e1' : '#148dc1', color: '#fff', borderRadius: '6px', padding: '9px 24px', cursor: (!newPayment || Number(newPayment) <= 0) ? 'not-allowed' : 'pointer', fontWeight: '700' }}>
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function NYPPayment({ onBack }) {
  const [nypCustomers, setNypCustomers] = useState([])
  const [selectedNypId, setSelectedNypId] = useState('')
  const [newPayment, setNewPayment] = useState('')
  const [reprint, setReprint] = useState(false)
  const [showSlip, setShowSlip] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadNypCustomers = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await apiFetch('/api/nyp')
        if (!response.ok) throw new Error('Unable to load NYP accounts')
        const data = await response.json()
        if (!cancelled) setNypCustomers(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load NYP accounts')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadNypCustomers()
    return () => { cancelled = true }
  }, [])

  const selectedCustomer = nypCustomers.find((item) => item.nypId === selectedNypId)
  const timeValue = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now)

  const dateValue = now.toISOString().slice(0, 10)
  const monthValue = now.toLocaleString('en-US', { month: 'long' })
  const yearValue = String(now.getFullYear())
  const canConfirm = Boolean(selectedCustomer && Number(newPayment) > 0)

  const resetScreen = () => {
    setSelectedNypId('')
    setNewPayment('')
    setShowSlip(false)
    setError('')
  }

  const selectCustomer = (value) => {
    setSelectedNypId(value)
    setNewPayment('')
    setShowSlip(false)
    setError('')
  }

  const inputStyle = {
    width: '100%',
    height: '36px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    background: '#ffffff',
    color: '#173f7a',
    padding: '6px 9px',
    fontSize: '14px',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '700'
  }

  const handleModeChange = () => {
    setReprint((value) => !value)
    resetScreen()
  }

  const customerSelector = (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{
        background: '#148dc1',
        color: '#fff',
        padding: '10px 14px',
        fontWeight: '700',
        borderRadius: '8px 8px 0 0',
        textAlign: 'center'
      }}>
        . . . {reprint ? 'NYP Payment Slip Reprint' : 'NYP Sales Payment'} . . .
      </div>

      <div style={{
        border: '1px solid #dbe5ec',
        borderTop: 'none',
        borderRadius: '0 0 8px 8px',
        background: '#fff',
        padding: '18px'
      }}>
        <label style={labelStyle}>NYP ID</label>
        <select
          value={selectedNypId}
          onChange={(e) => selectCustomer(e.target.value)}
          disabled={loading}
          style={inputStyle}
        >
          <option value="">---------------Select---------------</option>
          {nypCustomers.map((item) => (
            <option key={item.id || item.nypId} value={item.nypId}>
              {item.nypId}
            </option>
          ))}
        </select>

        {loading && (
          <div style={{ marginTop: '10px', color: '#64748b', fontSize: '12px' }}>
            Loading NYP accounts...
          </div>
        )}

        {error && (
          <div style={{ marginTop: '10px', color: '#b91c1c', fontSize: '12px', fontWeight: '600' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )

  if (showSlip && selectedCustomer) {
    return (
      <div className="bank-page nyp-payment-screen" style={{ minHeight: '100%', background: '#fff', color: '#243b53', fontFamily: 'Arial, sans-serif' }}>
        <div className="screen-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <span>NYP PAYMENT SCREEN</span>
          <button
            type="button"
            onClick={() => setShowSlip(false)}
            style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#173f7a', borderRadius: '6px', padding: '7px 10px', cursor: 'pointer', fontWeight: '700' }}
          >
            ← Edit Payment
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px' }}>
          <button
            type="button"
            onClick={() => setShowSlip(false)}
            style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#173f7a', borderRadius: '6px', padding: '7px 12px', cursor: 'pointer', fontWeight: '700' }}
          >
            ← Back
          </button>
          <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: '700', fontSize: '15px' }}>
            NYP PAYMENT RECEIPT
          </div>
          <div style={{ width: '70px' }} />
        </div>

        <div style={{ padding: '0 12px 24px' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', border: '1px solid #dbe5ec', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,.05)', overflow: 'hidden' }}>
            <div style={{ background: '#148dc1', color: '#fff', padding: '10px 14px', fontWeight: '700', textAlign: 'center' }}>
              . . . NYP Payment Receipt . . .
            </div>

            <div style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '10px', marginBottom: '16px' }}>
                {[
                  ['Ref No', 'Generated on confirm'],
                  ['Staff', 'OGA'],
                  ['Year', yearValue],
                  ['Month', monthValue],
                  ['Date', dateValue],
                  ['Time', timeValue]
                ].map(([label, value]) => (
                  <div key={label}>
                    <label style={labelStyle}>{label}</label>
                    <input value={value} readOnly style={inputStyle} />
                  </div>
                ))}
              </div>

              <div style={{ border: '1px solid #dbe5ec', borderRadius: '7px', overflow: 'hidden' }}>
                {[
                  ['NYP Name', selectedCustomer.fullName || selectedCustomer.nypId],
                  ['NYP ID', selectedCustomer.nypId],
                  ['New Payment', Number(newPayment).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })]
                ].map(([label, value], index) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '30% 70%', borderBottom: index === 2 ? 'none' : '1px solid #dbe5ec' }}>
                    <div style={{ background: '#f8fafc', color: '#475569', padding: '10px', fontSize: '12px', fontWeight: '700' }}>{label}</div>
                    <div style={{ padding: '10px', fontSize: index === 2 ? '20px' : '14px', fontWeight: index === 2 ? '700' : '500', color: index === 2 ? '#d90000' : '#243b53', overflowWrap: 'anywhere' }}>{value || '—'}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '14px', padding: '11px 12px', borderRadius: '6px', background: '#fff7ed', color: '#9a3412', fontSize: '12px', lineHeight: '1.5' }}>
                The current backend contains the NYP account register, but it does not yet contain an NYP sales/payment ledger. The receipt therefore does not invent a balance value.
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowSlip(false)}
                  style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#173f7a', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', fontWeight: '700' }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{ border: '1px solid #148dc1', background: '#148dc1', color: '#fff', borderRadius: '6px', padding: '9px 24px', cursor: 'pointer', fontWeight: '700' }}
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bank-page nyp-payment-screen" style={{ minHeight: '100%', background: '#fff', color: '#243b53', fontFamily: 'Arial, sans-serif' }}>
      <div className="screen-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <span>NYP PAYMENT SCREEN</span>
        <button
          type="button"
          onClick={handleModeChange}
          style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#173f7a', borderRadius: '6px', padding: '7px 10px', cursor: 'pointer', fontWeight: '700' }}
        >
          {reprint ? '← New Payment' : 'NYP Payment Slip Reprint'}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px' }}>
        <button
          type="button"
          onClick={onBack || resetScreen}
          style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#173f7a', borderRadius: '6px', padding: '7px 12px', cursor: 'pointer', fontWeight: '700' }}
        >
          ← Back
        </button>
        <div style={{ flex: 1, textAlign: 'center', color: '#d90000', fontWeight: '700', fontSize: '15px' }}>
          {reprint ? 'NYP PAYMENT SLIP REPRINT' : 'NYP SALES PAYMENT'}
        </div>
        <div style={{ width: '70px' }} />
      </div>

      {!selectedCustomer ? (
        <div style={{ padding: '0 12px 20px' }}>{customerSelector}</div>
      ) : (
        <div style={{ padding: '0 12px 24px' }}>
          <div style={{ maxWidth: '980px', margin: '0 auto', border: '1px solid #dbe5ec', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,.05)', overflow: 'hidden' }}>
            <div style={{ background: '#148dc1', color: '#fff', padding: '10px 14px', fontWeight: '700', textAlign: 'center' }}>
              . . . NYP Sales Payment . . .
            </div>

            <div style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '10px', marginBottom: '16px' }}>
                {[
                  ['Ref No', 'Generated on confirm'],
                  ['Staff', 'OGA'],
                  ['Year', yearValue],
                  ['Month', monthValue],
                  ['Date', dateValue],
                  ['Time', timeValue]
                ].map(([label, value]) => (
                  <div key={label}>
                    <label style={labelStyle}>{label}</label>
                    <input value={value} readOnly style={inputStyle} />
                  </div>
                ))}
              </div>

              <div style={{ border: '1px solid #dbe5ec', borderRadius: '7px', overflow: 'hidden' }}>
                {[
                  ['NYP Name', selectedCustomer.fullName || selectedCustomer.nypId],
                  ['NYP ID', selectedCustomer.nypId]
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '30% 70%', borderBottom: '1px solid #dbe5ec' }}>
                    <div style={{ background: '#f8fafc', color: '#475569', padding: '10px', fontSize: '12px', fontWeight: '700' }}>{label}</div>
                    <div style={{ padding: '10px', fontSize: '14px', fontWeight: '500', color: '#243b53', overflowWrap: 'anywhere' }}>{value || '—'}</div>
                  </div>
                ))}

                <div style={{ display: 'grid', gridTemplateColumns: '30% 70%' }}>
                  <div style={{ background: '#f8fafc', color: '#475569', padding: '10px', fontSize: '12px', fontWeight: '700' }}>
                    New Payment
                  </div>
                  <div style={{ padding: '7px' }}>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newPayment}
                      onChange={(e) => setNewPayment(e.target.value)}
                      placeholder="Enter payment amount"
                      style={{ ...inputStyle, fontSize: '16px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '14px', padding: '11px 12px', borderRadius: '6px', background: '#f8fafc', color: '#64748b', fontSize: '12px', lineHeight: '1.5' }}>
                NYP account information is loaded from the backend. Payment posting and account balance calculation will be connected to the NYP transaction ledger before this screen is used for real payments.
              </div>

              {error && (
                <div style={{ marginTop: '10px', color: '#b91c1c', fontSize: '12px', fontWeight: '600' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={resetScreen}
                  style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#173f7a', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', fontWeight: '700' }}
                >
                  Change NYP
                </button>
                <button
                  type="button"
                  onClick={() => setShowSlip(true)}
                  disabled={!canConfirm}
                  style={{ border: '1px solid #148dc1', background: canConfirm ? '#148dc1' : '#cbd5e1', color: '#fff', borderRadius: '6px', padding: '9px 24px', cursor: canConfirm ? 'pointer' : 'not-allowed', fontWeight: '700' }}
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CashSalesPaymentStatus({ onBack }) {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [month, setMonth] = useState(String(new Date().getMonth() + 1))
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [searched, setSearched] = useState(false)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const years = Array.from({ length: 17 }, (_, i) => String(2018 + i))
  const money = (value) =>
    `₦${Number(value || 0).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`

  const fieldStyle = {
    width: '100%',
    height: '38px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    background: '#fff',
    color: '#173f7a',
    padding: '6px 9px',
    fontSize: '14px',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '700'
  }

  const primaryButton = {
    border: '1px solid #148dc1',
    background: '#148dc1',
    color: '#fff',
    borderRadius: '4px',
    minHeight: '38px',
    padding: '0 16px',
    cursor: loading ? 'wait' : 'pointer',
    fontWeight: '700',
    opacity: loading ? 0.7 : 1
  }

  const secondaryButton = {
    border: '1px solid #9fb4c5',
    background: '#fff',
    color: '#173f7a',
    borderRadius: '4px',
    minHeight: '38px',
    padding: '0 16px',
    cursor: 'pointer',
    fontWeight: '700'
  }

  const tabStyle = (active) => ({
    border: '1px solid #148dc1',
    background: active ? '#148dc1' : '#fff',
    color: active ? '#fff' : '#173f7a',
    borderRadius: '4px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '12px'
  })

  const periodLabel = mode === '24hrs'
    ? date
    : mode === 'monthly'
      ? `${months[Number(month) - 1]} ${year}`
      : year

  const resetResults = () => {
    setSearched(false)
    setReport(null)
    setError('')
  }

  const runSearch = async () => {
    if (mode === '24hrs' && !date) {
      setError('Please select a date.')
      setReport(null)
      setSearched(false)
      return
    }

    const params = new URLSearchParams({ mode })

    if (mode === '24hrs') {
      params.set('date', date)
    } else if (mode === 'monthly') {
      params.set('month', month)
      params.set('year', year)
    } else {
      params.set('year', year)
    }

    setLoading(true)
    setError('')
    setSearched(true)
    setReport(null)

    try {
      const response = await apiFetch(
        `/api/md-ceo/cashsales-payment-status?${params.toString()}`
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load CashSales payment status.')
      }

      setReport(data)
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend.')
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    resetResults()
  }

  const changeMode = (nextMode) => {
    setMode(nextMode)
    resetResults()
  }

  const rows = Array.isArray(report?.rows) ? report.rows : []
  const totals = report?.totals || { total: 0, paid: 0, balance: 0 }

  const getStatus = (row) => {
    const paid = Number(row.paidAmount || 0)
    const balance = Number(row.balance || 0)

    if (balance <= 0.005) {
      return { label: 'PAID', color: '#166534', background: '#dcfce7' }
    }
    if (paid > 0.005) {
      return { label: 'PART PAID', color: '#92400e', background: '#fef3c7' }
    }
    return { label: 'UNPAID', color: '#991b1b', background: '#fee2e2' }
  }

  return (
    <div style={{ padding: '18px 20px 28px', color: '#243b53' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: '4px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#173f7a', fontSize: '22px', lineHeight: 1.2 }}>
            CashSales-Payment Status
          </h2>
          <div style={{ marginTop: '6px', color: '#64748b', fontSize: '13px' }}>
            Review CashSales payment verification status by day, month, or year.
          </div>
        </div>
        <button type="button" onClick={onBack} style={secondaryButton}>
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth: '760px',
        margin: '20px auto 0',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 10px rgba(15,23,42,.07)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          padding: '11px 14px',
          textAlign: 'center',
          fontWeight: '700',
          fontSize: '17px'
        }}>
          CASHSALES-PAYMENT STATUS
        </div>

        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
            <button type="button" onClick={() => changeMode('24hrs')} style={tabStyle(mode === '24hrs')}>
              24hrs Status
            </button>
            <button type="button" onClick={() => changeMode('monthly')} style={tabStyle(mode === 'monthly')}>
              Monthly Status
            </button>
            <button type="button" onClick={() => changeMode('yearly')} style={tabStyle(mode === 'yearly')}>
              Yearly Status
            </button>
          </div>

          {mode === '24hrs' && (
            <div style={{ maxWidth: '470px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'end' }}>
              <div>
                <label style={labelStyle}>Enter Date</label>
                <input type="date" value={date} onChange={(e) => { setDate(e.target.value); resetResults() }} style={fieldStyle} />
              </div>
              <button type="button" onClick={runSearch} disabled={loading} style={primaryButton}>
                {loading ? 'Loading…' : 'Search'}
              </button>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ maxWidth: '650px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
              <div>
                <label style={labelStyle}>Month</label>
                <select value={month} onChange={(e) => { setMonth(e.target.value); resetResults() }} style={fieldStyle}>
                  {months.map((item, index) => (
                    <option key={item} value={String(index + 1)}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Year</label>
                <select value={year} onChange={(e) => { setYear(e.target.value); resetResults() }} style={fieldStyle}>
                  {years.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <button type="button" onClick={runSearch} disabled={loading} style={primaryButton}>
                {loading ? 'Loading…' : 'Search'}
              </button>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ maxWidth: '470px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'end' }}>
              <div>
                <label style={labelStyle}>Year</label>
                <select value={year} onChange={(e) => { setYear(e.target.value); resetResults() }} style={fieldStyle}>
                  {years.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <button type="button" onClick={runSearch} disabled={loading} style={primaryButton}>
                {loading ? 'Loading…' : 'Search'}
              </button>
            </div>
          )}

          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <button type="button" onClick={clearSearch} style={secondaryButton}>Clear</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          maxWidth: '1250px',
          margin: '18px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 10px rgba(15,23,42,.07)',
          overflow: 'hidden'
        }}>
          <div style={{ background: '#1593c8', color: '#fff', padding: '10px 14px', fontWeight: '700' }}>
            {periodLabel}: CASHSALES-PAYMENT STATUS
          </div>

          {error && (
            <div role="alert" style={{ margin: '14px', padding: '12px', borderRadius: '5px', color: '#991b1b', background: '#fee2e2', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ padding: '28px 16px', textAlign: 'center', color: '#475569' }}>
              Loading CashSales payment records…
            </div>
          )}

          {!loading && !error && report && (
            <>
              <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {[
                  ['Invoices', rows.length.toLocaleString('en-NG')],
                  ['Invoice Total', money(totals.total)],
                  ['Amount Paid', money(totals.paid)],
                  ['Outstanding Balance', money(totals.balance)]
                ].map(([label, value]) => (
                  <div key={label} style={{ border: '1px solid #d8e4ec', borderRadius: '5px', background: '#fff', padding: '12px' }}>
                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', marginBottom: '5px' }}>{label}</div>
                    <div style={{ color: '#173f7a', fontSize: '16px', fontWeight: '700', overflowWrap: 'anywhere' }}>{value}</div>
                  </div>
                ))}
              </div>

              {rows.length === 0 ? (
                <div style={{ margin: '0 14px 14px', border: '1px dashed #9fb4c5', borderRadius: '6px', background: '#fff', padding: '24px 16px', textAlign: 'center' }}>
                  <div style={{ color: '#475569', fontWeight: '700', marginBottom: '6px' }}>
                    No CashSales invoices found for this period.
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>
                    Try another date, month, or year.
                  </div>
                </div>
              ) : (
                <div style={{ margin: '0 14px 14px', overflowX: 'auto', background: '#fff', border: '1px solid #d8e4ec', borderRadius: '5px' }}>
                  <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#eaf5fb', color: '#173f7a', textAlign: 'left' }}>
                        {['S/N', 'Invoice Ref', 'Sale Date', 'Customer', 'Sales Staff', 'Invoice Total', 'Amount Paid', 'Outstanding', 'Status'].map((heading) => (
                          <th key={heading} style={{ padding: '11px 9px', borderBottom: '1px solid #d8e4ec', whiteSpace: 'nowrap' }}>{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => {
                        const status = getStatus(row)
                        return (
                          <tr key={row.id ?? row.invoiceNo ?? index}>
                            <td style={{ padding: '10px 9px', borderBottom: '1px solid #edf2f7' }}>{index + 1}</td>
                            <td style={{ padding: '10px 9px', borderBottom: '1px solid #edf2f7', fontWeight: '700', whiteSpace: 'nowrap' }}>{row.invoiceNo || '—'}</td>
                            <td style={{ padding: '10px 9px', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{row.saleDate ? new Date(row.saleDate).toLocaleDateString('en-GB') : '—'}</td>
                            <td style={{ padding: '10px 9px', borderBottom: '1px solid #edf2f7' }}>{row.customerName || 'Walk-in Customer'}</td>
                            <td style={{ padding: '10px 9px', borderBottom: '1px solid #edf2f7' }}>{row.salesStaff || '—'}</td>
                            <td style={{ padding: '10px 9px', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{money(row.totalAmount)}</td>
                            <td style={{ padding: '10px 9px', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{money(row.paidAmount)}</td>
                            <td style={{ padding: '10px 9px', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{money(row.balance)}</td>
                            <td style={{ padding: '10px 9px', borderBottom: '1px solid #edf2f7' }}>
                              <span style={{ display: 'inline-block', borderRadius: '4px', padding: '4px 7px', color: status.color, background: status.background, fontWeight: '700', whiteSpace: 'nowrap' }}>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f1f7fb', fontWeight: '700' }}>
                        <td colSpan={5} style={{ padding: '11px 9px', borderTop: '2px solid #cbdde8' }}>PERIOD TOTAL</td>
                        <td style={{ padding: '11px 9px', borderTop: '2px solid #cbdde8', whiteSpace: 'nowrap' }}>{money(totals.total)}</td>
                        <td style={{ padding: '11px 9px', borderTop: '2px solid #cbdde8', whiteSpace: 'nowrap' }}>{money(totals.paid)}</td>
                        <td style={{ padding: '11px 9px', borderTop: '2px solid #cbdde8', whiteSpace: 'nowrap' }}>{money(totals.balance)}</td>
                        <td style={{ padding: '11px 9px', borderTop: '2px solid #cbdde8' }}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '8px', padding: '0 14px 14px' }}>
            <button type="button" onClick={clearSearch} style={secondaryButton}>Change Search</button>
            <button type="button" onClick={() => window.print()} disabled={loading || !!error || !report} style={primaryButton}>Send To Printer</button>
          </div>
        </div>
      )}
    </div>
  )
}

function CashSalesPayment({ onBack }) {
  const [view, setView] = useState('payment')
  const [refNo, setRefNo] = useState('')
  const [searched, setSearched] = useState(false)
  const [message, setMessage] = useState('Enter a CashSales transaction reference number to continue.')
  const [messageType, setMessageType] = useState('info')

  const resetPayment = () => {
    setRefNo('')
    setSearched(false)
    setMessage('Enter a CashSales transaction reference number to continue.')
    setMessageType('info')
  }

  const searchTransaction = () => {
    const value = refNo.trim()

    if (!value) {
      setSearched(false)
      setMessage('Please enter a CashSales transaction reference number.')
      setMessageType('error')
      return
    }

    setSearched(true)
    setMessage('CashSales transaction lookup is not yet connected to the backend. No payment record has been loaded.')
    setMessageType('info')
  }

  if (view === 'reprint') {
    return (
      <div style={{ position: 'relative', minHeight: '100%' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <div>
            <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
              CASHSALES PAYMENT SCREEN
            </div>
            <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
              CashSales payment reprint
            </div>
          </div>

          <button
            onClick={() => {
              setView('payment')
              resetPayment()
            }}
            style={{
              border: '1px solid #cbd7e2',
              background: '#fff',
              color: '#244e73',
              borderRadius: '6px',
              padding: '7px 12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ← CashSales Payment
          </button>
        </div>

        <div style={{
          maxWidth: '760px',
          margin: '0 auto',
          border: '1px solid #d5e1eb',
          borderRadius: '10px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#148dc1',
            color: '#fff',
            padding: '12px 16px',
            fontWeight: '800',
            textAlign: 'center'
          }}>
            CashSales Payment Reprint
          </div>

          <div style={{ padding: '20px' }}>
            <label style={{ display: 'block', color: '#244e73', fontWeight: '700', fontSize: '13px', marginBottom: '7px' }}>
              Transaction Ref No
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                autoFocus
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') searchTransaction()
                }}
                placeholder="Enter transaction reference"
                style={{
                  flex: 1,
                  height: '40px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 11px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={searchTransaction}
                style={{
                  minWidth: '92px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#148dc1',
                  color: '#fff',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>

            <div style={{
              marginTop: '18px',
              padding: '14px',
              borderRadius: '7px',
              background: '#f5f8fb',
              border: '1px solid #dbe5ed',
              color: '#66788a',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {searched
                ? 'No reprint record has been loaded because the CashSales transaction lookup is not yet connected to the backend.'
                : 'Search an existing CashSales transaction to load its payment receipt for reprinting.'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            CASHSALES PAYMENT SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            Process and verify CashSales payments
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setView('reprint')}
            style={{
              border: '1px solid #cbd7e2',
              background: '#fff',
              color: '#244e73',
              borderRadius: '6px',
              padding: '7px 12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            CashSales Reprint
          </button>
          <button
            onClick={onBack}
            style={{
              border: '1px solid #cbd7e2',
              background: '#fff',
              color: '#244e73',
              borderRadius: '6px',
              padding: '7px 12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      <div style={{
        maxWidth: '860px',
        margin: '0 auto',
        border: '1px solid #d5e1eb',
        borderRadius: '10px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#148dc1',
          color: '#fff',
          padding: '13px 16px',
          textAlign: 'center',
          fontWeight: '800',
          fontSize: '16px'
        }}>
          CashSales Payment
        </div>

        <div style={{ padding: '22px' }}>
          <div style={{
            maxWidth: '620px',
            margin: '0 auto'
          }}>
            <label style={{
              display: 'block',
              color: '#244e73',
              fontWeight: '700',
              fontSize: '13px',
              marginBottom: '7px'
            }}>
              CashSales Transaction Ref No
            </label>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                autoFocus
                value={refNo}
                onChange={(e) => {
                  setRefNo(e.target.value)
                  if (searched) setSearched(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') searchTransaction()
                }}
                placeholder="Enter transaction reference"
                style={{
                  flex: 1,
                  height: '42px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#173f63'
                }}
              />
              <button
                onClick={searchTransaction}
                style={{
                  minWidth: '100px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#148dc1',
                  color: '#fff',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>

            <div style={{
              marginTop: '20px',
              border: `1px solid ${messageType === 'error' ? '#efc4c4' : '#dbe5ed'}`,
              background: messageType === 'error' ? '#fff6f6' : '#f5f8fb',
              borderRadius: '8px',
              padding: '15px 16px',
              textAlign: 'center',
              color: messageType === 'error' ? '#a12626' : '#536b80',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {message}
            </div>

            <div style={{
              marginTop: '18px',
              padding: '13px 14px',
              borderLeft: '4px solid #148dc1',
              background: '#f8fbfd',
              color: '#63788b',
              fontSize: '12px',
              lineHeight: '1.55'
            }}>
              Payment processing will use the real CashSales transaction ledger once the CashSales payment backend is connected. No sample transaction or payment record is created by this screen.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExternalCashPayIn({ onBack }) {
  const [source, setSource] = useState('')
  const [cashAmount, setCashAmount] = useState('')
  const [message, setMessage] = useState('Enter the source and cash amount, then confirm the pay-in.')
  const [messageType, setMessageType] = useState('info')
  const [confirmed, setConfirmed] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (value) => String(value).padStart(2, '0')
  const year = now.getFullYear()
  const month = now.toLocaleString('en-US', { month: 'long' })
  const date = `${year}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  const resetForm = () => {
    setSource('')
    setCashAmount('')
    setConfirmed(false)
    setMessage('Enter the source and cash amount, then confirm the pay-in.')
    setMessageType('info')
  }

  const confirmPayment = () => {
    const sourceValue = source.trim()
    const amountValue = Number(cashAmount)

    if (!sourceValue) {
      setConfirmed(false)
      setMessage('Please enter the source of the external cash.')
      setMessageType('error')
      return
    }

    if (!cashAmount || !Number.isFinite(amountValue) || amountValue <= 0) {
      setConfirmed(false)
      setMessage('Please enter a valid cash amount greater than zero.')
      setMessageType('error')
      return
    }

    setConfirmed(true)
    setMessage('External Cash PAY-IN is not yet connected to the backend. No transaction has been saved.')
    setMessageType('info')
  }

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            color: '#173f63',
            fontWeight: '800',
            fontSize: '12px',
            letterSpacing: '.2px'
          }}>
            EXTERNAL CASH PAY-IN SCREEN
          </div>
          <div style={{
            color: '#66788a',
            fontSize: '12px',
            marginTop: '3px'
          }}>
            Record cash received from an external source
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border: '1px solid #cbd7e2',
            background: '#fff',
            color: '#244e73',
            borderRadius: '6px',
            padding: '7px 12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth: '860px',
        margin: '0 auto',
        border: '1px solid #d5e1eb',
        borderRadius: '10px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#148dc1',
          color: '#fff',
          padding: '13px 16px',
          textAlign: 'center',
          fontWeight: '800',
          fontSize: '16px'
        }}>
          External Cash Pay-IN
        </div>

        <div style={{ padding: '22px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {[
              ['Year', String(year)],
              ['Month', month],
              ['Date', date],
              ['Time', time]
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  border: '1px solid #dbe5ed',
                  borderRadius: '7px',
                  background: '#f8fbfd',
                  padding: '9px 10px'
                }}
              >
                <div style={{
                  color: '#6c8091',
                  fontSize: '11px',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  {label}
                </div>
                <div style={{
                  color: '#173f63',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            <div style={{
              marginBottom: '18px'
            }}>
              <label style={{
                display: 'block',
                color: '#244e73',
                fontWeight: '700',
                fontSize: '13px',
                marginBottom: '7px'
              }}>
                Source
              </label>

              <textarea
                value={source}
                onChange={(e) => {
                  setSource(e.target.value)
                  if (confirmed) setConfirmed(false)
                  if (messageType === 'error') {
                    setMessage('Enter the source and cash amount, then confirm the pay-in.')
                    setMessageType('info')
                  }
                }}
                placeholder="Enter the source of the external cash"
                rows={4}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '10px 11px',
                  fontSize: '14px',
                  color: '#173f63',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              marginBottom: '18px'
            }}>
              <label style={{
                display: 'block',
                color: '#244e73',
                fontWeight: '700',
                fontSize: '13px',
                marginBottom: '7px'
              }}>
                Cash Amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={cashAmount}
                onChange={(e) => {
                  setCashAmount(e.target.value)
                  if (confirmed) setConfirmed(false)
                  if (messageType === 'error') {
                    setMessage('Enter the source and cash amount, then confirm the pay-in.')
                    setMessageType('info')
                  }
                }}
                placeholder="Enter cash amount"
                style={{
                  width: '100%',
                  height: '44px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 12px',
                  fontSize: '15px',
                  color: '#173f63',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <button
                onClick={resetForm}
                style={{
                  height: '42px',
                  border: '1px solid #cbd7e2',
                  borderRadius: '6px',
                  background: '#fff',
                  color: '#244e73',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>

              <button
                onClick={confirmPayment}
                style={{
                  height: '42px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#148dc1',
                  color: '#fff',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Confirm PMT
              </button>
            </div>

            <div style={{
              marginTop: '20px',
              border: `1px solid ${messageType === 'error' ? '#efc4c4' : '#dbe5ed'}`,
              background: messageType === 'error' ? '#fff6f6' : '#f5f8fb',
              borderRadius: '8px',
              padding: '15px 16px',
              textAlign: 'center',
              color: messageType === 'error' ? '#a12626' : '#536b80',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {message}
            </div>

            <div style={{
              marginTop: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <div style={{
                border: '1px solid #dbe5ed',
                borderRadius: '7px',
                background: '#fafcfe',
                padding: '11px 12px'
              }}>
                <div style={{
                  color: '#6c8091',
                  fontSize: '11px',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  Reference No
                </div>
                <div style={{
                  color: '#173f63',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  —
                </div>
              </div>

              <div style={{
                border: '1px solid #dbe5ed',
                borderRadius: '7px',
                background: '#fafcfe',
                padding: '11px 12px'
              }}>
                <div style={{
                  color: '#6c8091',
                  fontSize: '11px',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  Transaction Status
                </div>
                <div style={{
                  color: confirmed ? '#536b80' : '#6c8091',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  {confirmed ? 'Pending backend connection' : 'Not submitted'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function CashDeposit({ onBack }) {
  const [receiverName, setReceiverName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [reprint, setReprint] = useState(false)
  const [reprintRef, setReprintRef] = useState('')
  const [message, setMessage] = useState('Enter the deposit details, then confirm the payment.')
  const [messageType, setMessageType] = useState('info')
  const [confirmed, setConfirmed] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (value) => String(value).padStart(2, '0')
  const year = now.getFullYear()
  const month = now.toLocaleString('en-US', { month: 'long' })
  const date = `${year}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  const clearForm = () => {
    setReceiverName('')
    setPurpose('')
    setPaidAmount('')
    setConfirmed(false)
    setMessage('Enter the deposit details, then confirm the payment.')
    setMessageType('info')
  }

  const confirmPay = () => {
    const amount = Number(paidAmount)

    if (!receiverName.trim()) {
      setConfirmed(false)
      setMessage('Please enter the receiver name.')
      setMessageType('error')
      return
    }

    if (!purpose.trim()) {
      setConfirmed(false)
      setMessage('Please enter the purpose of the cash deposit.')
      setMessageType('error')
      return
    }

    if (!paidAmount || !Number.isFinite(amount) || amount <= 0) {
      setConfirmed(false)
      setMessage('Please enter a valid paid amount greater than zero.')
      setMessageType('error')
      return
    }

    setConfirmed(true)
    setMessage('Cash Deposit is not yet connected to the backend. No transaction has been saved.')
    setMessageType('info')
  }

  const openReprint = () => {
    setReprint(true)
    setMessage('Enter a real Cash Deposit reference number to retrieve a receipt when the backend is connected.')
    setMessageType('info')
  }

  if (reprint) {
    return (
      <div style={{ position: 'relative', minHeight: '100%' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <div>
            <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px' }}>
              CASH DEPOSIT REPRINT
            </div>
            <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
              Retrieve an existing Cash Deposit receipt
            </div>
          </div>
          <button
            onClick={() => setReprint(false)}
            style={{
              border: '1px solid #cbd7e2',
              background: '#fff',
              color: '#244e73',
              borderRadius: '6px',
              padding: '7px 12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ← Back to Cash Deposit
          </button>
        </div>

        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          border: '1px solid #d5e1eb',
          borderRadius: '10px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#148dc1',
            color: '#fff',
            padding: '13px 16px',
            textAlign: 'center',
            fontWeight: '800',
            fontSize: '16px'
          }}>
            Cash Deposit Reprint
          </div>
          <div style={{ padding: '24px' }}>
            <label style={{
              display: 'block', color: '#244e73', fontWeight: '700', fontSize: '13px', marginBottom: '7px'
            }}>
              Reference No
            </label>
            <input
              value={reprintRef}
              onChange={(e) => setReprintRef(e.target.value)}
              placeholder="Enter Cash Deposit reference number"
              style={{
                width: '100%', height: '44px', boxSizing: 'border-box',
                border: '1px solid #bdccd9', borderRadius: '6px', padding: '0 12px',
                fontSize: '14px', color: '#173f63', outline: 'none'
              }}
            />
            <button
              onClick={() => {
                if (!reprintRef.trim()) {
                  setMessage('Please enter a reference number.')
                  setMessageType('error')
                  return
                }
                setMessage('Cash Deposit reprint lookup is not yet connected to the backend. No receipt was retrieved.')
                setMessageType('info')
              }}
              style={{
                width: '100%', height: '42px', marginTop: '14px', border: 'none',
                borderRadius: '6px', background: '#148dc1', color: '#fff',
                fontWeight: '800', cursor: 'pointer'
              }}
            >
              Search Receipt
            </button>
            <div style={{
              marginTop: '16px', border: `1px solid ${messageType === 'error' ? '#efc4c4' : '#dbe5ed'}`,
              background: messageType === 'error' ? '#fff6f6' : '#f5f8fb', borderRadius: '8px',
              padding: '14px 16px', textAlign: 'center', color: messageType === 'error' ? '#a12626' : '#536b80',
              fontSize: '13px', lineHeight: '1.5'
            }}>
              {message}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            CASH DEPOSIT SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            Record a cash deposit and issue a receipt
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={openReprint}
            style={{
              border: '1px solid #cbd7e2', background: '#fff', color: '#244e73',
              borderRadius: '6px', padding: '7px 12px', fontWeight: '700', cursor: 'pointer'
            }}
          >
            Cash Deposit Reprint
          </button>
          <button
            onClick={onBack}
            style={{
              border: '1px solid #cbd7e2', background: '#fff', color: '#244e73',
              borderRadius: '6px', padding: '7px 12px', fontWeight: '700', cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      <div style={{
        maxWidth: '860px', margin: '0 auto', border: '1px solid #d5e1eb', borderRadius: '10px',
        background: '#fff', boxShadow: '0 2px 8px rgba(22, 61, 91, .06)', overflow: 'hidden'
      }}>
        <div style={{
          background: '#148dc1', color: '#fff', padding: '13px 16px', textAlign: 'center',
          fontWeight: '800', fontSize: '16px'
        }}>
          Cash Deposit Invoice
        </div>

        <div style={{ padding: '22px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px'
          }}>
            {[
              ['Reference No', '—'],
              ['Year', String(year)],
              ['Month', month],
              ['Date', date]
            ].map(([label, value]) => (
              <div key={label} style={{
                border: '1px solid #dbe5ed', borderRadius: '7px', background: '#f8fbfd', padding: '9px 10px'
              }}>
                <div style={{ color: '#6c8091', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>{label}</div>
                <div style={{ color: '#173f63', fontSize: '13px', fontWeight: '800' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            {[
              ['Receiver Name', receiverName, setReceiverName, 'Enter receiver name'],
              ['Purpose', purpose, setPurpose, 'Enter purpose of the deposit']
            ].map(([label, value, setter, placeholder]) => (
              <div key={label} style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: '#244e73', fontWeight: '700', fontSize: '13px', marginBottom: '7px' }}>
                  {label}
                </label>
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  style={{
                    width: '100%', height: '44px', boxSizing: 'border-box', border: '1px solid #bdccd9',
                    borderRadius: '6px', padding: '0 12px', fontSize: '14px', color: '#173f63', outline: 'none'
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', color: '#244e73', fontWeight: '700', fontSize: '13px', marginBottom: '7px' }}>
                Paid Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Enter paid amount"
                style={{
                  width: '100%', height: '44px', boxSizing: 'border-box', border: '1px solid #bdccd9',
                  borderRadius: '6px', padding: '0 12px', fontSize: '15px', color: '#173f63', outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'
            }}>
              <button onClick={clearForm} style={{
                height: '42px', border: '1px solid #cbd7e2', borderRadius: '6px', background: '#fff',
                color: '#244e73', fontWeight: '800', cursor: 'pointer'
              }}>
                Clear
              </button>
              <button onClick={confirmPay} style={{
                height: '42px', border: 'none', borderRadius: '6px', background: '#148dc1', color: '#fff',
                fontWeight: '800', cursor: 'pointer'
              }}>
                Confirm Pay
              </button>
            </div>

            <div style={{
              marginTop: '20px', border: `1px solid ${messageType === 'error' ? '#efc4c4' : '#dbe5ed'}`,
              background: messageType === 'error' ? '#fff6f6' : '#f5f8fb', borderRadius: '8px', padding: '15px 16px',
              textAlign: 'center', color: messageType === 'error' ? '#a12626' : '#536b80', fontSize: '13px', lineHeight: '1.5'
            }}>
              {message}
            </div>

            <div style={{
              marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'
            }}>
              <div style={{ border: '1px solid #dbe5ed', borderRadius: '7px', background: '#fafcfe', padding: '11px 12px' }}>
                <div style={{ color: '#6c8091', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>Reference No</div>
                <div style={{ color: '#173f63', fontSize: '13px', fontWeight: '800' }}>—</div>
              </div>
              <div style={{ border: '1px solid #dbe5ed', borderRadius: '7px', background: '#fafcfe', padding: '11px 12px' }}>
                <div style={{ color: '#6c8091', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>Transaction Status</div>
                <div style={{ color: '#536b80', fontSize: '13px', fontWeight: '800' }}>
                  {confirmed ? 'Pending backend connection' : 'Not submitted'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function Expenses({ onBack }) {
  const [receiverName, setReceiverName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [now, setNow] = useState(new Date())
  const [confirmed, setConfirmed] = useState(false)
  const [message, setMessage] = useState('Enter the expense details, then confirm payment.')
  const [messageType, setMessageType] = useState('info')
  const [reprint, setReprint] = useState(false)
  const [reprintRef, setReprintRef] = useState('')
  const [reprintMessage, setReprintMessage] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (value) => String(value).padStart(2, '0')
  const year = now.getFullYear()
  const month = now.toLocaleString('en-US', { month: 'long' })
  const date = `${year}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  const clearForm = () => {
    setReceiverName('')
    setPurpose('')
    setPaidAmount('')
    setConfirmed(false)
    setMessage('Enter the expense details, then confirm payment.')
    setMessageType('info')
  }

  const confirmPay = () => {
    const receiver = receiverName.trim()
    const purposeValue = purpose.trim()
    const amount = Number(paidAmount)

    if (!receiver) {
      setConfirmed(false)
      setMessage('Please enter the receiver name.')
      setMessageType('error')
      return
    }

    if (!purposeValue) {
      setConfirmed(false)
      setMessage('Please enter the purpose of the expense.')
      setMessageType('error')
      return
    }

    if (!paidAmount || !Number.isFinite(amount) || amount <= 0) {
      setConfirmed(false)
      setMessage('Please enter a valid paid amount greater than zero.')
      setMessageType('error')
      return
    }

    setConfirmed(true)
    setMessage('Expenses is not yet connected to the backend. No transaction has been saved.')
    setMessageType('info')
  }

  const searchReprint = () => {
    const ref = reprintRef.trim()
    if (!ref) {
      setReprintMessage('Please enter a transaction reference number.')
      return
    }
    setReprintMessage('No expense transaction was found. Reprint lookup will use the real backend ledger when connected.')
  }

  if (reprint) {
    return (
      <div style={{ position: 'relative', minHeight: '100%' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', marginBottom: '12px'
        }}>
          <div>
            <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px' }}>
              EXPENSES REPRINT SCREEN
            </div>
            <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
              Retrieve a previously saved expense receipt
            </div>
          </div>
          <button
            onClick={() => { setReprint(false); setReprintMessage('') }}
            style={{ border: '1px solid #cbd7e2', background: '#fff', color: '#244e73', borderRadius: '6px', padding: '7px 12px', fontWeight: '700', cursor: 'pointer' }}
          >
            ← Back
          </button>
        </div>

        <div style={{ maxWidth: '760px', margin: '0 auto', border: '1px solid #d5e1eb', borderRadius: '10px', background: '#fff', boxShadow: '0 2px 8px rgba(22, 61, 91, .06)', overflow: 'hidden' }}>
          <div style={{ background: '#148dc1', color: '#fff', padding: '13px 16px', textAlign: 'center', fontWeight: '800', fontSize: '16px' }}>
            Expenses Slip Reprint
          </div>
          <div style={{ padding: '24px' }}>
            <label style={{ display: 'block', color: '#244e73', fontWeight: '700', fontSize: '13px', marginBottom: '7px' }}>
              Reference No
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                value={reprintRef}
                onChange={(e) => { setReprintRef(e.target.value); setReprintMessage('') }}
                placeholder="Enter expense reference number"
                style={{ flex: 1, height: '42px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', padding: '0 12px', fontSize: '14px', color: '#173f63' }}
              />
              <button
                onClick={searchReprint}
                style={{ height: '42px', border: 'none', borderRadius: '6px', background: '#148dc1', color: '#fff', padding: '0 20px', fontWeight: '800', cursor: 'pointer' }}
              >
                Search
              </button>
            </div>
            <div style={{ marginTop: '18px', border: '1px solid #dbe5ed', background: '#f5f8fb', borderRadius: '8px', padding: '15px 16px', textAlign: 'center', color: '#536b80', fontSize: '13px', lineHeight: '1.5' }}>
              {reprintMessage || 'Enter a reference number to search the real expense ledger.'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px' }}>EXPENSES SCREEN</div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>Record a business expense and issue a receipt</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setReprint(true); setReprintMessage('') }} style={{ border: '1px solid #cbd7e2', background: '#fff', color: '#244e73', borderRadius: '6px', padding: '7px 12px', fontWeight: '700', cursor: 'pointer' }}>
            Expenses Slip Reprint
          </button>
          <button onClick={onBack} style={{ border: '1px solid #cbd7e2', background: '#fff', color: '#244e73', borderRadius: '6px', padding: '7px 12px', fontWeight: '700', cursor: 'pointer' }}>
            ← Back
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', border: '1px solid #d5e1eb', borderRadius: '10px', background: '#fff', boxShadow: '0 2px 8px rgba(22, 61, 91, .06)', overflow: 'hidden' }}>
        <div style={{ background: '#148dc1', color: '#fff', padding: '13px 16px', textAlign: 'center', fontWeight: '800', fontSize: '16px' }}>
          Expenses Invoice
        </div>

        <div style={{ padding: '22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              ['Reference No', '—'],
              ['Year', String(year)],
              ['Month', month],
              ['Date', date]
            ].map(([label, value]) => (
              <div key={label} style={{ border: '1px solid #dbe5ed', borderRadius: '7px', background: '#f8fbfd', padding: '9px 10px' }}>
                <div style={{ color: '#6c8091', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>{label}</div>
                <div style={{ color: '#173f63', fontSize: '13px', fontWeight: '800' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {[
              ['Receiver Name', receiverName, setReceiverName, 'Enter receiver name'],
              ['Purpose', purpose, setPurpose, 'Enter purpose of the expense']
            ].map(([label, value, setter, placeholder]) => (
              <div key={label} style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: '#244e73', fontWeight: '700', fontSize: '13px', marginBottom: '7px' }}>{label}</label>
                <input value={value} onChange={(e) => { setter(e.target.value); setConfirmed(false) }} placeholder={placeholder} style={{ width: '100%', height: '44px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', padding: '0 12px', fontSize: '14px', color: '#173f63' }} />
              </div>
            ))}

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', color: '#244e73', fontWeight: '700', fontSize: '13px', marginBottom: '7px' }}>Paid Amount</label>
              <input type="number" min="0" step="0.01" value={paidAmount} onChange={(e) => { setPaidAmount(e.target.value); setConfirmed(false) }} placeholder="Enter amount" style={{ width: '100%', height: '44px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', padding: '0 12px', fontSize: '15px', color: '#173f63' }} />
            </div>

            <div style={{ color: '#66788a', fontSize: '12px', marginBottom: '18px', textAlign: 'right' }}>
              Current time: <strong>{time}</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={clearForm} style={{ height: '42px', border: '1px solid #cbd7e2', borderRadius: '6px', background: '#fff', color: '#244e73', fontWeight: '800', cursor: 'pointer' }}>Clear</button>
              <button onClick={confirmPay} style={{ height: '42px', border: 'none', borderRadius: '6px', background: '#148dc1', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>Confirm Pay</button>
            </div>

            <div style={{ marginTop: '20px', border: `1px solid ${messageType === 'error' ? '#efc4c4' : '#dbe5ed'}`, background: messageType === 'error' ? '#fff6f6' : '#f5f8fb', borderRadius: '8px', padding: '15px 16px', textAlign: 'center', color: messageType === 'error' ? '#a12626' : '#536b80', fontSize: '13px', lineHeight: '1.5' }}>
              {message}
            </div>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ border: '1px solid #dbe5ed', borderRadius: '7px', background: '#fafcfe', padding: '11px 12px' }}>
                <div style={{ color: '#6c8091', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>Reference No</div>
                <div style={{ color: '#173f63', fontSize: '13px', fontWeight: '800' }}>—</div>
              </div>
              <div style={{ border: '1px solid #dbe5ed', borderRadius: '7px', background: '#fafcfe', padding: '11px 12px' }}>
                <div style={{ color: '#6c8091', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>Transaction Status</div>
                <div style={{ color: '#536b80', fontSize: '13px', fontWeight: '800' }}>{confirmed ? 'Pending backend connection' : 'Not submitted'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



function BankLodgement({ onBack }) {
  const [banks, setBanks] = useState([])
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [details, setDetails] = useState('')
  const [depositorName, setDepositorName] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [message, setMessage] = useState('Select the bank account, enter the lodgement details and confirm the payment.')
  const [messageType, setMessageType] = useState('info')
  const [confirmed, setConfirmed] = useState(false)
  const [loadingBanks, setLoadingBanks] = useState(true)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadNypCustomers = async () => {
    try {
      const response = await apiFetch('/api/cashier/nyp-customers')
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to load NYP accounts.')
      setNypCustomers(data.customers || [])
    } catch (error) {
      setNypCustomers([])
      setMessage(error.message || 'Unable to load NYP accounts.')
      setMessageType('error')
    }
  }

  const loadBanks = async () => {
      try {
        const response = await apiFetch('/api/banks')
        if (!response.ok) throw new Error('Unable to load bank accounts')
        const data = await response.json()
        if (!cancelled) {
          setBanks(Array.isArray(data) ? data : [])
          setLoadingBanks(false)
        }
      } catch {
        if (!cancelled) {
          setBanks([])
          setLoadingBanks(false)
          setMessage('Bank accounts could not be loaded from the backend.')
          setMessageType('error')
        }
      }
    }

    loadBanks()
    return () => {
      cancelled = true
    }
  }, [])

  const pad = (value) => String(value).padStart(2, '0')
  const year = now.getFullYear()
  const month = now.toLocaleString('en-US', { month: 'long' })
  const date = `${year}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  const selectedBank = banks.find((bank) => String(bank.id) === String(bankName))
  const displayAccount = selectedBank
    ? `${selectedBank.bankName} — ${selectedBank.accountName}${selectedBank.accountNo ? ` (${selectedBank.accountNo})` : ''}`
    : '—'

  const clearForm = () => {
    setBankName('')
    setAccountName('')
    setDetails('')
    setDepositorName('')
    setDepositAmount('')
    setConfirmed(false)
    setMessage('Select the bank account, enter the lodgement details and confirm the payment.')
    setMessageType('info')
  }

  const confirmPayment = () => {
    const amount = Number(depositAmount)

    if (!selectedBank) {
      setConfirmed(false)
      setMessage('Please select a bank account.')
      setMessageType('error')
      return
    }

    if (!details.trim()) {
      setConfirmed(false)
      setMessage('Please enter the lodgement details.')
      setMessageType('error')
      return
    }

    if (!depositorName.trim()) {
      setConfirmed(false)
      setMessage('Please enter the depositor name.')
      setMessageType('error')
      return
    }

    if (!depositAmount || !Number.isFinite(amount) || amount <= 0) {
      setConfirmed(false)
      setMessage('Please enter a valid deposit amount greater than zero.')
      setMessageType('error')
      return
    }

    setConfirmed(true)
    setMessage('Bank Lodgement is not yet connected to the backend. No lodgement transaction has been saved.')
    setMessageType('info')
  }

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            color: '#173f63',
            fontWeight: '800',
            fontSize: '12px',
            letterSpacing: '.2px'
          }}>
            BANK FUND LODGEMENT VOUCHER
          </div>
          <div style={{
            color: '#66788a',
            fontSize: '12px',
            marginTop: '3px'
          }}>
            Record funds lodged into a company bank account
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border: '1px solid #cbd7e2',
            background: '#fff',
            color: '#244e73',
            borderRadius: '6px',
            padding: '7px 12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        border: '1px solid #d5e1eb',
        borderRadius: '10px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#148dc1',
          color: '#fff',
          padding: '13px 16px',
          textAlign: 'center',
          fontWeight: '800',
          fontSize: '16px'
        }}>
          Fund Deposit Voucher
        </div>

        <div style={{ padding: '22px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {[
              ['Staff', 'OGA'],
              ['Year', String(year)],
              ['Month', month],
              ['Date', date],
              ['Time', time]
            ].map(([label, value]) => (
              <div key={label} style={{
                border: '1px solid #dbe5ed',
                borderRadius: '7px',
                background: '#f8fbfd',
                padding: '9px 10px'
              }}>
                <div style={{
                  color: '#6c8091',
                  fontSize: '11px',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  {label}
                </div>
                <div style={{
                  color: '#173f63',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            maxWidth: '760px',
            margin: '0 auto'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#244e73',
                fontWeight: '700',
                fontSize: '13px',
                marginBottom: '7px'
              }}>
                Bank Name
              </label>

              <select
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value)
                  setAccountName(e.target.value)
                  setConfirmed(false)
                  if (messageType === 'error') {
                    setMessage('Select the bank account, enter the lodgement details and confirm the payment.')
                    setMessageType('info')
                  }
                }}
                disabled={loadingBanks}
                style={{
                  width: '100%',
                  height: '44px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 11px',
                  fontSize: '14px',
                  color: '#173f63',
                  background: '#fff'
                }}
              >
                <option value="">
                  {loadingBanks ? 'Loading bank accounts...' : '. . . . select . . . .'}
                </option>
                {banks.map((bank) => (
                  <option key={bank.id} value={String(bank.id)}>
                    {bank.bankName} — {bank.accountName}{bank.accountNo ? ` (${bank.accountNo})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#244e73',
                fontWeight: '700',
                fontSize: '13px',
                marginBottom: '7px'
              }}>
                Account Name
              </label>

              <input
                value={selectedBank ? `${selectedBank.accountName}${selectedBank.accountNo ? ` (${selectedBank.accountNo})` : ''}` : ''}
                readOnly
                placeholder="Select a bank account"
                style={{
                  width: '100%',
                  height: '44px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 11px',
                  fontSize: '14px',
                  color: '#173f63',
                  background: '#f8fbfd'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#244e73',
                fontWeight: '700',
                fontSize: '13px',
                marginBottom: '7px'
              }}>
                Details
              </label>

              <textarea
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value)
                  setConfirmed(false)
                  if (messageType === 'error') {
                    setMessage('Select the bank account, enter the lodgement details and confirm the payment.')
                    setMessageType('info')
                  }
                }}
                placeholder="Enter the reason or details for this bank lodgement"
                rows={4}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '10px 11px',
                  fontSize: '14px',
                  color: '#173f63',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#244e73',
                  fontWeight: '700',
                  fontSize: '13px',
                  marginBottom: '7px'
                }}>
                  Depositor Name
                </label>
                <input
                  value={depositorName}
                  onChange={(e) => {
                    setDepositorName(e.target.value)
                    setConfirmed(false)
                  }}
                  placeholder="Enter depositor name"
                  style={{
                    width: '100%',
                    height: '44px',
                    boxSizing: 'border-box',
                    border: '1px solid #bdccd9',
                    borderRadius: '6px',
                    padding: '0 11px',
                    fontSize: '14px',
                    color: '#173f63'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  color: '#244e73',
                  fontWeight: '700',
                  fontSize: '13px',
                  marginBottom: '7px'
                }}>
                  Deposit Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => {
                    setDepositAmount(e.target.value)
                    setConfirmed(false)
                  }}
                  placeholder="Enter deposit amount"
                  style={{
                    width: '100%',
                    height: '44px',
                    boxSizing: 'border-box',
                    border: '1px solid #bdccd9',
                    borderRadius: '6px',
                    padding: '0 11px',
                    fontSize: '14px',
                    color: '#173f63'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <button
                onClick={clearForm}
                style={{
                  height: '42px',
                  border: '1px solid #cbd7e2',
                  borderRadius: '6px',
                  background: '#fff',
                  color: '#244e73',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>

              <button
                onClick={confirmPayment}
                style={{
                  height: '42px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#148dc1',
                  color: '#fff',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Confirm Payment
              </button>
            </div>

            <div style={{
              marginTop: '18px',
              border: `1px solid ${messageType === 'error' ? '#efc4c4' : '#dbe5ed'}`,
              background: messageType === 'error' ? '#fff6f6' : '#f5f8fb',
              borderRadius: '8px',
              padding: '15px 16px',
              textAlign: 'center',
              color: messageType === 'error' ? '#a12626' : '#536b80',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {message}
            </div>

            <div style={{
              marginTop: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <div style={{
                border: '1px solid #dbe5ed',
                borderRadius: '7px',
                background: '#fafcfe',
                padding: '11px 12px'
              }}>
                <div style={{
                  color: '#6c8091',
                  fontSize: '11px',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  Reference No
                </div>
                <div style={{
                  color: '#173f63',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  —
                </div>
              </div>

              <div style={{
                border: '1px solid #dbe5ed',
                borderRadius: '7px',
                background: '#fafcfe',
                padding: '11px 12px'
              }}>
                <div style={{
                  color: '#6c8091',
                  fontSize: '11px',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  Transaction Status
                </div>
                <div style={{
                  color: confirmed ? '#536b80' : '#6c8091',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  {confirmed ? 'Pending backend connection' : 'Not submitted'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function CashierCompanyGoodsPayment() {
  const companyOptions = [
    'DANGOTE NIG PLC',
    'FLOOR MILLS NIG PLC',
    'OTHERS',
    'PRORICH TISSUES',
    'SUPERBRAND GD',
    'test'
  ]

  const companyData = {
    'DANGOTE NIG PLC': {
      name: 'DANGOTE NIG PLC',
      balance: '285,547,509.00'
    },
    'FLOOR MILLS NIG PLC': {
      name: 'FLOOR MILLS NIG PLC',
      balance: '4,884,126,703.00'
    },
    'OTHERS': {
      name: 'OTHERS',
      balance: '456,614,975.00'
    },
    'PRORICH TISSUES': {
      name: 'PRORICH TISSUES',
      balance: '2,858,200.00'
    },
    'SUPERBRAND GD': {
      name: 'SUPERBRANDZ GLOBAL DISTRIBUTION',
      balance: '565,650.00'
    },
    'test': {
      name: 'test',
      balance: '14.00'
    }
  }

  const [company, setCompany] = useState('')
  const [newPayment, setNewPayment] = useState('')
  const [companyDetail, setCompanyDetail] = useState('')
  const [view, setView] = useState('payment')
  const [reprintCompany, setReprintCompany] = useState('')
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (v) => String(v).padStart(2, '0')
  const year = now.getFullYear()
  const month = now.toLocaleString('en-US', { month: 'long' })
  const date = `${year}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  const selected = companyData[company]

  if (view === 'reprint') {
    return (
      <div style={{ position:'relative', minHeight:'100%' }}>
        <div style={{ color:'#0000cc', fontWeight:'bold', fontSize:'12px' }}>
          COMPANY GOODS PAYMENT SCREEN
        </div>
        <div
          onClick={() => setView('payment')}
          style={{
            position:'absolute', top:'-1px', right:'8px',
            color:'#0000cc', fontWeight:'bold', fontSize:'14px', cursor:'pointer'
          }}
        >
          Company Payment Slip Reprint
        </div>

        <div style={{
          width:'570px', margin:'2px auto 0', border:'1px solid #168bbd',
          background:'#f2fff2'
        }}>
          <div style={{
            height:'39px', lineHeight:'39px', textAlign:'center',
            background:'#1593c8', color:'#fff', fontWeight:'bold', fontSize:'17px'
          }}>
            . . . Company Goods Payment Slip Reprint . . .
          </div>
          <div style={{
            display:'flex', justifyContent:'center', alignItems:'center',
            height:'43px', gap:'10px'
          }}>
            <span style={{color:'#1683b5',fontWeight:'bold',fontSize:'14px'}}>Company ID:</span>
            <select
              value={reprintCompany}
              onChange={e => setReprintCompany(e.target.value)}
              style={{
                width:'255px', height:'31px', border:'2px solid #254b8e',
                fontSize:'14px', background:'#fff'
              }}
            >
              <option value="">----------------Select----------------</option>
              {companyOptions.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        </div>

        {reprintCompany && (
          <div style={{
            width:'310px', margin:'-1px auto 0', border:'1px solid #168bbd',
            background:'#f2fff2', textAlign:'center', fontWeight:'bold'
          }}>
            <div style={{color:'#c40000',fontSize:'16px',padding:'8px 5px'}}>
              THE LORD'S DOING<br/>
              GLOBAL CONCEPT SERVICES NIG. LTD
            </div>
            <div style={{fontSize:'12px',fontWeight:'bold'}}>SHOP: No 13 Idl Abebe Ikoyi Road,</div>
            <div style={{fontSize:'12px',fontWeight:'bold'}}>Ogbomoso, Oyo State.</div>
            <div style={{fontSize:'12px',fontWeight:'bold'}}>Gsm No: 08112953848</div>
            <div style={{fontSize:'16px',marginTop:'8px'}}>COMPANY GOODS PAYMENT SLIP</div>
            <div style={{borderTop:'1px solid #168bbd',borderBottom:'1px solid #168bbd',padding:'7px 4px',fontSize:'12px'}}>
              Ref No: <b>SP-og1318</b>&nbsp;&nbsp; Date: <b>2026-09-10</b>&nbsp;&nbsp; Time: <b>00:00:00</b>
            </div>
            <div style={{padding:'10px 5px',fontSize:'16px'}}>
              COMPANY NAME: <b>{selected?.name || companyData[reprintCompany]?.name}</b>
            </div>
            <div style={{padding:'4px 5px',fontSize:'16px'}}>
              COMPANY ID: <b>{reprintCompany}</b>
            </div>
            <div style={{padding:'8px 5px',fontSize:'16px'}}>
              NEW PAYMENT: 0.00
            </div>
            <div style={{padding:'3px 5px 9px',fontSize:'16px'}}>
              TO BALANCE<br/>
              AMT: {companyData[reprintCompany]?.balance}
            </div>
            <div style={{borderTop:'1px solid #168bbd',padding:'8px',fontSize:'13px'}}>
              Thanks for your patronage
            </div>
            <div style={{background:'#ffffc8',color:'#d00000',padding:'6px',fontSize:'12px'}}>
              POWERED BY: BATH TECHNOLOGIES<br/>
              GSM: +234-803-419-2786
            </div>
            <div style={{padding:'6px'}}>
              <button style={{background:'#000',color:'#fff',border:'none',fontWeight:'bold',padding:'3px 14px'}}>Print</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ position:'relative', minHeight:'100%' }}>
      <div style={{ color:'#0000cc', fontWeight:'bold', fontSize:'12px' }}>
        COMPANY GOODS PAYMENT SCREEN
      </div>
      <div
        onClick={() => { setView('reprint'); setReprintCompany('') }}
        style={{
          position:'absolute', top:'-1px', right:'8px',
          color:'#0000cc', fontWeight:'bold', fontSize:'14px', cursor:'pointer'
        }}
      >
        Company Payment Slip Reprint
      </div>

      {!selected ? (
        <div style={{
          width:'570px', margin:'2px auto 0', border:'1px solid #168bbd',
          background:'#f2fff2'
        }}>
          <div style={{
            height:'39px', lineHeight:'39px', textAlign:'center',
            background:'#1593c8', color:'#fff', fontWeight:'bold', fontSize:'17px'
          }}>
            . . . Company Goods Payment Slip . . .
          </div>
          <div style={{
            display:'flex', justifyContent:'center', alignItems:'center',
            height:'43px', gap:'10px'
          }}>
            <span style={{color:'#1683b5',fontWeight:'bold',fontSize:'14px'}}>Company ID:</span>
            <select
              value={company}
              onChange={e => setCompany(e.target.value)}
              style={{
                width:'255px', height:'31px', border:'2px solid #254b8e',
                fontSize:'14px', background:'#fff'
              }}
            >
              <option value="">----------------Select----------------</option>
              {companyOptions.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        </div>
      ) : (
        <div style={{
          width:'765px', margin:'2px auto 0',
          border:'1px solid #168bbd', background:'#f2fff2'
        }}>
          <div style={{
            height:'35px', lineHeight:'35px', textAlign:'center',
            background:'#1593c8', color:'#fff', fontWeight:'bold', fontSize:'17px'
          }}>
            . . . Company Goods Payment Slip . . .
          </div>

          <div style={{
            display:'grid', gridTemplateColumns:'1.15fr 1.15fr .75fr .9fr 1fr .95fr',
            borderTop:'1px solid #168bbd', borderBottom:'1px solid #168bbd'
          }}>
            {[
              ['Ref No','WP-og1331',null],
              ['Staff','oga',null],
              ['Year',String(year),null],
              ['Month',month,null],
              ['Date',date,null],
              ['Time',time,null]
            ].map(([label,value],i)=>(
              <div key={label} style={{padding:'5px 6px',borderRight:i<5?'1px solid #168bbd':'none'}}>
                <div style={{color:'#1683b5',fontWeight:'bold',fontSize:'14px',marginBottom:'5px'}}>{label}</div>
                <input value={value} readOnly style={{
                  width:'100%',height:'30px',boxSizing:'border-box',
                  border:'1px solid #777',fontSize:'14px',padding:'2px 5px'
                }}/>
              </div>
            ))}
          </div>

          {[
            ['Company Name:', selected.name, null],
            ['Company ID:', company, null],
            ['Company Detail:', companyDetail, setCompanyDetail],
            ['To Balance Amount:', selected.balance, null],
            ['New Payment:', newPayment, setNewPayment]
          ].map(([label,value,setter])=>(
            <div key={label} style={{
              display:'grid',gridTemplateColumns:'335px 1fr',height:'39px',
              borderBottom:'1px solid #fff'
            }}>
              <div style={{
                background:'#1593c8',color:'#fff',fontWeight:'bold',fontSize:'13px',
                display:'flex',justifyContent:'flex-end',alignItems:'center',paddingRight:'4px'
              }}>
                {label}
              </div>
              <input
                value={value}
                readOnly={!setter}
                onChange={setter ? e=>setter(e.target.value):undefined}
                style={{
                  margin:'2px 4px',height:'35px',boxSizing:'border-box',
                  border:'1px solid #777',fontSize: label==='To Balance Amount:' ? '22px':'16px',
                  color: label==='To Balance Amount:' || label==='Company Name:' || label==='Company ID:' ? '#d00000':'#000',
                  padding:'3px 6px'
                }}
              />
            </div>
          ))}

          <div style={{display:'flex',justifyContent:'flex-end',padding:'13px 65px 2px 0'}}>
            <button onClick={()=>{}} style={{
              width:'360px',height:'31px',background:'#000',color:'#fff',
              border:'none',fontWeight:'bold',fontSize:'17px'
            }}>
              Confirm Payment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


function CashSalesPaymentSummary({ onBack }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [cashier, setCashier] = useState('All Cashier')
  const [searched, setSearched] = useState(false)
  const [printing, setPrinting] = useState(false)

  const doSearch = () => setSearched(true)

  const changeSearch = () => {
    setSearched(false)
    setPrinting(false)
  }

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            color: '#173f63',
            fontWeight: '800',
            fontSize: '12px',
            letterSpacing: '.2px'
          }}>
            CASHSALES PMT SUMMARY SCREEN
          </div>
          <div style={{
            color: '#66788a',
            fontSize: '12px',
            marginTop: '3px'
          }}>
            Summarise CashSales payments by date and cashier
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border: '1px solid #cbd7e2',
            background: '#fff',
            color: '#244e73',
            borderRadius: '6px',
            padding: '7px 12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      {!searched ? (
        <div style={{
          maxWidth: '620px',
          margin: '28px auto',
          border: '1px solid #d5e1eb',
          borderRadius: '10px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#148dc1',
            color: '#fff',
            padding: '13px 16px',
            textAlign: 'center',
            fontWeight: '800',
            fontSize: '16px'
          }}>
            24hrs CashSales Payment Summary
          </div>

          <div style={{ padding: '22px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '130px 1fr',
              gap: '12px 14px',
              alignItems: 'center'
            }}>
              <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>
                Enter Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 10px',
                  fontSize: '14px',
                  color: '#173f63'
                }}
              />

              <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>
                Cashier
              </label>
              <select
                value={cashier}
                onChange={e => setCashier(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 10px',
                  fontSize: '14px',
                  color: '#173f63',
                  background: '#fff'
                }}
              >
                <option value="All Cashier">All Cashier</option>
                <option value="5">5</option>
                <option value="cashier1">cashier1</option>
                <option value="cashier2">cashier2</option>
                <option value="oga">oga</option>
                <option value="sales1">sales1</option>
              </select>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px'
            }}>
              <button
                onClick={doSearch}
                style={{
                  minWidth: '120px',
                  height: '40px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#148dc1',
                  color: '#fff',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '2px 4px 12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <div style={{ color: '#173f63', fontSize: '13px', fontWeight: '800' }}>
              Date: {date} &nbsp;|&nbsp; Cashier: {cashier}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPrinting(true)}
                style={{
                  border: '1px solid #cbd7e2',
                  background: '#fff',
                  color: '#244e73',
                  borderRadius: '6px',
                  padding: '7px 11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Print
              </button>
              <button
                onClick={changeSearch}
                style={{
                  border: '1px solid #cbd7e2',
                  background: '#fff',
                  color: '#244e73',
                  borderRadius: '6px',
                  padding: '7px 11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Change Search
              </button>
            </div>
          </div>

          <div style={{
            background: '#148dc1',
            color: '#fff',
            fontWeight: '800',
            textAlign: 'center',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '7px 7px 0 0'
          }}>
            {date}: CashSales Payment Summary
          </div>

          <div style={{
            maxHeight: '520px',
            overflowY: 'auto',
            border: '1px solid #cbd7e2',
            borderTop: 'none',
            borderRadius: '0 0 7px 7px',
            background: '#fff'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px'
            }}>
              <thead>
                <tr style={{
                  background: '#eef5f9',
                  color: '#173f63',
                  textAlign: 'left',
                  position: 'sticky',
                  top: 0,
                  zIndex: 2
                }}>
                  {['s/n', 'Ref No', 'Cashier', 'Sales Payment', 'Refund Payment'].map(label => (
                    <th
                      key={label}
                      style={{
                        padding: '9px 8px',
                        borderBottom: '1px solid #cbd7e2',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: '42px 18px',
                      textAlign: 'center',
                      color: '#65788a',
                      lineHeight: '1.6'
                    }}
                  >
                    <div style={{ fontWeight: '800', color: '#3f586e', marginBottom: '5px' }}>
                      CashSales payment ledger is not yet connected to the backend.
                    </div>
                    <div>
                      No sample transactions have been inserted or displayed as real records.
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {printing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,.18)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '70px',
          zIndex: 9999
        }}>
          <div style={{
            width: '720px',
            maxWidth: 'calc(100vw - 30px)',
            maxHeight: '620px',
            overflowY: 'auto',
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,.35)',
            padding: '16px'
          }}>
            <div style={{ color: '#173f63', fontWeight: '800', fontSize: '17px' }}>
              THE LORD'S DOING GLOBAL CONCEPT SERVICES NIG. LTD
            </div>
            <div style={{ fontWeight: '700', fontSize: '12px', marginTop: '3px' }}>
              CashSales Payment Summary
            </div>
            <div style={{
              marginTop: '10px',
              padding: '8px',
              border: '1px solid #cbd7e2',
              background: '#f7fafc',
              fontSize: '12px'
            }}>
              Date: {date} &nbsp;|&nbsp; Cashier: {cashier}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['s/n', 'Ref No', 'Cashier', 'Sales Payment', 'Refund Payment'].map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real CashSales payment records will appear here after the backend ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button onClick={() => setPrinting(false)} style={{ padding: '7px 14px', cursor: 'pointer' }}>
                Close
              </button>
              <button onClick={() => window.print()} style={{ padding: '7px 14px', marginLeft: '8px', cursor: 'pointer' }}>
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function NypStockSupplySummary({ onBack }) {
  const [nypCustomers, setNypCustomers] = useState([])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [selectedNypId, setSelectedNypId] = useState('12')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadNypCustomers = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await apiFetch('/api/nyp')
        if (!response.ok) throw new Error('Unable to load NYP accounts')
        const data = await response.json()
        const records = Array.isArray(data) ? data : []

        if (!cancelled) {
          setNypCustomers(records)
          setSelectedNypId(current => {
            if (current && records.some(item => String(item.nypId) === String(current))) return current
            const account = records.find(item => String(item.nypId) === '12')
            return account ? String(account.nypId) : (records[0] ? String(records[0].nypId || '') : '')
          })
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load NYP accounts')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadNypCustomers()
    return () => { cancelled = true }
  }, [])

  const selectedCustomer = nypCustomers.find(
    item => String(item.nypId) === String(selectedNypId)
  )

  const doSearch = () => {
    if (!date || !selectedNypId) {
      setError('Please select a date and NYP ID before searching.')
      setSearched(false)
      return
    }
    setError('')
    setSearched(true)
  }

  const changeSearch = () => {
    setSearched(false)
    setError('')
  }

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            color: '#173f63',
            fontWeight: '800',
            fontSize: '12px',
            letterSpacing: '.2px'
          }}>
            NYP STOCK SUPPLY SUMMARY SCREEN
          </div>
          <div style={{
            color: '#66788a',
            fontSize: '12px',
            marginTop: '3px'
          }}>
            Summarise stock supplied to NYP accounts by date
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border: '1px solid #cbd7e2',
            background: '#fff',
            color: '#244e73',
            borderRadius: '6px',
            padding: '7px 12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      {!searched ? (
        <div style={{
          maxWidth: '620px',
          margin: '28px auto',
          border: '1px solid #d5e1eb',
          borderRadius: '10px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#148dc1',
            color: '#fff',
            padding: '13px 16px',
            textAlign: 'center',
            fontWeight: '800',
            fontSize: '16px'
          }}>
            24hrs NYP Stock Supply Summary
          </div>

          <div style={{ padding: '22px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '130px 1fr',
              gap: '12px 14px',
              alignItems: 'center'
            }}>
              <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>
                Enter Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => {
                  setDate(e.target.value)
                  setSearched(false)
                  setError('')
                }}
                style={{
                  width: '100%',
                  height: '40px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 10px',
                  fontSize: '14px',
                  color: '#173f63'
                }}
              />

              <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>
                NYP ID
              </label>
              <select
                value={selectedNypId}
                onChange={e => {
                  setSelectedNypId(e.target.value)
                  setSearched(false)
                  setError('')
                }}
                disabled={loading || nypCustomers.length === 0}
                style={{
                  width: '100%',
                  height: '40px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 10px',
                  fontSize: '14px',
                  color: '#173f63',
                  background: '#fff'
                }}
              >
                {loading && <option value="12">Loading NYP IDs...</option>}
                {!loading && nypCustomers.length === 0 && (
                  <option value="">No NYP accounts available</option>
                )}
                {!loading && nypCustomers.map(customer => (
                  <option key={customer.id || customer.nypId} value={String(customer.nypId)}>
                    {customer.nypId}{customer.fullName ? ` — ${customer.fullName}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedCustomer?.fullName && (
              <div style={{
                marginTop: '10px',
                padding: '8px 10px',
                border: '1px solid #e0e8ef',
                borderRadius: '6px',
                background: '#f7fafc',
                color: '#66788a',
                fontSize: '12px'
              }}>
                Selected NYP account: <strong style={{ color: '#244e73' }}>{selectedCustomer.fullName}</strong>
              </div>
            )}

            {error && (
              <div style={{
                marginTop: '12px',
                padding: '9px 10px',
                border: '1px solid #efc4c4',
                borderRadius: '6px',
                background: '#fff6f6',
                color: '#a12626',
                fontSize: '12px'
              }}>
                {error}
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '20px'
            }}>
              <button
                onClick={doSearch}
                disabled={loading || nypCustomers.length === 0}
                style={{
                  minWidth: '120px',
                  height: '40px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#148dc1',
                  color: '#fff',
                  fontWeight: '800',
                  cursor: loading || nypCustomers.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: loading || nypCustomers.length === 0 ? .6 : 1
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '2px 4px 12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <div style={{ color: '#173f63', fontSize: '13px', fontWeight: '800' }}>
              Date: {date} &nbsp;|&nbsp; NYP ID: {selectedNypId}
              {selectedCustomer?.fullName ? ` · ${selectedCustomer.fullName}` : ''}
            </div>

            <button
              onClick={changeSearch}
              style={{
                border: '1px solid #cbd7e2',
                background: '#fff',
                color: '#244e73',
                borderRadius: '6px',
                padding: '7px 11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Change Search
            </button>
          </div>

          <div style={{
            background: '#148dc1',
            color: '#fff',
            fontWeight: '800',
            textAlign: 'center',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '7px 7px 0 0'
          }}>
            {date}: NYP Stock Supply Summary
          </div>

          <div style={{
            maxHeight: '520px',
            overflowY: 'auto',
            border: '1px solid #cbd7e2',
            borderTop: 'none',
            borderRadius: '0 0 7px 7px',
            background: '#fff'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px'
            }}>
              <thead>
                <tr style={{
                  background: '#eef5f9',
                  color: '#173f63',
                  textAlign: 'left',
                  position: 'sticky',
                  top: 0,
                  zIndex: 2
                }}>
                  {['s/n', 'Ref No', 'NYP ID', 'NYP Name', 'Stock Supply', 'Qty', 'Date'].map(label => (
                    <th
                      key={label}
                      style={{
                        padding: '9px 8px',
                        borderBottom: '1px solid #cbd7e2',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: '42px 18px',
                      textAlign: 'center',
                      color: '#65788a',
                      lineHeight: '1.6'
                    }}
                  >
                    <div style={{ fontWeight: '800', color: '#3f586e', marginBottom: '5px' }}>
                      NYP stock-supply ledger is not yet connected to the backend.
                    </div>
                    <div>
                      No sample stock-supply transactions have been inserted or displayed as real records.
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}



function CashSalesScreen({ onBack }) {
  const [refNo, setRefNo] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [salesStaff, setSalesStaff] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('theLordDoingAuthUser') || 'null')
      return user?.displayName || user?.username || ''
    } catch {
      return ''
    }
  })
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [now, setNow] = useState(new Date())
  const [companies, setCompanies] = useState([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [products, setProducts] = useState([])
  const [rows, setRows] = useState([
    { id: 1, productId: '', rate: 'Carton', qty: '', discount: '' }
  ])
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('info')

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadCompanies = async () => {
      setLoadingCompanies(true)
      try {
        const response = await apiFetch('/api/companies')
        if (!response.ok) throw new Error('Unable to load companies')
        const data = await response.json()
        if (cancelled) return

        const activeCompanies = Array.isArray(data) ? data : []
        setCompanies(activeCompanies)
        if (activeCompanies.length > 0) {
          setSelectedCompanyId(String(activeCompanies[0].companyId))
        } else {
          setSelectedCompanyId('')
        }
      } catch {
        if (!cancelled) {
          setCompanies([])
          setSelectedCompanyId('')
          setStatus('Unable to load stock companies from the backend.')
          setStatusType('error')
        }
      } finally {
        if (!cancelled) setLoadingCompanies(false)
      }
    }

    loadCompanies()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!selectedCompanyId) {
      setProducts([])
      return
    }

    let cancelled = false

    const loadProducts = async () => {
      setLoadingProducts(true)
      try {
        const company = companies.find(item => String(item.companyId) === String(selectedCompanyId))
        const [companyResponse, stockResponse] = await Promise.all([
          apiFetch(`/api/companies/${company?.id || ''}`),
          apiFetch(`/api/stock-adjustments?companyId=${encodeURIComponent(selectedCompanyId)}`)
        ])

        if (!companyResponse.ok || !stockResponse.ok) {
          throw new Error('Unable to load stock data')
        }

        const companyData = await companyResponse.json()
        const stockData = await stockResponse.json()
        if (cancelled) return

        const stockById = new Map(
          (Array.isArray(stockData?.products) ? stockData.products : []).map(product => [String(product.id), product])
        )

        const mergedProducts = (Array.isArray(companyData?.products) ? companyData.products : [])
          .filter(product => product.status !== 'INACTIVE')
          .map(product => {
            const stock = stockById.get(String(product.id)) || {}
            return {
              ...product,
              stockCtnQty: Number(stock.stockCtnQty || 0),
              stockUnitQty: Number(stock.stockUnitQty || 0),
              stockBalance: stock.stockBalance || `${Number(stock.stockCtnQty || 0)} ctn & ${Number(stock.stockUnitQty || 0)}`
            }
          })

        setProducts(mergedProducts)
      } catch {
        if (!cancelled) {
          setProducts([])
          setStatus('Unable to load the selected company stock from the backend.')
          setStatusType('error')
        }
      } finally {
        if (!cancelled) setLoadingProducts(false)
      }
    }

    loadProducts()
    return () => { cancelled = true }
  }, [selectedCompanyId, companies])

  const selectedCompany = companies.find(
    company => String(company.companyId) === String(selectedCompanyId)
  )

  const year = date ? date.slice(0, 4) : String(now.getFullYear())
  const month = date
    ? new Date(`${date}T00:00:00`).toLocaleString('en-US', { month: 'long' })
    : now.toLocaleString('en-US', { month: 'long' })
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

  const getRatePrice = (product, rate) => {
    if (!product) return 0
    if (rate === 'Half Ctn') return Number(product.halfCtnSelling || 0)
    if (rate === 'Quarter Ctn') return Number(product.qrtSellingPrice || 0)
    if (rate === 'Unit') return Number(product.unitSellingPrice || 0)
    return Number(product.ctnSellingPrice || 0)
  }

  const getRowValues = (row) => {
    const product = products.find(item => String(item.id) === String(row.productId))
    const price = getRatePrice(product, row.rate)
    const qty = Number(row.qty || 0)
    const discount = Number(row.discount || 0)
    const total = Math.max(0, (qty * price) - discount)

    return { product, price, qty, discount, total }
  }

  const totalSum = rows.reduce((sum, row) => sum + getRowValues(row).total, 0)

  const updateRow = (rowId, key, value) => {
    setRows(current => current.map(row => (
      row.id === rowId ? { ...row, [key]: value } : row
    )))
    if (statusType === 'error') {
      setStatus('')
      setStatusType('info')
    }
  }

  const addRow = () => {
    setRows(current => [
      ...current,
      {
        id: Date.now() + Math.random(),
        productId: '',
        rate: 'Carton',
        qty: '',
        discount: ''
      }
    ])
  }

  const removeRow = (rowId) => {
    setRows(current => {
      if (current.length === 1) return current
      return current.filter(row => row.id !== rowId)
    })
  }

  const clearForm = () => {
    setRefNo('')
    setCustomerName('')
    setRows([{ id: Date.now(), productId: '', rate: 'Carton', qty: '', discount: '' }])
    setStatus('')
    setStatusType('info')
  }

  const submitSale = async () => {
    const selectedRows = rows.filter(row => row.productId)

    if (!customerName.trim()) {
      setStatus('Please enter the customer name.')
      setStatusType('error')
      return
    }

    if (!salesStaff.trim()) {
      setStatus('Please enter the sales staff name.')
      setStatusType('error')
      return
    }

    if (!selectedCompanyId) {
      setStatus('Please select a stock company.')
      setStatusType('error')
      return
    }

    if (selectedRows.length === 0) {
      setStatus('Please select at least one stock item.')
      setStatusType('error')
      return
    }

    const invalidRow = selectedRows.find(row => getRowValues(row).qty <= 0)
    if (invalidRow) {
      setStatus('Each selected stock item must have a quantity greater than zero.')
      setStatusType('error')
      return
    }

    const invalidDiscount = selectedRows.find(row => getRowValues(row).discount < 0 || getRowValues(row).discount > (getRowValues(row).qty * getRowValues(row).price))
    if (invalidDiscount) {
      setStatus('A discount cannot be negative or greater than the line amount.')
      setStatusType('error')
      return
    }

    if (totalSum <= 0) {
      setStatus('The CashSales total must be greater than zero.')
      setStatusType('error')
      return
    }

    setSaving(true)
    setStatus('')

    try {
      const response = await apiFetch('/api/cashsales', {
        method: 'POST',
        body: JSON.stringify({
          companyId: selectedCompanyId,
          customerName: customerName.trim(),
          salesStaff: salesStaff.trim(),
          saleDate: date,
          items: selectedRows.map(row => ({
            productId: Number(row.productId),
            rate: row.rate,
            qty: Number(row.qty),
            discount: Number(row.discount || 0)
          }))
        })
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to submit CashSales.')

      setRefNo(data.sale?.invoiceNo || '')
      setStatus(`CashSales submitted successfully. Ref No: ${data.sale?.invoiceNo || '—'}. It has been sent to CashSales Payment for the cashier.`)
      setStatusType('success')
      setRows([{ id: Date.now(), productId: '', rate: 'Carton', qty: '', discount: '' }])
      setCustomerName('')
    } catch (error) {
      setStatus(error.message || 'Unable to submit CashSales.')
      setStatusType('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            CASHSALES SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            Create and submit a CashSales invoice for cashier payment confirmation.
          </div>
        </div>
        <button onClick={onBack} style={{ border: '1px solid #cbd7e2', background: '#fff', color: '#244e73', borderRadius: '6px', padding: '7px 12px', fontWeight: '700', cursor: 'pointer' }}>
          ← Back
        </button>
      </div>

      <div style={{ border: '1px solid #d5e1eb', borderRadius: '10px', background: '#fff', boxShadow: '0 2px 8px rgba(22,61,91,.06)', overflow: 'hidden' }}>
        <div style={{ background: '#148dc1', color: '#fff', padding: '12px 16px', textAlign: 'center', fontWeight: '800', fontSize: '16px' }}>
          CashSales Entry
        </div>

        <div style={{ padding: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '12px' }}>
            {[
              ['Reference No', refNo || 'Generated after submission', null],
              ['Customer Name', customerName, setCustomerName],
              ['Sales Staff', salesStaff, setSalesStaff]
            ].map(([label, value, setter]) => (
              <div key={label}>
                <label style={{ display: 'block', color: '#244e73', fontWeight: '700', fontSize: '12px', marginBottom: '6px' }}>{label}</label>
                <input
                  value={value}
                  onChange={setter ? e => setter(e.target.value) : undefined}
                  readOnly={!setter}
                  placeholder={label === 'Customer Name' ? 'Enter customer name' : undefined}
                  style={{ width: '100%', height: '40px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', padding: '0 10px', fontSize: '13px', color: '#173f63', background: setter ? '#fff' : '#f5f8fb' }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '12px', marginTop: '12px' }}>
            {[
              ['Company', selectedCompany ? `${selectedCompany.companyId} — ${selectedCompany.companyName}` : ''],
              ['Year', year],
              ['Month', month],
              ['Date', date]
            ].map(([label, value]) => (
              <div key={label}>
                <label style={{ display: 'block', color: '#244e73', fontWeight: '700', fontSize: '12px', marginBottom: '6px' }}>{label}</label>
                {label === 'Company' ? (
                  <select value={selectedCompanyId} onChange={e => setSelectedCompanyId(e.target.value)} style={{ width: '100%', height: '40px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', background: '#fff', color: '#173f63', padding: '0 8px', fontSize: '12px' }}>
                    <option value="">{loadingCompanies ? 'Loading companies...' : 'Select company'}</option>
                    {companies.map(company => <option key={company.companyId} value={company.companyId}>{company.companyId} — {company.companyName}</option>)}
                  </select>
                ) : label === 'Date' ? (
                  <input type="date" value={value} onChange={e => setDate(e.target.value)} style={{ width: '100%', height: '40px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', padding: '0 10px', fontSize: '13px', color: '#173f63' }} />
                ) : (
                  <input value={value} readOnly style={{ width: '100%', height: '40px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', padding: '0 10px', fontSize: '13px', color: '#173f63', background: '#f5f8fb' }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', overflowX: 'auto', border: '1px solid #dbe5ed', borderRadius: '7px' }}>
            <table style={{ width: '100%', minWidth: '980px', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['S/N', 'Stock Balance', 'Stock Name', 'Qty', 'Rate', 'Price', 'Total', 'Discount', 'Action'].map(header => (
                    <th key={header} style={{ background: '#148dc1', color: '#fff', padding: '8px', border: '1px solid #168bbd', textAlign: header === 'Price' || header === 'Total' ? 'right' : 'left', whiteSpace: 'nowrap' }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const { product, price, qty, total } = getRowValues(row)
                  return (
                    <tr key={row.id}>
                      <td style={{ padding: '7px', borderTop: '1px solid #e2eaf0' }}>{index + 1}</td>
                      <td style={{ padding: '7px', borderTop: '1px solid #e2eaf0', whiteSpace: 'nowrap' }}>{product ? product.stockBalance : '—'}</td>
                      <td style={{ padding: '7px', borderTop: '1px solid #e2eaf0', minWidth: '250px' }}>
                        <select value={row.productId} onChange={e => updateRow(row.id, 'productId', e.target.value)} disabled={loadingProducts || products.length === 0} style={{ width: '100%', height: '36px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', background: '#fff', color: '#173f63', padding: '0 8px', fontSize: '12px' }}>
                          <option value="">{loadingProducts ? 'Loading stock...' : products.length ? 'Select stock' : 'No stock available'}</option>
                          {products.map(item => <option key={item.id} value={String(item.id)}>{item.stockName}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '7px', borderTop: '1px solid #e2eaf0' }}><input type="number" min="0" step="0.01" value={row.qty} onChange={e => updateRow(row.id, 'qty', e.target.value)} style={{ width: '85px', height: '36px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', padding: '0 8px', fontSize: '12px' }} /></td>
                      <td style={{ padding: '7px', borderTop: '1px solid #e2eaf0' }}><select value={row.rate} onChange={e => updateRow(row.id, 'rate', e.target.value)} style={{ width: '105px', height: '36px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', background: '#fff', color: '#173f63', padding: '0 7px', fontSize: '12px' }}><option value="Carton">Carton</option><option value="Half Ctn">Half Ctn</option><option value="Quarter Ctn">Quarter Ctn</option><option value="Unit">Unit</option></select></td>
                      <td style={{ padding: '7px', borderTop: '1px solid #e2eaf0', textAlign: 'right', whiteSpace: 'nowrap' }}>₦{price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td style={{ padding: '7px', borderTop: '1px solid #e2eaf0', textAlign: 'right', fontWeight: '800', whiteSpace: 'nowrap' }}>₦{total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td style={{ padding: '7px', borderTop: '1px solid #e2eaf0' }}><input type="number" min="0" step="0.01" value={row.discount} onChange={e => updateRow(row.id, 'discount', e.target.value)} style={{ width: '90px', height: '36px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', padding: '0 8px', fontSize: '12px' }} /></td>
                      <td style={{ padding: '7px', borderTop: '1px solid #e2eaf0', textAlign: 'center' }}><button onClick={() => removeRow(row.id)} disabled={rows.length === 1} style={{ border: '1px solid #d2dde6', background: rows.length === 1 ? '#f4f6f8' : '#fff', color: rows.length === 1 ? '#9aa8b3' : '#a12626', borderRadius: '6px', padding: '7px 9px', fontWeight: '700', cursor: rows.length === 1 ? 'not-allowed' : 'pointer' }}>Remove</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
            <button onClick={addRow} disabled={!selectedCompanyId || products.length === 0} style={{ border: '1px solid #cbd7e2', background: '#fff', color: '#244e73', borderRadius: '6px', padding: '8px 12px', fontWeight: '800', cursor: 'pointer' }}>+ Add Item</button>
            <div style={{ minWidth: '240px', border: '1px solid #dbe5ed', borderRadius: '7px', background: '#f7fafc', padding: '11px 13px', textAlign: 'right' }}>
              <span style={{ color: '#66788a', fontSize: '12px', marginRight: '12px' }}>All Total Sum</span>
              <strong style={{ color: '#173f63', fontSize: '15px' }}>₦{totalSum.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
          </div>

          {status && <div style={{ marginTop: '14px', padding: '11px 13px', border: `1px solid ${statusType === 'error' ? '#efc4c4' : statusType === 'success' ? '#9bd3a8' : '#dbe5ed'}`, borderRadius: '7px', background: statusType === 'error' ? '#fff6f6' : statusType === 'success' ? '#effcf2' : '#f5f8fb', color: statusType === 'error' ? '#a12626' : statusType === 'success' ? '#23733b' : '#536b80', fontSize: '12px', lineHeight: '1.5', fontWeight: statusType === 'success' ? '700' : '500' }}>{status}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <div style={{ alignSelf: 'center', color: '#66788a', fontSize: '11px', marginRight: 'auto' }}>
              {selectedCompany ? selectedCompany.companyName : 'No stock company selected'} · {year} · {month} · {date} · {time}
            </div>
            <button onClick={clearForm} disabled={saving} style={{ minWidth: '105px', height: '40px', border: '1px solid #cbd7e2', borderRadius: '6px', background: '#fff', color: '#244e73', fontWeight: '800', cursor: 'pointer' }}>Clear</button>
            <button onClick={submitSale} disabled={saving} style={{ minWidth: '145px', height: '40px', border: 'none', borderRadius: '6px', background: saving ? '#8ebbd3' : '#148dc1', color: '#fff', fontWeight: '800', cursor: saving ? 'wait' : 'pointer' }}>{saving ? 'Submitting...' : 'Submit Invoice'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CashSalesReport({ onBack }) {
  const today = new Date().toISOString().slice(0, 10)
  const currentYear = new Date().getFullYear()
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(today)
  const [day1, setDay1] = useState(today)
  const [day7, setDay7] = useState('')
  const [month, setMonth] = useState(new Date().toLocaleString('en-US', { month: 'long' }))
  const [year, setYear] = useState(String(currentYear))
  const [salesStaff, setSalesStaff] = useState('All Sales Staff')
  const [searched, setSearched] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [error, setError] = useState('')

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ]
  const yearOptions = Array.from({ length: Math.max(1, currentYear - 2014 + 1) }, (_, i) => String(2014 + i))

  const modeLabels = [
    ['24hrs', '24hrs CashSales Report'],
    ['weekly', 'Weekly CashSales Report'],
    ['monthly', 'Monthly CashSales Report'],
    ['yearly', 'Yearly CashSales Report']
  ]

  const reportTitle = modeLabels.find(([key]) => key === mode)?.[1] || '24hrs CashSales Report'

  const resetSearch = () => {
    setSearched(false)
    setPrinting(false)
    setError('')
  }

  const doSearch = () => {
    if (mode === '24hrs' && !date) {
      setError('Please select a date before searching.')
      setSearched(false)
      return
    }

    if (mode === 'weekly' && (!day1 || !day7)) {
      setError('Please select both Day 1 and Day 7 before searching.')
      setSearched(false)
      return
    }

    if (mode === 'monthly' && (!month || !year)) {
      setError('Please select a month and year before searching.')
      setSearched(false)
      return
    }

    if (mode === 'yearly' && !year) {
      setError('Please select a year before searching.')
      setSearched(false)
      return
    }

    setError('')
    setSearched(true)
  }

  const searchSummary = mode === '24hrs'
    ? `Date: ${date}`
    : mode === 'weekly'
      ? `Day 1: ${day1} | Day 7: ${day7}`
      : mode === 'monthly'
        ? `Month: ${month} | Year: ${year}`
        : `Year: ${year}`

  const columns = [
    'Ref No', 'Customer Name', 'Sales Staff', 'Year', 'Month', 'Date',
    'Stock Name', 'Qty', 'Price', 'Total Sum', 'Discount', 'Net Total', 'Rate', 'Refund'
  ]

  const SearchField = ({ label, children }) => (
    <div>
      <label style={{
        display: 'block',
        color: '#244e73',
        fontWeight: '700',
        fontSize: '13px',
        marginBottom: '7px'
      }}>
        {label}
      </label>
      {children}
    </div>
  )

  const fieldStyle = {
    width: '100%',
    height: '40px',
    boxSizing: 'border-box',
    border: '1px solid #bdccd9',
    borderRadius: '6px',
    padding: '0 10px',
    fontSize: '14px',
    color: '#173f63',
    background: '#fff'
  }

  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            color: '#173f63',
            fontWeight: '800',
            fontSize: '12px',
            letterSpacing: '.2px'
          }}>
            CASHSALES REPORT SCREEN
          </div>
          <div style={{
            color: '#66788a',
            fontSize: '12px',
            marginTop: '3px'
          }}>
            Review CashSales transactions by period and sales staff
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border: '1px solid #cbd7e2',
            background: '#fff',
            color: '#244e73',
            borderRadius: '6px',
            padding: '7px 12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '14px'
      }}>
        {modeLabels.map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setMode(key)
              resetSearch()
            }}
            style={{
              border: `1px solid ${mode === key ? '#148dc1' : '#cbd7e2'}`,
              background: mode === key ? '#eef7fb' : '#fff',
              color: mode === key ? '#0f78a6' : '#244e73',
              borderRadius: '6px',
              padding: '8px 11px',
              fontWeight: '800',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {!searched ? (
        <div style={{
          maxWidth: '720px',
          margin: '22px auto',
          border: '1px solid #d5e1eb',
          borderRadius: '10px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#148dc1',
            color: '#fff',
            padding: '13px 16px',
            textAlign: 'center',
            fontWeight: '800',
            fontSize: '16px'
          }}>
            {reportTitle}
          </div>

          <div style={{ padding: '22px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '16px'
            }}>
              {mode === '24hrs' && (
                <SearchField label="Enter Date">
                  <input
                    type="date"
                    value={date}
                    onChange={e => {
                      setDate(e.target.value)
                      setError('')
                    }}
                    style={fieldStyle}
                  />
                </SearchField>
              )}

              {mode === 'weekly' && (
                <>
                  <SearchField label="Enter Day 1">
                    <input
                      type="date"
                      value={day1}
                      onChange={e => {
                        setDay1(e.target.value)
                        setError('')
                      }}
                      style={fieldStyle}
                    />
                  </SearchField>
                  <SearchField label="Enter Day 7">
                    <input
                      type="date"
                      value={day7}
                      onChange={e => {
                        setDay7(e.target.value)
                        setError('')
                      }}
                      style={fieldStyle}
                    />
                  </SearchField>
                </>
              )}

              {mode === 'monthly' && (
                <>
                  <SearchField label="Month">
                    <select
                      value={month}
                      onChange={e => {
                        setMonth(e.target.value)
                        setError('')
                      }}
                      style={fieldStyle}
                    >
                      {months.map(item => <option key={item}>{item}</option>)}
                    </select>
                  </SearchField>
                  <SearchField label="Year">
                    <select
                      value={year}
                      onChange={e => {
                        setYear(e.target.value)
                        setError('')
                      }}
                      style={fieldStyle}
                    >
                      {yearOptions.map(item => <option key={item}>{item}</option>)}
                    </select>
                  </SearchField>
                </>
              )}

              {mode === 'yearly' && (
                <SearchField label="Year">
                  <select
                    value={year}
                    onChange={e => {
                      setYear(e.target.value)
                      setError('')
                    }}
                    style={fieldStyle}
                  >
                    {yearOptions.map(item => <option key={item}>{item}</option>)}
                  </select>
                </SearchField>
              )}

              <SearchField label="Sales Staff">
                <select
                  value={salesStaff}
                  onChange={e => {
                    setSalesStaff(e.target.value)
                    setError('')
                  }}
                  style={fieldStyle}
                >
                  <option value="All Sales Staff">All Sales Staff</option>
                </select>
              </SearchField>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '11px 13px',
              border: '1px solid #dbe5ed',
              borderRadius: '7px',
              background: '#f7fafc',
              color: '#65788a',
              fontSize: '12px',
              lineHeight: '1.5'
            }}>
              The Sales Staff filter will be populated from the real staff/user records when the CashSales backend is connected.
            </div>

            {error && (
              <div style={{
                marginTop: '12px',
                padding: '10px 12px',
                border: '1px solid #efc4c4',
                borderRadius: '7px',
                background: '#fff6f6',
                color: '#a12626',
                fontSize: '12px'
              }}>
                {error}
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '20px'
            }}>
              <button
                onClick={() => {
                  setDate(today)
                  setDay1(today)
                  setDay7('')
                  setMonth(new Date().toLocaleString('en-US', { month: 'long' }))
                  setYear(String(currentYear))
                  setSalesStaff('All Sales Staff')
                  setError('')
                }}
                style={{
                  minWidth: '105px',
                  height: '40px',
                  border: '1px solid #cbd7e2',
                  borderRadius: '6px',
                  background: '#fff',
                  color: '#244e73',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
              <button
                onClick={doSearch}
                style={{
                  minWidth: '120px',
                  height: '40px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#148dc1',
                  color: '#fff',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '2px 2px 12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '10px'
          }}>
            <div style={{ color: '#173f63', fontSize: '13px', fontWeight: '800' }}>
              {searchSummary} &nbsp;|&nbsp; Sales Staff: {salesStaff}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPrinting(true)}
                style={{
                  border: '1px solid #cbd7e2',
                  background: '#fff',
                  color: '#244e73',
                  borderRadius: '6px',
                  padding: '7px 11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Print
              </button>
              <button
                onClick={resetSearch}
                style={{
                  border: '1px solid #cbd7e2',
                  background: '#fff',
                  color: '#244e73',
                  borderRadius: '6px',
                  padding: '7px 11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Change Search
              </button>
            </div>
          </div>

          <div style={{
            background: '#148dc1',
            color: '#fff',
            fontWeight: '800',
            textAlign: 'center',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '7px 7px 0 0'
          }}>
            {reportTitle}
          </div>

          <div style={{
            maxHeight: '520px',
            overflow: 'auto',
            border: '1px solid #cbd7e2',
            borderTop: 'none',
            borderRadius: '0 0 7px 7px',
            background: '#fff'
          }}>
            <table style={{
              width: '100%',
              minWidth: '1180px',
              borderCollapse: 'collapse',
              fontSize: '12px'
            }}>
              <thead>
                <tr style={{
                  background: '#eef5f9',
                  color: '#173f63',
                  textAlign: 'left',
                  position: 'sticky',
                  top: 0,
                  zIndex: 2
                }}>
                  {columns.map(label => (
                    <th key={label} style={{
                      padding: '9px 8px',
                      borderBottom: '1px solid #cbd7e2',
                      whiteSpace: 'nowrap'
                    }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      padding: '42px 18px',
                      textAlign: 'center',
                      color: '#65788a',
                      lineHeight: '1.6'
                    }}
                  >
                    <div style={{ fontWeight: '800', color: '#3f586e', marginBottom: '5px' }}>
                      CashSales report data is not yet connected to the backend.
                    </div>
                    <div>
                      No sample transactions have been inserted or displayed as real records.
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {printing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,.18)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '70px',
          zIndex: 9999
        }}>
          <div style={{
            width: '900px',
            maxWidth: 'calc(100vw - 30px)',
            maxHeight: '620px',
            overflowY: 'auto',
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,.35)',
            padding: '18px'
          }}>
            <div style={{ color: '#173f63', fontWeight: '800', fontSize: '17px' }}>
              THE LORD'S DOING GLOBAL CONCEPT SERVICES NIG. LTD
            </div>
            <div style={{ fontWeight: '700', fontSize: '12px', marginTop: '3px' }}>
              {reportTitle}
            </div>
            <div style={{
              marginTop: '10px',
              padding: '8px',
              border: '1px solid #cbd7e2',
              background: '#f7fafc',
              fontSize: '12px'
            }}>
              {searchSummary} &nbsp;|&nbsp; Sales Staff: {salesStaff}
            </div>
            <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', marginTop: '10px', fontSize: '11px' }}>
              <thead>
                <tr>
                  {columns.map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={columns.length} style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real CashSales report records will appear here after the backend ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button onClick={() => setPrinting(false)} style={{ padding: '7px 14px', cursor: 'pointer' }}>
                Close
              </button>
              <button onClick={() => window.print()} style={{ padding: '7px 14px', marginLeft: '8px', cursor: 'pointer' }}>
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function NypSalesScreen({ onBack }) {
  const today = new Date().toISOString().slice(0, 10)
  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('theLordDoingAuthUser') || 'null')
    } catch {
      return null
    }
  })()

  const [customers, setCustomers] = useState([])
  const [companies, setCompanies] = useState([])
  const [stockProducts, setStockProducts] = useState([])
  const [nypCustomerId, setNypCustomerId] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [salesStaff, setSalesStaff] = useState(
    savedUser?.displayName || savedUser?.username || ''
  )
  const [date, setDate] = useState(today)
  const [searched, setSearched] = useState(false)
  const [rows, setRows] = useState([
    { productId: '', qty: '', rate: 'Carton', discount: '0' }
  ])
  const [loading, setLoading] = useState(true)
  const [stockLoading, setStockLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submittedSale, setSubmittedSale] = useState(null)

  const isOga = savedUser?.role === 'OGA'
  const selectedCustomer = customers.find(
    customer => String(customer.id) === nypCustomerId
  )
  const selectedCompany = companies.find(
    company => String(company.id) === companyId
  )

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const dateObject = date ? new Date(`${date}T12:00:00`) : new Date()
  const year = dateObject.getFullYear()
  const month = months[dateObject.getMonth()]

  const money = value => Number(value || 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  const fieldStyle = {
    width: '100%',
    minWidth: 0,
    height: '34px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 8px',
    fontSize: '12px',
    background: '#fff',
    color: '#173f63'
  }

  const buttonStyle = {
    border: '1px solid #168bbd',
    background: '#1593c8',
    color: '#fff',
    borderRadius: '5px',
    padding: '8px 14px',
    fontWeight: '700',
    fontSize: '12px',
    cursor: 'pointer'
  }

  useEffect(() => {
    let cancelled = false

    const loadInitialData = async () => {
      setLoading(true)
      setError('')

      try {
        const [customerResponse, companyResponse] = await Promise.all([
          apiFetch('/api/nyp'),
          apiFetch('/api/companies')
        ])

        const customerData = await customerResponse.json()
        const companyData = await companyResponse.json()

        if (!customerResponse.ok) {
          throw new Error(customerData.message || 'Unable to load NYP customers.')
        }
        if (!companyResponse.ok) {
          throw new Error(companyData.message || 'Unable to load companies and products.')
        }
        if (!Array.isArray(customerData) || !Array.isArray(companyData)) {
          throw new Error('The server returned an unexpected customer or company response.')
        }

        if (!cancelled) {
          setCustomers(customerData)
          setCompanies(companyData)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load NYP Sales data.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadInitialData()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadStock = async () => {
      setStockProducts([])

      if (!selectedCompany?.companyId) return

      setStockLoading(true)
      try {
        const response = await apiFetch(
          `/api/stock-adjustments?companyId=${encodeURIComponent(selectedCompany.companyId)}`
        )
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load stock balances.')
        }

        if (!cancelled) {
          setStockProducts(Array.isArray(data.products) ? data.products : [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load stock balances.')
      } finally {
        if (!cancelled) setStockLoading(false)
      }
    }

    loadStock()
    return () => { cancelled = true }
  }, [companyId, companies])

  const getProduct = productId =>
    selectedCompany?.products?.find(product => String(product.id) === String(productId))

  const getStock = productId =>
    stockProducts.find(product => String(product.id) === String(productId))

  const priceFor = (product, rate) => {
    if (!product) return 0
    const priceField = {
      'Carton': 'ctnSellingPrice',
      'Half Ctn': 'halfCtnSelling',
      'Quarter Ctn': 'qrtSellingPrice',
      'Unit': 'unitSellingPrice'
    }[rate]
    return Number(product[priceField] || 0)
  }

  const lineFor = row => {
    const product = getProduct(row.productId)
    const qty = Number(row.qty || 0)
    const price = priceFor(product, row.rate)
    const gross = qty * price
    const discount = Math.min(Math.max(0, Number(row.discount || 0)), gross)
    return { product, qty, price, gross, discount, net: gross - discount }
  }

  const totals = rows.reduce((result, row) => {
    const line = lineFor(row)
    result.gross += line.gross
    result.discount += line.discount
    result.net += line.net
    return result
  }, { gross: 0, discount: 0, net: 0 })

  const updateRow = (index, field, value) => {
    setRows(current => current.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    ))
    setError('')
    setSuccess('')
  }

  const addRow = () => setRows(current => [
    ...current,
    { productId: '', qty: '', rate: 'Carton', discount: '0' }
  ])

  const removeRow = index => setRows(current =>
    current.length <= 1 ? current : current.filter((_, i) => i !== index)
  )

  const startSale = () => {
    setError('')
    setSuccess('')
    setSubmittedSale(null)

    if (!nypCustomerId) {
      setError('Please select an NYP customer.')
      return
    }
    if (!companyId || !selectedCompany) {
      setError('Please select the company supplying the stock.')
      return
    }
    if (!date) {
      setError('Please select the sale date.')
      return
    }
    if (!salesStaff.trim()) {
      setError('Sales Staff is required.')
      return
    }

    setRows([{ productId: '', qty: '', rate: 'Carton', discount: '0' }])
    setSearched(true)
  }

  const changeSearch = () => {
    if (submitting) return
    setSearched(false)
    setSubmittedSale(null)
    setSuccess('')
    setError('')
  }

  const submitSale = async () => {
    if (submitting || submittedSale) return
    setError('')
    setSuccess('')

    if (!selectedCustomer || !selectedCompany || !date) {
      setError('Please return to the first step and check the customer, company and date.')
      return
    }

    if (!salesStaff.trim()) {
      setError('Sales Staff is required.')
      return
    }

    const chosenRows = rows.filter(row => row.productId)
    if (!chosenRows.length) {
      setError('Add at least one stock item before submitting.')
      return
    }

    for (let index = 0; index < chosenRows.length; index++) {
      const row = chosenRows[index]
      const line = lineFor(row)

      if (!line.product) {
        setError(`Stock row ${index + 1}: select a valid product.`)
        return
      }
      if (!(line.qty > 0)) {
        setError(`Stock row ${index + 1}: quantity must be greater than zero.`)
        return
      }
      if (!(line.price > 0)) {
        setError(`Stock row ${index + 1}: the selected price rate has no selling price.`)
        return
      }
      if (Number(row.discount || 0) < 0 || Number(row.discount || 0) > line.gross) {
        setError(`Stock row ${index + 1}: discount must be between zero and the line total.`)
        return
      }
      if (!(line.net > 0)) {
        setError(`Stock row ${index + 1}: the net line total must be greater than zero.`)
        return
      }
    }

    setSubmitting(true)
    try {
      const response = await apiFetch('/api/nyp/sales', {
        method: 'POST',
        body: JSON.stringify({
          nypCustomerId: Number(nypCustomerId),
          salesStaff: salesStaff.trim(),
          saleDate: date,
          items: chosenRows.map(row => ({
            productId: Number(row.productId),
            rate: row.rate,
            qty: Number(row.qty),
            discount: Number(row.discount || 0)
          }))
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'The NYP sale could not be submitted.')
      }

      setSubmittedSale(data.sale || data)
      setSuccess(data.message || 'NYP sale submitted successfully.')
    } catch (err) {
      setError(err.message || 'The NYP sale could not be submitted.')
    } finally {
      setSubmitting(false)
    }
  }

  const newSale = () => {
    setNypCustomerId('')
    setCompanyId('')
    setDate(new Date().toISOString().slice(0, 10))
    setSalesStaff(savedUser?.displayName || savedUser?.username || '')
    setRows([{ productId: '', qty: '', rate: 'Carton', discount: '0' }])
    setSearched(false)
    setSubmittedSale(null)
    setSuccess('')
    setError('')
  }

  const alertStyle = (isSuccess = false) => ({
    marginTop: '12px',
    padding: '10px',
    border: `1px solid ${isSuccess ? '#8ac7a0' : '#e0b0b0'}`,
    borderRadius: '4px',
    background: isSuccess ? '#f0fff4' : '#fff6f6',
    color: isSuccess ? '#17653a' : '#9b3030',
    fontSize: '12px'
  })

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px' }}>
            NYP SALES SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            Record sales made to NYP accounts
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
            borderRadius: '5px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      {loading && (
        <div style={{ padding: '18px', color: '#173f63', fontSize: '13px' }}>
          Loading NYP customers and company products…
        </div>
      )}

      {!loading && (
        <div style={{
          width: '100%', maxWidth: searched ? '1200px' : '820px', margin: '0 auto',
          border: '1px solid #168bbd', borderRadius: '8px',
          background: '#f5fff5', boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8', color: '#fff', textAlign: 'center',
            fontWeight: 'bold', fontSize: '17px', padding: '10px'
          }}>. . . NYP Sales . . .</div>

          {!searched ? (
            <div style={{ padding: '16px 18px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '12px'
              }}>
                <div>
                  <div style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', marginBottom: '5px' }}>
                    Ref No
                  </div>
                  <input readOnly value="Generated when sale is submitted" style={{ ...fieldStyle, background: '#eef3f7' }} />
                </div>

                <div>
                  <div style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', marginBottom: '5px' }}>
                    NYP Customer
                  </div>
                  <select value={nypCustomerId} onChange={e => setNypCustomerId(e.target.value)} style={fieldStyle}>
                    <option value="">Select NYP customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.nypId} — {customer.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', marginBottom: '5px' }}>
                    Company / Stock Source
                  </div>
                  <select value={companyId} onChange={e => setCompanyId(e.target.value)} style={fieldStyle}>
                    <option value="">Select company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.companyName} ({company.companyId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', marginBottom: '5px' }}>
                    Sales Staff {isOga ? '(OGA may override)' : ''}
                  </div>
                  <input
                    value={salesStaff}
                    onChange={e => setSalesStaff(e.target.value)}
                    readOnly={!isOga}
                    style={{ ...fieldStyle, background: isOga ? '#fff' : '#eef3f7' }}
                  />
                </div>

                <div>
                  <div style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', marginBottom: '5px' }}>
                    Year
                  </div>
                  <input readOnly value={year} style={{ ...fieldStyle, background: '#eef3f7' }} />
                </div>

                <div>
                  <div style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', marginBottom: '5px' }}>
                    Month
                  </div>
                  <input readOnly value={month} style={{ ...fieldStyle, background: '#eef3f7' }} />
                </div>

                <div>
                  <div style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', marginBottom: '5px' }}>
                    Date
                  </div>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
                </div>
              </div>

              {error && <div style={alertStyle()}>{error}</div>}

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button onClick={startSale} disabled={loading} style={buttonStyle}>
                  Continue to Stock Items
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                borderBottom: '1px solid #168bbd'
              }}>
                {[
                  ['Ref No', submittedSale?.invoiceNo || 'Pending submission'],
                  ['NYP ID', selectedCustomer?.nypId || ''],
                  ['Customer', selectedCustomer?.fullName || ''],
                  ['Company', selectedCompany?.companyName || ''],
                  ['Sales Staff', salesStaff],
                  ['Year / Month', `${year} / ${month}`],
                  ['Date', date]
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: '8px', borderRight: '1px solid #c5d8e4' }}>
                    <div style={{ color: '#1683b5', fontWeight: '700', fontSize: '11px', marginBottom: '4px' }}>
                      {label}
                    </div>
                    <div style={{
                      background: '#fff', border: '1px solid #cbd7e2', borderRadius: '4px',
                      padding: '6px', fontSize: '11px', overflowWrap: 'anywhere'
                    }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px', overflowX: 'auto' }}>
                {stockLoading && (
                  <div style={{ marginBottom: '10px', color: '#66788a', fontSize: '12px' }}>
                    Loading recorded stock balances…
                  </div>
                )}

                <table style={{ width: '100%', minWidth: '940px', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ background: '#1593c8', color: '#fff' }}>
                      {['#', 'Stock Balance', 'Stock Name', 'Qty', 'Pack Size', 'Price Rate', 'Unit Price', 'Total Sum', 'Discount', ''].map(label => (
                        <th key={label} style={{
                          padding: '7px 5px', border: '1px solid #c5e2ee',
                          textAlign: label === 'Stock Name' ? 'left' : 'center'
                        }}>{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      const product = getProduct(row.productId)
                      const stock = getStock(row.productId)
                      const line = lineFor(row)

                      return (
                        <tr key={index}>
                          <td style={{ border: '1px solid #cbd7e2', padding: '5px', textAlign: 'center' }}>
                            {index + 1}
                          </td>
                          <td style={{ border: '1px solid #cbd7e2', padding: '4px', minWidth: '105px' }}>
                            {stock?.stockBalance || (row.productId ? 'Not recorded' : '—')}
                          </td>
                          <td style={{ border: '1px solid #cbd7e2', padding: '4px', minWidth: '190px' }}>
                            <select
                              value={row.productId}
                              disabled={Boolean(submittedSale)}
                              onChange={e => updateRow(index, 'productId', e.target.value)}
                              style={{ ...fieldStyle, height: '29px', fontSize: '11px' }}
                            >
                              <option value="">Select stock</option>
                              {(selectedCompany?.products || []).map(item => (
                                <option key={item.id} value={item.id}>{item.stockName}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ border: '1px solid #cbd7e2', padding: '4px', minWidth: '75px' }}>
                            <input
                              type="number" min="0.01" step="any"
                              value={row.qty}
                              disabled={Boolean(submittedSale)}
                              onChange={e => updateRow(index, 'qty', e.target.value)}
                              style={{ ...fieldStyle, height: '29px', fontSize: '11px' }}
                            />
                          </td>
                          <td style={{ border: '1px solid #cbd7e2', padding: '4px', textAlign: 'center' }}>
                            {product?.ctnSize ?? '—'}
                          </td>
                          <td style={{ border: '1px solid #cbd7e2', padding: '4px', minWidth: '105px' }}>
                            <select
                              value={row.rate}
                              disabled={Boolean(submittedSale)}
                              onChange={e => updateRow(index, 'rate', e.target.value)}
                              style={{ ...fieldStyle, height: '29px', fontSize: '11px' }}
                            >
                              {['Carton', 'Half Ctn', 'Quarter Ctn', 'Unit'].map(rate => (
                                <option key={rate} value={rate}>{rate}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ border: '1px solid #cbd7e2', padding: '4px', textAlign: 'right', minWidth: '85px' }}>
                            {money(line.price)}
                          </td>
                          <td style={{ border: '1px solid #cbd7e2', padding: '4px', textAlign: 'right', minWidth: '95px' }}>
                            {money(line.gross)}
                          </td>
                          <td style={{ border: '1px solid #cbd7e2', padding: '4px', minWidth: '85px' }}>
                            <input
                              type="number" min="0" step="0.01"
                              value={row.discount}
                              disabled={Boolean(submittedSale)}
                              onChange={e => updateRow(index, 'discount', e.target.value)}
                              style={{ ...fieldStyle, height: '29px', fontSize: '11px' }}
                            />
                          </td>
                          <td style={{ border: '1px solid #cbd7e2', padding: '4px', textAlign: 'center' }}>
                            {!submittedSale && (
                              <button onClick={() => removeRow(index)} style={{
                                border: '1px solid #d7a1a1', background: '#fff', color: '#a33',
                                borderRadius: '4px', padding: '4px 7px', cursor: 'pointer'
                              }}>×</button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {!submittedSale && (
                  <button onClick={addRow} style={{
                    marginTop: '10px', border: '1px solid #168bbd', background: '#fff',
                    color: '#1683b5', borderRadius: '5px', padding: '6px 12px',
                    fontWeight: '700', cursor: 'pointer', fontSize: '11px'
                  }}>+ Add Stock</button>
                )}

                <div style={{ marginTop: '12px', marginLeft: 'auto', width: 'min(100%, 330px)' }}>
                  {[
                    ['All Total Sum', totals.gross],
                    ['Total Discount', totals.discount],
                    ['Net Total', totals.net]
                  ].map(([label, value]) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      gap: '12px', padding: '5px 0', color: '#1683b5',
                      fontWeight: '700', fontSize: '12px'
                    }}>
                      <span>{label}</span>
                      <input readOnly value={money(value)} style={{
                        ...fieldStyle, width: '155px', height: '29px', textAlign: 'right',
                        background: '#eef3f7'
                      }} />
                    </div>
                  ))}
                </div>

                {error && <div style={alertStyle()}>{error}</div>}
                {success && <div style={alertStyle(true)}>{success}</div>}

                {submittedSale && (
                  <div style={alertStyle(true)}>
                    <strong>Generated Reference: {submittedSale.invoiceNo || 'See saved sale details'}</strong>
                    <div style={{ marginTop: '5px' }}>
                      The sale was accepted by the backend. The NYP customer account has been updated.
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                  gap: '8px', marginTop: '14px'
                }}>
                  {!submittedSale && (
                    <button onClick={submitSale} disabled={submitting || stockLoading} style={{
                      ...buttonStyle,
                      opacity: submitting || stockLoading ? 0.65 : 1,
                      cursor: submitting || stockLoading ? 'not-allowed' : 'pointer'
                    }}>
                      {submitting ? 'Submitting…' : 'Submit NYP Sale'}
                    </button>
                  )}

                  {submittedSale ? (
                    <button onClick={newSale} style={buttonStyle}>New NYP Sale</button>
                  ) : (
                    <button onClick={changeSearch} disabled={submitting} style={{
                      border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                      borderRadius: '5px', padding: '8px 14px', cursor: 'pointer', fontSize: '12px'
                    }}>Change Search</button>
                  )}

                  {onBack && (
                    <button onClick={onBack} style={{
                      border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                      borderRadius: '5px', padding: '8px 14px', cursor: 'pointer', fontSize: '12px'
                    }}>Back</button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {!loading && !error && customers.length === 0 && (
        <div style={{ marginTop: '12px', color: '#9b3030', fontSize: '12px' }}>
          No active NYP customers were returned by the server.
        </div>
      )}
    </div>
  )
}

function NypSalesReport({ onBack }) {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [day1, setDay1] = useState(new Date().toISOString().slice(0, 10))
  const [day7, setDay7] = useState(new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [nypId, setNypId] = useState('12')
  const [searched, setSearched] = useState(false)

  const nypOptions = [
    '12', 'ARADA IYA SHALLOM PETER', 'FMN MAYOWA EMMANUEL',
    'GOLDEN PENNY JAMIU', 'GOLDEN PENNY MR JOEL', 'GOLDEN PENNY SHOLA',
    'IYA SAHEED ORA', 'MR SAMSON G PENNY', 'MRS ABIOYE IYA OBAARA',
    'SEMO SHOP STAFFS', 'TLD PROVISION SHOP', 'UNIQUE STORE AROWOMOLE', 'YAH SAMAD'
  ]
  const years = Array.from({ length: 17 }, (_, i) => String(2014 + i))
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const fieldStyle = {
    width: '100%',
    height: '30px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 7px',
    fontSize: '12px',
    background: '#fff'
  }

  const search = () => setSearched(true)

  const modeItems = [
    ['24hrs', '24hrs NYP Sales Report'],
    ['weekly', 'Weekly NYP Sales Report'],
    ['monthly', 'Monthly NYP Sales Report'],
    ['yearly', 'Yearly NYP Sales Report']
  ]

  const reportTitle = modeItems.find(([key]) => key === mode)?.[1] || '24hrs NYP Sales Report'

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            NYP SALES REPORT SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            View NYP sales reports by date, week, month or year
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5',
            background: '#fff',
            color: '#173f63',
            borderRadius: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '17px',
          padding: '10px'
        }}>. . . {reportTitle} . . .</div>

        <div style={{ padding: '12px 14px 0', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modeItems.map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setSearched(false) }} style={{
              border: `1px solid ${mode === key ? '#168bbd' : '#c5d8e4'}`,
              background: mode === key ? '#1593c8' : '#fff',
              color: mode === key ? '#fff' : '#173f63',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {mode === '24hrs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nypId} onChange={e => setNypId(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 1:</label>
              <input type="date" value={day1} onChange={e => setDay1(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 7:</label>
              <input type="date" value={day7} onChange={e => setDay7(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nypId} onChange={e => setNypId(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={fieldStyle}>
                {months.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nypId} onChange={e => setNypId(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nypId} onChange={e => setNypId(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={search} style={{
              border: '1px solid #168bbd',
              background: '#1593c8',
              color: '#fff',
              borderRadius: '5px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}>Search</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '14px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '9px'
          }}>NYP Sales Report Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', reportTitle],
                ['NYP ID', nypId],
                ['Period', mode === '24hrs' ? date : mode === 'weekly' ? `${day1} to ${day7}` : mode === 'monthly' ? `${month} ${year}` : year],
                ['Status', 'No sales records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#1683b5', fontWeight: '700', fontSize: '10px' }}>{label}</div>
                  <div style={{ marginTop: '4px', color: '#34495e', fontSize: '11px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ background: '#1593c8', color: '#fff' }}>
                  {['#','Ref No','NYP ID','Sales Staff','Sales Date','Stock Name','Qty','Total Sum'].map(label => (
                    <th key={label} style={{ padding: '7px 5px', border: '1px solid #c5e2ee' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    No NYP sales records are available for the selected period.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{
                border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                borderRadius: '5px', padding: '7px 14px', cursor: 'pointer', fontSize: '12px'
              }}>Change Search</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


const observedCompanyOptions = [
  '6',
  'DANGOTE NIG PLC',
  'FLOOR MILLS NIG PLC',
  'PRORICH TISSUES',
  'SUPERBRAND GD',
  'WAMCO UBA THE LORD DOING',
  'WAMCO ZENITH THE LORD DOING',
  'WAMCO ACCESS THE LORD DOING'
]

const observedNypOptions = [
  '12',
  'ARADA IYA SHALLOM PETER',
  'FMN MAYOWA EMMANUEL',
  'GOLDEN PENNY JAMIU',
  'GOLDEN PENNY MR JOEL',
  'GOLDEN PENNY SHOLA',
  'GOLDEN PENNYSHOLA WILLIAM',
  'IYA SAHEED ORA',
  'MR SAMSON G PENNY',
  'MRS ABIOYE IYA OBAARA',
  'SEMO SHOP STAFFS',
  'TLD PROVISION SHOP',
  'UNIQUE STORE AROWOMOLE',
  'YAH SAMAD'
]

const observedBankOptions = [
  '9',
  'All Bank',
  'Access Bank',
  'Opay',
  'Palmpay',
  'UBA Bank',
  'UNILEVER ZENITH',
  'WAMCO ACCESS',
  'WAMCO UBA',
  'WAMCO ZENITH',
  'Zenith Bank'
]

function ReportShell({ screenTitle, title, links = [], children }) {
  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      {links.length > 0 && (
        <div style={{
          textAlign: 'right',
          color: '#0000cc',
          fontWeight: 'bold',
          fontSize: '12px',
          lineHeight: '24px',
          paddingRight: '6px'
        }}>
          {links.map((link, i) => (
            <span key={link}>
              {i > 0 ? ' | ' : ''}{link}
            </span>
          ))}
        </div>
      )}

      <div style={{
        color: '#0000cc',
        fontWeight: 'bold',
        fontSize: '12px',
        padding: '2px 5px',
        textTransform: 'uppercase'
      }}>
        {screenTitle}
      </div>

      {children}
    </div>
  )
}

function ReportForm({ title, fields, result = null, error = null }) {
  const [values, setValues] = useState(
    Object.fromEntries(fields.map(f => [f.name, f.value ?? '']))
  )
  const [searched, setSearched] = useState(false)

  const update = (name, value) => {
    setValues(v => ({ ...v, [name]: value }))
    setSearched(false)
  }

  return (
    <>
      <div style={{
        width: '638px',
        margin: '4px auto 0',
        border: '1px solid #168bbd',
        background: '#f2fff2'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          padding: '6px'
        }}>
          . . . {title} . . .
        </div>

        <div style={{
          padding: '7px 0',
          display: 'grid',
          gridTemplateColumns: '185px 255px 42px',
          justifyContent: 'center',
          gap: '7px',
          alignItems: 'center'
        }}>
          {fields.map(field => (
            <React.Fragment key={field.name}>
              <label style={{
                color: '#1683b5',
                fontWeight: 'bold',
                fontSize: '15px',
                textAlign: 'right'
              }}>
                {field.label}:
              </label>

              {field.type === 'select' ? (
                <select
                  value={values[field.name]}
                  onChange={e => update(field.name, e.target.value)}
                  style={{
                    height: '28px',
                    border: '2px solid #254b8e',
                    color: '#294a86',
                    background: '#fff',
                    fontSize: '14px'
                  }}
                >
                  {(field.options || []).map(option => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={values[field.name]}
                  onChange={e => update(field.name, e.target.value)}
                  style={{
                    height: '28px',
                    boxSizing: 'border-box',
                    border: '2px solid #254b8e',
                    color: '#d11',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}
                />
              )}

              <button
                onClick={() => setSearched(true)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '19px',
                  padding: 0
                }}
                aria-label="Search"
              >
                🔍
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {searched && (
        result || (
          <div style={{
            width: '638px',
            margin: '5px auto',
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            padding: '10px',
            fontSize: '15px'
          }}>
            {error || 'Sales with such Date does not exist'}
            <div style={{ marginTop: '10px' }}>Pls try again.</div>
          </div>
        )
      )}
    </>
  )
}

function CompanyStockAdjustmentReport({ onBack }) {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [day1, setDay1] = useState(new Date().toISOString().slice(0, 10))
  const [day7, setDay7] = useState(new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [companyId, setCompanyId] = useState('6')
  const [searched, setSearched] = useState(false)

  const companyOptions = [
    '6',
    'DANGOTE NIG PLC',
    'FLOOR MILLS NIG PLC',
    'PRORICH TISSUES',
    'SUPERBRAND GD',
    'WAMCO UBA THE LORD DOING',
    'WAMCO ZENITH THE LORD DOING',
    'WAMCO ACCESS THE LORD DOING'
  ]
  const years = Array.from({ length: 17 }, (_, i) => String(2014 + i))
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const fieldStyle = {
    width: '100%',
    height: '30px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 7px',
    fontSize: '12px',
    background: '#fff'
  }

  const modeItems = [
    ['24hrs', '24hrs Adjustment Report'],
    ['weekly', 'Weekly Adjustment Report'],
    ['monthly', 'Monthly Adjustment Report'],
    ['yearly', 'Yearly Adjustment Report']
  ]

  const reportTitle = modeItems.find(([key]) => key === mode)?.[1] || '24hrs Adjustment Report'

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            ADJUSTMENT REPORT SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            View company stock adjustment reports by date, week, month or year
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5',
            background: '#fff',
            color: '#173f63',
            borderRadius: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '17px',
          padding: '10px'
        }}>. . . {reportTitle} . . .</div>

        <div style={{ padding: '12px 14px 0', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modeItems.map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setSearched(false) }} style={{
              border: `1px solid ${mode === key ? '#168bbd' : '#c5d8e4'}`,
              background: mode === key ? '#1593c8' : '#fff',
              color: mode === key ? '#fff' : '#173f63',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {mode === '24hrs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={companyId} onChange={e => setCompanyId(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 1:</label>
              <input type="date" value={day1} onChange={e => setDay1(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 7:</label>
              <input type="date" value={day7} onChange={e => setDay7(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={companyId} onChange={e => setCompanyId(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={fieldStyle}>
                {months.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={companyId} onChange={e => setCompanyId(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={companyId} onChange={e => setCompanyId(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setSearched(true)} style={{
              border: '1px solid #168bbd',
              background: '#1593c8',
              color: '#fff',
              borderRadius: '5px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}>Search</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '14px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '9px'
          }}>Company Stock Adjustment Report Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', reportTitle],
                ['Company ID', companyId],
                ['Period', mode === '24hrs' ? date : mode === 'weekly' ? `${day1} to ${day7}` : mode === 'monthly' ? `${month} ${year}` : year],
                ['Status', 'No adjustment records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  {['s/n', 'Date', 'Ref No', 'Company ID', 'Description', 'Stock Name', 'Adjustment Qty', 'Amount'].map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real Company Stock Adjustment records will appear here after the backend ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{
                border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
              }}>Change Search</button>
              {onBack && (
                <button onClick={onBack} style={{
                  border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                  borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
                }}>Back</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
const CompanyStockPurchasesReport = ({ onBack }) => {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [day1, setDay1] = useState(new Date().toISOString().slice(0, 10))
  const [day7, setDay7] = useState(new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [companyId, setCompanyId] = useState('6')
  const [searched, setSearched] = useState(false)

  const companyOptions = [
    '6',
    'DANGOTE NIG PLC',
    'FLOOR MILLS NIG PLC',
    'PRORICH TISSUES',
    'SUPERBRAND GD',
    'WAMCO UBA THE LORD DOING',
    'WAMCO ZENITH THE LORD DOING',
    'WAMCO ACCESS THE LORD DOING'
  ]
  const years = Array.from({ length: 17 }, (_, i) => String(2014 + i))
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const fieldStyle = {
    width: '100%',
    height: '30px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 7px',
    fontSize: '12px',
    background: '#fff'
  }

  const modeItems = [
    ['24hrs', '24hrs Purchase Report'],
    ['weekly', 'Weekly Purchase Report'],
    ['monthly', 'Monthly Purchase Report'],
    ['yearly', 'Yearly Purchase Report']
  ]

  const reportTitle = modeItems.find(([key]) => key === mode)?.[1] || '24hrs Purchase Report'

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            PURCHASE REPORT SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            View company stock purchase reports by date, week, month or year
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5',
            background: '#fff',
            color: '#173f63',
            borderRadius: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '17px',
          padding: '10px'
        }}>. . . {reportTitle} . . .</div>

        <div style={{ padding: '12px 14px 0', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modeItems.map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setSearched(false) }} style={{
              border: `1px solid ${mode === key ? '#168bbd' : '#c5d8e4'}`,
              background: mode === key ? '#1593c8' : '#fff',
              color: mode === key ? '#fff' : '#173f63',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {mode === '24hrs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={companyId} onChange={e => setCompanyId(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 1:</label>
              <input type="date" value={day1} onChange={e => setDay1(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 7:</label>
              <input type="date" value={day7} onChange={e => setDay7(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={companyId} onChange={e => setCompanyId(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={fieldStyle}>
                {months.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={companyId} onChange={e => setCompanyId(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={companyId} onChange={e => setCompanyId(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setSearched(true)} style={{
              border: '1px solid #168bbd',
              background: '#1593c8',
              color: '#fff',
              borderRadius: '5px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}>Search</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '14px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '9px'
          }}>Company Stock Purchases Report Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', reportTitle],
                ['Company ID', companyId],
                ['Period', mode === '24hrs' ? date : mode === 'weekly' ? `${day1} to ${day7}` : mode === 'monthly' ? `${month} ${year}` : year],
                ['Status', 'No adjustment records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  {['s/n', 'Date', 'Ref No', 'Company ID', 'Description', 'Stock Name', 'Purchase Qty', 'Amount'].map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real Company Stock Purchase records will appear here after the backend purchase ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{
                border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
              }}>Change Search</button>
              {onBack && (
                <button onClick={onBack} style={{
                  border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                  borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
                }}>Back</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



const CashSalesPaymentReport = ({ onBack }) => {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [day1, setDay1] = useState(new Date().toISOString().slice(0, 10))
  const [day7, setDay7] = useState(new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [cashier, setCashier] = useState('5')
  const [searched, setSearched] = useState(false)

  const cashierOptions = ['5', 'All Cashier', 'cashier1', 'cashier2', 'oga', 'sales1']
  const years = Array.from({ length: 17 }, (_, i) => String(2014 + i))
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const fieldStyle = {
    width: '100%',
    height: '30px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 7px',
    fontSize: '12px',
    background: '#fff'
  }

  const modeItems = [
    ['24hrs', '24hrs CashSales PMT Report'],
    ['weekly', 'Weekly CashSales PMT Report'],
    ['monthly', 'Monthly CashSales PMT Report'],
    ['yearly', 'Yearly CashSales PMT Report']
  ]

  const reportTitle = modeItems.find(([key]) => key === mode)?.[1] || '24hrs CashSales PMT Report'
  const period = mode === '24hrs'
    ? date
    : mode === 'weekly'
      ? `${day1} to ${day7}`
      : mode === 'monthly'
        ? `${month} ${year}`
        : year

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            CASHSALES PAYMENT REPORT SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            View CashSales payment reports by date, week, month or year
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5',
            background: '#fff',
            color: '#173f63',
            borderRadius: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '17px',
          padding: '10px'
        }}>. . . {reportTitle} . . .</div>

        <div style={{ padding: '12px 14px 0', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modeItems.map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setSearched(false) }} style={{
              border: `1px solid ${mode === key ? '#168bbd' : '#c5d8e4'}`,
              background: mode === key ? '#1593c8' : '#fff',
              color: mode === key ? '#fff' : '#173f63',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {mode === '24hrs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Cashier:</label>
              <select value={cashier} onChange={e => setCashier(e.target.value)} style={fieldStyle}>
                {cashierOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 1:</label>
              <input type="date" value={day1} onChange={e => setDay1(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 7:</label>
              <input type="date" value={day7} onChange={e => setDay7(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Cashier:</label>
              <select value={cashier} onChange={e => setCashier(e.target.value)} style={fieldStyle}>
                {cashierOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={fieldStyle}>
                {months.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Cashier:</label>
              <select value={cashier} onChange={e => setCashier(e.target.value)} style={fieldStyle}>
                {cashierOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Cashier:</label>
              <select value={cashier} onChange={e => setCashier(e.target.value)} style={fieldStyle}>
                {cashierOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setSearched(true)} style={{
              border: '1px solid #168bbd',
              background: '#1593c8',
              color: '#fff',
              borderRadius: '5px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}>Search</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '14px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '9px'
          }}>CashSales Payment Report Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', reportTitle],
                ['Cashier', cashier],
                ['Period', period],
                ['Status', 'No CashSales payment records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  {['s/n', 'Date', 'Ref No', 'Cashier', 'Payment Type', 'Description', 'Amount', 'Status'].map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real CashSales Payment records will appear here after the backend payment ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{
                border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
              }}>Change Search</button>
              {onBack && (
                <button onClick={onBack} style={{
                  border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                  borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
                }}>Back</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


const NypPaymentReport = ({ onBack }) => {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [day1, setDay1] = useState(new Date().toISOString().slice(0, 10))
  const [day7, setDay7] = useState(new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [nyp, setNyp] = useState('SEMO SHOP STAFFS')
  const [searched, setSearched] = useState(false)

  const nypOptions = observedNypOptions
  const years = Array.from({ length: 17 }, (_, i) => String(2014 + i))
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const fieldStyle = {
    width: '100%',
    height: '30px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 7px',
    fontSize: '12px',
    background: '#fff'
  }

  const modeItems = [
    ['24hrs', '24hrs NYP PMT Report'],
    ['weekly', 'Weekly NYP PMT Report'],
    ['monthly', 'Monthly NYP PMT Report'],
    ['yearly', 'Yearly NYP PMT Report']
  ]

  const reportTitle = modeItems.find(([key]) => key === mode)?.[1] || '24hrs NYP PMT Report'
  const period = mode === '24hrs'
    ? date
    : mode === 'weekly'
      ? `${day1} to ${day7}`
      : mode === 'monthly'
        ? `${month} ${year}`
        : year

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            NYP PAYMENT REPORT SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            View NYP payment reports by date, week, month or year
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5',
            background: '#fff',
            color: '#173f63',
            borderRadius: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '17px',
          padding: '10px'
        }}>. . . {reportTitle} . . .</div>

        <div style={{ padding: '12px 14px 0', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modeItems.map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setSearched(false) }} style={{
              border: `1px solid ${mode === key ? '#168bbd' : '#c5d8e4'}`,
              background: mode === key ? '#1593c8' : '#fff',
              color: mode === key ? '#fff' : '#173f63',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {mode === '24hrs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nyp} onChange={e => setNyp(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 1:</label>
              <input type="date" value={day1} onChange={e => setDay1(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 7:</label>
              <input type="date" value={day7} onChange={e => setDay7(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nyp} onChange={e => setNyp(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={fieldStyle}>
                {months.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nyp} onChange={e => setNyp(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nyp} onChange={e => setNyp(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setSearched(true)} style={{
              border: '1px solid #168bbd',
              background: '#1593c8',
              color: '#fff',
              borderRadius: '5px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}>Search</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '14px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '9px'
          }}>NYP Payment Report Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', reportTitle],
                ['NYP ID', nyp],
                ['Period', period],
                ['Status', 'No NYP payment records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  {['s/n', 'Date', 'Ref No', 'NYP ID', 'Payment Type', 'Description', 'Amount', 'Status'].map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real NYP Payment records will appear here after the backend NYP payment ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{
                border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
              }}>Change Search</button>
              {onBack && (
                <button onClick={onBack} style={{
                  border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                  borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
                }}>Back</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const NypStockSupplyReport = ({ onBack }) => {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [day1, setDay1] = useState(new Date().toISOString().slice(0, 10))
  const [day7, setDay7] = useState(new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [nyp, setNyp] = useState('YAH SAMAD')
  const [searched, setSearched] = useState(false)

  const nypOptions = observedNypOptions
  const years = Array.from({ length: 17 }, (_, i) => String(2014 + i))
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const fieldStyle = {
    width: '100%',
    height: '30px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 7px',
    fontSize: '12px',
    background: '#fff'
  }

  const modeItems = [
    ['24hrs', '24hrs NYP Stock Supply Report'],
    ['weekly', 'Weekly NYP Stock Supply Report'],
    ['monthly', 'Monthly NYP Stock Supply Report'],
    ['yearly', 'Yearly NYP Stock Supply Report']
  ]

  const reportTitle = modeItems.find(([key]) => key === mode)?.[1] || '24hrs NYP Stock Supply Report'
  const period = mode === '24hrs'
    ? date
    : mode === 'weekly'
      ? `${day1} to ${day7}`
      : mode === 'monthly'
        ? `${month} ${year}`
        : year

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            NYP STOCK SUPPLY REPORT SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            View NYP stock supply reports by date, week, month or year
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5',
            background: '#fff',
            color: '#173f63',
            borderRadius: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '17px',
          padding: '10px'
        }}>. . . {reportTitle} . . .</div>

        <div style={{ padding: '12px 14px 0', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modeItems.map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setSearched(false) }} style={{
              border: `1px solid ${mode === key ? '#168bbd' : '#c5d8e4'}`,
              background: mode === key ? '#1593c8' : '#fff',
              color: mode === key ? '#fff' : '#173f63',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {mode === '24hrs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nyp} onChange={e => setNyp(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 1:</label>
              <input type="date" value={day1} onChange={e => setDay1(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 7:</label>
              <input type="date" value={day7} onChange={e => setDay7(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nyp} onChange={e => setNyp(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={fieldStyle}>
                {months.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nyp} onChange={e => setNyp(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>NYP ID:</label>
              <select value={nyp} onChange={e => setNyp(e.target.value)} style={fieldStyle}>
                {nypOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setSearched(true)} style={{
              border: '1px solid #168bbd',
              background: '#1593c8',
              color: '#fff',
              borderRadius: '5px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}>Search</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '14px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '9px'
          }}>NYP Stock Supply Report Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', reportTitle],
                ['NYP ID', nyp],
                ['Period', period],
                ['Status', 'No NYP stock supply records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  {['s/n', 'Date', 'Ref No', 'NYP ID', 'Stock Name', 'Supply Qty', 'Unit Price', 'Amount'].map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real NYP Stock Supply records will appear here after the backend NYP ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{
                border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
              }}>Change Search</button>
              {onBack && (
                <button onClick={onBack} style={{
                  border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                  borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
                }}>Back</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


const PaymentToCompaniesReport = ({ onBack }) => {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [day1, setDay1] = useState(new Date().toISOString().slice(0, 10))
  const [day7, setDay7] = useState(new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [company, setCompany] = useState('6')
  const [searched, setSearched] = useState(false)

  const companyOptions = observedCompanyOptions
  const years = Array.from({ length: 17 }, (_, i) => String(2014 + i))
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const fieldStyle = {
    width: '100%',
    height: '30px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 7px',
    fontSize: '12px',
    background: '#fff'
  }

  const modeItems = [
    ['24hrs', '24hrs PMT To Company Report'],
    ['weekly', 'Weekly PMT To Company Report'],
    ['monthly', 'Monthly PMT To Company Report'],
    ['yearly', 'Yearly PMT To Company Report']
  ]

  const reportTitle = modeItems.find(([key]) => key === mode)?.[1] || '24hrs PMT To Company Report'
  const period = mode === '24hrs'
    ? date
    : mode === 'weekly'
      ? `${day1} to ${day7}`
      : mode === 'monthly'
        ? `${month} ${year}`
        : year

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            PAYMENT TO COMPANY REPORT SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            View payments made to companies by date, week, month or year
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5',
            background: '#fff',
            color: '#173f63',
            borderRadius: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '17px',
          padding: '10px'
        }}>. . . {reportTitle} . . .</div>

        <div style={{ padding: '12px 14px 0', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modeItems.map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setSearched(false) }} style={{
              border: `1px solid ${mode === key ? '#168bbd' : '#c5d8e4'}`,
              background: mode === key ? '#1593c8' : '#fff',
              color: mode === key ? '#fff' : '#173f63',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {mode === '24hrs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={company} onChange={e => setCompany(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 1:</label>
              <input type="date" value={day1} onChange={e => setDay1(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 7:</label>
              <input type="date" value={day7} onChange={e => setDay7(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={company} onChange={e => setCompany(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={fieldStyle}>
                {months.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={company} onChange={e => setCompany(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={company} onChange={e => setCompany(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setSearched(true)} style={{
              border: '1px solid #168bbd',
              background: '#1593c8',
              color: '#fff',
              borderRadius: '5px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}>Search</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '14px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '9px'
          }}>Payment To Companies Report Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', reportTitle],
                ['Company ID', company],
                ['Period', period],
                ['Status', 'No company payment records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  {['s/n', 'Date', 'Ref No', 'Company ID', 'Payment Type', 'Description', 'Amount', 'Status'].map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real payment-to-company records will appear here after the backend company payment ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{
                border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
              }}>Change Search</button>
              {onBack && (
                <button onClick={onBack} style={{
                  border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                  borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
                }}>Back</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const PaymentToCompaniesSummary = ({ onBack }) => {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [day1, setDay1] = useState(new Date().toISOString().slice(0, 10))
  const [day7, setDay7] = useState(new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [company, setCompany] = useState('6')
  const [searched, setSearched] = useState(false)

  const companyOptions = observedCompanyOptions
  const years = Array.from({ length: 17 }, (_, i) => String(2014 + i))
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const fieldStyle = {
    width: '100%',
    height: '30px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 7px',
    fontSize: '12px',
    background: '#fff'
  }

  const modeItems = [
    ['24hrs', '24hrs PMT To Company Summary'],
    ['weekly', 'Weekly PMT To Company Summary'],
    ['monthly', 'Monthly PMT To Company Summary'],
    ['yearly', 'Yearly PMT To Company Summary']
  ]

  const reportTitle = modeItems.find(([key]) => key === mode)?.[1] || '24hrs PMT To Company Summary'
  const period = mode === '24hrs'
    ? date
    : mode === 'weekly'
      ? `${day1} to ${day7}`
      : mode === 'monthly'
        ? `${month} ${year}`
        : year

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            PAYMENT TO COMPANY SUMMARY SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            Summarise payments made to companies by date, week, month or year
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5',
            background: '#fff',
            color: '#173f63',
            borderRadius: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '17px',
          padding: '10px'
        }}>. . . {reportTitle} . . .</div>

        <div style={{ padding: '12px 14px 0', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modeItems.map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setSearched(false) }} style={{
              border: `1px solid ${mode === key ? '#168bbd' : '#c5d8e4'}`,
              background: mode === key ? '#1593c8' : '#fff',
              color: mode === key ? '#fff' : '#173f63',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {mode === '24hrs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={company} onChange={e => setCompany(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 1:</label>
              <input type="date" value={day1} onChange={e => setDay1(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 7:</label>
              <input type="date" value={day7} onChange={e => setDay7(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={company} onChange={e => setCompany(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={fieldStyle}>
                {months.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={company} onChange={e => setCompany(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Company ID:</label>
              <select value={company} onChange={e => setCompany(e.target.value)} style={fieldStyle}>
                {companyOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setSearched(true)} style={{
              border: '1px solid #168bbd',
              background: '#1593c8',
              color: '#fff',
              borderRadius: '5px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}>Search</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '14px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '9px'
          }}>Payment To Companies Summary Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', reportTitle],
                ['Company ID', company],
                ['Period', period],
                ['Status', 'No company payment summary records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  {['s/n', 'Date', 'Ref No', 'Company ID', 'Payment Type', 'Description', 'Amount', 'Status'].map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real payment-to-company summary records will appear here after the backend company payment ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{
                border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
              }}>Change Search</button>
              {onBack && (
                <button onClick={onBack} style={{
                  border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                  borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
                }}>Back</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function AnalysisReportPage({ kind = 'adjustment' }) {
  const configs = {
    adjustment: {
      screen: 'ADJUSTMENT REPORT SCREEN',
      title: '24hrs Adjustment Report',
      links: ['24hrs Adjustment Report', 'Weekly Adjustment Report', 'Monthly Adjustment Report', 'Yearly Adjustment Report'],
      fields: [
        { name: 'date', label: 'Enter Date', type: 'date', value: '2026-09-30' },
        { name: 'company', label: 'Company ID', type: 'select', value: '6', options: observedCompanyOptions }
      ]
    },
    purchase: {
      screen: 'PURCHASE REPORT SCREEN',
      title: '24hrs Purchase Report',
      links: ['24hrs Purchase Report', 'Weekly Purchase Report', 'Monthly Purchase Report', 'Yearly Purchase Report'],
      fields: [
        { name: 'date', label: 'Enter Date', type: 'date', value: '2026-09-30' },
        { name: 'company', label: 'Company ID', type: 'select', value: '6', options: observedCompanyOptions }
      ]
    },
    cashSupply: {
      screen: 'CASHSALES STOCK SUPPLY REPORT SCREEN',
      title: '24hrs CashSales Stock Supply Report',
      links: ['24hrs CashSales Stock Supply Report', 'Weekly CashSales Stock Supply Report', 'Monthly CashSales Stock Supply Report', 'Yearly CashSales Stock Supply Report'],
      fields: [
        { name: 'date', label: 'Enter Date', type: 'date', value: '2026-09-30' },
        { name: 'staff', label: 'Sales Staff', type: 'select', value: '5', options: ['5', 'All Sales Staff', 'cashier1', 'cashier2', 'oga', 'sales1', 'tiwatope'] }
      ],
      error: 'Purchase Invoice with such Date does not exist'
    },
    nypSupply: {
      screen: 'NYP STOCK SUPPLY REPORT SCREEN',
      title: 'Yearly NYP Stock Supply Report',
      links: ['24hrs NYP Stock Supply Report', 'Weekly NYP Stock Supply Report', 'Monthly NYP Stock Supply Report', 'Yearly NYP Stock Supply Report'],
      fields: [
        { name: 'year', label: 'Year', type: 'select', value: '2014', options: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'] },
        { name: 'nyp', label: 'NYP ID', type: 'select', value: 'YAH SAMAD', options: observedNypOptions }
      ]
    },
    cashPayment: {
      screen: 'CASHSALES PAYMENT REPORT SCREEN',
      title: '24hrs CashSales PMT Report',
      links: ['24hrs CashSales PMT Report', 'Weekly CashSales PMT Report', 'Monthly CashSales PMT Report', 'Yearly CashSales PMT Report'],
      fields: [
        { name: 'date', label: 'Enter Date', type: 'date', value: '2026-09-30' },
        { name: 'staff', label: 'Cashier', type: 'select', value: '5', options: ['5', 'All Cashier', 'cashier1', 'cashier2', 'oga', 'sales1'] }
      ]
    },
    nypPayment: {
      screen: 'NYP PAYMENT REPORT SCREEN',
      title: '24hrs NYP PMT Report',
      links: ['24hrs NYP PMT Report', 'Weekly NYP PMT Report', 'Monthly NYP PMT Report', 'Yearly NYP PMT Report'],
      fields: [
        { name: 'date', label: 'Enter Date', type: 'date', value: '2026-09-20' },
        { name: 'nyp', label: 'NYP ID', type: 'select', value: 'SEMO SHOP STAFFS', options: observedNypOptions }
      ]
    },
    companyPayment: {
      screen: 'PAYMENT TO COMPANY REPORT SCREEN',
      title: 'Weekly PMT To Company Report',
      links: ['24hrs PMT To Company Report', 'Weekly PMT To Company Report', 'Monthly PMT To Company Report', 'Yearly PMT To Company Report'],
      fields: [
        { name: 'day1', label: 'Enter Day 1', type: 'date', value: '2026-09-30' },
        { name: 'day7', label: 'Enter Day 7', type: 'date', value: '2026-09-30' },
        { name: 'company', label: 'Company ID', type: 'select', value: '6', options: observedCompanyOptions }
      ]
    }
  }
  const c = configs[kind] || configs.adjustment
  return (
    <ReportShell screenTitle={c.screen} links={c.links}>
      <ReportForm title={c.title} fields={c.fields} error={c.error} />
    </ReportShell>
  )
}

function CompanyStockAdjustmentSummary({ onBack }) {
  const [mode, setMode] = useState('24hrs')
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [day1, setDay1] = useState(today)
  const [day7, setDay7] = useState(today)
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [companyId, setCompanyId] = useState('6')
  const [searched, setSearched] = useState(false)

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const years = ['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026','2027','2028','2029','2030']
  const companyOptions = observedCompanyOptions || ['6']

  const modeConfig = {
    '24hrs': '24hrs Adjustment Summary Report',
    weekly: 'Weekly Adjustment Summary Report',
    monthly: 'Monthly Adjustment Summary Report',
    yearly: 'Yearly Adjustment Summary Report'
  }

  const period = mode === '24hrs'
    ? date
    : mode === 'weekly'
      ? `${day1} to ${day7}`
      : mode === 'monthly'
        ? `${month} ${year}`
        : year

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            ADJUSTMENT SUMMARY SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            Summarise company stock adjustments by date, week, month or year
          </div>
        </div>
        <button onClick={onBack} style={{
          border: '1px solid #cbd7e2', background: '#fff', color: '#244e73',
          borderRadius: '6px', padding: '7px 12px', fontWeight: '700', cursor: 'pointer'
        }}>← Back</button>
      </div>

      {!searched ? (
        <div style={{
          maxWidth: '760px', margin: '28px auto', border: '1px solid #168bbd',
          borderRadius: '8px', background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)', overflow: 'hidden'
        }}>
          <div style={{ background: '#1593c8', color: '#fff', padding: '11px 16px', textAlign: 'center', fontWeight: '800', fontSize: '17px' }}>
            Company Stock Adjustment Summary
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', padding: '14px 14px 4px' }}>
            {[
              ['24hrs', '24hrs Adjustment Summary Report'],
              ['weekly', 'Weekly Adjustment Summary Report'],
              ['monthly', 'Monthly Adjustment Summary Report'],
              ['yearly', 'Yearly Adjustment Summary Report']
            ].map(([value, label]) => (
              <button key={value} onClick={() => { setMode(value); setSearched(false) }} style={{
                border: '1px solid #168bbd',
                background: mode === value ? '#1593c8' : '#fff',
                color: mode === value ? '#fff' : '#244e73',
                borderRadius: '5px', padding: '7px 10px', fontSize: '11px',
                fontWeight: '700', cursor: 'pointer'
              }}>{label}</button>
            ))}
          </div>

          <div style={{ padding: '18px 28px 20px' }}>
            {mode === '24hrs' && (
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px 14px', alignItems: 'center' }}>
                <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>Enter Date</label>
                <input type="date" value={date} onChange={e => { setDate(e.target.value); setSearched(false) }} style={{ width: '100%', height: '38px', boxSizing: 'border-box', border: '1px solid #9fb4c5', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }} />
                <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>Company ID</label>
                <select value={companyId} onChange={e => { setCompanyId(e.target.value); setSearched(false) }} style={{ width: '100%', height: '38px', boxSizing: 'border-box', border: '1px solid #9fb4c5', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }}>
                  {companyOptions.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            )}

            {mode === 'weekly' && (
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px 14px', alignItems: 'center' }}>
                <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>Enter Day 1</label>
                <input type="date" value={day1} onChange={e => { setDay1(e.target.value); setSearched(false) }} style={{ width: '100%', height: '38px', boxSizing: 'border-box', border: '1px solid #9fb4c5', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }} />
                <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>Enter Day 7</label>
                <input type="date" value={day7} onChange={e => { setDay7(e.target.value); setSearched(false) }} style={{ width: '100%', height: '38px', boxSizing: 'border-box', border: '1px solid #9fb4c5', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }} />
                <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>Company ID</label>
                <select value={companyId} onChange={e => { setCompanyId(e.target.value); setSearched(false) }} style={{ width: '100%', height: '38px', boxSizing: 'border-box', border: '1px solid #9fb4c5', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }}>
                  {companyOptions.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            )}

            {mode === 'monthly' && (
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px 14px', alignItems: 'center' }}>
                <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>Month</label>
                <select value={month} onChange={e => { setMonth(e.target.value); setSearched(false) }} style={{ width: '100%', height: '38px', boxSizing: 'border-box', border: '1px solid #9fb4c5', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }}>
                  {months.map(x => <option key={x}>{x}</option>)}
                </select>
                <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>Year</label>
                <select value={year} onChange={e => { setYear(e.target.value); setSearched(false) }} style={{ width: '100%', height: '38px', boxSizing: 'border-box', border: '1px solid #9fb4c5', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }}>
                  {years.map(x => <option key={x}>{x}</option>)}
                </select>
                <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>Company ID</label>
                <select value={companyId} onChange={e => { setCompanyId(e.target.value); setSearched(false) }} style={{ width: '100%', height: '38px', boxSizing: 'border-box', border: '1px solid #9fb4c5', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }}>
                  {companyOptions.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            )}

            {mode === 'yearly' && (
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px 14px', alignItems: 'center' }}>
                <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>Year</label>
                <select value={year} onChange={e => { setYear(e.target.value); setSearched(false) }} style={{ width: '100%', height: '38px', boxSizing: 'border-box', border: '1px solid #9fb4c5', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }}>
                  {years.map(x => <option key={x}>{x}</option>)}
                </select>
                <label style={{ color: '#244e73', fontWeight: '700', fontSize: '13px' }}>Company ID</label>
                <select value={companyId} onChange={e => { setCompanyId(e.target.value); setSearched(false) }} style={{ width: '100%', height: '38px', boxSizing: 'border-box', border: '1px solid #9fb4c5', borderRadius: '4px', padding: '0 10px', fontSize: '13px' }}>
                  {companyOptions.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <button onClick={() => setSearched(true)} style={{ border: '1px solid #168bbd', background: '#1593c8', color: '#fff', borderRadius: '5px', padding: '8px 24px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Search</button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '1100px', margin: '14px auto 0', border: '1px solid #168bbd', borderRadius: '8px', background: '#f5fff5', boxShadow: '0 2px 8px rgba(22, 61, 91, .06)', overflow: 'hidden' }}>
          <div style={{ background: '#1593c8', color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: '15px', padding: '9px' }}>Company Stock Adjustment Summary Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', modeConfig[mode]],
                ['Company ID', companyId],
                ['Period', period],
                ['Status', 'No adjustment summary records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead><tr>{['s/n','Date','Company ID','Stock Name','Adjustment Qty','Amount','Summary Status'].map(label => <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>)}</tr></thead>
              <tbody><tr><td colSpan="7" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>Real adjustment summary records will appear here after the backend adjustment ledger is connected.</td></tr></tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{ border: '1px solid #9fb4c5', background: '#fff', color: '#173f63', borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer' }}>Change Search</button>
              <button onClick={onBack} style={{ border: '1px solid #9fb4c5', background: '#fff', color: '#173f63', borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer' }}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CompanyStockPurchasesSummary({ onBack }) {
  const [mode, setMode] = useState('24hrs')
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [day1, setDay1] = useState(today)
  const [day7, setDay7] = useState(today)
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [companyId, setCompanyId] = useState('6')
  const [searched, setSearched] = useState(false)

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const years = ['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026','2027','2028','2029','2030']
  const companyOptions = observedCompanyOptions || ['6']

  const modeConfig = {
    '24hrs': '24hrs Purchase Summary Report',
    weekly: 'Weekly Purchase Summary Report',
    monthly: 'Monthly Purchase Summary Report',
    yearly: 'Yearly Purchase Summary Report'
  }

  const period = mode === '24hrs'
    ? date
    : mode === 'weekly'
      ? `${day1} to ${day7}`
      : mode === 'monthly'
        ? `${month} ${year}`
        : year

  const selectStyle = {
    width: '100%', height: '38px', boxSizing: 'border-box',
    border: '1px solid #9fb4c5', borderRadius: '4px',
    padding: '0 10px', fontSize: '13px'
  }
  const labelStyle = { color: '#244e73', fontWeight: '700', fontSize: '13px' }

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            PURCHASE SUMMARY SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            Summarise company stock purchases by date, week, month or year
          </div>
        </div>
        <button onClick={onBack} style={{ border: '1px solid #cbd7e2', background: '#fff', color: '#244e73', borderRadius: '6px', padding: '7px 12px', fontWeight: '700', cursor: 'pointer' }}>
          ← Back
        </button>
      </div>

      {!searched ? (
        <div style={{ maxWidth: '760px', margin: '28px auto', border: '1px solid #168bbd', borderRadius: '8px', background: '#f5fff5', boxShadow: '0 2px 8px rgba(22, 61, 91, .06)', overflow: 'hidden' }}>
          <div style={{ background: '#1593c8', color: '#fff', padding: '11px 16px', textAlign: 'center', fontWeight: '800', fontSize: '17px' }}>
            Company Stock Purchases Summary
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', padding: '14px 14px 4px' }}>
            {[
              ['24hrs', '24hrs Purchase Summary Report'],
              ['weekly', 'Weekly Purchase Summary Report'],
              ['monthly', 'Monthly Purchase Summary Report'],
              ['yearly', 'Yearly Purchase Summary Report']
            ].map(([value, label]) => (
              <button key={value} onClick={() => { setMode(value); setSearched(false) }} style={{
                border: '1px solid #168bbd',
                background: mode === value ? '#1593c8' : '#fff',
                color: mode === value ? '#fff' : '#244e73',
                borderRadius: '5px', padding: '7px 10px', fontSize: '11px',
                fontWeight: '700', cursor: 'pointer'
              }}>{label}</button>
            ))}
          </div>

          <div style={{ padding: '18px 28px 20px' }}>
            {mode === '24hrs' && (
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px 14px', alignItems: 'center' }}>
                <label style={labelStyle}>Enter Date</label>
                <input type="date" value={date} onChange={e => { setDate(e.target.value); setSearched(false) }} style={{ ...selectStyle, padding: '0 10px' }} />
                <label style={labelStyle}>Company ID</label>
                <select value={companyId} onChange={e => { setCompanyId(e.target.value); setSearched(false) }} style={selectStyle}>
                  {companyOptions.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            )}

            {mode === 'weekly' && (
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px 14px', alignItems: 'center' }}>
                <label style={labelStyle}>Enter Day 1</label>
                <input type="date" value={day1} onChange={e => { setDay1(e.target.value); setSearched(false) }} style={selectStyle} />
                <label style={labelStyle}>Enter Day 7</label>
                <input type="date" value={day7} onChange={e => { setDay7(e.target.value); setSearched(false) }} style={selectStyle} />
                <label style={labelStyle}>Company ID</label>
                <select value={companyId} onChange={e => { setCompanyId(e.target.value); setSearched(false) }} style={selectStyle}>
                  {companyOptions.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            )}

            {mode === 'monthly' && (
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px 14px', alignItems: 'center' }}>
                <label style={labelStyle}>Month</label>
                <select value={month} onChange={e => { setMonth(e.target.value); setSearched(false) }} style={selectStyle}>
                  {months.map(x => <option key={x}>{x}</option>)}
                </select>
                <label style={labelStyle}>Year</label>
                <select value={year} onChange={e => { setYear(e.target.value); setSearched(false) }} style={selectStyle}>
                  {years.map(x => <option key={x}>{x}</option>)}
                </select>
                <label style={labelStyle}>Company ID</label>
                <select value={companyId} onChange={e => { setCompanyId(e.target.value); setSearched(false) }} style={selectStyle}>
                  {companyOptions.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            )}

            {mode === 'yearly' && (
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px 14px', alignItems: 'center' }}>
                <label style={labelStyle}>Year</label>
                <select value={year} onChange={e => { setYear(e.target.value); setSearched(false) }} style={selectStyle}>
                  {years.map(x => <option key={x}>{x}</option>)}
                </select>
                <label style={labelStyle}>Company ID</label>
                <select value={companyId} onChange={e => { setCompanyId(e.target.value); setSearched(false) }} style={selectStyle}>
                  {companyOptions.map(x => <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <button onClick={() => setSearched(true)} style={{ border: '1px solid #168bbd', background: '#1593c8', color: '#fff', borderRadius: '5px', padding: '8px 24px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                Search
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '1100px', margin: '14px auto 0', border: '1px solid #168bbd', borderRadius: '8px', background: '#f5fff5', boxShadow: '0 2px 8px rgba(22, 61, 91, .06)', overflow: 'hidden' }}>
          <div style={{ background: '#1593c8', color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: '15px', padding: '9px' }}>
            Company Stock Purchases Summary Results
          </div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', modeConfig[mode]],
                ['Company ID', companyId],
                ['Period', period],
                ['Status', 'No purchase summary records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>

            <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead><tr>{['s/n','Date','Company ID','Ref No','Stock Name','Purchase Qty','Amount','Summary Status'].map(label => <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>)}</tr></thead>
              <tbody><tr><td colSpan="8" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                Real purchase summary records will appear here after the backend purchase ledger is connected.
              </td></tr></tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{ border: '1px solid #9fb4c5', background: '#fff', color: '#173f63', borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer' }}>Change Search</button>
              <button onClick={onBack} style={{ border: '1px solid #9fb4c5', background: '#fff', color: '#173f63', borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer' }}>Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CashSalesStockSupplyReport = ({ onBack }) => {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [day1, setDay1] = useState(new Date().toISOString().slice(0, 10))
  const [day7, setDay7] = useState(new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [staff, setStaff] = useState('5')
  const [searched, setSearched] = useState(false)

  const staffOptions = ['5', 'All Sales Staff', 'cashier1', 'cashier2', 'oga', 'sales1', 'tiwatope']
  const years = Array.from({ length: 17 }, (_, i) => String(2014 + i))
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const fieldStyle = {
    width: '100%',
    height: '30px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 7px',
    fontSize: '12px',
    background: '#fff'
  }

  const modeItems = [
    ['24hrs', '24hrs CashSales Stock Supply Report'],
    ['weekly', 'Weekly CashSales Stock Supply Report'],
    ['monthly', 'Monthly CashSales Stock Supply Report'],
    ['yearly', 'Yearly CashSales Stock Supply Report']
  ]

  const reportTitle = modeItems.find(([key]) => key === mode)?.[1] || '24hrs CashSales Stock Supply Report'
  const period = mode === '24hrs'
    ? date
    : mode === 'weekly'
      ? `${day1} to ${day7}`
      : mode === 'monthly'
        ? `${month} ${year}`
        : year

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            CASHSALES STOCK SUPPLY REPORT SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            View CashSales stock supply reports by date, week, month or year
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5',
            background: '#fff',
            color: '#173f63',
            borderRadius: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '17px',
          padding: '10px'
        }}>. . . {reportTitle} . . .</div>

        <div style={{ padding: '12px 14px 0', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modeItems.map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setSearched(false) }} style={{
              border: `1px solid ${mode === key ? '#168bbd' : '#c5d8e4'}`,
              background: mode === key ? '#1593c8' : '#fff',
              color: mode === key ? '#fff' : '#173f63',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {mode === '24hrs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Sales Staff:</label>
              <select value={staff} onChange={e => setStaff(e.target.value)} style={fieldStyle}>
                {staffOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 1:</label>
              <input type="date" value={day1} onChange={e => setDay1(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 7:</label>
              <input type="date" value={day7} onChange={e => setDay7(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Sales Staff:</label>
              <select value={staff} onChange={e => setStaff(e.target.value)} style={fieldStyle}>
                {staffOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={fieldStyle}>
                {months.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Sales Staff:</label>
              <select value={staff} onChange={e => setStaff(e.target.value)} style={fieldStyle}>
                {staffOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Sales Staff:</label>
              <select value={staff} onChange={e => setStaff(e.target.value)} style={fieldStyle}>
                {staffOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setSearched(true)} style={{
              border: '1px solid #168bbd',
              background: '#1593c8',
              color: '#fff',
              borderRadius: '5px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}>Search</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '14px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '9px'
          }}>CashSales Stock Supply Report Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', reportTitle],
                ['Sales Staff', staff],
                ['Period', period],
                ['Status', 'No stock supply records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  {['s/n', 'Date', 'Ref No', 'Sales Staff', 'Stock Name', 'Supply Qty', 'Unit Price', 'Amount'].map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real CashSales Stock Supply records will appear here after the backend sales ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{
                border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
              }}>Change Search</button>
              {onBack && (
                <button onClick={onBack} style={{
                  border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                  borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
                }}>Back</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CashSalesStockSupplySummary = ({ onBack }) => {
  const [mode, setMode] = useState('24hrs')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [day1, setDay1] = useState(new Date().toISOString().slice(0, 10))
  const [day7, setDay7] = useState(new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState('September')
  const [year, setYear] = useState('2026')
  const [staff, setStaff] = useState('5')
  const [searched, setSearched] = useState(false)

  const staffOptions = ['5', 'All Sales Staff', 'cashier1', 'cashier2', 'oga', 'sales1', 'tiwatope']
  const years = Array.from({ length: 17 }, (_, i) => String(2014 + i))
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  const fieldStyle = {
    width: '100%',
    height: '30px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    padding: '0 7px',
    fontSize: '12px',
    background: '#fff'
  }

  const modeItems = [
    ['24hrs', '24hrs CashSales Stock Supply Summary'],
    ['weekly', 'Weekly CashSales Stock Supply Summary'],
    ['monthly', 'Monthly CashSales Stock Supply Summary'],
    ['yearly', 'Yearly CashSales Stock Supply Summary']
  ]

  const reportTitle = modeItems.find(([key]) => key === mode)?.[1] || '24hrs CashSales Stock Supply Summary'
  const period = mode === '24hrs'
    ? date
    : mode === 'weekly'
      ? `${day1} to ${day7}`
      : mode === 'monthly'
        ? `${month} ${year}`
        : year

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ color: '#173f63', fontWeight: '800', fontSize: '12px', letterSpacing: '.2px' }}>
            CASHSALES STOCK SUPPLY SUMMARY SCREEN
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            Summarise CashSales stock supply by date, week, month or year
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            border: '1px solid #9fb4c5',
            background: '#fff',
            color: '#173f63',
            borderRadius: '5px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>Back</button>
        )}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '17px',
          padding: '10px'
        }}>. . . {reportTitle} . . .</div>

        <div style={{ padding: '12px 14px 0', display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {modeItems.map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setSearched(false) }} style={{
              border: `1px solid ${mode === key ? '#168bbd' : '#c5d8e4'}`,
              background: mode === key ? '#1593c8' : '#fff',
              color: mode === key ? '#fff' : '#173f63',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: '16px 18px' }}>
          {mode === '24hrs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Sales Staff:</label>
              <select value={staff} onChange={e => setStaff(e.target.value)} style={fieldStyle}>
                {staffOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'weekly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 1:</label>
              <input type="date" value={day1} onChange={e => setDay1(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Enter Day 7:</label>
              <input type="date" value={day7} onChange={e => setDay7(e.target.value)} style={fieldStyle} />
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Sales Staff:</label>
              <select value={staff} onChange={e => setStaff(e.target.value)} style={fieldStyle}>
                {staffOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'monthly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={fieldStyle}>
                {months.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Sales Staff:</label>
              <select value={staff} onChange={e => setStaff(e.target.value)} style={fieldStyle}>
                {staffOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          {mode === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px 12px', alignItems: 'center' }}>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Year:</label>
              <select value={year} onChange={e => setYear(e.target.value)} style={fieldStyle}>
                {years.map(x => <option key={x}>{x}</option>)}
              </select>
              <label style={{ color: '#1683b5', fontWeight: '700', fontSize: '12px', textAlign: 'right' }}>Sales Staff:</label>
              <select value={staff} onChange={e => setStaff(e.target.value)} style={fieldStyle}>
                {staffOptions.map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setSearched(true)} style={{
              border: '1px solid #168bbd',
              background: '#1593c8',
              color: '#fff',
              borderRadius: '5px',
              padding: '8px 24px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}>Search</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '14px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '9px'
          }}>CashSales Stock Supply Summary Results</div>
          <div style={{ padding: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {[
                ['Report', reportTitle.replace('Report', 'Summary')],
                ['Sales Staff', staff],
                ['Period', period],
                ['Status', 'No stock supply summary records']
              ].map(([label, value]) => (
                <div key={label} style={{ border: '1px solid #cbd7e2', borderRadius: '4px', background: '#fff', padding: '8px' }}>
                  <div style={{ color: '#66788a', fontSize: '11px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ color: '#173f63', fontWeight: '700', fontSize: '12px' }}>{value}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr>
                  {['s/n', 'Date', 'Ref No', 'Sales Staff', 'Stock Name', 'Supply Qty', 'Unit Price', 'Amount'].map(label => (
                    <th key={label} style={{ padding: '6px', border: '1px solid #cbd7e2', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" style={{ padding: '30px 10px', border: '1px solid #cbd7e2', textAlign: 'center', color: '#65788a' }}>
                    Real CashSales Stock Supply summary records will appear here after the backend sales ledger is connected.
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setSearched(false)} style={{
                border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
              }}>Change Search</button>
              {onBack && (
                <button onClick={onBack} style={{
                  border: '1px solid #9fb4c5', background: '#fff', color: '#173f63',
                  borderRadius: '5px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer'
                }}>Back</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryReportPage({ kind = 'cashPayment' }) {
  const configs = {
    adjustment: {
      screen: 'ADJUSTMENT SUMMARY SCREEN',
      title: '24hrs Adjustment Summary Report',
      links: ['24hrs Adjustment Summary Report', 'Weekly Adjustment Summary Report', 'Monthly Adjustment Summary Report', 'Yearly Adjustment Summary Report'],
      error: 'Purchase with such Year does not exist'
    },
    purchase: {
      screen: 'PURCHASE SUMMARY SCREEN',
      title: '24hrs Purchase Summary Report',
      links: ['24hrs Purchase Summary Report', 'Weekly Purchase Summary Report', 'Monthly Purchase Summary Report', 'Yearly Purchase Summary Report'],
      error: 'Purchase with such Year does not exist'
    },
    cashSupply: {
      screen: 'CASHSALES STOCK SUPPLY SUMMARY SCREEN',
      title: '24hrs CashSales Stock Supply Summary',
      links: ['24hrs CashSales Stock Supply Summary', 'Weekly CashSales Stock Supply Summary', 'Monthly CashSales Stock Supply Summary', 'Yearly CashSales Stock Supply Summary']
    },
    nypSupply: {
      screen: 'NYP STOCK SUPPLY SUMMARY SCREEN',
      title: '24hrs NYP Stock Supply Summary',
      links: ['24hrs NYP Stock Supply Summary', 'Weekly NYP Stock Supply Summary', 'Monthly NYP Stock Supply Summary', 'Yearly NYP Stock Supply Summary']
    },
    cashPayment: {
      screen: 'CASHSALES PMT SUMMARY SCREEN',
      title: '24hrs CashSales PMT Summary',
      links: ['24hrs CashSales PMT Summary', 'Weekly CashSales PMT Summary', 'Monthly CashSales PMT Summary', 'Yearly CashSales PMT Summary'],
      fields: [
        { name: 'date', label: 'Enter Date', type: 'date', value: '2026-09-30' },
        { name: 'cashier', label: 'Cashier', type: 'select', value: '5', options: ['5', 'All Cashier', 'cashier1', 'cashier2', 'oga', 'sales1'] }
      ]
    },
    companyPayment: {
      screen: 'PAYMENT TO COMPANY SUMMARY SCREEN',
      title: '24hrs PMT To Company Summary',
      links: ['24hrs PMT To Company Summary', 'Weekly PMT To Company Summary', 'Monthly PMT To Company Summary', 'Yearly PMT To Company Summary']
    }
  }
  const c = configs[kind] || configs.cashPayment
  const fields = c.fields || [
    { name: 'date', label: 'Enter Date', type: 'date', value: '2026-09-30' },
    { name: kind === 'nypSupply' ? 'nyp' : 'company', label: kind === 'nypSupply' ? 'NYP ID' : 'Company ID', type: 'select', value: kind === 'nypSupply' ? '12' : '6', options: kind === 'nypSupply' ? observedNypOptions : observedCompanyOptions }
  ]
  return (
    <ReportShell screenTitle={c.screen} links={c.links}>
      <ReportForm title={c.title} fields={fields} error={c.error} />
    </ReportShell>
  )
}

const StockCostValuation = ({ onBack }) => {
  const [companyId, setCompanyId] = useState('6')
  const [date, setDate] = useState('2026-09-30')
  const [displayAll, setDisplayAll] = useState(true)
  const [searched, setSearched] = useState(false)

  const rows = [
    ['1','DANGOTE SALT 50KG','1','0 pk & 0 unt','16,730.00','16,730.00','0.00'],
    ['2','DANGOTE SALT X 20','1','189 pk & 0 unt','7,480.00','7,480.00','1,413,720.00'],
    ['3','DANGOTE SALT X 40','1','1,288 pk & 0 unt','7,730.00','7,730.00','9,855,750.00'],
    ['4','DANGOTE SALT X 80','1','795 pk & 0 unt','8,030.00','8,030.00','6,383,850.00'],
    ['5','DANGOTE SUGAR 50KG','1','0 pk & 0 unt','28,300.00','28,300.00','0.00']
  ]

  const companyName = companyId === '6' ? 'DANGOTE NIG PLC' : companyId

  return (
    <div style={{ padding:'18px 16px 30px', background:'#f5fff5', minHeight:'100%' }}>
      <div style={{ maxWidth:'1180px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', marginBottom:'14px' }}>
          <div>
            <div style={{ color:'#244e73', fontWeight:'700', fontSize:'20px' }}>STOCK COST VALUATION SCREEN</div>
            <div style={{ color:'#5e7182', fontSize:'13px', marginTop:'4px' }}>View the cost valuation of company stock</div>
          </div>
          <button
            type="button"
            onClick={onBack}
            style={{ background:'#fff', color:'#244e73', border:'1px solid #9fb4c5', borderRadius:'5px', padding:'7px 14px', fontWeight:'700', cursor:'pointer' }}
          >
            ← Back
          </button>
        </div>

        {!searched ? (
          <div style={{ maxWidth:'760px', margin:'0 auto', border:'1px solid #168bbd', background:'#f5fff5', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'700', fontSize:'17px', padding:'10px' }}>
              Stock Cost Valuation
            </div>
            <div style={{ padding:'18px 22px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'160px minmax(0,1fr) auto', gap:'9px', alignItems:'center' }}>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Company ID</label>
                <select value={companyId} onChange={e=>setCompanyId(e.target.value)} style={{ width:'100%', height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }}>
                  {observedCompanyOptions.map(x=><option key={x}>{x}</option>)}
                </select>
                <button type="button" onClick={()=>setSearched(true)} style={{ height:'38px', padding:'0 16px', background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', fontWeight:'700', cursor:'pointer' }}>Search</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'160px minmax(0,1fr) auto', gap:'9px', alignItems:'center', marginTop:'12px' }}>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Enter Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ width:'100%', height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }} />
                <div />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'13px', marginLeft:'160px' }}>
                <input id="displayAll" type="checkbox" checked={displayAll} onChange={e=>setDisplayAll(e.target.checked)} />
                <label htmlFor="displayAll" style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Display All</label>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth:'1100px', margin:'0 auto', border:'1px solid #168bbd', background:'#f5fff5', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'700', fontSize:'17px', padding:'10px' }}>
              Stock Cost Valuation Results
            </div>
            <div style={{ padding:'14px 16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:'10px', marginBottom:'14px' }}>
                {[
                  ['Report','Stock Cost Valuation'],
                  ['Company ID',companyId],
                  ['Company',companyName],
                  ['Date',date]
                ].map(([label,value])=>(
                  <div key={label} style={{ border:'1px solid #c7d5df', borderRadius:'5px', background:'#fff', padding:'9px 10px' }}>
                    <div style={{ color:'#607586', fontSize:'11px', fontWeight:'700', marginBottom:'3px' }}>{label}</div>
                    <div style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ color:'#244e73', fontWeight:'700', fontSize:'15px', textAlign:'center', marginBottom:'10px' }}>
                . . . {date}: {companyName}: Company Stock Cost Valuation . . .
              </div>

              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', minWidth:'820px', borderCollapse:'collapse', fontSize:'12px', background:'#fff' }}>
                  <thead>
                    <tr>{['s/n','Stock Name','Pack Size','Current Stock','Pack Cost Price','Unit Cost Price','Valuation Amount'].map(h=><th key={h} style={{ ...thStyle, background:'#e8f5fb', color:'#244e73', whiteSpace:'nowrap' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i} style={tdStyle}>{v}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign:'right', color:'#d11', fontWeight:'700', fontSize:'15px', padding:'10px 4px' }}>
                TOTAL VALUATION: 17,653,320.00
              </div>

              <div style={{ display:'flex', justifyContent:'center', gap:'10px', marginTop:'5px' }}>
                <button type="button" onClick={()=>setSearched(false)} style={{ background:'#fff', color:'#244e73', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'8px 15px', fontWeight:'700', cursor:'pointer' }}>Change Search</button>
                <button type="button" onClick={()=>window.print()} style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}>Send To Printer</button>
                <button type="button" onClick={onBack} style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}>Back</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const StockBinCard = ({ onBack }) => {
  const [stock, setStock] = useState('GINO THYME SATCHEt 5G')
  const [date, setDate] = useState('2026-09-30')
  const [mode, setMode] = useState('24hrs')
  const [searched, setSearched] = useState(false)

  const stockOptions = [
    '142',
    'GOLDEN PENNY SPREAD 15G X 20 Sachet NEW',
    'GOLDEN PENNY SUGAR 50 KG',
    'GOLDEN PENNY TWIST BIG',
    'GOLDEN PENNY TWIST BIG NEW',
    'HONEYWELL SEMOLINA 4.75G',
    'GINO THYME SATCHEt 5G'
  ]

  const modeOptions = [
    ['24hrs', '24hrs Stock Bin Card'],
    ['monthly', 'Monthly Stock Bin Card'],
    ['yearly', 'Yearly Stock Bin Card']
  ]

  const rows = [
    ['2026-09-30','CS-0001','Opening / Stock Movement','1','0','0','0','0','0','0.00',''],
    ['2026-09-30','—','No stock movement recorded','1','0','0','0','0','0','0.00','']
  ]

  const periodLabel = mode === '24hrs'
    ? date
    : mode === 'monthly'
      ? 'September 2026'
      : '2026'

  return (
    <div style={{ padding:'18px 16px 30px', background:'#f5fff5', minHeight:'100%' }}>
      <div style={{ maxWidth:'1180px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', marginBottom:'14px' }}>
          <div>
            <div style={{ color:'#244e73', fontWeight:'700', fontSize:'20px' }}>STOCK BIN CARD SCREEN</div>
            <div style={{ color:'#5e7182', fontSize:'13px', marginTop:'4px' }}>View stock movements and balance for a selected product</div>
          </div>
          <button type="button" onClick={onBack} style={{ background:'#fff', color:'#244e73', border:'1px solid #9fb4c5', borderRadius:'5px', padding:'7px 14px', fontWeight:'700', cursor:'pointer' }}>← Back</button>
        </div>

        {!searched ? (
          <div style={{ maxWidth:'760px', margin:'0 auto', border:'1px solid #168bbd', background:'#f5fff5', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'700', fontSize:'17px', padding:'10px' }}>Stock Bin Card</div>
            <div style={{ padding:'18px 22px' }}>
              <div style={{ display:'flex', justifyContent:'center', gap:'7px', flexWrap:'wrap', marginBottom:'16px' }}>
                {modeOptions.map(([value,label]) => (
                  <button key={value} type="button" onClick={()=>setMode(value)} style={{ background:mode===value?'#1593c8':'#fff', color:mode===value?'#fff':'#244e73', border:'1px solid #9fb4c5', borderRadius:'5px', padding:'7px 12px', fontWeight:'700', cursor:'pointer', fontSize:'12px' }}>{label}</button>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'160px minmax(0,1fr) auto', gap:'9px', alignItems:'center' }}>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Stock Name</label>
                <select value={stock} onChange={e=>setStock(e.target.value)} style={{ width:'100%', height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }}>
                  {stockOptions.map(x=><option key={x}>{x}</option>)}
                </select>
                <button type="button" onClick={()=>setSearched(true)} style={{ height:'38px', padding:'0 16px', background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', fontWeight:'700', cursor:'pointer' }}>Search</button>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'160px minmax(0,1fr) auto', gap:'9px', alignItems:'center', marginTop:'12px' }}>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Enter Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ width:'100%', height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }} />
                <div />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth:'1100px', margin:'0 auto', border:'1px solid #168bbd', background:'#f5fff5', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'700', fontSize:'17px', padding:'10px' }}>Stock Bin Card Results</div>
            <div style={{ padding:'14px 16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:'10px', marginBottom:'14px' }}>
                {[
                  ['Report','Stock Bin Card'],
                  ['Stock Name',stock],
                  ['Period',periodLabel],
                  ['Status','No stock movement recorded']
                ].map(([label,value])=>(
                  <div key={label} style={{ border:'1px solid #c7d5df', borderRadius:'5px', background:'#fff', padding:'9px 10px' }}>
                    <div style={{ color:'#607586', fontSize:'11px', fontWeight:'700', marginBottom:'3px' }}>{label}</div>
                    <div style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ color:'#244e73', fontWeight:'700', fontSize:'15px', textAlign:'center', marginBottom:'10px' }}>
                . . . {periodLabel}: {stock}: Stock Bin Card . . .
              </div>

              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', minWidth:'1050px', borderCollapse:'collapse', fontSize:'12px', background:'#fff' }}>
                  <thead>
                    <tr>{['Date','Ref No','Description','Pack Size','Stock Received','Stock Issued','Stock Damaged','Stock Returned','Stock Balance','Amount','Remark'].map(h=><th key={h} style={{ ...thStyle, background:'#e8f5fb', color:'#244e73', whiteSpace:'nowrap' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map((r,ri)=><tr key={ri}>{r.map((v,i)=><td key={i} style={tdStyle}>{v}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>

              <div style={{ display:'flex', justifyContent:'center', gap:'10px', marginTop:'15px' }}>
                <button type="button" onClick={()=>setSearched(false)} style={{ background:'#fff', color:'#244e73', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'8px 15px', fontWeight:'700', cursor:'pointer' }}>Change Search</button>
                <button type="button" onClick={()=>window.print()} style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}>Send To Printer</button>
                <button type="button" onClick={onBack} style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}>Back</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const StockPerProduct = ({ onBack }) => {
  const [stock, setStock] = useState('GOLDEN PENNY FLOUR 1KG')
  const [date, setDate] = useState('2026-09-30')
  const [searched, setSearched] = useState(false)

  const stockOptions = [
    'GOLDEN PENNY FLOUR 1KG',
    'GOLDEN PENNY SPAGHETTI',
    'HONEYWELL SEMOLINA 900G X 10',
    'SEMO 5KG',
    'DANGOTE SALT 50KG',
    'DANGOTE SALT X 20',
    'DANGOTE SALT X 40',
    'DANGOTE SALT X 80',
    'DANGOTE SUGAR 50KG',
    'GOLDEN PENNY SPREAD 15G X 20 Sachet NEW',
    'GOLDEN PENNY SUGAR 50 KG',
    'GOLDEN PENNY TWIST BIG',
    'GOLDEN PENNY TWIST BIG NEW',
    'GINO THYME SATCHEt 5G'
  ]

  const rows = [
    ['1','GOLDEN PENNY FLOUR 1KG','10','0 pk & 0 unt','11,440.00','1,144.00','12,100.00','0.00','2026-08-11'],
    ['2','GOLDEN PENNY SPAGHETTI','1','0 pk & 0 unt','18,460.00','18,460.00','18,500.00','0.00','2026-08-11'],
    ['3','HONEYWELL SEMOLINA 900G X 10','1','0 pk & 0 unt','13,625.00','13,625.00','13,500.00','0.00','2026-02-11'],
    ['4','SEMO 5KG','1','272 pk & 0 unt','6,815.00','6,815.00','6,900.00','1,854,?0.00','2026-09-22']
  ]

  return (
    <div style={{ padding:'18px 16px 30px', background:'#f5fff5', minHeight:'100%' }}>
      <div style={{ maxWidth:'1180px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', marginBottom:'14px' }}>
          <div>
            <div style={{ color:'#244e73', fontWeight:'700', fontSize:'20px' }}>STOCK PER PRODUCT SCREEN</div>
            <div style={{ color:'#5e7182', fontSize:'13px', marginTop:'4px' }}>View stock details for a selected product</div>
          </div>
          <button
            type="button"
            onClick={onBack}
            style={{ background:'#fff', color:'#244e73', border:'1px solid #9fb4c5', borderRadius:'5px', padding:'7px 14px', fontWeight:'700', cursor:'pointer' }}
          >
            ← Back
          </button>
        </div>

        {!searched ? (
          <div style={{ maxWidth:'760px', margin:'0 auto', border:'1px solid #168bbd', background:'#f5fff5', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'700', fontSize:'17px', padding:'10px' }}>
              Stock Per Product
            </div>
            <div style={{ padding:'18px 22px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'160px minmax(0,1fr) auto', gap:'9px', alignItems:'center' }}>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Stock Name</label>
                <select value={stock} onChange={e=>setStock(e.target.value)} style={{ width:'100%', height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }}>
                  {stockOptions.map(x=><option key={x}>{x}</option>)}
                </select>
                <button type="button" onClick={()=>setSearched(true)} style={{ height:'38px', padding:'0 16px', background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', fontWeight:'700', cursor:'pointer' }}>Search</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'160px minmax(0,1fr) auto', gap:'9px', alignItems:'center', marginTop:'12px' }}>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Enter Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ width:'100%', height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }} />
                <div />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth:'1100px', margin:'0 auto', border:'1px solid #168bbd', background:'#f5fff5', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'700', fontSize:'17px', padding:'10px' }}>
              Stock Per Product Results
            </div>
            <div style={{ padding:'14px 16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:'10px', marginBottom:'14px' }}>
                {[
                  ['Report','Stock Per Product'],
                  ['Stock Name',stock],
                  ['Date',date],
                  ['Status','Report generated']
                ].map(([label,value])=>(
                  <div key={label} style={{ border:'1px solid #c7d5df', borderRadius:'5px', background:'#fff', padding:'9px 10px' }}>
                    <div style={{ color:'#607586', fontSize:'11px', fontWeight:'700', marginBottom:'3px' }}>{label}</div>
                    <div style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px', background:'#fff' }}>
                  <thead>
                    <tr>{['s/n','Stock Name','Pack Size','Current Stock','Pack Cost Price','Unit Cost Price','Selling Price','Valuation Amount','Date Updated'].map(h=><th key={h} style={{ ...thStyle, background:'#e8f5fb', color:'#244e73', whiteSpace:'nowrap' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i} style={tdStyle}>{v}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>

              <div style={{ display:'flex', justifyContent:'center', gap:'10px', marginTop:'15px' }}>
                <button type="button" onClick={()=>setSearched(false)} style={{ background:'#fff', color:'#244e73', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'8px 15px', fontWeight:'700', cursor:'pointer' }}>Change Search</button>
                <button type="button" onClick={onBack} style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}>Back</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const StockBalance = ({ onBack }) => {
  const [date, setDate] = useState('2026-09-30')
  const [searched, setSearched] = useState(false)

  const rows = [
    ['1','GOLDEN PENNY FLOUR 1KG','10','0 pk & 0 unt','11,440.00','1,144.00','12,100.00','0.00','2026-08-11'],
    ['2','GOLDEN PENNY SPAGHETTI','1','0 pk & 0 unt','18,460.00','18,460.00','18,500.00','0.00','2026-08-11'],
    ['3','HONEYWELL SEMOLINA 900G X 10','1','0 pk & 0 unt','13,625.00','13,625.00','13,500.00','0.00','2026-02-11'],
    ['4','SEMO 5KG','1','272 pk & 0 unt','6,815.00','6,815.00','6,900.00','1,854,?0.00','2026-09-22']
  ]

  return (
    <div style={{ padding:'18px 16px 30px', background:'#f5fff5', minHeight:'100%' }}>
      <div style={{ maxWidth:'1180px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', marginBottom:'14px' }}>
          <div>
            <div style={{ color:'#244e73', fontWeight:'700', fontSize:'20px' }}>STOCK BALANCE SCREEN</div>
            <div style={{ color:'#5e7182', fontSize:'13px', marginTop:'4px' }}>View the current stock balance by product</div>
          </div>
          <button type="button" onClick={onBack} style={{ background:'#fff', color:'#244e73', border:'1px solid #9fb4c5', borderRadius:'5px', padding:'7px 14px', fontWeight:'700', cursor:'pointer' }}>← Back</button>
        </div>

        {!searched ? (
          <div style={{ maxWidth:'760px', margin:'0 auto', border:'1px solid #168bbd', background:'#f5fff5', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'700', fontSize:'17px', padding:'10px' }}>Stock Balance</div>
            <div style={{ padding:'18px 22px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'160px minmax(0,1fr) auto', gap:'9px', alignItems:'center' }}>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Enter Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ width:'100%', height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }} />
                <button type="button" onClick={()=>setSearched(true)} style={{ height:'38px', padding:'0 16px', background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', fontWeight:'700', cursor:'pointer' }}>Search</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth:'1100px', margin:'0 auto', border:'1px solid #168bbd', background:'#f5fff5', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'700', fontSize:'17px', padding:'10px' }}>Stock Balance Results</div>
            <div style={{ padding:'14px 16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:'10px', marginBottom:'14px' }}>
                {[
                  ['Report','Stock Balance'],
                  ['Date',date],
                  ['Status','Report generated']
                ].map(([label,value])=>(
                  <div key={label} style={{ border:'1px solid #c7d5df', borderRadius:'5px', background:'#fff', padding:'9px 10px' }}>
                    <div style={{ color:'#607586', fontSize:'11px', fontWeight:'700', marginBottom:'3px' }}>{label}</div>
                    <div style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px', background:'#fff' }}>
                  <thead><tr>{['s/n','Stock Name','Pack Size','Current Stock','Pack Cost Price','Unit Cost Price','Selling Price','Valuation Amount','Date Updated'].map(h=><th key={h} style={{ ...thStyle, background:'#e8f5fb', color:'#244e73', whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
                  <tbody>{rows.map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i} style={tdStyle}>{v}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <div style={{ display:'flex', justifyContent:'center', gap:'10px', marginTop:'15px' }}>
                <button type="button" onClick={()=>setSearched(false)} style={{ background:'#fff', color:'#244e73', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'8px 15px', fontWeight:'700', cursor:'pointer' }}>Change Search</button>
                <button type="button" onClick={onBack} style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}>Back</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const StockSellingValuation = ({ onBack }) => {
  const [companyId, setCompanyId] = useState('6')
  const [date, setDate] = useState('2026-09-30')
  const [displayAll, setDisplayAll] = useState(true)
  const [searched, setSearched] = useState(false)

  const rows = [
    ['1','GOLDEN PENNY FLOUR 1KG','10','0 pk & 0 unt','11,440.00','1,144.00','12,100.00','0.00'],
    ['2','GOLDEN PENNY SPAGHETTI','1','0 pk & 0 unt','18,460.00','18,460.00','18,500.00','0.00'],
    ['3','HONEYWELL SEMOLINA 900G X 10','1','0 pk & 0 unt','13,625.00','13,625.00','13,500.00','0.00'],
    ['4','SEMO 5KG','1','272 pk & 0 unt','6,815.00','6,815.00','6,900.00','1,876,?80.00'],
    ['5','DANGOTE SALT X 20','1','189 pk & 0 unt','7,480.00','7,480.00','7,650.00','1,445,850.00']
  ]

  const companyName = companyId === '6' ? 'DANGOTE NIG PLC' : companyId

  return (
    <div style={{ padding:'18px 16px 30px', background:'#f5fff5', minHeight:'100%' }}>
      <div style={{ maxWidth:'1180px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', marginBottom:'14px' }}>
          <div>
            <div style={{ color:'#244e73', fontWeight:'700', fontSize:'20px' }}>STOCK SELLING VALUATION SCREEN</div>
            <div style={{ color:'#5e7182', fontSize:'13px', marginTop:'4px' }}>View the selling valuation of company stock</div>
          </div>
          <button
            type="button"
            onClick={onBack}
            style={{ background:'#fff', color:'#244e73', border:'1px solid #9fb4c5', borderRadius:'5px', padding:'7px 14px', fontWeight:'700', cursor:'pointer' }}
          >
            ← Back
          </button>
        </div>

        {!searched ? (
          <div style={{ maxWidth:'760px', margin:'0 auto', border:'1px solid #168bbd', background:'#f5fff5', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'700', fontSize:'17px', padding:'10px' }}>
              Stock Selling Valuation
            </div>
            <div style={{ padding:'18px 22px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'160px minmax(0,1fr) auto', gap:'9px', alignItems:'center' }}>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Company ID</label>
                <select value={companyId} onChange={e=>setCompanyId(e.target.value)} style={{ width:'100%', height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }}>
                  {observedCompanyOptions.map(x=><option key={x}>{x}</option>)}
                </select>
                <button type="button" onClick={()=>setSearched(true)} style={{ height:'38px', padding:'0 16px', background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', fontWeight:'700', cursor:'pointer' }}>Search</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'160px minmax(0,1fr) auto', gap:'9px', alignItems:'center', marginTop:'12px' }}>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Enter Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ width:'100%', height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }} />
                <div />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'13px', marginLeft:'160px' }}>
                <input id="sellingDisplayAll" type="checkbox" checked={displayAll} onChange={e=>setDisplayAll(e.target.checked)} />
                <label htmlFor="sellingDisplayAll" style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>Display All</label>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth:'1100px', margin:'0 auto', border:'1px solid #168bbd', background:'#f5fff5', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', overflow:'hidden' }}>
            <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'700', fontSize:'17px', padding:'10px' }}>
              Stock Selling Valuation Results
            </div>
            <div style={{ padding:'14px 16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:'10px', marginBottom:'14px' }}>
                {[
                  ['Report','Stock Selling Valuation'],
                  ['Company ID',companyId],
                  ['Company',companyName],
                  ['Date',date]
                ].map(([label,value])=>(
                  <div key={label} style={{ border:'1px solid #c7d5df', borderRadius:'5px', background:'#fff', padding:'9px 10px' }}>
                    <div style={{ color:'#607586', fontSize:'11px', fontWeight:'700', marginBottom:'3px' }}>{label}</div>
                    <div style={{ color:'#244e73', fontWeight:'700', fontSize:'13px' }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ color:'#244e73', fontWeight:'700', fontSize:'15px', textAlign:'center', marginBottom:'10px' }}>
                . . . {date}: {companyName}: Company Stock Selling Valuation . . .
              </div>

              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', minWidth:'900px', borderCollapse:'collapse', fontSize:'12px', background:'#fff' }}>
                  <thead>
                    <tr>{['s/n','Stock Name','Pack Size','Current Stock','Pack Cost Price','Unit Cost Price','Selling Price','Valuation Amount'].map(h=><th key={h} style={{ ...thStyle, background:'#e8f5fb', color:'#244e73', whiteSpace:'nowrap' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i} style={tdStyle}>{v}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign:'right', color:'#d11', fontWeight:'700', fontSize:'15px', padding:'10px 4px' }}>
                TOTAL SELLING VALUATION: 3,322,?30.00
              </div>

              <div style={{ display:'flex', justifyContent:'center', gap:'10px', marginTop:'5px' }}>
                <button type="button" onClick={()=>setSearched(false)} style={{ background:'#fff', color:'#244e73', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'8px 15px', fontWeight:'700', cursor:'pointer' }}>Change Search</button>
                <button type="button" onClick={()=>window.print()} style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}>Send To Printer</button>
                <button type="button" onClick={onBack} style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}>Back</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StockReportPage({ kind }) {
  if (kind === 'Stock Cost Valuation') return <StockCostValuation />
  if (kind === 'Stock Bin Card') return <StockBinCard />

  const configs = {
    'Stock Per Product': ['STOCK PER PRODUCT SCREEN','Stock Per Product'],
    'Stock Balance': ['STOCK BALANCE SCREEN','Stock Balance'],
    'Stock Selling Valuation': ['STOCK SELLING VALUATION SCREEN','Stock Selling Valuation']
  }
  const [screen, title] = configs[kind] || configs['Stock Balance']
  return (
    <ReportShell screenTitle={screen}>
      <div style={{ width:'94%', margin:'8px auto' }}>
        <div style={{ color:'#d11', fontWeight:'bold', fontSize:'16px', textAlign:'center', margin:'8px' }}>
          . . . 2026: September 30: {title} . . .
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
          <thead><tr>{['s/n','Stock Name','Pack Size','Current Stock','Pack Cost Price','Unit Cost Price','Selling Price','Valuation Amount','Date Updated'].map(h=><th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ['1','GOLDEN PENNY FLOUR 1KG','10','0 pk & 0 unt','11,440.00','1,144.00','12,100.00','0.00','2026-08-11'],
              ['2','GOLDEN PENNY SPAGHETTI','1','0 pk & 0 unt','18,460.00','18,460.00','18,500.00','0.00','2026-08-11'],
              ['3','HONEYWELL SEMOLINA 900G X 10','1','0 pk & 0 unt','13,625.00','13,625.00','13,500.00','0.00','2026-02-11'],
              ['4','SEMO 5KG','1','272 pk & 0 unt','6,815.00','6,815.00','6,900.00','1,854,?0.00','2026-09-22']
            ].map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i} style={tdStyle}>{v}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </ReportShell>
  )
}

function NypAccountPage({ kind = 'summary', onBack }) {
  const [nyp, setNyp] = useState('ARADA IYA SHALLOM PETER')
  const [date, setDate] = useState('2026-09-30')
  const [searched, setSearched] = useState(false)
  const [summaryNyp, setSummaryNyp] = useState('ALL NYP ACCOUNTS')
  const [summaryDate, setSummaryDate] = useState('2026-09-30')
  const [summarySearched, setSummarySearched] = useState(false)

  const historyRows = [
    ['2026-09-30', 'NYP-0001', 'NYP Stock Supply', '0.00', '0.00', '0.00', '0.00', '0.00'],
    ['2026-09-30', 'NYP-0002', 'NYP Payment', '0.00', '0.00', '0.00', '0.00', '0.00']
  ]

  if (kind === 'history') {
    return (
      <div style={{padding:'22px 26px', overflowY:'auto', height:'100%', boxSizing:'border-box'}}>
        <div style={{position:'relative', marginBottom:'18px'}}>
          <div style={{fontSize:'22px',fontWeight:'700',color:'#1737b6'}}>NYP Account History</div>
          <div style={{fontSize:'13px',color:'#667788',marginTop:'4px'}}>Search and view the transaction history of an NYP account.</div>
          <button
            onClick={onBack}
            style={{position:'absolute',right:'0',top:'0',background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
          >
            ← Back
          </button>
        </div>

        <div style={{width:'100%',maxWidth:'760px',margin:'0 auto',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'700',padding:'11px',fontSize:'17px'}}>
            NYP Acct History
          </div>

          <div style={{padding:'20px 28px'}}>
            <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'13px 14px',alignItems:'center'}}>
              <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>NYP ID:</label>
              <select value={nyp} onChange={e=>setNyp(e.target.value)} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',background:'#fff'}}>
                {observedNypOptions.map(x=><option key={x}>{x}</option>)}
              </select>

              <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Enter Date:</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}} />
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:'9px',marginTop:'18px'}}>
              <button onClick={()=>setSearched(true)} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 20px',fontWeight:'700',cursor:'pointer'}}>Search</button>
              <button onClick={()=>{setNyp('ARADA IYA SHALLOM PETER');setDate('2026-09-30');setSearched(false)}} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}>Clear</button>
            </div>
          </div>
        </div>

        {searched && (
          <div style={{width:'100%',maxWidth:'1100px',margin:'20px auto 0',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
            <div style={{background:'#1593c8',color:'#fff',fontWeight:'700',padding:'11px 14px',fontSize:'17px',textAlign:'center'}}>
              {nyp}: NYP ACCOUNT HISTORY
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',padding:'14px'}}>
              {[
                ['NYP ID', nyp],
                ['Date', date],
                ['Status', 'History Found']
              ].map(([label,value])=>(
                <div key={label} style={{background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',padding:'9px 11px'}}>
                  <div style={{fontSize:'11px',color:'#6c7c88',fontWeight:'700',marginBottom:'3px'}}>{label}</div>
                  <div style={{fontSize:'13px',fontWeight:'700',color:'#1737b6',wordBreak:'break-word'}}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{overflowX:'auto',padding:'0 14px 14px'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',background:'#fff'}}>
                <thead>
                  <tr>{['Date','Ref No','Description','Supply Amt','Return Amt','Damage Amt','Paid Amt','Balance'].map(h=><th key={h} style={{...thStyle,textAlign:'center'}}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {historyRows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j} style={{...tdStyle,textAlign:j===2?'left':'center',color:j===7?'#d11':'#111'}}>{v}</td>)}</tr>)}
                </tbody>
              </table>
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
              <button onClick={()=>setSearched(false)} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Change Search</button>
              <button onClick={()=>window.print()} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
            </div>
          </div>
        )}
      </div>
    )
  }


  const rows = [
    ['ARADA IYA SHALLOM PETER','15,056,400.00','0.00','0.00','0.00','15,056,400.00'],
    ['FMN MAYOWA EMMANUEL','483,100.00','0.00','0.00','0.00','483,100.00'],
    ['GOLDEN PENNY JAMIU','2,562,400.00','0.00','0.00','2,345,800.00','216,600.00'],
    ['GOLDEN PENNY MR JOEL','100,605,400.00','0.00','0.00','97,951,800.00','2,653,600.00'],
    ['GOLDEN PENNYSHOLA WILLIAM','54,217,370.00','0.00','0.00','53,892,045.00','325,325.00'],
    ['IYA SAHEED ORA','2,611,500.00','0.00','0.00','2,611,500.00','0.00'],
    ['MR SAMSON G PENNY','7,915,300.00','0.00','0.00','4,096,600.00','3,818,700.00'],
    ['MRS ABIOYE IYA OBAARA','2,049,050.00','0.00','0.00','0.00','2,049,050.00'],
    ['SEMO SHOP STAFFS','4,135,440.00','0.00','0.00','70,200.00','4,065,240.00'],
    ['TLD PROVISION SHOP','1,774,500.00','0.00','0.00','0.00','1,774,500.00'],
    ['UNIQUE STORE AROWOMOLE','4,443,000.00','0.00','0.00','0.00','4,443,000.00'],
    ['YAH SAMAD','1,536,500.00','0.00','0.00','0.00','1,536,500.00']
  ]

  if (kind === 'debtors') {
    const debtorTotal = rows.length

    return (
      <div style={{padding:'22px 26px', overflowY:'auto', height:'100%', boxSizing:'border-box'}}>
        <div style={{position:'relative', marginBottom:'18px'}}>
          <div style={{fontSize:'22px',fontWeight:'700',color:'#1737b6'}}>All Debtors Report</div>
          <div style={{fontSize:'13px',color:'#667788',marginTop:'4px'}}>View the current debtor account status for all NYP accounts.</div>
          <button
            onClick={onBack}
            style={{position:'absolute',right:'0',top:'0',background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
          >
            ← Back
          </button>
        </div>

        <div style={{width:'100%',maxWidth:'1100px',margin:'0 auto',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',fontWeight:'700',padding:'11px 14px',fontSize:'17px',textAlign:'center'}}>
            . . . DEBTORS ACCOUNT STATUS . . .
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',padding:'14px'}}>
            {[
              ['Report Date','2026-09-30'],
              ['Status','Debtors Found'],
              ['Total Debtors',String(debtorTotal)]
            ].map(([label,value])=>(
              <div key={label} style={{background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',padding:'9px 11px'}}>
                <div style={{fontSize:'11px',color:'#6c7c88',fontWeight:'700',marginBottom:'3px'}}>{label}</div>
                <div style={{fontSize:'13px',fontWeight:'700',color:'#1737b6',wordBreak:'break-word'}}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{overflowX:'auto',padding:'0 14px 14px'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',background:'#fff',minWidth:'900px'}}>
              <thead>
                <tr>{['S/N','Full Name','NYP ID','Supply Amt','Return Amt','Damage Amt','Paid Amt','To Balance Amt'].map(h=><th key={h} style={{...thStyle,textAlign:'center'}}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r,i)=>(
                  <tr key={r[0]}>
                    <td style={{...tdStyle,textAlign:'center'}}>{i+1}</td>
                    <td style={{...tdStyle,textAlign:'left',fontWeight:'600'}}>{r[0]}</td>
                    <td style={{...tdStyle,textAlign:'left'}}>{r[0]}</td>
                    {r.slice(1).map((v,j)=><td key={j} style={{...tdStyle,textAlign:'right',color:'#d11'}}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
            <button
              onClick={()=>window.print()}
              style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
            >
              Send To Printer
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Modern structure for All NYP Acct Summary

  return (
    <div style={{padding:'22px 26px', overflowY:'auto', height:'100%', boxSizing:'border-box'}}>
      <div style={{position:'relative', marginBottom:'18px'}}>
        <div style={{fontSize:'22px',fontWeight:'700',color:'#1737b6'}}>All NYP Account Summary</div>
        <div style={{fontSize:'13px',color:'#667788',marginTop:'4px'}}>Search and view the account summary for all NYP accounts.</div>
        <button onClick={onBack} style={{position:'absolute',right:'0',top:'0',background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}>← Back</button>
      </div>

      <div style={{width:'100%',maxWidth:'760px',margin:'0 auto',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'700',padding:'11px',fontSize:'17px'}}>All NYP Acct Summary</div>
        <div style={{padding:'20px 28px'}}>
          <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'13px 14px',alignItems:'center'}}>
            <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>NYP ID:</label>
            <select value={summaryNyp} onChange={e=>setSummaryNyp(e.target.value)} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',background:'#fff'}}>
              <option>ALL NYP ACCOUNTS</option>
              {observedNypOptions.map(x=><option key={x}>{x}</option>)}
            </select>
            <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Enter Date:</label>
            <input type="date" value={summaryDate} onChange={e=>setSummaryDate(e.target.value)} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}} />
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:'9px',marginTop:'18px'}}>
            <button onClick={()=>setSummarySearched(true)} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 20px',fontWeight:'700',cursor:'pointer'}}>Search</button>
            <button onClick={()=>{setSummaryNyp('ALL NYP ACCOUNTS');setSummaryDate('2026-09-30');setSummarySearched(false)}} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}>Clear</button>
          </div>
        </div>
      </div>

      {summarySearched && (
        <div style={{width:'100%',maxWidth:'1100px',margin:'20px auto 0',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',fontWeight:'700',padding:'11px 14px',fontSize:'17px',textAlign:'center'}}>
            {summaryDate}: {summaryNyp} ACCOUNT SUMMARY
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',padding:'14px'}}>
            {[['NYP ID',summaryNyp],['Date',summaryDate],['Status','Summary Found']].map(([label,value])=>(
              <div key={label} style={{background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',padding:'9px 11px'}}>
                <div style={{fontSize:'11px',color:'#6c7c88',fontWeight:'700',marginBottom:'3px'}}>{label}</div>
                <div style={{fontSize:'13px',fontWeight:'700',color:'#1737b6',wordBreak:'break-word'}}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{overflowX:'auto',padding:'0 14px 14px'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',background:'#fff'}}>
              <thead><tr>{['S/N','NYP Name','Supply Amt','Return Amt','Damage Amt','Paid Amt','To Balance'].map(h=><th key={h} style={{...thStyle,textAlign:'center'}}>{h}</th>)}</tr></thead>
              <tbody>{rows.map((r,i)=><tr key={r[0]}><td style={{...tdStyle,textAlign:'center'}}>{i+1}</td>{r.map((v,j)=><td key={j} style={{...tdStyle,textAlign:j===0?'left':'center',color:j===5?'#d11':'#111'}}>{v}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div style={{textAlign:'center',fontWeight:'700',color:'#1737b6',fontSize:'16px',padding:'0 14px 12px'}}>Ground Total: 36,422,015.00</div>
          <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
            <button onClick={()=>setSummarySearched(false)} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Change Search</button>
            <button onClick={()=>window.print()} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
          </div>
        </div>
      )}
    </div>
  )
}

function CompanyAccountPage({ kind='summary', onBack }) {
  const [company, setCompany] = useState('SUPERBRAND GD')
  const [date, setDate] = useState('2026-09-30')
  const [searched, setSearched] = useState(false)
  const [creditorDate, setCreditorDate] = useState('2026-09-30')
  const [creditorSearched, setCreditorSearched] = useState(false)

  const companyName = company === 'SUPERBRAND GD'
    ? 'SUPERBRANDZ GLOBAL DISTRIBUTION'
    : company

  if (kind === 'history') {
    return (
      <div style={{padding:'22px 26px', overflowY:'auto', height:'100%', boxSizing:'border-box'}}>
        <div style={{position:'relative', marginBottom:'18px'}}>
          <div style={{fontSize:'22px',fontWeight:'700',color:'#1737b6'}}>Company Account History</div>
          <div style={{fontSize:'13px',color:'#667788',marginTop:'4px'}}>Search and view the transaction history of a company account.</div>
          <button
            onClick={onBack}
            style={{position:'absolute',right:'0',top:'0',background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
          >
            ← Back
          </button>
        </div>

        <div style={{width:'100%',maxWidth:'760px',margin:'0 auto',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'700',padding:'11px',fontSize:'17px'}}>
            Company Acct History
          </div>

          <div style={{padding:'20px 28px'}}>
            <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'13px 14px',alignItems:'center'}}>
              <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Company ID:</label>
              <select value={company} onChange={e=>{setCompany(e.target.value);setSearched(false)}} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',background:'#fff'}}>
                {observedCompanyOptions.map(x=><option key={x}>{x}</option>)}
              </select>

              <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Enter Date:</label>
              <input type="date" value={date} onChange={e=>{setDate(e.target.value);setSearched(false)}} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}} />
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:'9px',marginTop:'18px'}}>
              <button onClick={()=>setSearched(true)} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 20px',fontWeight:'700',cursor:'pointer'}}>Search</button>
              <button onClick={()=>{setCompany('SUPERBRAND GD');setDate('2026-09-30');setSearched(false)}} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}>Clear</button>
            </div>
          </div>
        </div>

        {searched && (
          <div style={{width:'100%',maxWidth:'1100px',margin:'20px auto 0',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
            <div style={{background:'#1593c8',color:'#fff',fontWeight:'700',padding:'11px 14px',fontSize:'17px',textAlign:'center'}}>
              {companyName}: COMPANY ACCOUNT HISTORY
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',padding:'14px'}}>
              {[
                ['Company ID', company],
                ['Company Name', companyName],
                ['Date', date]
              ].map(([label,value])=>(
                <div key={label} style={{background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',padding:'9px 11px'}}>
                  <div style={{fontSize:'11px',color:'#6c7c88',fontWeight:'700',marginBottom:'3px'}}>{label}</div>
                  <div style={{fontSize:'13px',fontWeight:'700',color:'#1737b6',wordBreak:'break-word'}}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{margin:'0 14px 14px',border:'1px solid #c8d7e1',borderRadius:'5px',background:'#fff',padding:'24px 16px',textAlign:'center'}}>
              <div style={{fontSize:'15px',fontWeight:'700',color:'#244e73',marginBottom:'6px'}}>Company Account History</div>
              <div style={{fontSize:'13px',color:'#667788'}}>No transaction history data is currently available for this company and date.</div>
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
              <button onClick={()=>setSearched(false)} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Change Search</button>
              <button onClick={()=>window.print()} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (kind === 'creditors') {
    return (
      <div style={{padding:'22px 26px', overflowY:'auto', height:'100%', boxSizing:'border-box'}}>
        <div style={{position:'relative', marginBottom:'18px'}}>
          <div style={{fontSize:'22px',fontWeight:'700',color:'#1737b6'}}>All Creditors Report</div>
          <div style={{fontSize:'13px',color:'#667788',marginTop:'4px'}}>Search and view the creditors account status for a selected date.</div>
          <button
            onClick={onBack}
            style={{position:'absolute',right:'0',top:'0',background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
          >
            ← Back
          </button>
        </div>

        <div style={{width:'100%',maxWidth:'760px',margin:'0 auto',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'700',padding:'11px',fontSize:'17px'}}>
            Creditors Account Status
          </div>

          <div style={{padding:'20px 28px'}}>
            <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'13px 14px',alignItems:'center'}}>
              <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Enter Date:</label>
              <input
                type="date"
                value={creditorDate}
                onChange={e=>{setCreditorDate(e.target.value);setCreditorSearched(false)}}
                style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}}
              />
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:'9px',marginTop:'18px'}}>
              <button
                onClick={()=>setCreditorSearched(true)}
                style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 20px',fontWeight:'700',cursor:'pointer'}}
              >
                Search
              </button>
              <button
                onClick={()=>{setCreditorDate('2026-09-30');setCreditorSearched(false)}}
                style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {creditorSearched && (
          <div style={{width:'100%',maxWidth:'760px',margin:'20px auto 0',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
            <div style={{background:'#1593c8',color:'#fff',fontWeight:'700',padding:'11px 14px',fontSize:'17px',textAlign:'center'}}>
              Creditors Account Status
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'10px',padding:'14px'}}>
              {[
                ['Report Date',creditorDate],
                ['Status','Search completed']
              ].map(([label,value])=>(
                <div key={label} style={{background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',padding:'9px 11px'}}>
                  <div style={{fontSize:'11px',color:'#6c7c88',fontWeight:'700',marginBottom:'3px'}}>{label}</div>
                  <div style={{fontSize:'13px',fontWeight:'700',color:'#1737b6',wordBreak:'break-word'}}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{margin:'0 14px 14px',border:'1px solid #c8d7e1',borderRadius:'5px',background:'#fff',padding:'24px 16px',textAlign:'center'}}>
              <div style={{fontSize:'15px',fontWeight:'700',color:'#244e73',marginBottom:'6px'}}>Creditors Account Status</div>
              <div style={{fontSize:'13px',color:'#667788'}}>Sales with such Date does not exist</div>
              <div style={{fontSize:'13px',color:'#667788',marginTop:'5px'}}>Pls try again.</div>
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
              <button onClick={()=>setCreditorSearched(false)} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Change Search</button>
              <button onClick={()=>window.print()} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{padding:'22px 26px', overflowY:'auto', height:'100%', boxSizing:'border-box'}}>
      <div style={{position:'relative', marginBottom:'18px'}}>
        <div style={{fontSize:'22px',fontWeight:'700',color:'#1737b6'}}>All Company Account Summary</div>
        <div style={{fontSize:'13px',color:'#667788',marginTop:'4px'}}>Search and view the account summary for company accounts.</div>
        <button
          onClick={onBack}
          style={{position:'absolute',right:'0',top:'0',background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
        >
          ← Back
        </button>
      </div>

      <div style={{width:'100%',maxWidth:'760px',margin:'0 auto',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'700',padding:'11px',fontSize:'17px'}}>
          All Company Acct Summary
        </div>

        <div style={{padding:'20px 28px'}}>
          <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'13px 14px',alignItems:'center'}}>
            <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Company ID:</label>
            <select
              value={company}
              onChange={e=>{setCompany(e.target.value);setSearched(false)}}
              style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',background:'#fff'}}
            >
              {observedCompanyOptions.map(x=><option key={x}>{x}</option>)}
            </select>

            <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Enter Date:</label>
            <input
              type="date"
              value={date}
              onChange={e=>{setDate(e.target.value);setSearched(false)}}
              style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}}
            />
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:'9px',marginTop:'18px'}}>
            <button
              onClick={()=>setSearched(true)}
              style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 20px',fontWeight:'700',cursor:'pointer'}}
            >
              Search
            </button>
            <button
              onClick={()=>{setCompany('SUPERBRAND GD');setDate('2026-09-30');setSearched(false)}}
              style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{width:'100%',maxWidth:'1100px',margin:'20px auto 0',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',fontWeight:'700',padding:'11px 14px',fontSize:'17px',textAlign:'center'}}>
            {date}: {company} ACCOUNT SUMMARY
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',padding:'14px'}}>
            {[
              ['Company ID',company],
              ['Company Name',companyName],
              ['Date',date]
            ].map(([label,value])=>(
              <div key={label} style={{background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',padding:'9px 11px'}}>
                <div style={{fontSize:'11px',color:'#6c7c88',fontWeight:'700',marginBottom:'3px'}}>{label}</div>
                <div style={{fontSize:'13px',fontWeight:'700',color:'#1737b6',wordBreak:'break-word'}}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{overflowX:'auto',padding:'0 14px 14px'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',background:'#fff'}}>
              <thead>
                <tr>
                  {['S/N','Company ID','Company Name','Total Supply Amt','Total Paid Amt','Total Balance'].map(h=>(
                    <th key={h} style={{...thStyle,textAlign:'center'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{...tdStyle,textAlign:'center'}}>1</td>
                  <td style={tdStyle}>SUPERBRAND GD</td>
                  <td style={tdStyle}>SUPERBRANDZ GLOBAL DISTRIBUTION</td>
                  <td style={{...tdStyle,textAlign:'right'}}>565,650.00</td>
                  <td style={{...tdStyle,textAlign:'right'}}>0.00</td>
                  <td style={{...tdStyle,textAlign:'right',color:'#d11',fontWeight:'bold'}}>565,650.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{textAlign:'center',fontWeight:'700',color:'#1737b6',fontSize:'16px',padding:'0 14px 12px'}}>
            Ground Total: 565,650.00
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
            <button
              onClick={()=>setSearched(false)}
              style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
            >
              Change Search
            </button>
            <button
              onClick={()=>window.print()}
              style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
            >
              Send To Printer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function BankAnalysisPage({ kind='activity', onBack }) {
  const [bankFirstDate, setBankFirstDate] = useState('2026-09-17')
  const [bankLastDate, setBankLastDate] = useState('2026-09-25')
  const [bankId, setBankId] = useState('All Bank')
  const [bankSearched, setBankSearched] = useState(false)

  if (kind === 'activity') {
    return (
      <div style={{padding:'22px 26px', overflowY:'auto', height:'100%', boxSizing:'border-box'}}>
        <div style={{position:'relative', marginBottom:'18px'}}>
          <div style={{fontSize:'22px',fontWeight:'700',color:'#1737b6'}}>Bank Activity Report</div>
          <div style={{fontSize:'13px',color:'#667788',marginTop:'4px'}}>Search and view bank activity for a selected date range and bank.</div>
          <button
            onClick={onBack}
            style={{position:'absolute',right:'0',top:'0',background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
          >
            ← Back
          </button>
        </div>

        <div style={{width:'100%',maxWidth:'760px',margin:'0 auto',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'700',padding:'11px',fontSize:'17px'}}>
            Bank Activity Report
          </div>

          <div style={{padding:'20px 28px'}}>
            <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'13px 14px',alignItems:'center'}}>
              <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>First Date:</label>
              <input type="date" value={bankFirstDate} onChange={e=>{setBankFirstDate(e.target.value);setBankSearched(false)}} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}} />

              <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Last Date:</label>
              <input type="date" value={bankLastDate} onChange={e=>{setBankLastDate(e.target.value);setBankSearched(false)}} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}} />

              <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>BANK ID:</label>
              <select value={bankId} onChange={e=>{setBankId(e.target.value);setBankSearched(false)}} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box',background:'#fff'}}>
                {observedBankOptions.map(option=><option key={option} value={option}>{option}</option>)}
              </select>
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:'9px',marginTop:'18px'}}>
              <button onClick={()=>setBankSearched(true)} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 20px',fontWeight:'700',cursor:'pointer'}}>Search</button>
              <button onClick={()=>{setBankFirstDate('2026-09-17');setBankLastDate('2026-09-25');setBankId('All Bank');setBankSearched(false)}} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}>Clear</button>
            </div>
          </div>
        </div>

        {bankSearched && (
          <div style={{width:'100%',maxWidth:'900px',margin:'20px auto 0',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
            <div style={{background:'#1593c8',color:'#fff',fontWeight:'700',padding:'11px 14px',fontSize:'17px',textAlign:'center'}}>
              Bank Activity Report
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',padding:'14px'}}>
              {[['First Date',bankFirstDate],['Last Date',bankLastDate],['Bank ID',bankId]].map(([label,value])=>(
                <div key={label} style={{background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',padding:'9px 11px'}}>
                  <div style={{fontSize:'11px',color:'#6c7c88',fontWeight:'700',marginBottom:'3px'}}>{label}</div>
                  <div style={{fontSize:'13px',fontWeight:'700',color:'#1737b6',wordBreak:'break-word'}}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{margin:'0 14px 14px',border:'1px solid #c8d7e1',borderRadius:'5px',background:'#fff',padding:'24px 16px',textAlign:'center'}}>
              <div style={{fontSize:'15px',fontWeight:'700',color:'#244e73',marginBottom:'6px'}}>Bank Activity</div>
              <div style={{fontSize:'13px',color:'#667788'}}>No bank activity data is displayed for the selected criteria.</div>
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
              <button onClick={()=>setBankSearched(false)} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Change Search</button>
              <button onClick={()=>window.print()} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{padding:'22px 26px', overflowY:'auto', height:'100%', boxSizing:'border-box'}}>
      <div style={{position:'relative', marginBottom:'18px'}}>
        <div style={{fontSize:'22px',fontWeight:'700',color:'#1737b6'}}>Bank Statement Report</div>
        <div style={{fontSize:'13px',color:'#667788',marginTop:'4px'}}>Search and view a bank statement for a selected date range and bank.</div>
        <button
          onClick={onBack}
          style={{position:'absolute',right:'0',top:'0',background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
        >
          ← Back
        </button>
      </div>

      <div style={{width:'100%',maxWidth:'760px',margin:'0 auto',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'700',padding:'11px',fontSize:'17px'}}>
          Bank Statement Report
        </div>

        <div style={{padding:'20px 28px'}}>
          <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'13px 14px',alignItems:'center'}}>
            <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>First Date:</label>
            <input type="date" value={bankFirstDate} onChange={e=>{setBankFirstDate(e.target.value);setBankSearched(false)}} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}} />

            <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Last Date:</label>
            <input type="date" value={bankLastDate} onChange={e=>{setBankLastDate(e.target.value);setBankSearched(false)}} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}} />

            <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>BANK ID:</label>
            <select value={bankId} onChange={e=>{setBankId(e.target.value);setBankSearched(false)}} style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box',background:'#fff'}}>
              {observedBankOptions.map(option=><option key={option} value={option}>{option}</option>)}
            </select>
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:'9px',marginTop:'18px'}}>
            <button onClick={()=>setBankSearched(true)} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 20px',fontWeight:'700',cursor:'pointer'}}>Search</button>
            <button onClick={()=>{setBankFirstDate('2026-09-17');setBankLastDate('2026-09-25');setBankId('All Bank');setBankSearched(false)}} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}>Clear</button>
          </div>
        </div>
      </div>

      {bankSearched && (
        <div style={{width:'100%',maxWidth:'1000px',margin:'20px auto 0',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',fontWeight:'700',padding:'11px 14px',fontSize:'17px',textAlign:'center'}}>
            {bankFirstDate} TO {bankLastDate}: {bankId} BANK STATEMENT
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',padding:'14px'}}>
            {[['First Date',bankFirstDate],['Last Date',bankLastDate],['Bank ID',bankId]].map(([label,value])=>(
              <div key={label} style={{background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',padding:'9px 11px'}}>
                <div style={{fontSize:'11px',color:'#6c7c88',fontWeight:'700',marginBottom:'3px'}}>{label}</div>
                <div style={{fontSize:'13px',fontWeight:'700',color:'#1737b6',wordBreak:'break-word'}}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{margin:'0 14px 14px',border:'1px solid #c8d7e1',borderRadius:'5px',background:'#fff',overflowX:'auto'}}>
            <table style={{width:'100%',minWidth:'760px',borderCollapse:'collapse',fontSize:'12px'}}>
              <thead>
                <tr>
                  {['S/N','Date','Description','Reference','Debit','Credit','Balance'].map(h=><th key={h} style={{...thStyle,textAlign:'center',padding:'7px 6px'}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{...tdStyle,textAlign:'center'}}>1</td>
                  <td style={tdStyle}>2026-09-25</td>
                  <td style={tdStyle}>No bank statement transaction data displayed.</td>
                  <td style={tdStyle}>—</td>
                  <td style={{...tdStyle,textAlign:'right'}}>0.00</td>
                  <td style={{...tdStyle,textAlign:'right'}}>0.00</td>
                  <td style={{...tdStyle,textAlign:'right'}}>0.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
            <button onClick={()=>setBankSearched(false)} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Change Search</button>
            <button onClick={()=>window.print()} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
          </div>
        </div>
      )}
    </div>
  )
}


function AllBankingReport({ onBack }) {
  const [reportType, setReportType] = useState('24hrs')
  const [date, setDate] = useState('2026-10-03')
  const [month, setMonth] = useState('October')
  const [year, setYear] = useState('2026')
  const [firstDate, setFirstDate] = useState('2026-09-17')
  const [lastDate, setLastDate] = useState('2026-09-25')
  const [bankId, setBankId] = useState('All Bank')
  const [searched, setSearched] = useState(false)

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const years = ['2024','2025','2026','2027']

  const reportTitles = {
    '24hrs': '24hrs Lodgement Report',
    monthly: 'Monthly Lodgement Report',
    yearly: 'Yearly Lodgement Report',
    statement: 'Statement of Account By Bank'
  }

  const resetSearch = () => {
    setReportType('24hrs')
    setDate('2026-10-03')
    setMonth('October')
    setYear('2026')
    setFirstDate('2026-09-17')
    setLastDate('2026-09-25')
    setBankId('All Bank')
    setSearched(false)
  }

  const periodLabel = reportType === '24hrs'
    ? date
    : reportType === 'monthly'
      ? `${month} ${year}`
      : reportType === 'yearly'
        ? year
        : `${firstDate} to ${lastDate}`

  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        gap:'12px',
        marginBottom:'12px'
      }}>
        <div>
          <div style={{ color:'#173f63', fontWeight:'800', fontSize:'22px', letterSpacing:'.2px' }}>
            All Banking Report
          </div>
          <div style={{ color:'#66788a', fontSize:'13px', marginTop:'4px' }}>
            View bank lodgement summaries and bank account statements by reporting period.
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border:'1px solid #cbd7e2',
            background:'#fff',
            color:'#244e73',
            borderRadius:'6px',
            padding:'7px 12px',
            fontWeight:'700',
            cursor:'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth:'820px',
        margin:'0 auto',
        border:'1px solid #168bbd',
        borderRadius:'8px',
        background:'#f5fff5',
        boxShadow:'0 2px 8px rgba(22, 61, 91, .08)',
        overflow:'hidden'
      }}>
        <div style={{
          background:'#1593c8',
          color:'#fff',
          fontWeight:'800',
          textAlign:'center',
          padding:'11px 14px',
          fontSize:'17px'
        }}>
          BANK LODGEMENT REPORT
        </div>

        <div style={{ padding:'16px 18px 18px' }}>
          <div style={{
            display:'flex',
            flexWrap:'wrap',
            justifyContent:'center',
            gap:'8px',
            marginBottom:'16px'
          }}>
            {[
              ['24hrs','24hrs Lodgement'],
              ['monthly','Monthly Lodgement'],
              ['yearly','Yearly Lodgement'],
              ['statement','Statement By Bank']
            ].map(([value,label]) => (
              <button
                key={value}
                onClick={() => { setReportType(value); setSearched(false) }}
                style={{
                  background:reportType === value ? '#1593c8' : '#fff',
                  color:reportType === value ? '#fff' : '#1683b5',
                  border:'1px solid #168bbd',
                  borderRadius:'5px',
                  padding:'7px 12px',
                  fontWeight:'700',
                  cursor:'pointer'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {reportType === '24hrs' && (
            <div style={{ display:'grid', gridTemplateColumns:'150px minmax(220px, 1fr)', gap:'12px 14px', alignItems:'center', maxWidth:'620px', margin:'0 auto' }}>
              <label style={{ color:'#244e73', fontWeight:'700', textAlign:'right' }}>Enter Date:</label>
              <input
                type="date"
                value={date}
                onChange={e => { setDate(e.target.value); setSearched(false) }}
                style={{ height:'36px', width:'100%', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }}
              />
            </div>
          )}

          {reportType === 'monthly' && (
            <div style={{ display:'grid', gridTemplateColumns:'150px minmax(120px, 1fr)', gap:'12px 14px', alignItems:'center', maxWidth:'620px', margin:'0 auto' }}>
              <label style={{ color:'#244e73', fontWeight:'700', textAlign:'right' }}>Month / Year:</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 110px', gap:'8px' }}>
                <select value={month} onChange={e => { setMonth(e.target.value); setSearched(false) }} style={{ height:'36px', border:'1px solid #9fb4c5', borderRadius:'4px', background:'#fff', padding:'0 8px' }}>
                  {months.map(item => <option key={item}>{item}</option>)}
                </select>
                <select value={year} onChange={e => { setYear(e.target.value); setSearched(false) }} style={{ height:'36px', border:'1px solid #9fb4c5', borderRadius:'4px', background:'#fff', padding:'0 8px' }}>
                  {years.map(item => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>
          )}

          {reportType === 'yearly' && (
            <div style={{ display:'grid', gridTemplateColumns:'150px minmax(120px, 1fr)', gap:'12px 14px', alignItems:'center', maxWidth:'620px', margin:'0 auto' }}>
              <label style={{ color:'#244e73', fontWeight:'700', textAlign:'right' }}>Enter Year:</label>
              <select value={year} onChange={e => { setYear(e.target.value); setSearched(false) }} style={{ height:'36px', width:'100%', border:'1px solid #9fb4c5', borderRadius:'4px', background:'#fff', padding:'0 8px' }}>
                {years.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
          )}

          {reportType === 'statement' && (
            <div style={{ display:'grid', gridTemplateColumns:'150px minmax(220px, 1fr)', gap:'12px 14px', alignItems:'center', maxWidth:'620px', margin:'0 auto' }}>
              <label style={{ color:'#244e73', fontWeight:'700', textAlign:'right' }}>First Date:</label>
              <input type="date" value={firstDate} onChange={e => { setFirstDate(e.target.value); setSearched(false) }} style={{ height:'36px', width:'100%', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }} />
              <label style={{ color:'#244e73', fontWeight:'700', textAlign:'right' }}>Last Date:</label>
              <input type="date" value={lastDate} onChange={e => { setLastDate(e.target.value); setSearched(false) }} style={{ height:'36px', width:'100%', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', padding:'0 9px', background:'#fff' }} />
              <label style={{ color:'#244e73', fontWeight:'700', textAlign:'right' }}>BANK ID:</label>
              <select value={bankId} onChange={e => { setBankId(e.target.value); setSearched(false) }} style={{ height:'36px', width:'100%', border:'1px solid #9fb4c5', borderRadius:'4px', background:'#fff', padding:'0 8px' }}>
                {observedBankOptions.map(option => <option key={option}>{option}</option>)}
              </select>
            </div>
          )}

          <div style={{ display:'flex', justifyContent:'center', gap:'9px', marginTop:'18px' }}>
            <button
              onClick={() => setSearched(true)}
              style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'5px', padding:'8px 20px', fontWeight:'700', cursor:'pointer' }}
            >
              Search
            </button>
            <button
              onClick={resetSearch}
              style={{ background:'#fff', color:'#1683b5', border:'1px solid #168bbd', borderRadius:'5px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          width:'100%',
          maxWidth:'1050px',
          margin:'20px auto 0',
          border:'1px solid #168bbd',
          borderRadius:'8px',
          background:'#f5fff5',
          boxShadow:'0 2px 8px rgba(22, 61, 91, .08)',
          overflow:'hidden'
        }}>
          <div style={{ background:'#1593c8', color:'#fff', fontWeight:'800', textAlign:'center', padding:'11px 14px', fontSize:'16px' }}>
            {reportTitles[reportType]}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:'10px', padding:'14px' }}>
            {[
              ['Report Type', reportTitles[reportType]],
              ['Period', periodLabel],
              ['Status', 'Ready for backend data']
            ].map(([label,value]) => (
              <div key={label} style={{ background:'#fff', border:'1px solid #c8d7e1', borderRadius:'5px', padding:'10px 12px' }}>
                <div style={{ color:'#718394', fontSize:'11px', fontWeight:'700', marginBottom:'3px' }}>{label}</div>
                <div style={{ color:'#244e73', fontSize:'13px', fontWeight:'800', wordBreak:'break-word' }}>{value}</div>
              </div>
            ))}
          </div>

          {reportType === 'statement' ? (
            <div style={{ margin:'0 14px 14px', border:'1px solid #c8d7e1', borderRadius:'5px', background:'#fff', overflowX:'auto' }}>
              <table style={{ width:'100%', minWidth:'760px', borderCollapse:'collapse', fontSize:'12px' }}>
                <thead>
                  <tr>
                    {['S/N','Date','Description','Reference','Debit','Credit','Balance'].map(h => (
                      <th key={h} style={{ background:'#1593c8', color:'#fff', border:'1px solid #168bbd', padding:'7px 8px', textAlign:h === 'Date' || h === 'Description' || h === 'Reference' ? 'left' : 'right', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="7" style={{ border:'1px solid #c8d7e1', padding:'16px', textAlign:'center', color:'#667788' }}>
                      No bank statement transaction records are currently connected to this report. Real statement entries will be loaded when the backend is connected.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ margin:'0 14px 14px', border:'1px solid #c8d7e1', borderRadius:'5px', background:'#fff', overflowX:'auto' }}>
              <table style={{ width:'100%', minWidth:'720px', borderCollapse:'collapse', fontSize:'12px' }}>
                <thead>
                  <tr>
                    {['S/N','Date','Reference No','Description','Bank','Amount'].map(h => (
                      <th key={h} style={{ background:'#1593c8', color:'#fff', border:'1px solid #168bbd', padding:'7px 8px', textAlign:h === 'Amount' ? 'right' : 'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="6" style={{ border:'1px solid #c8d7e1', padding:'16px', textAlign:'center', color:'#667788' }}>
                      No bank lodgement transaction records are currently connected to this report. Real lodgement records will be loaded when the backend is connected.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div style={{ margin:'0 14px 14px', padding:'10px 12px', background:'#fff', border:'1px solid #c8d7e1', borderRadius:'5px', fontSize:'12px', color:'#667788' }}>
            The original Banking Report provides 24hrs, monthly and yearly lodgement reports, plus a statement of account by bank. This modern screen preserves those reporting choices while leaving transaction values to the backend.
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:'9px', padding:'0 14px 16px' }}>
            <button onClick={() => setSearched(false)} style={{ background:'#fff', color:'#1683b5', border:'1px solid #168bbd', borderRadius:'5px', padding:'7px 15px', fontWeight:'700', cursor:'pointer' }}>
              Change Search
            </button>
            <button onClick={() => window.print()} style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'5px', padding:'7px 15px', fontWeight:'700', cursor:'pointer' }}>
              Send To Printer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


function AdminCodePage({ onBack }) {
  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        gap:'12px',
        marginBottom:'12px'
      }}>
        <div>
          <div style={{ color:'#173f63', fontWeight:'800', fontSize:'22px', letterSpacing:'.2px' }}>
            Admin Code
          </div>
          <div style={{ color:'#66788a', fontSize:'13px', marginTop:'4px' }}>
            Recover or verify the administrator access code.
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border:'1px solid #cbd7e2',
            background:'#fff',
            color:'#244e73',
            borderRadius:'6px',
            padding:'7px 12px',
            fontWeight:'700',
            cursor:'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        width:'100%',
        maxWidth:'760px',
        margin:'0 auto',
        border:'1px solid #168bbd',
        borderRadius:'8px',
        background:'#f5fff5',
        boxShadow:'0 3px 10px rgba(22,61,91,.08)',
        overflow:'hidden'
      }}>
        <div style={{
          background:'#1593c8',
          color:'#fff',
          textAlign:'center',
          fontWeight:'800',
          padding:'11px 14px',
          fontSize:'17px'
        }}>
          ADMIN CODE RECOVERY
        </div>

        <div style={{ padding:'22px 28px' }}>
          <div style={{
            maxWidth:'600px',
            margin:'0 auto',
            display:'grid',
            gridTemplateColumns:'150px 1fr',
            gap:'14px 16px',
            alignItems:'center'
          }}>
            <label style={{ fontWeight:'700', color:'#1683b5', textAlign:'right' }}>
              Admin ID:
            </label>
            <input
              type="text"
              placeholder="Enter Admin ID"
              style={{
                width:'100%',
                height:'36px',
                boxSizing:'border-box',
                border:'1px solid #9fb4c5',
                borderRadius:'4px',
                background:'#fff',
                padding:'7px 9px',
                outline:'none'
              }}
            />

            <label style={{ fontWeight:'700', color:'#1683b5', textAlign:'right' }}>
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              style={{
                width:'100%',
                height:'36px',
                boxSizing:'border-box',
                border:'1px solid #9fb4c5',
                borderRadius:'4px',
                background:'#fff',
                padding:'7px 9px',
                outline:'none'
              }}
            />
          </div>

          <div style={{
            display:'flex',
            justifyContent:'center',
            gap:'9px',
            marginTop:'20px'
          }}>
            <button
              style={{
                background:'#1593c8',
                color:'#fff',
                border:'none',
                borderRadius:'5px',
                padding:'8px 20px',
                fontWeight:'700',
                cursor:'pointer'
              }}
            >
              Search
            </button>
            <button
              onClick={onBack}
              style={{
                background:'#fff',
                color:'#1683b5',
                border:'1px solid #168bbd',
                borderRadius:'5px',
                padding:'8px 18px',
                fontWeight:'700',
                cursor:'pointer'
              }}
            >
              Cancel
            </button>
          </div>

          <div style={{
            marginTop:'16px',
            textAlign:'center',
            color:'#66788a',
            fontSize:'12px'
          }}>
            Admin code recovery will be connected to the backend during the authentication implementation.
          </div>
        </div>
      </div>
    </div>
  )
}


function AllExternalCashPayInReport({ onBack }) {
  const [reportDate, setReportDate] = useState('2026-10-03')
  const [searched, setSearched] = useState(false)

  const resetSearch = () => {
    setReportDate('2026-10-03')
    setSearched(false)
  }

  return (
    <div style={{padding:'22px 26px',overflowY:'auto',height:'100%',boxSizing:'border-box'}}>
      <div style={{position:'relative',marginBottom:'18px'}}>
        <div style={{fontSize:'22px',fontWeight:'700',color:'#1737b6'}}>All External Cash Pay-IN Report</div>
        <div style={{fontSize:'13px',color:'#667788',marginTop:'4px'}}>
          Search and view the external cash pay-in summary for a selected date.
        </div>
        <button
          onClick={onBack}
          style={{position:'absolute',right:'0',top:'0',background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
        >
          ← Back
        </button>
      </div>

      <div style={{width:'100%',maxWidth:'760px',margin:'0 auto',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'700',padding:'11px',fontSize:'17px'}}>
          24hrs External Cash Pay-IN Summary
        </div>

        <div style={{padding:'20px 28px'}}>
          <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'13px 14px',alignItems:'center'}}>
            <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Enter Date:</label>
            <input
              type="date"
              value={reportDate}
              onChange={e=>{setReportDate(e.target.value);setSearched(false)}}
              style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}}
            />
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:'9px',marginTop:'18px'}}>
            <button
              onClick={()=>setSearched(true)}
              style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 20px',fontWeight:'700',cursor:'pointer'}}
            >
              Search
            </button>
            <button
              onClick={resetSearch}
              style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{width:'100%',maxWidth:'1000px',margin:'20px auto 0',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',fontWeight:'700',padding:'11px 14px',fontSize:'17px',textAlign:'center'}}>
            {reportDate}: EXTERNAL CASH PAY-IN SUMMARY
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',padding:'14px'}}>
            {[
              ['Report Date',reportDate],
              ['Report Type','24hrs External Cash Pay-IN'],
              ['Status','Report Ready']
            ].map(([label,value])=>(
              <div key={label} style={{background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',padding:'9px 11px'}}>
                <div style={{fontSize:'11px',color:'#6c7c88',fontWeight:'700',marginBottom:'3px'}}>{label}</div>
                <div style={{fontSize:'13px',fontWeight:'700',color:'#1737b6',wordBreak:'break-word'}}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{margin:'0 14px 14px',border:'1px solid #c8d7e1',borderRadius:'5px',background:'#fff',padding:'26px 16px',textAlign:'center'}}>
            <div style={{fontSize:'15px',fontWeight:'700',color:'#244e73',marginBottom:'7px'}}>External Cash Pay-IN Summary</div>
            <div style={{fontSize:'13px',color:'#667788',lineHeight:'1.55'}}>
              No real external cash pay-in records are available to display yet. This report will use the external cash pay-in ledger when the backend is connected.
            </div>
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
            <button
              onClick={()=>setSearched(false)}
              style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
            >
              Change Search
            </button>
            <button
              onClick={()=>window.print()}
              style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
            >
              Send To Printer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AllExpensesReport({ onBack }) {
  const [reportDate, setReportDate] = React.useState('2026-10-03')
  const [searched, setSearched] = React.useState(false)

  const resetSearch = () => {
    setReportDate('2026-10-03')
    setSearched(false)
  }

  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'12px'}}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>
            All Expenses Report
          </div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>
            Search and view expenses summary records for a selected date.
          </div>
        </div>
        <button
          onClick={onBack}
          style={{border:'1px solid #cbd7e2',background:'#fff',color:'#244e73',borderRadius:'6px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}
        >
          ← Back
        </button>
      </div>

      <div style={{maxWidth:'760px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22,61,91,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'800',padding:'11px 14px',fontSize:'17px'}}>
          24hrs Expenses Summary
        </div>

        <div style={{padding:'20px 28px'}}>
          <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'13px 14px',alignItems:'center'}}>
            <label style={{fontWeight:'700',color:'#1683b5',textAlign:'right'}}>Enter Date:</label>
            <input
              type="date"
              value={reportDate}
              onChange={e=>{setReportDate(e.target.value);setSearched(false)}}
              style={{height:'34px',width:'100%',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 9px',boxSizing:'border-box'}}
            />
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:'9px',marginTop:'18px'}}>
            <button
              onClick={()=>setSearched(true)}
              style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 20px',fontWeight:'700',cursor:'pointer'}}
            >
              Search
            </button>
            <button
              onClick={resetSearch}
              style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{width:'100%',maxWidth:'1100px',margin:'20px auto 0',background:'#f5fff5',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',fontWeight:'700',padding:'11px 14px',fontSize:'17px',textAlign:'center'}}>
            {reportDate}: EXPENSES SUMMARY REPORT
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',padding:'14px'}}>
            {[
              ['Report Date',reportDate],
              ['Report Type','24hrs Expenses Summary'],
              ['Status','Report Ready']
            ].map(([label,value])=>(
              <div key={label} style={{background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',padding:'9px 11px'}}>
                <div style={{fontSize:'11px',color:'#6c7c88',fontWeight:'700',marginBottom:'3px'}}>{label}</div>
                <div style={{fontSize:'13px',fontWeight:'700',color:'#1737b6',wordBreak:'break-word'}}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{overflowX:'auto',margin:'0 14px 14px',border:'1px solid #c8d7e1',borderRadius:'5px',background:'#fff'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'720px'}}>
              <thead>
                <tr>
                  {['S/N','Ref No','Receiver','Purpose','Paid Amt'].map(h=>(
                    <th key={h} style={{...thStyle,background:'#eaf5fb',color:'#173f63',fontWeight:'800',padding:'9px 8px',borderBottom:'1px solid #c8d7e1'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>1</td>
                  <td style={tdStyle}>ex1269e</td>
                  <td style={tdStyle}>CUSTOMER</td>
                  <td style={tdStyle}>POS EXCESS</td>
                  <td style={{...tdStyle,color:'#d11',fontWeight:'700',textAlign:'right'}}>1,350.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{display:'flex',justifyContent:'flex-end',padding:'0 16px 12px',fontWeight:'800',color:'#244e73'}}>
            TOTAL AMT: <span style={{color:'#d11',marginLeft:'6px'}}>1,350.00</span>
          </div>

          <div style={{margin:'0 14px 14px',padding:'10px 12px',background:'#fff',border:'1px solid #c8d7e1',borderRadius:'5px',fontSize:'12px',color:'#667788'}}>
            The displayed row is preserved from the existing report data. Additional expense records will come from the backend when this report is connected.
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
            <button
              onClick={()=>setSearched(false)}
              style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
            >
              Change Search
            </button>
            <button
              onClick={()=>window.print()}
              style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
            >
              Send To Printer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AllCashDepositReport({ onBack }) {
  const [reportType, setReportType] = useState('24hrs')
  const [date, setDate] = useState('2026-10-03')
  const [month, setMonth] = useState('October')
  const [year, setYear] = useState('2026')
  const [searched, setSearched] = useState(false)

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const reportTitles = {
    '24hrs': '24hrs Cash Deposit Summary',
    weekly: 'Weekly Cash Deposit Summary Report',
    monthly: 'Monthly Cash Deposit Summary Report',
    yearly: 'Yearly Cash Deposit Summary Report'
  }

  const handleSearch = () => setSearched(true)

  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        gap:'12px',
        marginBottom:'12px'
      }}>
        <div>
          <div style={{ color:'#173f63', fontWeight:'800', fontSize:'18px', letterSpacing:'.2px' }}>
            All Cash Deposit Report
          </div>
          <div style={{ color:'#66788a', fontSize:'12px', marginTop:'3px' }}>
            Search and view cash deposit summary reports by reporting period.
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border:'1px solid #cbd7e2',
            background:'#fff',
            color:'#244e73',
            borderRadius:'6px',
            padding:'7px 12px',
            fontWeight:'700',
            cursor:'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth:'760px',
        margin:'0 auto',
        border:'1px solid #168bbd',
        borderRadius:'8px',
        background:'#f5fff5',
        boxShadow:'0 2px 8px rgba(22, 61, 91, .08)',
        overflow:'hidden'
      }}>
        <div style={{
          background:'#1593c8',
          color:'#fff',
          textAlign:'center',
          fontWeight:'800',
          padding:'11px 14px',
          fontSize:'17px'
        }}>
          {reportTitles[reportType]}
        </div>

        <div style={{ padding:'16px 18px' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'7px', justifyContent:'center', marginBottom:'16px' }}>
            {[
              ['24hrs','24hrs'],
              ['weekly','Weekly'],
              ['monthly','Monthly'],
              ['yearly','Yearly']
            ].map(([value,label]) => (
              <button
                key={value}
                onClick={() => { setReportType(value); setSearched(false) }}
                style={{
                  border: reportType === value ? '1px solid #168bbd' : '1px solid #b8c9d6',
                  background: reportType === value ? '#1593c8' : '#fff',
                  color: reportType === value ? '#fff' : '#244e73',
                  borderRadius:'5px',
                  padding:'7px 12px',
                  fontWeight:'700',
                  cursor:'pointer'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{
            display:'grid',
            gridTemplateColumns:'150px minmax(180px, 320px)',
            justifyContent:'center',
            alignItems:'center',
            gap:'10px 12px'
          }}>
            {reportType === '24hrs' && (
              <>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px', textAlign:'right' }}>Enter Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => { setDate(e.target.value); setSearched(false) }}
                  style={{ height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', background:'#fff', padding:'7px 9px' }}
                />
              </>
            )}

            {reportType === 'weekly' && (
              <>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px', textAlign:'right' }}>Week Ending:</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => { setDate(e.target.value); setSearched(false) }}
                  style={{ height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', background:'#fff', padding:'7px 9px' }}
                />
              </>
            )}

            {reportType === 'monthly' && (
              <>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px', textAlign:'right' }}>Month:</label>
                <select
                  value={month}
                  onChange={e => { setMonth(e.target.value); setSearched(false) }}
                  style={{ height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', background:'#fff', padding:'7px 9px' }}
                >
                  {months.map(m => <option key={m}>{m}</option>)}
                </select>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px', textAlign:'right' }}>Year:</label>
                <select
                  value={year}
                  onChange={e => { setYear(e.target.value); setSearched(false) }}
                  style={{ height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', background:'#fff', padding:'7px 9px' }}
                >
                  {['2024','2025','2026'].map(y => <option key={y}>{y}</option>)}
                </select>
              </>
            )}

            {reportType === 'yearly' && (
              <>
                <label style={{ color:'#244e73', fontWeight:'700', fontSize:'13px', textAlign:'right' }}>Year:</label>
                <select
                  value={year}
                  onChange={e => { setYear(e.target.value); setSearched(false) }}
                  style={{ height:'38px', boxSizing:'border-box', border:'1px solid #9fb4c5', borderRadius:'4px', background:'#fff', padding:'7px 9px' }}
                >
                  {['2024','2025','2026'].map(y => <option key={y}>{y}</option>)}
                </select>
              </>
            )}
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:'9px', marginTop:'18px' }}>
            <button
              onClick={handleSearch}
              style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'5px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}
            >
              Search
            </button>
            <button
              onClick={() => { setReportType('24hrs'); setDate('2026-10-03'); setMonth('October'); setYear('2026'); setSearched(false) }}
              style={{ background:'#fff', color:'#1683b5', border:'1px solid #168bbd', borderRadius:'5px', padding:'8px 18px', fontWeight:'700', cursor:'pointer' }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          maxWidth:'1100px',
          margin:'16px auto 0',
          border:'1px solid #168bbd',
          borderRadius:'8px',
          background:'#f5fff5',
          boxShadow:'0 2px 8px rgba(22, 61, 91, .08)',
          overflow:'hidden'
        }}>
          <div style={{ background:'#1593c8', color:'#fff', fontWeight:'800', textAlign:'center', padding:'11px 14px', fontSize:'16px' }}>
            {reportTitles[reportType]}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:'10px', padding:'14px' }}>
            {[
              ['Report Type', reportType === '24hrs' ? '24hrs' : reportType.charAt(0).toUpperCase()+reportType.slice(1)],
              ['Period', reportType === '24hrs' || reportType === 'weekly' ? date : `${month} ${year}`],
              ['Status', 'Ready for backend data']
            ].map(([label,value]) => (
              <div key={label} style={{ background:'#fff', border:'1px solid #c8d7e1', borderRadius:'5px', padding:'10px 12px' }}>
                <div style={{ color:'#718394', fontSize:'11px', fontWeight:'700', marginBottom:'3px' }}>{label}</div>
                <div style={{ color:'#244e73', fontSize:'13px', fontWeight:'800' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ margin:'0 14px 14px', border:'1px solid #168bbd', borderRadius:'5px', overflow:'auto', background:'#fff' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px', minWidth:'700px' }}>
              <thead>
                <tr>
                  {['S/N','Date','Reference No','Description','Amount'].map(h => (
                    <th key={h} style={{ background:'#1593c8', color:'#fff', border:'1px solid #168bbd', padding:'7px 8px', textAlign:h === 'Amount' ? 'right' : 'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" style={{ border:'1px solid #168bbd', padding:'16px', textAlign:'center', color:'#667788' }}>
                    No Cash Deposit transaction records are currently connected to this report. The existing screen displayed a no-record message for the selected period. Real deposit records will be loaded when the backend is connected.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ margin:'0 14px 14px', padding:'10px 12px', background:'#fff', border:'1px solid #c8d7e1', borderRadius:'5px', fontSize:'12px', color:'#667788' }}>
            The original report offers 24hrs, weekly, monthly and yearly Cash Deposit Summary views. This modern screen keeps those reporting options while leaving transaction values to the backend.
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:'9px', padding:'0 14px 16px' }}>
            <button
              onClick={() => setSearched(false)}
              style={{ background:'#fff', color:'#1683b5', border:'1px solid #168bbd', borderRadius:'5px', padding:'7px 15px', fontWeight:'700', cursor:'pointer' }}
            >
              Change Search
            </button>
            <button
              onClick={() => window.print()}
              style={{ background:'#1593c8', color:'#fff', border:'none', borderRadius:'5px', padding:'7px 15px', fontWeight:'700', cursor:'pointer' }}
            >
              Send To Printer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MdCeoPage({ kind='expenses', onBack }) {
  const links = ['24hrs Expenses Summary Report','Weekly Expenses Summary Report','Monthly Expenses Summary Report','Yearly Expenses Summary Report']
  if (kind === 'banking') {
    return <ReportShell screenTitle="BANK LODGEMENT SCREEN" links={['24hrs Lodgement Report','Monthly Lodgement Report','Yearly Lodgement Report','Statement of Account By Bank']}>
      <ReportForm title="Monthly Lodgement Report" fields={[{name:'month',label:'Month',type:'select',value:'April',options:['January','February','March','April','May','June','July','August','September','October','November','December']},{name:'year',label:'Year',type:'select',value:'2025',options:['2024','2025','2026']}]}/>
    </ReportShell>
  }

  const titles = {
    user: 'LOGIN INFO REGISTRATION',
    code: 'ADMIN CODE',
    cashstatus: '24hrs CashSales-Payment Status',
    external: 'ALL EXTERNAL CASH PAY-IN REPORT',
    expenses: 'Expenses Summary Report',
    deposit: 'Cash Deposit Summary Report',
    banking: 'Banking Report',
    acctanalysis: 'Account Status Analysis',
    acctsummary: 'Account Status Summary',
    allacct: 'All Account Status Summary'
  }

  if (kind === 'user') {
    const fields = [
      ['User ID', ''],
      ['Password', ''],
      ['Pass Hint', ''],
      ['Position', 'User'],
      ['Phone No', ''],
      ['Office Status', 'Sales']
    ]

    return (
      <div style={{ minHeight: '100%', position: 'relative' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <div>
            <div style={{ color: '#173f63', fontWeight: '800', fontSize: '18px', letterSpacing: '.2px' }}>
              Admin User
            </div>
            <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
              Register and maintain administrator login information.
            </div>
          </div>

          <button
            onClick={onBack}
            style={{
              border: '1px solid #cbd7e2',
              background: '#fff',
              color: '#244e73',
              borderRadius: '6px',
              padding: '7px 12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>

        <div style={{
          maxWidth: '760px',
          margin: '0 auto',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .08)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            textAlign: 'center',
            fontWeight: '800',
            padding: '11px 14px',
            fontSize: '17px'
          }}>
            LOGIN INFO REGISTRATION
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px 18px'
            }}>
              {fields.map(([label, value]) => (
                <div key={label}>
                  <label style={{
                    display: 'block',
                    color: '#244e73',
                    fontWeight: '700',
                    fontSize: '13px',
                    marginBottom: '6px'
                  }}>
                    {label}
                  </label>
                  <input
                    type={label === 'Password' ? 'password' : 'text'}
                    value={value}
                    readOnly
                    style={{
                      width: '100%',
                      height: '38px',
                      boxSizing: 'border-box',
                      border: '1px solid #9fb4c5',
                      borderRadius: '4px',
                      background: '#fff',
                      padding: '7px 9px',
                      outline: 'none'
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '9px',
              marginTop: '20px'
            }}>
              <button
                onClick={() => window.print()}
                style={{
                  background: '#1593c8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '8px 18px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Send To Printer
              </button>
              <button
                style={{
                  background: '#fff',
                  color: '#1683b5',
                  border: '1px solid #168bbd',
                  borderRadius: '5px',
                  padding: '8px 18px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'cashstatus') {
    return <ReportShell screenTitle="CASHSALES-PAYMENT STATUS SCREEN" links={['24hrs CashSales-Payment Status','Monthly CashSales-Payment Status','Yearly CashSales-Payment Status']}>
      <ReportForm title="24hrs CashSales-Payment Status" fields={[{name:'date',label:'Enter Date',type:'date',value:'2026-09-30'}]}/>
    </ReportShell>
  }

  if (kind === 'expenses') {
    return <ReportShell screenTitle="EXPENSES SUMMARY SCREEN" links={links}>
      <div style={{width:'765px',margin:'8px auto'}}>
        <button style={{display:'block',margin:'0 auto 10px'}}>Print 24hrs Expenses</button>
        <div style={{background:'#1593c8',color:'#fff',fontWeight:'bold',textAlign:'center',padding:'7px'}}>. . . 2026-09-19: Expenses Summary Report . . .</div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}><thead><tr>{['s/n','Ref No','Receiver','Purpose','Paid Amt'].map(h=><th key={h} style={thStyle}>{h}</th>)}</tr></thead><tbody><tr><td style={tdStyle}>1</td><td style={tdStyle}>ex1269e</td><td style={tdStyle}>CUSTOMER</td><td style={tdStyle}>POS EXCESS</td><td style={tdStyle}>1,350.00</td></tr></tbody></table>
        <div style={{textAlign:'right',fontWeight:'bold'}}>TOTAL AMT: <span style={{color:'#d11'}}>1,350.00</span></div>
      </div>
    </ReportShell>
  }

  if (kind === 'deposit') {
    return <ReportShell screenTitle="CASH DEPOSIT SUMMARY SCREEN" links={['24hrs Cash Deposit Summary Report','Weekly Cash Deposit Summary Report','Monthly Cash Deposit Summary Report','Yearly Cash Deposit Summary Report']}>
      <div style={{width:'638px',margin:'8px auto',background:'#1593c8',color:'#fff',textAlign:'center',padding:'12px',fontSize:'15px'}}>Expenses with such Expenses Date does not exist<br/><br/>Pls try again.</div>
    </ReportShell>
  }

  return <ReportShell screenTitle={titles[kind] || titles.allacct}>
    <ReportForm title={titles[kind] || titles.allacct} fields={[{name:'date',label:'Enter Date',type:'date',value:'2026-09-30'}]}/>
  </ReportShell>
}


function AllAccountStatusSummary({ onBack }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [searched, setSearched] = useState(false)

  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'12px'}}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>All Account Status Summary</div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>View the account status summary for all accounts on a selected date.</div>
        </div>
        <button onClick={onBack} style={{border:'1px solid #cbd7e2',background:'#fff',color:'#244e73',borderRadius:'6px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}>← Back</button>
      </div>

      <div style={{maxWidth:'760px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22, 61, 91, .08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'800',padding:'11px 14px',fontSize:'17px'}}>24hrs All Account Status Summary</div>
        <div style={{padding:'18px'}}>
          <div style={{display:'grid',gridTemplateColumns:'150px minmax(180px,320px)',justifyContent:'center',alignItems:'center',gap:'10px 12px'}}>
            <label style={{color:'#244e73',fontWeight:'700',fontSize:'13px',textAlign:'right'}}>Enter Date:</label>
            <input type='date' value={date} onChange={e=>{setDate(e.target.value);setSearched(false)}} style={{height:'38px',boxSizing:'border-box',border:'1px solid #9fb4c5',borderRadius:'4px',background:'#fff',padding:'7px 9px',width:'100%'}} />
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:'9px',marginTop:'18px'}}>
            <button onClick={()=>setSearched(true)} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}>Search</button>
            <button onClick={()=>{setDate(new Date().toISOString().slice(0,10));setSearched(false)}} style={{background:'#fff',color:'#244e73',border:'1px solid #9fb4c5',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}>Clear</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{maxWidth:'1100px',margin:'16px auto 0',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22, 61, 91, .08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',textAlign:'center',padding:'11px 14px',fontSize:'17px'}}>ALL ACCOUNT STATUS SUMMARY — {date}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:'10px',padding:'14px'}}>
            <div style={{border:'1px solid #d5e1e9',borderRadius:'6px',background:'#fff',padding:'10px'}}><div style={{fontSize:'11px',color:'#708394'}}>REPORT TYPE</div><div style={{fontWeight:'800',color:'#244e73',marginTop:'3px'}}>All Accounts</div></div>
            <div style={{border:'1px solid #d5e1e9',borderRadius:'6px',background:'#fff',padding:'10px'}}><div style={{fontSize:'11px',color:'#708394'}}>REPORT DATE</div><div style={{fontWeight:'800',color:'#244e73',marginTop:'3px'}}>{date}</div></div>
            <div style={{border:'1px solid #d5e1e9',borderRadius:'6px',background:'#fff',padding:'10px'}}><div style={{fontSize:'11px',color:'#708394'}}>STATUS</div><div style={{fontWeight:'800',color:'#244e73',marginTop:'3px'}}>Backend Ready</div></div>
          </div>
          <div style={{padding:'0 14px 14px'}}>
            <div style={{border:'1px solid #d5e1e9',borderRadius:'6px',background:'#fff',padding:'22px',textAlign:'center',color:'#66788a',fontSize:'13px'}}>No account-status records are loaded yet. This summary is ready for the backend account-status data.</div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',gap:'8px',padding:'0 14px 14px'}}>
            <button onClick={()=>setSearched(false)} style={{background:'#fff',color:'#244e73',border:'1px solid #9fb4c5',borderRadius:'5px',padding:'8px 14px',fontWeight:'700',cursor:'pointer'}}>Change Search</button>
            <button onClick={()=>window.print()} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 14px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
          </div>
        </div>
      )}
    </div>
  )
}



function CompanyStockDelete({ onBack }) {
  const companies = [
    { id: 'DANGOTE NIG PLC', name: 'DANGOTE NIG PLC' },
  ]
  const stockRows = [
    ['DANGOTE SALT 50KG','1','16730.00','17000.00','0.00','0.00','0.00'],
    ['DANGOTE SALT X 20','1','7480.00','7600.00','0.00','0.00','0.00'],
    ['DANGOTE SALT X 40','1','7730.00','7900.00','0.00','0.00','0.00'],
    ['DANGOTE SALT X 80','1','8030.00','8150.00','0.00','0.00','0.00'],
    ['DANGOTE SUGAR 50KG','1','28300.00','28600.00','0.00','0.00','0.00']
  ]
  const [companyId, setCompanyId] = useState('')
  const [searched, setSearched] = useState(false)
  const [selected, setSelected] = useState([])
  const [deleted, setDeleted] = useState([])

  const availableRows = stockRows.filter((_, i) => !deleted.includes(i))
  const toggleRow = (index) => {
    setSelected(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])
  }
  const toggleAll = () => {
    const remaining = availableRows.map((row) => stockRows.indexOf(row))
    setSelected(prev => prev.length === remaining.length ? [] : remaining)
  }
  const deleteSelected = () => {
    if (!selected.length) return
    const ok = window.confirm(`Delete ${selected.length} selected stock item${selected.length === 1 ? '' : 's'}?`)
    if (!ok) return
    setDeleted(prev => [...new Set([...prev, ...selected])])
    setSelected([])
  }

  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px',marginBottom:'12px'}}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>Company Stock Delete</div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>Select a company and review its stock records before deleting selected items.</div>
        </div>
        <button onClick={onBack} style={{background:'#fff',color:'#244e73',border:'1px solid #9fb4c5',borderRadius:'5px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}>← Back</button>
      </div>

      <div style={{maxWidth:'760px',margin:'0 auto 16px',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',fontSize:'17px',padding:'10px 14px'}}>COMPANY STOCK DELETE</div>
        <div style={{padding:'16px'}}>
          <div style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:'10px',alignItems:'center'}}>
            <label style={{color:'#1683b5',fontWeight:'700'}}>Company ID:</label>
            <select value={companyId} onChange={e=>{setCompanyId(e.target.value);setSearched(false);setSelected([])}} style={{height:'36px',border:'1px solid #9fb4c5',borderRadius:'4px',padding:'0 10px',background:'#fff'}}>
              <option value="">----------Select----------</option>
              {companies.map(c=><option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',marginTop:'14px'}}>
            <button onClick={()=>{setSearched(Boolean(companyId));setSelected([])}} disabled={!companyId} style={{background:companyId?'#1593c8':'#b9c7d0',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 16px',fontWeight:'700',cursor:companyId?'pointer':'not-allowed'}}>Search</button>
            <button onClick={()=>{setCompanyId('');setSearched(false);setSelected([]);setDeleted([])}} style={{background:'#fff',color:'#244e73',border:'1px solid #9fb4c5',borderRadius:'5px',padding:'8px 16px',fontWeight:'700',cursor:'pointer'}}>Clear</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{maxWidth:'1120px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 3px 10px rgba(0,0,0,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',fontSize:'16px',padding:'10px 14px'}}>Company Stock Delete — {companyId}</div>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1.5fr',gap:'8px',padding:'12px',borderBottom:'1px solid #d5e1e9'}}>
            {[['Company Name',companyId],['Company ID',companyId],['Year','2026'],['Month','October'],['Date',new Date().toISOString().slice(0,10)]].map(([k,v])=><div key={k} style={{background:'#fff',border:'1px solid #d5e1e9',borderRadius:'5px',padding:'8px'}}><div style={{fontSize:'11px',color:'#668097',fontWeight:'700'}}>{k}</div><div style={{fontSize:'13px',color:'#173f63',fontWeight:'700',marginTop:'3px'}}>{v}</div></div>)}
          </div>
          <div style={{overflowX:'auto',padding:'0 12px 12px'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'900px'}}>
              <thead><tr>{['S/N','Stock Name','CTN Size','CTN Cost Price','CTN Selling Price','HALF CTN Selling Price','QRT Selling Price','UNIT Selling Price','Tick'].map(h=><th key={h} style={{...thStyle,textAlign:'center'}}>{h}</th>)}</tr></thead>
              <tbody>
                {availableRows.map((r,displayIndex)=>{
                  const originalIndex=stockRows.indexOf(r)
                  return <tr key={originalIndex}>
                    <td style={{...tdStyle,textAlign:'center'}}>{displayIndex+1}</td>
                    {r.map((v,j)=><td key={j} style={tdStyle}>{v}</td>)}
                    <td style={{...tdStyle,textAlign:'center'}}><input type="checkbox" checked={selected.includes(originalIndex)} onChange={()=>toggleRow(originalIndex)} /></td>
                  </tr>
                })}
                {!availableRows.length && <tr><td colSpan="9" style={{...tdStyle,textAlign:'center',padding:'18px',color:'#66788a'}}>All displayed stock records have been deleted.</td></tr>}
              </tbody>
            </table>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px',padding:'0 14px 14px',flexWrap:'wrap'}}>
            <label style={{fontSize:'12px',color:'#536b80',fontWeight:'700',display:'flex',alignItems:'center',gap:'6px'}}><input type="checkbox" checked={availableRows.length>0 && selected.length===availableRows.length} onChange={toggleAll} /> Select all</label>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={deleteSelected} disabled={!selected.length} style={{background:selected.length?'#c62828':'#b9c7d0',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 16px',fontWeight:'800',cursor:selected.length?'pointer':'not-allowed'}}>Delete Selected</button>
              <button onClick={()=>setSearched(false)} style={{background:'#fff',color:'#244e73',border:'1px solid #9fb4c5',borderRadius:'5px',padding:'8px 16px',fontWeight:'700',cursor:'pointer'}}>Change Search</button>
              <button onClick={()=>window.print()} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 16px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
            </div>
          </div>
          <div style={{padding:'0 14px 14px',fontSize:'11px',color:'#8a5a00'}}>Deletion is currently a front-end action for this UI recreation. The permanent backend delete operation will be connected later.</div>
        </div>
      )}
    </div>
  )
}


function DeleteStock({ onBack }) {
  const [searched, setSearched] = useState(true)
  const [selected, setSelected] = useState([])

  const rows = [
    ['AMAIZING DAY 45G X 50 PROMO PACK','5','8580.00','9000.00','0.00','0.00','1820.00'],
    ['Amaizing DAY 6 X 650G PROMO PACK','6','12385.00','12900.00','6480.00','0.00','0.00'],
    ['Amaizing DAY Breakfast Cereal 45g x 10','10','17140.00','0.00','0.00','0.00','0.00'],
    ['AMAIZING DAY CEREAL 600G X 6','6','12385.00','12900.00','6480.00','0.00','0.00'],
    ['APTAMIL GROWING UP MILK 3 800G X 6','6','92100.00','92700.00','46400.00','0.00','15500.00'],
    ['AUNTIE B PASTA BIG','1','13950.00','14450.00','0.00','0.00','0.00'],
    ['AUNTIE B SEMOLINA 10KG','1','10670.00','0.00','0.00','0.00','0.00'],
    ['AUNTIE B SEMOLINA 10KG NEW','1','10670.00','10700.00','0.00','0.00','0.00'],
    ['AUNTIE B SEMOLINA 1KG','1','10970.00','11050.00','0.00','0.00','0.00'],
    ['AUNTIE B SEMOLINA 1KG NEW','1','10970.00','11050.00','0.00','0.00','0.00'],
    ['AUNTIE B SEMOLINA 5KG','1','5390.00','5450.00','0.00','0.00','0.00'],
    ['AUNTIE B SLIM','1','13950.00','14450.00','0.00','0.00','0.00'],
    ['AUNTIE B SLIM NEW','1','13950.00','14450.00','0.00','0.00','0.00'],
    ['BAMA BIG X 12','12','15500.00','18800.00','9425.00','4725.00','0.00'],
    ['BAMA MEDIUM X 12','12','10000.00','11600.00','5850.00','2925.00','0.00']
  ]

  const allSelected = selected.length === rows.length
  const toggle = (index) => setSelected(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])

  const handleDelete = () => {
    if (!selected.length) {
      window.alert('Please select at least one stock item to delete.')
      return
    }
    if (window.confirm(`Delete ${selected.length} selected stock item${selected.length === 1 ? '' : 's'}?`)) {
      setSelected([])
      window.alert('Selected stock items are marked for deletion. Permanent backend deletion will be connected later.')
    }
  }

  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'12px'}}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>Delete Stock</div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>Review and select stock records for deletion.</div>
        </div>
        <button onClick={onBack} style={{border:'1px solid #cbd7e2',background:'#fff',color:'#244e73',borderRadius:'6px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}>← Back</button>
      </div>

      <div style={{maxWidth:'760px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22,61,91,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',fontSize:'16px',padding:'10px 14px'}}>Delete Stock</div>
        <div style={{padding:'16px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
            <div style={{fontSize:'13px',color:'#52687a'}}>Search is ready with the current stock list.</div>
            <button onClick={()=>setSearched(true)} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 18px',fontWeight:'700',cursor:'pointer'}}>Search Stock</button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{maxWidth:'1180px',margin:'16px auto 0',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22,61,91,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',fontSize:'16px',padding:'10px 14px'}}>Stock Deletion</div>
          <div style={{padding:'12px 14px',display:'flex',gap:'10px',flexWrap:'wrap'}}>
            <div style={{border:'1px solid #d2dde6',background:'#fff',borderRadius:'6px',padding:'8px 12px',fontSize:'12px'}}><strong>Stock Records:</strong> {rows.length}</div>
            <div style={{border:'1px solid #d2dde6',background:'#fff',borderRadius:'6px',padding:'8px 12px',fontSize:'12px'}}><strong>Selected:</strong> {selected.length}</div>
          </div>

          <div style={{overflowX:'auto',padding:'0 14px 14px'}}>
            <table style={{width:'100%',minWidth:'1080px',borderCollapse:'collapse',fontSize:'12px',background:'#fff'}}>
              <thead>
                <tr>{['S/N','Stock Name','CTN Size','CTN Cost Price','CTN Selling Price','HALF CTN Selling Price','QRT Selling Price','UNIT Selling Price','Tick'].map(h=><th key={h} style={{background:'#1593c8',color:'#fff',border:'1px solid #168bbd',padding:'8px',textAlign:h==='Stock Name'?'left':'center',whiteSpace:'nowrap'}}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r,i)=><tr key={i} style={{background:selected.includes(i)?'#eef8ff':'#fff'}}>
                  <td style={{border:'1px solid #b9d4e3',padding:'7px',textAlign:'center',color:'#173f63',fontWeight:'700'}}>{i+1}</td>
                  <td style={{border:'1px solid #b9d4e3',padding:'7px',whiteSpace:'nowrap'}}>{r[0]}</td>
                  {r.slice(1).map((v,j)=><td key={j} style={{border:'1px solid #b9d4e3',padding:'7px',whiteSpace:'nowrap',textAlign:'right'}}>{v}</td>)}
                  <td style={{border:'1px solid #b9d4e3',padding:'7px',textAlign:'center'}}><input type="checkbox" checked={selected.includes(i)} onChange={()=>toggle(i)} /></td>
                </tr>)}
              </tbody>
            </table>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px',padding:'0 14px 14px',flexWrap:'wrap'}}>
            <button onClick={()=>setSelected(allSelected?[]:rows.map((_,i)=>i))} style={{border:'1px solid #1593c8',background:'#fff',color:'#1593c8',borderRadius:'5px',padding:'8px 14px',fontWeight:'700',cursor:'pointer'}}>{allSelected?'Unselect All':'Select All'}</button>
            <button onClick={handleDelete} style={{background:'#c62828',color:'#fff',border:'none',borderRadius:'5px',padding:'9px 18px',fontWeight:'800',cursor:'pointer'}}>Delete Selected</button>
          </div>

          <div style={{borderTop:'1px solid #d7e3eb',padding:'10px 14px',display:'flex',justifyContent:'space-between',gap:'10px',flexWrap:'wrap'}}>
            <button onClick={onBack} style={{border:'1px solid #cbd7e2',background:'#fff',color:'#244e73',borderRadius:'5px',padding:'8px 14px',fontWeight:'700',cursor:'pointer'}}>Change Search</button>
            <button onClick={()=>window.print()} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 16px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
          </div>
          <div style={{padding:'0 14px 14px',fontSize:'11px',color:'#8a5a00'}}>Deletion is currently a front-end action for this UI recreation. Permanent backend deletion will be connected later.</div>
        </div>
      )}
    </div>
  )
}


function DeleteNypAccount({ onBack }) {
  const rows = [
    ['ARADA IYA SHALLOM PETER','15,056,400.00','0.00','0.00','0.00','15,056,400.00'],
    ['FMN MAYOWA EMMANUEL','483,100.00','0.00','0.00','0.00','483,100.00'],
    ['GOLDEN PENNY JAMIU','2,562,400.00','0.00','0.00','2,345,800.00','216,600.00'],
    ['GOLDEN PENNY MR JOEL','106,054,900.00','0.00','0.00','102,035,350.00','4,019,550.00'],
    ['GOLDEN PENNYSHOLA WILLIAM','54,217,370.00','0.00','0.00','53,892,045.00','325,325.00'],
    ['IYA SAHEED ORA','2,611,500.00','0.00','0.00','2,611,500.00','0.00'],
    ['MR SAMSON G PENNY','7,915,300.00','0.00','0.00','4,096,600.00','3,818,700.00'],
    ['MRS ABIOYE IYA OBAARA','2,049,050.00','0.00','0.00','0.00','2,049,050.00'],
    ['SEMO SHOP STAFFS','4,135,440.00','0.00','0.00','70,200.00','4,065,240.00'],
    ['TLD PROVISION SHOP','1,774,500.00','0.00','0.00','0.00','1,774,500.00'],
    ['UNIQUE STORE AROWOMOLE','4,443,000.00','0.00','0.00','0.00','4,443,000.00'],
    ['YAH SAMAD','1,536,500.00','0.00','0.00','0.00','1,536,500.00']
  ]
  const [selected, setSelected] = useState([])

  const toggleRow = index => {
    setSelected(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])
  }

  const toggleAll = () => {
    setSelected(selected.length === rows.length ? [] : rows.map((_, i) => i))
  }

  const handleDelete = () => {
    if (!selected.length) {
      alert('Please select at least one NYP account to delete.')
      return
    }
    const names = selected.map(i => rows[i][0]).join(', ')
    if (window.confirm(`Delete the selected NYP account${selected.length > 1 ? 's' : ''}?\n\n${names}`)) {
      alert('Deletion is currently UI-only. The selected NYP account records will be permanently deleted after backend integration.')
    }
  }

  const moneyStyle = { color: '#d11', fontWeight: '800' }
  const cellStyle = {
    border: '1px solid #168bbd',
    padding: '8px 9px',
    fontSize: '12px',
    whiteSpace: 'nowrap'
  }
  const headerStyle = {
    background: '#1593c8',
    color: '#fff',
    border: '1px solid #168bbd',
    padding: '9px 8px',
    fontSize: '12px',
    fontWeight: '800',
    textAlign: 'left',
    whiteSpace: 'nowrap'
  }

  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '14px'
      }}>
        <div>
          <div style={{
            color: '#173f63',
            fontWeight: '800',
            fontSize: '18px',
            letterSpacing: '.2px'
          }}>
            Delete NYP Account
          </div>
          <div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>
            Select NYP accounts and confirm their deletion.
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border: '1px solid #cbd7e2',
            background: '#fff',
            color: '#244e73',
            borderRadius: '6px',
            padding: '7px 12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth: '1180px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .08)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: '800',
          padding: '11px 14px',
          fontSize: '17px'
        }}>
          NYP Account Deletion In Progress . . .
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 14px',
          borderBottom: '1px solid #d7e2e9',
          background: '#fff'
        }}>
          <div style={{ color: '#66788a', fontSize: '12px' }}>
            {selected.length} of {rows.length} account{rows.length === 1 ? '' : 's'} selected
          </div>
          <button
            onClick={toggleAll}
            style={{
              background: '#fff',
              color: '#1683b5',
              border: '1px solid #168bbd',
              borderRadius: '5px',
              padding: '7px 13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {selected.length === rows.length ? 'Unselect All' : 'Select All'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                {['S/N','NYP Name','Supply Amt','Return Amt','Damage Amt','Paid Amt','To Balance','Tick'].map(h => (
                  <th key={h} style={headerStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row[0]} style={{ background: index % 2 === 0 ? '#f8fffb' : '#fff' }}>
                  <td style={{ ...cellStyle, color: '#1683b5', fontWeight: '800', width: '48px' }}>{index + 1}</td>
                  <td style={{ ...cellStyle, color: '#243746', fontWeight: '600' }}>{row[0]}</td>
                  <td style={cellStyle}>{row[1]}</td>
                  <td style={cellStyle}>{row[2]}</td>
                  <td style={cellStyle}>{row[3]}</td>
                  <td style={cellStyle}>{row[4]}</td>
                  <td style={{ ...cellStyle, ...moneyStyle }}>{row[5]}</td>
                  <td style={{ ...cellStyle, textAlign: 'center', width: '58px' }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(index)}
                      onChange={() => toggleRow(index)}
                      aria-label={`Select ${row[0]}`}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '9px',
          padding: '14px',
          borderTop: '1px solid #d7e2e9',
          background: '#fff'
        }}>
          <button
            onClick={handleDelete}
            style={{
              background: '#c62828',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              padding: '9px 18px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Delete Selected
          </button>
          <button
            onClick={() => setSelected([])}
            style={{
              background: '#fff',
              color: '#1683b5',
              border: '1px solid #168bbd',
              borderRadius: '5px',
              padding: '9px 18px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Clear Selection
          </button>
        </div>
      </div>

      <div style={{
        maxWidth: '1180px',
        margin: '12px auto 0',
        display: 'flex',
        justifyContent: 'center',
        gap: '9px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: '#fff',
            color: '#1683b5',
            border: '1px solid #168bbd',
            borderRadius: '5px',
            padding: '8px 16px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        <button
          onClick={() => window.print()}
          style={{
            background: '#1593c8',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 16px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Send To Printer
        </button>
      </div>

      <div style={{
        maxWidth: '1180px',
        margin: '10px auto 0',
        color: '#718394',
        fontSize: '11px',
        textAlign: 'center'
      }}>
        Deletion is currently UI-only. Permanent NYP account deletion will be connected to the backend later.
      </div>
    </div>
  )
}


function DeleteCompanyAccount({ onBack }) {
  const [selected, setSelected] = useState([])
  const [searched, setSearched] = useState(false)

  const rows = [
    ['DANGOTE NIG PLC', 'DANGOTE NIG PLC', '285,547,509', '0', '285,547,509'],
    ['FLOOR MILLS NIG PLC', 'FLOOR MILLS NIG PLC', '4,921,814,563', '0', '4,921,814,563'],
    ['OTHERS', 'OTHERS', '458,698,175', '0', '458,698,175'],
    ['PRORICH TISSUES', 'PRORICH TISSUES', '2,715,990', '0', '2,715,990'],
    ['SUPERBRAND GD', 'SUPERBRANDZ GLOBAL DISTRIBUTION', '565,650', '0', '565,650'],
    ['test', 'test', '14', '0', '14']
  ]

  const toggleRow = (index) => {
    setSelected(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const allSelected = rows.length > 0 && selected.length === rows.length

  const toggleAll = () => {
    setSelected(allSelected ? [] : rows.map((_, i) => i))
  }

  const deleteSelected = () => {
    if (!selected.length) {
      window.alert('Please select at least one company account to delete.')
      return
    }

    const confirmed = window.confirm(
      `Delete ${selected.length} selected company account${selected.length === 1 ? '' : 's'}?`
    )

    if (confirmed) {
      window.alert(
        'Deletion is currently UI-only. The permanent backend deletion will be connected later.'
      )
      setSelected([])
    }
  }

  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            color: '#173f63',
            fontWeight: '800',
            fontSize: '18px',
            letterSpacing: '.2px'
          }}>
            Delete Company Account
          </div>
          <div style={{
            color: '#66788a',
            fontSize: '12px',
            marginTop: '3px'
          }}>
            Review company account balances and select accounts for deletion.
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border: '1px solid #cbd7e2',
            background: '#fff',
            color: '#244e73',
            borderRadius: '6px',
            padding: '7px 12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .08)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: '800',
          padding: '11px 14px',
          fontSize: '17px'
        }}>
          Company Account Deletion In Progress
        </div>

        <div style={{
          padding: '16px',
          borderBottom: '1px solid #cfe0ea'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              color: '#244e73',
              fontSize: '13px',
              fontWeight: '700'
            }}>
              Company accounts available for deletion
            </div>

            <div style={{
              color: '#66788a',
              fontSize: '12px'
            }}>
              {selected.length} of {rows.length} selected
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '9px',
            marginTop: '14px'
          }}>
            <button
              onClick={toggleAll}
              style={{
                background: '#fff',
                color: '#1683b5',
                border: '1px solid #168bbd',
                borderRadius: '5px',
                padding: '7px 14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {allSelected ? 'Unselect All' : 'Select All'}
            </button>

            <button
              onClick={() => setSelected([])}
              style={{
                background: '#fff',
                color: '#1683b5',
                border: '1px solid #168bbd',
                borderRadius: '5px',
                padding: '7px 14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Clear Selection
            </button>

            <button
              onClick={deleteSelected}
              style={{
                background: '#d11',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '7px 16px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Delete Selected
            </button>
          </div>
        </div>

        <div style={{
          padding: '14px',
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
            background: '#fff',
            minWidth: '900px'
          }}>
            <thead>
              <tr>
                {['S/N', 'Company Name', 'Company ID', 'Total Invoice Amt', 'Total Paid Amt', 'To Balance', 'Tick'].map(h => (
                  <th
                    key={h}
                    style={{
                      background: '#1593c8',
                      color: '#fff',
                      border: '1px solid #168bbd',
                      padding: '8px 7px',
                      textAlign: h === 'S/N' || h === 'Tick' ? 'center' : 'left',
                      whiteSpace: 'nowrap',
                      fontWeight: '800'
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const isSelected = selected.includes(index)

                return (
                  <tr key={`${row[0]}-${index}`} style={{
                    background: isSelected ? '#eef8ff' : '#fff'
                  }}>
                    <td style={{
                      border: '1px solid #168bbd',
                      padding: '8px 7px',
                      textAlign: 'center',
                      color: '#173f63',
                      fontWeight: '700'
                    }}>
                      {index + 1}
                    </td>

                    <td style={{
                      border: '1px solid #168bbd',
                      padding: '8px 7px',
                      whiteSpace: 'nowrap'
                    }}>
                      {row[0]}
                    </td>

                    <td style={{
                      border: '1px solid #168bbd',
                      padding: '8px 7px',
                      whiteSpace: 'nowrap'
                    }}>
                      {row[1]}
                    </td>

                    <td style={{
                      border: '1px solid #168bbd',
                      padding: '8px 7px',
                      textAlign: 'right',
                      whiteSpace: 'nowrap'
                    }}>
                      {row[2]}
                    </td>

                    <td style={{
                      border: '1px solid #168bbd',
                      padding: '8px 7px',
                      textAlign: 'right',
                      whiteSpace: 'nowrap'
                    }}>
                      {row[3]}
                    </td>

                    <td style={{
                      border: '1px solid #168bbd',
                      padding: '8px 7px',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      color: '#d11',
                      fontWeight: '800'
                    }}>
                      {row[4]}
                    </td>

                    <td style={{
                      border: '1px solid #168bbd',
                      padding: '6px',
                      textAlign: 'center'
                    }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(index)}
                        aria-label={`Select ${row[0]}`}
                        style={{
                          width: '17px',
                          height: '17px',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{
          padding: '0 14px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '9px'
        }}>
          <div style={{
            color: '#66788a',
            fontSize: '12px'
          }}>
            Permanent deletion will be connected to the backend later.
          </div>

          <div style={{
            display: 'flex',
            gap: '9px'
          }}>
            <button
              onClick={() => setSearched(false)}
              style={{
                background: '#fff',
                color: '#1683b5',
                border: '1px solid #168bbd',
                borderRadius: '5px',
                padding: '7px 14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>

            <button
              onClick={() => window.print()}
              style={{
                background: '#1593c8',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '7px 14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Send To Printer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


function DeleteBankReport({ onBack }) {
  const [selected, setSelected] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)

  // The legacy screen displays the bank-lodgement dates beginning in January 2022
  // and continuing through August 2022. Sundays are absent from the legacy list.
  const rows = []
  const start = new Date('2022-01-03T00:00:00')
  const end = new Date('2022-08-23T00:00:00')

  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    if (cursor.getDay() === 0) continue
    const iso = [
      cursor.getFullYear(),
      String(cursor.getMonth() + 1).padStart(2, '0'),
      String(cursor.getDate()).padStart(2, '0')
    ].join('-')
    rows.push({
      id: rows.length + 1,
      date: iso,
      month: cursor.toLocaleString('en-US', { month: 'long' }),
      year: String(cursor.getFullYear())
    })
  }

  // Keep the visible legacy sequence at the same scale as the old screen.
  // The old recording reaches row 195 at 2022-08-23.
  const legacyRows = rows.slice(0, 195)
  const allSelected = legacyRows.length > 0 && selected.length === legacyRows.length

  const toggle = (id) => {
    setSelected(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    )
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : legacyRows.map(row => row.id))
  }

  const requestDelete = () => {
    if (!selected.length) {
      window.alert('Please select at least one bank lodgement record to delete.')
      return
    }
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    setShowConfirm(false)
    window.alert(
      `${selected.length} bank lodgement record${selected.length === 1 ? '' : 's'} selected for deletion. Backend deletion will be connected later.`
    )
    setSelected([])
  }

  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            color: '#173f63',
            fontWeight: '800',
            fontSize: '18px',
            letterSpacing: '.2px'
          }}>
            Delete Bank Report
          </div>
          <div style={{
            color: '#66788a',
            fontSize: '12px',
            marginTop: '3px'
          }}>
            Select bank lodgement records to remove from the report.
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border: '1px solid #cbd7e2',
            background: '#fff',
            color: '#244e73',
            borderRadius: '6px',
            padding: '7px 12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .08)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: '800',
          padding: '11px 14px',
          fontSize: '17px'
        }}>
          DELETE BANK LODGEMENT REPORT
        </div>

        <div style={{
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={requestDelete}
            style={{
              background: '#173f63',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 18px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Delete Selected
          </button>

          <button
            onClick={toggleAll}
            style={{
              background: '#fff',
              color: '#1683b5',
              border: '1px solid #168bbd',
              borderRadius: '5px',
              padding: '8px 14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {allSelected ? 'Unselect All' : 'Select All'}
          </button>

          <button
            onClick={() => setSelected([])}
            style={{
              background: '#fff',
              color: '#1683b5',
              border: '1px solid #168bbd',
              borderRadius: '5px',
              padding: '8px 14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Clear Selection
          </button>
        </div>

        <div style={{
          margin: '0 14px 12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '10px'
        }}>
          {[
            ['Report', 'Bank Lodgement Deletion'],
            ['Records', String(legacyRows.length)],
            ['Selected', String(selected.length)]
          ].map(([label, value]) => (
            <div key={label} style={{
              background: '#fff',
              border: '1px solid #c8d7e1',
              borderRadius: '5px',
              padding: '9px 11px'
            }}>
              <div style={{
                color: '#718394',
                fontSize: '11px',
                fontWeight: '700',
                marginBottom: '3px'
              }}>
                {label}
              </div>
              <div style={{
                color: '#244e73',
                fontSize: '13px',
                fontWeight: '800'
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          margin: '0 14px 14px',
          border: '1px solid #168bbd',
          borderRadius: '6px',
          background: '#fff',
          overflow: 'auto',
          maxHeight: '540px'
        }}>
          <table style={{
            width: '100%',
            minWidth: '760px',
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr>
                {['S/N', 'Lodgement Date', 'Lodgement Month', 'Lodgement Year', 'Tick'].map(header => (
                  <th
                    key={header}
                    style={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 3,
                      background: '#1593c8',
                      color: '#fff',
                      border: '1px solid #168bbd',
                      padding: '8px 7px',
                      textAlign: header === 'S/N' || header === 'Tick' ? 'center' : 'left',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {legacyRows.map(row => (
                <tr key={row.id}>
                  <td style={{
                    border: '1px solid #168bbd',
                    padding: '7px',
                    color: '#d11',
                    textAlign: 'center'
                  }}>
                    {row.id}
                  </td>
                  <td style={{
                    border: '1px solid #168bbd',
                    padding: '7px',
                    whiteSpace: 'nowrap'
                  }}>
                    {row.date}
                  </td>
                  <td style={{
                    border: '1px solid #168bbd',
                    padding: '7px',
                    whiteSpace: 'nowrap'
                  }}>
                    {row.month}
                  </td>
                  <td style={{
                    border: '1px solid #168bbd',
                    padding: '7px'
                  }}>
                    {row.year}
                  </td>
                  <td style={{
                    border: '1px solid #168bbd',
                    padding: '7px',
                    textAlign: 'center'
                  }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(row.id)}
                      onChange={() => toggle(row.id)}
                      aria-label={`Select bank lodgement ${row.date}`}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer'
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '9px',
          flexWrap: 'wrap',
          padding: '0 14px 16px'
        }}>
          <button
            onClick={onBack}
            style={{
              background: '#fff',
              color: '#1683b5',
              border: '1px solid #168bbd',
              borderRadius: '5px',
              padding: '7px 15px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Back
          </button>
          <button
            onClick={() => window.print()}
            style={{
              background: '#1593c8',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              padding: '7px 15px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Send To Printer
          </button>
        </div>
      </div>

      {showConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,.42)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '20px'
        }}>
          <div style={{
            width: 'min(430px, 100%)',
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #168bbd',
            boxShadow: '0 10px 30px rgba(0,0,0,.2)',
            padding: '20px'
          }}>
            <div style={{
              color: '#173f63',
              fontSize: '17px',
              fontWeight: '800',
              marginBottom: '8px'
            }}>
              Confirm Deletion
            </div>
            <div style={{
              color: '#536b80',
              fontSize: '13px',
              lineHeight: '1.5',
              marginBottom: '18px'
            }}>
              You selected {selected.length} bank lodgement record{selected.length === 1 ? '' : 's'}. Continue with deletion?
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px'
            }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  background: '#fff',
                  color: '#244e73',
                  border: '1px solid #cbd7e2',
                  borderRadius: '5px',
                  padding: '8px 14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  background: '#c62828',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '8px 14px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function DeleteExpensesReport({ onBack }) {
  const [selected, setSelected] = useState([])
  const rows = [
    ['2022-01-03','January','2022'],
    ['2022-01-04','January','2022'],
    ['2022-01-06','January','2022'],
    ['2022-01-12','January','2022'],
    ['2022-01-22','January','2022'],
    ['2022-01-24','January','2022'],
    ['2022-01-31','January','2022'],
    ['2022-02-02','February','2022'],
    ['2022-02-05','February','2022'],
    ['2022-02-07','February','2022'],
    ['2022-02-08','February','2022'],
    ['2022-02-22','February','2022'],
    ['2022-02-23','February','2022'],
    ['2022-02-25','February','2022'],
    ['2022-02-26','February','2022'],
    ['2022-02-28','February','2022'],
  ]

  const allSelected = selected.length === rows.length && rows.length > 0

  const toggleOne = (index) => {
    setSelected(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : rows.map((_, i) => i))
  }

  const deleteSelected = () => {
    if (!selected.length) {
      window.alert('Please select at least one expense date to delete.')
      return
    }
    const ok = window.confirm(`Delete ${selected.length} selected expense date${selected.length === 1 ? '' : 's'}? This will be connected to the backend deletion workflow later.`)
    if (ok) setSelected([])
  }

  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'12px'}}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>Delete Expenses Report</div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>Select expense dates to remove from the expenses report.</div>
        </div>
        <button onClick={onBack} style={{border:'1px solid #cbd7e2',background:'#fff',color:'#244e73',borderRadius:'6px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}>← Back</button>
      </div>

      <div style={{maxWidth:'1050px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22,61,91,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'800',padding:'11px 14px',fontSize:'17px'}}>Delete Expenses Report</div>

        <div style={{padding:'14px 16px 10px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
          <div style={{color:'#d11',fontWeight:'800',fontSize:'14px'}}>. . . DELETE EXPENSES REPORT . . .</div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <button onClick={toggleAll} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}>{allSelected ? 'Unselect All' : 'Select All'}</button>
            <button onClick={()=>setSelected([])} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}>Clear Selection</button>
            <button onClick={deleteSelected} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}>Delete Selected</button>
          </div>
        </div>

        <div style={{margin:'0 14px 10px',display:'flex',justifyContent:'flex-end',color:'#66788a',fontSize:'12px',fontWeight:'700'}}>Selected: {selected.length} of {rows.length}</div>

        <div style={{margin:'0 14px 14px',border:'1px solid #168bbd',borderRadius:'5px',background:'#fff',overflow:'auto',maxHeight:'560px'}}>
          <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,fontSize:'13px',minWidth:'700px'}}>
            <thead>
              <tr>
                {['S/N','Expenses Date','Expenses Month','Expenses Year','Tick'].map((h,i)=><th key={h} style={{...thStyle,position:'sticky',top:0,zIndex:5,textAlign:i===0||i===4?'center':'left',padding:'8px 9px'}}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={r[0]} style={{background:i%2===0?'#f9fffb':'#fff'}}>
                  <td style={{...tdStyle,textAlign:'center',color:'#d11',fontWeight:'700',padding:'7px 9px'}}>{i+1}</td>
                  <td style={{...tdStyle,padding:'7px 9px'}}>{r[0]}</td>
                  <td style={{...tdStyle,padding:'7px 9px'}}>{r[1]}</td>
                  <td style={{...tdStyle,padding:'7px 9px'}}>{r[2]}</td>
                  <td style={{...tdStyle,textAlign:'center',padding:'7px 9px'}}><input type="checkbox" checked={selected.includes(i)} onChange={()=>toggleOne(i)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px'}}>
          <button onClick={()=>setSelected([])} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Clear Selection</button>
          <button onClick={deleteSelected} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'800',cursor:'pointer'}}>Delete Selected</button>
          <button onClick={()=>window.print()} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
        </div>
      </div>

      <div style={{maxWidth:'1050px',margin:'12px auto 0',padding:'10px 12px',border:'1px solid #c8d7e1',borderRadius:'6px',background:'#fff',color:'#667788',fontSize:'12px',lineHeight:'1.5'}}>
        Deletion is currently a front-end selection and confirmation workflow. The permanent expense-date deletion will be connected to the backend when the deletion APIs are implemented.
      </div>
    </div>
  )
}

function DeleteCashDepositReport({ onBack }) {
  const [selected, setSelected] = useState([])
  const rows = [
    ['2024-04-02', 'April', '2024'],
  ]

  const allSelected = selected.length === rows.length && rows.length > 0

  const toggleOne = (index) => {
    setSelected(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : rows.map((_, i) => i))
  }

  const deleteSelected = () => {
    if (!selected.length) {
      window.alert('Please select at least one cash deposit report to delete.')
      return
    }
    const ok = window.confirm(`Delete ${selected.length} selected cash deposit report${selected.length === 1 ? '' : 's'}? This will be connected to the backend deletion workflow later.`)
    if (ok) setSelected([])
  }

  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'12px'}}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>Delete Cash Deposit Report</div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>Select cash deposit report dates to remove from the system.</div>
        </div>
        <button onClick={onBack} style={{border:'1px solid #cbd7e2',background:'#fff',color:'#244e73',borderRadius:'6px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}>← Back</button>
      </div>

      <div style={{maxWidth:'900px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22,61,91,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'800',padding:'11px 14px',fontSize:'17px'}}>Delete Cash Deposit Report</div>

        <div style={{padding:'14px 16px 10px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
          <div style={{color:'#d11',fontWeight:'800',fontSize:'14px'}}>. . . DELETE CASH DEPOSIT REPORT . . .</div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <button onClick={toggleAll} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}>{allSelected ? 'Unselect All' : 'Select All'}</button>
            <button onClick={()=>setSelected([])} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}>Clear Selection</button>
            <button onClick={deleteSelected} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}>Delete Selected</button>
          </div>
        </div>

        <div style={{margin:'0 14px 10px',display:'flex',justifyContent:'flex-end',color:'#66788a',fontSize:'12px',fontWeight:'700'}}>Selected: {selected.length} of {rows.length}</div>

        <div style={{margin:'0 14px 14px',border:'1px solid #168bbd',borderRadius:'5px',background:'#fff',overflow:'auto',maxHeight:'560px'}}>
          <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,fontSize:'13px',minWidth:'650px'}}>
            <thead>
              <tr>
                {['S/N','Cash Deposit Date','Cash Deposit Month','Cash Deposit Year','Tick'].map((h,i)=><th key={h} style={{...thStyle,position:'sticky',top:0,zIndex:5,textAlign:i===0||i===4?'center':'left',padding:'8px 9px'}}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={`${r[0]}-${i}`} style={{background:i%2===0?'#f9fffb':'#fff'}}>
                  <td style={{...tdStyle,textAlign:'center',color:'#d11',fontWeight:'700',padding:'7px 9px'}}>{i+1}</td>
                  <td style={{...tdStyle,padding:'7px 9px'}}>{r[0]}</td>
                  <td style={{...tdStyle,padding:'7px 9px'}}>{r[1]}</td>
                  <td style={{...tdStyle,padding:'7px 9px'}}>{r[2]}</td>
                  <td style={{...tdStyle,textAlign:'center',padding:'7px 9px'}}><input type="checkbox" checked={selected.includes(i)} onChange={()=>toggleOne(i)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px',flexWrap:'wrap'}}>
          <button onClick={()=>setSelected([])} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Clear Selection</button>
          <button onClick={deleteSelected} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'800',cursor:'pointer'}}>Delete Selected</button>
          <button onClick={()=>window.print()} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
        </div>
      </div>

      <div style={{maxWidth:'900px',margin:'12px auto 0',padding:'10px 12px',border:'1px solid #c8d7e1',borderRadius:'6px',background:'#fff',color:'#667788',fontSize:'12px',lineHeight:'1.5'}}>
        Deletion is currently a front-end selection and confirmation workflow. The permanent cash-deposit deletion will be connected to the backend when the deletion APIs are implemented.
      </div>
    </div>
  )
}


function DeleteCashSalesReport({ onBack }) {
  const [selected, setSelected] = useState([])

  // Records reproduced from the legacy CashSales deletion screen.
  const rows = [
    ['2022-01-03', 'January', '2022'],
    ['2022-01-04', 'January', '2022'],
    ['2022-01-05', 'January', '2022'],
    ['2022-01-06', 'January', '2022'],
    ['2022-01-07', 'January', '2022'],
    ['2022-01-08', 'January', '2022'],
    ['2022-01-10', 'January', '2022'],
    ['2022-01-11', 'January', '2022'],
    ['2022-01-12', 'January', '2022'],
    ['2022-01-13', 'January', '2022'],
    ['2022-01-14', 'January', '2022'],
    ['2022-01-15', 'January', '2022'],
    ['2022-01-17', 'January', '2022'],
    ['2022-01-18', 'January', '2022'],
    ['2022-01-19', 'January', '2022'],
    ['2022-01-20', 'January', '2022'],
    ['2022-01-21', 'January', '2022'],
    ['2022-01-22', 'January', '2022'],
  ]

  const allSelected = selected.length === rows.length && rows.length > 0

  const toggleOne = (index) => {
    setSelected(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : rows.map((_, i) => i))
  }

  const deleteSelected = () => {
    if (!selected.length) {
      window.alert('Please select at least one CashSales report to delete.')
      return
    }

    const ok = window.confirm(
      `Delete ${selected.length} selected CashSales report${selected.length === 1 ? '' : 's'}? This will be connected to the backend deletion workflow later.`
    )

    if (ok) setSelected([])
  }

  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'12px'}}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>
            Delete CashSales Report
          </div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>
            Select CashSales transaction dates to remove from the system.
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border:'1px solid #cbd7e2',
            background:'#fff',
            color:'#244e73',
            borderRadius:'6px',
            padding:'7px 12px',
            fontWeight:'700',
            cursor:'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth:'900px',
        margin:'0 auto',
        border:'1px solid #168bbd',
        borderRadius:'8px',
        background:'#f5fff5',
        boxShadow:'0 2px 8px rgba(22,61,91,.08)',
        overflow:'hidden'
      }}>
        <div style={{
          background:'#1593c8',
          color:'#fff',
          textAlign:'center',
          fontWeight:'800',
          padding:'11px 14px',
          fontSize:'17px'
        }}>
          Delete CashSales Report
        </div>

        <div style={{
          padding:'14px 16px 10px',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          gap:'10px',
          flexWrap:'wrap'
        }}>
          <div style={{color:'#d11',fontWeight:'800',fontSize:'14px'}}>
            . . . DELETE CASHSALES REPORT . . .
          </div>

          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <button
              onClick={toggleAll}
              style={{
                background:'#fff',
                color:'#1683b5',
                border:'1px solid #168bbd',
                borderRadius:'5px',
                padding:'7px 13px',
                fontWeight:'700',
                cursor:'pointer'
              }}
            >
              {allSelected ? 'Unselect All' : 'Select All'}
            </button>

            <button
              onClick={()=>setSelected([])}
              style={{
                background:'#fff',
                color:'#1683b5',
                border:'1px solid #168bbd',
                borderRadius:'5px',
                padding:'7px 13px',
                fontWeight:'700',
                cursor:'pointer'
              }}
            >
              Clear Selection
            </button>

            <button
              onClick={deleteSelected}
              style={{
                background:'#1593c8',
                color:'#fff',
                border:'none',
                borderRadius:'5px',
                padding:'7px 14px',
                fontWeight:'800',
                cursor:'pointer'
              }}
            >
              Delete Selected
            </button>
          </div>
        </div>

        <div style={{
          margin:'0 14px 10px',
          display:'flex',
          justifyContent:'flex-end',
          color:'#66788a',
          fontSize:'12px',
          fontWeight:'700'
        }}>
          Selected: {selected.length} of {rows.length}
        </div>

        <div style={{
          margin:'0 14px 14px',
          border:'1px solid #168bbd',
          borderRadius:'5px',
          background:'#fff',
          overflow:'auto',
          maxHeight:'560px'
        }}>
          <table style={{
            width:'100%',
            borderCollapse:'separate',
            borderSpacing:0,
            fontSize:'13px',
            minWidth:'650px'
          }}>
            <thead>
              <tr>
                {['S/N','Trans Date','Trans Month','Trans Year','Tick'].map((h,i)=>(
                  <th
                    key={h}
                    style={{
                      ...thStyle,
                      position:'sticky',
                      top:0,
                      zIndex:5,
                      textAlign:i===0 || i===4 ? 'center' : 'left',
                      padding:'8px 9px'
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r,i)=>(
                <tr
                  key={`${r[0]}-${i}`}
                  style={{background:i%2===0 ? '#f9fffb' : '#fff'}}
                >
                  <td style={{
                    ...tdStyle,
                    textAlign:'center',
                    color:'#d11',
                    fontWeight:'700',
                    padding:'7px 9px'
                  }}>
                    {i+1}
                  </td>

                  <td style={{...tdStyle,padding:'7px 9px'}}>
                    {r[0]}
                  </td>

                  <td style={{...tdStyle,padding:'7px 9px'}}>
                    {r[1]}
                  </td>

                  <td style={{...tdStyle,padding:'7px 9px'}}>
                    {r[2]}
                  </td>

                  <td style={{
                    ...tdStyle,
                    textAlign:'center',
                    padding:'7px 9px'
                  }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(i)}
                      onChange={()=>toggleOne(i)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          display:'flex',
          justifyContent:'center',
          gap:'9px',
          padding:'0 14px 16px',
          flexWrap:'wrap'
        }}>
          <button
            onClick={()=>setSelected([])}
            style={{
              background:'#fff',
              color:'#1683b5',
              border:'1px solid #168bbd',
              borderRadius:'5px',
              padding:'7px 15px',
              fontWeight:'700',
              cursor:'pointer'
            }}
          >
            Clear Selection
          </button>

          <button
            onClick={deleteSelected}
            style={{
              background:'#1593c8',
              color:'#fff',
              border:'none',
              borderRadius:'5px',
              padding:'7px 15px',
              fontWeight:'800',
              cursor:'pointer'
            }}
          >
            Delete Selected
          </button>

          <button
            onClick={()=>window.print()}
            style={{
              background:'#fff',
              color:'#1683b5',
              border:'1px solid #168bbd',
              borderRadius:'5px',
              padding:'7px 15px',
              fontWeight:'700',
              cursor:'pointer'
            }}
          >
            Send To Printer
          </button>
        </div>
      </div>

      <div style={{
        maxWidth:'900px',
        margin:'12px auto 0',
        padding:'10px 12px',
        border:'1px solid #c8d7e1',
        borderRadius:'6px',
        background:'#fff',
        color:'#667788',
        fontSize:'12px',
        lineHeight:'1.5'
      }}>
        Deletion is currently a front-end selection and confirmation workflow.
        The permanent CashSales deletion will be connected to the backend when
        the deletion APIs are implemented.
      </div>
    </div>
  )
}

function DeleteNypSalesReport({ onBack }) {
  const [selected, setSelected] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)

  // Records reproduced from the legacy NYPSales deletion screen shown in the reference image.
  const rows = [
    ['2022-01-01', 'January', '2022'],
    ['2022-01-05', 'January', '2022'],
    ['2022-01-10', 'January', '2022'],
    ['2022-01-12', 'January', '2022'],
    ['2022-01-20', 'January', '2022'],
    ['2022-01-21', 'January', '2022'],
    ['2022-01-27', 'January', '2022'],
    ['2022-01-31', 'January', '2022'],
    ['2022-02-02', 'February', '2022'],
    ['2022-02-07', 'February', '2022'],
    ['2022-02-16', 'February', '2022'],
    ['2022-02-23', 'February', '2022'],
    ['2022-02-28', 'February', '2022'],
    ['2022-03-09', 'March', '2022'],
    ['2022-03-18', 'March', '2022'],
    ['2022-04-26', 'April', '2022'],
    ['2022-06-12', 'June', '2022'],
    ['2022-06-14', 'June', '2022']
  ].map((r, i) => ({ id: i + 1, date: r[0], month: r[1], year: r[2] }))

  const allSelected = rows.length > 0 && selected.length === rows.length

  const toggleOne = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : rows.map(row => row.id))
  }

  const requestDelete = () => {
    if (!selected.length) {
      window.alert('Please select at least one NYPSales report to delete.')
      return
    }
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    setShowConfirm(false)
    window.alert(
      `${selected.length} NYPSales report${selected.length === 1 ? '' : 's'} selected for deletion. Backend deletion will be connected later.`
    )
    setSelected([])
  }

  return (
    <div style={{ minHeight:'100%', position:'relative' }}>
      <div style={{
        display:'flex',
        alignItems:'flex-start',
        justifyContent:'space-between',
        gap:'12px',
        marginBottom:'12px'
      }}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>
            Delete NYPSales Report
          </div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>
            Select NYPSales transaction dates to remove from the system.
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border:'1px solid #cbd7e2',
            background:'#fff',
            color:'#244e73',
            borderRadius:'6px',
            padding:'7px 12px',
            fontWeight:'700',
            cursor:'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth:'1100px',
        margin:'0 auto',
        border:'1px solid #168bbd',
        borderRadius:'8px',
        background:'#f5fff5',
        boxShadow:'0 2px 8px rgba(22,61,91,.08)',
        overflow:'hidden'
      }}>
        <div style={{
          background:'#1593c8',
          color:'#fff',
          textAlign:'center',
          fontWeight:'800',
          padding:'11px 14px',
          fontSize:'17px'
        }}>
          Delete NYPSales Report
        </div>

        <div style={{
          padding:'12px 14px',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          gap:'10px',
          flexWrap:'wrap'
        }}>
          <div style={{color:'#d11',fontWeight:'800',fontSize:'14px'}}>
            . . . DELETE NYP SALES REPORT . . .
          </div>

          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <button
              onClick={toggleAll}
              style={{
                background:'#fff',color:'#1683b5',border:'1px solid #168bbd',
                borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'
              }}
            >
              {allSelected ? 'Unselect All' : 'Select All'}
            </button>
            <button
              onClick={() => setSelected([])}
              style={{
                background:'#fff',color:'#1683b5',border:'1px solid #168bbd',
                borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'
              }}
            >
              Clear Selection
            </button>
            <button
              onClick={requestDelete}
              style={{
                background:'#173f63',color:'#fff',border:'none',borderRadius:'5px',
                padding:'7px 14px',fontWeight:'800',cursor:'pointer'
              }}
            >
              Delete Selected
            </button>
          </div>
        </div>

        <div style={{
          margin:'0 14px 12px',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          gap:'10px',
          flexWrap:'wrap',
          color:'#667788',
          fontSize:'12px'
        }}>
          <span>
            {selected.length} of {rows.length} record{rows.length === 1 ? '' : 's'} selected
          </span>
          <span>Legacy NYPSales dates preserved for backend mapping.</span>
        </div>

        <div style={{
          margin:'0 14px 14px',
          border:'1px solid #168bbd',
          borderRadius:'6px',
          background:'#fff',
          maxHeight:'560px',
          overflow:'auto'
        }}>
          <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,fontSize:'13px'}}>
            <thead>
              <tr>
                {['S/N','Trans Date','Trans Month','Trans Year','Tick'].map((h,i) => (
                  <th key={h} style={{
                    background:'#1593c8',
                    color:'#fff',
                    borderRight:'1px solid #168bbd',
                    borderBottom:'1px solid #168bbd',
                    padding:'8px 7px',
                    textAlign:i === 0 || i === 4 ? 'center' : 'left',
                    whiteSpace:'nowrap',
                    position:'sticky',
                    top:0,
                    zIndex:2
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const checked = selected.includes(row.id)
                return (
                  <tr key={row.id} style={{background:checked ? '#eef8ff' : '#f5fff5'}}>
                    <td style={{borderRight:'1px solid #168bbd',borderBottom:'1px solid #168bbd',padding:'7px',color:'#d11',textAlign:'center'}}>{row.id}</td>
                    <td style={{borderRight:'1px solid #168bbd',borderBottom:'1px solid #168bbd',padding:'7px',color:'#173f63',fontWeight:'600'}}>{row.date}</td>
                    <td style={{borderRight:'1px solid #168bbd',borderBottom:'1px solid #168bbd',padding:'7px',color:'#173f63'}}>{row.month}</td>
                    <td style={{borderRight:'1px solid #168bbd',borderBottom:'1px solid #168bbd',padding:'7px',color:'#173f63'}}>{row.year}</td>
                    <td style={{borderBottom:'1px solid #168bbd',padding:'7px',textAlign:'center'}}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(row.id)}
                        style={{width:'16px',height:'16px',cursor:'pointer'}}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{
          padding:'0 14px 14px',
          display:'flex',
          justifyContent:'center',
          gap:'9px',
          flexWrap:'wrap'
        }}>
          <button
            onClick={() => window.print()}
            style={{
              background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',
              padding:'7px 15px',fontWeight:'700',cursor:'pointer'
            }}
          >
            Send To Printer
          </button>
        </div>
      </div>

      <div style={{
        maxWidth:'900px',
        margin:'12px auto 0',
        padding:'10px 12px',
        border:'1px solid #c8d7e1',
        borderRadius:'6px',
        background:'#fff',
        color:'#667788',
        fontSize:'12px',
        lineHeight:'1.5'
      }}>
        Deletion is currently a front-end selection and confirmation workflow. Permanent NYPSales deletion will be connected to the backend when the deletion APIs are implemented.
      </div>

      {showConfirm && (
        <div style={{
          position:'fixed',
          inset:0,
          background:'rgba(10,30,45,.42)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:1000,
          padding:'20px'
        }}>
          <div style={{
            width:'min(440px, 100%)',
            background:'#fff',
            border:'1px solid #168bbd',
            borderRadius:'8px',
            boxShadow:'0 8px 28px rgba(0,0,0,.2)',
            overflow:'hidden'
          }}>
            <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',padding:'11px 14px'}}>
              Confirm NYPSales Deletion
            </div>
            <div style={{padding:'18px',color:'#244e73',fontSize:'13px',lineHeight:'1.5'}}>
              You selected <strong>{selected.length}</strong> NYPSales record{selected.length === 1 ? '' : 's'} for deletion. Continue?
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',padding:'0 18px 18px'}}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{background:'#173f63',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function DeleteStockBinCardReport({ onBack }) {
  const rows = [
    ['2022-01-01'],
    ['2022-01-03'],
    ['2022-01-04'],
    ['2022-01-05'],
    ['2022-01-06'],
    ['2022-01-07'],
    ['2022-01-08'],
    ['2022-01-10'],
    ['2022-01-11'],
    ['2022-01-12'],
    ['2022-01-13'],
    ['2022-01-14'],
    ['2022-01-15'],
    ['2022-01-17'],
    ['2022-01-18'],
    ['2022-01-19'],
    ['2022-01-20'],
    ['2022-01-21']
  ]

  const [selected, setSelected] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)

  const allSelected = selected.length === rows.length && rows.length > 0

  const toggleOne = (index) => {
    setSelected(prev => prev.includes(index)
      ? prev.filter(i => i !== index)
      : [...prev, index]
    )
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : rows.map((_, i) => i))
  }

  const requestDelete = () => {
    if (!selected.length) {
      window.alert('Please select at least one stock bin card report to delete.')
      return
    }
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    setShowConfirm(false)
    window.alert(`${selected.length} stock bin card report${selected.length === 1 ? '' : 's'} selected for deletion. Backend deletion will be connected later.`)
    setSelected([])
  }

  return (
    <div style={{minHeight:'100%',position:'relative',paddingBottom:'20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'18px'}}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>Delete Stock Bin Card Report</div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>Select stock bin card report dates to remove from the system.</div>
        </div>
        <button
          onClick={onBack}
          style={{border:'1px solid #cbd7e2',background:'#fff',color:'#244e73',borderRadius:'6px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}
        >
          ← Back
        </button>
      </div>

      <div style={{maxWidth:'900px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22,61,91,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'800',padding:'11px 14px',fontSize:'17px'}}>
          Delete Stock Bin Card Report
        </div>

        <div style={{padding:'14px 16px 10px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
          <div style={{color:'#d11',fontWeight:'800',fontSize:'14px'}}>. . . DELETE STOCK BIN CARD REPORT . . .</div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <button onClick={toggleAll} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}>
              {allSelected ? 'Unselect All' : 'Select All'}
            </button>
            <button onClick={()=>setSelected([])} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}>
              Clear Selection
            </button>
            <button onClick={requestDelete} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}>
              Delete Selected
            </button>
          </div>
        </div>

        <div style={{margin:'0 14px 10px',display:'flex',justifyContent:'flex-end',color:'#66788a',fontSize:'12px',fontWeight:'700'}}>
          Selected: {selected.length} of {rows.length}
        </div>

        <div style={{margin:'0 14px 14px',border:'1px solid #168bbd',borderRadius:'5px',background:'#fff',overflow:'auto',maxHeight:'560px'}}>
          <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,fontSize:'13px',minWidth:'620px'}}>
            <thead>
              <tr>
                {['S/N','Date','Tick'].map((h,i)=>(
                  <th
                    key={h}
                    style={{
                      ...thStyle,
                      position:'sticky',
                      top:0,
                      zIndex:5,
                      textAlign:i===0 || i===2 ? 'center' : 'left',
                      padding:'8px 9px',
                      boxShadow:'0 1px 0 #168bbd'
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={`${r[0]}-${i}`} style={{background:selected.includes(i)?'#eef8ff':i%2===0?'#f9fffb':'#fff'}}>
                  <td style={{...tdStyle,textAlign:'center',color:'#d11',fontWeight:'700',padding:'8px 9px'}}>{i+1}</td>
                  <td style={{...tdStyle,padding:'8px 9px'}}>{r[0]}</td>
                  <td style={{...tdStyle,textAlign:'center',padding:'8px 9px'}}>
                    <input type="checkbox" checked={selected.includes(i)} onChange={()=>toggleOne(i)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px',flexWrap:'wrap'}}>
          <button onClick={()=>setSelected([])} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Clear Selection</button>
          <button onClick={requestDelete} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'800',cursor:'pointer'}}>Delete Selected</button>
          <button onClick={()=>window.print()} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
        </div>
      </div>

      <div style={{maxWidth:'900px',margin:'12px auto 0',padding:'10px 12px',border:'1px solid #c8d7e1',borderRadius:'6px',background:'#fff',color:'#667788',fontSize:'12px',lineHeight:'1.5'}}>
        Deletion is currently a front-end selection and confirmation workflow. The permanent stock bin card deletion will be connected to the backend when the deletion APIs are implemented.
      </div>

      {showConfirm && (
        <div style={{position:'fixed',inset:0,background:'rgba(10,30,45,.42)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{width:'min(440px, 100%)',background:'#fff',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 8px 28px rgba(0,0,0,.2)',overflow:'hidden'}}>
            <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',padding:'11px 14px'}}>Confirm Stock Bin Card Deletion</div>
            <div style={{padding:'18px',color:'#244e73',fontSize:'13px',lineHeight:'1.5'}}>
              You selected <strong>{selected.length}</strong> stock bin card report{selected.length === 1 ? '' : 's'} for deletion. Continue?
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',padding:'0 18px 18px'}}>
              <button onClick={()=>setShowConfirm(false)} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}>Cancel</button>
              <button onClick={confirmDelete} style={{background:'#173f63',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function MdCeoDesk2ConnectedPage({ kind='purchase', onBack }) {
  const configs = {
    company: { title:'COMPANY STOCK DELETE', endpoint:null, deleteEndpoint:'/api/md-ceo2/company-stock', companyMode:true, columns:[['Stock Name','stockName'],['CTN Size','ctnSize'],['Cost Price','ctnCostPrice'],['Selling Price','ctnSellingPrice'],['Quantity On Hand','quantityOnHand']], idKey:'id' },
    stock: { title:'DELETE STOCK', endpoint:'/api/md-ceo2/stock', deleteEndpoint:'/api/md-ceo2/stock', columns:[['Stock Name','stockName'],['Company','company'],['CTN Size','ctnSize'],['Cost Price','ctnCostPrice'],['Selling Price','ctnSellingPrice'],['Quantity On Hand','quantityOnHand']], idKey:'id' },
    nyp: { title:'DELETE NYP ACCOUNT', endpoint:'/api/md-ceo2/nyp-accounts', deleteEndpoint:'/api/md-ceo2/nyp-accounts', columns:[['NYP ID','nypId'],['Full Name','fullName'],['Supplied','supplied'],['Paid','paid'],['Balance','balance']], idKey:'id' },
    companyAcct: { title:'DELETE COMPANY ACCOUNT', endpoint:'/api/md-ceo2/company-accounts', deleteEndpoint:'/api/md-ceo2/company-accounts', columns:[['Company ID','companyId'],['Company Name','companyName'],['Supplied','supplied'],['Paid','paid'],['Balance','balance']], idKey:'id' },
    bank: { title:'DELETE BANK REPORT', endpoint:'/api/md-ceo2/bank-lodgements', deleteEndpoint:'/api/md-ceo2/bank-lodgements', columns:[['Date','date'],['Month','month'],['Year','year'],['Amount','amount'],['Reference','reference']], idKey:'id' },
    expenses: { title:'DELETE EXPENSES REPORT', endpoint:'/api/md-ceo2/expenses', deleteEndpoint:'/api/md-ceo2/expenses', columns:[['Date','date'],['Description','description'],['Category','category'],['Amount','amount'],['Note','note']], idKey:'id' },
    deposit: { title:'DELETE CASH DEPOSIT REPORT', endpoint:'/api/md-ceo2/cash-deposits', deleteEndpoint:'/api/md-ceo2/cash-deposits', columns:[['Date','date'],['Month','month'],['Year','year'],['Amount','amount'],['Reference','reference']], idKey:'id' },
    cashsales: { title:'DELETE CASHSALES REPORT', endpoint:'/api/md-ceo2/cash-sales', deleteEndpoint:'/api/md-ceo2/cash-sales', columns:[['Date','date'],['Invoice No','invoiceNo'],['Amount','amount']], idKey:'id' },
    nypsales: { title:'DELETE NYPSALES REPORT', endpoint:'/api/md-ceo2/nyp-sales', deleteEndpoint:'/api/md-ceo2/nyp-sales', columns:[['Date','date'],['Invoice No','invoiceNo'],['Amount','amount']], idKey:'id' },
    purchase: { title:'DELETE STOCK PURCHASE REPORT', endpoint:'/api/md-ceo2/stock-purchases', deleteEndpoint:'/api/md-ceo2/stock-purchases', periodMode:true, columns:[['Year','year'],['Month','monthName'],['Records','count']] },
    adjust: { title:'DELETE STOCK ADJUST REPORT', endpoint:'/api/md-ceo2/stock-adjustments', deleteEndpoint:'/api/md-ceo2/stock-adjustments', periodMode:true, columns:[['Year','year'],['Month','monthName'],['Records','count']] },
    bincard: { title:'DELETE STOCK BIN CARD REPORT', endpoint:'/api/md-ceo2/stock-bin-card', readOnly:true, columns:[['Date','date'],['Activity Count','activityCount']] },
    acct: { title:'DELETE ACCOUNT STATUS ANALYSIS REPORT', endpoint:'/api/md-ceo2/account-status-analysis', readOnly:true, columns:[['Type','type'],['Account','account'],['Balance','balance']] }
  }
  const cfg = configs[kind] || configs.purchase
  const [companies,setCompanies] = useState([])
  const [companyId,setCompanyId] = useState('')
  const [rows,setRows] = useState([])
  const [selected,setSelected] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const [notice,setNotice] = useState('')
  const [adminOpen,setAdminOpen] = useState(false)
  const [adminId,setAdminId] = useState('')
  const [password,setPassword] = useState('')

  const loadRows = async (url) => {
    setLoading(true); setError(''); setNotice('')
    try {
      const r = await apiFetch(url)
      const data = await r.json().catch(()=>({}))
      if (!r.ok) throw new Error(data.message || 'Unable to load records.')
      setRows(Array.isArray(data.rows) ? data.rows : [])
      setSelected([])
    } catch(e) { setRows([]); setError(e.message || 'Unable to load records.') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (cfg.companyMode) {
      (async()=>{
        setLoading(true); setError('')
        try {
          const r=await apiFetch('/api/companies')
          const data=await r.json().catch(()=>[])
          if(!r.ok) throw new Error(data.message || 'Unable to load companies.')
          const list=Array.isArray(data)?data:(Array.isArray(data.companies)?data.companies:[])
          setCompanies(list)
          if(!companyId && list[0]?.id) setCompanyId(String(list[0].id))
        } catch(e) { setError(e.message || 'Unable to load companies.') }
        finally { setLoading(false) }
      })()
      return
    }
    loadRows(cfg.endpoint)
  }, [kind])

  const searchCompany = () => {
    if(!companyId){setError('Please select a company.');return}
    loadRows(`/api/md-ceo2/company-stock?companyId=${encodeURIComponent(companyId)}`)
  }

  const selectedKey = (row) => cfg.periodMode ? `${row.year}-${row.month}` : String(row[cfg.idKey])
  const isSelected = (row) => selected.some(x => String(cfg.periodMode ? `${x.year}-${x.month}` : x) === selectedKey(row))
  const toggleRow = (row) => {
    const value=cfg.periodMode?{year:row.year,month:row.month}:row[cfg.idKey]
    const key=String(cfg.periodMode?`${value.year}-${value.month}`:value)
    setSelected(prev => prev.some(x=>String(cfg.periodMode?`${x.year}-${x.month}`:x)===key)
      ? prev.filter(x=>String(cfg.periodMode?`${x.year}-${x.month}`:x)!==key)
      : [...prev,value])
  }
  const toggleAll=()=>setSelected(rows.length && selected.length===rows.length?[]:rows.map(r=>cfg.periodMode?{year:r.year,month:r.month}:r[cfg.idKey]))

  const requestDelete=()=>{
    if(cfg.readOnly){setNotice('This is a calculated report. There is no stored report record to delete.');return}
    if(!selected.length){setError('Please select at least one record.');return}
    setError('');setNotice('');setAdminOpen(true)
  }

  const confirmDelete=async()=>{
    if(!adminId.trim()||!password){setError('Admin ID and password are required.');return}
    setLoading(true);setError('')
    try{
      const body=cfg.companyMode?{companyId:Number(companyId),ids:selected.map(Number),adminId:adminId.trim(),password}:cfg.periodMode?{periods:selected,adminId:adminId.trim(),password}:{ids:selected.map(Number),adminId:adminId.trim(),password}
      const r=await apiFetch(cfg.companyMode?'/api/md-ceo2/company-stock':cfg.deleteEndpoint,{method:'DELETE',body:JSON.stringify(body)})
      const data=await r.json().catch(()=>({}))
      if(!r.ok) throw new Error(data.message || 'Unable to delete selected records.')
      setNotice(data.message || 'Selected records deleted successfully.')
      setSelected([]);setAdminOpen(false);setAdminId('');setPassword('')
      if(cfg.companyMode) await loadRows(`/api/md-ceo2/company-stock?companyId=${encodeURIComponent(companyId)}`)
      else await loadRows(cfg.endpoint)
    }catch(e){setError(e.message || 'Unable to delete selected records.')}
    finally{setLoading(false)}
  }

  const fmt=(v,k)=>{
    if(v===null||v===undefined||v==='') return '—'
    if(['amount','supplied','paid','balance','ctnCostPrice','ctnSellingPrice','quantityOnHand'].includes(k)){
      const n=Number(v); return Number.isFinite(n)?n.toLocaleString('en-NG',{minimumFractionDigits:2,maximumFractionDigits:2}):String(v)
    }
    return String(v)
  }

  return <div style={{minHeight:'100%',position:'relative'}}>
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px',marginBottom:'12px'}}>
      <div><div style={{color:'#173f63',fontWeight:'800',fontSize:'18px'}}>{cfg.title}</div><div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>{cfg.readOnly?'This report is calculated from live database transactions.':'Select records from the live database before deleting them.'}</div></div>
      <button onClick={onBack} style={{background:'#fff',color:'#244e73',border:'1px solid #9fb4c5',borderRadius:'5px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}>← Back</button>
    </div>
    {cfg.companyMode&&<div style={{maxWidth:'760px',margin:'0 auto 14px',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',overflow:'hidden'}}>
      <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',padding:'10px 14px'}}>COMPANY STOCK DELETE</div>
      <div style={{padding:'15px',display:'grid',gridTemplateColumns:'150px 1fr auto',gap:'10px',alignItems:'center'}}>
        <label style={{color:'#1683b5',fontWeight:'700'}}>Company</label>
        <select value={companyId} onChange={e=>setCompanyId(e.target.value)} style={{height:'36px',border:'1px solid #a9bdca',borderRadius:'5px',padding:'0 9px',background:'#fff'}}>
          <option value="">Select company</option>{companies.map(c=><option key={c.id} value={c.id}>{c.companyId} — {c.companyName}</option>)}
        </select>
        <button onClick={searchCompany} disabled={loading} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 15px',fontWeight:'800'}}>Search</button>
      </div>
    </div>}
    {error&&<div style={{maxWidth:'1100px',margin:'0 auto 10px',padding:'9px 12px',background:'#fff2f2',border:'1px solid #e2aaaa',color:'#a33',borderRadius:'6px'}}>{error}</div>}
    {notice&&<div style={{maxWidth:'1100px',margin:'0 auto 10px',padding:'9px 12px',background:'#f1fff5',border:'1px solid #9bc8a8',color:'#27633a',borderRadius:'6px'}}>{notice}</div>}
    <div style={{maxWidth:'1180px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',overflow:'hidden',background:'#fff'}}>
      <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',textAlign:'center',padding:'10px'}}>{cfg.title}</div>
      <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}><thead><tr>
        {!cfg.readOnly&&<th style={thStyle}><input type="checkbox" checked={rows.length>0&&selected.length===rows.length} onChange={toggleAll}/></th>}<th style={thStyle}>S/N</th>{cfg.columns.map(([l])=><th key={l} style={thStyle}>{l}</th>)}
      </tr></thead><tbody>
        {loading?<tr><td colSpan={cfg.columns.length+(cfg.readOnly?1:2)} style={{...tdStyle,textAlign:'center',padding:'20px'}}>Loading...</td></tr>:
        rows.length===0?<tr><td colSpan={cfg.columns.length+(cfg.readOnly?1:2)} style={{...tdStyle,textAlign:'center',padding:'20px'}}>No records found.</td></tr>:
        rows.map((row,i)=><tr key={selectedKey(row)}>
          {!cfg.readOnly&&<td style={tdStyle}><input type="checkbox" checked={isSelected(row)} onChange={()=>toggleRow(row)}/></td>}<td style={tdStyle}>{i+1}</td>
          {cfg.columns.map(([l,k])=><td key={k} style={tdStyle}>{fmt(row[k],k)}</td>)}
        </tr>)}
      </tbody></table></div>
      <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'14px',flexWrap:'wrap'}}>
        {!cfg.readOnly&&<><button onClick={()=>setSelected([])} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 15px',fontWeight:'700'}}>Clear Selection</button><button onClick={requestDelete} style={{background:'#173f63',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 15px',fontWeight:'800'}}>Delete Selected</button></>}
        <button onClick={()=>window.print()} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 15px',fontWeight:'700'}}>Send To Printer</button>
      </div>
      {cfg.readOnly&&<div style={{padding:'0 14px 14px',textAlign:'center',color:'#718394',fontSize:'11px'}}>This report has no independent database record to delete.</div>}
    </div>
    {adminOpen&&<div style={{position:'fixed',inset:0,background:'rgba(10,30,45,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,padding:'20px'}}>
      <div style={{width:'min(430px,100%)',background:'#fff',borderRadius:'8px',overflow:'hidden',boxShadow:'0 10px 30px rgba(0,0,0,.25)'}}>
        <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',padding:'12px 14px'}}>ADMIN CODE VERIFICATION</div>
        <div style={{padding:'16px'}}><label style={{display:'block',fontWeight:'700',color:'#1683b5',marginBottom:'6px'}}>Admin ID</label><input value={adminId} onChange={e=>setAdminId(e.target.value)} style={{width:'100%',boxSizing:'border-box',height:'36px',marginBottom:'12px'}}/><label style={{display:'block',fontWeight:'700',color:'#1683b5',marginBottom:'6px'}}>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',boxSizing:'border-box',height:'36px'}}/></div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',padding:'0 16px 16px'}}><button onClick={()=>setAdminOpen(false)} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'8px 14px',fontWeight:'700'}}>Cancel</button><button onClick={confirmDelete} disabled={loading} style={{background:'#173f63',color:'#fff',border:'none',borderRadius:'5px',padding:'8px 14px',fontWeight:'800'}}>Verify & Delete</button></div>
      </div>
    </div>}
  </div>
}

function MdCeoDesk2Page({ kind='purchase', onBack }) {
  const names = {
    company: 'COMPANY STOCK DELETE',
    stock: 'DELETE STOCK',
    nyp: 'DELETE NYP ACCOUNT',
    companyAcct: 'DELETE COMPANY ACCOUNT',
    bank: 'DELETE BANK REPORT',
    expenses: 'DELETE EXPENSES REPORT',
    deposit: 'DELETE CASH DEPOSIT REPORT',
    cashsales: 'DELETE CASHSALES REPORT',
    nypsales: 'DELETE NYPSALES REPORT',
    purchase: 'DELETE STOCK PURCHASE REPORT',
    adjust: 'DELETE STOCK ADJUST REPORT',
    bincard: 'DELETE STOCK BIN CARD REPORT',
    acct: 'DELETE ACCOUNT STATUS ANALYSIS REPORT'
  }
  if (kind === 'company') {
    const rows = [
      ['DANGOTE SALT 50KG','1','16730.00','17000.00','0.00','0.00','0.00'],
      ['DANGOTE SALT X 20','1','7480.00','7600.00','0.00','0.00','0.00'],
      ['DANGOTE SALT X 40','1','7730.00','7900.00','0.00','0.00','0.00'],
      ['DANGOTE SALT X 80','1','8030.00','8150.00','0.00','0.00','0.00'],
      ['DANGOTE SUGAR 50KG','1','28300.00','28600.00','0.00','0.00','0.00']
    ]
    return <ReportShell screenTitle="COMPANY STOCK DELETE SCREEN">
      <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'bold',padding:'10px',fontSize:'16px'}}>. . . Company Stock Delete . . .</div>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}><thead><tr>{['Company Name','Company ID','Year','Month','Date'].map(h=><th key={h} style={thStyle}>{h}</th>)}</tr></thead><tbody><tr>{['DANGOTE NIG PLC','DANGOTE NIG PLC','2026','September','2026-09-30'].map((v,i)=><td key={i} style={tdStyle}>{v}</td>)}</tr></tbody></table>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',marginTop:'4px'}}><thead><tr>{['s/n','Stock Name','CTN Size','CTN Cost Price','CTN Selling Price','HALF CTN Selling Price','QRT Selling Price','UNIT Selling Price','Tick'].map(h=><th key={h} style={thStyle}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td style={tdStyle}>{i+1}</td>{r.map((v,j)=><td key={j} style={tdStyle}>{v}</td>)}<td style={tdStyle}><input type="checkbox"/></td></tr>)}</tbody></table>
      <button style={{display:'block',margin:'12px auto',background:'#000',color:'#fff',fontWeight:'bold'}}>Click To Delete</button>
    </ReportShell>
  }

  if (kind === 'purchase') {
    const rows = [
      ['January','2022'],
      ['February','2022'],
      ['March','2022'],
      ['April','2022'],
      ['May','2022'],
      ['June','2022'],
      ['July','2022'],
      ['August','2022'],
      ['September','2022'],
      ['October','2022'],
      ['November','2022'],
      ['December','2022'],
      ['January','2023'],
      ['February','2023'],
      ['March','2023'],
      ['April','2023'],
      ['May','2023'],
      ['June','2023']
    ]

    const [selected, setSelected] = useState([])
    const [showConfirm, setShowConfirm] = useState(false)
    const allSelected = selected.length === rows.length && rows.length > 0

    const toggleOne = (index) => {
      setSelected(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])
    }

    const toggleAll = () => {
      setSelected(allSelected ? [] : rows.map((_, i) => i))
    }

    const deleteSelected = () => {
      if (!selected.length) {
        window.alert('Please select at least one stock purchase period to delete.')
        return
      }
      setShowConfirm(true)
    }

    const confirmDelete = () => {
      setShowConfirm(false)
      setSelected([])
      window.alert('Stock purchase deletion selected. The permanent backend deletion will be connected later.')
    }

    return (
      <div style={{ minHeight:'100%', position:'relative' }}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'12px'}}>
          <div>
            <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>Delete Stock Purchase Report</div>
            <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>Select stock purchase periods to remove from the purchase report.</div>
          </div>
          <button onClick={onBack} style={{border:'1px solid #cbd7e2',background:'#fff',color:'#244e73',borderRadius:'6px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}>← Back</button>
        </div>

        <div style={{maxWidth:'900px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22,61,91,.08)',overflow:'hidden'}}>
          <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'800',padding:'11px 14px',fontSize:'17px'}}>Delete Stock Purchase Report</div>

          <div style={{padding:'14px 16px 10px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
            <div style={{color:'#d11',fontWeight:'800',fontSize:'14px'}}>. . . DELETING STOCK PURCHASE REPORT . . .</div>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              <button onClick={toggleAll} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}>{allSelected ? 'Unselect All' : 'Select All'}</button>
              <button onClick={() => setSelected([])} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}>Clear Selection</button>
              <button onClick={deleteSelected} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}>Delete Selected</button>
            </div>
          </div>

          <div style={{margin:'0 14px 10px',display:'flex',justifyContent:'flex-end',color:'#66788a',fontSize:'12px',fontWeight:'700'}}>Selected: {selected.length} of {rows.length}</div>

          <div style={{margin:'0 14px 14px',border:'1px solid #168bbd',borderRadius:'5px',background:'#fff',overflow:'auto',maxHeight:'560px'}}>
            <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,fontSize:'13px',minWidth:'650px'}}>
              <thead>
                <tr>
                  {['S/N','Inventory Month','Inventory Year','Tick'].map((h,i)=><th key={h} style={{...thStyle,position:'sticky',top:0,zIndex:5,textAlign:i===0||i===3?'center':'left',padding:'8px 9px'}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((r,i)=>(
                  <tr key={`${r[0]}-${r[1]}-${i}`} style={{background:i%2===0?'#f9fffb':'#fff'}}>
                    <td style={{...tdStyle,textAlign:'center',color:'#d11',fontWeight:'700',padding:'7px 9px'}}>{i+1}</td>
                    <td style={{...tdStyle,padding:'7px 9px'}}>{r[0]}</td>
                    <td style={{...tdStyle,padding:'7px 9px'}}>{r[1]}</td>
                    <td style={{...tdStyle,textAlign:'center',padding:'7px 9px'}}><input type="checkbox" checked={selected.includes(i)} onChange={() => toggleOne(i)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px',flexWrap:'wrap'}}>
            <button onClick={() => setSelected([])} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Clear Selection</button>
            <button onClick={deleteSelected} style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'800',cursor:'pointer'}}>Delete Selected</button>
            <button onClick={() => window.print()} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}>Send To Printer</button>
          </div>
        </div>

        <div style={{maxWidth:'900px',margin:'12px auto 0',padding:'10px 12px',border:'1px solid #c8d7e1',borderRadius:'6px',background:'#fff',color:'#667788',fontSize:'12px',lineHeight:'1.5'}}>
          Deletion is currently a front-end selection and confirmation workflow. Permanent stock purchase deletion will be connected to the backend when the deletion APIs are implemented.
        </div>

        {showConfirm && (
          <div style={{position:'fixed',inset:0,background:'rgba(10,30,45,.42)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
            <div style={{width:'min(440px, 100%)',background:'#fff',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 8px 28px rgba(0,0,0,.2)',overflow:'hidden'}}>
              <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',padding:'11px 14px'}}>Confirm Stock Purchase Deletion</div>
              <div style={{padding:'18px',color:'#244e73',fontSize:'13px',lineHeight:'1.5'}}>You selected <strong>{selected.length}</strong> stock purchase period{selected.length === 1 ? '' : 's'} for deletion. Continue?</div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',padding:'0 18px 18px'}}>
                <button onClick={() => setShowConfirm(false)} style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}>Cancel</button>
                <button onClick={confirmDelete} style={{background:'#173f63',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}>Confirm Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return <ReportShell screenTitle={names[kind] || names.stock}><div style={{padding:'20px',textAlign:'center'}}><button style={{background:'#000',color:'#fff',fontWeight:'bold',padding:'6px 12px'}}>Click To Delete</button></div></ReportShell>
}

function DeleteStockAdjustReport({ onBack }) {
  const rows = [
    ['September', '2021'],
    ['June', '2024'],
    ['December', '2024'],
    ['November', '2025']
  ]

  const [selected, setSelected] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)

  const allSelected = selected.length === rows.length && rows.length > 0

  const toggleOne = (index) => {
    setSelected(prev => prev.includes(index)
      ? prev.filter(i => i !== index)
      : [...prev, index]
    )
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : rows.map((_, i) => i))
  }

  const deleteSelected = () => {
    if (!selected.length) {
      window.alert('Please select at least one stock adjustment period to delete.')
      return
    }
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    setShowConfirm(false)
    setSelected([])
    window.alert('Stock adjustment deletion selected. The permanent backend deletion will be connected later.')
  }

  return (
    <div style={{minHeight:'100%',position:'relative',paddingBottom:'20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'18px'}}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>Delete Stock Adjust Report</div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>Select stock adjustment periods to remove from the stock adjustment report.</div>
        </div>
        <button
          onClick={onBack}
          style={{border:'1px solid #cbd7e2',background:'#fff',color:'#244e73',borderRadius:'6px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}
        >
          ← Back
        </button>
      </div>

      <div style={{maxWidth:'900px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22,61,91,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'800',padding:'11px 14px',fontSize:'17px'}}>
          Delete Stock Adjust Report
        </div>

        <div style={{padding:'14px 16px 10px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
          <div style={{color:'#d11',fontWeight:'800',fontSize:'14px'}}>. . . DELETING STOCK ADJUSTMENT REPORT . . .</div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <button
              onClick={toggleAll}
              style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}
            >
              {allSelected ? 'Unselect All' : 'Select All'}
            </button>
            <button
              onClick={() => setSelected([])}
              style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}
            >
              Clear Selection
            </button>
            <button
              onClick={deleteSelected}
              style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}
            >
              Delete Selected
            </button>
          </div>
        </div>

        <div style={{margin:'0 14px 10px',display:'flex',justifyContent:'flex-end',color:'#66788a',fontSize:'12px',fontWeight:'700'}}>
          Selected: {selected.length} of {rows.length}
        </div>

        <div style={{margin:'0 14px 14px',border:'1px solid #168bbd',borderRadius:'5px',background:'#fff',overflow:'auto',maxHeight:'560px'}}>
          <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,fontSize:'13px',minWidth:'620px'}}>
            <thead>
              <tr>
                {['S/N','Inventory Month','Inventory Year','Tick'].map((h,i)=>(
                  <th
                    key={h}
                    style={{
                      ...thStyle,
                      position:'sticky',
                      top:0,
                      zIndex:5,
                      textAlign:i===0 || i===3 ? 'center' : 'left',
                      padding:'8px 9px',
                      boxShadow:'0 1px 0 #168bbd'
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={`${r[0]}-${r[1]}-${i}`} style={{background:i%2===0 ? '#f9fffb' : '#fff'}}>
                  <td style={{...tdStyle,textAlign:'center',color:'#d11',fontWeight:'700',padding:'8px 9px'}}>{i+1}</td>
                  <td style={{...tdStyle,padding:'8px 9px'}}>{r[0]}</td>
                  <td style={{...tdStyle,padding:'8px 9px'}}>{r[1]}</td>
                  <td style={{...tdStyle,textAlign:'center',padding:'8px 9px'}}>
                    <input type="checkbox" checked={selected.includes(i)} onChange={() => toggleOne(i)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px',flexWrap:'wrap'}}>
          <button
            onClick={() => setSelected([])}
            style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
          >
            Clear Selection
          </button>
          <button
            onClick={deleteSelected}
            style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'800',cursor:'pointer'}}
          >
            Delete Selected
          </button>
          <button
            onClick={() => window.print()}
            style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
          >
            Send To Printer
          </button>
        </div>
      </div>

      <div style={{maxWidth:'900px',margin:'12px auto 0',padding:'10px 12px',border:'1px solid #c8d7e1',borderRadius:'6px',background:'#fff',color:'#667788',fontSize:'12px',lineHeight:'1.5'}}>
        Deletion is currently a front-end selection and confirmation workflow. Permanent stock adjustment deletion will be connected to the backend when the deletion APIs are implemented.
      </div>

      {showConfirm && (
        <div style={{position:'fixed',inset:0,background:'rgba(10,30,45,.42)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{width:'min(440px, 100%)',background:'#fff',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 8px 28px rgba(0,0,0,.2)',overflow:'hidden'}}>
            <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',padding:'11px 14px'}}>Confirm Stock Adjustment Deletion</div>
            <div style={{padding:'18px',color:'#244e73',fontSize:'13px',lineHeight:'1.5'}}>
              You selected <strong>{selected.length}</strong> stock adjustment period{selected.length === 1 ? '' : 's'} for deletion. Continue?
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',padding:'0 18px 18px'}}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{background:'#173f63',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function DeleteAccountStatusAnalysisReport({ onBack }) {
  // Records reproduced from the visible legacy Account Status Analysis deletion screen.
  const rows = [
    ['2022-01-03', 'January', '2022'],
    ['2022-01-04', 'January', '2022'],
    ['2022-01-05', 'January', '2022'],
    ['2022-01-06', 'January', '2022'],
    ['2022-01-07', 'January', '2022'],
    ['2022-01-08', 'January', '2022'],
    ['2022-01-10', 'January', '2022'],
    ['2022-01-11', 'January', '2022'],
    ['2022-01-12', 'January', '2022'],
    ['2022-01-13', 'January', '2022'],
    ['2022-01-14', 'January', '2022'],
    ['2022-01-15', 'January', '2022'],
    ['2022-01-17', 'January', '2022'],
    ['2022-01-18', 'January', '2022'],
    ['2022-01-19', 'January', '2022'],
    ['2022-01-20', 'January', '2022'],
    ['2022-01-21', 'January', '2022'],
    ['2022-01-22', 'January', '2022']
  ]

  const [selected, setSelected] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)

  const allSelected = selected.length === rows.length && rows.length > 0

  const toggleOne = (index) => {
    setSelected(prev => prev.includes(index)
      ? prev.filter(i => i !== index)
      : [...prev, index]
    )
  }

  const toggleAll = () => {
    setSelected(allSelected ? [] : rows.map((_, i) => i))
  }

  const requestDelete = () => {
    if (!selected.length) {
      window.alert('Please select at least one account status analysis report to delete.')
      return
    }
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    setShowConfirm(false)
    window.alert(`${selected.length} account status analysis report${selected.length === 1 ? '' : 's'} selected for deletion. Backend deletion will be connected later.`)
    setSelected([])
  }

  return (
    <div style={{minHeight:'100%',position:'relative',paddingBottom:'20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',marginBottom:'18px'}}>
        <div>
          <div style={{color:'#173f63',fontWeight:'800',fontSize:'18px',letterSpacing:'.2px'}}>
            Delete Account Status Analysis Report
          </div>
          <div style={{color:'#66788a',fontSize:'12px',marginTop:'3px'}}>
            Select account status analysis report dates to remove from the system.
          </div>
        </div>
        <button
          onClick={onBack}
          style={{border:'1px solid #cbd7e2',background:'#fff',color:'#244e73',borderRadius:'6px',padding:'7px 12px',fontWeight:'700',cursor:'pointer'}}
        >
          ← Back
        </button>
      </div>

      <div style={{maxWidth:'900px',margin:'0 auto',border:'1px solid #168bbd',borderRadius:'8px',background:'#f5fff5',boxShadow:'0 2px 8px rgba(22,61,91,.08)',overflow:'hidden'}}>
        <div style={{background:'#1593c8',color:'#fff',textAlign:'center',fontWeight:'800',padding:'11px 14px',fontSize:'17px'}}>
          Delete Account Status Analysis Report
        </div>

        <div style={{padding:'14px 16px 10px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
          <div style={{color:'#d11',fontWeight:'800',fontSize:'14px'}}>. . . DELETE ACCOUNT STATUS ANALYSIS REPORT . . .</div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <button
              onClick={toggleAll}
              style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}
            >
              {allSelected ? 'Unselect All' : 'Select All'}
            </button>
            <button
              onClick={() => setSelected([])}
              style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 13px',fontWeight:'700',cursor:'pointer'}}
            >
              Clear Selection
            </button>
            <button
              onClick={requestDelete}
              style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}
            >
              Delete Selected
            </button>
          </div>
        </div>

        <div style={{margin:'0 14px 10px',display:'flex',justifyContent:'flex-end',color:'#66788a',fontSize:'12px',fontWeight:'700'}}>
          Selected: {selected.length} of {rows.length}
        </div>

        <div style={{margin:'0 14px 14px',border:'1px solid #168bbd',borderRadius:'5px',background:'#fff',overflow:'auto',maxHeight:'560px'}}>
          <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,fontSize:'13px',minWidth:'700px'}}>
            <thead>
              <tr>
                {['S/N','Date','Month','Year','Tick'].map((h,i)=>(
                  <th
                    key={h}
                    style={{
                      ...thStyle,
                      position:'sticky',
                      top:0,
                      zIndex:5,
                      textAlign:i===0 || i===4 ? 'center' : 'left',
                      padding:'8px 9px',
                      boxShadow:'0 1px 0 #168bbd'
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={`${r[0]}-${i}`} style={{background:i%2===0 ? '#f9fffb' : '#fff'}}>
                  <td style={{...tdStyle,textAlign:'center',color:'#d11',fontWeight:'700',padding:'8px 9px'}}>{i+1}</td>
                  <td style={{...tdStyle,padding:'8px 9px'}}>{r[0]}</td>
                  <td style={{...tdStyle,padding:'8px 9px'}}>{r[1]}</td>
                  <td style={{...tdStyle,padding:'8px 9px'}}>{r[2]}</td>
                  <td style={{...tdStyle,textAlign:'center',padding:'8px 9px'}}>
                    <input type="checkbox" checked={selected.includes(i)} onChange={() => toggleOne(i)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display:'flex',justifyContent:'center',gap:'9px',padding:'0 14px 16px',flexWrap:'wrap'}}>
          <button
            onClick={() => setSelected([])}
            style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
          >
            Clear Selection
          </button>
          <button
            onClick={requestDelete}
            style={{background:'#1593c8',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 15px',fontWeight:'800',cursor:'pointer'}}
          >
            Delete Selected
          </button>
          <button
            onClick={() => window.print()}
            style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 15px',fontWeight:'700',cursor:'pointer'}}
          >
            Send To Printer
          </button>
        </div>
      </div>

      <div style={{maxWidth:'900px',margin:'12px auto 0',padding:'10px 12px',border:'1px solid #c8d7e1',borderRadius:'6px',background:'#fff',color:'#667788',fontSize:'12px',lineHeight:'1.5'}}>
        Deletion is currently a front-end selection and confirmation workflow. Permanent account status analysis deletion will be connected to the backend when the deletion APIs are implemented.
      </div>

      {showConfirm && (
        <div style={{position:'fixed',inset:0,background:'rgba(10,30,45,.42)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{width:'min(440px, 100%)',background:'#fff',border:'1px solid #168bbd',borderRadius:'8px',boxShadow:'0 8px 28px rgba(0,0,0,.2)',overflow:'hidden'}}>
            <div style={{background:'#1593c8',color:'#fff',fontWeight:'800',padding:'11px 14px'}}>
              Confirm Account Status Analysis Deletion
            </div>
            <div style={{padding:'18px',color:'#244e73',fontSize:'13px',lineHeight:'1.5'}}>
              You selected <strong>{selected.length}</strong> account status analysis report{selected.length === 1 ? '' : 's'} for deletion. Continue?
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',padding:'0 18px 18px'}}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{background:'#fff',color:'#1683b5',border:'1px solid #168bbd',borderRadius:'5px',padding:'7px 14px',fontWeight:'700',cursor:'pointer'}}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{background:'#173f63',color:'#fff',border:'none',borderRadius:'5px',padding:'7px 14px',fontWeight:'800',cursor:'pointer'}}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const thStyle = { background:'#1593c8', color:'#fff', border:'1px solid #168bbd', padding:'4px', textAlign:'left', whiteSpace:'nowrap' }
const tdStyle = { border:'1px solid #168bbd', padding:'4px', whiteSpace:'nowrap' }
const labelStyle = { color:'#1683b5', fontWeight:'bold', fontSize:'15px', textAlign:'right' }
const inputStyle = { height:'28px', border:'2px solid #254b8e', boxSizing:'border-box' }
const searchButtonStyle = { border:'none', background:'transparent', cursor:'pointer', fontSize:'19px' }


function AccountStatusSummary({ onBack }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [searched, setSearched] = useState(false)

  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            color: '#173f63',
            fontWeight: '800',
            fontSize: '18px',
            letterSpacing: '.2px'
          }}>
            Account Status Summary
          </div>
          <div style={{
            color: '#66788a',
            fontSize: '12px',
            marginTop: '3px'
          }}>
            View the account status summary for a selected date.
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border: '1px solid #cbd7e2',
            background: '#fff',
            color: '#244e73',
            borderRadius: '6px',
            padding: '7px 12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth: '760px',
        margin: '0 auto',
        border: '1px solid #168bbd',
        borderRadius: '8px',
        background: '#f5fff5',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .08)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1593c8',
          color: '#fff',
          textAlign: 'center',
          fontWeight: '800',
          padding: '11px 14px',
          fontSize: '17px'
        }}>
          24hrs Account Status Summary
        </div>

        <div style={{ padding: '18px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '150px minmax(180px, 320px)',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px 12px'
          }}>
            <label style={{
              color: '#244e73',
              fontWeight: '700',
              fontSize: '13px',
              textAlign: 'right'
            }}>
              Enter Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={e => {
                setDate(e.target.value)
                setSearched(false)
              }}
              style={{
                height: '38px',
                boxSizing: 'border-box',
                border: '1px solid #9fb4c5',
                borderRadius: '4px',
                background: '#fff',
                padding: '7px 9px',
                width: '100%'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '9px',
            marginTop: '18px'
          }}>
            <button
              onClick={() => setSearched(true)}
              style={{
                background: '#1593c8',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 18px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
            <button
              onClick={() => {
                setDate(new Date().toISOString().slice(0, 10))
                setSearched(false)
              }}
              style={{
                background: '#fff',
                color: '#1683b5',
                border: '1px solid #168bbd',
                borderRadius: '5px',
                padding: '8px 18px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {searched && (
        <div style={{
          maxWidth: '1100px',
          margin: '16px auto 0',
          border: '1px solid #168bbd',
          borderRadius: '8px',
          background: '#f5fff5',
          boxShadow: '0 2px 8px rgba(22, 61, 91, .08)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#1593c8',
            color: '#fff',
            fontWeight: '800',
            textAlign: 'center',
            padding: '11px 14px',
            fontSize: '16px'
          }}>
            {date}: Account Status Summary
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '10px',
            padding: '14px'
          }}>
            {[
              ['Report Type', '24hrs Account Status Summary'],
              ['Report Date', date],
              ['Status', 'Ready for backend data']
            ].map(([label, value]) => (
              <div key={label} style={{
                background: '#fff',
                border: '1px solid #c8d7e1',
                borderRadius: '5px',
                padding: '10px 12px'
              }}>
                <div style={{
                  color: '#718394',
                  fontSize: '11px',
                  fontWeight: '700',
                  marginBottom: '3px'
                }}>
                  {label}
                </div>
                <div style={{
                  color: '#244e73',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            margin: '0 14px 14px',
            border: '1px solid #168bbd',
            borderRadius: '5px',
            background: '#fff',
            padding: '22px 16px',
            textAlign: 'center',
            color: '#667788',
            fontSize: '13px',
            lineHeight: '1.5'
          }}>
            No real account-status summary records are connected to this report yet. The existing screen provides the date-based summary search; live account values will be loaded when the backend is connected.
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '9px',
            padding: '0 14px 16px'
          }}>
            <button
              onClick={() => setSearched(false)}
              style={{
                background: '#fff',
                color: '#1683b5',
                border: '1px solid #168bbd',
                borderRadius: '5px',
                padding: '7px 15px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Change Search
            </button>
            <button
              onClick={() => window.print()}
              style={{
                background: '#1593c8',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '7px 15px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Send To Printer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AccountStatusAnalysis({ onBack }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [cashier, setCashier] = useState('All')
  const [searched, setSearched] = useState(false)

  const cashierOptions = ['All', '5', 'cashier1', 'cashier2', 'jesus', 'oga', 'sales1']

  const columns = [
    ['s/n', 'sn'],
    ['Ref No', 'ref'],
    ['Cashier', 'cashier'],
    ['Description', 'description'],
    ['Type', 'type'],
    ['External\nPmt', 'external'],
    ['NYP\nPmt', 'nyp'],
    ['CashSales\nPmt', 'cashSales'],
    ['Transfer\nPmt', 'transfer'],
    ['Pos', 'pos'],
    ['Cash Pmt', 'cash'],
    ['CashSales\nRefund', 'refund'],
    ['Company\nPmt', 'company'],
    ['Expx\nPmt', 'expx'],
    ['Salary\nPmt', 'salary'],
    ['Bank Pmt', 'bank'],
    ['Cash\nDeposit', 'deposit'],
    ['Balance\nAmount', 'balance'],
    ['Cash\nAvailable', 'available']
  ]

  const message = searched
    ? 'Account Status Analysis is not yet connected to the backend. No sample transactions have been inserted or displayed as real records.'
    : 'Select a date and cashier, then click Search to run the Account Status Analysis report.'

  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            color: '#173f63',
            fontWeight: '800',
            fontSize: '12px',
            letterSpacing: '.2px'
          }}>
            ACCOUNT STATUS ANALYSIS
          </div>
          <div style={{
            color: '#66788a',
            fontSize: '12px',
            marginTop: '3px'
          }}>
            Review cashier account movements for a selected date
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            border: '1px solid #cbd7e2',
            background: '#fff',
            color: '#244e73',
            borderRadius: '6px',
            padding: '7px 12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div style={{
        maxWidth: '920px',
        margin: '0 auto',
        border: '1px solid #d5e1eb',
        borderRadius: '10px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(22, 61, 91, .06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#148dc1',
          color: '#fff',
          padding: '13px 16px',
          textAlign: 'center',
          fontWeight: '800',
          fontSize: '16px'
        }}>
          24hrs Account Status Analysis
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto',
            gap: '12px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                color: '#244e73',
                fontWeight: '700',
                fontSize: '13px',
                marginBottom: '7px'
              }}>
                Enter Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => {
                  setDate(e.target.value)
                  setSearched(false)
                }}
                style={{
                  width: '100%',
                  height: '42px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 10px',
                  fontSize: '14px',
                  color: '#173f63',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#244e73',
                fontWeight: '700',
                fontSize: '13px',
                marginBottom: '7px'
              }}>
                Cashier
              </label>
              <select
                value={cashier}
                onChange={e => {
                  setCashier(e.target.value)
                  setSearched(false)
                }}
                style={{
                  width: '100%',
                  height: '42px',
                  boxSizing: 'border-box',
                  border: '1px solid #bdccd9',
                  borderRadius: '6px',
                  padding: '0 10px',
                  fontSize: '14px',
                  color: '#173f63',
                  background: '#fff',
                  outline: 'none'
                }}
              >
                {cashierOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setSearched(true)}
              style={{
                height: '42px',
                minWidth: '104px',
                border: 'none',
                borderRadius: '6px',
                background: '#148dc1',
                color: '#fff',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </div>

          {!searched ? (
            <div style={{
              marginTop: '18px',
              border: '1px solid #dbe5ed',
              background: '#f5f8fb',
              borderRadius: '8px',
              padding: '15px 16px',
              textAlign: 'center',
              color: '#536b80',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {message}
            </div>
          ) : (
            <>
              <div style={{
                marginTop: '18px',
                border: '1px solid #dbe5ed',
                background: '#f5f8fb',
                borderRadius: '8px',
                padding: '15px 16px',
                textAlign: 'center',
                color: '#536b80',
                fontSize: '13px',
                lineHeight: '1.5'
              }}>
                {message}
              </div>

              <div style={{
                marginTop: '16px',
                border: '1px solid #dbe5ed',
                borderRadius: '8px',
                background: '#fff',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '11px 13px',
                  borderBottom: '1px solid #dbe5ed',
                  color: '#173f63',
                  fontWeight: '800',
                  fontSize: '13px'
                }}>
                  Report layout
                </div>

                <div style={{ overflowX: 'auto', maxHeight: '360px' }}>
                  <table style={{
                    borderCollapse: 'collapse',
                    minWidth: '1540px',
                    width: '100%',
                    tableLayout: 'fixed',
                    fontSize: '11px'
                  }}>
                    <thead>
                      <tr>
                        {columns.map(([label]) => (
                          <th
                            key={label}
                            style={{
                              position: 'sticky',
                              top: 0,
                              zIndex: 1,
                              background: '#148dc1',
                              color: '#fff',
                              border: '1px solid #0f7ba9',
                              padding: '7px 4px',
                              whiteSpace: 'pre-line',
                              lineHeight: '12px'
                            }}
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          colSpan={columns.length}
                          style={{
                            border: '1px solid #dbe5ed',
                            padding: '34px 16px',
                            textAlign: 'center',
                            color: '#6b7f90',
                            background: '#fafcfe'
                          }}
                        >
                          No real account-status transactions are available to display yet.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{
                marginTop: '12px',
                textAlign: 'center'
              }}>
                <button
                  onClick={() => setSearched(false)}
                  style={{
                    border: '1px solid #cbd7e2',
                    background: '#fff',
                    color: '#244e73',
                    borderRadius: '6px',
                    padding: '7px 14px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Change Search
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
};

function LoginScreen({ onLogin }) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)

  const submitLogin = async (event) => {
    event.preventDefault()

    if (!userId.trim() || !password) {
      setError('Please enter your User ID and password.')
      return
    }

    setError('')
    setIsSigningIn(true)

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim(), password })
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in.')
      }

      localStorage.setItem('theLordDoingAuthToken', data.token)
      localStorage.setItem('theLordDoingAuthUser', JSON.stringify(data.user))
      onLogin(data)
    } catch (loginError) {
      if (loginError instanceof TypeError) {
        setError('Unable to reach the backend. Please make sure the backend is running.')
      } else {
        setError(loginError.message || 'Unable to sign in.')
      }
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <div className="modern-login-page">
      <style>{`
        .modern-login-page {
          min-height: 100vh;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 34px 24px 24px;
          background: #f6faff;
          color: #10224a;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .modern-login-page * {
          box-sizing: border-box;
        }

        .login-orbit {
          position: absolute;
          width: 410px;
          height: 410px;
          border: 58px solid #e9f2ff;
          border-radius: 50%;
          pointer-events: none;
        }

        .login-orbit-left {
          top: -220px;
          left: -190px;
        }

        .login-orbit-right {
          right: -220px;
          bottom: -230px;
        }

        .login-dots {
          position: absolute;
          width: 76px;
          height: 76px;
          opacity: .75;
          background-image: radial-gradient(#b8d2f1 2px, transparent 2px);
          background-size: 18px 18px;
          pointer-events: none;
        }

        .login-dots-top {
          top: 45px;
          right: 58px;
        }

        .login-dots-bottom {
          left: 52px;
          bottom: 80px;
        }

        .login-brand {
          position: relative;
          z-index: 2;
          text-align: center;
          margin-bottom: 30px;
        }

        .login-brand-icon {
          width: 46px;
          height: 46px;
          margin: 0 auto 10px;
          color: #1264c5;
        }

        .login-company {
          margin: 0;
          color: #10224a;
          font-size: clamp(17px, 2vw, 25px);
          line-height: 1.25;
          font-weight: 800;
          letter-spacing: -.35px;
        }

        .login-branch {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-top: 10px;
          color: #1267ca;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: .2px;
        }

        .login-branch::before,
        .login-branch::after {
          content: "";
          width: 62px;
          height: 2px;
          background: #a9c8ed;
        }

        .login-card {
          position: relative;
          z-index: 2;
          width: min(895px, 100%);
          min-height: 540px;
          display: grid;
          grid-template-columns: minmax(300px, 42%) 1fr;
          gap: 0;
          padding: 26px;
          background: rgba(255, 255, 255, .97);
          border: 1px solid #e2ebf5;
          border-radius: 18px;
          box-shadow: 0 18px 45px rgba(33, 91, 145, .11);
        }

        .login-info {
          min-height: 488px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 34px 30px;
          border-radius: 12px;
          background: #eef6ff;
        }

        .store-illustration {
          width: 100%;
          max-width: 290px;
          margin: 0 auto 28px;
          color: #1264c5;
        }

        .login-info h2 {
          margin: 0;
          max-width: 300px;
          color: #101d3a;
          font-size: 27px;
          line-height: 1.18;
          letter-spacing: -.6px;
        }

        .login-info .accent-line {
          width: 70px;
          height: 3px;
          margin: 16px 0 15px;
          background: #126bd0;
          border-radius: 99px;
        }

        .login-info p {
          margin: 0;
          max-width: 300px;
          color: #536985;
          font-size: 15px;
          line-height: 1.65;
        }

        .login-form-panel {
          display: flex;
          align-items: center;
          padding: 24px 34px 24px 40px;
        }

        .login-form {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
        }

        .login-form h1 {
          margin: 0;
          color: #101d3a;
          font-size: 34px;
          line-height: 1.15;
          letter-spacing: -.8px;
        }

        .login-form-subtitle {
          margin: 8px 0 30px;
          color: #687990;
          font-size: 15px;
        }

        .login-field {
          margin-bottom: 20px;
        }

        .login-field label {
          display: block;
          margin-bottom: 8px;
          color: #263957;
          font-size: 14px;
          font-weight: 750;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          width: 20px;
          height: 20px;
          transform: translateY(-50%);
          color: #71839a;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          height: 56px;
          border: 1px solid #d2dce8;
          border-radius: 9px;
          background: #fff;
          padding: 0 16px 0 50px;
          color: #152644;
          font-size: 15px;
          outline: none;
          transition: border-color .18s ease, box-shadow .18s ease;
        }

        .login-input.password-input {
          padding-right: 52px;
        }

        .login-input::placeholder {
          color: #9aa8ba;
        }

        .login-input:focus {
          border-color: #2d7bd4;
          box-shadow: 0 0 0 3px rgba(45, 123, 212, .10);
        }

        .login-password-toggle {
          position: absolute;
          right: 13px;
          top: 50%;
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #687a91;
          cursor: pointer;
          border-radius: 6px;
        }

        .login-password-toggle:hover {
          background: #f0f5fa;
        }

        .login-form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: -7px;
          margin-bottom: 22px;
        }

        .login-forgot {
          border: none;
          background: transparent;
          padding: 4px 0;
          color: #126bd0;
          font-size: 14px;
          font-weight: 650;
          cursor: pointer;
        }

        .login-forgot:hover {
          text-decoration: underline;
        }

        .login-submit {
          width: 100%;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: none;
          border-radius: 9px;
          background: #1268c9;
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(18, 104, 201, .18);
          cursor: pointer;
          transition: transform .15s ease, background .15s ease;
        }

        .login-submit:hover {
          background: #0d5db7;
          transform: translateY(-1px);
        }

        .login-submit:disabled {
          opacity: .72;
          cursor: wait;
          transform: none;
        }

        .login-error {
          margin: -5px 0 16px;
          padding: 10px 12px;
          border: 1px solid #f1c7c7;
          border-radius: 7px;
          background: #fff6f6;
          color: #a12b2b;
          font-size: 13px;
        }

        .login-footer {
          position: relative;
          z-index: 2;
          width: min(895px, 100%);
          margin-top: 27px;
          padding-top: 15px;
          border-top: 1px solid #d4e1ee;
          text-align: center;
          color: #61748d;
          font-size: 12px;
          line-height: 1.8;
        }

        .login-footer strong {
          color: #536781;
        }

        @media (max-width: 760px) {
          .modern-login-page {
            min-height: 100svh;
            padding: 25px 15px 20px;
            overflow-y: auto;
          }

          .login-brand {
            margin-bottom: 22px;
          }

          .login-company {
            font-size: 16px;
          }

          .login-branch {
            font-size: 14px;
          }

          .login-branch::before,
          .login-branch::after {
            width: 32px;
          }

          .login-card {
            min-height: 0;
            grid-template-columns: 1fr;
            padding: 12px;
            border-radius: 14px;
          }

          .login-info {
            min-height: 0;
            padding: 25px 22px;
            text-align: center;
          }

          .store-illustration {
            max-width: 220px;
            margin-bottom: 20px;
          }

          .login-info h2,
          .login-info p {
            max-width: none;
          }

          .login-info h2 {
            font-size: 23px;
          }

          .login-info .accent-line {
            margin: 13px auto 12px;
          }

          .login-form-panel {
            padding: 30px 12px 18px;
          }

          .login-form h1 {
            font-size: 30px;
          }

          .login-form-subtitle {
            margin-bottom: 25px;
          }

          .login-orbit {
            width: 280px;
            height: 280px;
            border-width: 40px;
          }

          .login-orbit-left {
            top: -160px;
            left: -155px;
          }

          .login-orbit-right {
            right: -160px;
            bottom: -170px;
          }
        }

        @media (max-width: 420px) {
          .login-company {
            font-size: 14px;
          }

          .login-branch {
            gap: 8px;
            font-size: 13px;
          }

          .login-branch::before,
          .login-branch::after {
            width: 20px;
          }

          .login-info {
            padding: 22px 16px;
          }

          .login-form-panel {
            padding-left: 5px;
            padding-right: 5px;
          }
        }
      `}</style>

      <div className="login-orbit login-orbit-left" />
      <div className="login-orbit login-orbit-right" />
      <div className="login-dots login-dots-top" />
      <div className="login-dots login-dots-bottom" />

      <div className="login-brand">
        <svg className="login-brand-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path d="M9 27.5 15 12h34l6 15.5" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 28h40v27H12z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
          <path d="M23 55V39h10v16M42 39h-7" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
          <path d="M16 13h9l-3 15M25 13h9l-1 15M34 13h9l1 15M43 13h6l6 15" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
        </svg>
        <h2 className="login-company">THE LORD'S DOING GLOBAL CONCEPT SERVICES NIG. LTD.</h2>
        <div className="login-branch">SEMO STORE BRANCH</div>
      </div>

      <section className="login-card">
        <div className="login-info">
          <svg className="store-illustration" viewBox="0 0 340 220" fill="none" aria-hidden="true">
            <path d="M48 177h244" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
            <path d="M76 92h190v85H76z" fill="#fff" stroke="#1264c5" strokeWidth="5"/>
            <path d="M58 92 77 48h188l20 44H58Z" fill="#fff" stroke="#1264c5" strokeWidth="5" strokeLinejoin="round"/>
            <path d="M65 92h207" stroke="#1264c5" strokeWidth="5"/>
            <path d="M75 92c10 18 26 18 37 0 10 18 27 18 38 0 10 18 27 18 38 0 10 18 27 18 38 0 10 18 25 18 36 0" fill="#e9f3ff" stroke="#1264c5" strokeWidth="5"/>
            <path d="M95 177v-51h43v51" fill="#dcecff" stroke="#1264c5" strokeWidth="5"/>
            <path d="M174 130h63v47h-63z" fill="#dcecff" stroke="#1264c5" strokeWidth="5"/>
            <path d="M205 130v47" stroke="#1264c5" strokeWidth="4"/>
            <path d="M54 177c-14-10-17-25-8-37 17 6 24 22 17 37" fill="#dcecff" stroke="#1264c5" strokeWidth="4"/>
            <path d="M54 177c2-18 10-29 23-36" stroke="#1264c5" strokeWidth="4" strokeLinecap="round"/>
            <path d="M106 48V28h136v20" stroke="#1264c5" strokeWidth="5" strokeLinejoin="round"/>
          </svg>

          <h2>Inventory &amp; Store Management System</h2>
          <div className="accent-line" />
          <p>Manage your stock, sales, payments and reports all in one place.</p>
        </div>

        <div className="login-form-panel">
          <form className="login-form" onSubmit={submitLogin}>
            <h1>Welcome Back</h1>
            <p className="login-form-subtitle">Sign in to continue to your account.</p>

            <div className="login-field">
              <label htmlFor="login-user-id">User ID</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M5 20c.7-3.3 3.1-5 7-5s6.3 1.7 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <input
                  id="login-user-id"
                  className="login-input"
                  type="text"
                  value={userId}
                  onChange={event => { setUserId(event.target.value); setError('') }}
                  placeholder="Enter your User ID"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <circle cx="12" cy="15" r="1" fill="currentColor"/>
                </svg>
                <input
                  id="login-password"
                  className="login-input password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={event => { setPassword(event.target.value); setError('') }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(value => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.3A10.8 10.8 0 0 1 12 5c5 0 8.7 4.2 9.7 6.8-.4 1.1-1.3 2.5-2.7 3.7M6.2 6.2C3.9 7.8 2.6 10 2.3 11.8 3.3 14.4 7 18.6 12 18.6c1.4 0 2.7-.3 3.8-.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                      <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.8"/>
                      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="login-form-actions">
              <button
                type="button"
                className="login-forgot"
                onClick={() => setError('Please contact your administrator to reset your password.')}
              >
                Forgot password?
              </button>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit" disabled={isSigningIn}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                <path d="M14 5h5v14h-5M10 12h9M10 12l3.5-3.5M10 12l3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isSigningIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </section>

      <footer className="login-footer">
        <strong>THE LORD'S DOING GLOBAL CONCEPT SERVICES NIG. LTD.</strong><br />
        <strong>SEMO STORE BRANCH</strong><br />
        Copyright © 2026. All rights reserved.
      </footer>
    </div>
  )
}


function CashierManagement({ onBack }) {
  const emptyForm = { displayName: '', username: '', password: '' }
  const [cashiers, setCashiers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [passwords, setPasswords] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadCashiers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiFetch('/api/md-ceo/cashiers')
      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to load cashier accounts.')
      setCashiers(Array.isArray(data?.cashiers) ? data.cashiers : [])
    } catch (err) {
      setError(err?.message || 'Unable to load cashier accounts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCashiers()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const payload = {
        displayName: form.displayName.trim(),
        username: form.username.trim()
      }

      if (!payload.displayName || !payload.username) {
        throw new Error('Cashier name and User ID are required.')
      }

      if (!editingId && !form.password.trim()) {
        throw new Error('Password is required when creating a cashier.')
      }

      if (!editingId) payload.password = form.password

      const response = await apiFetch(
        editingId ? `/api/md-ceo/cashiers/${editingId}` : '/api/md-ceo/cashiers',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to save cashier account.')

      setMessage(editingId ? 'Cashier account updated successfully.' : 'Cashier account created successfully.')
      resetForm()
      await loadCashiers()
    } catch (err) {
      setError(err?.message || 'Unable to save cashier account.')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (cashier) => {
    setEditingId(cashier.id)
    setForm({
      displayName: cashier.displayName || '',
      username: cashier.username || '',
      password: ''
    })
    setError('')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleStatus = async (cashier) => {
    const nextStatus = cashier.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setBusyId(cashier.id)
    setError('')
    setMessage('')

    try {
      const response = await apiFetch(`/api/md-ceo/cashiers/${cashier.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to change cashier status.')
      setMessage(`${cashier.displayName || cashier.username} is now ${nextStatus === 'ACTIVE' ? 'active' : 'inactive'}.`)
      await loadCashiers()
    } catch (err) {
      setError(err?.message || 'Unable to change cashier status.')
    } finally {
      setBusyId(null)
    }
  }

  const resetPassword = async (cashier) => {
    const password = String(passwords[cashier.id] || '')
    if (!password.trim()) {
      setError('Enter a new password before resetting the cashier password.')
      setMessage('')
      return
    }

    setBusyId(cashier.id)
    setError('')
    setMessage('')

    try {
      const response = await apiFetch(`/api/md-ceo/cashiers/${cashier.id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to reset cashier password.')
      setPasswords(prev => ({ ...prev, [cashier.id]: '' }))
      setMessage(`Password reset successfully for ${cashier.displayName || cashier.username}.`)
    } catch (err) {
      setError(err?.message || 'Unable to reset cashier password.')
    } finally {
      setBusyId(null)
    }
  }

  const fieldStyle = {
    width: '100%',
    height: '38px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    background: '#fff',
    padding: '7px 9px',
    outline: 'none'
  }

  const primaryButton = {
    background: '#1593c8',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 16px',
    fontWeight: '700',
    cursor: 'pointer'
  }

  const secondaryButton = {
    background: '#fff',
    color: '#1683b5',
    border: '1px solid #168bbd',
    borderRadius: '5px',
    padding: '8px 16px',
    fontWeight: '700',
    cursor: 'pointer'
  }

  return (
    <div style={{ minHeight: '100%', position: 'relative' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', marginBottom:'12px' }}>
        <div>
          <div style={{ color:'#173f63', fontWeight:'800', fontSize:'18px', letterSpacing:'.2px' }}>
            Cashier Management
          </div>
          <div style={{ color:'#66788a', fontSize:'12px', marginTop:'3px' }}>
            Create and maintain cashier login accounts for the Cashier Desk.
          </div>
        </div>
        <button onClick={onBack} style={{ border:'1px solid #cbd7e2', background:'#fff', color:'#244e73', borderRadius:'6px', padding:'7px 12px', fontWeight:'700', cursor:'pointer' }}>
          ← Back
        </button>
      </div>

      {(error || message) && (
        <div style={{ margin:'0 auto 12px', maxWidth:'1100px', padding:'10px 12px', borderRadius:'5px', border:`1px solid ${error ? '#e0a1a1' : '#9bcbb0'}`, background:error ? '#fff5f5' : '#f1fff6', color:error ? '#9b2c2c' : '#23623d', fontSize:'13px', fontWeight:'700' }}>
          {error || message}
        </div>
      )}

      <div style={{ maxWidth:'1100px', margin:'0 auto 16px', border:'1px solid #168bbd', borderRadius:'8px', background:'#f5fff5', boxShadow:'0 2px 8px rgba(22, 61, 91, .08)', overflow:'hidden' }}>
        <div style={{ background:'#1593c8', color:'#fff', textAlign:'center', fontWeight:'800', padding:'11px 14px', fontSize:'17px' }}>
          {editingId ? 'EDIT CASHIER ACCOUNT' : 'REGISTER CASHIER'}
        </div>

        <form onSubmit={handleSubmit} style={{ padding:'18px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:'14px 18px' }}>
            <div>
              <label style={{ display:'block', color:'#244e73', fontWeight:'700', fontSize:'13px', marginBottom:'6px' }}>Cashier Name</label>
              <input value={form.displayName} onChange={e => setForm(prev => ({ ...prev, displayName:e.target.value }))} placeholder="Full name" style={fieldStyle} />
            </div>
            <div>
              <label style={{ display:'block', color:'#244e73', fontWeight:'700', fontSize:'13px', marginBottom:'6px' }}>User ID</label>
              <input value={form.username} onChange={e => setForm(prev => ({ ...prev, username:e.target.value }))} placeholder="Cashier user ID" style={fieldStyle} autoComplete="off" />
            </div>
            {!editingId && (
              <div>
                <label style={{ display:'block', color:'#244e73', fontWeight:'700', fontSize:'13px', marginBottom:'6px' }}>Password</label>
                <input type="password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password:e.target.value }))} placeholder="Initial password" style={fieldStyle} autoComplete="new-password" />
              </div>
            )}
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:'9px', marginTop:'18px' }}>
            <button type="submit" disabled={saving} style={{ ...primaryButton, opacity:saving ? .65 : 1 }}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Register Cashier'}
            </button>
            <button type="button" onClick={resetForm} style={secondaryButton}>
              {editingId ? 'Cancel Edit' : 'Clear'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', border:'1px solid #168bbd', borderRadius:'8px', background:'#f5fff5', boxShadow:'0 2px 8px rgba(22, 61, 91, .08)', overflow:'hidden' }}>
        <div style={{ background:'#1593c8', color:'#fff', fontWeight:'800', textAlign:'center', padding:'11px 14px', fontSize:'16px' }}>
          CASHIER ACCOUNTS
        </div>

        <div style={{ padding:'14px', overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px', minWidth:'900px' }}>
            <thead>
              <tr>
                {['S/N','Cashier Name','User ID','Status','Created','Password Reset','Actions'].map(h => (
                  <th key={h} style={{ background:'#1593c8', color:'#fff', border:'1px solid #168bbd', padding:'8px', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ border:'1px solid #168bbd', padding:'18px', textAlign:'center', color:'#667788' }}>Loading cashier accounts...</td></tr>
              ) : cashiers.length === 0 ? (
                <tr><td colSpan="7" style={{ border:'1px solid #168bbd', padding:'18px', textAlign:'center', color:'#667788' }}>No cashier accounts have been registered yet.</td></tr>
              ) : (
                cashiers.map((cashier, index) => (
                  <tr key={cashier.id}>
                    <td style={{ border:'1px solid #168bbd', padding:'8px' }}>{index + 1}</td>
                    <td style={{ border:'1px solid #168bbd', padding:'8px', fontWeight:'700', color:'#244e73' }}>{cashier.displayName || '—'}</td>
                    <td style={{ border:'1px solid #168bbd', padding:'8px' }}>{cashier.username}</td>
                    <td style={{ border:'1px solid #168bbd', padding:'8px' }}>
                      <span style={{ display:'inline-block', padding:'4px 8px', borderRadius:'12px', fontWeight:'800', fontSize:'11px', background:cashier.status === 'ACTIVE' ? '#e7f7ed' : '#fff0f0', color:cashier.status === 'ACTIVE' ? '#267044' : '#a03a3a' }}>
                        {cashier.status}
                      </span>
                    </td>
                    <td style={{ border:'1px solid #168bbd', padding:'8px', whiteSpace:'nowrap' }}>
                      {cashier.createdAt ? new Date(cashier.createdAt).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td style={{ border:'1px solid #168bbd', padding:'7px' }}>
                      <div style={{ display:'flex', gap:'5px', minWidth:'190px' }}>
                        <input type="password" value={passwords[cashier.id] || ''} onChange={e => setPasswords(prev => ({ ...prev, [cashier.id]:e.target.value }))} placeholder="New password" style={{ ...fieldStyle, height:'34px' }} autoComplete="new-password" />
                        <button type="button" onClick={() => resetPassword(cashier)} disabled={busyId === cashier.id} style={{ ...secondaryButton, padding:'6px 9px', whiteSpace:'nowrap', opacity:busyId === cashier.id ? .65 : 1 }}>
                          Reset
                        </button>
                      </div>
                    </td>
                    <td style={{ border:'1px solid #168bbd', padding:'7px' }}>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                        <button type="button" onClick={() => startEdit(cashier)} style={{ ...secondaryButton, padding:'6px 9px' }}>Edit</button>
                        <button type="button" onClick={() => toggleStatus(cashier)} disabled={busyId === cashier.id} style={{ ...primaryButton, padding:'6px 9px', background:cashier.status === 'ACTIVE' ? '#b34b4b' : '#1593c8', opacity:busyId === cashier.id ? .65 : 1 }}>
                          {cashier.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ margin:'0 14px 14px', padding:'10px 12px', background:'#fff', border:'1px solid #c8d7e1', borderRadius:'5px', fontSize:'12px', color:'#667788' }}>
          Cashiers use the existing login screen with their User ID and password. Inactive cashier accounts cannot authenticate into the platform.
        </div>
      </div>
    </div>
  )
}


function CashierDesk({ authUser, onLogout }) {
  const [active, setActive] = useState('CashSales Payment')
  const [banks, setBanks] = useState([])
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [loading, setLoading] = useState(false)
  const [cashSalesQueue, setCashSalesQueue] = useState([])
  const [selectedSale, setSelectedSale] = useState(null)
  const [payment, setPayment] = useState({ transfer: '', pos: '', cash: '' })
  const [cashSalesReceipt, setCashSalesReceipt] = useState(null)
  const [showCashSalesReprint, setShowCashSalesReprint] = useState(false)
  const [cashSalesReprintRef, setCashSalesReprintRef] = useState('')
  const [cashSalesReprintReceipt, setCashSalesReprintReceipt] = useState(null)
  const [cashSalesReprintLoading, setCashSalesReprintLoading] = useState(false)
  const [cashSalesReprintMessage, setCashSalesReprintMessage] = useState('Enter a paid CashSales reference number to search.')
  const [cashSalesReprintMessageType, setCashSalesReprintMessageType] = useState('info')

  const [payIn, setPayIn] = useState({ source: '', amount: '', bankAccountId: '', reference: '', note: '' })
  const [deposit, setDeposit] = useState({ amount: '', bankAccountId: '', reference: '', note: '' })
  const [expense, setExpense] = useState({ description: '', amount: '', category: '', note: '' })
  const [lodgement, setLodgement] = useState({ bankAccountId: '', amount: '', reference: '', note: '' })
  const [nypPayment, setNypPayment] = useState({ nypCustomerId: '', amount: '', reference: '', note: '' })
  const [nypCustomers, setNypCustomers] = useState([])

  const fieldStyle = {
    width: '100%',
    height: '38px',
    boxSizing: 'border-box',
    border: '1px solid #9fb4c5',
    borderRadius: '4px',
    background: '#fff',
    padding: '7px 9px',
    outline: 'none'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: '#244e73',
    fontWeight: '800',
    fontSize: '12px'
  }

  const textareaStyle = {
    ...fieldStyle,
    height: '80px',
    resize: 'vertical'
  }

  const operations = [
    'CashSales Payment',
    'External Cash PAY-IN',
    'Cash Deposit',
    'Expenses',
      'Bank Lodgement',
  'NYP Supplies',
  'NYP Payment'
  ]

  const endpointMap = {
    'External Cash PAY-IN': '/api/cashier/external-cash-payin',
    'Cash Deposit': '/api/cashier/cash-deposits',
    'Expenses': '/api/cashier/expenses',
    'Bank Lodgement': '/api/cashier/bank-lodgements',
    'NYP Payment': '/api/cashier/nyp-payments'
  }

  const loadNypCustomers = async () => {
    try {
      const response = await apiFetch('/api/cashier/nyp-customers')
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to load NYP accounts.')
      setNypCustomers(data.customers || [])
    } catch (error) {
      setNypCustomers([])
      setMessage(error.message || 'Unable to load NYP accounts.')
      setMessageType('error')
    }
  }

  const loadBanks = async () => {
    try {
      const response = await apiFetch('/api/cashier/banks')
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to load bank accounts.')
      setBanks(data.banks || [])
    } catch (error) {
      setMessage(error.message || 'Unable to load bank accounts.')
      setMessageType('error')
    }
  }

  const loadRows = async (operation = active) => {
    if (operation === 'CashSales Payment') return
    try {
      const response = await apiFetch(`${endpointMap[operation]}?limit=25`)
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to load transaction history.')
      setRows(data.rows || [])
    } catch (error) {
      setRows([])
      setMessage(error.message || 'Unable to load transaction history.')
      setMessageType('error')
    }
  }
  const loadNypSupplies = async () => {
    setLoading(true)

    try {
      const response = await apiFetch('/api/cashier/nyp-sales?limit=50')
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load NYP supply invoices.')
      }

      setRows(data.rows || [])
    } catch (error) {
      setRows([])
      setMessage(error.message || 'Unable to load NYP supply invoices.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }
  const loadCashSalesQueue = async () => {
    try {
      const response = await apiFetch('/api/cashier/cashsales-payment?limit=50')
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to load CashSales Payment queue.')
      setCashSalesQueue(data.rows || [])
      if (selectedSale) {
        const refreshed = (data.rows || []).find(item => Number(item.id) === Number(selectedSale.id))
        if (refreshed) setSelectedSale(refreshed)
      }
    } catch (error) {
      setCashSalesQueue([])
      setMessage(error.message || 'Unable to load CashSales Payment queue.')
      setMessageType('error')
    }
  }

  const searchCashSalesReprint = async () => {
    const value = cashSalesReprintRef.trim()
    if (!value) {
      setCashSalesReprintReceipt(null)
      setCashSalesReprintMessage('Please enter a CashSales reference number.')
      setCashSalesReprintMessageType('error')
      return
    }

    setCashSalesReprintLoading(true)
    setCashSalesReprintMessage('')
    setCashSalesReprintMessageType('info')

    try {
      const response = await apiFetch(`/api/cashier/cashsales-reprint?refNo=${encodeURIComponent(value)}`)
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to load CashSales reprint record.')
      setCashSalesReprintReceipt(data.receipt || null)
      if (!data.receipt) throw new Error('No paid CashSales receipt was returned.')
    } catch (error) {
      setCashSalesReprintReceipt(null)
      setCashSalesReprintMessage(error.message || 'Unable to load CashSales reprint record.')
      setCashSalesReprintMessageType('error')
    } finally {
      setCashSalesReprintLoading(false)
    }
  }

  const openCashSalesReprint = () => {
    setShowCashSalesReprint(true)
    setCashSalesReprintRef('')
    setCashSalesReprintReceipt(null)
    setCashSalesReprintMessage('Enter a paid CashSales reference number to search.')
    setCashSalesReprintMessageType('info')
  }

  const closeCashSalesReprint = () => {
    setShowCashSalesReprint(false)
    setCashSalesReprintRef('')
    setCashSalesReprintReceipt(null)
    setCashSalesReprintMessage('Enter a paid CashSales reference number to search.')
    setCashSalesReprintMessageType('info')
  }

  useEffect(() => {
    loadBanks()
    loadNypCustomers()
    loadCashSalesQueue()
  }, [])

  useEffect(() => {
    setMessage('')
    setMessageType('info')

if (active === 'CashSales Payment') {
  loadCashSalesQueue()
} else if (active === 'NYP Supplies') {
  loadNypSupplies()
} else {
  loadRows(active)
}

  }, [active])

  const selectOperation = (operation) => {
    setActive(operation)
    if (operation !== 'CashSales Payment') {
      setSelectedSale(null)
      setPayment({ transfer: '', pos: '', cash: '' })
      setCashSalesReceipt(null)
    }
  }

  const resetCurrentForm = () => {
    if (active === 'External Cash PAY-IN') {
      setPayIn({ source: '', amount: '', bankAccountId: '', reference: '', note: '' })
    } else if (active === 'Cash Deposit') {
      setDeposit({ amount: '', bankAccountId: '', reference: '', note: '' })
    } else if (active === 'Expenses') {
      setExpense({ description: '', amount: '', category: '', note: '' })
    } else if (active === 'Bank Lodgement') {
      setLodgement({ bankAccountId: '', amount: '', reference: '', note: '' })
    } else {
      setNypPayment({ nypCustomerId: '', amount: '', reference: '', note: '' })
    }
  }

  const submitOperation = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    let payload
    if (active === 'External Cash PAY-IN') {
      payload = { source: payIn.source.trim(), amount: Number(payIn.amount), bankAccountId: payIn.bankAccountId ? Number(payIn.bankAccountId) : null, reference: payIn.reference.trim() || undefined, note: payIn.note.trim() || undefined }
    } else if (active === 'Cash Deposit') {
      payload = { amount: Number(deposit.amount), bankAccountId: deposit.bankAccountId ? Number(deposit.bankAccountId) : null, reference: deposit.reference.trim() || undefined, note: deposit.note.trim() || undefined }
    } else if (active === 'Expenses') {
      payload = { description: expense.description.trim(), amount: Number(expense.amount), category: expense.category.trim() || undefined, note: expense.note.trim() || undefined }
    } else if (active === 'Bank Lodgement') {
      payload = { bankAccountId: Number(lodgement.bankAccountId), amount: Number(lodgement.amount), reference: lodgement.reference.trim() || undefined, note: lodgement.note.trim() || undefined }
    } else {
      payload = { nypCustomerId: Number(nypPayment.nypCustomerId), amount: Number(nypPayment.amount), reference: nypPayment.reference.trim() || undefined, note: nypPayment.note.trim() || undefined }
    }

    try {
      const response = await apiFetch(endpointMap[active], { method: 'POST', body: JSON.stringify(payload) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to save transaction.')
      setMessage(data.message || 'Transaction recorded successfully.')
      setMessageType('success')
      resetCurrentForm()
      await loadRows(active)
      if (active === 'NYP Payment') await loadNypCustomers()
    } catch (error) {
      setMessage(error.message || 'Unable to save transaction.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const formatMoney = (value) => Number(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formatDate = (value) => value ? new Date(value).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : '-'
  const bankLabel = (bank) => `${bank.bankName} — ${bank.accountName} (${bank.accountId})`

  const selectSale = (sale) => {
    setSelectedSale(sale)
    setPayment({ transfer: '', pos: '', cash: '' })
    setMessage('')
    setMessageType('info')
  }

  const paymentTotal = Number(payment.transfer || 0) + Number(payment.pos || 0) + Number(payment.cash || 0)
  const saleTotal = Number(selectedSale?.totalAmount || 0)
  const remainingAmount = Math.max(saleTotal - Number(selectedSale?.paidAmount || 0), 0)
  const paymentMatches = Math.abs(paymentTotal - remainingAmount) < 0.005 && paymentTotal > 0

  const confirmCashSalePayment = async () => {
    if (!selectedSale) return
    if (!paymentMatches) {
      setMessage(`Payment total must equal the amount due: ₦${formatMoney(remainingAmount)}.`)
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const response = await apiFetch(`/api/cashier/cashsales-payment/${selectedSale.id}`, {
        method: 'POST',
        body: JSON.stringify({
          transferAmount: Number(payment.transfer || 0),
          posAmount: Number(payment.pos || 0),
          cashAmount: Number(payment.cash || 0)
        })
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to confirm CashSales payment.')

      setCashSalesReceipt(data.receipt)
      setSelectedSale(null)
      setPayment({ transfer: '', pos: '', cash: '' })
      setMessage('')
      setMessageType('success')
      await loadCashSalesQueue()
    } catch (error) {
      setMessage(error.message || 'Unable to confirm CashSales payment.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  if (cashSalesReceipt) {
    const receiptDate = new Date(cashSalesReceipt.paymentDate)
    return (
      <div className="cashier-print-screen" style={{ minHeight: '100vh', background: '#f6faff', padding: '24px', color: '#10224a' }}>
        <style>{`
          @media print {
            @page { size: 80mm auto; margin: 0; }
            body * { visibility: hidden !important; }
            .cashsales-thermal-printable, .cashsales-thermal-printable * { visibility: visible !important; }
            .cashsales-thermal-printable { position: absolute !important; left: 0 !important; top: 0 !important; width: 72mm !important; margin: 0 !important; }
            .no-print { display: none !important; }
          }
        `}</style>
        <div className="cashsales-thermal-printable" style={{ width: '72mm', margin: '0 auto', background: '#fff', padding: '3mm', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', color: '#111', fontSize: '11px' }}>
          <div style={{ textAlign: 'center', fontWeight: '900', fontSize: '20px', letterSpacing: '.5px' }}>PAID</div>
          <div style={{ textAlign: 'center', marginTop: '3px', fontWeight: '900', fontSize: '12px', lineHeight: '1.2' }}>THE LORD'S DOING</div>
          <div style={{ textAlign: 'center', fontWeight: '900', fontSize: '11px', lineHeight: '1.2' }}>GLOBAL CONCEPT SERVICES NIG. LTD</div>
          <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '9px' }}>SHOP No 1: Idi-Ayunre • Oyo State</div>
          <div style={{ textAlign: 'center', fontSize: '9px' }}>GSM No: 08150426736</div>
          <div style={{ borderTop: '1px dashed #111', margin: '7px 0' }} />

          <div style={{ textAlign: 'center', fontWeight: '900', fontSize: '13px' }}>CASHSALES INVOICE</div>
          <div style={{ textAlign: 'center', fontWeight: '800', marginTop: '2px', fontSize: '10px' }}>Ref No: {cashSalesReceipt.invoiceNo}</div>

          <div style={{ marginTop: '7px', fontSize: '9px', lineHeight: '1.45' }}>
            <div><strong>Customer:</strong> {cashSalesReceipt.customerName || '—'}</div>
            <div><strong>Staff:</strong> {cashSalesReceipt.salesStaff || '—'}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}><span><strong>Date:</strong> {receiptDate.toLocaleDateString('en-GB')}</span><span><strong>Time:</strong> {receiptDate.toLocaleTimeString('en-GB')}</span></div>
          </div>

          <div style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111', marginTop: '7px', padding: '4px 0', fontWeight: '900', fontSize: '9px', display: 'grid', gridTemplateColumns: '1fr 30px 54px 54px', gap: '3px' }}>
            <span>STOCK NAME</span><span style={{ textAlign: 'center' }}>QTY</span><span style={{ textAlign: 'right' }}>PRICE</span><span style={{ textAlign: 'right' }}>TOTAL</span>
          </div>

          {(cashSalesReceipt.lines || []).map((line, index) => (
            <div key={line.id || index} style={{ borderBottom: '1px dotted #777', padding: '5px 0', fontSize: '9px' }}>
              <div style={{ fontWeight: '800', lineHeight: '1.2', marginBottom: '2px' }}>{line.stockName}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 30px 54px 54px', gap: '3px', alignItems: 'start' }}>
                <span></span>
                <span style={{ textAlign: 'center', fontWeight: '800' }}>{line.quantity}<br />{line.rate === 'Carton' ? 'CTN' : line.rate === 'Half Ctn' ? 'HALF' : line.rate === 'Quarter Ctn' ? 'QRT' : 'UNIT'}</span>
                <span style={{ textAlign: 'right' }}>{formatMoney(line.unitPrice)}</span>
                <span style={{ textAlign: 'right', fontWeight: '800' }}>{formatMoney(line.lineTotal)}</span>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '6px', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span>TOTAL AMOUNT:</span><strong>{formatMoney(cashSalesReceipt.totalAmount)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span>TOTAL DISCT:</span><strong>{formatMoney((cashSalesReceipt.lines || []).reduce((sum, line) => sum + Number(line.discount || 0), 0))}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontWeight: '900' }}><span>ACTUAL AMOUNT:</span><strong>{formatMoney(cashSalesReceipt.totalAmount)}</strong></div>
          </div>

          <div style={{ borderTop: '1px solid #111', marginTop: '5px', paddingTop: '5px', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>TRANSFER:</span><strong>{formatMoney(cashSalesReceipt.transferAmount)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>POS:</span><strong>{formatMoney(cashSalesReceipt.posAmount)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>CASH:</span><strong>{formatMoney(cashSalesReceipt.cashAmount)}</strong></div>
          </div>

          <div style={{ borderTop: '1px dashed #111', marginTop: '7px', paddingTop: '5px', fontSize: '8px', lineHeight: '1.35' }}>
            <strong>PLEASE NOTE</strong><br />
            Goods Received In Good Condition Are Not Returnable.
          </div>
        </div>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '18px' }}>
          <button onClick={() => { setCashSalesReceipt(null); setActive('CashSales Payment'); loadCashSalesQueue() }} style={{ border: '1px solid #cbd7e2', background: '#fff', color: '#244e73', borderRadius: '6px', padding: '9px 18px', fontWeight: '800', cursor: 'pointer' }}>Back to Cashier</button>
          <button onClick={() => window.print()} style={{ border: 'none', background: '#148dc1', color: '#fff', borderRadius: '6px', padding: '9px 22px', fontWeight: '800', cursor: 'pointer' }}>Print Invoice</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6faff', color: '#10224a', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
    <style>{`@media print { @page { size: 80mm 115mm; margin: 0; } html, body { width: 80mm !important; min-width: 80mm !important; margin: 0 !important; padding: 0 !important; background: #fff !important; } body * { visibility: hidden !important; } .cashsales-reprint-printable, .cashsales-reprint-printable * { visibility: visible !important; } .cashsales-reprint-printable { position: absolute !important; left: 4mm !important; top: 0 !important; width: 72mm !important; margin: 0 !important; } .cashsales-reprint-preview { border: none !important; box-shadow: none !important; width: 80mm !important; padding: 4mm !important; margin: 0 !important; } .no-print { display: none !important; } }`}</style>
      <header style={{ height: '58px', background: '#10224a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', boxSizing: 'border-box' }}>
        <div><div style={{ fontWeight: '850', fontSize: '14px', letterSpacing: '.3px' }}>THE LORD'S DOING GLOBAL CONCEPT SERVICES NIG. LTD</div><div style={{ fontSize: '10px', opacity: .72, marginTop: '2px' }}>CASHIER DESK</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{active === 'CashSales Payment' && <button onClick={openCashSalesReprint} style={{ border: '1px solid #8fb1d1', background: '#fff', color: '#10224a', borderRadius: '5px', padding: '6px 9px', fontWeight: '850', fontSize: '10px', cursor: 'pointer' }}>CashSales Reprint</button>}<div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', fontWeight: '800' }}>{authUser?.displayName || authUser?.username || 'Cashier'}</div><div style={{ fontSize: '10px', opacity: .7 }}>CASHIER</div></div><button onClick={onLogout} style={{ border: '1px solid #6680a8', background: 'transparent', color: '#fff', borderRadius: '6px', padding: '7px 12px', fontWeight: '800', cursor: 'pointer' }}>Logout</button></div>
      </header>
      <div style={{ height: '36px', background: '#edf5ff', color: '#1268c9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '850' }}>CASHIER OPERATIONS</div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 94px)', gap: '16px', padding: '14px', boxSizing: 'border-box' }}>
        <aside style={{ width: '250px', minWidth: '250px', background: '#f7fbff', border: '1px solid #d7e5f2', borderRadius: '12px', boxShadow: '0 8px 24px rgba(16,34,74,.08)', padding: '10px', boxSizing: 'border-box', alignSelf: 'flex-start' }}>
          <div style={{ background: '#1268c9', color: '#fff', borderRadius: '8px', padding: '13px 14px', fontWeight: '850', fontSize: '13px', marginBottom: '8px' }}>CASHIER MENU</div>
          {operations.map(operation => <button key={operation} onClick={() => selectOperation(operation)} style={{ width: '100%', textAlign: 'left', border: active === operation ? '1px solid #1268c9' : '1px solid #d9e5f0', background: active === operation ? '#eaf3ff' : '#fff', color: active === operation ? '#1268c9' : '#10224a', borderRadius: '7px', padding: '11px 12px', marginBottom: '7px', cursor: 'pointer', fontWeight: active === operation ? '850' : '700', fontSize: '12px' }}>{operation}</button>)}
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}><div><div style={{ color: '#173f63', fontWeight: '850', fontSize: '19px' }}>{active}</div><div style={{ color: '#66788a', fontSize: '12px', marginTop: '3px' }}>{active === 'CashSales Payment' ? 'Complete payment for submitted CashSales invoices. Transfer + POS + Cash must equal the invoice total.' : 'Record this cashier transaction. The logged-in cashier is automatically attached to the record.'}</div></div><div style={{ background: '#fff', border: '1px solid #cbdceb', borderRadius: '7px', padding: '8px 11px', fontSize: '11px', color: '#52708b', whiteSpace: 'nowrap' }}>{authUser?.username}</div></div>

          {message && <div style={{ marginBottom: '12px', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${messageType === 'success' ? '#9bd3a8' : messageType === 'error' ? '#e4aaaa' : '#b9ccdd'}`, background: messageType === 'success' ? '#effcf2' : messageType === 'error' ? '#fff4f4' : '#fff', color: messageType === 'success' ? '#23733b' : messageType === 'error' ? '#9a3030' : '#42637d', fontSize: '12px', fontWeight: '700' }}>{message}</div>}

{active === 'NYP Supplies' ? (
  <section style={{ background: '#fff', border: '1px solid #cbdceb', borderRadius: '10px', padding: '16px', overflowX: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
      <div>
        <div style={{ color: '#173f63', fontWeight: '850', fontSize: '16px' }}>NYP CREDIT SUPPLIES — INVOICES</div>
        <div style={{ color: '#66788a', fontSize: '12px', marginTop: '4px' }}>Credit supplies issued to NYP customers. Payments are recorded separately under NYP Payment.</div>
      </div>
      <button type="button" onClick={loadNypSupplies} disabled={loading} style={{ padding: '9px 13px', border: '1px solid #8fb1d1', borderRadius: '6px', background: '#f7fbff', color: '#173f63', fontWeight: '800', cursor: 'pointer' }}>
        {loading ? 'Loading...' : 'Refresh'}
      </button>
    </div>

    {loading ? (
      <div style={{ padding: '24px', textAlign: 'center', color: '#66788a' }}>Loading NYP supply invoices...</div>
    ) : rows.length === 0 ? (
      <div style={{ padding: '24px', textAlign: 'center', color: '#66788a' }}>No NYP supply invoices found.</div>
    ) : (
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px', fontSize: '12px' }}>
        <thead>
          <tr style={{ background: '#edf5ff', color: '#173f63', textAlign: 'left' }}>
            {['S/N', 'Date', 'Invoice No.', 'NYP ID', 'Customer', 'Items Supplied', 'Total Amount', 'Status'].map(label => (
              <th key={label} style={{ padding: '11px 9px', borderBottom: '1px solid #cbdceb', whiteSpace: 'nowrap' }}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || row.invoiceNo}>
              <td style={{ padding: '11px 9px', borderBottom: '1px solid #e5edf5' }}>{index + 1}</td>
              <td style={{ padding: '11px 9px', borderBottom: '1px solid #e5edf5', whiteSpace: 'nowrap' }}>{formatDate(row.saleDate)}</td>
              <td style={{ padding: '11px 9px', borderBottom: '1px solid #e5edf5', fontWeight: '800' }}>{row.invoiceNo}</td>
              <td style={{ padding: '11px 9px', borderBottom: '1px solid #e5edf5' }}>{row.nypCustomer?.nypId || '-'}</td>
              <td style={{ padding: '11px 9px', borderBottom: '1px solid #e5edf5' }}>{row.nypCustomer?.fullName || '-'}</td>
              <td style={{ padding: '11px 9px', borderBottom: '1px solid #e5edf5', minWidth: '220px' }}>
                {(row.lines || []).map(line => `${line.product?.stockName || 'Item'} × ${Number(line.quantity || 0).toLocaleString('en-NG')}`).join(', ') || '-'}
              </td>
              <td style={{ padding: '11px 9px', borderBottom: '1px solid #e5edf5', whiteSpace: 'nowrap', fontWeight: '800' }}>₦{formatMoney(row.totalAmount)}</td>
              <td style={{ padding: '11px 9px', borderBottom: '1px solid #e5edf5', whiteSpace: 'nowrap' }}>
                <span style={{ display: 'inline-block', background: '#fff4d6', color: '#875900', padding: '5px 7px', borderRadius: '5px', fontWeight: '800', fontSize: '10px' }}>CREDIT SUPPLY</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </section>
) :
   active === 'CashSales Payment' ? (
            <>
              {showCashSalesReprint && <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(16,34,74,.38)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '30px 14px', overflowY: 'auto', boxSizing: 'border-box' }}>
                <div style={{ width: '100%', maxWidth: '980px', background: '#fff', borderRadius: '10px', boxShadow: '0 16px 50px rgba(16,34,74,.24)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: '#1268c9', color: '#fff', padding: '11px 14px' }}>
                    <div style={{ fontWeight: '850', fontSize: '14px' }}>CASHSALES REPRINT</div>
                    <button type="button" onClick={closeCashSalesReprint} style={{ border: '1px solid rgba(255,255,255,.55)', background: 'transparent', color: '#fff', borderRadius: '5px', padding: '5px 10px', fontWeight: '800', cursor: 'pointer' }}>Close</button>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', maxWidth: '620px', margin: '0 auto' }}>
                      <input autoFocus value={cashSalesReprintRef} onChange={e => { setCashSalesReprintRef(e.target.value); setCashSalesReprintReceipt(null); setCashSalesReprintMessage(''); setCashSalesReprintMessageType('info') }} onKeyDown={e => { if (e.key === 'Enter') searchCashSalesReprint() }} placeholder="Enter CashSales Ref No e.g. CS-0001" style={{ flex: 1, height: '40px', boxSizing: 'border-box', border: '1px solid #bdccd9', borderRadius: '6px', padding: '0 10px', color: '#173f63' }} />
                      <button type="button" onClick={searchCashSalesReprint} disabled={cashSalesReprintLoading} style={{ minWidth: '90px', border: 'none', borderRadius: '6px', background: cashSalesReprintLoading ? '#9fb4c8' : '#1593c8', color: '#fff', fontWeight: '850', cursor: cashSalesReprintLoading ? 'wait' : 'pointer' }}>{cashSalesReprintLoading ? 'Searching...' : 'Search'}</button>
                    </div>
                    {cashSalesReprintMessage && <div style={{ maxWidth: '620px', margin: '12px auto 0', padding: '10px 12px', borderRadius: '6px', border: `1px solid ${cashSalesReprintMessageType === 'error' ? '#e4aaaa' : '#b9ccdd'}`, background: cashSalesReprintMessageType === 'error' ? '#fff4f4' : '#f5f8fb', color: cashSalesReprintMessageType === 'error' ? '#9a3030' : '#42637d', fontSize: '12px', fontWeight: '700', textAlign: 'center' }}>{cashSalesReprintMessage}</div>}
                    {cashSalesReprintReceipt && (() => {
                      const printDate = new Date(cashSalesReprintReceipt.paymentDate)
                      const discountTotal = (cashSalesReprintReceipt.lines || []).reduce((sum, line) => sum + Number(line.discount || 0), 0)
                      return <div style={{ marginTop: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                          <div className="cashsales-reprint-preview" style={{ width: '80mm', maxWidth: '100%', background: '#fff', border: '1px solid #d5e1eb', padding: '4mm', boxSizing: 'border-box', boxShadow: '0 3px 14px rgba(16,34,74,.10)' }}>
                            <div className="cashsales-reprint-printable" style={{ width: '72mm', maxWidth: '100%', margin: '0 auto', fontFamily: 'Arial, sans-serif', color: '#111', fontSize: '11px' }}>
                              <div style={{ textAlign: 'center', fontWeight: '900', fontSize: '20px' }}>PAID</div>
                              <div style={{ textAlign: 'center', marginTop: '3px', fontWeight: '900', fontSize: '12px' }}>THE LORD'S DOING</div>
                              <div style={{ textAlign: 'center', fontWeight: '900', fontSize: '11px', lineHeight: '1.2' }}>GLOBAL CONCEPT SERVICES NIG. LTD</div>
                              <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '9px' }}>SHOP No 1: Idi-Ayunre • Oyo State</div>
                              <div style={{ textAlign: 'center', fontSize: '9px' }}>GSM No: 08150426736</div>
                              <div style={{ borderTop: '1px dashed #111', margin: '7px 0' }} />
                              <div style={{ textAlign: 'center', fontWeight: '900', fontSize: '13px' }}>CASHSALES INVOICE</div>
                              <div style={{ textAlign: 'center', fontWeight: '800', marginTop: '2px', fontSize: '10px' }}>Ref No: {cashSalesReprintReceipt.invoiceNo}</div>
                              <div style={{ marginTop: '7px', fontSize: '9px', lineHeight: '1.45' }}>
                                <div><strong>Customer:</strong> {cashSalesReprintReceipt.customerName || '—'}</div>
                                <div><strong>Sales Staff:</strong> {cashSalesReprintReceipt.salesStaff || '—'}</div>
                                <div><strong>Cashier:</strong> {cashSalesReprintReceipt.cashierName || '—'}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}><span><strong>Date:</strong> {printDate.toLocaleDateString('en-GB')}</span><span><strong>Time:</strong> {printDate.toLocaleTimeString('en-GB')}</span></div>
                              </div>
                              <div style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111', marginTop: '7px', padding: '4px 0', fontWeight: '900', fontSize: '9px', display: 'grid', gridTemplateColumns: '1fr 30px 54px 54px', gap: '3px' }}><span>STOCK NAME</span><span style={{ textAlign: 'center' }}>QTY</span><span style={{ textAlign: 'right' }}>PRICE</span><span style={{ textAlign: 'right' }}>TOTAL</span></div>
                              {(cashSalesReprintReceipt.lines || []).map((line, index) => <div key={line.id || index} style={{ borderBottom: '1px dotted #777', padding: '5px 0', fontSize: '9px' }}><div style={{ fontWeight: '800', lineHeight: '1.2', marginBottom: '2px' }}>{line.stockName}</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 30px 54px 54px', gap: '3px' }}><span></span><span style={{ textAlign: 'center', fontWeight: '800' }}>{line.quantity}<br />{line.rate === 'Carton' ? 'CTN' : line.rate === 'Half Ctn' ? 'HALF' : line.rate === 'Quarter Ctn' ? 'QRT' : 'UNIT'}</span><span style={{ textAlign: 'right' }}>{formatMoney(line.unitPrice)}</span><span style={{ textAlign: 'right', fontWeight: '800' }}>{formatMoney(line.lineTotal)}</span></div></div>)}
                              <div style={{ marginTop: '6px', fontSize: '10px' }}><div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span>TOTAL AMOUNT:</span><strong>{formatMoney(cashSalesReprintReceipt.totalAmount)}</strong></div><div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}><span>TOTAL DISCT:</span><strong>{formatMoney(discountTotal)}</strong></div><div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontWeight: '900' }}><span>ACTUAL AMOUNT:</span><strong>{formatMoney(cashSalesReprintReceipt.totalAmount)}</strong></div></div>
                              <div style={{ borderTop: '1px solid #111', marginTop: '5px', paddingTop: '5px', fontSize: '10px' }}><div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>TRANSFER:</span><strong>{formatMoney(cashSalesReprintReceipt.transferAmount)}</strong></div><div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>POS:</span><strong>{formatMoney(cashSalesReprintReceipt.posAmount)}</strong></div><div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>CASH:</span><strong>{formatMoney(cashSalesReprintReceipt.cashAmount)}</strong></div></div>
                              <div style={{ borderTop: '1px dashed #111', marginTop: '7px', paddingTop: '5px', fontSize: '8px', lineHeight: '1.35' }}><strong>PLEASE NOTE</strong><br />Goods Received In Good Condition Are Not Returnable.</div>
                            </div>
                          </div>
                        </div>
                        <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '9px' }}><button type="button" onClick={() => window.print()} style={{ background: '#1593c8', color: '#fff', border: 'none', borderRadius: '5px', padding: '9px 20px', fontWeight: '850', cursor: 'pointer' }}>REPRINT</button><button type="button" onClick={() => { setCashSalesReprintReceipt(null); setCashSalesReprintRef('') }} style={{ background: '#fff', color: '#1683b5', border: '1px solid #168bbd', borderRadius: '5px', padding: '9px 20px', fontWeight: '800', cursor: 'pointer' }}>Change Ref No</button></div>
                      </div>
                    })()}
                  </div>
                </div>
              </div>}
              <section style={{ background: '#fff', border: '1px solid #168bbd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(22,61,91,.08)', marginBottom: '14px' }}>
                <div style={{ background: '#1593c8', color: '#fff', textAlign: 'center', fontWeight: '850', padding: '11px 14px', fontSize: '16px' }}>SUBMITTED CASHSALES — PAYMENT QUEUE</div>
                <div style={{ padding: '14px' }}>
                  {cashSalesQueue.length === 0 ? <div style={{ padding: '28px 12px', textAlign: 'center', color: '#64748b', border: '1px dashed #cbd7e2', borderRadius: '7px' }}>No submitted CashSales are waiting for payment confirmation.</div> : (
                    <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', fontSize: '12px' }}><thead><tr>{['S/N','Date','Ref No','Customer','Sales Staff','Total','Status','Action'].map(h => <th key={h} style={{ background: '#148dc1', color: '#fff', border: '1px solid #168bbd', padding: '8px', textAlign: h === 'Total' ? 'right' : 'left', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead><tbody>{cashSalesQueue.map((sale,index) => <tr key={sale.id}><td style={{ border: '1px solid #d6e1e8', padding: '8px' }}>{index+1}</td><td style={{ border: '1px solid #d6e1e8', padding: '8px', whiteSpace: 'nowrap' }}>{formatDate(sale.saleDate)}</td><td style={{ border: '1px solid #d6e1e8', padding: '8px', fontWeight: '800' }}>{sale.invoiceNo}</td><td style={{ border: '1px solid #d6e1e8', padding: '8px' }}>{sale.customerName || '—'}</td><td style={{ border: '1px solid #d6e1e8', padding: '8px' }}>{sale.salesStaff || '—'}</td><td style={{ border: '1px solid #d6e1e8', padding: '8px', textAlign: 'right', fontWeight: '800' }}>₦{formatMoney(sale.totalAmount)}</td><td style={{ border: '1px solid #d6e1e8', padding: '8px' }}>UNPAID</td><td style={{ border: '1px solid #d6e1e8', padding: '8px' }}><button onClick={() => selectSale(sale)} style={{ border: 'none', background: '#148dc1', color: '#fff', borderRadius: '5px', padding: '7px 12px', fontWeight: '800', cursor: 'pointer' }}>Enter Payment</button></td></tr>)}</tbody></table></div>
                  )}
                </div>
              </section>

              {selectedSale && <section style={{ background: '#f5fff5', border: '1px solid #168bbd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(22,61,91,.08)' }}>
                <div style={{ background: '#1593c8', color: '#fff', textAlign: 'center', fontWeight: '850', padding: '11px 14px', fontSize: '16px' }}>CASHSALES PAYMENT — {selectedSale.invoiceNo}</div>
                <div style={{ padding: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '10px' }}>{[['Customer',selectedSale.customerName||'—'],['Sales Staff',selectedSale.salesStaff||'—'],['Invoice Total',`₦${formatMoney(saleTotal)}`],['Amount Due',`₦${formatMoney(remainingAmount)}`]].map(([label,value])=><div key={label} style={{ background:'#fff', border:'1px solid #dbe5ed', borderRadius:'6px', padding:'10px' }}><div style={{ color:'#64748b', fontSize:'10px', fontWeight:'800', marginBottom:'4px' }}>{label}</div><div style={{ color:'#173f63', fontSize:'13px', fontWeight:'800' }}>{value}</div></div>)}</div>
                  <div style={{ marginTop:'16px', overflowX:'auto' }}><table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}><thead><tr>{['S/N','Stock','Qty','Rate','Price','Discount','Total'].map(h=><th key={h} style={{ background:'#eaf5fb', color:'#173f63', border:'1px solid #c8d7e1', padding:'7px', textAlign:h==='Total'||h==='Price'||h==='Discount'?'right':'left' }}>{h}</th>)}</tr></thead><tbody>{(selectedSale.lines||[]).map((line,index)=><tr key={line.id}><td style={{ border:'1px solid #d6e1e8', padding:'7px' }}>{index+1}</td><td style={{ border:'1px solid #d6e1e8', padding:'7px' }}>{line.stockName}</td><td style={{ border:'1px solid #d6e1e8', padding:'7px' }}>{line.quantity}</td><td style={{ border:'1px solid #d6e1e8', padding:'7px' }}>{line.rate}</td><td style={{ border:'1px solid #d6e1e8', padding:'7px', textAlign:'right' }}>₦{formatMoney(line.unitPrice)}</td><td style={{ border:'1px solid #d6e1e8', padding:'7px', textAlign:'right' }}>₦{formatMoney(line.discount)}</td><td style={{ border:'1px solid #d6e1e8', padding:'7px', textAlign:'right', fontWeight:'800' }}>₦{formatMoney(line.lineTotal)}</td></tr>)}</tbody></table></div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:'14px', marginTop:'18px' }}>{[['Transfer','transfer'],['POS','pos'],['Cash','cash']].map(([label,key])=><div key={key}><label style={{ display:'block', color:'#244e73', fontWeight:'800', fontSize:'12px', marginBottom:'6px' }}>{label} Payment *</label><input type="number" min="0" step="0.01" value={payment[key]} onChange={e=>setPayment(current=>({...current,[key]:e.target.value}))} placeholder="0.00" style={{ width:'100%', height:'42px', boxSizing:'border-box', border:'1px solid #b9ccdd', borderRadius:'6px', padding:'8px 10px', color:'#10224a' }} /></div>)}</div>
                  <div style={{ marginTop:'14px', display:'flex', justifyContent:'flex-end', gap:'22px', fontSize:'13px' }}><span>Payment Total: <strong>₦{formatMoney(paymentTotal)}</strong></span><span>Amount Due: <strong>₦{formatMoney(remainingAmount)}</strong></span></div>
                  <div style={{ display:'flex', justifyContent:'center', gap:'9px', marginTop:'18px' }}><button type="button" onClick={()=>{setSelectedSale(null);setPayment({transfer:'',pos:'',cash:''})}} style={{ background:'#fff', color:'#1683b5', border:'1px solid #168bbd', borderRadius:'5px', padding:'9px 20px', fontWeight:'800', cursor:'pointer' }}>Back to Queue</button><button type="button" onClick={confirmCashSalePayment} disabled={loading || !paymentMatches} style={{ background:loading||!paymentMatches?'#cbd5e1':'#1593c8', color:'#fff', border:'none', borderRadius:'5px', padding:'9px 22px', fontWeight:'800', cursor:loading||!paymentMatches?'not-allowed':'pointer' }}>{loading?'Confirming...':'Confirm Payment'}</button></div>
                  {!paymentMatches && paymentTotal > 0 && <div style={{ marginTop:'10px', textAlign:'center', color:'#a12626', fontSize:'12px', fontWeight:'700' }}>The three payment methods must equal the amount due.</div>}
                </div>
              </section>}
            </>
          ) : (
            <>
              <section style={{ background: '#f5fff5', border: '1px solid #168bbd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(22,61,91,.08)', marginBottom: '14px' }}>
                <div style={{ background: '#1593c8', color: '#fff', textAlign: 'center', fontWeight: '850', padding: '11px 14px', fontSize: '16px' }}>{active}</div>
                <form onSubmit={submitOperation} style={{ padding: '18px' }}>
                  {active === 'External Cash PAY-IN' && <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:'14px 18px' }}><div><label style={labelStyle}>Source *</label><input value={payIn.source} onChange={e=>setPayIn({...payIn,source:e.target.value})} placeholder="Enter cash source" style={fieldStyle} required /></div><div><label style={labelStyle}>Amount *</label><input type="number" min="0.01" step="0.01" value={payIn.amount} onChange={e=>setPayIn({...payIn,amount:e.target.value})} placeholder="0.00" style={fieldStyle} required /></div><div><label style={labelStyle}>Bank Account</label><select value={payIn.bankAccountId} onChange={e=>setPayIn({...payIn,bankAccountId:e.target.value})} style={fieldStyle}><option value="">Not specified</option>{banks.map(bank=><option key={bank.id} value={bank.id}>{bankLabel(bank)}</option>)}</select></div><div><label style={labelStyle}>Reference</label><input value={payIn.reference} onChange={e=>setPayIn({...payIn,reference:e.target.value})} placeholder="Optional reference" style={fieldStyle} /></div><div style={{gridColumn:'1 / -1'}}><label style={labelStyle}>Note</label><textarea value={payIn.note} onChange={e=>setPayIn({...payIn,note:e.target.value})} placeholder="Optional note" style={textareaStyle} /></div></div>}
                  {active === 'Cash Deposit' && <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:'14px 18px' }}><div><label style={labelStyle}>Amount *</label><input type="number" min="0.01" step="0.01" value={deposit.amount} onChange={e=>setDeposit({...deposit,amount:e.target.value})} placeholder="0.00" style={fieldStyle} required /></div><div><label style={labelStyle}>Bank Account</label><select value={deposit.bankAccountId} onChange={e=>setDeposit({...deposit,bankAccountId:e.target.value})} style={fieldStyle}><option value="">Not specified</option>{banks.map(bank=><option key={bank.id} value={bank.id}>{bankLabel(bank)}</option>)}</select></div><div><label style={labelStyle}>Reference</label><input value={deposit.reference} onChange={e=>setDeposit({...deposit,reference:e.target.value})} placeholder="Optional reference" style={fieldStyle} /></div><div><label style={labelStyle}>Note</label><input value={deposit.note} onChange={e=>setDeposit({...deposit,note:e.target.value})} placeholder="Optional note" style={fieldStyle} /></div></div>}
                  {active === 'Expenses' && <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:'14px 18px' }}><div><label style={labelStyle}>Description *</label><input value={expense.description} onChange={e=>setExpense({...expense,description:e.target.value})} placeholder="Expense description" style={fieldStyle} required /></div><div><label style={labelStyle}>Amount *</label><input type="number" min="0.01" step="0.01" value={expense.amount} onChange={e=>setExpense({...expense,amount:e.target.value})} placeholder="0.00" style={fieldStyle} required /></div><div><label style={labelStyle}>Category</label><input value={expense.category} onChange={e=>setExpense({...expense,category:e.target.value})} placeholder="Optional category" style={fieldStyle} /></div><div><label style={labelStyle}>Note</label><input value={expense.note} onChange={e=>setExpense({...expense,note:e.target.value})} placeholder="Optional note" style={fieldStyle} /></div></div>}
                  {active === 'Bank Lodgement' && <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:'14px 18px' }}><div><label style={labelStyle}>Bank Account *</label><select value={lodgement.bankAccountId} onChange={e=>setLodgement({...lodgement,bankAccountId:e.target.value})} style={fieldStyle} required><option value="">Select bank account</option>{banks.map(bank=><option key={bank.id} value={bank.id}>{bankLabel(bank)}</option>)}</select></div><div><label style={labelStyle}>Amount *</label><input type="number" min="0.01" step="0.01" value={lodgement.amount} onChange={e=>setLodgement({...lodgement,amount:e.target.value})} placeholder="0.00" style={fieldStyle} required /></div><div><label style={labelStyle}>Reference</label><input value={lodgement.reference} onChange={e=>setLodgement({...lodgement,reference:e.target.value})} placeholder="Optional reference" style={fieldStyle} /></div><div><label style={labelStyle}>Note</label><input value={lodgement.note} onChange={e=>setLodgement({...lodgement,note:e.target.value})} placeholder="Optional note" style={fieldStyle} /></div></div>}
                  {active === 'NYP Payment' && <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:'14px 18px' }}><div><label style={labelStyle}>NYP Account *</label><select value={nypPayment.nypCustomerId} onChange={e=>setNypPayment({...nypPayment,nypCustomerId:e.target.value})} style={fieldStyle} required><option value="">Select NYP account</option>{nypCustomers.map(customer=><option key={customer.id} value={customer.id}>{customer.nypId} — {customer.fullName} — Balance: {formatMoney(customer.balance)}</option>)}</select></div><div><label style={labelStyle}>Amount *</label><input type="number" min="0.01" step="0.01" value={nypPayment.amount} onChange={e=>setNypPayment({...nypPayment,amount:e.target.value})} placeholder="0.00" style={fieldStyle} required /></div><div><label style={labelStyle}>Reference</label><input value={nypPayment.reference} onChange={e=>setNypPayment({...nypPayment,reference:e.target.value})} placeholder="Optional reference" style={fieldStyle} /></div><div><label style={labelStyle}>Note</label><input value={nypPayment.note} onChange={e=>setNypPayment({...nypPayment,note:e.target.value})} placeholder="Optional note" style={fieldStyle} /></div></div>}
                  <div style={{ display:'flex', justifyContent:'center', gap:'9px', marginTop:'20px' }}><button type="submit" disabled={loading} style={{ background:loading?'#8ebbd3':'#1593c8', color:'#fff', border:'none', borderRadius:'5px', padding:'9px 20px', fontWeight:'800', cursor:loading?'wait':'pointer' }}>{loading?'Saving...':'Record Transaction'}</button><button type="button" onClick={resetCurrentForm} style={{ background:'#fff', color:'#1683b5', border:'1px solid #168bbd', borderRadius:'5px', padding:'9px 20px', fontWeight:'800', cursor:'pointer' }}>Clear</button></div>
                </form>
              </section>

              <section style={{ background:'#fff', border:'1px solid #c8d7e1', borderRadius:'8px', overflow:'hidden' }}><div style={{ background:'#eaf5fb', color:'#173f63', fontWeight:'850', padding:'10px 12px', fontSize:'13px' }}>MY RECENT {active.toUpperCase()} RECORDS</div><div style={{ overflowX:'auto' }}><table style={{ width:'100%', minWidth:'720px', borderCollapse:'collapse', fontSize:'12px' }}><thead><tr>{['S/N','Date',active==='Expenses'?'Description':active==='NYP Payment'?'NYP Account':'Reference',active==='NYP Payment'?'Method':'Bank Account','Amount'].map(header=><th key={header} style={{ background:'#1593c8', color:'#fff', border:'1px solid #168bbd', padding:'8px', textAlign:header==='Amount'?'right':'left', whiteSpace:'nowrap' }}>{header}</th>)}</tr></thead><tbody>{rows.length===0?<tr><td colSpan="5" style={{ padding:'18px', textAlign:'center', color:'#6a7c8c', border:'1px solid #d6e1e8' }}>No records found for this cashier.</td></tr>:rows.map((row,index)=><tr key={row.id}><td style={{border:'1px solid #d6e1e8',padding:'8px'}}>{index+1}</td><td style={{border:'1px solid #d6e1e8',padding:'8px',whiteSpace:'nowrap'}}>{formatDate(row.expenseDate||row.payInDate||row.depositDate||row.lodgementDate||row.paymentDate)}</td><td style={{border:'1px solid #d6e1e8',padding:'8px'}}>{active==='Expenses'?row.description:active==='NYP Payment'?`${row.nypCustomer?.nypId||'-'} — ${row.nypCustomer?.fullName||''}`:(row.reference||'-')}</td><td style={{border:'1px solid #d6e1e8',padding:'8px'}}>{active==='NYP Payment'?(row.paymentMethod||'-'):(row.bankAccount?`${row.bankAccount.bankName} (${row.bankAccount.accountId})`:'-')}</td><td style={{border:'1px solid #d6e1e8',padding:'8px',textAlign:'right',fontWeight:'800'}}>₦{formatMoney(row.amount)}</td></tr>)}</tbody></table></div></section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function App() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // The original platform uses an accordion-style sidebar:
  // opening one main menu closes every other main menu.
  const [administratorOpen, setAdministratorOpen] = useState(true)
  const [cashierOpen, setCashierOpen] = useState(false)
  const [cashSalesOpen, setCashSalesOpen] = useState(false)
  const [nypSalesOpen, setNypSalesOpen] = useState(false)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [stockOpen, setStockOpen] = useState(false)
  const [nypAccountOpen, setNypAccountOpen] = useState(false)
  const [companyAccountOpen, setCompanyAccountOpen] = useState(false)
  const [bankAnalysisOpen, setBankAnalysisOpen] = useState(false)
  const [mdCeoOpen, setMdCeoOpen] = useState(false)
  const [mdCeo2Open, setMdCeo2Open] = useState(false)

  const [activeSection, setActiveSection] = useState(null)

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem('theLordDoingAuthToken'))
  )

  const [authUser, setAuthUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('theLordDoingAuthUser')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  const openOnly = (menu) => {
    setAdministratorOpen(menu === 'Administrator' ? !administratorOpen : false)
    setCashierOpen(menu === 'Cashier' ? !cashierOpen : false)
    setCashSalesOpen(menu === 'CashSales' ? !cashSalesOpen : false)
    setNypSalesOpen(menu === 'NYP Sales' ? !nypSalesOpen : false)
    setAnalysisOpen(menu === 'Analysis Report' ? !analysisOpen : false)
    setSummaryOpen(menu === 'Summary Report' ? !summaryOpen : false)
    setStockOpen(menu === 'Stock Report' ? !stockOpen : false)
    setNypAccountOpen(menu === 'NYP Account' ? !nypAccountOpen : false)
    setCompanyAccountOpen(menu === 'Company Account' ? !companyAccountOpen : false)
    setBankAnalysisOpen(menu === 'Bank Analysis Report' ? !bankAnalysisOpen : false)
    setMdCeoOpen(menu === 'MD-CEO DESK' ? !mdCeoOpen : false)
    setMdCeo2Open(menu === 'MD-CEO DESK 2' ? !mdCeo2Open : false)
  }

  const [now, setNow] = useState(new Date())

  useEffect(() => {

    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timer)

  }, [])

  const handleLogin = (data) => {
    setAuthUser(data?.user || null)
    setIsAuthenticated(true)
  }

  const handlePlatformBack = () => {
    setMobileMenuOpen(false)
    setActiveSection(null)
    setAdministratorOpen(true)
    setCashierOpen(false)
    setCashSalesOpen(false)
    setNypSalesOpen(false)
    setAnalysisOpen(false)
    setSummaryOpen(false)
    setStockOpen(false)
    setNypAccountOpen(false)
    setCompanyAccountOpen(false)
    setBankAnalysisOpen(false)
    setMdCeoOpen(false)
    setMdCeo2Open(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('theLordDoingAuthToken')

    try {
      if (token) {
        await apiFetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch {
      // Clear the local session even if the backend is unavailable.
    }

    localStorage.removeItem('theLordDoingAuthToken')
    localStorage.removeItem('theLordDoingAuthUser')
    setAuthUser(null)
    setIsAuthenticated(false)
    setActiveSection(null)
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (authUser?.role === 'CASHIER') {
    return <CashierDesk authUser={authUser} onLogout={handleLogout} />
  }

  const formattedDate =
    new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(now)

  const formattedTime =
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now)

  const openSection = (section) => {
    setActiveSection(section)
    setMobileMenuOpen(false)
  }

  const menuGlyph = (label) => {
    const glyphs = {
      Administrator: 'A',
      Cashier: 'C',
      CashSales: 'CS',
      'NYP Sales': 'NYP',
      'Analysis Report': 'AR',
      'Summary Report': 'SR',
      'Stock Report': 'ST',
      'NYP Account': 'NA',
      'Company Account': 'CA',
      'Bank Analysis Report': 'BA',
      'MD-CEO DESK': 'MD',
      'MD-CEO DESK 2': 'MD'
    }

    return glyphs[label] || '•'
  }

  const renderMainMenuButton = (label) => (
    <button
      key={label}
      className="main-item"
      onClick={() => openSection(label)}
    >
      <span>{label}</span>
      <Plus />
    </button>
  )

  return (
    <>
      <style>{`
        /* LOGIN-SCREEN COLOUR SYSTEM — applied to the authenticated platform. */
        .page {
          background: #f6faff !important;
          color: #10224a !important;
        }

        .platform {
          background: #f6faff !important;
        }

        .top {
          background: #10224a !important;
          color: #ffffff !important;
          border-bottom: 1px solid #0d1b3a !important;
        }

        .top .software,
        .top .welcome {
          color: #ffffff !important;
        }

        .platform-back-button {
          width: 42px !important;
          height: 34px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: 1px solid #c8d8e8 !important;
          border-radius: 4px !important;
          background: #ffffff !important;
          color: #10224a !important;
          font-size: 21px !important;
          font-weight: 800 !important;
          line-height: 1 !important;
          cursor: pointer !important;
          padding: 0 !important;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.15s ease !important;
        }

        .platform-back-button:hover {
          background: #1268c9 !important;
          color: #ffffff !important;
          border-color: #1268c9 !important;
          transform: translateX(-1px);
        }

        .platform-back-button:focus-visible {
          outline: 3px solid rgba(18, 104, 201, 0.25) !important;
          outline-offset: 1px;
        }


        .company {
          background: #1268c9 !important;
          color: #ffffff !important;
        }

        .branch {
          background: #eef6ff !important;
          color: #1267ca !important;
          border-bottom: 1px solid #d4e1ee !important;
        }

        .sidebar {
          background: #f7fbff !important;
          border: 1px solid #d7e5f2 !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 24px rgba(16, 34, 74, 0.08) !important;
          overflow: hidden !important;
          width: 310px !important;
          min-width: 310px !important;
          flex: 0 0 310px !important;
          margin: 14px 0 14px 14px !important;
        }

        .menu-title {
          background: #1268c9 !important;
          color: #ffffff !important;
          height: 48px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 0 18px !important;
          box-sizing: border-box !important;
          font-size: 15px !important;
          font-weight: 800 !important;
          letter-spacing: 0.08em !important;
        }

        .menu-title::after {
          content: 'NAVIGATION';
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          opacity: 0.72;
        }

        .sidebar .main-item {
          width: calc(100% - 20px) !important;
          min-height: 52px !important;
          margin: 7px 10px 0 !important;
          padding: 0 14px !important;
          box-sizing: border-box !important;
          border: 1px solid #d9e5f0 !important;
          border-radius: 9px !important;
          background: #ffffff !important;
          color: #10224a !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 10px !important;
          font-size: 14px !important;
          font-weight: 750 !important;
          text-align: left !important;
          cursor: pointer !important;
          transition: background 0.16s ease, border-color 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease !important;
        }

        .sidebar .main-item:hover,
        .sidebar .main-item.administrator:hover {
          background: #eef6ff !important;
          color: #1268c9 !important;
          border-color: #b8d4ee !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(18, 104, 201, 0.08) !important;
        }

        .sidebar .main-item.open {
          background: #eef6ff !important;
          color: #1268c9 !important;
          border-color: #b8d4ee !important;
          box-shadow: 0 4px 12px rgba(18, 104, 201, 0.08) !important;
        }

        .sidebar .main-item.open .menu-glyph {
          background: #1268c9 !important;
          color: #ffffff !important;
          border-color: #1268c9 !important;
        }

        .sidebar .main-item:focus-visible {
          outline: 3px solid rgba(18, 104, 201, 0.18) !important;
          outline-offset: 1px;
        }

        .menu-main-label {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .menu-glyph {
          width: 29px;
          height: 29px;
          flex: 0 0 29px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #e8f2fc;
          color: #1268c9;
          border: 1px solid #c8ddf0;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.02em;
        }

        .menu-chevron {
          width: 25px;
          height: 25px;
          flex: 0 0 25px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #edf6ff;
          color: #1268c9;
          font-size: 19px;
          font-weight: 800;
          line-height: 1;
        }

        .menu-chevron.open {
          font-size: 17px;
          padding-bottom: 3px;
        }

        .sidebar .admin-submenu {
          background: #edf6ff !important;
          border: 0 !important;
          border-left: 2px solid #c5dcef !important;
          border-radius: 0 !important;
          margin: 2px 10px 7px 23px !important;
          padding: 4px 0 3px 10px !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }

        .sidebar .sub-item {
          width: 100% !important;
          min-height: 39px !important;
          height: auto !important;
          margin: 2px 0 !important;
          padding: 8px 11px !important;
          box-sizing: border-box !important;
          border: 0 !important;
          border-radius: 7px !important;
          background: transparent !important;
          color: #31435f !important;
          font-size: 12.5px !important;
          font-weight: 650 !important;
          line-height: 18px !important;
          text-align: left !important;
          white-space: normal !important;
          cursor: pointer !important;
          transition: background 0.15s ease, color 0.15s ease, padding-left 0.15s ease !important;
        }

        .sidebar .sub-item::before {
          content: '•';
          color: #7fa7ca;
          margin-right: 8px;
          font-size: 12px;
        }

        .sidebar .sub-item:hover {
          background: #dcecff !important;
          color: #1268c9 !important;
          padding-left: 15px !important;
        }

        .sidebar .sub-item.selected {
          background: #1268c9 !important;
          color: #ffffff !important;
          font-weight: 800 !important;
          box-shadow: 0 4px 10px rgba(18, 104, 201, 0.16) !important;
        }

        .sidebar .sub-item.selected::before {
          color: #ffffff;
        }

        .sidebar .menu-section {
          min-height: 32px !important;
          height: auto !important;
          margin: 13px 10px 4px !important;
          padding: 7px 10px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          color: #ffffff !important;
          background: #1268c9 !important;
          font-size: 10px !important;
          font-weight: 850 !important;
          letter-spacing: 0.14em !important;
          line-height: 16px !important;
          white-space: nowrap !important;
          border: 1px solid #0f5eaf !important;
          border-radius: 7px !important;
          box-shadow: 0 2px 5px rgba(18, 104, 201, 0.12) !important;
        }

        .sidebar .dots {
          display: none !important;
        }

        .sidebar-fill {
          min-height: 18px !important;
          flex: none !important;
          background: #1268c9 !important;
          border-top: 1px solid #0f5eaf !important;
        }

        .home-dashboard { width: 100%; max-width: 1180px; margin: 0 auto; padding: 24px 28px 36px; box-sizing: border-box; color: #10224a; }
        .dashboard-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 20px; }
        .dashboard-eyebrow, .dashboard-card-label { color: #1268c9; font-size: 10px; font-weight: 850; letter-spacing: .14em; }
        .dashboard-heading h1 { margin: 4px 0 5px; font-size: 25px; line-height: 1.15; color: #10224a; }
        .dashboard-heading p { margin: 0; color: #62758f; font-size: 13px; }
        .dashboard-date { background: #fff; border: 1px solid #d5e3f0; border-radius: 9px; padding: 10px 13px; color: #526782; font-size: 11px; font-weight: 700; white-space: nowrap; }
        .dashboard-kpis { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 13px; margin-bottom: 16px; }
        .dashboard-kpi { min-width: 0; padding: 16px; border: 1px solid #d4e2ef; border-radius: 11px; background: #fff; color: #10224a; text-align: left; cursor: pointer; box-shadow: 0 4px 13px rgba(16,34,74,.05); transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease; }
        .dashboard-kpi:hover { transform: translateY(-2px); border-color: #9fc5e7; box-shadow: 0 7px 18px rgba(18,104,201,.09); }
        .kpi-label { display: block; color: #1268c9; font-size: 9px; font-weight: 850; letter-spacing: .12em; }
        .dashboard-kpi strong { display: block; margin: 8px 0 4px; font-size: 25px; line-height: 1; color: #10224a; }
        .kpi-note { color: #71839a; font-size: 10.5px; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; margin-bottom: 16px; }
        .dashboard-grid-main { grid-template-columns: 1.35fr .85fr; }
        .dashboard-card, .dashboard-quick-actions { background: #fff; border: 1px solid #d4e2ef; border-radius: 11px; box-shadow: 0 4px 13px rgba(16,34,74,.05); overflow: hidden; }
        .dashboard-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 17px 12px; border-bottom: 1px solid #e4edf5; }
        .dashboard-card-head h2, .dashboard-quick-actions h2 { margin: 3px 0 0; color: #10224a; font-size: 16px; }
        .dashboard-card-head button, .quick-action-list button { border: 1px solid #bcd5ea; background: #eef6ff; color: #1268c9; border-radius: 6px; padding: 6px 9px; font-size: 10px; font-weight: 800; cursor: pointer; }
        .dashboard-card-head button:hover, .quick-action-list button:hover { background: #1268c9; color: #fff; border-color: #1268c9; }
        .sales-placeholder { min-height: 218px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 22px; box-sizing: border-box; color: #657993; }
        .sales-placeholder-icon { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; border-radius: 50%; background: #eef6ff; border: 1px solid #c9dff2; color: #1268c9; font-size: 22px; font-weight: 850; }
        .sales-placeholder strong, .empty-dashboard-state strong { color: #243b5b; font-size: 13px; }
        .sales-placeholder span, .empty-dashboard-state span { max-width: 430px; margin-top: 6px; color: #71839a; font-size: 11px; line-height: 1.55; }
        .alert-list, .financial-list { padding: 7px 17px 13px; }
        .dashboard-alert { display: flex; align-items: center; gap: 11px; padding: 12px 0; border-bottom: 1px solid #edf2f7; }
        .dashboard-alert:last-child { border-bottom: 0; }
        .alert-dot { width: 9px; height: 9px; flex: 0 0 9px; border-radius: 50%; background: #9fb4c8; }
        .dashboard-alert div { display: flex; flex-direction: column; gap: 2px; }
        .dashboard-alert strong { color: #243b5b; font-size: 12px; }
        .dashboard-alert span { color: #7a8ca2; font-size: 10.5px; }
        .empty-dashboard-state { min-height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; }
        .financial-list > div { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #edf2f7; color: #60738d; font-size: 11px; }
        .financial-list > div:last-child { border-bottom: 0; }
        .financial-list strong { color: #10224a; font-size: 13px; }
        .dashboard-quick-actions { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 15px 17px; }
        .quick-action-list { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
        .quick-action-list button { display: inline-flex; align-items: center; gap: 9px; }
        .quick-action-list button span { font-size: 16px; line-height: 10px; }

        .workspace {
          background: #f6faff !important;
          color: #10224a !important;
        }

        .workspace button:not([style*="background: #d90000"]):not([style*="background:#d90000"]) {
          font-family: inherit;
        }

        .footer {
          background: #10224a !important;
          color: #dce8f5 !important;
          border-top: 1px solid #0d1b3a !important;
        }

        /* Keep the platform header visible while the page is scrolled. */
        .sticky-platform-header {
          position: sticky;
          top: 0;
          z-index: 1200;
          width: 100%;
        }

        /* Let the sidebar grow with whichever accordion section is open. */
        .page {
          min-height: 100vh !important;
          height: auto !important;
          overflow: visible !important;
        }

        .platform {
          min-height: 100vh !important;
          height: auto !important;
          overflow: visible !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .body {
          align-items: flex-start !important;
          height: auto !important;
          min-height: 0 !important;
          flex: 1 0 auto !important;
          overflow: visible !important;
        }

        .sidebar {
          height: auto !important;
          min-height: 0 !important;
          align-self: flex-start !important;
          overflow: visible !important;
        }

        .workspace {
          height: auto !important;
          min-height: 535px;
          overflow: visible !important;
        }

        .footer {
          position: static !important;
          bottom: auto !important;
          top: auto !important;
          flex: 0 0 auto !important;
          width: 100% !important;
          margin-top: 0 !important;
          z-index: auto !important;
        }

        /* Mobile navigation controls are hidden on desktop. */
        .mobile-menu-toggle,
        .mobile-menu-backdrop {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-menu-backdrop {
            display: block !important;
            position: fixed !important;
            inset: 0 !important;
            z-index: 1250 !important;
            width: 100vw !important;
            height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            background: rgba(8, 18, 38, .55) !important;
            cursor: pointer;
          }
        }

        /* Mobile menu button: hidden on desktop. */
        .mobile-menu-toggle {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            min-height: 36px;
            padding: 7px 11px;
            border: 1px solid rgba(255,255,255,.55);
            border-radius: 6px;
            background: rgba(255,255,255,.12);
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          }

          /* Drawer stays off-screen until the mobile menu is opened. */
          .sidebar {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            z-index: 1300 !important;
            width: min(310px, 85vw) !important;
            max-width: 85vw !important;
            height: 100dvh !important;
            min-height: 0 !important;
            margin: 0 !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            border-radius: 0 12px 12px 0 !important;
            box-shadow: 8px 0 28px rgba(0,0,0,.25) !important;
            transform: translateX(-110%) !important;
            visibility: hidden !important;
            transition: transform .25s ease, visibility .25s ease !important;
            overscroll-behavior: contain;
          }

          .sidebar.mobile-open {
            transform: translateX(0) !important;
            visibility: visible !important;
          }

          /* Keep the workspace from being displaced by the drawer. */
          .body {
            display: block !important;
          }

          /* Keep the platform within the available mobile screen width. */
          .page,
          .platform {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }

          .platform {
            overflow-x: clip !important;
          }

          .top {
            height: auto !important;
            min-height: 42px !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            padding: 8px 10px !important;
          }

          .top .software {
            min-width: 0 !important;
            max-width: 100% !important;
            overflow-wrap: anywhere !important;
            font-size: 10px !important;
          }

          .top .welcome {
            min-width: 0 !important;
            max-width: 100% !important;
            flex-wrap: wrap !important;
            gap: 7px !important;
            font-size: 11px !important;
          }
          .home-dashboard { padding: 18px 14px 28px !important; }
          .dashboard-heading { align-items: flex-start !important; flex-direction: column !important; gap: 10px !important; }
          .dashboard-kpis, .dashboard-grid, .dashboard-grid-main { grid-template-columns: 1fr !important; }
          .dashboard-quick-actions { align-items: flex-start !important; flex-direction: column !important; }
          .quick-action-list { justify-content: flex-start !important; }

          .body {
            display: block !important;
          }

          .sidebar {
            width: calc(100% - 20px) !important;
            min-width: 0 !important;
            flex: none !important;
            margin: 10px !important;
            border-radius: 12px !important;
          }

          .sidebar .main-item {
            min-height: 50px !important;
          }

          .sidebar .admin-submenu {
            margin-left: 18px !important;
            margin-right: 10px !important;
          }

          /* Preserve the intended drawer size after the general mobile rules. */
          .sidebar {
            width: min(310px, 85vw) !important;
            max-width: 85vw !important;
            margin: 0 !important;
            border-radius: 0 12px 12px 0 !important;
          }

          .workspace {
            width: calc(100% - 20px) !important;
            margin: 0 10px 10px !important;
            min-height: 420px !important;
            box-sizing: border-box !important;
          }
        }

        @media (max-width: 430px) {
          .menu-title {
            padding: 0 14px !important;
          }

          .sidebar .main-item {
            width: calc(100% - 16px) !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
          }

          .sidebar .admin-submenu {
            margin-left: 14px !important;
            margin-right: 8px !important;
          }

          .menu-glyph {
            width: 27px;
            height: 27px;
            flex-basis: 27px;
          }
        }
      `}</style>

      <div className="page">

      <div className="platform">

        {/* STICKY PLATFORM HEADER */}

        <div className="sticky-platform-header">

          {/* TOP HEADER */}

          <header className="top">

            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(open => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="platform-sidebar"
            >
              {mobileMenuOpen ? 'Close Menu' : '☰ Menu'}
            </button>

            <span className="software">
              THE LORD'S DOING | INVENTORY &amp; BUSINESS MANAGEMENT SYSTEM
            </span>

            <span className="welcome" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

              <button
                type="button"
                className="platform-back-button"
                onClick={handlePlatformBack}
                aria-label="Return to main menu"
                title="Return to main menu"
              >
                ←
              </button>

              <span>
                Welcome: {authUser?.displayName || authUser?.username || 'OGA'}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  border: '1px solid rgba(255,255,255,.55)',
                  background: 'rgba(255,255,255,.10)',
                  color: '#fff',
                  borderRadius: '5px',
                  padding: '5px 9px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>

            </span>

          </header>

          {/* COMPANY */}

          <div className="company">
            THE LORD'S DOING GLOBAL CONCEPT SERVICES NIG. LTD
          </div>

          {/* BRANCH */}

          <div className="branch">
            SEMO STORE BRANCH
          </div>

        </div>

        {/* MAIN BODY */}

        <div className="body">

          {/* MOBILE MENU BACKDROP */}
          {mobileMenuOpen && (
            <button
              type="button"
              className="mobile-menu-backdrop"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* SIDEBAR */}

          <aside
            id="platform-sidebar"
            className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
          >

            <div className="menu-title">
              MENU
            </div>

            {/* ADMINISTRATOR */}

            <button
              className={`main-item administrator ${administratorOpen ? 'open' : ''}`}
              onClick={() => openOnly('Administrator')}
            >

              <span className="menu-main-label">
                <span className="menu-glyph">{menuGlyph('Administrator')}</span>
                <span>Administrator</span>
              </span>

              {administratorOpen
                ? <Minus />
                : <Plus />
              }

            </button>

            {/* ADMINISTRATOR SUBMENU */}

            {administratorOpen && (

              <div className="admin-submenu">

                {administratorMenu.map(
                  (label, index) => (

                    <React.Fragment key={label}>

                      {[3, 6, 8, 10].includes(index) && (
                        <div className="dots">
                          ................................
                        </div>
                      )}

                      <button
                        className={`sub-item ${
                          activeSection === label
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() =>
                          openSection(label)
                        }
                      >
                        {label}
                      </button>

                    </React.Fragment>

                  )
                )}

              </div>

            )}

            <div className="menu-section">
              OPERATIONS
            </div>

            {/* CASHIER */}

            <button
              className={`main-item ${cashierOpen ? 'open' : ''}`}
              onClick={() => openOnly('Cashier')}
            >
              <span className="menu-main-label">
                <span className="menu-glyph">{menuGlyph('Cashier')}</span>
                <span>Cashier</span>
              </span>
              {cashierOpen ? <Minus /> : <Plus />}
            </button>

            {cashierOpen && (
              <div className="admin-submenu">
                {[
                  'CashSales Payment',
                  'External Cash PAY-IN',
                  'Cash Deposit',
                  'NYP Payment',
                  'Expenses',
                  'Bank Lodgement',
                  'Company Goods Payment',
                  'Account Status Analysis',
                  'CashSales Payment Summary',
                  'NYP Stock Supply Summary'
                ].map((label, index) => (
                  <React.Fragment key={label}>
                    {[4, 7].includes(index) && (
                      <div className="dots">................................</div>
                    )}
                    <button
                      className={`sub-item ${activeSection === label ? 'selected' : ''}`}
                      onClick={() => openSection(label)}
                    >
                      {label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* CASHSALES */}

            <button
              className={`main-item ${cashSalesOpen ? 'open' : ''}`}
              onClick={() => openOnly('CashSales')}
            >
              <span className="menu-main-label">
                <span className="menu-glyph">{menuGlyph('CashSales')}</span>
                <span>CashSales</span>
              </span>
              {cashSalesOpen ? <Minus /> : <Plus />}
            </button>

            {cashSalesOpen && (
              <div className="admin-submenu">
                {['CashSales', 'CashSales Report'].map(label => (
                  <button
                    key={label}
                    className={`sub-item ${activeSection === label ? 'selected' : ''}`}
                    onClick={() => openSection(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* NYP SALES */}

            <button
              className={`main-item ${nypSalesOpen ? 'open' : ''}`}
              onClick={() => openOnly('NYP Sales')}
            >
              <span className="menu-main-label">
                <span className="menu-glyph">{menuGlyph('NYP Sales')}</span>
                <span>NYP Sales</span>
              </span>
              {nypSalesOpen ? <Minus /> : <Plus />}
            </button>

            {nypSalesOpen && (
              <div className="admin-submenu">
                {['NYP Sales', 'NYP Sales Report'].map(label => (
                  <button
                    key={label}
                    className={`sub-item ${activeSection === label ? 'selected' : ''}`}
                    onClick={() => openSection(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* REPORTS / ACCOUNTS */}

            <div className="menu-section">
              REPORTS
            </div>

            {[
              ['Analysis Report', analysisOpen, setAnalysisOpen, [
                ['Company Stock Adjustment Report','adjustment'],
                ['Company Stock Purchases Report','purchase'],
                ['CashSales Stock Supply Report','cashSupply'],
                ['NYP Stock Supply Report','nypSupply'],
                ['CashSales Payment Report','cashPayment'],
                ['NYP Payment Report','nypPayment'],
                ['Payment To Companies Report','companyPayment']
              ]],
              ['Summary Report', summaryOpen, setSummaryOpen, [
                ['Company Stock Adjustment Summary','adjustment'],
                ['Company Stock Purchases Summary','purchase'],
                ['CashSales Stock Supply Summary','cashSupply'],
                ['NYP Stock Supply Summary','nypSupply'],
                ['CashSales Payment Summary','cashPayment'],
                ['Payment To Companies Summary','companyPayment']
              ]],
              ['Stock Report', stockOpen, setStockOpen, [
                ['Stock Per Product','Stock Per Product'],
                ['Stock Balance','Stock Balance'],
                ['Stock Cost Valuation','Stock Cost Valuation'],
                ['Stock Selling Valuation','Stock Selling Valuation'],
                ['Stock Bin Card','Stock Bin Card']
              ]]
            ].map(([label, open, setter, items]) => (
              <React.Fragment key={label}>
                <button className={`main-item ${open ? 'open' : ''}`} onClick={() => openOnly(label)}>
                  <span className="menu-main-label">
                    <span className="menu-glyph">{menuGlyph(label)}</span>
                    <span>{label}</span>
                  </span>
                  {open ? <Minus /> : <Plus />}
                </button>
                {open && (
                  <div className="admin-submenu">
                    {items.map(([sub, value]) => (
                      <button
                        key={sub}
                        className={`sub-item ${activeSection === sub ? 'selected' : ''}`}
                        onClick={() => openSection(sub)}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}

            <div className="menu-section">
              ACCOUNTS & MANAGEMENT
            </div>

            {[
              ['NYP Account', nypAccountOpen, setNypAccountOpen, [
                ['NYP Acct History','NYP Acct History'],
                ['All NYP Acct Summary','All NYP Acct Summary'],
                ['All Debtors Report','All Debtors Report']
              ]],
              ['Company Account', companyAccountOpen, setCompanyAccountOpen, [
                ['Company Acct History','Company Acct History'],
                ['All Company Acct Summary','All Company Acct Summary'],
                ['All Creditors Report','All Creditors Report']
              ]],
              ['Bank Analysis Report', bankAnalysisOpen, setBankAnalysisOpen, [
                ['Bank Activity Report','Bank Activity Report'],
                ['Bank Statement Report','Bank Statement Report']
              ]],
              ['MD-CEO DESK', mdCeoOpen, setMdCeoOpen, [
                ['Admin User','Admin User'],
                ['Cashier Management','Cashier Management'],
                ['Admin Code','Admin Code'],
                ['CashSales-Payment Status','CashSales-Payment Status'],
                ['All External Cash Pay-IN Report','All External Cash Pay-IN Report'],
                ['All Expenses Report','All Expenses Report'],
                ['All Cash Deposit Report','All Cash Deposit Report'],
                ['All Banking Report','All Banking Report'],
                ['Acct Status Analysis','Account Status Analysis'],
                ['Acct Status Summary','Account Status Summary'],
                ['All Acct Status Summary','All Account Status Summary']
              ]],
              ['MD-CEO DESK 2', mdCeo2Open, setMdCeo2Open, [
                ['Company Stock Delete','Company Stock Delete'],
                ['Delete Stock','Delete Stock'],
                ['Delete NYP Account','Delete NYP Account'],
                ['Delete Company Account','Delete Company Account'],
                ['Delete Bank Report','Delete Bank Report'],
                ['Delete Expenses Report','Delete Expenses Report'],
                ['Delete Cash Deposit Report','Delete Cash Deposit Report'],
                ['Delete CashSales Report','Delete CashSales Report'],
                ['Delete NYPSales Report','Delete NYPSales Report'],
                ['Delete Stock Purchase Report','Delete Stock Purchase Report'],
                ['Delete Stock Adjust Report','Delete Stock Adjust Report'],
                ['Delete Stock Bin Card Report','Delete Stock Bin Card Report'],
                ['Delete Account Status Analysis Report','Delete Account Status Analysis Report']
              ]]
            ].map(([label, open, setter, items]) => (
              <React.Fragment key={label}>
                <button className={`main-item ${open ? 'open' : ''}`} onClick={() => openOnly(label)}>
                  <span className="menu-main-label">
                    <span className="menu-glyph">{menuGlyph(label)}</span>
                    <span>{label}</span>
                  </span>
                  {open ? <Minus /> : <Plus />}
                </button>
                {open && (
                  <div className="admin-submenu">
                    {items.map(([sub, value]) => (
                      <button
                        key={sub}
                        className={`sub-item ${activeSection === value ? 'selected' : ''}`}
                        onClick={() => openSection(value)}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}

            <div className="sidebar-fill"></div>

          </aside>

          {/* WORKSPACE */}

          <main className="workspace">

            {activeSection === 'NYP Sales' ? (

              <NypSalesScreen onBack={() => setActiveSection(null)} />

            ) : activeSection === 'NYP Sales Report' ? (

              <NypSalesReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'CashSales' ? (

              <CashSalesScreen onBack={() => setActiveSection(null)} />

            ) : activeSection === 'CashSales Report' ? (

              <CashSalesReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Company Goods Payment' ? (

              <CompanyGoodsPayment onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Account Status Analysis' ? (

              <AccountStatusAnalysis onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Bank Lodgement' ? (

              <BankLodgement onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Expenses' ? (

              <Expenses onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Cash Deposit' ? (

              <CashDeposit onBack={() => setActiveSection(null)} />

            ) : activeSection === 'External Cash PAY-IN' ? (

              <ExternalCashPayIn onBack={() => setActiveSection(null)} />

            ) : activeSection === 'CashSales Payment Summary' ? (

              <CashSalesPaymentSummary onBack={() => setActiveSection(null)} />

            ) : activeSection === 'NYP Stock Supply Summary' ? (

              <NypStockSupplySummary onBack={() => setActiveSection(null)} />

            ) : activeSection === 'CashSales Payment' ? (

              <CashSalesPayment onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Bank Registration' ? (

              <BankRegistration />

            ) : activeSection === 'NYP Registration' ? (

              <NYPRegistration />

            ) : activeSection === 'Company Registration' ? (

              <CompanyRegistration />

            ) : activeSection === 'Company Stock Adjustment' ? (

              <CompanyStockAdjustment />

            ) : activeSection === 'Company Stock Purchase' ? (

              <CompanyStockPurchase />

            ) : activeSection === 'Stock Open Purchase' ? (

              <StockOpenPurchase />

            ) : activeSection === 'Price Update' ? (

              <PriceUpdate onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Price List' ? (

              <PriceList onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Company Goods Payment' ? (

              <CompanyGoodsPayment onBack={() => setActiveSection(null)} />

            ) : activeSection === 'NYP Payment' ? (

              <NYPPayment onBack={() => setActiveSection(null)} />

            ) : activeSection === 'CashSales-Payment Status' ? (

              <CashSalesPaymentStatus onBack={() => setActiveSection(null)} />


            ) : activeSection === 'Company Stock Adjustment Report' ? (

              <CompanyStockAdjustmentReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Company Stock Purchases Report' ? (

              <CompanyStockPurchasesReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'CashSales Stock Supply Report' ? (

              <CashSalesStockSupplyReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'NYP Stock Supply Report' ? (

              <NypStockSupplyReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'CashSales Payment Report' ? (

              <CashSalesPaymentReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'NYP Payment Report' ? (

              <NypPaymentReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Payment To Companies Report' ? (

              <PaymentToCompaniesReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Company Stock Adjustment Summary' ? (

              <CompanyStockAdjustmentSummary onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Company Stock Purchases Summary' ? (

              <CompanyStockPurchasesSummary onBack={() => setActiveSection(null)} />

            ) : activeSection === 'CashSales Stock Supply Summary' ? (

              <CashSalesStockSupplySummary onBack={() => setActiveSection(null)} />

            ) : activeSection === 'NYP Stock Supply Summary' ? (

              <SummaryReportPage kind="nypSupply" />

            ) : activeSection === 'Payment To Companies Summary' ? (

              <PaymentToCompaniesSummary onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Stock Per Product' ? (

              <StockPerProduct onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Stock Balance' ? (

              <StockBalance onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Stock Cost Valuation' ? (

              <StockCostValuation onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Stock Selling Valuation' ? (

              <StockSellingValuation onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Stock Bin Card' ? (

              <StockBinCard onBack={() => setActiveSection(null)} />

            ) : activeSection === 'NYP Acct History' ? (

              <NypAccountPage kind="history" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'All NYP Acct Summary' ? (

              <NypAccountPage kind="summary" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'All Debtors Report' ? (

              <NypAccountPage kind="debtors" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Company Acct History' ? (

              <CompanyAccountPage kind="history" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'All Company Acct Summary' ? (

              <CompanyAccountPage kind="summary" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'All Creditors Report' ? (

              <CompanyAccountPage kind="creditors" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Bank Activity Report' ? (

              <BankAnalysisPage kind="activity" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Bank Statement Report' ? (

              <BankAnalysisPage kind="statement" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Admin User' ? (

              <MdCeoPage kind="user" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Cashier Management' ? (

              <CashierManagement onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Admin Code' ? (

              <AdminCodePage onBack={() => setActiveSection(null)} />

            ) : activeSection === 'MD CashSales-Payment Status' ? (

              <MdCeoPage kind="cashstatus" />

            ) : activeSection === 'All External Cash Pay-IN Report' ? (

              <AllExternalCashPayInReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'All Expenses Report' ? (

              <AllExpensesReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'All Cash Deposit Report' ? (

              <AllCashDepositReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'All Banking Report' ? (

              <AllBankingReport onBack={() => setActiveSection(null)} />

            ) : activeSection === 'MD Acct Status Analysis' ? (

              <MdCeoPage kind="acctanalysis" />

            ) : activeSection === 'Account Status Summary' ? (

              <AccountStatusSummary onBack={() => setActiveSection(null)} />

            ) : activeSection === 'All Account Status Summary' ? (

              <AllAccountStatusSummary onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Company Stock Delete' ? (

              <MdCeoDesk2ConnectedPage kind="company" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete Stock Purchase Report' ? (

              <MdCeoDesk2ConnectedPage kind="purchase" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete Stock' ? (

              <MdCeoDesk2ConnectedPage kind="stock" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete NYP Account' ? (

              <MdCeoDesk2ConnectedPage kind="nyp" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete Company Account' ? (

              <MdCeoDesk2ConnectedPage kind="companyAcct" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete Bank Report' ? (

              <MdCeoDesk2ConnectedPage kind="bank" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete Expenses Report' ? (

              <MdCeoDesk2ConnectedPage kind="expenses" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete Cash Deposit Report' ? (

              <MdCeoDesk2ConnectedPage kind="deposit" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete CashSales Report' ? (

              <MdCeoDesk2ConnectedPage kind="cashsales" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete NYPSales Report' ? (

              <MdCeoDesk2ConnectedPage kind="nypsales" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete Stock Adjust Report' ? (

              <MdCeoDesk2ConnectedPage kind="adjust" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete Stock Bin Card Report' ? (

              <MdCeoDesk2ConnectedPage kind="bincard" onBack={() => setActiveSection(null)} />

            ) : activeSection === 'Delete Account Status Analysis Report' ? (

              <MdCeoDesk2ConnectedPage kind="acct" onBack={() => setActiveSection(null)} />
            ) : activeSection ? (

              <div className="placeholder">

                <b>
                  {activeSection.toUpperCase()}
                </b>

                <p>
                  We will recreate this section
                  from the original screen recording.
                </p>

              </div>

            ) : (

              <HomeDashboard onNavigate={openSection} />

            )}

          </main>

        </div>

        {/* FOOTER */}

        <footer className="footer">
          THE LORD'S DOING GLOBAL CONCEPT SERVICES NIG. LTD. Copyright © 2026. All rights reserved
        </footer>

      </div>

    </div>
    </>
  )
}

createRoot(
  document.getElementById('root')
).render(
  <App />
)