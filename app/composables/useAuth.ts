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

  function applyProfile(dto: ProfileDTO) {
    profile.value = {
      id: dto.id,
      name: dto.name,
      phone: dto.phone,
      role: dto.role as UserRole,
      isActive: dto.is_active,
    }
  }

  async function fetchProfileBySession(force: boolean = false) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      profile.value = null
      return
    }

    if (!force && profile.value?.id === session.user.id) {
      return
    }

    const dto = await $fetch<ProfileDTO>('/api/auth/profile', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    applyProfile(dto)
  }

  /**
   * 發送 OTP 驗證碼
   * - email 模式：發送 6 位數 Email OTP
   * - phone 模式：發送 SMS OTP
   */
  async function sendOtp(identifier: string) {
    const payload = authMode === 'email' ? { email: identifier } : { phone: identifier }
    const { error } = await supabase.auth.signInWithOtp(payload)
    if (error) throw error
  }

  async function verifyOtp(identifier: string, token: string) {
    const payload =
      authMode === 'email'
        ? { email: identifier, token, type: 'email' as const }
        : { phone: identifier, token, type: 'sms' as const }
    const { data, error } = await supabase.auth.verifyOtp(payload)
    if (error) throw error

    if (data.session) {
      const dto = await $fetch<ProfileDTO>('/api/auth/profile', {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      })
      applyProfile(dto)
    }
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
    fetchProfileBySession,
    sendOtp,
    verifyOtp,
    signOut,
  }
}
