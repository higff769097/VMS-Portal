import React from 'react'
import { useTransactions } from '../hooks/useData'

const VendorDetails = ({ vendor, onBack, onDelete, isAdmin }) => {
    const { transactions, loading } = useTransactions(vendor.id)

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${vendor.name}? This will NOT delete their transaction history for audit purposes but remove them from the active list.`)) {
            onDelete(vendor.id)
        }
    }

    return (
        <div className="card glass animate-slide-up" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <header className="flex justify-between items-start" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: 'var(--spacing-md)', padding: '4px 12px' }}>
                        &larr; Back to Dashboard
                    </button>
                    <h2 style={{ color: 'var(--primary)', fontSize: '2rem' }}>{vendor.name}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{vendor.category} | {vendor.contact || 'No contact info'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Current Balance</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: vendor.balance < 0 ? 'var(--error)' : 'var(--success)' }}>
                        ₹ {vendor.balance.toLocaleString()}
                    </p>
                    {isAdmin && (
                        <button
                            className="btn btn-secondary"
                            onClick={handleDelete}
                            style={{ marginTop: 'var(--spacing-md)', border: '1px solid var(--error)', color: 'var(--error)' }}
                        >
                            Delete Vendor
                        </button>
                    )}
                </div>
            </header>

            <section>
                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Transaction History</h3>
                <div className="card" style={{ padding: '0', background: 'rgba(0,0,0,0.2)' }}>
                    {loading ? (
                        <p style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>Loading transactions...</p>
                    ) : transactions.length === 0 ? (
                        <p style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--text-tertiary)' }}>No transactions for this vendor.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: 'var(--spacing-md)' }}>Type</th>
                                    <th style={{ padding: 'var(--spacing-md)' }}>Method</th>
                                    <th style={{ padding: 'var(--spacing-md)' }}>Amount</th>
                                    <th style={{ padding: 'var(--spacing-md)' }}>Date</th>
                                    <th style={{ padding: 'var(--spacing-md)' }}>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                background: t.type === 'GIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: t.type === 'GIVE' ? 'var(--success)' : 'var(--error)'
                                            }}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{t.payment_method}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>₹ {t.amount.toLocaleString()}</td>
                                        <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                                            {new Date(t.transaction_date).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                                            {t.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </div>
    )
}

export default VendorDetails
