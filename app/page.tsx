import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import HomeClient from '@/components/HomeClient'
import { getMe, getUnreadCounts } from '@/lib/me'

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
  // 自分のプロフィールと未読数はページと一緒に返す（画面が出てから取りに行くと、もう 1 往復待たせるため）
  const [me, counts] = await Promise.all([getMe(userId), getUnreadCounts(userId).catch(() => undefined)])

  if (!me?.onboarded) redirect('/onboarding')

  return <HomeClient initialMe={me} initialCounts={counts} />
}
