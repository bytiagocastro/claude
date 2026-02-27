import './CompCard.css'

export default function CompCard({ c, selected, onSelect, onOpen, delay }) {
  return (
    <div
      className={`comp-card ${selected ? 'selected' : ''}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={() => onOpen(c)}
    >
      <div className="comp-card-top">
        <div>
          <div className="comp-name-row">
            <div className="comp-name">{c.name}</div>
            {c.origin && (
              <span className={`origin-badge ${c.origin.toLowerCase().includes('brasil') || c.origin.toLowerCase().includes('brazil') ? 'br' : 'global'}`}>
                {c.origin.toLowerCase().includes('brasil') || c.origin.toLowerCase().includes('brazil') ? 'BR' : 'Global'}
              </span>
            )}
          </div>
          <div className="comp-domain">{c.domain}</div>
        </div>
        <div
          className="select-toggle"
          onClick={e => { e.stopPropagation(); onSelect(c) }}
        >
          {selected ? '✓' : '+'}
        </div>
      </div>
      <div className="comp-tagline">{c.tagline}</div>
      <div className="comp-tags">
        {(c.tags || []).slice(0, 3).map(t => (
          <span key={t} className="tag">{t}</span>
        ))}
        <span className="tag pos">{c.positioning}</span>
      </div>
      <div className="comp-footer">
        <div className="relevance">
          <div className="rel-bar">
            <div className="rel-fill" style={{ width: `${c.relevanceScore}%` }} />
          </div>
          <span>{c.relevanceScore}%</span>
        </div>
        <span className="view-link">Ver analise &rarr;</span>
      </div>
    </div>
  )
}
