import './Skeleton.css'

export default function Skeleton() {
  return (
    <div className="skel-grid">
      {[...Array(6)].map((_, i) => (
        <div className="skel-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
          <div className="skel-block" style={{ height: 16, width: '50%', marginBottom: 6 }} />
          <div className="skel-block" style={{ height: 11, width: '30%', marginBottom: 14 }} />
          <div className="skel-block" style={{ height: 11, marginBottom: 5 }} />
          <div className="skel-block" style={{ height: 11, width: '75%', marginBottom: 14 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[40, 56, 48].map(w => (
              <div key={w} className="skel-block" style={{ height: 18, width: w, borderRadius: 9999 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
