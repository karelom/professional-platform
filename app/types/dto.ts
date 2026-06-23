/**
 * 資料庫 DTO 定義
 * 鏡像 Supabase 回傳的 snake_case 結構，runtime 不直接使用。
 * 前端統一使用 types/index.ts 的 camelCase Model。
 */

/** 講義步驟項目（steps / notes / quality 共用） */
export interface InstructionItemDTO {
  title: string
}

/** 用戶資料（對應 profiles 表） */
export interface ProfileDTO {
  id: string
  phone: string
  name: string
  role: string
  is_active: boolean
  created_at: string
}

/** 商品講義模板（對應 products 表） */
export interface ProductDTO {
  id: string
  name: string
  emoji: string | null
  tags: string[]
  steps: InstructionItemDTO[]
  notes: InstructionItemDTO[]
  quality: InstructionItemDTO[]
  created_at: string
  updated_at: string
}

/** 訂單（對應 orders 表，含從模板複製的講義） */
export interface OrderDTO {
  id: string
  product_id: string
  product_name: string
  product_emoji: string | null
  product_tags: string[]
  artisan_id: string
  qty: number
  unit_price: number
  deadline: string
  status: string
  steps: InstructionItemDTO[]
  notes: InstructionItemDTO[]
  quality: InstructionItemDTO[]
  admin_notes: string
  cancel_reason: string | null
  cancelled_at: string | null
  cancelled_by: string | null
  created_at: string
  updated_at: string
}

/** 送審紀錄（對應 submissions 表，一筆訂單可有多次送審） */
export interface SubmissionDTO {
  id: string
  order_id: string
  artisan_id: string
  photos: string[]
  notes: string
  review_status: string
  review_note: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  submitted_at: string
}

/** 分潤/金流記錄（對應 settlements 表） */
export interface SettlementDTO {
  id: string
  artisan_id: string
  order_id: string | null
  amount: number
  type: string
  shipping_status: string
  payment_status: string
  note: string
  date: string
  created_at: string
}

/** App 內通知（對應 notifications 表） */
export interface NotificationDTO {
  id: string
  user_id: string
  title: string
  body: string
  link: string | null
  is_read: boolean
  created_at: string
}
