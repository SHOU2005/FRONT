import { RefreshCw, TrendingUp, TrendingDown, Calendar } from 'lucide-react'

export default function RecurringPaymentsCard({ recurringTransactions }) {
    if (!recurringTransactions || recurringTransactions.length === 0) {
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

    const salaries = recurringTransactions.filter(t => t.category === 'Potential Salary')
    const subscriptions = recurringTransactions.filter(t => t.category !== 'Potential Salary' && t.type === 'DEBIT')

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 px-6 py-4 border-b border-blue-500/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Recurring Financial Patterns</h3>
                        <p className="text-sm text-blue-300/70">Detected salaries, subscriptions & repeating payments</p>
                    </div>
                </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* Income / Salaries */}
                <div>
                    <h4 className="flex items-center gap-2 text-emerald-400 font-semibold mb-4">
                        <TrendingUp className="w-4 h-4" />
                        Recurring Income ({salaries.length})
                    </h4>

                    {salaries.length > 0 ? (
                        <div className="space-y-3">
                            {salaries.map((item, idx) => (
                                <div key={idx} className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-white font-medium">{item.party}</p>
                                            <p className="text-xs text-white/50">{item.confidence} Confidence • {item.frequency}</p>
                                        </div>
                                        <span className="text-emerald-400 font-bold">{formatCurrency(item.avg_amount)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-emerald-400/70 bg-emerald-500/10 px-2 py-1 rounded inline-flex">
                                        <Calendar className="w-3 h-3" />
                                        Next expected: {item.next_expected_date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white/30 text-sm italic">No recurring income patterns detected.</p>
                    )}
                </div>

                {/* Expenses */}
                <div>
                    <h4 className="flex items-center gap-2 text-rose-400 font-semibold mb-4">
                        <TrendingDown className="w-4 h-4" />
                        Recurring Expenses ({subscriptions.length})
                    </h4>

                    {subscriptions.length > 0 ? (
                        <div className="space-y-3">
                            {subscriptions.slice(0, 5).map((item, idx) => ( // Show top 5
                                <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-white font-medium">{item.party}</p>
                                                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <p className="text-xs text-white/50">{item.confidence} Confidence • {item.frequency}</p>
                                        </div>
                                        <span className="text-rose-400 font-bold">{formatCurrency(item.avg_amount)}</span>
                                    </div>
                                </div>
                            ))}
                            {subscriptions.length > 5 && (
                                <p className="text-center text-xs text-white/40 pt-2">+ {subscriptions.length - 5} more detected</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-white/30 text-sm italic">No recurring expense patterns detected.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
