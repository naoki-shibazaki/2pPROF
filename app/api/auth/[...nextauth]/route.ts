import { handlers } from '@/auth'
import { initSchema } from '@/lib/db'
import type { NextRequest } from 'next/server'

let initialized = false
async function ensureInit() {
  if (!initialized) {
    await initSchema()
    initialized = true
  }
}

export async function GET(req: NextRequest) {
  await ensureInit()
  return handlers.GET(req)
}

export async function POST(req: NextRequest) {
  await ensureInit()
  return handlers.POST(req)
}
