import React, { useMemo } from 'react'

export default function NetworkGraph({
    partyLedger,
    correlations = [],
    onPartyClick
}) {
    const nodes = useMemo(() => {
        if (!partyLedger) return []

        // Sort top 8 parties by transaction count
        const topParties = [...partyLedger]
            .sort((a, b) => (b.transaction_count || 0) - (a.transaction_count || 0))
            .slice(0, 8)

        // Create central node (User)
        const centralNode = {
            id: 'ME',
            x: 300,
            y: 300,
            r: 40,
            color: '#10b981', // Emerald 500
            label: 'ME'
        }

        // Create planetary nodes
        const planetNodes = topParties.map((party, i) => {
            const angle = (i * (360 / topParties.length)) * (Math.PI / 180)
            const dist = 180 // Distance from center
            const isMerchant = party.entity_type === 'Merchant'

            return {
                id: party.party_name,
                x: 300 + Math.cos(angle) * dist,
                y: 300 + Math.sin(angle) * dist,
                r: Math.max(20, Math.min(party.transaction_count * 2, 35)),
                color: isMerchant ? '#3b82f6' : '#a855f7', // Blue or Purple
                label: party.party_name,
                count: party.transaction_count,
                party: party
            }
        })

        return [centralNode, ...planetNodes]
    }, [partyLedger])

    if (!partyLedger || partyLedger.length === 0) return null

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex flex-col items-center">
            <h3 className="text-lg font-bold text-white mb-2 self-start flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Transaction Network
            </h3>
            <p className="text-sm text-white/40 self-start mb-6">Top connections by frequency</p>

            <svg width="600" height="600" viewBox="0 0 600 600" className="max-w-full h-auto">
                {/* Connections */}
                {nodes.slice(1).map((node, i) => (
                    <line
                        key={'link-' + i}
                        x1={nodes[0].x}
                        y1={nodes[0].y}
                        x2={node.x}
                        y2={node.y}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={node.count > 10 ? 3 : 1}
                    />
                ))}

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <g
                        key={node.id}
                        onClick={() => i > 0 && onPartyClick && onPartyClick(node.id)}
                        className={i > 0 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
                    >
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r}
                            fill={node.color}
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="4"
                        />
                        <text
                            x={node.x}
                            y={node.y + node.r + 20}
                            textAnchor="middle"
                            fill="white"
                            fontSize="12"
                            fontWeight="500"
                            className="select-none"
                        >
                            {node.label.length > 15 ? node.label.substring(0, 12) + '...' : node.label}
                        </text>
                        {i > 0 && (
                            <text
                                x={node.x}
                                y={node.y}
                                dy=".3em"
                                textAnchor="middle"
                                fill="white"
                                fontSize="10"
                                className="pointer-events-none select-none"
                            >
                                {node.count}
                            </text>
                        )}
                    </g>
                ))}
            </svg>

            <div className="flex gap-4 mt-4 text-xs text-white/50">
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span> ME
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span> Business
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span> Individual
                </div>
            </div>
        </div>
    )
}
