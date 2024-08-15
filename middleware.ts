import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { Database } from './types/supabase'

export async function middleware(req: NextRequest) {
  // console.log("REQUEST IN MIDDLEWARE IS : ", req)
  const res = NextResponse.next()
  // console.log("RESPONSE IN MIDDLEWARE IS : ", res)
  const supabase = createMiddlewareClient<Database>({ req, res })
  await supabase.auth.getSession()
  return res
}