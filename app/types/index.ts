/**
 * 前端 Model 定義
 * 從 DTO 透過 CamelCaseKeys 自動衍生 camelCase 版本，
 * 只需 override enum 欄位和 JOIN 擴充。
 * 頁面和組件統一 import from '~/types'。
 */

import type { CamelCaseKeys } from './utils'
import type {
  ProfileDTO,
  ProductDTO,
  OrderDTO,
  SubmissionDTO,
  SettlementDTO,
  NotificationDTO,
} from './dto'
import {
  OrderStatus,
  ReviewStatus,
  UserRole,
  SettlementType,
  ShippingStatus,
  PaymentStatus,
} from './enums'

export * from './enums'
export type { CamelCaseKeys } from './utils'
export type { InstructionItemDTO as InstructionItem } from './dto'

/** 用戶（override role 為 UserRole enum） */
export type Profile = Omit<CamelCaseKeys<ProfileDTO>, 'role'> & {
  role: UserRole
}

/** 商品講義模板（完全自動衍生） */
export type Product = CamelCaseKeys<ProductDTO>

/** 訂單（override status 為 OrderStatus enum，擴充 JOIN 欄位） */
export type Order = Omit<CamelCaseKeys<OrderDTO>, 'status'> & {
  status: OrderStatus
  artisan?: Profile
}

/** 送審紀錄（override reviewStatus 為 ReviewStatus enum，擴充 JOIN 欄位） */
export type Submission = Omit<CamelCaseKeys<SubmissionDTO>, 'reviewStatus'> & {
  reviewStatus: ReviewStatus
  artisan?: Profile
}

/** 分潤記錄（override 三個 enum 欄位） */
export type Settlement = Omit<CamelCaseKeys<SettlementDTO>, 'type' | 'shippingStatus' | 'paymentStatus'> & {
  type: SettlementType
  shippingStatus: ShippingStatus
  paymentStatus: PaymentStatus
}

/** App 內通知（完全自動衍生） */
export type AppNotification = CamelCaseKeys<NotificationDTO>

/** 每個狀態允許轉換到的下一個狀態 */
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.DRAFT]: [OrderStatus.ACCEPTED, OrderStatus.CANCELLED],
  [OrderStatus.ACCEPTED]: [OrderStatus.REVIEWING, OrderStatus.CANCELLED],
  [OrderStatus.REVIEWING]: [OrderStatus.APPROVED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  [OrderStatus.APPROVED]: [OrderStatus.SHIPPING, OrderStatus.CANCELLED],
  [OrderStatus.REJECTED]: [OrderStatus.REVIEWING, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPING]: [OrderStatus.SETTLED, OrderStatus.CANCELLED],
  [OrderStatus.SETTLED]: [],
  [OrderStatus.CANCELLED]: [],
}

/** 允許換人 / 修改訂單內容的狀態 */
export const EDITABLE_STATUSES: OrderStatus[] = [
  OrderStatus.DRAFT,
  OrderStatus.ACCEPTED,
  OrderStatus.REJECTED,
]
