// Dữ liệu sản phẩm MẪU cho giai đoạn dựng khung (M1–M3).
// Thay bằng sản phẩm thật của shop ở mốc M4: sửa trực tiếp file này
// (hoặc quản lý qua trang admin khi đã nối Supabase ở giai đoạn Backend).

export type CategorySlug = 'bep-tu' | 'may-rua-bat' | 'may-hut-mui' | 'thiet-bi-khac'

export interface Category {
  slug: CategorySlug
  name: string
  tagline: string
}

export interface Spec {
  label: string
  value: string
}

export type Badge = 'hot' | 'new' | 'sale'

export interface Product {
  id: string
  slug: string
  image: string
  name: string
  category: CategorySlug
  price: number
  oldPrice?: number
  shortDesc: string
  description: string
  specs: Spec[]
  badge?: Badge
  featured?: boolean
  rating: number
  sold: number
}

export const categories: Category[] = [
  { slug: 'bep-tu', name: 'Bếp từ', tagline: 'Đơn, đôi, âm bàn — nấu nhanh, an toàn, dễ vệ sinh' },
  { slug: 'may-rua-bat', name: 'Máy rửa bát', tagline: 'Độc lập, âm tủ, để bàn — rửa sạch, sấy khô, tiết kiệm nước' },
  { slug: 'may-hut-mui', name: 'Máy hút mùi', tagline: 'Kính cong, âm tủ, chữ T — hút mạnh, chạy êm' },
  { slug: 'thiet-bi-khac', name: 'Thiết bị bếp khác', tagline: 'Bếp hồng ngoại, lò nướng, nồi chiên và phụ kiện bếp' },
]

export const categoryName = (slug: CategorySlug): string =>
  categories.find((c) => c.slug === slug)?.name ?? slug

