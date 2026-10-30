// Thông tin liên hệ của shop — ĐÃ CẬP NHẬT THÔNG TIN THẬT 2026-10-30
// (tên, điện thoại/Zalo, địa chỉ do chủ shop cung cấp).
export const shop = {
  name: 'Thiết bị nhà bếp Đức Hương',
  // Số điện thoại thật của shop
  phone: '0978948144',
  // Số Zalo (dùng cùng số điện thoại của shop)
  zalo: '0978948144',
  // Chưa có email chính thức — để trống, web hiển thị 'Đang cập nhật'
  email: '',
  // Endpoint Formspree để gửi đơn/phiếu về email — không mock được, tạo form thật
  // tại formspree.io rồi dán endpoint vào đây (ví dụ 'https://formspree.io/f/abcdwxyz').
  formspreeEndpoint: '',
  // Địa chỉ thật của cửa hàng
  address: 'Ngõ 123 Yên Xá, Tân Triều, Thanh Trì, Hà Nội',
  // Giờ mở cửa
  hours: '8:00 – 21:00 hằng ngày',
  // Khu vực phục vụ sửa chữa tại nhà (suy từ địa chỉ cửa hàng — cần chủ shop xác nhận lại)
  serviceArea: 'Thanh Trì và nội thành Hà Nội',
}

// Chính sách phí giao hàng (MẪU): miễn phí cho đơn từ 2.000.000đ,
// các đơn còn lại đồng giá 40.000đ (thiết bị bếp cồng kềnh hơn đèn).
export const FREE_SHIP_THRESHOLD = 2000000
export const STANDARD_SHIP_FEE = 40000

export const shippingFee = (subtotal: number): number => {
  if (subtotal <= 0) return 0
  return subtotal >= FREE_SHIP_THRESHOLD ? 0 : STANDARD_SHIP_FEE
}

export const hasZalo = shop.zalo.trim().length > 0
export const hasEmailOrder = shop.formspreeEndpoint.trim().length > 0

export const zaloLink = (message: string): string =>
  `https://zalo.me/${shop.zalo.trim()}?text=${encodeURIComponent(message)}`

export const zaloChatLink = zaloLink(
  `Xin chào ${shop.name}, tôi muốn được tư vấn mua thiết bị bếp / đặt lịch sửa chữa.`,
)
