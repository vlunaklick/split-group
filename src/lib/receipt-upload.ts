const MAX_RECEIPT_BYTES = 4 * 1024 * 1024

export const ALLOWED_RECEIPT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf'
])

export function validateReceiptFile (file: File) {
  if (!ALLOWED_RECEIPT_TYPES.has(file.type)) {
    return 'Solo imágenes (JPG, PNG, WebP, GIF) o PDF'
  }

  if (file.size > MAX_RECEIPT_BYTES) {
    return 'El archivo no puede superar 4 MB'
  }

  return null
}

export function sanitizeReceiptFilename (name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'comprobante'
}
