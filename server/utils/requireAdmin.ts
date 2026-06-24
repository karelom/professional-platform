import type { H3Event } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

/** 驗證請求者為已登入的管理員，回傳 service_role client */
export async function requireAdmin(event: H3Event) {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: '未登入' })

  const supabase = serverSupabaseServiceRole(event)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>()

  if (profile?.role !== 'admin') {
    throw createError({ statusCode: 403, message: '權限不足' })
  }

  return { user, supabase }
}
