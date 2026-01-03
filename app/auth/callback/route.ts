import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  // If we're on localhost but have a code, redirect to production
  if (requestUrl.hostname === 'localhost' && code) {
    const productionUrl = new URL(
      `/auth/callback?code=${code}${next !== '/' ? `&next=${next}` : ''}`,
      'https://takedatomoki2005-testapplication.vercel.app'
    )
    return NextResponse.redirect(productionUrl.toString())
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle error
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Handle error
            }
          },
        },
      }
    )

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin).toString())
    }
  }

  // If there's an error or no code, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin).toString())
}

