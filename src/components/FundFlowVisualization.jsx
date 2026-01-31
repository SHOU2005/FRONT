import { GitBranch, ArrowRight, TrendingUp, Users, Link2, Activity, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

/**
 * FundFlowVisualization - Visual representation of fund flow chains
 * Uses consistent emerald theme styling with glowing effects
 */
export default function FundFlowVisualization({ fundFlowChains, entityRelations = [] }) {
  const [visibleChains, setVisibleChains] = useState(10)
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
    if (confidence >= 0.6) return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    return 'text-white/40 bg-white/5 border-white/10'
  }

  const topChains = fundFlowChains?.top_chains || []
  const chainSummary = fundFlowChains || {}
  const totalChains = chainSummary.total_chains || topChains.length
  const showAll = visibleChains >= topChains.length
  const visibleChainsList = topChains.slice(0, visibleChains)

  if (topChains.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
        <GitBranch className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/40 mb-2">No fund flow chains detected</p>
        <p className="text-sm text-white/30">Upload multiple files or add more transactions to see fund flow chains</p>
      </div>
    )
  }

  const handleShowMore = () => {
    setVisibleChains(topChains.length)
  }

  const handleShowLess = () => {
    setVisibleChains(10)
  }

  return (
    <div className="space-y-6">
      {/* Chain Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-500/10 backdrop-blur-xl rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-white/60 text-sm">Total Chains</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{totalChains}</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-white/60 text-sm">Total Amount</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(chainSummary.total_amount || 0)}</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-white/60 text-sm">Avg Chain Length</span>
          </div>
          <p className="text-2xl font-bold text-white">{chainSummary.avg_chain_length?.toFixed(1) || 0}</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-white/60 text-sm">Cross-File Links</span>
          </div>
          <p className="text-2xl font-bold text-white">{chainSummary.cross_file_links || 0}</p>
        </div>
      </div>

      {/* Fund Flow Chain Cards */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-6 py-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Fund Flow Chains</h3>
              <p className="text-sm text-emerald-300/70">Money movement paths between parties</p>
            </div>
          </div>
        </div>

        {/* Chain List */}
        <div className="divide-y divide-white/10">
          {visibleChainsList.map((chain, idx) => {
            const parties = chain.flow_path?.split(' -> ') || []
            
            return (
              <div 
                key={idx}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-emerald-500/10 rounded text-xs text-emerald-400 font-medium">
                      #{idx + 1}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getConfidenceColor(chain.confidence)}`}>
                      {Math.round((chain.confidence || 0) * 100)}% confidence
                    </span>
                  </div>
                  <span className="text-lg font-bold text-emerald-400">
                    {formatCurrency(chain.total_amount || 0)}
                  </span>
                </div>

                {/* Flow Path Visualization */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {parties.map((party, partyIdx) => (
                    <div key={partyIdx} className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`
                          px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                          ${partyIdx === 0 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : partyIdx === parties.length - 1
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-white/10 text-white/70 border border-white/10'
                          }
                        `}>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {party}
                          </div>
                        </div>
                      </div>
                      {partyIdx < parties.length - 1 && (
                        <div className="flex-shrink-0 mx-2">
                          <div className="flex items-center gap-1">
                            <ArrowRight className="w-5 h-5 text-emerald-500" />
                            <span className="text-xs text-emerald-500/60">Flow</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination Controls */}
        {topChains.length > 10 && (
          <div className="px-6 py-4 bg-white/5 border-t border-white/10">
            {/* Showing indicator */}
            <div className="text-center text-white/50 text-sm mb-3">
              Showing {visibleChains} of {topChains.length} chains
            </div>
            
            {/* Show More / Show Less buttons */}
            <div className="flex justify-center gap-3">
              {!showAll ? (
                <button
                  onClick={handleShowMore}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <ChevronDown className="w-4 h-4" />
                  Show More ({topChains.length - visibleChains} remaining)
                </button>
              ) : (
                visibleChains > 10 && (
                  <button
                    onClick={handleShowLess}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all border border-white/20"
                  >
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cross-File Links Indicator */}
      {chainSummary.cross_file_links > 0 && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center animate-pulse">
              <Link2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-semibold">Cross-File Correlations Detected</p>
              <p className="text-sm text-white/60">
                {chainSummary.cross_file_links} fund flow chain(s) connect transactions across multiple files
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