export const products: Product[] = [
  // ——— Bếp từ ———
  {
    id: 'p01',
    slug: 'bep-tu-don-cam-ung-2000w',
    image: 'https://m.media-amazon.com/images/I/61QQ0rav0XL._SL1500_.jpg',
    name: 'Bếp từ đơn cảm ứng 2000W mặt kính',
    category: 'bep-tu',
    price: 690000,
    oldPrice: 890000,
    shortDesc: 'Mặt kính chịu lực, 9 mức công suất, hẹn giờ và khóa trẻ em.',
    description:
      'Bếp từ đơn công suất 2000W nấu nhanh sôi, mặt kính ceramic chịu nhiệt dễ lau chùi. Phù hợp gia đình nhỏ, phòng trọ, hoặc dùng thêm khi có tiệc.',
    specs: [
      { label: 'Công suất', value: '2000W' },
      { label: 'Mặt bếp', value: 'Kính ceramic chịu nhiệt' },
      { label: 'Điều khiển', value: 'Cảm ứng, 9 mức công suất' },
      { label: 'Tính năng', value: 'Hẹn giờ, khóa trẻ em, tự ngắt khi tràn' },
      { label: 'Bảo hành', value: '12 tháng' },
    ],
    badge: 'sale',
    rating: 4.6,
    sold: 842,
  },
  {
    id: 'p02',
    slug: 'bep-tu-doi-am-ban-inverter',
    image: 'https://cdn.merheinflare.com/public-site/products/induction-cooker-16/2.png',
    name: 'Bếp từ đôi âm bàn Inverter 2 vùng nấu',
    category: 'bep-tu',
    price: 5490000,
    oldPrice: 6990000,
    shortDesc: 'Hai vùng nấu Inverter tiết kiệm điện, mặt kính Schott Ceran, booster nấu siêu nhanh.',
    description:
      'Bếp từ đôi lắp âm sang trọng cho bếp hiện đại: công nghệ Inverter ổn định công suất ở mức thấp, chức năng Booster đun sôi 1 lít nước trong vài phút, cảnh báo dư nhiệt từng vùng.',
    specs: [
      { label: 'Công suất', value: '2 × 2000W (Booster 2600W)' },
      { label: 'Mặt kính', value: 'Schott Ceran (Đức)' },
      { label: 'Kích thước khoét đá', value: '680 × 380 mm' },
      { label: 'Tính năng', value: 'Booster, giữ ấm, hẹn giờ từng vùng' },
      { label: 'Bảo hành', value: '24 tháng' },
    ],
    badge: 'hot',
    featured: true,
    rating: 4.9,
    sold: 356,
  },
  {
    id: 'p03',
    slug: 'bep-tu-hong-ngoai-doi-am-ban',
    image: 'https://image.made-in-china.com/203f0j00ubkpodBMLgzw/Double-Infrared-Cooker-Two-Burners-Double-Ceramic-Cooker-Highlight-Cooker-Hob-Plate-Stove.webp',
    name: 'Bếp từ kết hợp hồng ngoại đôi âm bàn',
    category: 'bep-tu',
    price: 4290000,
    oldPrice: 5290000,
    shortDesc: 'Một vùng từ + một vùng hồng ngoại dùng mọi loại nồi, kể cả nồi đất và nướng trực tiếp.',
    description:
      'Lựa chọn linh hoạt cho gia đình Việt: vùng từ nấu nhanh tiết kiệm, vùng hồng ngoại dùng được nồi đất, nồi thủy tinh và nướng trực tiếp. Mặt kính cường lực vát cạnh, khung inox chắc chắn.',
    specs: [
      { label: 'Công suất', value: 'Từ 2000W + Hồng ngoại 2000W' },
      { label: 'Mặt kính', value: 'Kính cường lực chịu nhiệt' },
      { label: 'Kích thước khoét đá', value: '680 × 380 mm' },
      { label: 'Tính năng', value: '9 mức nhiệt, hẹn giờ, khóa trẻ em' },
      { label: 'Bảo hành', value: '24 tháng' },
    ],
    featured: true,
    rating: 4.7,
    sold: 428,
  },
  {
    id: 'p04',
    slug: 'bep-tu-don-mini-1200w',
    image: 'https://s.alicdn.com/@sc04/kf/H58770cc769494881ac2054efa34482f1c.png_720x720q50.jpg',
    name: 'Bếp từ đơn mini 1200W nhỏ gọn',
    category: 'bep-tu',
    price: 390000,
    shortDesc: 'Nhỏ gọn cho 1–2 người, ký túc xá và mang đi du lịch, tự nhận diện nồi.',
    description:
      'Bếp từ mini công suất 1200W, trọng lượng nhẹ, chỉ hoạt động khi có nồi phù hợp và tự ngắt khi nhấc nồi. Phù hợp nấu mì, lẩu mini, pha trà tại bàn.',
    specs: [
      { label: 'Công suất', value: '1200W' },
      { label: 'Trọng lượng', value: '1,6 kg' },
      { label: 'Điều khiển', value: 'Núm xoay + màn hình LED' },
      { label: 'Tính năng', value: 'Tự ngắt khi không có nồi' },
      { label: 'Bảo hành', value: '12 tháng' },
    ],
    badge: 'new',
    rating: 4.5,
    sold: 517,
  },

  // ——— Máy rửa bát ———
  {
    id: 'p05',
    slug: 'may-rua-bat-doc-lap-14-bo',
    image: 'https://media3.bsh-group.com/Product_Shots/2400x/23590356_SMS6HAI01A_PGA1_def.webp',
    name: 'Máy rửa bát độc lập 14 bộ, sấy khô tăng cường',
    category: 'may-rua-bat',
    price: 10990000,
    oldPrice: 13990000,
    shortDesc: 'Rửa 14 bộ chén đĩa châu Âu, 8 chương trình, sấy khô và hé cửa tự động cuối chu trình.',
    description:
      'Máy rửa bát độc lập sức chứa lớn cho gia đình 5–7 người: rửa nước nóng 70°C diệt khuẩn, sấy tăng cường giúp chén đĩa khô ráo, độ ồn thấp 44dB chạy đêm yên tĩnh.',
    specs: [
      { label: 'Sức chứa', value: '14 bộ châu Âu' },
      { label: 'Chương trình', value: '8 chương trình + rửa nửa tải' },
      { label: 'Độ ồn', value: '44 dB' },
      { label: 'Tiêu thụ nước', value: '~10 lít/chu trình' },
      { label: 'Bảo hành', value: '24 tháng' },
    ],
    badge: 'hot',
    featured: true,
    rating: 4.8,
    sold: 189,
  },
  {
    id: 'p06',
    slug: 'may-rua-bat-am-tu-13-bo',
    image: 'https://api2.zoomit.ir/media/2023-8-dishwasher-snowa-sdw-f353200-inside-652d1f7d8716201626d125e2?w=1920&q=75',
    name: 'Máy rửa bát âm tủ 13 bộ toàn phần',
    category: 'may-rua-bat',
    price: 12490000,
    shortDesc: 'Lắp âm tủ bếp liền mạch, giàn rửa thứ 3 cho đũa muỗng, chiếu đèn báo xuống sàn.',
    description:
      'Thiết kế âm tủ toàn phần giấu sau cánh tủ bếp, tay nắm không lộ. Giàn thứ 3 tiện cho đũa, muỗng và dụng cụ dài; đèn chiếu sàn báo trạng thái rửa mà không cần mở cửa.',
    specs: [
      { label: 'Sức chứa', value: '13 bộ châu Âu' },
      { label: 'Số giàn rửa', value: '3 giàn' },
      { label: 'Độ ồn', value: '46 dB' },
      { label: 'Kích thước', value: '598 × 570 × 815 mm' },
      { label: 'Bảo hành', value: '24 tháng' },
    ],
    rating: 4.8,
    sold: 132,
  },
  {
    id: 'p07',
    slug: 'may-rua-bat-mini-6-bo-de-ban',
    image: 'https://cdn.shopify.com/s/files/1/0507/5107/8558/files/spt-compact-countertop-dishwasher.jpg',
    name: 'Máy rửa bát mini 6 bộ để bàn',
    category: 'may-rua-bat',
    price: 4590000,
    oldPrice: 5490000,
    shortDesc: 'Đặt trên bàn bếp, không cần lắp đặt phức tạp, có chế độ rửa ly và rửa nhanh 29 phút.',
    description:
      'Giải pháp cho căn hộ nhỏ và gia đình 2–3 người: đặt để bàn, cấp nước bằng bình chứa hoặc nối vòi, rửa nhanh 29 phút cho bữa ăn thường ngày, thêm chế độ rửa trái cây.',
    specs: [
      { label: 'Sức chứa', value: '6 bộ châu Âu' },
      { label: 'Chương trình', value: '6 chương trình' },
      { label: 'Cấp nước', value: 'Bình chứa 5L hoặc nối vòi' },
      { label: 'Kích thước', value: '550 × 500 × 438 mm' },
      { label: 'Bảo hành', value: '18 tháng' },
    ],
    badge: 'sale',
    featured: true,
    rating: 4.6,
    sold: 264,
  },
  {
    id: 'p08',
    slug: 'may-rua-bat-8-bo-ban-am',
    image: 'https://img.thrfun.com/img/174/219/dishwasher_x2.jpg',
    name: 'Máy rửa bát 8 bộ bán âm',
    category: 'may-rua-bat',
    price: 7990000,
    shortDesc: 'Kích thước nhỏ gọn cho bếp vừa, bảng điều khiển nổi, rửa tiết kiệm điện nước.',
    description:
      'Máy rửa bát 8 bộ lắp bán âm, mặt điều khiển nổi dễ thao tác. Phù hợp tủ bếp dưới tiêu chuẩn Việt, vẫn đủ chỗ cho nồi chảo nhỏ cùng chén đĩa mỗi bữa.',
    specs: [
      { label: 'Sức chứa', value: '8 bộ châu Âu' },
      { label: 'Chương trình', value: '7 chương trình' },
      { label: 'Độ ồn', value: '49 dB' },
      { label: 'Kích thước', value: '448 × 550 × 815 mm' },
      { label: 'Bảo hành', value: '24 tháng' },
    ],
    rating: 4.5,
    sold: 158,
  },

  // ——— Máy hút mùi ———
  {
    id: 'p09',
    slug: 'may-hut-mui-kinh-cong-70cm',
    image: 'https://media.bunnings.com.au/api/public/content/71745df0daff49a286a2ada1fcdd4f8f?v=b4399946',
    name: 'Máy hút mùi kính cong 70cm cảm ứng',
    category: 'may-hut-mui',
    price: 2890000,
    oldPrice: 3590000,
    shortDesc: 'Kính cong cường lực sang trọng, công suất hút 1000 m³/h, cảm ứng + vẫy tay điều khiển.',
    description:
      'Hút mùi kính cong cho bếp mở: lực hút mạnh xử lý tốt món chiên xào nhiều khói, điều khiển cảm ứng kết hợp vẫy tay không cần chạm khi tay đang nấu, lưới lọc inox tháo rửa dễ dàng.',
    specs: [
      { label: 'Công suất hút', value: '1000 m³/h' },
      { label: 'Độ ồn', value: '≤ 55 dB' },
      { label: 'Điều khiển', value: 'Cảm ứng + vẫy tay' },
      { label: 'Đèn chiếu sáng', value: 'LED 2 bóng' },
      { label: 'Bảo hành', value: '24 tháng' },
    ],
    badge: 'hot',
    featured: true,
    rating: 4.7,
    sold: 473,
  },
  {
    id: 'p10',
    slug: 'may-hut-mui-am-tu-70cm',
    image: 'https://www.nfm.com/on/demandware.static/-/Sites-nfm-master-catalog/default/dw8d2e1882/images/058/84/58844861-3.jpg',
    name: 'Máy hút mùi âm tủ 70cm kéo rút',
    category: 'may-hut-mui',
    price: 1990000,
    shortDesc: 'Gắn âm tủ bếp gọn gàng, kéo ra khi nấu, đẩy vào khi không dùng.',
    description:
      'Thiết kế âm tủ kéo rút tiết kiệm không gian, mặt inox dễ lau. Kéo máy ra là tự khởi động ở mức công suất đã chọn — tiện cho căn bếp nhỏ cần gọn.',
    specs: [
      { label: 'Công suất hút', value: '750 m³/h' },
      { label: 'Độ ồn', value: '≤ 52 dB' },
      { label: 'Điều khiển', value: 'Công tắc gạt 3 tốc độ' },
      { label: 'Lưới lọc', value: 'Nhôm 3 lớp, tháo rửa được' },
      { label: 'Bảo hành', value: '18 tháng' },
    ],
    rating: 4.5,
    sold: 389,
  },
  {
    id: 'p11',
    slug: 'may-hut-mui-chu-t-inox-90cm',
    image: 'https://media.bunnings.com.au/api/public/content/c7361d828a9d4f72a3f15bcb50e811bd?v=8e5f28f9',
    name: 'Máy hút mùi chữ T inox 90cm',
    category: 'may-hut-mui',
    price: 3490000,
    shortDesc: 'Dáng chữ T hiện đại cho bếp rộng, hút 1200 m³/h, khay hứng dầu tiện vệ sinh.',
    description:
      'Hút mùi chữ T thân inox phủ chống bám vân tay, bề mặt hút rộng bao phủ bếp 4–5 vùng nấu. Khay hứng dầu tháo nhanh, động cơ dây đồng bền và êm.',
    specs: [
      { label: 'Công suất hút', value: '1200 m³/h' },
      { label: 'Độ ồn', value: '≤ 56 dB' },
      { label: 'Điều khiển', value: 'Cảm ứng 3 tốc độ + hẹn giờ tắt' },
      { label: 'Chất liệu', value: 'Inox 304 chống bám vân tay' },
      { label: 'Bảo hành', value: '24 tháng' },
    ],
    rating: 4.6,
    sold: 217,
  },
  {
    id: 'p12',
    slug: 'may-hut-mui-dao-tran-90cm',
    image: 'https://images.welovehomeblog.com/wp-content/uploads/2025/11/The-Island-Centerpiece-Kitchen-Hood.jpg',
    name: 'Máy hút mùi đảo gắn trần 90cm',
    category: 'may-hut-mui',
    price: 5990000,
    shortDesc: 'Cho bếp đảo độc lập, điều khiển từ xa, thiết kế trần sang trọng 2 mặt cảm ứng.',
    description:
      'Hút mùi đảo treo trần cho không gian bếp mở cao cấp: bảng điều khiển hai mặt, remote đi kèm, hút vòng quanh 360° xử lý khói từ mọi hướng nấu.',
    specs: [
      { label: 'Công suất hút', value: '1100 m³/h' },
      { label: 'Điều khiển', value: 'Cảm ứng 2 mặt + remote' },
      { label: 'Đèn chiếu sáng', value: 'LED dải 2 bên' },
      { label: 'Chiều cao ống', value: 'Điều chỉnh 60–110 cm' },
      { label: 'Bảo hành', value: '24 tháng' },
    ],
    badge: 'new',
    rating: 4.7,
    sold: 86,
  },

  // ——— Thiết bị bếp khác ———
  {
    id: 'p13',
    slug: 'bep-hong-ngoai-don-ceramic',
    image: 'https://m.media-amazon.com/images/I/71Eo2p+Cn5L._AC_SL1500_.jpg',
    name: 'Bếp hồng ngoại đơn mặt kính ceramic',
    category: 'thiet-bi-khac',
    price: 590000,
    oldPrice: 790000,
    shortDesc: 'Dùng mọi loại nồi kể cả nồi đất, thủy tinh; nướng trực tiếp trên mặt bếp.',
    description:
      'Bếp hồng ngoại đơn không kén nồi: nấu được nồi đất, nồi thủy tinh, vỉ nướng đặt trực tiếp. Mặt kính ceramic phẳng dễ vệ sinh, vòng nhiệt kép nấu nhanh và đều.',
    specs: [
      { label: 'Công suất', value: '2000W' },
      { label: 'Mặt bếp', value: 'Kính ceramic' },
      { label: 'Điều khiển', value: 'Cảm ứng trượt' },
      { label: 'Tính năng', value: 'Hẹn giờ, cảnh báo mặt nóng' },
      { label: 'Bảo hành', value: '12 tháng' },
    ],
    badge: 'sale',
    rating: 4.4,
    sold: 356,
  },
  {
    id: 'p14',
    slug: 'lo-nuong-doi-luu-50l',
    image: 'https://cdn.shopify.com/s/files/1/0562/3483/6013/files/43218_Convection-Oven-1.jpg?v=1725013168',
    name: 'Lò nướng đối lưu 50L 4 thanh nhiệt',
    category: 'thiet-bi-khac',
    price: 2190000,
    shortDesc: 'Dung tích lớn nướng gà nguyên con, quạt đối lưu chín đều, đèn lò và kính 2 lớp.',
    description:
      'Lò nướng để bàn 50L cho gia đình mê làm bánh và nướng: 4 thanh nhiệt trên dưới chọn độc lập, quạt đối lưu giúp bánh chín đều màu, cửa kính 2 lớp cách nhiệt an toàn.',
    specs: [
      { label: 'Dung tích', value: '50 lít' },
      { label: 'Công suất', value: '2000W' },
      { label: 'Nhiệt độ', value: '100–230°C' },
      { label: 'Tính năng', value: 'Đối lưu, xiên quay, hẹn giờ 120 phút' },
      { label: 'Bảo hành', value: '18 tháng' },
    ],
    rating: 4.6,
    sold: 243,
  },
  {
    id: 'p15',
    slug: 'noi-chien-khong-dau-12l',
    image: 'https://nutricookworld.com/cdn/shop/files/NC-AFO330-01.jpg?v=1767689970&width=1500',
    name: 'Nồi chiên không dầu 12L cửa kính',
    category: 'thiet-bi-khac',
    price: 1890000,
    oldPrice: 2490000,
    shortDesc: 'Khoang lớn 12L nhìn thấy món ăn qua cửa kính, 10 chế độ nấu cài sẵn.',
    description:
      'Nồi chiên không dầu kiểu lò mini: chiên gà nguyên con, có trục quay và khay hứng dầu, cửa kính chịu nhiệt quan sát món ăn không cần mở ra làm mất nhiệt.',
    specs: [
      { label: 'Dung tích', value: '12 lít' },
      { label: 'Công suất', value: '1800W' },
      { label: 'Chế độ', value: '10 chương trình cài sẵn' },
      { label: 'Phụ kiện', value: 'Xiên quay, giỏ chiên, 2 khay nướng' },
      { label: 'Bảo hành', value: '18 tháng' },
    ],
    featured: true,
    rating: 4.7,
    sold: 529,
  },
  {
    id: 'p16',
    slug: 'may-xay-sinh-to-cong-nghiep-1500w',
    image: 'https://www.nishienterprise.com/cdn/shop/products/cb15-waring-food-blender-main_preview.png?v=1776478143&width=550',
    name: 'Máy xay sinh tố công nghiệp 1500W cối 2L',
    category: 'thiet-bi-khac',
    price: 1290000,
    shortDesc: 'Xay đá, xay hạt khô mịn nhanh cho quán và gia đình, cối nhựa chịu lực 2 lít.',
    description:
      'Động cơ 1500W tốc độ cao xay nhuyễn đá bào, sinh tố và hạt khô trong vài chục giây. Cối nhựa PC chịu va đập, lưỡi inox 6 cánh tháo rời vệ sinh dễ dàng.',
    specs: [
      { label: 'Công suất', value: '1500W' },
      { label: 'Dung tích cối', value: '2 lít' },
      { label: 'Lưỡi dao', value: 'Inox 6 cánh' },
      { label: 'Tốc độ', value: 'Đến 26.000 vòng/phút' },
      { label: 'Bảo hành', value: '12 tháng' },
    ],
    rating: 4.5,
    sold: 298,
  },
]

export const featuredProducts = products.filter((p) => p.featured)
export const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4)
