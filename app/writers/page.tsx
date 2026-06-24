import { promises as fs } from 'fs'
import path from 'path'
import Image from 'next/image'

interface Writer {
  name: string
  slug: string
  school: string
  fields: string
  bio: string
  photo: string
}

async function getWriters(): Promise<Writer[]> {
  const data = await fs.readFile(path.join(process.cwd(), 'content', 'writers.json'), 'utf-8')
  return JSON.parse(data)
}

export default async function WritersPage() {
  const writers = await getWriters()

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '50px 28px' }} className="writers-container">
      <h1
        style={{
          fontSize: '40px',
          color: '#11203b',
          fontFamily: '"Times New Roman", Times, serif',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '0 0 44px 0',
        }}
      >
        The Voices of Legal Lens
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {writers.map((writer) => (
          <div
            key={writer.slug}
            style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr',
              gap: '32px',
              alignItems: 'start',
              borderBottom: '1px solid #dcd3bf',
              paddingBottom: '40px',
            }}
            className="writer-row"
          >
            {/* Photo */}
            <div
              style={{
                width: '150px',
                height: '180px',
                backgroundColor: '#e8e2d4',
                border: '1px solid #d8cfb9',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {writer.photo ? (
                <Image
                  src={writer.photo}
                  alt={writer.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              ) : null}
            </div>

            {/* Info */}
            <div>
              <h3
                style={{
                  fontSize: '26px',
                  color: '#11203b',
                  fontFamily: '"Times New Roman", Times, serif',
                  fontWeight: 'bold',
                  margin: '0 0 6px 0',
                }}
              >
                {writer.name}
              </h3>
              <p
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: '11px',
                  letterSpacing: '1px',
                  color: '#8a7340',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                {writer.school}
              </p>
              <p
                style={{
                  fontSize: '14px',
                  color: '#b08a42',
                  fontStyle: 'italic',
                  marginBottom: '12px',
                }}
              >
                {writer.fields}
              </p>
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: 1.7,
                  color: '#2a3142',
                  margin: 0,
                }}
              >
                {writer.bio}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .writers-container { padding: 30px 16px !important; }
          .writer-row { grid-template-columns: 1fr !important; }
          .writer-row > div:first-child { width: 100% !important; max-width: 150px; }
        }
      `}</style>
    </div>
  )
}
