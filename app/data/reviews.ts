export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface ReviewItem {
  id: string
  productName: string
  artisanName: string
  emoji: string
  uploadTime: string
  imageCount: number
  status: ReviewStatus
  approvalNote?: string
}

export const reviews: ReviewItem[] = [
  {
    id: 'r1',
    productName: '台灣藍鵲押花書籤',
    artisanName: '秀美',
    emoji: '🌸',
    uploadTime: '2026/07/10 14:32',
    imageCount: 3,
    status: 'pending',
  },
  {
    id: 'r2',
    productName: '花卉香氛蠟磚',
    artisanName: '雅婷',
    emoji: '🕯️',
    uploadTime: '2026/07/11 09:15',
    imageCount: 2,
    status: 'pending',
  },
  {
    id: 'r3',
    productName: '刺繡名片夾',
    artisanName: '雅婷',
    emoji: '🧵',
    uploadTime: '2026/07/09 16:40',
    imageCount: 2,
    status: 'approved',
    approvalNote: '品質優秀！已通知媽媽寄件回基地',
  },
  {
    id: 'r4',
    productName: '乾燥花髮夾',
    artisanName: '秀美',
    emoji: '🌿',
    uploadTime: '2026/07/08 11:20',
    imageCount: 2,
    status: 'rejected',
  },
]

export const reviewStatusConfig: Record<ReviewStatus, { label: string; class: string; cardClass: string }> = {
  pending: { label: '待審核', class: 'bg-amber-100 text-amber-700', cardClass: '' },
  approved: { label: '已通過', class: 'bg-emerald-100 text-emerald-700', cardClass: 'bg-emerald-50/50' },
  rejected: { label: '退件修改', class: 'bg-red-100 text-red-700', cardClass: 'bg-red-50/50' },
}
