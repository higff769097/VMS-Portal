import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export const useVendors = () => {
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchVendors = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('vendors')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error
            setVendors(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addVendor = async (vendor) => {
        const { data, error } = await supabase
            .from('vendors')
            .insert([vendor])
            .select()

        if (!error) {
            setVendors(prev => [...prev, data[0]])
        }
        return { data, error }
    }

    const deleteVendor = async (id) => {
        const { error } = await supabase
            .from('vendors')
            .delete()
            .eq('id', id)

        if (!error) {
            setVendors(prev => prev.filter(v => v.id !== id))
        }
        return { error }
    }

    useEffect(() => {
        fetchVendors()
    }, [])

    return { vendors, loading, error, fetchVendors, addVendor, deleteVendor }
}

export const useTransactions = (vendorId = null) => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchTransactions = async () => {
        try {
            setLoading(true)
            let query = supabase
                .from('transactions')
                .select('*, vendors(name)')
                .order('transaction_date', { ascending: false })

            if (vendorId) {
                query = query.eq('vendor_id', vendorId)
            }

            const { data, error } = await query
            if (error) throw error
            setTransactions(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const addTransaction = async (transaction) => {
        // 1. Insert Transaction
        const { data, error } = await supabase
            .from('transactions')
            .insert([transaction])
            .select()

        if (error) return { data, error }

        // 2. Update Vendor Balance
        const adjustment = transaction.type === 'GIVE' ? transaction.amount : -transaction.amount
        const { error: balanceError } = await supabase.rpc('adjust_vendor_balance', {
            v_id: transaction.vendor_id,
            amount_adj: adjustment
        })

        if (!balanceError) {
            fetchTransactions()
        }

        return { data, error, balanceError }
    }

    useEffect(() => {
        fetchTransactions()
    }, [vendorId])

    return { transactions, loading, error, fetchTransactions, addTransaction }
}
