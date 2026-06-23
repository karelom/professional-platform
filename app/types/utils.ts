/** 型別層級：將 snake_case 字串轉為 camelCase */
type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S

/** 型別層級：將物件所有 key 從 snake_case 轉為 camelCase */
export type CamelCaseKeys<T> = {
  [K in keyof T as SnakeToCamel<K & string>]: T[K]
}
