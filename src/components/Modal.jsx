import './Modal.css'

// Labels section header
function Sec({ title }) {
  return <div className="msec-title"><span>{title}</span></div>
}

// Colored pill tag
function Pill({ children, variant = 'default' }) {
  return <span className={`mpill mpill-${variant}`}>{children}</span>
}

// Radial score chart (SVG)
function Radial({ value, label, color = '#fff' }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const fill = (value / 100) * circ
  return (
    <div className="radial-wrap">
      <svg viewBox="0 0 72 72" className="radial-svg">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#303038" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="radial-inner">
        <div className="radial-val" style={{ color }}>{value}</div>
        <div className="radial-lbl">{label}</div>
      </div>
    </div>
  )
}

// Horizontal bar metric
function BarMetric({ label, value, pct, color = '#fff' }) {
  return (
    <div className="bar-metric">
      <div className="bar-metric-top">
        <span className="bar-metric-lbl">{label}</span>
        <span className="bar-metric-val" style={{ color }}>{value}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

const SIZE_COLOR = { Grande: '#34d47a', Medio: '#f5a623', Pequeno: '#7c6af7', Niche: '#60a5fa', Large: '#34d47a', Medium: '#f5a623', Small: '#7c6af7' }
const SIZE_PCT = { Grande: 82, Medio: 55, Pequeno: 28, Niche: 12, Large: 82, Medium: 55, Small: 28 }

export default function Modal({ c, selected, onSelect, onClose }) {
  const isSel = selected.some(s => s.name === c.name)
  const sizeColor = SIZE_COLOR[c.marketShare?.size] || '#9898a8'
  const sizePct = SIZE_PCT[c.marketShare?.size] || 20

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* ── HEADER ── */}
        <div className="modal-hd">
          <div className="modal-hd-top">
            <div className="modal-hd-left">
              <div className="modal-name-row">
                <span className="modal-name">{c.name}</span>
                {c.origin && (
                  <span className={`origin-badge-lg ${c.origin.toLowerCase().includes('brasil') ? 'br' : 'global'}`}>
                    {c.origin.toLowerCase().includes('brasil') ? 'BR' : 'Global'}
                  </span>
                )}
              </div>
              <div className="modal-domain">{c.domain}</div>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          {c.tagline && <p className="modal-tagline">{c.tagline}</p>}
          <div className="modal-chips">
            {c.founded && <span className="mchip">Est. {c.founded}</span>}
            {c.positioning && <span className="mchip">{c.positioning}</span>}
            {c.businessModel && <span className="mchip">{c.businessModel}</span>}
            {c.funding?.hasRaised && <span className="mchip funded">Captou {c.funding.totalRaised || 'capital'}</span>}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="modal-bd">

          {/* Overview */}
          {c.overview && (
            <div className="msec">
              <Sec title="Visão geral" />
              <p className="ms-text">{c.overview}</p>
            </div>
          )}

          {/* ── VISUAL METRICS ROW ── */}
          <div className="metrics-grid">

            {/* Relevância */}
            <div className="metric-card">
              <div className="metric-card-title">Relevância</div>
              <Radial value={c.relevanceScore} label="score" color="#7c6af7" />
            </div>

            {/* Tamanho de mercado */}
            {c.marketShare && (
              <div className="metric-card">
                <div className="metric-card-title">Mercado</div>
                <div className="market-viz">
                  <div className="market-size-label" style={{ color: sizeColor }}>
                    {c.marketShare.size}
                  </div>
                  <div className="mkt-bar-wrap">
                    <div className="mkt-bar-fill" style={{ width: `${sizePct}%`, background: sizeColor }} />
                  </div>
                  {c.marketShare.estimatedShare && (
                    <div className="market-sub">~{c.marketShare.estimatedShare} share</div>
                  )}
                  {c.marketShare.clientCount && (
                    <div className="market-sub">{c.marketShare.clientCount} clientes</div>
                  )}
                </div>
              </div>
            )}

            {/* SEO */}
            {c.seo && (
              <div className="metric-card">
                <div className="metric-card-title">SEO</div>
                <div className="seo-viz">
                  {c.seo.estimatedMonthlyVisits && (
                    <div className="seo-big">{c.seo.estimatedMonthlyVisits}
                      <span className="seo-big-sub">visitas/mês</span>
                    </div>
                  )}
                  {c.seo.domainAuthority && (
                    <div className="seo-auth">
                      Autoridade: <strong>{c.seo.domainAuthority === 'high' || c.seo.domainAuthority === 'alto' ? 'Alta' : c.seo.domainAuthority === 'medium' || c.seo.domainAuthority === 'medio' ? 'Média' : 'Baixa'}</strong>
                    </div>
                  )}
                  {c.seo.topKeywords?.length > 0 && (
                    <div className="seo-kws">
                      {c.seo.topKeywords.slice(0, 3).map(k => (
                        <span key={k} className="seo-kw">{k}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Diferenciais */}
          {c.differentiators?.length > 0 && (
            <div className="msec">
              <Sec title="Diferenciais e recursos" />
              <div className="diff-list">
                {c.differentiators.map((d, i) => (
                  <div key={i} className="diff-item">
                    <span className="diff-dot" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preços */}
          {c.pricing && (
            <div className="msec">
              <Sec title="Preços e planos" />
              {c.pricing.startingAt && (
                <p className="pricing-from">A partir de <strong>{c.pricing.startingAt}</strong></p>
              )}
              {c.pricing.plans?.length > 0 && (
                <div className="plans-row">
                  {c.pricing.plans.map((p, i) => (
                    <div key={i} className={`plan-card ${i === 1 ? 'plan-highlight' : ''}`}>
                      <div className="plan-name">{p.name}</div>
                      <div className="plan-price">{p.price}</div>
                      {p.highlight && <div className="plan-desc">{p.highlight}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Funding */}
          {c.funding?.hasRaised && (
            <div className="msec">
              <Sec title="Aportes e investimentos" />
              <div className="funding-row">
                {c.funding.totalRaised && (
                  <div className="funding-stat">
                    <div className="funding-val">{c.funding.totalRaised}</div>
                    <div className="funding-key">Total captado</div>
                  </div>
                )}
                {c.funding.lastRound && (
                  <div className="funding-stat">
                    <div className="funding-val">{c.funding.lastRound}</div>
                    <div className="funding-key">Último round</div>
                  </div>
                )}
                {c.funding.lastRoundYear && (
                  <div className="funding-stat">
                    <div className="funding-val">{c.funding.lastRoundYear}</div>
                    <div className="funding-key">Ano</div>
                  </div>
                )}
              </div>
              {c.funding.investors?.length > 0 && (
                <div className="pill-row">
                  {c.funding.investors.map(inv => <Pill key={inv} variant="investor">{inv}</Pill>)}
                </div>
              )}
            </div>
          )}

          {/* Parceiros + Clientes */}
          <div className="two-col">
            {c.partners?.length > 0 && (
              <div className="msec">
                <Sec title="Parceiros" />
                <div className="pill-row">
                  {c.partners.map(p => <Pill key={p} variant="partner">{p}</Pill>)}
                </div>
              </div>
            )}
            {c.clientProfiles?.length > 0 && (
              <div className="msec">
                <Sec title="Clientes" />
                <div className="pill-row">
                  {c.clientProfiles.map(p => <Pill key={p} variant="client">{p}</Pill>)}
                </div>
              </div>
            )}
          </div>

          {/* Mercado alvo */}
          {c.targetMarket && (
            <div className="msec">
              <Sec title="Mercado alvo" />
              <div className="target-row">
                {c.targetMarket.segments?.length > 0 && (
                  <div className="target-cell">
                    <div className="target-key">Segmentos</div>
                    <div className="pill-row">
                      {c.targetMarket.segments.map(s => <Pill key={s}>{s}</Pill>)}
                    </div>
                  </div>
                )}
                {c.targetMarket.geography && (
                  <div className="target-cell">
                    <div className="target-key">Cobertura</div>
                    <div className="target-val">{c.targetMarket.geography}</div>
                  </div>
                )}
                {c.targetMarket.ambition && (
                  <div className="target-cell">
                    <div className="target-key">Ambição</div>
                    <div className="target-val">{c.targetMarket.ambition}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Forças e Fraquezas */}
          {(c.strengths?.length > 0 || c.weaknesses?.length > 0) && (
            <div className="msec">
              <Sec title="Forças e fraquezas" />
              <div className="sw-row">
                {c.strengths?.length > 0 && (
                  <div className="sw-col sw-green">
                    <div className="sw-header">Forças</div>
                    {c.strengths.map((s, i) => (
                      <div key={i} className="sw-item"><span className="sw-icon">+</span>{s}</div>
                    ))}
                  </div>
                )}
                {c.weaknesses?.length > 0 && (
                  <div className="sw-col sw-red">
                    <div className="sw-header">Fraquezas</div>
                    {c.weaknesses.map((w, i) => (
                      <div key={i} className="sw-item"><span className="sw-icon">–</span>{w}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Insight */}
          {c.marketInsight && (
            <div className="msec">
              <Sec title="Insight estratégico" />
              <div className="insight-block">{c.marketInsight}</div>
            </div>
          )}

        </div>

        {/* ── FOOTER ── */}
        <div className="modal-ft">
          <button className={`modal-btn ${isSel ? 'btn-remove' : 'btn-add'}`} onClick={() => onSelect(c)}>
            {isSel ? '− Remover da comparação' : '+ Comparar'}
          </button>
          <a href={`https://${c.domain}`} target="_blank" rel="noopener noreferrer" className="modal-ext">
            {c.domain} ↗
          </a>
        </div>

      </div>
    </div>
  )
}
