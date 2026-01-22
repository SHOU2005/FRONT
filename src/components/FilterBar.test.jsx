/* @vitest-environment happy-dom */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterBar from './FilterBar'

test('filter bar buttons set active states and clear works', () => {
  const mock = {
    transactionType: 'All', setTransactionType: vi.fn(),
    amountRange: '', setAmountRange: vi.fn(),
    fraudRange: '', setFraudRange: vi.fn(),
    categoryIntent: 'All', setCategoryIntent: vi.fn(),
    clearAll: vi.fn()
  }

  render(<FilterBar {...mock} />)

  const creditBtn = screen.getByText('Credit')
  fireEvent.click(creditBtn)
  expect(mock.setTransactionType).toHaveBeenCalledWith('Credit')

  const rangeBtn = screen.getByText('1,000-10,000')
  fireEvent.click(rangeBtn)
  expect(mock.setAmountRange).toHaveBeenCalledWith('1,000-10,000')

  const clearBtn = screen.getByText('Clear Filters')
  fireEvent.click(clearBtn)
  expect(mock.clearAll).toHaveBeenCalled()
})
