export const revenueSummary = {
  monthlyTotal: 4280,
  depositDate: '7/31',
  lastMonth: 3150,
  passedCount: 12,
  avgPerItem: 356,
  passRate: 96,
}

export type ProgressStep = 'accepted' | 'making' | 'uploaded' | 'reviewing' | 'shipping' | 'settled'

export const stepLabels: { key: ProgressStep; label: string }[] = [
  { key: 'accepted', label: '接案' },
  { key: 'making', label: '製作' },
  { key: 'uploaded', label: '上傳' },
  { key: 'reviewing', label: '審核' },
  { key: 'shipping', label: '寄件' },
  { key: 'settled', label: '入帳' },
]

export interface OrderProgressData {
  id: string
  name: string
  qty: number
  orderId: string
  deadline: string
  totalPrice: number
  unitLabel: string
  currentStep: ProgressStep
  progressPercent: number
  progressLabel: string
}

export const orderProgressList: OrderProgressData[] = [
  {
    id: '1',
    name: '台灣藍鵲押花書籤',
    qty: 10,
    orderId: '#HY-2026-0714',
    deadline: '7/15截止',
    totalPrice: 850,
    unitLabel: '/件×10',
    currentStep: 'making',
    progressPercent: 40,
    progressLabel: '製作中 40%',
  },
  {
    id: '2',
    name: '刺繡名片夾',
    qty: 3,
    orderId: '#HY-2026-0702',
    deadline: '7/28截止',
    totalPrice: 960,
    unitLabel: '/件×3',
    currentStep: 'shipping',
    progressPercent: 83,
    progressLabel: '審核通過 83%',
  },
]

export interface SettlementRecord {
  id: string
  name: string
  date: string
  detail: string
  amount: number
  icon: string
}

export const settlements: SettlementRecord[] = [
  { id: 's1', name: '花卉香氛蠟磚 分潤入帳', date: '2026/07/05', detail: '5件通過', amount: 700, icon: '💰' },
  { id: 's2', name: '和紙膠帶卷 分潤入帳', date: '2026/06/28', detail: '8件通過', amount: 1040, icon: '💰' },
  { id: 's3', name: '寄件運費補貼', date: '2026/06/20', detail: '已扣除運費', amount: -60, icon: '📦' },
]
