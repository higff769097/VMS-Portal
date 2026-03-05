import React, { useState } from 'react'

const AddTransactionForm = ({ vendors, onAdd, onCancel }) => {
    const [formData, setFormData] = useState({
        vendor_id: vendors[0]?.id || '',
        type: 'GIVE',
        payment_method: 'CASH',
        amount: '',
        notes: '',
        transaction_date: new Date().toISOString().split('T')[0]
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.vendor_id) return alert('Please select a vendor')
        setLoading(true)
        await onAdd({
            ...formData,
            amount: parseFloat(formData.amount)
        })
        setLoading(false)
    }

    return (
        <div className="glass card animate-slide-up" style={{ maxWidth: '500px', margin: 'var(--spacing-lg) auto' }}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Record Transaction</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                <div className="flex flex-col gap-xs">
                    <label>Select Vendor *</label>
                    <select
                        className="glass"
                        style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'white' }}
                        required
                        value={formData.vendor_id}
                        onChange={e => setFormData({ ...formData, vendor_id: e.target.value })}
                    >
                        <option value="">-- Choose Vendor --</option>
                        {vendors.map(v => (
                            <option key={v.id} value={v.id}>{v.name} (Bal: ₹{v.balance})</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-md">
                    <div className="flex flex-col gap-xs" style={{ flex: 1 }}>
                        <label>Type *</label>
                        <select
                            className="glass"
                            style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'white' }}
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="GIVE">GIVE (You Paid)</option>
                            <option value="TAKE">TAKE (You Received)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-xs" style={{ flex: 1 }}>
                        <label>Payment Method *</label>
                        <select
                            className="glass"
                            style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'white' }}
                            value={formData.payment_method}
                            onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                        >
                            <option value="CASH">CASH</option>
                            <option value="UPI">UPI</option>
                            <option value="NEFT">NEFT</option>
                            <option value="CHEQUE">CHEQUE</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-xs">
                    <label>Amount (₹) *</label>
                    <input
                        type="number"
                        className="glass"
                        style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'white' }}
                        required
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-xs">
                    <label>Notes</label>
                    <textarea
                        className="glass"
                        style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'white', minHeight: '80px' }}
                        placeholder="Item details, bill number, etc."
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                <div className="flex gap-md" style={{ marginTop: 'var(--spacing-lg)' }}>
                    <button type="button" onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                        {loading ? 'Saving...' : 'Record Entry'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddTransactionForm
