import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

/** 管理員停用/啟用職人帳號 */
export default defineEventHandler(async (event) => {
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

  const body = await readBody<{ artisanId: string; isActive: boolean }>(event)

  if (!body.artisanId) {
    throw createError({ statusCode: 400, message: '缺少 artisanId' })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ is_active: body.isActive } as never)
    .eq('id', body.artisanId)
    .eq('role', 'artisan')

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
