import { AlertTriangle, Shield, AlertCircle, CheckCircle2, TrendingUp, Users, GitBranch } from 'lucide-react'

/**
 * RiskScoreCard Component
 * Displays risk analysis with score, level, and detailed risk factors
 */
export default function RiskScoreCard({ riskAnalysis }) {
    if (!riskAnalysis) {
        return null
    }

    const {
        account_risk_score = 0,
        risk_level = 'LOW',
        risk_factors = [],
        party_risks = {},
        chain_risks = [],
        summary = '',
        risk_metrics = {}
    } = riskAnalysis

    // Risk level configuration
    const riskConfig = {
        CRITICAL: {
            color: 'from-red-600 to-rose-600',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30',
            textColor: 'text-red-400',
            icon: AlertTriangle,
            emoji: '🔴'
        },
        HIGH: {
            color: 'from-orange-600 to-red-600',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/30',
            textColor: 'text-orange-400',
            icon: AlertCircle,
            emoji: '🟠'
        },
        MEDIUM: {
            color: 'from-yellow-600 to-orange-600',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
            textColor: 'text-yellow-400',
            icon: AlertCircle,
            emoji: '🟡'
        },
        LOW: {
            color: 'from-green-600 to-emerald-600',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
            textColor: 'text-green-400',
            icon: CheckCircle2,
            emoji: '🟢'
        }
    }

    const config = riskConfig[risk_level] || riskConfig.LOW
    const RiskIcon = config.icon

    // Risk factor type labels
    const riskTypeLabels = {
        layering: 'Rapid Layering',
        circular_flow: 'Circular Transfers',
        smurfing: 'Smurfing Pattern',
        funneling: 'Funnel Activity',
        dormancy_break: 'Dormancy Break',
        velocity_spike: 'Velocity Spike',
        round_amounts: 'Round Amounts',
        high_risk_merchant: 'High-Risk Merchant',
        balance_erosion: 'Balance Erosion',
        test_transaction: 'Test Pattern'
    }

    return (
        <div className={`bg-white/5 backdrop-blur-xl rounded-3xl p-8 border ${config.borderColor}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Risk Analysis</h2>
                        <p className="text-sm text-white/50">Automated Suspicion Detection</p>
                    </div>
                </div>
            </div>

            {/* Risk Score Display */}
            <div className={`${config.bgColor} rounded-2xl p-6 mb-6 border ${config.borderColor}`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-white/60 text-sm mb-1">RISK LEVEL</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{config.emoji}</span>
                            <h3 className={`text-3xl font-bold ${config.textColor}`}>{risk_level}</h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-white/60 text-sm mb-1">SCORE</p>
                        <div className={`text-5xl font-bold ${config.textColor}`}>
                            {account_risk_score}
                            <span className="text-2xl text-white/40">/100</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${config.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${account_risk_score}%` }}
                    />
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                    <p className="text-white/80 text-sm leading-relaxed">{summary}</p>
                </div>
            )}

            {/* Risk Metrics Quick Stats */}
            {risk_metrics && Object.keys(risk_metrics).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-white/40 text-xs mb-1 uppercase tracking-wider font-bold">Total Volume</p>
                        <p className="text-white font-bold text-lg">₹{risk_metrics.total_volume?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-white/40 text-xs mb-1 uppercase tracking-wider font-bold">UPI Influence</p>
                        <p className="text-white font-bold text-lg">{risk_metrics.upi_percentage}%</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-white/40 text-xs mb-1 uppercase tracking-wider font-bold">Transfer %</p>
                        <p className="text-white font-bold text-lg">{risk_metrics.transfer_percentage}%</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-white/40 text-xs mb-1 uppercase tracking-wider font-bold">High Value (1L+)</p>
                        <p className="text-white font-bold text-lg">{risk_metrics.high_value_count}</p>
                    </div>
                </div>
            )}

            {/* Risk Factors */}
            {risk_factors.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        Detected Risk Factors ({risk_factors.length})
                    </h4>
                    <div className="space-y-3">
                        {risk_factors.map((factor, idx) => (
                            <div
                                key={idx}
                                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
                                                {riskTypeLabels[factor.type] || factor.type}
                                            </span>
                                            <span className="text-white/40 text-xs">
                                                Severity: {factor.severity}/100
                                            </span>
                                        </div>
                                        <p className="text-white/80 text-sm">{factor.description}</p>
                                    </div>
                                    <div className="w-16 h-16 flex-shrink-0">
                                        <svg className="transform -rotate-90" width="64" height="64">
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="28"
                                                stroke="rgba(255,255,255,0.1)"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="28"
                                                stroke={factor.severity >= 70 ? '#ef4444' : factor.severity >= 50 ? '#f59e0b' : '#10b981'}
                                                strokeWidth="4"
                                                fill="none"
                                                strokeDasharray={`${(factor.severity / 100) * 176} 176`}
                                                className="transition-all duration-500"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* High-Risk Parties */}
            {Object.keys(party_risks).length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-yellow-400" />
                        High-Risk Parties ({Object.keys(party_risks).length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(party_risks).slice(0, 6).map(([party, risk]) => (
                            <div
                                key={party}
                                className="bg-white/5 rounded-xl p-3 border border-white/10"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-emerald-400 font-medium text-sm truncate flex-1">
                                        {party}
                                    </span>
                                    <span className={`text-xs font-bold ${risk.risk_score >= 70 ? 'text-red-400' :
                                        risk.risk_score >= 50 ? 'text-orange-400' : 'text-yellow-400'
                                        }`}>
                                        {risk.risk_score}/100
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {risk.flags?.map((flag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs"
                                        >
                                            {flag.replace('_', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* High-Risk Chains */}
            {chain_risks.length > 0 && (
                <div>
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-cyan-400" />
                        Suspicious Transaction Chains ({chain_risks.length})
                    </h4>
                    <div className="space-y-3">
                        {chain_risks.slice(0, 5).map((chain, idx) => (
                            <div
                                key={idx}
                                className="bg-white/5 rounded-xl p-4 border border-white/10"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="text-white font-medium">
                                            {chain.chain_length}-step chain
                                        </span>
                                        <span className="text-white/40 text-sm ml-2">
                                            in {chain.hours}h
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-cyan-400 font-bold">
                                            ₹{chain.total_amount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-white/40">
                                            Risk: {chain.risk_score}/100
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/50">
                                    <span>Parties:</span>
                                    <span className="truncate">{chain.parties.join(' → ')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Risk Detected */}
            {risk_factors.length === 0 && Object.keys(party_risks).length === 0 && chain_risks.length === 0 && (
                <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Suspicious Patterns Detected</h3>
                    <p className="text-white/50">
                        All transactions appear normal based on automated risk analysis.
                    </p>
                </div>
            )}
        </div>
    )
}
