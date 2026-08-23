import { NextResponse } from 'next/server'
import { convert, getUnit } from '@/lib/conversion/engine'
import type { ConvertRequest, ConvertResult } from '@/types/conversion'

interface ConvertRequestBody {
  value?: unknown
  from?: unknown
  to?: unknown
}

function isConvertRequest(body: unknown): body is ConvertRequest {
  if (typeof body !== 'object' || body === null) {
    return false
  }
  const { value, from, to } = body as ConvertRequestBody
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    typeof from === 'string' &&
    from.length > 0 &&
    typeof to === 'string' &&
    to.length > 0
  )
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid JSON body', 400)
  }

  if (!isConvertRequest(body)) {
    return errorResponse('Request must include a numeric value and non-empty from/to units', 400)
  }

  let result: number
  let targetSymbol: string
  try {
    result = convert(body.value, body.from, body.to)
    targetSymbol = getUnit(body.to).symbol
  } catch {
    return errorResponse('Unknown unit', 400)
  }

  const payload: ConvertResult = {
    value: result,
    from: body.from,
    to: body.to,
    unit: targetSymbol,
  }
  return NextResponse.json(payload)
}
