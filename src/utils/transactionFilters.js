export function filterTransactions(mergedTransactions, { 
  flaggedOnly=false, 
  categoryFilter='All', 
  minAmount='', 
  maxAmount='', 
  dateFrom='', 
  dateTo='',
  transactionType='All',
  amountRange='All',
  fraudConfidence='All',
  categoryIntent='All'
} = {}) {
  return (mergedTransactions || []).filter(({ txn, fraud }) => {
    // flagged filter
    if (flaggedOnly && !fraud?.is_flagged) return false

    // transaction type filter
    if (transactionType && transactionType !== 'All') {
      const credit = txn.credit > 0
      const debit = txn.debit > 0
      
      switch(transactionType) {
        case 'Credit Only':
          if (!credit) return false
          break
        case 'Debit Only':
          if (!debit) return false
          break
        case 'Transfers Only':
          if (!['UPI Transfer', 'Bank Transfer'].includes(txn.category)) return false
          break
        case 'UPI Only':
          if (txn.category !== 'UPI Transfer') return false
          break
        case 'Bank Transfer Only':
          if (txn.category !== 'Bank Transfer') return false
          break
        case 'Cash Flow':
        case 'EMI':
        case 'Loan':
        case 'Investment':
        case 'Refund':
        case 'Reward':
          if (txn.category !== transactionType && txn.category !== `Reward/Cashback`) return false
          break
        case 'Bills':
          if (txn.category !== 'Bill Payment') return false
          break
        case 'Subscription':
          if (txn.category !== 'Subscription') return false
          break
        case 'Unknown':
          if (txn.category !== 'Unknown') return false
          break
      }
    }

    // amount range filter
    if (amountRange && amountRange !== 'All') {
      const amount = txn.credit > 0 ? txn.credit : txn.debit
      switch(amountRange) {
        case '0-1,000':
          if (amount < 0 || amount > 1000) return false
          break
        case '1,000-10,000':
          if (amount < 1000 || amount > 10000) return false
          break
        case '10,000-50,000':
          if (amount < 10000 || amount > 50000) return false
          break
        case '50,000+':
          if (amount < 50000) return false
          break
      }
    }

    // fraud confidence filter
    if (fraudConfidence && fraudConfidence !== 'All') {
      const fraudProb = fraud?.fraud_probability || 0
      switch(fraudConfidence) {
        case 'Safe (<0.30)':
          if (fraudProb >= 0.30) return false
          break
        case 'Medium (0.30-0.60)':
          if (fraudProb < 0.30 || fraudProb >= 0.60) return false
          break
        case 'High (0.60-0.80)':
          if (fraudProb < 0.60 || fraudProb >= 0.80) return false
          break
        case 'Critical (>0.80)':
          if (fraudProb < 0.80) return false
          break
      }
    }

    // category intent filter
    if (categoryIntent && categoryIntent !== 'All') {
      const category = txn.category || 'Unknown'
      const intentMap = {
        'Income': ['Income'],
        'Expense': ['Expense'],
        'Transfer': ['UPI Transfer', 'Bank Transfer'],
        'EMI': ['EMI'],
        'Loan': ['Loan'],
        'Investment': ['Investment'],
        'Refund': ['Refund'],
        'Reward': ['Reward/Cashback'],
        'Bills': ['Bill Payment'],
        'Subscription': ['Subscription'],
        'Unknown': ['Unknown']
      }
      if (!intentMap[categoryIntent]?.includes(category)) return false
    }

    // category filter (legacy support)
    if (categoryFilter && categoryFilter !== 'All' && (txn.category || 'Unknown') !== categoryFilter) return false

    // amount filter (legacy support)
    const amount = txn.credit > 0 ? txn.credit : txn.debit
    if (minAmount !== '' && amount < Number(minAmount)) return false
    if (maxAmount !== '' && amount > Number(maxAmount)) return false

    // date range filter (txn.date expected in DD/MM/YYYY)
    const parseDDMMYYYY = (dstr) => {
      const parts = (dstr || '').split('/')
      if (parts.length !== 3) return null
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
    }
    if (dateFrom) {
      const from = new Date(dateFrom)
      const d = parseDDMMYYYY(txn.date)
      if (!d || d < from) return false
    }
    if (dateTo) {
      const to = new Date(dateTo)
      const d = parseDDMMYYYY(txn.date)
      if (!d || d > to) return false
    }

    return true
  })
}

export default filterTransactions
