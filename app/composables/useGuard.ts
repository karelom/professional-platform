/**
 * 帶原因說明的路由守衛
 * 在轉導前顯示彈窗告知使用者原因，確認後再跳轉。
 * 用於 middleware 和頁面內的權限檢查。
 *
 * @example
 * // 在 middleware 中
 * const { denyWith } = useGuard()
 * if (!isAdmin.value) return denyWith('您沒有管理員權限', '/')
 *
 * @example
 * // 在頁面中
 * const { denyWith } = useGuard()
 * denyWith('此訂單不屬於您', '/scan')
 */
export function useGuard() {
  /**
   * 顯示原因彈窗後轉導到指定頁面
   * @param reason 顯示給使用者的原因說明
   * @param redirectTo 轉導目標路由（預設 '/'）
   */
  function denyWith(reason: string, redirectTo: string = '/') {
    if (import.meta.client) {
      alert(reason)
    }
    return navigateTo(redirectTo)
  }

  return { denyWith }
}
