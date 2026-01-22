import { describe, it, expect } from 'vitest'
import filterTransactions from './transactionFilters'

describe('filterTransactions', () => {
  const baseTxn = (overrides = {}) => ({
    txn: {
      date: '10/12/2025',
      description: 'Test',
      credit: 0,
      debit: 1000,
      category: 'Groceries',
      ...overrides
    },
    fraud: { is_flagged: false }
  })

  it('returns empty when no transactions', () => {
    expect(filterTransactions([], {})).toEqual([])
  })

  it('filters flagged only', () => {
    const data = [
      { ...baseTxn() },
      { ...baseTxn({ credit: 0, debit: 500 }), fraud: { is_flagged: true } }
    ]
    const out = filterTransactions(data, { flaggedOnly: true })
    expect(out.length).toBe(1)
    expect(out[0].fraud.is_flagged).toBe(true)
  })

  it('filters by category', () => {
    const data = [baseTxn(), baseTxn({ category: 'Bills' })]
    const out = filterTransactions(data, { categoryFilter: 'Bills' })
    expect(out.length).toBe(1)
    expect(out[0].txn.category).toBe('Bills')
  })

  it('filters by min/max amount', () => {
    const data = [baseTxn(), baseTxn({ debit: 2000 })]
    const outMin = filterTransactions(data, { minAmount: '1500' })
    expect(outMin.length).toBe(1)
    const outMax = filterTransactions(data, { maxAmount: '1500' })
    expect(outMax.length).toBe(1)
  })

  it('filters by date range', () => {
    const a = baseTxn({ date: '01/01/2025' })
    const b = baseTxn({ date: '15/06/2025' })
    const c = baseTxn({ date: '01/01/2026' })
    const data = [a, b, c]
    const out = filterTransactions(data, { dateFrom: '2025-01-01', dateTo: '2025-12-31' })
    expect(out.length).toBe(2)
  })
})
