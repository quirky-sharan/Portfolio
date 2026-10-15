/* A playful, deterministic stand-in for a BPE tokenizer: words keep their
   leading space, long words split into sub-word pieces, punctuation is its
   own token. Good enough to *look* like the model's view of the text. */

export const TOKEN_COLORS = ['#d4f25a', '#f6b8e0', '#a9d2f5', '#f3d68c', '#c7b8ff', '#9ee6c6']

/* Parse “*emphasis*” markup into segments. */
export function parseEmphasis(text) {
  return text
    .split('*')
    .map((t, i) => ({ text: t, em: i % 2 === 1 }))
    .filter((s) => s.text)
}

function hash(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0) % 100000
}

function splitWord(tok) {
  const lead = tok.startsWith(' ') ? ' ' : ''
  const w = tok.slice(lead.length)
  if (w.length <= 7) return [tok]
  const parts = w.length > 11 ? [0.38, 0.7] : [0.55]
  const out = []
  let prev = 0
  parts.forEach((p) => {
    const cut = Math.round(w.length * p)
    out.push(w.slice(prev, cut))
    prev = cut
  })
  out.push(w.slice(prev))
  out[0] = lead + out[0]
  return out
}

export function tokenize(segments) {
  const tokens = []
  segments.forEach((seg) => {
    const pre = seg.text.match(/ ?[A-Za-z’']+| ?\d+| ?[^\sA-Za-z\d]+|\s+/g) ?? []
    pre.forEach((p) => {
      const pieces = /[A-Za-z]/.test(p) ? splitWord(p) : [p]
      pieces.forEach((text) => {
        tokens.push({ text, em: seg.em, id: hash(text), color: TOKEN_COLORS[tokens.length % TOKEN_COLORS.length] })
      })
    })
  })
  return tokens
}
