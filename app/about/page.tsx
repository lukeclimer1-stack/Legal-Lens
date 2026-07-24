import { existsSync } from 'fs'
import path from 'path'
import { getSiteConfig } from '@/lib/site-config'
import AboutPhotoEditor from '@/components/AboutPhotoEditor'

export default async function AboutPage() {
  const photoExists = existsSync(path.join(process.cwd(), 'public/uploads/luke-src.jpg'))
  const siteConfig = await getSiteConfig()

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '50px 28px' }} className="about-container pagein">
      {/* Top grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '36px',
        }}
        className="about-top"
      >
        {/* Photo */}
        {photoExists && <AboutPhotoEditor initialConfig={siteConfig} />}

        {/* Info */}
        <div>
          <p
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '11px',
              letterSpacing: '2px',
              color: '#b08a42',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Founder · Editor-in-Chief · Writer
          </p>
          <h1
            style={{
              fontSize: '42px',
              color: '#11203b',
              fontFamily: '"Times New Roman", Times, serif',
              fontWeight: 'bold',
              margin: '0 0 10px 0',
            }}
          >
            Luke Wilson
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#5a6172',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            Criminal Law · Civil / Tort Law · Family Law
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ borderTop: '1px solid #dcd3bf', paddingTop: '30px' }}>
        {[
          `Hello, my name is Luke Wilson. I am currently an undergraduate student studying Political Science at UCLA on a pre-law track, driven by a passion for advocacy, education, and empathy.`,
          `Growing up in a family of educators and medical professionals, service was never presented to me as optional. It was simply what I saw every day, and it shaped how I think about purpose and responsibility. The East Bay community has also shaped everything about how I think, how I lead, and where I'm headed. I'm someone who believes the most meaningful work happens when you actually show up—not just in the big moments, but consistently, over time.`,
          `Before UCLA, I served as a student board member for both the West Contra Costa Unified School District and the Contra Costa County Office of Education, representing over 197,000 students in formal policy discussions. I also served as president of El Cerrito High School's Mock Trial team, where I led the program to the quarterfinals—the furthest it had gone in over five years—while personally helping over 30 students find their footing in the program.`,
          `At UCLA, I'm a member of the College Scholars honors program, and I serve as the Social Policy Sector Leader for the Bruin Undergraduate Policy Review Club, where I lead a team of writers through the full publication process. I'm also a member of the Pre-Law Litigation Club's Research Team, building the analytical and legal research skills that will carry me into law school and eventually into a courtroom.`,
          `After graduating, I plan to attend law school with the goal of using my legal education to create opportunities for people who need them most—the same way mentors and community leaders once did for me.`,
        ].map((para, i) => (
          <p
            key={i}
            style={{
              fontSize: '17px',
              lineHeight: 1.75,
              color: '#2a3142',
              marginBottom: '20px',
              fontFamily: '"Times New Roman", Times, serif',
            }}
          >
            {para}
          </p>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 768px) {
          .about-container { padding: 30px 16px !important; }
          .about-top { grid-template-columns: 1fr !important; }
          .about-top > div:first-child { width: 100% !important; max-width: 260px; margin: 0 auto; }
        }
      `,
        }}
      />
    </div>
  )
}
