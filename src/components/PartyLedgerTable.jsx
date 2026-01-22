import { Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function PartyLedgerTable({ partyLedger, limit = 10, showAll = false, onPartyClick = null }) {
  if (!partyLedger || partyLedger.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
        <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/40">No party ledger data available</p>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const displayData = showAll ? partyLedger : partyLedger.slice(0, limit)
  const totalCredit = partyLedger.reduce((sum, p) => sum + (p.total_credit || 0), 0)
  const totalDebit = partyLedger.reduce((sum, p) => sum + (p.total_debit || 0), 0)

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-6 py-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Party Ledger Summary</h3>
            <p className="text-sm text-emerald-300/70">{partyLedger.length} parties detected</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white/60 uppercase">Party</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase">Credit</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase">Debit</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-white/60 uppercase">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {displayData.map((party, idx) => {
              const net = (party.total_credit || 0) - (party.total_debit || 0)
              return (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-white font-medium">{party.party_name}</td>
                  <td className="px-6 py-4 text-right text-emerald-400">{formatCurrency(party.total_credit || 0)}</td>
                  <td className="px-6 py-4 text-right text-rose-400">{formatCurrency(party.total_debit || 0)}</td>
                  <td className={'px-6 py-4 text-right font-semibold ' + (net >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                    {(net >= 0 ? '+' : '') + formatCurrency(net)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
