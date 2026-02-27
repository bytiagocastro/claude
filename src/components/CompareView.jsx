import './CompareView.css'

const ROWS = [
  { key: 'tagline',        label: 'Value prop' },
  { key: 'positioning',    label: 'Positioning' },
  { key: 'targetAudience', label: 'Target' },
  { key: 'businessModel',  label: 'Model' },
  { key: 'differentiator', label: 'Diferencial' },
  { key: 'revenue',        label: 'Revenue' },
  { key: 'founded',        label: 'Founded' },
]

export default function CompareView({ competitors, onBack }) {
  const cols = competitors.length
  const gridCols = `140px repeat(${cols}, 1fr)`

  return (
    <div className="compare-view">
      <button className="back-btn" onClick={onBack}>&larr; Voltar</button>

      <div className="compare-hd">
        <div className="compare-title">Comparacao</div>
        <div className="compare-sub">{cols} competidores selecionados</div>
      </div>

      <div className="compare-table">
        {/* Header */}
        <div className="ct-header-row" style={{ gridTemplateColumns: gridCols }}>
          <div className="ct-header-spacer" />
          {competitors.map(c => (
            <div key={c.name} className="ct-col-header">
              <div className="ct-col-name">{c.name}</div>
              <div className="ct-col-domain">{c.domain}</div>
            </div>
          ))}
        </div>

        {/* Data rows */}
        {ROWS.map(row => (
          <div key={row.key} className="ct-row" style={{ gridTemplateColumns: gridCols }}>
            <div className="ct-label-cell">{row.label}</div>
            {competitors.map(c => (
              <div key={c.name} className="ct-cell">{c[row.key] || '-'}</div>
            ))}
          </div>
        ))}

        {/* Pains row */}
        <div className="ct-row" style={{ gridTemplateColumns: gridCols }}>
          <div className="ct-label-cell">Dores</div>
          {competitors.map(c => (
            <div key={c.name} className="ct-cell">
              <ul className="ct-pain-list">
                {(c.pains || []).map((p, i) => (
                  <li key={i} className="ct-pain">
                    <div className="ct-pain-dot" />{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Relevance row */}
        <div className="ct-row" style={{ gridTemplateColumns: gridCols }}>
          <div className="ct-label-cell">Relevancia</div>
          {competitors.map(c => (
            <div key={c.name} className="ct-cell">
              <div className="rel-cell">
                <div className="rel-bar-lg">
                  <div className="rel-fill-lg" style={{ width: `${c.relevanceScore}%` }} />
                </div>
                <span className="rel-pct">{c.relevanceScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
