import './Modal.css'

function ScoreBar({ label, value, max = 100, color = 'var(--fg-2)' }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="score-row">
      <span className="score-lbl">{label}</span>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="score-val">{value}</span>
    </div>
  )
}

function Tag({ children, variant = 'default' }) {
  return <span className={`mtag mtag-${variant}`}>{children}</span>
}

function Section({ title, children }) {
  return (
    <div className="msec">
      <div className="msec-title">{title}</div>
      {children}
    </div>
  )
}

export default function Modal({ c, selected, onSelect, onClose }) {
  const isSel = selected.some(s => s.name === c.name)

  const sizeColor = { Grande: '#22c55e', Medio: '#f59e0b', Pequeno: '#6366f1', Niche: '#8b5cf6' }
  const sizeW = { Grande: '80%', Medio: '55%', Pequeno: '30%', Niche: '15%' }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-hd">
          <div className="modal-hd-row">
            <div>
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
            <button className="modal-close" onClick={onClose}>&#x2715;</button>
          </div>
          <div className="modal-tagline">{c.tagline}</div>
          <div className="modal-meta-row">
            {c.founded && <span className="modal-meta-chip">Est. {c.founded}</span>}
            {c.positioning && <span className="modal-meta-chip">{c.positioning}</span>}
            {c.businessModel && <span className="modal-meta-chip">{c.businessModel}</span>}
            {c.funding?.hasRaised && <span className="modal-meta-chip funded">Captou {c.funding.totalRaised}</span>}
          </div>
        </div>

        {/* BODY */}
        <div className="modal-bd">

          {/* Overview */}
          {c.overview && (
            <Section title="Visao geral">
              <p className="ms-text">{c.overview}</p>
            </Section>
          )}

          {/* STRATEGIC CHARTS ROW */}
          <div className="charts-row">

            {/* Relevance score */}
            <div className="chart-card">
              <div className="chart-card-title">Relevancia</div>
              <div className="radial-wrap">
                <svg viewBox="0 0 80 80" className="radial-svg">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke="var(--fg)" strokeWidth="6"
                    strokeDasharray={`${(c.relevanceScore / 100) * 201} 201`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="radial-label">{c.relevanceScore}%</div>
              </div>
            </div>

            {/* Market size */}
            {c.marketShare && (
              <div className="chart-card">
                <div className="chart-card-title">Tamanho no mercado</div>
                <div className="market-size-viz">
                  <div className="ms-bar-wrap">
                    <div
                      className="ms-bar-fill"
                      style={{
                        width: sizeW[c.marketShare.size] || '20%',
                        background: sizeColor[c.marketShare.size] || 'var(--fg-3)'
                      }}
                    />
                  </div>
                  <div className="ms-size-label" style={{ color: sizeColor[c.marketShare.size] }}>
                    {c.marketShare.size}
                  </div>
                  {c.marketShare.estimatedShare && (
                    <div className="ms-share">~{c.marketShare.estimatedShare} market share</div>
                  )}
                  {c.marketShare.clientCount && (
                    <div className="ms-clients">{c.marketShare.clientCount} clientes</div>
                  )}
                </div>
              </div>
            )}

            {/* SEO */}
            {c.seo && (
              <div className="chart-card">
                <div className="chart-card-title">SEO / Visibilidade</div>
                <div className="seo-viz">
                  {c.seo.estimatedMonthlyVisits && (
                    <div className="seo-metric">
                      <div className="seo-metric-val">{c.seo.estimatedMonthlyVisits}</div>
                      <div className="seo-metric-lbl">visitas/mes</div>
                    </div>
                  )}
                  {c.seo.domainAuthority && (
                    <div className="seo-metric">
                      <div className="seo-metric-val" style={{ textTransform: 'capitalize' }}>{c.seo.domainAuthority}</div>
                      <div className="seo-metric-lbl">autoridade</div>
                    </div>
                  )}
                  {c.seo.topKeywords?.length > 0 && (
                    <div className="seo-keywords">
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
            <Section title="Diferenciais e recursos">
              <div className="diff-list">
                {c.differentiators.map((d, i) => (
                  <div key={i} className="diff-item">
                    <span className="diff-icon">&#9670;</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Pricing */}
          {c.pricing && (
            <Section title="Precos e planos">
              {c.pricing.startingAt && (
                <div className="pricing-starting">A partir de <strong>{c.pricing.startingAt}</strong></div>
              )}
              {c.pricing.plans?.length > 0 && (
                <div className="plans-grid">
                  {c.pricing.plans.map((p, i) => (
                    <div key={i} className="plan-card">
                      <div className="plan-name">{p.name}</div>
                      <div className="plan-price">{p.price}</div>
                      {p.highlight && <div className="plan-highlight">{p.highlight}</div>}
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* Funding */}
          {c.funding?.hasRaised && (
            <Section title="Aportes e investimentos">
              <div className="funding-row">
                <div className="funding-stat">
                  <div className="funding-val">{c.funding.totalRaised || '-'}</div>
                  <div className="funding-lbl">Total captado</div>
                </div>
                <div className="funding-stat">
                  <div className="funding-val">{c.funding.lastRound || '-'}</div>
                  <div className="funding-lbl">Ultimo round</div>
                </div>
                {c.funding.lastRoundYear && (
                  <div className="funding-stat">
                    <div className="funding-val">{c.funding.lastRoundYear}</div>
                    <div className="funding-lbl">Ano</div>
                  </div>
                )}
              </div>
              {c.funding.investors?.length > 0 && (
                <div className="investors-list">
                  {c.funding.investors.map(inv => (
                    <span key={inv} className="investor-tag">{inv}</span>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* Partners + Clients side by side */}
          <div className="two-col">
            {c.partners?.length > 0 && (
              <Section title="Parceiros estrategicos">
                <div className="pill-list">
                  {c.partners.map(p => <Tag key={p} variant="partner">{p}</Tag>)}
                </div>
              </Section>
            )}
            {c.clientProfiles?.length > 0 && (
              <Section title="Perfil de clientes">
                <div className="pill-list">
                  {c.clientProfiles.map(p => <Tag key={p} variant="client">{p}</Tag>)}
                </div>
              </Section>
            )}
          </div>

          {/* Target market */}
          {c.targetMarket && (
            <Section title="Mercado alvo">
              <div className="target-grid">
                {c.targetMarket.segments?.length > 0 && (
                  <div className="target-cell">
                    <div className="target-lbl">Segmentos</div>
                    <div className="pill-list">
                      {c.targetMarket.segments.map(s => <Tag key={s}>{s}</Tag>)}
                    </div>
                  </div>
                )}
                {c.targetMarket.geography && (
                  <div className="target-cell">
                    <div className="target-lbl">Cobertura</div>
                    <div className="target-val">{c.targetMarket.geography}</div>
                  </div>
                )}
                {c.targetMarket.ambition && (
                  <div className="target-cell">
                    <div className="target-lbl">Ambicao</div>
                    <div className="target-val">{c.targetMarket.ambition}</div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Strengths / Weaknesses */}
          {(c.strengths?.length > 0 || c.weaknesses?.length > 0) && (
            <Section title="Forcas e fraquezas">
              <div className="sw-grid">
                {c.strengths?.length > 0 && (
                  <div className="sw-col">
                    <div className="sw-lbl s">Forcas</div>
                    {c.strengths.map((s, i) => (
                      <div key={i} className="sw-item">
                        <span className="sw-sign s">+</span>{s}
                      </div>
                    ))}
                  </div>
                )}
                {c.weaknesses?.length > 0 && (
                  <div className="sw-col">
                    <div className="sw-lbl w">Fraquezas</div>
                    {c.weaknesses.map((w, i) => (
                      <div key={i} className="sw-item">
                        <span className="sw-sign w">-</span>{w}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Insight */}
          {c.marketInsight && (
            <Section title="Insight estrategico">
              <div className="insight-block">{c.marketInsight}</div>
            </Section>
          )}

        </div>

        {/* FOOTER */}
        <div className="modal-ft">
          <button className={`modal-btn ${isSel ? 'remove' : 'add'}`} onClick={() => onSelect(c)}>
            {isSel ? '- Remover' : '+ Comparar'}
          </button>
          <a href={`https://${c.domain}`} target="_blank" rel="noopener noreferrer" className="modal-link">
            {c.domain} &#8599;
          </a>
        </div>

      </div>
    </div>
  )
}
