import React, { useState } from 'react'

const AddVendorForm = ({ onAdd, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact_phone: '',
        contact_email: '',
        category: 'General',
        balance: 0
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await onAdd(formData)
        setLoading(false)
    }

    return (
        <div className="glass card animate-slide-up" style={{ maxWidth: '500px', margin: 'var(--spacing-lg) auto' }}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Add New Vendor</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                <div className="flex flex-col gap-xs">
                    <label>Vendor Name *</label>
                    <input
                        className="glass"
                        style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'white' }}
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-xs">
                    <label>Phone Number</label>
                    <input
                        className="glass"
                        style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'white' }}
                        value={formData.contact_phone}
                        onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-xs">
                    <label>Category</label>
                    <select
                        className="glass"
                        style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'white' }}
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="General">General</option>
                        <option value="Raw Materials">Raw Materials</option>
                        <option value="Tools">Tools</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Services">Services</option>
                    </select>
                </div>
                <div className="flex gap-md" style={{ marginTop: 'var(--spacing-lg)' }}>
                    <button type="button" onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                        {loading ? 'Adding...' : 'Save Vendor'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddVendorForm
