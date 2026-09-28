import { sql } from '@/lib/db'

export type Plan = 'free' | 'lite' | 'premium'

export const LIMITS = {
  free:    { questions: 5, intros: 3 },
  lite:    { questions: Infinity, intros: Infinity },
  premium: { questions: Infinity, intros: Infinity },
}

export async function getUserPlan(userId: string): Promise<Plan> {
  const rows = await sql`SELECT plan FROM users WHERE id = ${userId}::uuid`
  const plan = rows[0]?.plan
  if (plan === 'lite' || plan === 'premium') return plan
  return 'free'
}
