import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, Users, GitBranch, Download,
  CheckCircle, FileText, FileJson, Wallet, CreditCard, Target,
  Filter, Search, ChevronDown, RefreshCw, DollarSign, Calendar,
  BarChart3, Home, PieChart, Hash, X, Copy, LogOut, Shield
} from 'lucide-react'

// Import components
import MonthlyTrendChart from '../components/MonthlyTrendChart'
import CategoryBreakdown from '../components/CategoryBreakdown'
import TopPartiesCards from '../components/TopPartiesCards'
import EnhancedStats from '../components/EnhancedStats'
import FundFlowVisualization from '../components/FundFlowVisualization'
import PartyLedgerTable from '../components/PartyLedgerTable'
import AccountProfileCard from '../components/AccountProfileCard'
import TransactionDetailModal from '../components/TransactionDetailModal'
import RecurringPaymentsCard from '../components/RecurringPaymentsCard'
import NetworkGraph from '../components/NetworkGraph'
import RiskScoreCard from '../components/RiskScoreCard'
import InvestigationSummary from '../components/InvestigationSummary'

export default function ResultsPage() {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [copied, setCopied] = useState(false)
  const [dateFilter, setDateFilter] = useState('all')
  const [filters, setFilters] = useState({
    transactionType: 'all',
    amountRange: 'all',
    party: '',
    searchTerm: ''
  })

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResults')
    if (stored) {
      setResults(JSON.parse(stored))
    } else {
      navigate('/analyze')
    }
  }, [navigate])

  const transactions = results?.transactions || []
  const accountProfile = results?.account_profile || {}
  const partyLedgerObj = results?.party_ledger || {}
  // Handle the party_ledger structure - it can be either an array or an object with 'parties' key
  let partyLedger = []
  if (Array.isArray(partyLedgerObj)) {
    partyLedger = partyLedgerObj
  } else if (partyLedgerObj && partyLedgerObj.parties && Array.isArray(partyLedgerObj.parties)) {
    // Backend returns { parties: [...], total_parties: X, statistics: {...} }
    partyLedger = partyLedgerObj.parties
  } else {
    // Fallback: convert object to array
    partyLedger = Object.entries(partyLedgerObj || {}).map(([party_name, data]) => ({
      party_name,
      ...data
    }))
  }
  const fundFlowChains = results?.fund_flow_chains || {}
  const metadata = results?.metadata || {}
  const recurringTransactions = results?.recurring_transactions || []
  const correlations = results?.correlations || []
  const riskAnalysis = results?.risk_analysis || null
  const investigationSummary = results?.investigation_summary || ''

  // Calculate totals from transactions (not from top-level fields which may not exist)
  const totalCredit = transactions.reduce((sum, txn) => sum + (txn.credit || 0), 0)
  const totalDebit = transactions.reduce((sum, txn) => sum + (txn.debit || 0), 0)
  const netFlow = totalCredit - totalDebit

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(txn => {
      const amount = txn.credit > 0 ? txn.credit : txn.debit

      if (filters.transactionType !== 'all') {
        if (filters.transactionType === 'credit' && txn.credit <= 0) return false
        if (filters.transactionType === 'debit' && txn.debit <= 0) return false
        if (filters.transactionType === 'transfer' && !txn.category?.toLowerCase().includes('transfer')) return false
        if (filters.transactionType === 'upi' && !txn.category?.toLowerCase().includes('upi')) return false
      }

      if (filters.party && !(txn.party || '').toLowerCase().includes(filters.party.toLowerCase())) return false
      if (filters.searchTerm && !(txn.description || '').toLowerCase().includes(filters.searchTerm.toLowerCase())) return false

      return true
    })

    if (dateFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter(txn => {
        const date = new Date(txn.date)
        if (isNaN(date.getTime())) return true

        switch (dateFilter) {
          case 'today':
            return date.toDateString() === now.toDateString()
          case 'thisWeek':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return date >= weekAgo
          case 'thisMonth':
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
          case 'lastMonth':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            return date >= lastMonth && date < thisMonth
          default:
            return true
        }
      })
    }

    return filtered
  }, [transactions, filters.transactionType, filters.amountRange, filters.party, filters.searchTerm, dateFilter])

  const clearFilters = () => {
    setFilters({
      transactionType: 'all',
      amountRange: 'all',
      party: '',
      searchTerm: ''
    })
    setDateFilter('all')
  }

  const generateJSONExport = () => {
    const exportData = {
      app: 'AcuTrace',
      generated_at: new Date().toISOString(),
      summary: {
        total_transactions: transactions.length,
        unique_parties: partyLedger.length,
        fund_flow_chains: fundFlowChains.total_chains || 0,
        total_credit: totalCredit,
        total_debit: totalDebit
      },
      account_profile: accountProfile,
      transactions: filteredTransactions,
      party_ledger: partyLedger,
      fund_flow_chains: fundFlowChains
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `acutrace_analysis_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateCSVExport = () => {
    const headers = ['Date', 'Party', 'Description', 'Credit', 'Debit', 'Type', 'Category']
    const rows = filteredTransactions.map(txn => [
      txn.date || '',
      txn.party || '',
      '"' + (txn.description || '').replace(/"/g, '""') + '"',
      txn.credit || 0,
      txn.debit || 0,
      txn.category || 'Transfer',
      txn.category || ''
    ])
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `acutrace_transactions_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    const exportData = {
      app: 'AcuTrace',
      generated_at: new Date().toISOString(),
      summary: {
        total_transactions: transactions.length,
        unique_parties: partyLedger.length,
        fund_flow_chains: fundFlowChains.total_chains || 0,
        total_credit: totalCredit,
        total_debit: totalDebit
      },
      account_profile: accountProfile,
      transactions: filteredTransactions,
      party_ledger: partyLedger,
      fund_flow_chains: fundFlowChains
    }
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = [
    {
      icon: FileText,
      label: 'Transactions',
      value: transactions.length,
      color: 'from-emerald-500 to-green-500',
      onClick: () => setActiveTab('transactions')
    },
    {
      icon: Users,
      label: 'Parties',
      value: partyLedger.length,
      color: 'from-green-500 to-emerald-500',
      onClick: () => setActiveTab('parties')
    },
    {
      icon: GitBranch,
      label: 'Fund Flows',
      value: fundFlowChains.total_chains || 0,
      color: 'from-teal-500 to-cyan-500',
      onClick: () => setActiveTab('fundflow')
    },
    {
      icon: DollarSign,
      label: 'Net Flow',
      value: '₹' + netFlow.toLocaleString(),
      color: netFlow >= 0 ? 'from-emerald-600 to-green-600' : 'from-rose-600 to-red-600',
      onClick: null
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'risk', label: 'Risk Analysis', icon: Shield },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'fundflow', label: 'Fund Flow', icon: GitBranch },
    { id: 'parties', label: 'Parties', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: CreditCard }
  ]

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 animate-pulse">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <p className="text-white/60">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900">
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-emerald-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('/')} className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              AcuTrace
            </button>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/logout')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              <button onClick={() => navigate('/analyze')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
                New Analysis
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-6">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm">Analysis Complete</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fund Flow <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">Analysis Results</span>
          </h1>
          <p className="text-xl text-white/60">
            {transactions.length} transactions • {partyLedger.length} parties • {fundFlowChains.total_chains || 0} fund flow chains
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ' + (
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <AccountProfileCard accountProfile={accountProfile} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  onClick={stat.onClick}
                  className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-transform hover:scale-105 ${stat.onClick ? 'cursor-pointer hover:bg-white/10' : ''}`}
                >
                  <div className={'w-12 h-12 rounded-xl bg-gradient-to-br ' + stat.color + ' flex items-center justify-center mb-4'}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Financial Summary</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-4">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-white/60 mb-2">Total Credit</p>
                  <p className="text-3xl font-bold text-emerald-400">₹{totalCredit.toLocaleString()}</p>
                </div>
                <div className="text-center p-6 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center mb-4">
                    <TrendingDown className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-white/60 mb-2">Total Debit</p>
                  <p className="text-3xl font-bold text-rose-400">₹{totalDebit.toLocaleString()}</p>
                </div>
                <div className="text-center p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-white/60 mb-2">Net Flow</p>
                  <p className={'text-3xl font-bold ' + (netFlow >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                    ₹{netFlow.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>


            {/* Network Graph & Trends Row */}
            <div className="grid lg:grid-cols-2 gap-8">
              <NetworkGraph
                partyLedger={partyLedger}
                onPartyClick={(partyName) => {
                  setFilters(prev => ({ ...prev, party: partyName }))
                  setActiveTab('transactions')
                }}
              />
              <CategoryBreakdown transactions={transactions} />
            </div>

            {correlations.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-teal-400" />
                  Detected Internal Transfers / Reversals
                </h3>
                <div className="space-y-3">
                  {correlations.map((corr, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5">
                      <div>
                        <p className="text-emerald-400 font-medium">{corr.type}</p>
                        <p className="text-xs text-white/50">{corr.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">₹{corr.amount}</p>
                        <p className="text-xs text-white/40">Matched across files</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <MonthlyTrendChart transactions={transactions} />
            <EnhancedStats transactions={transactions} />
            <TopPartiesCards partyLedger={partyLedger} />
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-8">
            {/* Risk Analysis Section */}
            {riskAnalysis ? (
              <>
                <RiskScoreCard riskAnalysis={riskAnalysis} />
                
                {investigationSummary && (
                  <InvestigationSummary 
                    summary={investigationSummary} 
                    riskAnalysis={riskAnalysis} 
                  />
                )}
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center">
                <Shield className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Risk Analysis Available</h3>
                <p className="text-white/50">
                  Upload a bank statement to see automated risk detection and investigation summary.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-8">
            <RecurringPaymentsCard recurringTransactions={recurringTransactions} />
            <MonthlyTrendChart transactions={transactions} />
            <CategoryBreakdown transactions={transactions} />
            <EnhancedStats transactions={transactions} />
          </div>
        )}

        {activeTab === 'fundflow' && (
          <FundFlowVisualization fundFlowChains={fundFlowChains} />
        )}

        {activeTab === 'parties' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  clearFilters()
                  setActiveTab('transactions')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-emerald-400 hover:bg-white/10 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                View All Transactions
              </button>
            </div>
            <PartyLedgerTable
              partyLedger={partyLedger}
              limit={20}
              showAll={true}
              onPartyClick={(partyName) => {
                setFilters(prev => ({ ...prev, party: partyName }))
                setActiveTab('transactions')
              }}
            />
          </div>
        )}

        {activeTab === 'transactions' && (
          <>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10">
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={'w-4 h-4 transition-transform ' + (showFilters ? 'rotate-180' : '')} />
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={clearFilters} className="text-white/60 hover:text-white text-sm">
                    Clear All
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="grid md:grid-cols-4 gap-4">
                  <select
                    value={filters.transactionType}
                    onChange={e => setFilters(p => ({ ...p, transactionType: e.target.value }))}
                    className="bg-black/30 text-white p-3 rounded-xl border border-white/10"
                  >
                    <option value="all">All Transactions</option>
                    <option value="credit">Credit Only</option>
                    <option value="debit">Debit Only</option>
                    <option value="transfer">Transfers</option>
                    <option value="upi">UPI</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="bg-black/30 text-white p-3 rounded-xl border border-white/10"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                  </select>
                  <input
                    placeholder="Filter by party..."
                    value={filters.party}
                    onChange={e => setFilters(p => ({ ...p, party: e.target.value }))}
                    className="bg-black/30 text-white p-3 rounded-xl border border-white/10"
                  />
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-white/40 w-4 h-4" />
                    <input
                      placeholder="Search narration..."
                      value={filters.searchTerm}
                      onChange={e => setFilters(p => ({ ...p, searchTerm: e.target.value }))}
                      className="bg-black/30 text-white pl-10 p-3 rounded-xl border border-white/10 w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-white">Transactions ({filteredTransactions.length})</h2>
                <div className="flex gap-2">
                  <button onClick={generateJSONExport} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90">
                    <FileJson className="w-4 h-4" />
                    Export JSON
                  </button>
                  <button onClick={generateCSVExport} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                  <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20">
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 rounded-xl">
                      <th className="p-4 text-left text-xs font-semibold text-white/60 uppercase">Date</th>
                      <th className="p-4 text-left text-xs font-semibold text-white/60 uppercase">Party</th>
                      <th className="p-4 text-left text-xs font-semibold text-white/60 uppercase">Description</th>
                      <th className="p-4 text-right text-xs font-semibold text-white/60 uppercase">Credit</th>
                      <th className="p-4 text-right text-xs font-semibold text-white/60 uppercase">Debit</th>
                      <th className="p-4 text-left text-xs font-semibold text-white/60 uppercase">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredTransactions.map((txn, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => setSelectedTransaction(txn)}
                      >
                        <td className="p-4 text-white/70">{txn.date || 'N/A'}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium">
                            {txn.party || 'Unknown'}
                          </span>
                        </td>
                        <td className="p-4 text-white/60 max-w-xs truncate">{txn.description || 'N/A'}</td>
                        <td className="p-4 text-right text-emerald-400 font-medium">
                          {txn.credit > 0 ? '₹' + txn.credit.toLocaleString() : '-'}
                        </td>
                        <td className="p-4 text-right text-rose-400 font-medium">
                          {txn.debit > 0 ? '₹' + txn.debit.toLocaleString() : '-'}
                        </td>
                        <td className="p-4">
                          <span className={'px-3 py-1 rounded-lg text-sm font-medium ' + (
                            txn.category?.toLowerCase().includes('credit') ? 'bg-emerald-500/20 text-emerald-400' :
                              txn.category?.toLowerCase().includes('debit') ? 'bg-rose-500/20 text-rose-400' :
                                txn.category?.toLowerCase().includes('upi') ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-blue-500/20 text-blue-400'
                          )}>
                            {txn.category || 'Transfer'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredTransactions.length === 0 && (
                <p className="text-center mt-4 text-white/50 py-8">
                  No transactions match your filters
                </p>
              )}
            </div>
          </>
        )}

        {selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            onPartyClick={(partyName) => {
              setFilters(prev => ({ ...prev, party: partyName }))
              setActiveTab('transactions')
            }}
          />
        )}

        <div className="text-center mt-12 text-white/30 text-sm">
          Party Ledger & Fund Flow Tracking System - AcuTrace
        </div>
        <div className="text-center mt-4 text-white/40 text-sm">
          Developed by <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent font-medium">Shourya Pandey</span>
        </div>
      </div>
    </div>
  )
}
