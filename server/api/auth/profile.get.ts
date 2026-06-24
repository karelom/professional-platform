import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) throw createError({ statusCode: 401, message: '未登入' })

  const token = authHeader.replace('Bearer ', '')
  const supabase = serverSupabaseServiceRole(event)

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token)
  if (authError || !user) throw createError({ statusCode: 401, message: '驗證失敗' })

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, phone, role, is_active')
    .eq('id', user.id)
    .single()

  if (error || !data) throw createError({ statusCode: 404, message: '找不到用戶資料' })

  return data
})
