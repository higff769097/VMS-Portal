import React, { useState, useEffect } from 'react'
import { useVendors, useTransactions } from './hooks/useData'
import AddVendorForm from './components/AddVendorForm'
import AddTransactionForm from './components/AddTransactionForm'
import VendorDetails from './components/VendorDetails'
import LoginPage from './components/LoginPage'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const { vendors, loading: vendorsLoading, addVendor, deleteVendor, fetchVendors } = useVendors()
  const { transactions, loading: transLoading, addTransaction } = useTransactions()
  const [showAddVendor, setShowAddVendor] = useState(false)
  const [showAddTrans, setShowAddTrans] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)

  useEffect(() => {
    const authStatus = localStorage.getItem('vms_auth')
    const role = localStorage.getItem('vms_role')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      setUserRole(role)
    }
  }, [])

  const handleLogin = (role) => {
    localStorage.setItem('vms_auth', 'true')
    localStorage.setItem('vms_role', role)
    setIsAuthenticated(true)
    setUserRole(role)
  }

  const handleLogout = () => {
    localStorage.removeItem('vms_auth')
    localStorage.removeItem('vms_role')
    setIsAuthenticated(false)
    setUserRole(null)
  }

  const handleAddVendor = async (vendor) => {
    const { error } = await addVendor(vendor)
    if (!error) setShowAddVendor(false)
    else alert('Error adding vendor: ' + error.message)
  }

  const handleDeleteVendor = async (id) => {
    const { error } = await deleteVendor(id)
    if (!error) {
      setSelectedVendor(null)
    } else {
      alert('Error deleting vendor: ' + error.message)
    }
  }

  const handleAddTransaction = async (transaction) => {
    const { error } = await addTransaction(transaction)
    if (!error) {
      setShowAddTrans(false)
      fetchVendors() // Refresh balances
    } else {
      alert('Error recording transaction: ' + error.message)
    }
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  const isAdmin = userRole === 'admin'
  const pendingPayments = vendors.reduce((acc, v) => acc + (v.balance < 0 ? Math.abs(v.balance) : 0), 0)

  return (
    <div className="container">
      <header className="flex justify-between items-center gap-lg" style={{ padding: 'var(--spacing-xl) 0' }}>
        <div className="flex items-center gap-lg">
          <div>
            <h1 style={{ color: 'var(--primary)', fontSize: '2rem' }}>VMS Portal</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isAdmin ? 'Administrator Dashboard' : 'Staff Viewer Access'}
            </p>
          </div>
        </div>
        <div className="flex gap-md">
          {isAdmin && (
            <>
              <button className="btn btn-secondary" onClick={() => setShowAddTrans(true)}>Record Entry</button>
              <button className="btn btn-primary" onClick={() => setShowAddVendor(true)}>Add Vendor</button>
            </>
          )}
          <button className="btn btn-secondary" onClick={handleLogout} style={{ border: '1px solid var(--error)', color: 'var(--error)' }}>
            Logout
          </button>
        </div>
      </header>

      {(showAddVendor || showAddTrans || selectedVendor) && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {showAddVendor ? (
            <AddVendorForm onAdd={handleAddVendor} onCancel={() => setShowAddVendor(false)} />
          ) : showAddTrans ? (
            <AddTransactionForm vendors={vendors} onAdd={handleAddTransaction} onCancel={() => setShowAddTrans(false)} />
          ) : (
            <VendorDetails
              vendor={selectedVendor}
              isAdmin={isAdmin}
              onBack={() => setSelectedVendor(null)}
              onDelete={handleDeleteVendor}
            />
          )}
        </div>
      )}

      <main style={{ marginTop: 'var(--spacing-2xl)' }}>
        <div className="grid animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
          <div className="card glass animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Active Vendors</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>
              {vendorsLoading ? '...' : vendors.length}
            </p>
            <p style={{ color: 'var(--success)', fontSize: '0.875rem' }}>Cloud Integrated</p>
          </div>
          <div className="card glass">
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Pending Payments</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>
              ₹ {vendorsLoading ? '...' : pendingPayments.toLocaleString()}
            </p>
            <p style={{ color: 'var(--warning)', fontSize: '0.875rem' }}>Based on current balances</p>
          </div>
          <div className="card glass">
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Recent Activity</h3>
            <p style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: 'var(--spacing-md)' }}>
              {transLoading ? 'Loading transactions...' : `${transactions.length} total entries`}
            </p>
          </div>
        </div>

        <section style={{ marginTop: 'var(--spacing-2xl)' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2>Transaction History</h2>
            <button className="btn btn-secondary">View All</button>
          </div>
          <div className="card" style={{ padding: transLoading || transactions.length === 0 ? 'var(--spacing-xl)' : '0' }}>
            {transLoading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>Syncing with cloud...</p>
            ) : transactions.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>No transactions found. Add a vendor and start tracking.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: 'var(--spacing-md)' }}>Vendor</th>
                    <th style={{ padding: 'var(--spacing-md)' }}>Type</th>
                    <th style={{ padding: 'var(--spacing-md)' }}>Method</th>
                    <th style={{ padding: 'var(--spacing-md)' }}>Amount</th>
                    <th style={{ padding: 'var(--spacing-md)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: 'var(--spacing-md)' }}>{t.vendors?.name || 'Unknown'}</td>
                      <td style={{ padding: 'var(--spacing-md)' }}>
                        <span style={{ color: t.type === 'GIVE' ? 'var(--success)' : 'var(--error)' }}>
                          {t.type}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--spacing-md)' }}>{t.payment_method}</td>
                      <td style={{ padding: 'var(--spacing-md)' }}>₹ {t.amount.toLocaleString()}</td>
                      <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-tertiary)' }}>
                        {new Date(t.transaction_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section style={{ marginTop: 'var(--spacing-2xl)' }}>
          <h2>Vendor Directory</h2>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
            {vendors.map((v, index) => (
              <div
                key={v.id}
                className="card glass animate-slide-up"
                style={{ borderLeft: `4px solid ${v.balance < 0 ? 'var(--error)' : 'var(--success)'}`, cursor: 'pointer', animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedVendor(v)}
              >
                <h4 style={{ color: 'var(--primary)' }}>{v.name}</h4>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>{v.category}</p>
                <div className="flex justify-between items-center" style={{ marginTop: 'var(--spacing-md)' }}>
                  <span style={{ fontWeight: '700' }}>₹ {v.balance.toLocaleString()}</span>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
