export default function MissionStrip() {
  const pillars = [
    {
      numeral: 'i.',
      title: 'Transparency',
      body: 'We offer unbiased analysis of real cases and policies—without a hidden agenda.',
      delay: '0s',
    },
    {
      numeral: 'ii.',
      title: 'Accessibility',
      body: 'Taking the complexity out of the law to make it understandable for everyone.',
      delay: '.12s',
    },
    {
      numeral: 'iii.',
      title: 'Community',
      body: 'A shared platform for insights on the forces shaping our world.',
      delay: '.24s',
    },
  ]

  return (
    <section className="reveal" style={{ backgroundColor: '#11203b', color: '#f1ecdf', width: '100%' }}>
      <div
        style={{ maxWidth: '1080px', margin: '0 auto', padding: '54px 28px' }}
        className="mission-inner"
      >
        <blockquote
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            fontSize: '28px',
            lineHeight: 1.4,
            fontWeight: 400,
            color: '#ffffff',
            maxWidth: '820px',
            margin: '0 auto 44px auto',
            fontFamily: '"Times New Roman", Times, serif',
          }}
        >
          &ldquo;The law is the foundation of our society—it should be clear, accessible, and inclusive.&rdquo;
        </blockquote>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}
          className="pillars-grid"
        >
          {pillars.map((p) => (
            <div key={p.numeral} className="reveal" style={{ transitionDelay: p.delay }}>
              <p
                style={{
                  fontSize: '30px',
                  color: '#c9a44e',
                  fontStyle: 'italic',
                  fontFamily: '"Times New Roman", Times, serif',
                  margin: '0 0 10px 0',
                }}
              >
                {p.numeral}
              </p>
              <p
                style={{
                  fontSize: '16px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#f1ecdf',
                  fontFamily: '"Courier New", Courier, monospace',
                  marginBottom: '10px',
                }}
              >
                {p.title}
              </p>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: '#c3c8d2',
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .pillars-grid { grid-template-columns: 1fr !important; }
          .mission-inner { padding: 40px 16px !important; }
        }
      `}</style>
    </section>
  )
}
