/**
 * 通用 snake_case ↔ camelCase 物件 key 轉換工具
 *
 * 用於 Supabase 回傳（snake_case）和前端 Model（camelCase）之間的轉換。
 * 支援巢狀物件和陣列的遞迴轉換。
 */

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/** 遞迴轉換物件所有 key（支援巢狀物件和陣列） */
function convertKeys(obj: unknown, converter: (key: string) => string): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeys(item, converter))
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        converter(key),
        convertKeys(value, converter),
      ]),
    )
  }
  return obj
}

/**
 * 將 snake_case key 的物件轉為 camelCase（DB → 前端）
 * @example snakeToCamel<Order>({ product_name: '書籤' }) // { productName: '書籤' }
 */
export function snakeToCamel<T>(obj: unknown): T {
  return convertKeys(obj, toCamelCase) as T
}

/**
 * 將 camelCase key 的物件轉為 snake_case（前端 → DB）
 * @example camelToSnake({ productName: '書籤' }) // { product_name: '書籤' }
 */
export function camelToSnake<T>(obj: unknown): T {
  return convertKeys(obj, toSnakeCase) as T
}
