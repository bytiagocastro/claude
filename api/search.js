export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { query } = req.body
  if (!query || typeof query !== 'string' || query.trim().length < 2)
    return res.status(400).json({ error: 'Query is required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const prompt = `Voce e um analista de inteligencia competitiva especializado no mercado brasileiro.
Analise o segmento: "${query.trim()}" no Brasil.

REGRAS CRITICAS:
- Retorne APENAS JSON puro. Zero markdown. Zero explicacao. Comece direto com {
- Use APENAS caracteres ASCII dentro das strings. Proibido: travessao (--), aspas curvas, reticencias unicode
- Use hifen simples - no lugar de travessao
- Minimo 70% empresas brasileiras
- TODOS os textos em portugues brasileiro
- Valores monetarios sempre em R$ (reais)
- Retorne 12-15 competidores reais, ordenados por relevanceScore desc

Schema exato a seguir:
{
  "segment": {
    "name": "nome do segmento",
    "description": "2 frases sobre o mercado no Brasil",
    "marketSize": "R$ XB",
    "cagr": "X%",
    "maturity": "Growing",
    "keyTrend": "tendencia principal no Brasil"
  },
  "competitors": [
    {
      "name": "Nome da empresa",
      "domain": "empresa.com.br",
      "tagline": "proposta de valor curta",
      "positioning": "Enterprise",
      "targetAudience": "quem atende",
      "businessModel": "SaaS",
      "origin": "Brasil",
      "founded": "2015",
      "relevanceScore": 85,
      "tags": ["tag1", "tag2", "tag3"],
      "overview": "2 frases de visao geral",
      "differentiators": ["diferencial 1", "diferencial 2", "diferencial 3"],
      "pricing": {
        "model": "Freemium",
        "startingAt": "R$ 99/mes",
        "plans": [
          {"name": "Starter", "price": "R$ 99/mes", "highlight": "ate 100 clientes"},
          {"name": "Pro", "price": "R$ 299/mes", "highlight": "ilimitado"},
          {"name": "Enterprise", "price": "sob consulta", "highlight": "SLA dedicado"}
        ]
      },
      "marketShare": {
        "size": "Grande",
        "estimatedShare": "25%",
        "clientCount": "50.000+"
      },
      "funding": {
        "hasRaised": true,
        "totalRaised": "R$ 50M",
        "lastRound": "Serie B",
        "lastRoundYear": "2023",
        "investors": ["Fundo X", "Investidor Y"]
      },
      "partners": ["Parceiro 1", "Parceiro 2"],
      "clientProfiles": ["PMEs de varejo", "E-commerces", "Prestadores de servico"],
      "seo": {
        "estimatedMonthlyVisits": "500K",
        "topKeywords": ["palavra 1", "palavra 2", "palavra 3"],
        "domainAuthority": "alto"
      },
      "targetMarket": {
        "segments": ["PME", "Mid-market"],
        "geography": "Nacional",
        "ambition": "Expansao LATAM"
      },
      "strengths": ["forca 1", "forca 2"],
      "weaknesses": ["fraqueza 1"],
      "marketInsight": "insight estrategico em uma frase"
    }
  ]
}

maturity deve ser: Emerging ou Growing ou Mature
marketShare.size deve ser: Grande ou Medio ou Pequeno ou Niche
funding.hasRaised deve ser: true ou false
Se nao souber um valor, use null para campos opcionais ou string vazia`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(502).json({ error: 'API error', detail: err.slice(0, 200) })
    }

    const data = await response.json()
    if (!data.content?.length) return res.status(502).json({ error: 'Empty response' })

    let text = data.content.filter(b => b.type === 'text').map(b => b.text).join('')

    text = text
      .replace(/```(?:json)?/g, '')
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
      .replace(/[\u2013\u2014\u2015]/g, '-')
      .replace(/[\u2026]/g, '...')
      .replace(/[\u00A0\u202F\u205F]/g, ' ')
      .replace(/[\u0000-\u001F\u007F]/g, ' ')
      .trim()

    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1)
      return res.status(502).json({ error: 'No JSON found in response' })

    let parsed
    try {
      parsed = JSON.parse(text.slice(start, end + 1))
    } catch (e) {
      return res.status(502).json({ error: 'Tente novamente - resposta incompleta da IA.' })
    }

    return res.status(200).json(parsed)
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', detail: err.message })
  }
}
