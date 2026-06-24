/** 管理員停用/啟用職人帳號 */
export default defineEventHandler(async (event) => {
  const { supabase } = await requireAdmin(event)

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
