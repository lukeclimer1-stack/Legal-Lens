'use client'

import { useState, useEffect, useRef } from 'react'

interface Article {
  slug: string
  title: string
  category: string
  author: string
  date: string
  image: string
  excerpt: string
  pullQuote: string
  body: string
}

const EMPTY_ARTICLE: Omit<Article, 'slug'> = {
  title: '',
  category: '',
  author: '',
  date: '',
  image: '',
  excerpt: '',
  pullQuote: '',
  body: '',
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<Article, 'slug'> & { slug: string }>({
    slug: '',
    ...EMPTY_ARTICLE,
  })
  const [saving, setSaving] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (authed) {
      fetch('/api/articles')
        .then((r) => r.json())
        .then(setArticles)
    }
  }, [authed])

  function handleLogin() {
    if (password === 'legallens2007') {
      setAuthed(true)
    } else {
      alert('Incorrect password.')
    }
  }

  function openNew() {
    setForm({ slug: '', ...EMPTY_ARTICLE })
    setEditingIndex(null)
    setView('form')
    setTimeout(() => {
      if (bodyRef.current) bodyRef.current.innerHTML = ''
    }, 0)
  }

  function openEdit(index: number) {
    const a = articles[index]
    setForm({ ...a })
    setEditingIndex(index)
    setView('form')
    setTimeout(() => {
      if (bodyRef.current) bodyRef.current.innerHTML = a.body
    }, 0)
  }

  async function saveArticle() {
    if (!form.title.trim()) { alert('Title is required.'); return }
    setSaving(true)

    const bodyHtml = bodyRef.current?.innerHTML || ''
    const slug = form.slug || slugify(form.title)
    const article: Article = { ...form, slug, body: bodyHtml }

    let next: Article[]
    if (editingIndex !== null) {
      next = articles.map((a, i) => (i === editingIndex ? article : a))
    } else {
      next = [...articles, article]
    }

    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    })
    setArticles(next)
    setView('list')
    setSaving(false)
  }

  async function deleteArticle(index: number) {
    if (!confirm('Delete this article?')) return
    const next = articles.filter((_, i) => i !== index)
    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    })
    setArticles(next)
  }

  async function makeLead(index: number) {
    const next = [articles[index], ...articles.filter((_, i) => i !== index)]
    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    })
    setArticles(next)
  }

  function execCmd(cmd: string, value?: string) {
    document.execCommand(cmd, false, value)
    bodyRef.current?.focus()
  }

  function insertLink() {
    const url = prompt('Enter URL:')
    if (url) execCmd('createLink', url)
  }

  if (!authed) {
    return (
      <div
        style={{
          maxWidth: '380px',
          margin: '0 auto',
          padding: '100px 28px',
          textAlign: 'center',
        }}
      >
        <p style={labelStyle}>Staff Access</p>
        <h1 style={{ fontSize: '28px', color: '#11203b', marginBottom: '28px', fontFamily: '"Times New Roman", Times, serif' }}>
          Manage Articles
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Password"
          style={{ ...adminInput, width: '100%', marginBottom: '12px', display: 'block' }}
        />
        <button onClick={handleLogin} style={navyBtn}>
          Log In
        </button>
      </div>
    )
  }

  if (view === 'form') {
    return (
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '50px 28px' }}>
        <h2 style={{ fontSize: '26px', color: '#11203b', marginBottom: '28px', fontFamily: '"Times New Roman", Times, serif' }}>
          {editingIndex !== null ? 'Edit Article' : 'New Article'}
        </h2>

        {[
          { label: 'Headline', key: 'title', type: 'text' },
          { label: 'Category', key: 'category', type: 'text' },
          { label: 'Date', key: 'date', type: 'text' },
          { label: 'Author', key: 'author', type: 'text' },
          { label: 'Cover Image URL', key: 'image', type: 'text' },
        ].map(({ label, key, type }) => (
          <div key={key} style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type}
              value={(form as Record<string, string>)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{ ...adminInput, width: '100%', display: 'block' }}
            />
          </div>
        ))}

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Card Summary</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={3}
            style={{ ...adminInput, width: '100%', display: 'block', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Pull Quote</label>
          <textarea
            value={form.pullQuote}
            onChange={(e) => setForm({ ...form, pullQuote: e.target.value })}
            rows={2}
            style={{ ...adminInput, width: '100%', display: 'block', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Article Body</label>
          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '6px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'B', title: 'Bold', cmd: 'bold', style: { fontWeight: 'bold' } },
              { label: 'I', title: 'Italic', cmd: 'italic', style: { fontStyle: 'italic' } },
            ].map((btn) => (
              <button
                key={btn.cmd}
                title={btn.title}
                onMouseDown={(e) => { e.preventDefault(); execCmd(btn.cmd) }}
                style={{ ...toolbarBtn, ...btn.style }}
              >
                {btn.label}
              </button>
            ))}
            <button
              title="Add Link"
              onMouseDown={(e) => { e.preventDefault(); insertLink() }}
              style={toolbarBtn}
            >
              ⊕ Link
            </button>
            <button
              title="Remove Link"
              onMouseDown={(e) => { e.preventDefault(); execCmd('unlink') }}
              style={toolbarBtn}
            >
              ✕ Unlink
            </button>
          </div>
          <div
            ref={bodyRef}
            contentEditable
            suppressContentEditableWarning
            style={{
              ...adminInput,
              minHeight: '200px',
              width: '100%',
              display: 'block',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '16px',
              lineHeight: 1.7,
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={saveArticle} disabled={saving} style={navyBtn}>
            {saving ? 'Saving…' : 'Save Article'}
          </button>
          <button
            onClick={() => setView('list')}
            style={{ background: 'none', border: 'none', color: '#b08a42', cursor: 'pointer', fontSize: '14px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '50px 28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '26px', color: '#11203b', margin: 0, fontFamily: '"Times New Roman", Times, serif' }}>
          Manage Articles
        </h2>
        <button onClick={openNew} style={navyBtn}>+ New Article</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {articles.map((article, i) => (
          <div
            key={article.slug}
            style={{
              border: '1px solid #dcd3bf',
              backgroundColor: '#ffffff',
              padding: '18px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                {i === 0 && (
                  <span style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '9px',
                    backgroundColor: '#c9a44e',
                    color: '#11203b',
                    padding: '2px 7px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Lead
                  </span>
                )}
                <span style={{
                  fontSize: '18px',
                  color: '#11203b',
                  fontWeight: 'bold',
                  fontFamily: '"Times New Roman", Times, serif',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {article.title}
                </span>
              </div>
              <p style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '11px',
                letterSpacing: '1px',
                color: '#8a7340',
                textTransform: 'uppercase',
                margin: 0,
              }}>
                {article.category} · {article.author} · {article.date}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              {i !== 0 && (
                <button onClick={() => makeLead(i)} style={ghostBtn}>Make Lead</button>
              )}
              <button onClick={() => openEdit(i)} style={{ ...ghostBtn, borderColor: '#b08a42' }}>Edit</button>
              <button
                onClick={() => deleteArticle(i)}
                style={{ ...ghostBtn, borderColor: '#e3c9c4', color: '#a23b2e' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
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

const ghostBtn: React.CSSProperties = {
  background: 'none',
  border: '1px solid #dcd3bf',
  color: '#11203b',
  fontSize: '13px',
  padding: '6px 14px',
  cursor: 'pointer',
  fontFamily: '"Courier New", Courier, monospace',
}

const toolbarBtn: React.CSSProperties = {
  background: '#efe9dc',
  border: '1px solid #dcd3bf',
  color: '#11203b',
  fontSize: '13px',
  padding: '4px 12px',
  cursor: 'pointer',
  fontFamily: '"Courier New", Courier, monospace',
}
