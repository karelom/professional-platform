import type { H3Event } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { UserRole } from '~/types'

/** 驗證請求者為已登入的管理員，回傳 service_role client */
export async function requireAdmin(event: H3Event) {
  const jwtUser = await serverSupabaseUser(event)
  if (!jwtUser) throw createError({ statusCode: 401, message: '未登入' })

  // serverSupabaseUser 回傳 JWT payload，user ID 在 sub 欄位
  const userId = (jwtUser as { sub: string }).sub
  const supabase = serverSupabaseServiceRole(event)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single<{ role: string }>()

  if (profile?.role !== UserRole.ADMIN) {
    throw createError({ statusCode: 403, message: '權限不足' })
  }

  return { userId, supabase }
}
