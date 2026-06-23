/** 路由 middleware：非管理員導回首頁 */
export default defineNuxtRouteMiddleware(() => {
  const { isAdmin } = useAuth()

  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
