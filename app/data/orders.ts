export interface OrderDetail {
  id: string
  name: string
  emoji: string
  qty: number
  unitPrice: number
  deadline: string
  tags: string[]
  steps: { title: string }[]
  stepsNote: string
  notes: string[]
  qualityStandards: string[]
}

export const orders: Record<string, OrderDetail> = {
  'HY-2026-0714': {
    id: 'HY-2026-0714',
    name: '台灣藍鵲押花書籤',
    emoji: '🌸',
    qty: 10,
    unitPrice: 85,
    deadline: '2026 年 7 月 15 日',
    tags: ['押花工藝', '代表台灣'],
    steps: [
      { title: '將花材依照設計圖稿排列於書籤底板，藍鵲圖樣置於右側 1/3 處' },
      { title: '使用白膠薄塗，確保每片花材平整固定，等待完全乾燥（約 30 分鐘）' },
      { title: '覆上護貝膜，由中間往兩側刮除氣泡，邊緣留白 2mm' },
      { title: '裁切至標準尺寸（85mm × 210mm），角落使用圓角切刀' },
    ],
    stepsNote: '設計稿已附於訂單袋中，色彩比例請嚴格按照樣本',
    notes: [
      '花材需完全乾燥後才可開始製作，避免發霉',
      '護貝膜請使用附贈的專用膜，不可自行替換',
      '每批次完成後請自行品檢，不合格品請勿送審',
      '如遇花材不足，請立即聯繫基地補寄',
    ],
    qualityStandards: [
      '花材排列需與設計稿一致，偏差不超過 2mm',
      '護貝膜內不可有可見氣泡',
      '書籤邊緣平整，無毛邊或裂痕',
      '整體色彩飽和度需與樣本照片一致',
      '尺寸誤差不超過 ±1mm',
    ],
  },
}

export const defaultOrderId = 'HY-2026-0714'
