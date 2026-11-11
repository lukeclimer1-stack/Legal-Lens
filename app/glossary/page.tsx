import type { Metadata } from 'next'
import { getGlossary, glossarySlug } from '@/lib/glossary'

export const metadata: Metadata = {
  title: 'Glossary',
  description: 'Plain-English definitions of the legal terms used in Legal Lens articles.',
  alternates: { canonical: '/glossary' },
}

export default async function GlossaryPage() {
  const glossary = await getGlossary()
  const letters = Array.from(new Set(glossary.map((e) => e.term[0].toUpperCase())))

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '50px 28px' }} className="glossary-container pagein">
      <h1
        style={{
          fontSize: '40px',
          color: '#11203b',
          fontFamily: '"Times New Roman", Times, serif',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '0 0 10px 0',
        }}
      >
        Glossary
      </h1>
      <p style={{ fontStyle: 'italic', fontSize: '16px', color: '#5a6172', textAlign: 'center', marginBottom: '40px' }}>
        Legal terms from our articles, in plain English.
      </p>

      {letters.map((letter) => (
        <section key={letter} style={{ marginBottom: '30px' }}>
          <p
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '12px',
              letterSpacing: '3px',
              color: '#b08a42',
              borderBottom: '1px solid #dcd3bf',
              paddingBottom: '8px',
              margin: '0 0 6px 0',
            }}
          >
            {letter}
          </p>
          <dl style={{ margin: 0 }}>
            {glossary
              .filter((e) => e.term[0].toUpperCase() === letter)
              .map((entry) => (
                <div
                  key={entry.term}
                  id={glossarySlug(entry.term)}
                  className="glossary-entry"
                  style={{ padding: '14px 0', scrollMarginTop: '24px' }}
                >
                  <dt
                    style={{
                      fontFamily: '"Times New Roman", Times, serif',
                      fontSize: '21px',
                      fontWeight: 'bold',
                      color: '#11203b',
                      marginBottom: '4px',
                    }}
                  >
                    {entry.term}
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '17px',
                      lineHeight: 1.7,
                      color: '#2a3142',
                    }}
                  >
                    {entry.definition}
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      ))}

      <style>{`
        @media (max-width: 768px) {
          .glossary-container { padding: 30px 16px !important; }
        }
      `}</style>
    </div>
  )
}
