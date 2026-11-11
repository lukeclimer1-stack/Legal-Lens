import { promises as fs } from 'fs'
import path from 'path'

export interface GlossaryEntry {
  /** The term as shown on the Glossary page. */
  term: string
  /** Every spelling of the term to look for in article text (plural, past tense, etc.). */
  match: string[]
  /** Plain-English definition. */
  definition: string
}

const filePath = path.join(process.cwd(), 'content', 'glossary.json')

// The glossary lives in content/glossary.json. Add an entry there and it shows up
// on the Glossary page and becomes tappable in every article the next time the site builds.
export async function getGlossary(): Promise<GlossaryEntry[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(filePath, 'utf-8'))
    const entries: GlossaryEntry[] = Array.isArray(parsed) ? parsed : []
    return entries
      .filter((e) => e && e.term && e.definition)
      .sort((a, b) => a.term.localeCompare(b.term))
  } catch {
    return []
  }
}

export function glossarySlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Text inside these tags is never made tappable.
const SKIP_TAGS = new Set(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'blockquote', 'script', 'style', 'code'])
const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'wbr', 'source'])

// Section headings and small labels in article bodies are written as styled <p> tags, so
// those are detected by their inline style and skipped as well.
function looksLikeHeadingOrLabel(attrs: string): boolean {
  return /font-weight\s*:\s*(700|bold)/i.test(attrs) || /text-transform\s*:\s*uppercase/i.test(attrs)
}

/**
 * Makes the first appearance of each glossary term in an article tappable.
 *
 * This runs when the page is built and only changes how the article is displayed.
 * The article's stored text in content/articles.json is never modified.
 */
export function annotateGlossaryTerms(html: string, glossary: GlossaryEntry[]): string {
  if (!html || !glossary.length) return html

  const lookup = new Map<string, GlossaryEntry>()
  for (const entry of glossary) {
    for (const m of entry.match?.length ? entry.match : [entry.term]) lookup.set(m.toLowerCase(), entry)
  }
  // Longest spellings first so "plea agreements" wins over a shorter overlapping term.
  const spellings = Array.from(lookup.keys()).sort((a, b) => b.length - a.length)
  if (!spellings.length) return html
  const pattern = new RegExp(`(?<![A-Za-z0-9-])(${spellings.map(escapeRegExp).join('|')})(?![A-Za-z0-9-])`, 'gi')

  const used = new Set<string>()
  const skipStack: string[] = []
  const parts = html.split(/(<[^>]+>)/)

  return parts
    .map((part) => {
      if (part.startsWith('<')) {
        const m = /^<\s*(\/)?\s*([a-zA-Z0-9]+)([^>]*)>$/.exec(part)
        if (!m) return part
        const closing = Boolean(m[1])
        const tag = m[2].toLowerCase()
        const attrs = m[3] || ''
        if (VOID_TAGS.has(tag) || attrs.trim().endsWith('/')) return part
        if (closing) {
          if (skipStack.length && skipStack[skipStack.length - 1] === tag) skipStack.pop()
        } else if (skipStack.length || SKIP_TAGS.has(tag) || looksLikeHeadingOrLabel(attrs)) {
          // Once inside a skipped element, track every nested tag so the matching close tag ends the skip.
          skipStack.push(tag)
        }
        return part
      }
      if (skipStack.length || !part.trim()) return part
      return part.replace(pattern, (found) => {
        const entry = lookup.get(found.toLowerCase())
        if (!entry || used.has(entry.term)) return found
        used.add(entry.term)
        return (
          `<span class="gloss" role="button" tabindex="0" aria-haspopup="dialog" ` +
          `data-term="${escapeAttr(entry.term)}" data-slug="${glossarySlug(entry.term)}" ` +
          `data-def="${escapeAttr(entry.definition)}">${found}</span>`
        )
      })
    })
    .join('')
}
