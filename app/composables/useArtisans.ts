import type { ProfileDTO, SubmissionDTO } from '~/types/dto'
import type { Profile, UserRole } from '~/types'

/** 職人帳號管理（管理員用） */
export function useArtisans() {
  const supabase = useSupabaseClient()

  const cache = useCache<Profile>('artisans-cache', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'artisan')
      .order('created_at', { ascending: false })
      .returns<ProfileDTO[]>()

    if (error) throw error
    return (data ?? []).map((d) => ({
      id: d.id,
      phone: d.phone,
      name: d.name,
      role: d.role as UserRole,
      isActive: d.is_active,
      createdAt: d.created_at,
    }))
  })

  /** 新增職人帳號（透過 server API，使用 service_role） */
  async function createArtisan(input: { phone: string; name: string; email?: string }) {
    const { data, error } = await useFetch('/api/admin/create-artisan', {
      method: 'POST',
      body: input,
    })
    if (error.value) throw new Error(error.value.data?.message || '建立失敗')
    cache.invalidate()
    return data.value
  }

  /** 停用/啟用職人帳號 */
  async function toggleActive(artisanId: string, isActive: boolean) {
    const { error } = await useFetch('/api/admin/toggle-artisan', {
      method: 'POST',
      body: { artisanId, isActive },
    })
    if (error.value) throw new Error(error.value.data?.message || '操作失敗')
    cache.invalidate()
  }

  /** 取得某職人的退件率統計 */
  async function fetchArtisanStats(artisanId: string) {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('review_status')
      .eq('artisan_id', artisanId)
      .returns<Pick<SubmissionDTO, 'review_status'>[]>()

    if (error) throw error

    const total = submissions?.length ?? 0
    const rejected = submissions?.filter((s) => s.review_status === 'rejected').length ?? 0
    const approved = submissions?.filter((s) => s.review_status === 'approved').length ?? 0

    return {
      totalSubmissions: total,
      rejectedCount: rejected,
      approvedCount: approved,
      rejectionRate: total > 0 ? Math.round((rejected / total) * 100) : 0,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    }
  }

  return {
    fetchArtisans: cache.fetch,
    refreshArtisans: cache.refresh,
    createArtisan,
    toggleActive,
    fetchArtisanStats,
  }
}
