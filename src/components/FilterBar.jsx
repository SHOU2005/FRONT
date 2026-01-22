import React from 'react'

const pillClass = (active) => `px-4 py-2 rounded-full font-semibold transition-transform transform ${active ? 'bg-indigo-600 text-white scale-105 shadow-lg' : 'bg-white/5 text-white/70 hover:scale-105 hover:bg-white/10'}`

export default function FilterBar({
  transactionType, setTransactionType,
  amountRange, setAmountRange,
  fraudRange, setFraudRange,
  categoryIntent, setCategoryIntent,
  clearAll
}) {
  const transactionTypes = ['All', 'Credit', 'Debit', 'Transfers', 'UPI', 'Bank Transfer', 'Cash Flow', 'EMI', 'Loan', 'Investment', 'Refund', 'Reward', 'Bills', 'Subscription', 'Unknown']
  const amountRanges = ['0-1,000', '1,000-10,000', '10,000-50,000', '50,000+']
  const fraudRanges = ['Safe (<0.30)', 'Medium (0.30–0.60)', 'High (0.60–0.80)', 'Critical (>0.80)']
  const categoryIntents = ['Income', 'Expense', 'Transfer', 'EMI', 'Loan', 'Investment', 'Refund', 'Reward', 'Bills', 'Subscription', 'Unknown']

  return (
    <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/10">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-sm text-white/60 mb-2">Transaction Type</div>
          <div className="flex flex-wrap gap-2">
            {transactionTypes.map(t => (
              <button key={t} className={pillClass(transactionType === t)} onClick={() => setTransactionType(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm text-white/60 mb-2">Amount Range</div>
          <div className="flex gap-2">
            {amountRanges.map(a => (
              <button key={a} className={pillClass(amountRange === a)} onClick={() => setAmountRange(a)}>{a}</button>
            ))}
            <button className={pillClass(amountRange === 'Custom')} onClick={() => setAmountRange('Custom')}>Custom</button>
          </div>
        </div>

        <div>
          <div className="text-sm text-white/60 mb-2">Fraud Confidence</div>
          <div className="flex gap-2">
            {fraudRanges.map(f => (
              <button key={f} className={pillClass(fraudRange === f)} onClick={() => setFraudRange(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm text-white/60 mb-2">Category Intent</div>
          <div className="flex flex-wrap gap-2">
            {categoryIntents.map(c => (
              <button key={c} className={pillClass(categoryIntent === c)} onClick={() => setCategoryIntent(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={clearAll} className="px-4 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10">Clear Filters</button>
        </div>
      </div>
    </div>
  )
}
