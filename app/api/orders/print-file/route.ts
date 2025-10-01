import { NextRequest, NextResponse } from 'next/server'
import { PrintFileService } from '@/lib/services/printFileService'

export async function POST(request: NextRequest) {
  try {
    const { orderId, product, designs, customerName, format = 'zip' } = await request.json()

    if (!orderId || !product || !designs || designs.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, product, and designs' },
        { status: 400 }
      )
    }

    // Generate print file and get buffer
    const { buffer, filename } = await PrintFileService.generatePrintFileBuffer({
      product,
      designs,
      orderId,
      customerName,
      includeIndividualElements: true,
      includeMockups: true,
      format: format as 'pdf' | 'zip',
    })

    // Return the file as a response
    const headers = new Headers()
    headers.set('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/zip')
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)

    return new Response(buffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Error generating print file:', error)
    return NextResponse.json(
      { error: 'Failed to generate print file' },
      { status: 500 }
    )
  }
}