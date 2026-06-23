import type { ProfileDTO } from '~/types/dto'
import { UserRole } from '~/types'

/** 登入模式：正式版用 phone，開發/測試用 email */
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

  /** 載入用戶 profile（登入後呼叫） */
  async function fetchProfile() {
    if (!user.value) {
      profile.value = null
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('id, name, phone, role, is_active')
      .eq('id', user.value.id)
      .single<ProfileDTO>()

    if (data) {
      profile.value = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        role: data.role as UserRole,
        isActive: data.is_active,
      }
    }
  }

  /**
   * 發送 OTP 驗證碼
   * @param identifier email 或手機號碼（依 AUTH_MODE）
   */
  async function sendOtp(identifier: string) {
    const payload = authMode === 'email' ? { email: identifier } : { phone: identifier }
    const { error } = await supabase.auth.signInWithOtp(payload)
    if (error) throw error
  }

  /**
   * 驗證 OTP 並登入
   * @param identifier email 或手機號碼
   * @param token 驗證碼
   */
  async function verifyOtp(identifier: string, token: string) {
    const payload =
      authMode === 'email'
        ? { email: identifier, token, type: 'email' as const }
        : { phone: identifier, token, type: 'sms' as const }
    const { error } = await supabase.auth.verifyOtp(payload)
    if (error) throw error
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
