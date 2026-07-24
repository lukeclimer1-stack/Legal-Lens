'use client'

import { useState } from 'react'
import { useSiteAuth } from './SiteAuthProvider'
import AboutPhotoEditor from './AboutPhotoEditor'
import WriterPhotoEditor from './WriterPhotoEditor'
import type { SiteConfig } from '@/lib/site-config-shared'

interface Writer {
  name: string
  slug: string
  photo: string
}

const CROP_KEY: Record<string, string> = {
  'luke-wilson': 'luke',
  'skyler-dias': 'skyler',
  'veen-saleh': 'veen',
  'anatalio-ubalde': 'talio',
  'camrynn-manento': 'camrynn',
}

const labelStyle: React.CSSProperties = {
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: '11px',
  letterSpacing: '2px',
  color: '#8a7340',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '6px',
}

const adminInput: React.CSSProperties = {
  backgroundColor: '#efe9dc',
  border: '1px solid #dcd3bf',
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: '15px',
  padding: '10px 12px',
  color: '#2a3142',
  boxSizing: 'border-box',
}

const navyBtn: React.CSSProperties = {
  backgroundColor: '#11203b',
  color: '#f1ecdf',
  fontSize: '14px',
  letterSpacing: '1px',
  padding: '13px 30px',
  borderRadius: '2px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: '"Courier New", Courier, monospace',
}

export default function ManageWebsitePanel({ writers, siteConfig }: { writers: Writer[]; siteConfig: SiteConfig }) {
  const { authed, login } = useSiteAuth()
  const [input, setInput] = useState('')

  if (!authed) {
    return (
      <div style={{ maxWidth: '380px', margin: '0 auto', padding: '100px 28px', textAlign: 'center' }}>
        <p style={labelStyle}>Staff Access</p>
        <h1 style={{ fontSize: '28px', color: '#11203b', marginBottom: '28px', fontFamily: '"Times New Roman", Times, serif' }}>
          Manage Website
        </h1>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (!login(input)) alert('Incorrect password.')
              setInput('')
            }
          }}
          placeholder="Password"
          style={{ ...adminInput, width: '100%', marginBottom: '12px', display: 'block' }}
        />
        <button
          onClick={() => {
            if (!login(input)) alert('Incorrect password.')
            setInput('')
          }}
          style={navyBtn}
        >
          Enter
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '50px 28px 70px' }} className="pagein">
      <h1 style={{ fontSize: '40px', color: '#11203b', margin: '0 0 6px 0', fontWeight: 'bold', textAlign: 'center', fontFamily: '"Times New Roman", Times, serif' }}>
        Manage Website
      </h1>
      <p style={{ textAlign: 'center', fontFamily: '"Courier New", Courier, monospace', fontSize: '11px', letterSpacing: '1px', color: '#8a7340', margin: '0 0 44px 0' }}>
        PHOTO ADJUSTMENTS SAVE AUTOMATICALLY FOR ALL VISITORS
      </p>

      {/* About Page Photo */}
      <div style={{ borderTop: '2px solid #11203b', paddingTop: '32px', marginBottom: '52px' }}>
        <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '12px', letterSpacing: '3px', color: '#b08a42', textTransform: 'uppercase', marginBottom: '24px' }}>
          About Page — Luke&apos;s Photo
        </div>
        <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <AboutPhotoEditor initialConfig={siteConfig} alwaysEditable />
        </div>
      </div>

      {/* Writer Photos */}
      <div style={{ borderTop: '2px solid #11203b', paddingTop: '32px' }}>
        <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '12px', letterSpacing: '3px', color: '#b08a42', textTransform: 'uppercase', marginBottom: '30px' }}>
          Writer Photos
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '40px' }}>
          {writers.map((w) => (
            <div key={w.slug}>
              <WriterPhotoEditor
                cropKey={CROP_KEY[w.slug] || w.slug}
                photo={w.photo}
                name={w.name}
                initialConfig={siteConfig}
                alwaysEditable
              />
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#11203b', marginTop: '12px' }}>{w.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
