import { TrendingUp, TrendingDown, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'

/**
 * TopPartiesCards - Displays top parties by credit, debit and frequency
 * Uses consistent emerald theme styling
 */
export default function TopPartiesCards({ partyLedger }) {
  if (!partyLedger || partyLedger.length === 0) {
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

  // Sort parties by credit (descending)
  const topByCredit = [...partyLedger]
    .sort((a, b) => (b.total_credit || 0) - (a.total_credit || 0))
    .slice(0, 3)

  // Sort parties by debit (descending)
  const topByDebit = [...partyLedger]
    .sort((a, b) => (b.total_debit || 0) - (a.total_debit || 0))
    .slice(0, 3)

  // Sort parties by transaction count (descending)
  const topByFrequency = [...partyLedger]
    .sort((a, b) => (b.transaction_count || 0) - (a.transaction_count || 0))
    .slice(0, 3)

  const PartyCard = ({ party, type, rank }) => {
    const isCredit = type === 'credit'
    const amount = isCredit ? (party.total_credit || 0) : (party.total_debit || 0)
    const Icon = isCredit ? TrendingUp : TrendingDown
    const colorClass = isCredit ? 'text-emerald-400' : 'text-rose-400'
    const bgClass = isCredit ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'
    
    return (
      <div className={`p-4 rounded-xl border ${bgClass} hover:bg-white/5 transition-all cursor-pointer`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
              {rank}
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Icon className={`w-4 h-4 ${colorClass}`} />
            </div>
          </div>
          <span className="text-lg font-bold text-white">{formatCurrency(amount)}</span>
        </div>
        <p className="text-sm text-white font-medium truncate mb-1" title={party.party_name}>
          {party.party_name}
        </p>
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>{party.transaction_count || 0} transactions</span>
          <span className={`px-2 py-0.5 rounded ${bgClass}`}>
            {isCredit ? 'Received' : 'Paid'}
          </span>
        </div>
      </div>
    )
  }

  const FrequencyCard = ({ party, rank }) => {
    const net = (party.total_credit || 0) - (party.total_debit || 0)
    const isPositive = net >= 0
    
    return (
      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-white/5 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300">
            {rank}
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-400" />
          </div>
        </div>
        <p className="text-sm text-white font-medium truncate mb-1" title={party.party_name}>
          {party.party_name}
        </p>
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>{party.transaction_count || 0} txns</span>
          <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
            {isPositive ? '+' : ''}{formatCurrency(net)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-6 py-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Top Parties</h3>
            <p className="text-sm text-emerald-300/70">Most active parties in your transactions</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top by Credit */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4" />
              Most Received From
            </h4>
            <div className="space-y-3">
              {topByCredit.map((party, idx) => (
                <PartyCard key={party.party_name} party={party} type="credit" rank={idx + 1} />
              ))}
            </div>
          </div>

          {/* Top by Debit */}
          <div>
            <h4 className="text-sm font-semibold text-rose-400 mb-3 flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4" />
              Most Paid To
            </h4>
            <div className="space-y-3">
              {topByDebit.map((party, idx) => (
                <PartyCard key={party.party_name} party={party} type="debit" rank={idx + 1} />
              ))}
            </div>
          </div>

          {/* Top by Frequency */}
          <div>
            <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Most Frequent
            </h4>
            <div className="space-y-3">
              {topByFrequency.map((party, idx) => (
                <FrequencyCard key={party.party_name} party={party} rank={idx + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/5 px-6 py-3 border-t border-white/10">
        <p className="text-xs text-white/40 text-center">
          Click on any party to view their transactions
        </p>
      </div>
    </div>
  )
}

