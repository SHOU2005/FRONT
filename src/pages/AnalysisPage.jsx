import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  Loader,
  Users,
  GitBranch,
  Target,
  FileText,
  X,
  ArrowRight,
  Sparkles,
  Files,
  Layers,
  BarChart3
} from 'lucide-react'

// Auto-detect API URL
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  return 'http://localhost:8000'
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
    const validFiles = droppedFiles.filter(f =>
      f.name.endsWith(".xls") ||
      f.name.endsWith(".xlsx") ||
      f.name.endsWith(".pdf")
    )

    if (validFiles.length === 0) {
      setError("Please upload  PDF files only")
      return
    }

    setFiles(prev => [...prev, ...validFiles].slice(0, 20))
    if (validFiles.length > 1) setUploadMode("multi")
    setError(null)
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index))
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
      const formData = new FormData()
      files.forEach(file => formData.append("files", file))

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error("Backend returned error")
      }

      const result = await response.json()

      if (!result || !result.transactions) {
        throw new Error("No transaction data found")
      }

      const analysisData = {
        ...result,
        metadata: {
          ...result.metadata,
          upload_mode: uploadMode,
          files_count: files.length
        }
      }

      sessionStorage.setItem(
        "analysisResults",
        JSON.stringify(analysisData)
      )

      setProgress(100)
      setCurrentStep(steps[5].label)

      setTimeout(() => navigate("/results"), 1500)

    } catch (err) {
      setError(err.message || "Failed to analyze file(s)")
      setUploading(false)
      setProgress(0)
      setCurrentStep("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900">
      <nav className="bg-slate-900/50 border-b border-emerald-500/20 px-6 py-4 flex justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-xl font-bold text-white flex items-center gap-2"
        >
          <Target className="w-5 h-5" />
          AcuTrace
        </button>

        <button
          onClick={() => navigate("/results")}
          className="text-white/70 hover:text-white"
        >
          View Results
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Party Ledger & Fund Flow
        </h1>

        <p className="text-white/60 mb-8">
          Upload bank statements for instant analysis
        </p>

        <div
          className={`border-2 border-dashed rounded-2xl p-10 transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-white/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {files.length === 0 && (
            <>
              <Files className="w-12 h-12 mx-auto text-emerald-400 mb-4" />
              <label className="px-6 py-3 bg-emerald-600 rounded-xl text-white cursor-pointer">
                Select Files
                <input
                  type="file"
                  accept=".xls,.xlsx,.pdf"
                  multiple
                  className="hidden"
                  onChange={e => setFiles([...e.target.files])}
                />
              </label>
            </>
          )}

          {error && (
            <div className="mt-4 text-rose-400">
              {error}
            </div>
          )}
        </div>

        {files.length > 0 && !uploading && (
          <button
            onClick={handleUpload}
            className="mt-8 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl flex items-center gap-3 mx-auto"
          >
            <Layers className="w-5 h-5" />
            Start Analysis
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {uploading && (
          <div className="mt-10">
            <Loader className="w-10 h-10 mx-auto text-emerald-400 animate-spin" />
            <p className="text-white/60 mt-4">{currentStep}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalysisPage
