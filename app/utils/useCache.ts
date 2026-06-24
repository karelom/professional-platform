/**
 * 通用列表快取，基於 useState 跨組件共享。
 * @param key - useState 的唯一 key
 * @param fetcher - 實際打 API 取資料的函數
 */
export function useCache<T>(key: string, fetcher: () => Promise<T[]>) {
  const cache = useState<{ data: T[]; loaded: boolean }>(key, () => ({
    data: [],
    loaded: false,
  }))

  /** 有快取直接回傳，沒有才打 API */
  async function fetch(): Promise<T[]> {
    if (cache.value.loaded) return cache.value.data
    return refresh()
  }

  /** 強制重打 API + 更新快取 */
  async function refresh(): Promise<T[]> {
    const result = await fetcher()
    cache.value = { data: result, loaded: true }
    return result
  }

  /** 標記快取失效，下次 fetch 會重打 */
  function invalidate() {
    cache.value.loaded = false
  }

  return {
    data: computed(() => cache.value.data),
    fetch,
    refresh,
    invalidate,
  }
}
