export default function ApplyCTA() {
  return (
    <section
      style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '56px 28px',
        textAlign: 'center',
      }}
      className="apply-section"
    >
      <p
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '12px',
          letterSpacing: '3px',
          color: '#b08a42',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        Join the Community
      </p>
      <h2
        style={{
          fontSize: '32px',
          color: '#11203b',
          fontFamily: '"Times New Roman", Times, serif',
          fontWeight: 'bold',
          margin: '0 0 16px 0',
        }}
      >
        Share Your Ideas
      </h2>
      <p
        style={{
          fontSize: '17px',
          color: '#3a4254',
          maxWidth: '580px',
          margin: '0 auto 28px auto',
          lineHeight: 1.6,
        }}
      >
        Legal Lens is a space for curious student writers. If you want to research, write, and explain the law to a wider audience, we'd love to hear from you.
      </p>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdNe05PaTE2yzZXatyDwhMHH1Ag2skePh8w8wQyt5Wxcr5rzg/viewform"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          backgroundColor: '#11203b',
          color: '#f1ecdf',
          fontSize: '15px',
          letterSpacing: '1px',
          padding: '13px 32px',
          borderRadius: '2px',
          textDecoration: 'none',
          fontFamily: '"Times New Roman", Times, serif',
        }}
      >
        Apply to Write
      </a>
      <style>{`
        @media (max-width: 768px) {
          .apply-section { padding: 40px 16px !important; }
        }
      `}</style>
    </section>
  )
}
