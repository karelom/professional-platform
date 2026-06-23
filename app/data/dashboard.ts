export const profile = {
  name: '秀美媽媽',
  certified: true,
  totalWorks: 12,
}

export const stats = {
  inProgress: 3,
  pendingReview: 2,
  monthlyRevenue: 4280,
}

export const quickActions = [
  {
    icon: 'lucide:clipboard-list',
    label: '查看本期訂單',
    description: '點擊掃描 QR Code',
    to: '/scan',
    isNew: true,
  },
  {
    icon: 'lucide:bar-chart-3',
    label: '分潤進度',
    description: 'NT$4,280 待入帳',
    to: '/revenue',
    isNew: false,
  },
  {
    icon: 'lucide:truck',
    label: '寄件回基地',
    description: '審核通過後寄出',
    to: '/review',
    isNew: false,
  },
  {
    icon: 'lucide:graduation-cap',
    label: '學習資源',
    description: '美感訓練教材',
    to: '#',
    isNew: false,
  },
]

export type TaskStatus = 'in-progress' | 'uploaded' | 'approved' | 'rejected'

export interface Task {
  id: string
  name: string
  qty: number
  deadline: string
  unitPrice: number
  status: TaskStatus
  emoji: string
}

export const tasks: Task[] = [
  {
    id: 'HY-2026-0714',
    name: '台灣藍鵲押花書籤',
    qty: 10,
    deadline: '2026/07/15',
    unitPrice: 85,
    status: 'in-progress',
    emoji: '🌸',
  },
  {
    id: 'HY-2026-0711',
    name: '花卉香氛蠟磚',
    qty: 5,
    deadline: '2026/07/20',
    unitPrice: 140,
    status: 'uploaded',
    emoji: '🕯️',
  },
  {
    id: 'HY-2026-0702',
    name: '刺繡名片夾',
    qty: 3,
    deadline: '2026/07/28',
    unitPrice: 320,
    status: 'approved',
    emoji: '🧵',
  },
]

export const statusConfig: Record<TaskStatus, { label: string; class: string }> = {
  'in-progress': { label: '製作中', class: 'bg-amber-100 text-amber-700' },
  uploaded: { label: '已上傳', class: 'bg-blue-100 text-blue-700' },
  approved: { label: '審核通過', class: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: '退件修改', class: 'bg-red-100 text-red-700' },
}
