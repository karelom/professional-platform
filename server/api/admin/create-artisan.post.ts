/** 管理員建立職人帳號（需 service_role 權限） */
export default defineEventHandler(async (event) => {
  const { supabase } = await requireAdmin(event)

  const body = await readBody<{ phone: string; name: string; email?: string }>(event)

  if (!body.phone || !body.name) {
    throw createError({ statusCode: 400, message: '手機號碼和姓名為必填' })
  }

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    phone: body.phone,
    email: body.email,
    phone_confirm: true,
    email_confirm: true,
    user_metadata: { name: body.name },
  })

  if (authError) {
    throw createError({ statusCode: 400, message: authError.message })
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: authUser.user.id,
    phone: body.phone,
    name: body.name,
    role: 'artisan',
    is_active: true,
  } as never)

  if (profileError) {
    throw createError({ statusCode: 500, message: profileError.message })
  }

  return { id: authUser.user.id, phone: body.phone, name: body.name }
})
