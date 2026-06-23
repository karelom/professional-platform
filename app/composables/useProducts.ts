import type { ProductDTO } from '~/types/dto'
import type { Product, InstructionItem } from '~/types'

/** 商品講義模板 CRUD（管理員用） */
export function useProducts() {
  const supabase = useSupabaseClient()

  /** 取得所有商品模板 */
  async function fetchProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .returns<ProductDTO[]>()

    if (error) throw error
    return (data ?? []).map((d) => snakeToCamel<Product>(d))
  }

  /** 取得單一商品模板 */
  async function fetchProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single<ProductDTO>()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return snakeToCamel<Product>(data)
  }

  /** 新增商品模板 */
  async function createProduct(input: {
    name: string
    emoji?: string
    tags?: string[]
    steps?: InstructionItem[]
    notes?: InstructionItem[]
    quality?: InstructionItem[]
  }): Promise<Product> {
    const row = {
      name: input.name,
      emoji: input.emoji || null,
      tags: input.tags ?? [],
      steps: input.steps ?? [],
      notes: input.notes ?? [],
      quality: input.quality ?? [],
    }
    const { data, error } = await supabase
      .from('products')
      .insert(row as never)
      .select('*')
      .single<ProductDTO>()

    if (error) throw error
    return snakeToCamel<Product>(data)
  }

  /** 更新商品模板 */
  async function updateProduct(
    id: string,
    input: {
      name?: string
      emoji?: string | null
      tags?: string[]
      steps?: InstructionItem[]
      notes?: InstructionItem[]
      quality?: InstructionItem[]
    },
  ): Promise<Product> {
    const row = {
      name: input.name,
      emoji: input.emoji,
      tags: input.tags,
      steps: input.steps,
      notes: input.notes,
      quality: input.quality,
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('products')
      .update(row as never)
      .eq('id', id)
      .select('*')
      .single<ProductDTO>()

    if (error) throw error
    return snakeToCamel<Product>(data)
  }

  /** 刪除商品模板 */
  async function deleteProduct(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no database.types.ts, delete() needs cast
    const { error } = await (supabase.from('products') as any).delete().eq('id', id)

    if (error) throw error
  }

  return {
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
