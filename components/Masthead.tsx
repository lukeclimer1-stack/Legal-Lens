import Link from 'next/link'

const LETTERS = ['L', 'E', 'G', 'A', 'L', ' ', 'L', 'E', 'N', 'S']

export default function Masthead() {
  return (
    <div
      style={{
        backgroundColor: '#faf7f0',
        borderBottom: '3px double #b08a42',
      }}
    >
      <div
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          padding: '22px 28px 14px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '11px',
            letterSpacing: '3px',
            color: '#8a7340',
            textTransform: 'uppercase',
            margin: '0 0 8px 0',
          }}
        >
          Est. 2026 · A Student Journal of Law &amp; Policy
        </p>
        <Link
          href="/"
          style={{
            display: 'block',
            fontSize: '72px',
            letterSpacing: '16px',
            color: '#11203b',
            fontWeight: 'bold',
            fontFamily: '"Times New Roman", Times, serif',
            textDecoration: 'none',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
          }}
          className="masthead-logo"
        >
          {LETTERS.map((letter, i) =>
            letter === ' ' ? (
              <span key={i} style={{ display: 'inline-block' }}>
                &nbsp;
              </span>
            ) : (
              <span
                key={i}
                className="mast-letter"
                style={{ animation: `ll-ink 0.7s ${(i * 0.05).toFixed(2)}s both` }}
              >
                {letter}
              </span>
            )
          )}
        </Link>
        <p
          style={{
            fontStyle: 'italic',
            fontSize: '17px',
            color: '#5a6172',
            margin: '8px 0 0 0',
            fontFamily: '"Times New Roman", Times, serif',
            animation: 'll-ink 0.8s 0.45s both',
          }}
        >
          Clear, accessible, and inclusive analysis of the law
        </p>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .masthead-logo { font-size: 48px !important; letter-spacing: 8px !important; }
        }
        @media (max-width: 480px) {
          .masthead-logo { font-size: 36px !important; letter-spacing: 4px !important; }
        }
      `}</style>
    </div>
  )
}
