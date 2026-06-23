/** 用戶角色 */
export enum UserRole {
  ADMIN = 'admin',
  ARTISAN = 'artisan',
}

/** 訂單狀態流轉：draft → accepted → reviewing → approved/rejected → shipping → settled */
export enum OrderStatus {
  DRAFT = 'draft',
  ACCEPTED = 'accepted',
  REVIEWING = 'reviewing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SHIPPING = 'shipping',
  SETTLED = 'settled',
  CANCELLED = 'cancelled',
}

/** 送審紀錄的審核狀態 */
export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/** 分潤記錄類型 */
export enum SettlementType {
  REVENUE = 'revenue',
  SHIPPING_SUBSIDY = 'shipping_subsidy',
  DEDUCTION = 'deduction',
}

/** 寄件狀態 */
export enum ShippingStatus {
  NOT_SHIPPED = 'not_shipped',
  SHIPPED = 'shipped',
  RECEIVED = 'received',
}

/** 匯款狀態 */
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
}
