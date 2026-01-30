import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileSpreadsheet, CheckCircle, Loader, Users, GitBranch, Target, FileText, X, ArrowRight, Sparkles, Files, Layers, BarChart3 } from 'lucide-react'

// Auto-detect API URL based on current host for network access
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  return window.location.origin.replace(/:\d+$/, ':8000') || 'http://localhost:8000'
}

const API_URL = getApiUrl()

function AnalysisPage() {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [error, setError] = useState(null)
  const [uploadMode, setUploadMode] = useState("single")

  const steps = [
    { id: "upload", label: "Uploading Files", icon: Files },
    { id: "extract", label: "Extracting Transactions", icon: FileText },
    { id: "merge", label: "Merging Data", icon: Layers },
    { id: "party", label: "Detecting Parties", icon: Users },
    { id: "chains", label: "Building Fund Flow Chains", icon: GitBranch },
    { id: "complete", label: "Analysis Complete", icon: CheckCircle }
  ]

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFiles = Array.from(e.dataTransfer.files || [])
    const validFiles = droppedFiles.filter(function(f) { 
      return f.name.endsWith(".xls") || f.name.endsWith(".xlsx") || f.name.endsWith(".pdf") 
    })
    if (validFiles.length === 0) {
      setError("Please upload XLS/XLSX or PDF files only")
      return
    }
    setFiles(function(prev) { return [...prev, ...validFiles].slice(0, 20) })
    setError(null)
    if (validFiles.length > 1) setUploadMode("multi")
  }

  function removeFile(index) {
    setFiles(function(prev) { return prev.filter(function(_, i) { return i !== index }) })
  }

  async function handleUpload() {
    if (files.length === 0) {
      setError("Please select at least one file")
      return
    }
    setUploading(true)
    setError(null)
    setProgress(10)
    setCurrentStep(steps[0].label)
    try {
      var formData = new FormData()
      files.forEach(function(file) { formData.append("files", file) })
      var response = await fetch(API_URL + "/api/analyze", {, { method: "POST", body: formData })
      if (!response.ok) throw new Error("Backend returned error")
      var result = await response.json()
      if (!result || !result.transactions) throw new Error("No transaction data found")
      var analysisData = { ...result, metadata: { ...result.metadata, upload_mode: uploadMode, files_count: files.length } }
      sessionStorage.setItem("analysisResults", JSON.stringify(analysisData))
      setProgress(100)
      setCurrentStep(steps[5].label)
      setTimeout(function() { navigate("/results") }, 1500)
    } catch (err) {
      setError(err.message || "Failed to analyze file(s)")
      setUploading(false)
      setProgress(0)
      setCurrentStep("")
    }
  }

  var totalSize = files.reduce(function(sum, f) { return sum + f.size }, 0)
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  var stepItems = steps.map(function(step, idx) {
    var isCompleted = progress > (idx + 1) * 16
    var isCurrent = currentStep === step.label
    return (
      <div key={step.id} className="flex flex-col items-center">
        <div className={"w-10 h-10 rounded-full flex items-center justify-center " + (isCompleted ? 'bg-emerald-500' : (isCurrent ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse' : 'bg-white/10'))}>
          {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : <step.icon className={"w-5 h-5 " + (isCurrent ? 'text-white' : 'text-white/40')} />}
        </div>
        <span className={"text-xs mt-2 hidden sm:block " + (isCurrent ? 'text-emerald-400' : 'text-white/40')}>{step.label}</span>
      </div>
    )
  })

  var fileItems = files.map(function(file, idx) {
    var isPDF = file.name.endsWith('.pdf')
    return (
      <div key={idx} className="relative bg-white/10 rounded-xl p-4 border border-white/20">
        <button onClick={function() { removeFile(idx) }} className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </button>
        {isPDF ? <FileText className="w-10 h-10 mx-auto text-rose-400 mb-3" /> : <FileSpreadsheet className="w-10 h-10 mx-auto text-emerald-400 mb-3" />}
        <p className="text-sm text-white truncate">{file.name}</p>
        <p className="text-xs text-white/40 mt-1">{formatSize(file.size)}</p>
        <div className="mt-3 flex justify-center gap-2">
          <span className={isPDF ? "px-2 py-0.5 rounded text-xs bg-rose-500/20 text-rose-400" : "px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400"}>{isPDF ? 'PDF' : 'Excel'}</span>
        </div>
      </div>
    )
  })

  var addMoreButton = (
    <label key="addmore" className="relative bg-white/5 rounded-xl p-4 border border-white/10 border-dashed hover:border-emerald-500/50 cursor-pointer">
      <input type="file" accept=".xls,.xlsx,.pdf" multiple={true} onChange={function(e) { setFiles(function(prev) { return [...prev, ...e.target.files].slice(0, 20) }) }} className="hidden" />
      <div className="text-center py-4">
        <Upload className="w-10 h-10 mx-auto text-white/40 mb-3" />
        <p className="text-sm text-white/60">Add more files</p>
      </div>
    </label>
  )

  var multiFileBanner = null
  if (uploadMode === "multi" && files.length > 1) {
    multiFileBanner = (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-left">
        <p className="text-emerald-400 font-medium">Multi-File Mode</p>
        <p className="text-sm text-emerald-300/70">Transactions from all {files.length} files will be merged</p>
      </div>
    )
  }

  var progressSection = (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">{stepItems}</div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500" style={{ width: progress + "%" }}></div>
      </div>
    </div>
  )

  var uploadSection = null
  if (!uploading) {
    var headerSection = (
      <div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{files.length} file(s) selected</h3>
            <p className="text-sm text-white/40">Total: {formatSize(totalSize)}</p>
          </div>
          <button onClick={function() { setFiles([]) }} className="text-white/40 hover:text-white text-sm">Clear all</button>
        </div>
        {multiFileBanner}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fileItems}
          {addMoreButton}
        </div>
      </div>
    )

    if (files.length === 0) {
      headerSection = (
        <div>
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
            <Files className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-2xl font-semibold text-white mb-3">Drop Files Here</p>
          <p className="text-white/50 mb-6">Support for XLS, XLSX, PDF bank statements</p>
          <label className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl cursor-pointer hover:opacity-90">
            <Upload className="w-5 h-5" />
            Select Files
            <input type="file" accept=".xls,.xlsx,.pdf" multiple={true} onChange={function(e) { setFiles(function(prev) { var newFiles = [...prev, ...e.target.files].slice(0, 20); if (e.target.files.length > 1) setUploadMode("multi"); return newFiles }) }} className="hidden" />
          </label>
        </div>
      )
    }

    var errorSection = null
    if (error) {
      errorSection = (
        <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
          <p className="text-rose-400">{error}</p>
        </div>
      )
    }

    uploadSection = (
      <div className={"border-2 border-dashed rounded-2xl p-10 text-center transition-all " + (dragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/30 hover:border-emerald-500/50')} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        {headerSection}
        {errorSection}
      </div>
    )
  } else {
    uploadSection = (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <Loader className="w-12 h-12 text-white animate-spin" />
        </div>
        <p className="text-2xl font-bold text-white mb-2">{Math.round(progress)}% Complete</p>
        <p className="text-white/50 animate-pulse">{currentStep}</p>
      </div>
    )
  }

  var analyzeButton = null
  if (files.length > 0 && !uploading) {
    var buttonIcon = uploadMode === "multi" ? <Layers className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />
    var buttonText = uploadMode === "multi" ? "Analyze " + files.length + " Files" : "Start Analysis"
    analyzeButton = (
      <div className="mt-8 text-center">
        <button onClick={handleUpload} className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white text-lg font-semibold rounded-2xl hover:opacity-90 mx-auto">
          {buttonIcon}
          {buttonText}
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    )
  }

  var modeToggle = null
  if (files.length > 0) {
    modeToggle = (
      <div className="mt-6 inline-flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
        <button onClick={function() { setUploadMode("single") }} className={"px-4 py-2 rounded-lg text-sm font-medium " + (uploadMode === "single" ? 'bg-emerald-500 text-white' : 'text-white/60')}>Single File</button>
        <button onClick={function() { setUploadMode("multi") }} className={"px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 " + (uploadMode === "multi" ? 'bg-emerald-500 text-white' : 'text-white/60')}>
          <Layers className="w-4 h-4" />
          Multi-File
        </button>
      </div>
    )
  }

  var capabilities = (
    <div className="mt-16">
      <h2 className="text-xl font-bold text-white text-center mb-8">Analysis Capabilities</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Users className="w-6 h-6 text-emerald-400" /></div>
          <div><p className="text-white font-medium">AI Party Detection</p><p className="text-white/40 text-sm">Auto-detect parties</p></div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Layers className="w-6 h-6 text-emerald-400" /></div>
          <div><p className="text-white font-medium">Multi-File Analysis</p><p className="text-white/40 text-sm">Merge statements</p></div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center"><GitBranch className="w-6 h-6 text-emerald-400" /></div>
          <div><p className="text-white font-medium">Fund Flow Chains</p><p className="text-white/40 text-sm">Trace money paths</p></div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/10">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center"><BarChart3 className="w-6 h-6 text-emerald-400" /></div>
          <div><p className="text-white font-medium">Party Ledger</p><p className="text-white/40 text-sm">Credit/debit summary</p></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900">
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-emerald-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={function() { navigate("/") }} className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            AcuTrace
          </button>
          <button onClick={function() { navigate("/results") }} className="text-white/80 hover:text-white text-sm px-4 py-2 rounded-xl hover:bg-white/10 transition-all">View Results</button>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Party Ledger & Fund Flow</h1>
          <p className="text-xl text-white/60">Upload bank statements for instant party detection</p>
          {modeToggle}
        </div>
        {progressSection}
        {uploadSection}
        {analyzeButton}
        {capabilities}
      </div>
      <div className="text-center py-6 text-white/30 text-sm">Party Ledger & Fund Flow Tracking System - AcuTrace</div>
      <div className="text-center pb-4 text-white/40 text-sm">
        Developed by <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent font-medium">Shourya Pandey</span>
      </div>
    </div>
  )
}

export default AnalysisPage

