'use client'

import { useState, useEffect, useRef } from 'react'
import { DEFAULT_ADMIN_PASSWORD } from '@/lib/auth'

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
  imageCrop?: { x: number; y: number }
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
  const [passwordInput, setPasswordInput] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<Article, 'slug'> & { slug: string }>({
    slug: '',
    ...EMPTY_ARTICLE,
  })
  const [saving, setSaving] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const cropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (authed) {
      fetch('/api/articles')
        .then((r) => r.json())
        .then(setArticles)
    }
  }, [authed])

  function handleLogin() {
    if (passwordInput === DEFAULT_ADMIN_PASSWORD) {
      setPassword(passwordInput)
      setAuthed(true)
    } else {
      alert('Incorrect password.')
    }
  }

  async function persist(next: Article[]) {
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(next),
    })
    if (!res.ok) {
      alert('Could not save — your session may have expired. Please log in again.')
      return false
    }
    return true
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
    if (!article.image) delete article.imageCrop

    let next: Article[]
    if (editingIndex !== null) {
      next = articles.map((a, i) => (i === editingIndex ? article : a))
    } else {
      next = [...articles, article]
    }

    const ok = await persist(next)
    if (ok) {
      setArticles(next)
      setView('list')
    }
    setSaving(false)
  }

  async function deleteArticle(index: number) {
    if (!confirm('Delete this article?')) return
    const next = articles.filter((_, i) => i !== index)
    if (await persist(next)) setArticles(next)
  }

  async function makeLead(index: number) {
    const next = [articles[index], ...articles.filter((_, i) => i !== index)]
    if (await persist(next)) setArticles(next)
  }

  function execCmd(cmd: string, value?: string) {
    document.execCommand(cmd, false, value)
    bodyRef.current?.focus()
  }

  function insertLink() {
    const url = prompt('Enter URL:')
    if (url) execCmd('createLink', url)
  }

  function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm((f) => ({ ...f, image: String(ev.target?.result || '') }))
    reader.readAsDataURL(file)
  }

  function onCropDrag(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault()
    const el = cropRef.current
    if (!el) return
    const update = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect()
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
      setForm((f) => ({ ...f, imageCrop: { x, y } }))
    }
    update(e.clientX, e.clientY)
    const move = (ev: PointerEvent) => update(ev.clientX, ev.clientY)
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
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
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
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
    const crop = form.imageCrop || { x: 50, y: 50 }
    return (
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '50px 28px' }}>
        <h2 style={{ fontSize: '26px', color: '#11203b', marginBottom: '28px', fontFamily: '"Times New Roman", Times, serif' }}>
          {editingIndex !== null ? 'Edit Article' : 'New Article'}
        </h2>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Headline</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ ...adminInput, width: '100%', display: 'block', fontSize: '17px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>
              Category <span style={{ textTransform: 'none', color: '#9a8d6e', fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>— separate multiple with a comma</span>
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Constitutional Law, First Amendment"
              style={{ ...adminInput, width: '100%', display: 'block' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Date label</label>
            <input
              type="text"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="e.g. Jun 18"
              style={{ ...adminInput, width: '100%', display: 'block' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Author</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            style={{ ...adminInput, width: '100%', display: 'block' }}
          />
        </div>

        <label style={labelStyle}>Cover image <span style={{ textTransform: 'none', color: '#9a8d6e' }}>(optional)</span></label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: '#11203b',
              color: '#f1ecdf',
              fontFamily: '"Courier New",monospace',
              fontSize: '11px',
              letterSpacing: '1px',
              padding: '9px 16px',
              borderRadius: '2px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ↑ Upload photo
            <input type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} />
          </label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="…or paste an image URL"
            style={{ ...adminInput, flex: 1, minWidth: '160px' }}
          />
        </div>

        {form.image ? (
          <>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  height: '60px',
                  width: '90px',
                  backgroundImage: `url("${form.image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid #dcd3bf',
                  borderRadius: '2px',
                  backgroundColor: '#e8e2d4',
                }}
              />
              <div
                onClick={() => setForm((f) => ({ ...f, image: '', imageCrop: undefined }))}
                style={{ fontFamily: '"Courier New",monospace', fontSize: '10px', letterSpacing: '1px', color: '#a23b2e', cursor: 'pointer', textTransform: 'uppercase' }}
              >
                ✕ Remove
              </div>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>
                Focal point <span style={{ textTransform: 'none', color: '#9a8d6e', fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>— drag to reposition the crop focus</span>
              </label>
              <div
                ref={cropRef}
                onPointerDown={onCropDrag}
                style={{
                  width: '100%',
                  height: '210px',
                  backgroundColor: '#e8e2d4',
                  backgroundImage: `url("${form.image}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: `${crop.x}% ${crop.y}%`,
                  cursor: 'crosshair',
                  border: '1px solid #dcd3bf',
                  position: 'relative',
                  overflow: 'hidden',
                  userSelect: 'none',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `${crop.x}%`,
                    top: `${crop.y}%`,
                    transform: 'translate(-50%,-50%)',
                    width: '20px',
                    height: '20px',
                    border: '2.5px solid #fff',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 1.5px rgba(0,0,0,0.55)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              <div style={{ fontFamily: '"Courier New",monospace', fontSize: '9px', letterSpacing: '1px', color: '#aaa', marginTop: '5px' }}>
                The white circle marks the focal point — it stays centred when the image is cropped on cards.
              </div>
            </div>
          </>
        ) : (
          <div style={{ marginBottom: '18px' }} />
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Card summary <span style={{ textTransform: 'none', color: '#9a8d6e' }}>(one sentence shown on the preview card)</span></label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
            placeholder="A one-sentence teaser"
            style={{ ...adminInput, width: '100%', display: 'block', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Pull quote <span style={{ textTransform: 'none', color: '#9a8d6e' }}>(optional — embed it inline in the body where it naturally comes up)</span></label>
          <input
            type="text"
            value={form.pullQuote}
            onChange={(e) => setForm({ ...form, pullQuote: e.target.value })}
            placeholder="An optional highlighted quote"
            style={{ ...adminInput, width: '100%', display: 'block' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Article Body <span style={{ textTransform: 'none', color: '#9a8d6e', fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>— select text, then click a tool</span></label>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <button
              title="Bold"
              onMouseDown={(e) => { e.preventDefault(); execCmd('bold') }}
              style={{ ...toolbarBtn, fontWeight: 700, fontSize: '14px', fontFamily: 'Georgia,serif', width: '32px', height: '28px' }}
            >
              B
            </button>
            <button
              title="Italic"
              onMouseDown={(e) => { e.preventDefault(); execCmd('italic') }}
              style={{ ...toolbarBtn, fontStyle: 'italic', fontSize: '14px', fontFamily: 'Georgia,serif', width: '32px', height: '28px' }}
            >
              I
            </button>
            <button
              title="Wrap selection in a link"
              onMouseDown={(e) => { e.preventDefault(); insertLink() }}
              style={{ ...toolbarBtn, fontSize: '11px', padding: '0 11px', height: '28px', letterSpacing: '0.5px' }}
            >
              ⊕ Link
            </button>
            <button
              title="Remove link from selection"
              onMouseDown={(e) => { e.preventDefault(); execCmd('unlink') }}
              style={{ ...toolbarBtn, fontSize: '11px', padding: '0 11px', height: '28px', color: '#8a7340', letterSpacing: '0.5px' }}
            >
              ✕ Unlink
            </button>
          </div>
          <div
            ref={bodyRef}
            contentEditable
            suppressContentEditableWarning
            style={{
              minHeight: '320px',
              padding: '18px 20px',
              border: '1px solid #dcd3bf',
              background: '#fff',
              fontSize: '16px',
              lineHeight: 1.85,
              color: '#2a3142',
              outline: 'none',
              fontFamily: 'Georgia,"Times New Roman",serif',
            }}
          />
          <div style={{ padding: '6px 10px', background: '#faf7f0', border: '1px solid #dcd3bf', borderTop: 'none', fontFamily: '"Courier New",monospace', fontSize: '10px', letterSpacing: '0.5px', color: '#aaa' }}>
            Press Enter for a new paragraph · Select text then click B, I, or ⊕ Link above
          </div>
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
