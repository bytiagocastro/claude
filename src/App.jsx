import { useState, useRef } from 'react'
import './App.css'
import CompCard from './components/CompCard'
import Modal from './components/Modal'
import CompareView from './components/CompareView'
import Skeleton from './components/Skeleton'

async function fetchMarketData(query) {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }

  return res.json()
}

export default function App() {
  const [query, setQuery]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [data, setData]         = useState(null)
  const [error, setError]       = useState(null)
  const [selected, setSelected] = useState([])
  const [modal, setModal]       = useState(null)
  const [view, setView]         = useState('list')
  const inputRef = useRef()

  const search = async () => {
    if (!query.trim() || loading) return
    setLoading(true)
    setData(null)
    setError(null)
    setSelected([])
    setView('list')
    try {
      const result = await fetchMarketData(query)
      setData(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (c) => {
    setSelected(prev => {
      const has = prev.some(s => s.name === c.name)
      if (has) return prev.filter(s => s.name !== c.name)
      if (prev.length >= 3) return prev
      return [...prev, c]
    })
  }

  const hasResults = data && !loading

  return (
    <div className="app">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">M</div>
          MarketIntel
        </div>
        <div className="nav-sep" />
        <span className="nav-tag">Competitive Intelligence</span>
        <div className="nav-badge">beta</div>
      </nav>

      {/* HERO */}
      <div className={`hero ${hasResults ? 'compact' : ''}`}>
        {!hasResults && (
          <div className="hero-kicker">
            <div className="kicker-dot" />
            Powered by Claude
          </div>
        )}
        <h1 className="hero-title">
          {hasResults ? query : 'Mapeie seu mercado'}
        </h1>
        {!hasResults && (
          <p className="hero-sub">
            Digite um segmento ou palavras-chave e veja quem esta competindo nesse espaco.
          </p>
        )}
        <div className="search-wrap">
          <span className="search-icon">&#9906;</span>
          <input
            ref={inputRef}
            autoFocus
            className="search-input"
            placeholder="gestao de projetos, fintech b2b, plataforma de RH..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
          />
          <button
            className="search-btn"
            onClick={search}
            disabled={loading || !query.trim()}
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">
        {loading && (
          <>
            <div className="loading-wrap">
              <div className="spinner" />
              <div className="loading-msg">Analisando mercado...</div>
            </div>
            <Skeleton />
          </>
        )}

        {error && (
          <div className="error-box">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {hasResults && view === 'list' && (
          <>
            {/* Segment overview */}
            <div className="segment-card">
              <div className="segment-top">
                <div>
                  <div className="segment-name">{data.segment?.name}</div>
                  <div className="segment-desc">{data.segment?.description}</div>
                </div>
                {data.segment?.maturity && (
                  <div className="maturity-badge">{data.segment.maturity}</div>
                )}
              </div>
              <div className="segment-stats">
                {data.segment?.marketSize && (
                  <div className="stat">
                    <div className="stat-val">{data.segment.marketSize}</div>
                    <div className="stat-lbl">Market Size</div>
                  </div>
                )}
                {data.segment?.cagr && (
                  <div className="stat">
                    <div className="stat-val">{data.segment.cagr}</div>
                    <div className="stat-lbl">CAGR</div>
                  </div>
                )}
                {data.competitors && (
                  <div className="stat">
                    <div className="stat-val">{data.competitors.length}</div>
                    <div className="stat-lbl">Players</div>
                  </div>
                )}
              </div>
              {data.segment?.keyTrend && (
                <div className="trend-line">
                  <span className="trend-arrow">&#8599;</span>
                  {data.segment.keyTrend}
                </div>
              )}
            </div>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="toolbar-left">
                <span className="results-label">Competitors</span>
                <span className="results-count">{data.competitors?.length} found</span>
              </div>
              {selected.length > 0 && (
                <div className="toolbar-right">
                  <div className="compare-slots-inline">
                    {selected.map(c => (
                      <div key={c.name} className="slot-chip">
                        {c.name}
                        <span className="slot-x" onClick={() => toggleSelect(c)}>x</span>
                      </div>
                    ))}
                    {selected.length < 3 && (
                      <div className="slot-empty">+ add</div>
                    )}
                  </div>
                  {selected.length >= 2 && (
                    <button className="compare-action-btn" onClick={() => setView('compare')}>
                      Compare &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Grid with tier grouping */}
            {(() => {
              const tiers = [
                { label: 'Tier 1 — Líderes', min: 85, max: 100 },
                { label: 'Tier 2 — Relevantes', min: 65, max: 84 },
                { label: 'Tier 3 — Emergentes', min: 0, max: 64 },
              ]
              let cardIndex = 0
              return tiers.map(tier => {
                const tierCompetitors = (data.competitors || []).filter(
                  c => c.relevanceScore >= tier.min && c.relevanceScore <= tier.max
                )
                if (tierCompetitors.length === 0) return null
                return (
                  <div key={tier.label} className="tier-group">
                    <div className="tier-label">{tier.label}</div>
                    <div className="results-grid">
                      {tierCompetitors.map((c) => {
                        const delay = cardIndex++ * 0.04
                        return (
                          <CompCard
                            key={c.name}
                            c={c}
                            selected={selected.some(s => s.name === c.name)}
                            onSelect={toggleSelect}
                            onOpen={setModal}
                            delay={delay}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })
            })()}
          </>
        )}

        {hasResults && view === 'compare' && (
          <CompareView
            competitors={selected}
            onBack={() => setView('list')}
          />
        )}

        {!loading && !data && !error && (
          <div className="empty">
            <div className="empty-msg">Nenhuma busca ainda</div>
            <div className="empty-hint">Digite um segmento acima para comecar</div>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          c={modal}
          selected={selected}
          onSelect={toggleSelect}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
