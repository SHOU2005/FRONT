import { X, Calendar, FileText, Building2, CreditCard, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react'

/**
 * TransactionDetailModal - Shows full details of a transaction
 * Uses consistent emerald theme styling
 */
export default function TransactionDetailModal({ transaction, onClose, onPartyClick }) {
  if (!transaction) return null

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const isCredit = (transaction.credit || 0) > 0
  const amount = transaction.credit || transaction.debit || 0

  const detailItems = [
    { label: 'Date', value: transaction.date || transaction.transaction_date || 'N/A', icon: Calendar },
    { label: 'Description', value: transaction.description || transaction.narration || 'N/A', icon: FileText },
    { label: 'Party', value: transaction.detected_party || 'Unknown', icon: Building2, highlight: true },
    { label: 'Amount', value: (isCredit ? '+' : '-') + formatCurrency(amount), icon: CreditCard, isAmount: true },
    { label: 'Type', value: transaction.is_upi ? 'UPI' : transaction.is_transfer ? 'Transfer' : (isCredit ? 'Credit' : 'Debit'), icon: Tag },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className={`
          px-6 py-4 border-b flex items-center justify-between
          ${isCredit 
            ? 'bg-emerald-500/10 border-emerald-500/20' 
            : 'bg-rose-500/10 border-rose-500/20'
          }
        `}>
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${isCredit ? 'bg-emerald-500/20' : 'bg-rose-500/20'}
            `}>
              {isCredit ? (
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-rose-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Transaction Details</h3>
              <p className={`text-sm ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCredit ? 'Credit Entry' : 'Debit Entry'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount Display */}
          <div className="text-center mb-6">
            <p className={`text-4xl font-bold ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCredit ? '+' : '-'}{formatCurrency(amount)}
            </p>
          </div>

          {/* Detail Items */}
          <div className="space-y-3">
            {detailItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <div 
                  key={idx}
                  className={`
                    flex items-start gap-3 p-3 rounded-xl transition-colors
                    ${item.highlight ? 'bg-emerald-500/5 hover:bg-emerald-5/10 cursor-pointer' : 'bg-white/5'}
                  `}
                  onClick={() => {
                    if (item.highlight && item.value !== 'Unknown' && onPartyClick) {
                      onPartyClick(item.value)
                      onClose()
                    }
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/40 uppercase tracking-wider">{item.label}</p>
                    <p className={`
                      text-sm font-medium truncate
                      ${item.isAmount ? (isCredit ? 'text-emerald-400' : 'text-rose-400') : 'text-white'}
                    `}>
                      {item.value}
                    </p>
                  </div>
                  {item.highlight && item.value !== 'Unknown' && (
                    <span className="text-xs text-emerald-400">Click to filter</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {transaction.is_upi && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs border border-purple-500/30">
                  UPI Transaction
                </span>
              )}
              {transaction.is_transfer && (
                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs border border-indigo-500/30">
                  Bank Transfer
                </span>
              )}
              {transaction.upi_handle && (
                <span className="px-2 py-1 bg-white/10 text-white/60 rounded text-xs font-mono">
                  @{transaction.upi_handle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/5 px-6 py-3 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">
            Transaction ID: {transaction.id || transaction.transaction_id || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}

