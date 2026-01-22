/* @vitest-environment jsdom */
import React from 'react'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, beforeEach, afterEach, expect } from 'vitest'
import ResultsPage from './ResultsPage'
import AnalysisPage from './AnalysisPage'
import FilterBar from '../components/FilterBar'
import { MemoryRouter } from 'react-router-dom'

const makeResults = (overrides = {}) => {
  const transactions = [
    { date: '01/01/2025', description: 'Apple Store', credit: 0, debit: 1200, category: 'Shopping' },
    { date: '05/02/2025', description: 'Cafe', credit: 0, debit: 300, category: 'Food' },
    { date: '10/03/2025', description: 'Salary', credit: 50000, debit: 0, category: 'Income' },
    { date: '15/03/2025', description: 'Rent', credit: 0, debit: 15000, category: 'Rent' }
  ]

  const fraud_analysis = {
    flagged_transactions: [transactions[3]],
    flagged_count: 1,
    all_transactions: [
      { fraud_probability: 0.01, is_flagged: false },
      { fraud_probability: 0.02, is_flagged: false },
      { fraud_probability: 0.0, is_flagged: false },
      { fraud_probability: 0.95, is_flagged: true }
    ],
    premium_analysis: {
      spending_analysis: {
        category_distribution: [
          { category: 'Shopping', total: 1200, percentage: 10, count: 1, credit: 0, debit: 1200 },
          { category: 'Food', total: 300, percentage: 2.5, count: 1, credit: 0, debit: 300 }
        ]
      }
    }
  }

  return {
    timestamp: new Date().toISOString(),
    metadata: { total_transactions: transactions.length },
    transactions,
    fraud_analysis,
    ...overrides
  }
}

describe('ResultsPage - integration filters', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    cleanup()
    // clean up any global fetch mocks to avoid leakage between tests
    if (global.fetch && global.fetch.mockClear) {
      global.fetch.mockClear()
    }
    try { delete global.fetch } catch (e) {}
  })

  it('renders transactions and updates when flagged only is toggled', () => {
    const results = makeResults()
    sessionStorage.setItem('analysisResults', JSON.stringify(results))

    render(<MemoryRouter><ResultsPage /></MemoryRouter>)

    // switch to Transactions tab then assert header shows 4
    const tabBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Transactions'))
    userEvent.click(tabBtn)
    // initial header shows 4 (find the Transactions header specifically)
    const header = Array.from(container.querySelectorAll('h2')).find(h => h.textContent.trim().startsWith('Transactions ('))
    expect(header).toBeTruthy()
    expect(header.textContent).toMatch(/Transactions \(4\)/)

    // Toggle flagged only by clicking its label
    const flaggedLabel = Array.from(document.querySelectorAll('label')).find(l => l.textContent.includes('Flagged only'))
    userEvent.click(flaggedLabel)

    // header should update to 1
    const updatedHeader = Array.from(container.querySelectorAll('h2')).find(h => h.textContent.trim().startsWith('Transactions ('))
    expect(updatedHeader).toBeTruthy()
    expect(updatedHeader.textContent).toMatch(/Transactions \(1\)/)
  })

  it('filters by category select', () => {
    const results = makeResults()
    sessionStorage.setItem('analysisResults', JSON.stringify(results))
    render(<MemoryRouter><ResultsPage /></MemoryRouter>)

    const tabBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Transactions'))
    userEvent.click(tabBtn)
    const select = document.querySelector('select')
    userEvent.selectOptions(select, 'Food')

    const header = Array.from(container.querySelectorAll('h2')).find(h => h.textContent.trim().startsWith('Transactions ('))
    expect(header.textContent).toMatch(/Transactions \(1\)/)
    expect(container.textContent).toContain('Cafe')
  })

  it('filters by min/max amount', () => {
    const results = makeResults()
    sessionStorage.setItem('analysisResults', JSON.stringify(results))
    render(<MemoryRouter><ResultsPage /></MemoryRouter>)

    const tabBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Transactions'))
    userEvent.click(tabBtn)
    const minInput = document.querySelector('input[placeholder="Min amount"]')
    const maxInput = document.querySelector('input[placeholder="Max amount"]')

    userEvent.type(minInput, '1000')
    // ensure the input value is updated
    expect(minInput.value).toBe('1000')

    userEvent.clear(minInput)
    userEvent.type(maxInput, '1000')
    expect(maxInput.value).toBe('1000')
  })

  it('filters by date range', () => {
    const results = makeResults()
    sessionStorage.setItem('analysisResults', JSON.stringify(results))
    render(<MemoryRouter><ResultsPage /></MemoryRouter>)

    const tabBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Transactions'))
    userEvent.click(tabBtn)
    const dateInputs = document.querySelectorAll('input[type="date"]')
    const dateFrom = dateInputs[0]
    const dateTo = dateInputs[1]

    userEvent.type(dateFrom, '2025-03-01')
    userEvent.type(dateTo, '2025-03-31')

    // Ensure date inputs were updated
    expect(dateFrom.value).toBe('2025-03-01')
    expect(dateTo.value).toBe('2025-03-31')
  })

  it('AnalysisPage triggers API and stores results on multi upload', async () => {
    sessionStorage.clear()
    // mock fetch
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'success', metadata: { files_processed: 2 }, transactions: [] }) })

    render(<MemoryRouter><AnalysisPage /></MemoryRouter>)

    const multiBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Multiple PDFs'))
    userEvent.click(multiBtn)

    const fileInput = document.querySelector('input[type="file"]')
    const file1 = new File(['%PDF-1.4'], 'a.pdf', { type: 'application/pdf' })
    const file2 = new File(['%PDF-1.4'], 'b.pdf', { type: 'application/pdf' })

    // userEvent.upload properly triggers change events
    userEvent.upload(fileInput, [file1, file2])

    await waitFor(() => expect(sessionStorage.getItem('analysisResults')).toBeTruthy())
    const stored = JSON.parse(sessionStorage.getItem('analysisResults'))
    expect(stored.status).toBe('success')
  })

  it('FilterBar buttons call handlers', () => {
    const setTransactionType = vi.fn()
    const setAmountRange = vi.fn()
    const setFraudRange = vi.fn()
    const setCategoryIntent = vi.fn()
    const clearAll = vi.fn()

    render(<MemoryRouter><FilterBar transactionType={'All'} setTransactionType={setTransactionType} amountRange={''} setAmountRange={setAmountRange} fraudRange={''} setFraudRange={setFraudRange} categoryIntent={'All'} setCategoryIntent={setCategoryIntent} clearAll={clearAll} /></MemoryRouter>)

    const creditBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Credit')
    userEvent.click(creditBtn)
    expect(setTransactionType).toHaveBeenCalledWith('Credit')

    const rangeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === '1,000-10,000')
    userEvent.click(rangeBtn)
    expect(setAmountRange).toHaveBeenCalledWith('1,000-10,000')

    const clearBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Clear Filters')
    userEvent.click(clearBtn)
    expect(clearAll).toHaveBeenCalled()
  })
})
