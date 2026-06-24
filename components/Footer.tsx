import Link from 'next/link'

const team = [
  {
    name: 'Luke Wilson',
    email: 'luke.wilson.5565@gmail.com',
    linkedin: 'https://linkedin.com/in/luke-wilson-046a56263',
  },
  {
    name: 'Skyler Dias',
    email: 'skylerdias881@gmail.com',
    linkedin: 'https://linkedin.com/in/skyler-dias-173b04278',
  },
  {
    name: 'Veen Saleh',
    email: 'veensaleh@gmail.com',
    linkedin: 'https://linkedin.com/in/veen-saleh-742a91292',
  },
  {
    name: 'Anatalio Ubalde',
    email: 'talio@ubalde.com',
    linkedin: 'https://linkedin.com/in/talio-ubalde',
  },
  {
    name: 'Camrynn Manento',
    email: 'cmanento69@ucla.edu',
    linkedin: '',
  },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0d1a30', color: '#c3c8d2' }}>
      <div
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          padding: '52px 28px 30px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '54px',
        }}
        className="footer-grid"
      >
        {/* Contact Form */}
        <div>
          <p
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '11px',
              letterSpacing: '2px',
              color: '#8a98b3',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            Get in Touch
          </p>
          <form
            data-netlify="true"
            name="contact"
            method="POST"
          >
            <input type="hidden" name="form-name" value="contact" />
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}
              className="name-grid"
            >
              <input
                type="text"
                name="first-name"
                placeholder="First Name"
                style={inputStyle}
              />
              <input
                type="text"
                name="last-name"
                placeholder="Last Name"
                style={inputStyle}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              style={{ ...inputStyle, width: '100%', display: 'block', marginBottom: '12px' }}
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={3}
              style={{ ...inputStyle, width: '100%', display: 'block', resize: 'vertical', marginBottom: '16px' }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#b08a42',
                color: '#0d1a30',
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: '14px',
                letterSpacing: '1px',
                padding: '11px 28px',
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Send Inquiry
            </button>
          </form>
        </div>

        {/* Connect */}
        <div>
          <p
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '11px',
              letterSpacing: '2px',
              color: '#8a98b3',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            Connect With Us
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {team.map((member) => (
              <div key={member.name} style={{ fontSize: '14px', lineHeight: 1.5 }}>
                <span style={{ color: '#ffffff', fontWeight: '500' }}>{member.name}</span>
                {' — '}
                <a
                  href={`mailto:${member.email}`}
                  style={{ color: '#8a98b3', textDecoration: 'none' }}
                >
                  {member.email}
                </a>
                {member.linkedin && (
                  <>
                    {' · '}
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#c9a44e', textDecoration: 'none' }}
                    >
                      LinkedIn
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div
        style={{
          borderTop: '1px solid #1d2d49',
          textAlign: 'center',
          padding: '16px 28px',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '11px',
          letterSpacing: '1px',
          color: '#6f7d96',
        }}
      >
        © 2026 Legal Lens. All rights reserved.{' · '}
        <Link href="/admin" style={{ color: '#6f7d96', textDecoration: 'none' }}>
          Manage Articles
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding: 40px 16px 24px !important; }
          .name-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

const inputStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #d8cfb9',
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: '15px',
  padding: '11px 13px',
  color: '#2a3142',
  boxSizing: 'border-box',
}
