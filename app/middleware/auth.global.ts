/**
 * 全域 middleware：
 * 1. 未登入 → /login
 * 2. 已登入 → 唯一載入 profile 的地方（其他檔案只讀不載）
 * 3. session 無效 → 登出 + 跳 /login
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const { profile, fetchProfile, signOut } = useAuth()
  const { denyWith } = useGuard()
  const publicPages = ['/login', '/confirm']

  if (!user.value && !publicPages.includes(to.path)) {
    return denyWith('請先登入', '/login')
  }

  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }

  if (user.value && !profile.value) {
    await fetchProfile()

    if (!profile.value) {
      await signOut()
      return denyWith('帳號資料異常，請重新登入', '/login')
    }
  }
})
