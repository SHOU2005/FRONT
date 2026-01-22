import { Link2, Users, ArrowRight, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'

/**
 * PartyRelationTable - Displays party relationship mapping and interaction network
 * Uses consistent emerald theme styling
 */
export default function PartyRelationTable({ entityRelations }) {
  if (!entityRelations || entityRelations.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
        <Link2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/40 mb-2">No relationship data available</p>
        <p className="text-sm text-white/30">Relationships will appear after analyzing transactions</p>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getConfidenceBadge = (confidence) => {
    const percent = Math.round(confidence * 100)
    if (percent >= 80) {
      return (
        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
          {percent}% confidence
        </span>
      )
    }
    if (percent >= 60) {
      return (
        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
          {percent}% confidence
        </span>
      )
    }
    return (
      <span className="px-2 py-1 bg-white/10 text-white/40 rounded text-xs font-medium">
        {percent}% confidence
      </span>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-6 py-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Party Relationship Index</h3>
            <p className="text-sm text-emerald-300/70">{entityRelations.length} parties with relationship data</p>
          </div>
        </div>
      </div>

      {/* Relationship Cards */}
      <div className="divide-y divide-white/10">
        {entityRelations.map((relation, idx) => {
          const sentTo = relation.sent_to || []
          const receivedFrom = relation.received_from || []
          const totalConnections = sentTo.length + receivedFrom.length

          return (
            <div 
              key={idx}
              className="p-4 hover:bg-white/5 transition-colors"
            >
              {/* Party Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{relation.party}</h4>
                    <p className="text-sm text-white/40">{relation.entity_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-white/40">Transactions</p>
                    <p className="text-lg font-semibold text-white">{relation.transaction_count}</p>
                  </div>
                  {getConfidenceBadge(relation.confidence)}
                </div>
              </div>

              {/* Money Flow Summary */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-sm text-white/40">Total Credit</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    {formatCurrency(relation.total_credit || 0)}
                  </p>
                </div>
                <div className="bg-rose-500/10 rounded-xl p-3 text-center border border-rose-500/20">
                  <TrendingDown className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                  <p className="text-sm text-white/40">Total Debit</p>
                  <p className="text-lg font-semibold text-rose-400">
                    {formatCurrency(relation.total_debit || 0)}
                  </p>
                </div>
                <div className={`rounded-xl p-3 text-center border ${
                  (relation.net_flow || 0) >= 0 
                    ? 'bg-emerald-500/10 border-emerald-500/20' 
                    : 'bg-rose-500/10 border-rose-500/20'
                }`}>
                  <p className="text-sm text-white/40">Net Flow</p>
                  <p className={`text-lg font-semibold ${
                    (relation.net_flow || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {(relation.net_flow || 0) >= 0 ? '+' : ''}{formatCurrency(relation.net_flow || 0)}
                  </p>
                </div>
              </div>

              {/* Connections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Received From */}
                {receivedFrom.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowLeft className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">Received From</span>
                      <span className="ml-auto px-2 py-0.5 bg-emerald-500/20 rounded text-xs text-emerald-400">
                        {receivedFrom.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {receivedFrom.slice(0, 5).map((party, pIdx) => (
                        <span 
                          key={pIdx}
                          className="px-2 py-1 bg-emerald-500/10 text-emerald-300 rounded text-xs"
                        >
                          {party}
                        </span>
                      ))}
                      {receivedFrom.length > 5 && (
                        <span className="px-2 py-1 bg-white/10 text-white/40 rounded text-xs">
                          +{receivedFrom.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Sent To */}
                {sentTo.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRight className="w-4 h-4 text-rose-400" />
                      <span className="text-sm font-medium text-rose-400">Sent To</span>
                      <span className="ml-auto px-2 py-0.5 bg-rose-500/20 rounded text-xs text-rose-400">
                        {sentTo.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sentTo.slice(0, 5).map((party, pIdx) => (
                        <span 
                          key={pIdx}
                          className="px-2 py-1 bg-rose-500/10 text-rose-300 rounded text-xs"
                        >
                          {party}
                        </span>
                      ))}
                      {sentTo.length > 5 && (
                        <span className="px-2 py-1 bg-white/10 text-white/40 rounded text-xs">
                          +{sentTo.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* UPI Handles */}
              {relation.upi_handles && relation.upi_handles.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-2">UPI Handles</p>
                  <div className="flex flex-wrap gap-1">
                    {relation.upi_handles.map((handle, hIdx) => (
                      <span 
                        key={hIdx}
                        className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs font-mono"
                      >
                        @{handle}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="bg-white/5 px-6 py-4 border-t border-white/10">
        <p className="text-sm text-white/40">
          Showing {entityRelations.length} parties with relationship data
        </p>
      </div>
    </div>
  )
}

