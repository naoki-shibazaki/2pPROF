import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { redirect } from 'next/navigation'
import HomeClient from '@/components/HomeClient'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>
}) {
  const params = await searchParams
  if (params.demo === '1') {
    return <HomeClient demo />
  }

  const session = await auth()
  if (!session?.user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id
  const rows = await sql`SELECT onboarded FROM users WHERE id = ${userId}`

  if (!rows[0]?.onboarded) redirect('/onboarding')

  return <HomeClient />
}
