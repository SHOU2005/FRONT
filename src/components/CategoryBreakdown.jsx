import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

/**
 * CategoryBreakdown - Displays spending breakdown by category
 * Uses consistent emerald theme styling
 */
export default function CategoryBreakdown({ transactions }) {
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

  // Define category patterns
  const categoryPatterns = {
    'UPI': /upi|@/i,
    'Transfer': /neft|imps|rtgs|transfer|bank/i,
    'Shopping': /amazon|flipkart|swiggy|zomato|myntra|nykaa|shop/i,
    'Bills': /electricity|water|gas|phone|mobile|bill|recharge/i,
    'ATM': /atm|cash/i,
    'Salary': /salary|income|interest|dividend/i,
    'Food': /restaurant|food|cafe|coffee|hotel/i,
    'Travel': /flight|train|bus|taxi|uber|ola|petrol| diesel|fuel/i,
    'Insurance': /insurance|premium|policy/i,
    'Subscription': /netflix|spotify|amazon prime|subscription|membership/i,
    'Other': /./
  }

  // Categorize transactions
  const categoryData = transactions.reduce((acc, txn) => {
    const description = txn.description || txn.narration || ''
    const amount = (txn.debit || 0) > 0 ? txn.debit : 0
    
    if (amount === 0) return acc
    
    let category = 'Other'
    for (const [cat, pattern] of Object.entries(categoryPatterns)) {
      if (pattern.test(description) && cat !== 'Other') {
        category = cat
        break
      }
    }
    
    const existing = acc.find(c => c.name === category)
    if (existing) {
      existing.value += amount
      existing.count += 1
    } else {
      acc.push({ name: category, value: amount, count: 1 })
    }
    return acc
  }, [])

  // Sort by value descending
  categoryData.sort((a, b) => b.value - a.value)

  if (categoryData.length === 0) {
    return null
  }

  // Color palette
  const COLORS = [
    '#10b981', '#059669', '#047857', '#065f46', // Greens
    '#f59e0b', '#d97706', '#b45309', '#92400e', // Ambers
    '#ef4444', '#dc2626', '#b91c1c', '#991b1b', // Reds
    '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', // Purples
    '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', // Blues
  ]

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-6 py-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Spending by Category</h3>
            <p className="text-sm text-emerald-300/70">Transaction breakdown</p>
          </div>
        </div>
      </div>

      {/* Chart & Legend */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Pie Chart */}
          <div className="w-full lg:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      style={{ outline: 'none' }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                  formatter={(value, name) => [formatCurrency(value), name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-2">
            {categoryData.map((cat, index) => (
              <div 
                key={cat.name}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{cat.name}</p>
                  <p className="text-xs text-white/40">{cat.count} transactions</p>
                </div>
                <p className="text-sm font-medium text-white">
                  {formatCurrency(cat.value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-white/40">
            Total Spending: <span className="text-white font-medium">{formatCurrency(categoryData.reduce((sum, c) => sum + c.value, 0))}</span>
          </p>
          <p className="text-sm text-white/40">
            Categories: <span className="text-emerald-400 font-medium">{categoryData.length}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

