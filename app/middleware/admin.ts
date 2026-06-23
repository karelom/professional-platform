/** 路由 middleware：非管理員顯示提示後導回首頁（profile 保證已被 auth.global 載入） */
export default defineNuxtRouteMiddleware(() => {
  const { isAdmin } = useAuth()
  const { denyWith } = useGuard()

  if (!isAdmin.value) {
    return denyWith('您沒有管理員權限，將返回首頁。')
  }
})
