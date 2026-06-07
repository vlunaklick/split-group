import { sanitizeReceiptFilename, validateReceiptFile } from '@/lib/receipt-upload'
import { requireSession, toAuthResponse } from '@/lib/server-auth'
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  try {
    const { userId } = await requireSession()

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Subida de archivos no configurada. Pegá un link al comprobante.' },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
    }

    const validationError = validateReceiptFile(file)

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const filename = sanitizeReceiptFilename(file.name)
    const pathname = `receipts/${userId}/${Date.now()}-${filename}`

    const blob = await put(pathname, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    const response = toAuthResponse(error)

    if (response) return response

    console.error(error)
    return NextResponse.json({ error: 'No se pudo subir el comprobante' }, { status: 500 })
  }
}
