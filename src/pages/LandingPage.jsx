import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, Link2, GitBranch, Users, Shield, Lock, 
  ChevronRight, CheckCircle, ArrowRight, Sparkles,
  Target, Wallet, FileSpreadsheet, FileJson, LogOut
} from 'lucide-react'

const features = [
  {
    icon: <FileSpreadsheet className="w-8 h-8" />,
    title: "XLS/XLSX Only Upload",
    description: "Upload 2-20+ Excel files for instant party detection and fund flow analysis",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "AI Party Detection",
    description: "Smart extraction of traders, merchants, UPI handles, and entities from transaction narration",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: <Link2 className="w-8 h-8" />,
    title: "Credit/Debit Relations",
    description: "Link who sent money to whom - trace complete payment chains across parties",
    gradient: "from-teal-500 to-cyan-500"
  },
  {
    icon: <GitBranch className="w-8 h-8" />,
    title: "Fund Flow Chains",
    description: "Build money paths: Party A → Party B → Party C → ... with cross-file correlation",
    gradient: "from-emerald-500 to-green-500"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Auto Party Ledger",
    description: "Generate detailed ledger for each party with credit/debit totals and running balance",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: <FileJson className="w-8 h-8" />,
    title: "JSON Export Only",
    description: "Export complete analysis as JSON - no CSV or XLS, pure data portability",
    gradient: "from-emerald-600 to-green-600"
  }
]

const stats = [
  { value: "20+", label: "Files Max" },
  { value: "4", label: "Filter Types" },
  { value: "100%", label: "Party Focus" },
  { value: "XLS/PDF", label: "Both Supported" }
]

const benefits = [
  { title: "XLS/XLSX & PDF Support", desc: "Upload both Excel and PDF bank statements for comprehensive analysis" },
  { title: "Instant Analysis", desc: "Upload → Parse → Party Detect → Fund Flow ready" },
  { title: "Smart Party Detection", desc: "AI normalizes names, handles spelling errors" },
  { title: "Fund Flow Explorer", desc: "Follow complete money journey between parties" },
  { title: "Auto Ledger", desc: "Party-wise ledger with running balance calculation" },
  { title: "Multi-File Correlation", desc: "Correlate 2-20+ files for complete picture" }
]

const workflow = [
  { step: "01", title: "Upload XLS", desc: "Drop multiple Excel files (2-20+ supported)" },
  { step: "02", title: "AI Parse", desc: "Extract transactions and detect all parties" },
  { step: "03", title: "Build Chains", desc: "Create money flow paths between parties" },
  { step: "04", title: "Generate Ledger", desc: "Auto-build detailed party ledger" },
  { step: "05", title: "Export JSON", desc: "Get JSON export for further processing" }
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900">
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-emerald-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div 
              className="text-2xl font-bold text-white flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              AcuTrace
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/logout')}
                className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              <button
                onClick={() => navigate('/analyze')}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/25"
              >
                Launch Tool
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm">Party Ledger & Fund Flow Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Track Party</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Money Flows
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-12">
            AI-powered party-centric money movement investigator. 
            Upload XLS/XLSX files, detect parties, trace fund flows, and generate detailed party ledgers.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/analyze')}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white text-lg font-semibold rounded-2xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/25"
            >
              Start Analysis
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-center gap-3 px-8 py-4 bg-white/10 text-white text-lg font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              See How It Works
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <p className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl p-8 border border-emerald-500/30">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-lg text-white/70 leading-relaxed">
                To provide the most accurate party-centric money movement investigation platform,
                enabling businesses to trace fund flows, map party relationships, and generate
                detailed ledgers from Excel bank statements.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl p-8 border border-emerald-500/30">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-lg text-white/70 leading-relaxed">
                A world where every financial transaction can be traced to its source party,
                every money flow can be mapped, and detailed party ledgers are generated
                automatically from Excel bank statements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How AcuTrace Works</h2>
            <p className="text-xl text-white/60">Five simple steps to complete party ledger analysis</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            {workflow.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 h-full hover:bg-white/10 transition-all">
                  <div className="text-4xl font-bold text-emerald-500/30 mb-4">{step.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/60 text-sm">{step.desc}</p>
                </div>
                {idx < workflow.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-emerald-500/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Core Intelligence</h2>
            <p className="text-xl text-white/60">Powerful AI capabilities for party & fund flow analysis</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:transform hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why AcuTrace?</h2>
            <p className="text-xl text-white/60">Pure party ledger intelligence, nothing else</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">{benefit.title}</h4>
                  <p className="text-white/60">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Four Filter Types Only</h2>
            <p className="text-xl text-white/60">Simple, focused, powerful</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-6 border border-emerald-500/30 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Credit</h3>
              <p className="text-white/60 text-sm">Money received</p>
            </div>
            
            <div className="bg-gradient-to-br from-rose-500/20 to-red-500/20 rounded-2xl p-6 border border-rose-500/30 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-white rotate-180" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Debit</h3>
              <p className="text-white/60 text-sm">Money spent</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl p-6 border border-blue-500/30 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Transfer</h3>
              <p className="text-white/60 text-sm">NEFT/RTGS/IMPS</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">UPI</h3>
              <p className="text-white/60 text-sm">UPI payments</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Trace Money Flows?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Upload your Excel bank statement files and discover complete party relationships,
                fund flow chains, and detailed party ledgers.
              </p>
              <button
                onClick={() => navigate('/analyze')}
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-600 text-xl font-bold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Start Analysis
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900/80 py-12 border-t border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                AcuTrace
              </div>
              <p className="text-white/40">Party Ledger & Fund Flow Intelligence</p>
            </div>
            <div className="flex items-center gap-6 text-white/40">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Secure Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                <span>XLS/XLSX Only</span>
              </div>
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                <span>JSON Export</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 text-white/30 text-sm">
            © 2024 AcuTrace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

