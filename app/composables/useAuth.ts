import type { ProfileDTO } from '~/types/dto'
import { UserRole } from '~/types'

/** 登入模式：正式版用 phone（SMS OTP），開發/測試用 email（Email OTP） */
const AUTH_MODE: 'phone' | 'email' = 'email'

/** 登入/登出/角色判斷/當前用戶 */
export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const authMode = AUTH_MODE

  const profile = useState<{
    id: string
    name: string
    phone: string
    role: UserRole
    isActive: boolean
  } | null>('auth-profile', () => null)

  const isAdmin = computed(() => profile.value?.role === UserRole.ADMIN)
  const isArtisan = computed(() => profile.value?.role === UserRole.ARTISAN)
  const isLoggedIn = computed(() => !!user.value)

  /**
   * 載入用戶 profile（有快取，同一 user 不重複請求）
   * @param force 強制重新載入（忽略快取）
   */
  async function fetchProfile(force: boolean = false) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      profile.value = null
      return
    }

    if (!force && profile.value?.id === authUser.id) {
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, phone, role, is_active')
      .eq('id', authUser.id)
      .single<ProfileDTO>()

    if (error) {
      console.error('[useAuth] fetchProfile failed:', error.message, '| user.id:', authUser.id)
      return
    }

    if (data) {
      profile.value = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        role: data.role as UserRole,
        isActive: data.is_active,
      }
    } else {
      console.warn('[useAuth] no profile found for user', authUser.id)
    }
  }

  /**
   * 發送 OTP 驗證碼
   * - email 模式：發送 6 位數 Email OTP
   * - phone 模式：發送 SMS OTP
   */
  async function sendOtp(identifier: string) {
    if (authMode === 'email') {
      const { error } = await supabase.auth.signInWithOtp({ email: identifier })
      if (error) throw error
    } else {
      const { error } = await supabase.auth.signInWithOtp({ phone: identifier })
      if (error) throw error
    }
  }

  /**
   * 驗證 OTP 並登入
   * @param identifier Email 或手機號碼
   * @param token 6 位驗證碼
   */
  async function verifyOtp(identifier: string, token: string) {
    if (authMode === 'email') {
      const { error } = await supabase.auth.verifyOtp({
        email: identifier,
        token,
        type: 'email',
      })
      if (error) throw error
    } else {
      const { error } = await supabase.auth.verifyOtp({
        phone: identifier,
        token,
        type: 'sms',
      })
      if (error) throw error
    }
    await fetchProfile()
  }

  /** 登出 */
  async function signOut() {
    await supabase.auth.signOut()
    profile.value = null
  }

  return {
    user,
    profile,
    authMode,
    isAdmin,
    isArtisan,
    isLoggedIn,
    fetchProfile,
    sendOtp,
    verifyOtp,
    signOut,
  }
}
