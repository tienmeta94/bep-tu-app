// Dữ liệu dịch vụ sửa chữa MẪU — giá "từ" mang tính tham khảo,
// kỹ thuật kiểm tra thực tế và báo giá chốt trước khi sửa.
// Thay bằng bảng giá thật của shop ở mốc M4.

import type { CategorySlug } from './products'

export interface RepairFault {
  name: string
  priceFrom: number
}

export interface RepairGroup {
  category: CategorySlug
  title: string
  tagline: string
  faults: RepairFault[]
}

export const repairGroups: RepairGroup[] = [
  {
    category: 'bep-tu',
    title: 'Sửa bếp từ',
    tagline: 'Bếp đơn, bếp đôi, bếp âm — kiểm tra bo mạch, cảm ứng, mặt kính',
    faults: [
      { name: 'Không vào điện / mất nguồn', priceFrom: 250000 },
      { name: 'Báo lỗi E0–E9, không nhận nồi', priceFrom: 300000 },
      { name: 'Thay mặt kính bếp từ', priceFrom: 800000 },
      { name: 'Nấu ngắt quãng / quá nhiệt tự tắt', priceFrom: 350000 },
    ],
  },
  {
    category: 'may-rua-bat',
    title: 'Sửa máy rửa bát',
    tagline: 'Mọi hãng độc lập, âm tủ, để bàn — xử lý nước, bơm, bo điều khiển',
    faults: [
      { name: 'Không thoát nước / đọng nước', priceFrom: 300000 },
      { name: 'Rửa không sạch, còn cặn trắng', priceFrom: 250000 },
      { name: 'Rò rỉ nước ra sàn', priceFrom: 350000 },
      { name: 'Không cấp nước / lỗi van cấp', priceFrom: 300000 },
    ],
  },
  {
    category: 'may-hut-mui',
    title: 'Sửa máy hút mùi',
    tagline: 'Hút yếu, kêu to, hỏng cảm ứng — vệ sinh sâu, thay motor, sửa mạch',
    faults: [
      { name: 'Hút yếu, không hết mùi', priceFrom: 200000 },
      { name: 'Máy kêu to / rung mạnh', priceFrom: 250000 },
      { name: 'Thay motor hút mùi', priceFrom: 600000 },
      { name: 'Đèn / phím cảm ứng không hoạt động', priceFrom: 200000 },
    ],
  },
]

export const repairSteps = [
  {
    title: 'Đặt lịch',
    text: 'Gửi form đặt lịch, nhắn Zalo hoặc gọi hotline — mô tả nhanh thiết bị và triệu chứng.',
  },
  {
    title: 'Kiểm tra & báo giá',
    text: 'Kỹ thuật đến tận nơi kiểm tra, xác định lỗi và báo giá rõ ràng trước khi sửa.',
  },
  {
    title: 'Sửa chữa',
    text: 'Chỉ sửa / thay linh kiện khi bạn đồng ý giá. Linh kiện thay thế có nguồn gốc rõ ràng.',
  },
  {
    title: 'Nghiệm thu & bảo hành',
    text: 'Chạy thử cùng bạn, bàn giao phiếu bảo hành sửa chữa 3–6 tháng tuỳ hạng mục.',
  },
]
