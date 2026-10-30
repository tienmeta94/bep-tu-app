import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRouter } from 'expo-router'
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import ProductCard from '../../components/ProductCard'
import { colors, radius } from '../../constants/theme'
import { categories, products, type CategorySlug } from '../../data/products'
import { repairGroups } from '../../data/services'
import { formatVND } from '../../lib/format'
import { shop, zaloChatLink } from '../../lib/config'

const categoryIcons: Record<CategorySlug, keyof typeof MaterialIcons.glyphMap> = {
  'bep-tu': 'whatshot',
  'may-rua-bat': 'opacity',
  'may-hut-mui': 'air',
  'thiet-bi-khac': 'kitchen',
}

const benefits = [
  { icon: 'local-shipping' as const, title: 'Giao & lắp tận nơi', text: 'Hẹn giờ giao, hỗ trợ lắp đặt cơ bản' },
  { icon: 'search' as const, title: 'Kiểm tra trước, báo giá sau', text: 'Sửa chữa báo giá chốt rồi mới làm' },
  { icon: 'verified-user' as const, title: 'Bảo hành rõ ràng', text: 'Máy mới 12–24 tháng, sửa chữa 3–6 tháng' },
  { icon: 'payments' as const, title: 'Trả khi nhận hàng', text: 'COD mọi đơn, kiểm hàng trước khi trả' },
]

export default function HomeScreen() {
  const router = useRouter()
  const featured = products.filter((p) => p.featured)
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Đầu trang */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>THIẾT BỊ NHÀ BẾP</Text>
        <Text style={styles.shopName}>Đức Hương</Text>
        <Text style={styles.tagline}>
          Bán bếp từ, máy rửa bát, máy hút mùi — và sửa chữa tận nhà khi thiết bị hỏng.
        </Text>
        <View style={styles.headerBtns}>
          <Pressable
            style={[styles.btn, styles.btnWhite]}
            onPress={() => void Linking.openURL(`tel:${shop.phone}`)}
          >
            <MaterialIcons name="phone" size={16} color={colors.navy} />
            <Text style={[styles.btnText, { color: colors.navy }]}>Gọi {shop.phone}</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnZalo]}
            onPress={() => void Linking.openURL(zaloChatLink)}
          >
            <MaterialIcons name="chat" size={16} color="#fff" />
            <Text style={[styles.btnText, { color: '#fff' }]}>Nhắn Zalo</Text>
          </Pressable>
        </View>
      </View>

      {/* Hero hai hướng */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Thiết bị hỏng? Đừng vội thay mới</Text>
        <Text style={styles.heroText}>
          Kỹ thuật Đức Hương đến tận nhà kiểm tra, báo giá trước khi sửa. Khu vực: {shop.serviceArea}.
        </Text>
        <View style={styles.headerBtns}>
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => router.push('/products')}>
            <Text style={[styles.btnText, { color: '#fff' }]}>Xem thiết bị bếp</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnOutline]} onPress={() => router.push('/repair')}>
            <Text style={[styles.btnText, { color: '#fff' }]}>Đặt lịch sửa tại nhà</Text>
          </Pressable>
        </View>
      </View>

      {/* Cam kết */}
      <View style={styles.benefitGrid}>
        {benefits.map((b) => (
          <View key={b.title} style={styles.benefit}>
            <View style={styles.benefitIcon}>
              <MaterialIcons name={b.icon} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Danh mục */}
      <Text style={styles.sectionTitle}>Danh mục thiết bị</Text>
      <View style={styles.catGrid}>
        {categories.map((c) => (
          <Pressable
            key={c.slug}
            style={styles.catCard}
            onPress={() =>
              router.push({ pathname: '/products', params: { cat: c.slug } })
            }
          >
            <View style={styles.catIcon}>
              <MaterialIcons name={categoryIcons[c.slug]} size={26} color={colors.primary} />
            </View>
            <Text style={styles.catName}>{c.name}</Text>
            <Text style={styles.catTag} numberOfLines={2}>
              {c.tagline}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Nổi bật */}
      <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} width={178} />
        ))}
      </ScrollView>

      {/* Khối sửa chữa */}
      <View style={styles.repairBlock}>
        <Text style={styles.repairTitle}>Dịch vụ sửa chữa tại nhà</Text>
        {repairGroups.map((g) => (
          <View key={g.category} style={styles.repairRow}>
            <Text style={styles.repairName}>{g.title}</Text>
            <Text style={styles.repairPrice}>
              từ {formatVND(Math.min(...g.faults.map((f) => f.priceFrom)))}
            </Text>
          </View>
        ))}
        <Text style={styles.repairNote}>
          Giá tham khảo theo lỗi thường gặp — giá chốt báo sau khi kiểm tra thực tế, trước khi sửa.
        </Text>
        <Pressable style={[styles.btn, styles.btnPrimary, { alignSelf: 'flex-start' }]} onPress={() => router.push('/repair')}>
          <Text style={[styles.btnText, { color: '#fff' }]}>Xem dịch vụ & đặt lịch</Text>
        </Pressable>
      </View>

      {/* Bán chạy */}
      <Text style={styles.sectionTitle}>Bán chạy nhất</Text>
      <View style={styles.grid2}>
        {bestSellers.map((p) => (
          <View key={p.id} style={styles.gridCell}>
            <ProductCard product={p} />
          </View>
        ))}
      </View>

      <Text style={styles.footNote}>
        Giá và ảnh sản phẩm trên app đang là dữ liệu mẫu để xem trước giao diện; thông tin liên hệ
        của shop là thông tin thật.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, paddingBottom: 28 },
  header: { paddingTop: 10 },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.2, color: colors.primary },
  shopName: { fontSize: 32, fontWeight: '800', color: colors.ink, marginTop: 2 },
  tagline: { fontSize: 14, color: colors.muted, lineHeight: 20, marginTop: 4 },
  headerBtns: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnWhite: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line },
  btnZalo: { backgroundColor: colors.zalo },
  btnPrimary: { backgroundColor: colors.primary },
  btnOutline: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' },
  btnText: { fontSize: 14, fontWeight: '600' },
  hero: {
    backgroundColor: colors.navy,
    borderRadius: radius.xl,
    padding: 20,
  },
  heroTitle: { fontSize: 21, fontWeight: '800', color: '#fff', lineHeight: 27 },
  heroText: { fontSize: 14, color: '#cbd5e1', lineHeight: 20, marginTop: 6 },
  benefitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  benefit: {
    width: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
  },
  benefitIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTitle: { fontSize: 13, fontWeight: '700', color: colors.ink },
  benefitText: { fontSize: 12, color: colors.muted, lineHeight: 16, marginTop: 2 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: colors.ink, marginTop: 8 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  catIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: { fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: 8 },
  catTag: { fontSize: 12, color: colors.muted, lineHeight: 16, marginTop: 2 },
  hList: { gap: 12, paddingRight: 4 },
  repairBlock: { backgroundColor: colors.navy, borderRadius: radius.xl, padding: 20, gap: 10 },
  repairTitle: { fontSize: 19, fontWeight: '800', color: '#fff' },
  repairRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  repairName: { fontSize: 14, fontWeight: '600', color: '#fff', flex: 1 },
  repairPrice: { fontSize: 14, fontWeight: '800', color: '#fdba74' },
  repairNote: { fontSize: 12, color: '#cbd5e1', lineHeight: 17 },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCell: { width: '47%', flexGrow: 1 },
  footNote: { fontSize: 12, color: colors.faint, lineHeight: 17, marginTop: 6 },
})
