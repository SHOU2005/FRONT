/* @vitest-environment happy-dom */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AnalysisPage from './AnalysisPage'
import { MemoryRouter } from 'react-router-dom'

// Mock fetch
beforeEach(() => {
  global.fetch = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('uploads multiple PDFs and navigates to results on success', async () => {
  const mockResult = {
    status: 'success',
    metadata: { files_processed: 2, total_transactions: 4 },
    transactions: [
      { date: '01/01/2025', description: 'Salary', credit: 50000, debit: 0 },
      { date: '02/01/2025', description: 'Grocery', credit: 0, debit: 2500 }
    ],
    fraud_analysis: { flagged_count: 0, fraud_rate: 0 }
  }

  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockResult })

  render(<MemoryRouter><AnalysisPage /></MemoryRouter>)

  // Emulate selecting multi mode
  const multiBtn = screen.getByText(/Multiple PDFs/i)
  fireEvent.click(multiBtn)

  // Create fake files
  const fileInput = document.querySelector('input[type="file"]')
  const file1 = new File(["%PDF-1.4"], 'stmt1.pdf', { type: 'application/pdf' })
  const file2 = new File(["%PDF-1.4"], 'stmt2.pdf', { type: 'application/pdf' })

  fireEvent.change(fileInput, { target: { files: [file1, file2] } })

  // Upload button should appear
  const uploadButton = await screen.findByText(/Analyze 2 PDFs Simultaneously/i)
  fireEvent.click(uploadButton)

  // Wait for navigation to results (analysisComplete state triggers redirect)
  await waitFor(() => expect(sessionStorage.getItem('analysisResults')).toBeTruthy(), { timeout: 2000 })
  const stored = JSON.parse(sessionStorage.getItem('analysisResults'))
  expect(stored.status).toBe('success')
})
