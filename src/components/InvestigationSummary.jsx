import { FileText, Download, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

/**
 * InvestigationSummary Component
 * Displays AI-generated investigation summary with export options
 */
export default function InvestigationSummary({ summary, riskAnalysis }) {
    const [copied, setCopied] = useState(false)

    if (!summary) {
        return null
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(summary)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleExport = () => {
        const fullReport = `
INVESTIGATION SUMMARY
Generated: ${new Date().toLocaleString()}

${summary}

RISK ANALYSIS
Risk Level: ${riskAnalysis?.risk_level || 'N/A'}
Risk Score: ${riskAnalysis?.account_risk_score || 0}/100

Risk Factors:
${riskAnalysis?.risk_factors?.map(f => `- ${f.description} (Severity: ${f.severity}/100)`).join('\n') || 'None'}
    `.trim()

        const blob = new Blob([fullReport], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `investigation_summary_${Date.now()}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">AI Investigation Summary</h2>
                        <p className="text-sm text-white/50">Auto-generated case analysis</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-colors"
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Summary Content */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
                <div className="prose prose-invert max-w-none">
                    <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
                        {summary}
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            {riskAnalysis && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <p className="text-white/50 text-xs mb-1">Risk Level</p>
                        <p className={`text-xl font-bold ${riskAnalysis.risk_level === 'CRITICAL' ? 'text-red-400' :
                                riskAnalysis.risk_level === 'HIGH' ? 'text-orange-400' :
                                    riskAnalysis.risk_level === 'MEDIUM' ? 'text-yellow-400' :
                                        'text-green-400'
                            }`}>
                            {riskAnalysis.risk_level}
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <p className="text-white/50 text-xs mb-1">Risk Score</p>
                        <p className="text-xl font-bold text-white">
                            {riskAnalysis.account_risk_score}/100
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                        <p className="text-white/50 text-xs mb-1">Risk Factors</p>
                        <p className="text-xl font-bold text-white">
                            {riskAnalysis.risk_factors?.length || 0}
                        </p>
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <p className="text-yellow-400 text-xs">
                    ⚠️ This is an automated analysis. Manual review is recommended for final decision-making.
                </p>
            </div>
        </div>
    )
}
