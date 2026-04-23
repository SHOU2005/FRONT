import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, FileSpreadsheet, CheckCircle, Loader, Users, GitBranch,
  Target, X, ArrowRight, Sparkles, Files, Layers, BarChart3, LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const MAX_FILE_SIZE_MB = 25
const MAX_FILES = 10
const ALLOWED_EXTS = ['.xls', '.xlsx']

const steps = [
  { id: 'upload',   label: 'Uploading Files',           icon: Files },
  { id: 'extract',  label: 'Extracting Transactions',   icon: FileSpreadsheet },
  { id: 'merge',    label: 'Merging Data',              icon: Layers },
  { id: 'party',    label: 'Detecting Parties',         icon: Users },
  { id: 'chains',   label: 'Building Fund Flow Chains', icon: GitBranch },
  { id: 'complete', label: 'Analysis Complete',         icon: CheckCircle },
]

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function validateFile(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!ALLOWED_EXTS.includes(ext)) return `"${file.name}" is not a supported file type (XLS and XLSX only)`
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB} MB limit`
  return null
}

export default function AnalysisPage() {
  const navigate = useNavigate()
  const { user, logout, authFetch } = useAuth()

  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [error, setError] = useState(null)

  function addFiles(incoming) {
    const valid = []
    const errors = []
    for (const f of incoming) {
      const err = validateFile(f)
      if (err) errors.push(err)
      else valid.push(f)
    }
    if (errors.length) { setError(errors.join('\n')); return }
    setError(null)
    setFiles(prev => {
      const combined = [...prev, ...valid]
      if (combined.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} files allowed`)
        return prev
      }
      return combined
    })
  }

  function handleDrag(e) {
    e.preventDefault(); e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  function handleDrop(e) {
    e.preventDefault(); e.stopPropagation()
    setDragActive(false)
    addFiles(Array.from(e.dataTransfer.files || []))
  }

  function removeFile(idx) {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleUpload() {
    if (files.length === 0) { setError('Please select at least one file'); return }
    setUploading(true); setError(null); setProgress(10); setCurrentStep(steps[0].label)

    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))

      setProgress(30); setCurrentStep(steps[1].label)
      const response = await authFetch('/api/analyze/multi', { method: 'POST', body: formData })

      setProgress(60); setCurrentStep(steps[3].label)
      if (!response.ok) {
        let msg = 'Analysis failed'
        try { const d = await response.json(); msg = d?.detail || msg } catch { /* ignore */ }
        throw new Error(msg)
      }

      setProgress(80); setCurrentStep(steps[4].label)
      const result = await response.json()
      if (!result?.transactions) throw new Error('Unexpected response — no transaction data returned')

      const analysisData = { ...result, metadata: { ...result.metadata, files_count: files.length } }
      sessionStorage.setItem('analysisResults', JSON.stringify(analysisData))

      setProgress(100); setCurrentStep(steps[5].label)
      setTimeout(() => navigate('/results'), 1200)
    } catch (err) {
      setError(err.message || 'Failed to analyze file(s)')
      setUploading(false); setProgress(0); setCurrentStep('')
    }
  }

  const totalSize = files.reduce((s, f) => s + f.size, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900">
      {/* Nav */}
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-emerald-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AcuTrace</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/results')} className="text-white/70 hover:text-white text-sm px-4 py-2 rounded-xl hover:bg-white/10 transition-all">
              View Results
            </button>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <span className="hidden sm:inline">{user?.username}</span>
              <button onClick={logout} title="Sign out" className="p-2 rounded-lg hover:bg-white/10 transition-all text-white/50 hover:text-white">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Party Ledger & Fund Flow</h1>
          <p className="text-xl text-white/60">Upload bank statements for instant party detection</p>
          <p className="text-white/30 text-sm mt-2">Max {MAX_FILES} files · {MAX_FILE_SIZE_MB} MB per file · XLS, XLSX</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            {steps.map((step, idx) => {
              const isCompleted = progress > (idx + 1) * 16
              const isCurrent = currentStep === step.label
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-emerald-500' : isCurrent ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse' : 'bg-white/10'}`}>
                    {isCompleted
                      ? <CheckCircle className="w-5 h-5 text-white" />
                      : <step.icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-white/40'}`} />}
                  </div>
                  <span className={`text-xs mt-2 hidden sm:block ${isCurrent ? 'text-emerald-400' : 'text-white/40'}`}>{step.label}</span>
                </div>
              )
            })}
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Upload zone / spinner */}
        {uploading ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Loader className="w-12 h-12 text-white animate-spin" />
            </div>
            <p className="text-2xl font-bold text-white mb-2">{Math.round(progress)}% Complete</p>
            <p className="text-white/50 animate-pulse">{currentStep}</p>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/30 hover:border-emerald-500/50'}`}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          >
            {files.length === 0 ? (
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <Files className="w-10 h-10 text-emerald-400" />
                </div>
                <p className="text-2xl font-semibold text-white mb-3">Drop Files Here</p>
                <p className="text-white/50 mb-6">Upload XLS or XLSX bank statements</p>
                <label className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl cursor-pointer hover:opacity-90">
                  <Upload className="w-5 h-5" />
                  Select Files
                  <input type="file" accept=".xls,.xlsx" multiple className="hidden"
                    onChange={e => addFiles(Array.from(e.target.files))} />
                </label>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{files.length} file(s) selected</h3>
                    <p className="text-sm text-white/40">Total: {formatSize(totalSize)}</p>
                  </div>
                  <button onClick={() => setFiles([])} className="text-white/40 hover:text-white text-sm">Clear all</button>
                </div>
                {files.length > 1 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-left mb-4">
                    <p className="text-emerald-400 font-medium">Multi-File Mode</p>
                    <p className="text-sm text-emerald-300/70">Transactions from all {files.length} files will be merged</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, idx) => (
                    <div key={idx} className="relative bg-white/10 rounded-xl p-4 border border-white/20">
                      <button onClick={() => removeFile(idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <FileSpreadsheet className="w-10 h-10 mx-auto text-emerald-400 mb-3" />
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-white/40 mt-1">{formatSize(file.size)}</p>
                      <div className="mt-3 flex justify-center">
                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">Excel</span>
                      </div>
                    </div>
                  ))}
                  {files.length < MAX_FILES && (
                    <label className="relative bg-white/5 rounded-xl p-4 border border-white/10 border-dashed hover:border-emerald-500/50 cursor-pointer">
                      <input type="file" accept=".xls,.xlsx" multiple className="hidden"
                        onChange={e => addFiles(Array.from(e.target.files))} />
                      <div className="text-center py-4">
                        <Upload className="w-10 h-10 mx-auto text-white/40 mb-3" />
                        <p className="text-sm text-white/60">Add more files</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-left">
                <p className="text-rose-400 whitespace-pre-line">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Analyze button */}
        {files.length > 0 && !uploading && (
          <div className="mt-8 text-center">
            <button onClick={handleUpload} className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white text-lg font-semibold rounded-2xl hover:opacity-90 mx-auto">
              {files.length > 1 ? <Layers className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
              {files.length > 1 ? `Analyze ${files.length} Files` : 'Start Analysis'}
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Capabilities */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-white text-center mb-8">Analysis Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, color: 'emerald', title: 'AI Party Detection', desc: 'Auto-detect parties' },
              { icon: Layers, color: 'emerald', title: 'Multi-File Analysis', desc: 'Merge statements' },
              { icon: GitBranch, color: 'emerald', title: 'Fund Flow Chains', desc: 'Trace money paths' },
              { icon: BarChart3, color: 'emerald', title: 'Party Ledger', desc: 'Credit/debit summary' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{title}</p>
                  <p className="text-white/40 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center py-6 text-white/30 text-sm">Party Ledger & Fund Flow Tracking System — AcuTrace</div>
      <div className="text-center pb-4 text-white/40 text-sm">
        Developed by{' '}
        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent font-medium">
          Shourya Pandey
        </span>
      </div>
    </div>
  )
}
