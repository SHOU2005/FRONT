import { TrendingUp, TrendingDown, DollarSign, Calendar, Hash, ArrowRight } from 'lucide-react'

/**
 * EnhancedStats - Additional statistics beyond basic counts
 * Uses consistent emerald theme styling
 */
export default function EnhancedStats({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return null
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate statistics
  const credits = transactions.map(t => t.credit || 0).filter(c => c > 0)
  const debits = transactions.map(t => t.debit || 0).filter(d => d > 0)
  
  const allAmounts = [...credits, ...debits]
  const maxAmount = Math.max(...allAmounts)
  const minAmount = Math.min(...allAmounts)
  const avgAmount = allAmounts.reduce((a, b) => a + b, 0) / allAmounts.length
  
  const totalTxns = transactions.length
  const upiTxns = transactions.filter(t => t.is_upi).length
  const transferTxns = transactions.filter(t => t.is_transfer && !t.is_upi).length
  const cashTxns = transactions.filter(t => !t.is_upi && !t.is_transfer).length

  // Date range
  const dates = transactions
    .map(t => t.date || t.transaction_date)
    .filter(d => d)
    .sort((a, b) => new Date(a) - new Date(b))
  
  const startDate = dates[0] || 'N/A'
  const endDate = dates[dates.length - 1] || 'N/A'

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'emerald' }) => {
    const colorClasses = {
      emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
      rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
      blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
      purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
      amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    }
    const colors = colorClasses[color] || colorClasses.emerald
    
    return (
      <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-4 h-4 ${colors.text}`} />
          <span className="text-xs text-white/40 uppercase tracking-wider">{title}</span>
        </div>
        <p className={`text-xl font-bold ${colors.text}`}>{value}</p>
        {subtitle && <p className="text-xs text-white/40 mt-1">{subtitle}</p>}
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-6 py-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Hash className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Transaction Statistics</h3>
            <p className="text-sm text-emerald-300/70">Detailed analysis of your transactions</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={DollarSign}
            title="Average Transaction"
            value={formatCurrency(avgAmount)}
            subtitle="Per transaction"
            color="blue"
          />
          <StatCard 
            icon={TrendingUp}
            title="Largest Transaction"
            value={formatCurrency(maxAmount)}
            subtitle="Single entry"
            color="emerald"
          />
          <StatCard 
            icon={TrendingDown}
            title="Smallest Transaction"
            value={formatCurrency(minAmount)}
            subtitle="Single entry"
            color="rose"
          />
          <StatCard 
            icon={Calendar}
            title="Period"
            value={dates.length > 0 ? `${dates.length} months` : 'N/A'}
            subtitle={`${startDate} - ${endDate}`}
            color="purple"
          />
        </div>

        {/* Transaction Type Breakdown */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-sm font-medium text-white/60 mb-3">Transaction Types</p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-sm text-white/60">UPI:</span>
              <span className="text-sm font-medium text-purple-400">{upiTxns}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span className="text-sm text-white/60">Transfer:</span>
              <span className="text-sm font-medium text-indigo-400">{transferTxns}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-sm text-white/60">Direct:</span>
              <span className="text-sm font-medium text-emerald-400">{cashTxns}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg ml-auto">
              <span className="text-sm text-white/60">Total:</span>
              <span className="text-sm font-medium text-white">{totalTxns}</span>
            </div>
          </div>
        </div>

        {/* Ratio Display */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Credit to Debit Ratio</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">{credits.length}</span>
              <ArrowRight className="w-4 h-4 text-white/40" />
              <span className="text-rose-400">{debits.length}</span>
            </div>
          </div>
          <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500" 
              style={{ width: `${(credits.length / totalTxns) * 100}%` }}
            />
            <div 
              className="bg-rose-500" 
              style={{ width: `${(debits.length / totalTxns) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

