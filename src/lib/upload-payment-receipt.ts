'use client'

import { validateReceiptFile } from '@/lib/receipt-upload'

export async function uploadPaymentReceipt (file: File) {
  const validationError = validateReceiptFile(file)

  if (validationError) {
    throw new Error(validationError)
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload/receipt', {
    method: 'POST',
    body: formData
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(typeof payload.error === 'string' ? payload.error : 'No se pudo subir el comprobante')
  }

  if (typeof payload.url !== 'string') {
    throw new Error('No se pudo subir el comprobante')
  }

  return payload.url as string
}
