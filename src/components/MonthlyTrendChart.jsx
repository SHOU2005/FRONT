import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

/**
 * MonthlyTrendChart - Displays monthly transaction volume as bar chart
 * Uses consistent emerald theme styling
 */
export default function MonthlyTrendChart({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return null
  }

  const formatCurrency = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
    return `₹${amount}`
  }

  // Aggregate transactions by month
  const monthlyData = transactions.reduce((acc, txn) => {
    const date = txn.date || txn.transaction_date
    if (!date) return acc
    
    // Try to parse date - support multiple formats
    let monthKey = ''
    try {
      const parsedDate = new Date(date)
      if (!isNaN(parsedDate.getTime())) {
        monthKey = parsedDate.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
      } else {
        // Fallback: try to extract MM/YY or similar
        const parts = date.split(/[\/\-]/)
        if (parts.length >= 2) {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const monthIdx = parseInt(parts[0]) - 1
          const year = parts[parts.length - 1].slice(-2)
          monthKey = `${monthNames[monthIdx]}/${year}`
        }
      }
    } catch (e) {
      monthKey = 'Unknown'
    }
    
    if (!monthKey) return acc
    
    const amount = (txn.credit || 0) > 0 ? txn.credit : (txn.debit || 0)
    const existing = acc.find(d => d.month === monthKey)
    
    if (existing) {
      existing.total += amount
      existing.count += 1
    } else {
      acc.push({ month: monthKey, total: amount, count: 1 })
    }
    return acc
  }, [])

  // Sort by date (simple chronological order based on appearance)
  const sortedData = monthlyData.sort((a, b) => a.month.localeCompare(b.month))

  if (sortedData.length === 0) {
    return null
  }

  const maxValue = Math.max(...sortedData.map(d => d.total))

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-6 py-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <BarChart className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Monthly Transaction Trends</h3>
            <p className="text-sm text-emerald-300/70">Transaction volume over time</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}
              labelStyle={{ color: 'white', fontWeight: 'bold' }}
              formatter={(value, name) => [
                formatCurrency(value),
                name === 'total' ? 'Total Volume' : name
              ]}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index})`}
                />
              ))}
            </Bar>
            <defs>
              {sortedData.map((_, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9 - (index * 0.05)} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <p className="text-sm text-white/40">Months</p>
            <p className="text-xl font-bold text-white">{sortedData.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-white/40">Avg Volume</p>
            <p className="text-xl font-bold text-emerald-400">
              {formatCurrency(sortedData.reduce((sum, d) => sum + d.total, 0) / sortedData.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-white/40">Peak Month</p>
            <p className="text-xl font-bold text-white">
              {sortedData.reduce((max, d) => d.total > max.total ? d : max, sortedData[0])?.month}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

