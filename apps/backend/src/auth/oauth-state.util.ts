import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto'

function b64urlEncode(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function b64urlDecode(s: string): Buffer {
  const pad = 4 - (s.length % 4 || 4)
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad)
  return Buffer.from(base64, 'base64')
}

function deriveKey(secret: string): Buffer {
  return createHash('sha256').update(secret).digest()
}

export function encryptState(
  payload: Record<string, unknown>,
  secret: string,
): string {
  const iv = randomBytes(12)
  const key = deriveKey(secret)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const plaintext = Buffer.from(JSON.stringify(payload))
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()])
  const tag = cipher.getAuthTag()
  // Pack as iv(12) | tag(16) | ciphertext
  return b64urlEncode(Buffer.concat([iv, tag, ciphertext]))
}

export function decryptState<T = any>(token: string, secret: string): T | null {
  try {
    const packed = b64urlDecode(token)
    const iv = packed.subarray(0, 12)
    const tag = packed.subarray(12, 28)
    const ciphertext = packed.subarray(28)
    const key = deriveKey(secret)
    const decipher = createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ])
    return JSON.parse(plaintext.toString('utf8')) as T
  } catch {
    return null
  }
}

export function safeReturnTo(
  raw: string | undefined,
  redirectBase: string,
): string | null {
  if (!raw) return null
  // 길이 제한 + 제어문자/공백 차단
  if (raw.length > 1024 || /[\s\u0000-\u001F\u007F]/.test(raw)) return null

  let s = raw
  try {
    s = decodeURIComponent(raw)
  } catch {}

  // 절대 URL/스킴 상대(URL 시작 //) 차단 + 반드시 / 로 시작
  if (s.startsWith('http://') || s.startsWith('https://')) return null
  if (s.startsWith('//')) return null
  if (!s.startsWith('/')) return null

  // 경로 정규화 + origin 고정
  const base = new URL(redirectBase)
  const url = new URL(s, base) // base에 대한 상대경로로만 파싱
  if (url.origin !== base.origin) return null // 다른 호스트로 새는 것 방지

  return url.pathname + url.search + url.hash
}
