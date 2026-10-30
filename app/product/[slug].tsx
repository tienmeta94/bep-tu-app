import { useMemo, useState } from 'react'
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import ProductCard from '../../components/ProductCard'
import { colors, radius } from '../../constants/theme'
import { categoryName, products } from '../../data/products'
import { discountPercent, formatVND } from '../../lib/format'
import { shop } from '../../lib/config'
import { useCart } from '../../store/cart'

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const router = useRouter()
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [imgFailed, setImgFailed] = useState(false)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => p.slug === slug)
  const related = useMemo(
    () =>
      product
        ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
        : [],
    [product],
  )

  if (!product) {
    return (
      <View style={styles.notFound}>
        <MaterialIcons name="search-off" size={44} color={colors.faint} />
        <Text style={styles.notFoundTitle}>Không tìm thấy sản phẩm</Text>
        <Text style={styles.notFoundText}>Sản phẩm có thể đã được thay bằng mẫu mới.</Text>
        <Pressable style={styles.backBtn} onPress={() => router.push('/products')}>
          <Text style={styles.backBtnText}>Xem tất cả sản phẩm</Text>
        </Pressable>
      </View>
    )
  }

  const discount = discountPercent(product.price, product.oldPrice)

  const addToCart = () => {
    add(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const buyNow = () => {
    add(product.id, qty)
    router.push('/cart')
  }

  return (
    <View style={styles.wrap}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          {product.image && !imgFailed ? (
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <View style={styles.imageFallback}>
              <MaterialIcons name="kitchen" size={72} color={colors.faint} />
            </View>
          )}
          {discount ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          ) : null}
          <View style={styles.illusBadge}>
            <Text style={styles.illusText}>Ảnh minh họa</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.category}>{categoryName(product.category)}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.metaRow}>
            <MaterialIcons name="star" size={15} color="#f59e0b" />
            <Text style={styles.metaText}>
              {product.rating.toFixed(1)} · Đã bán {product.sold}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatVND(product.price)}</Text>
            {product.oldPrice ? (
              <Text style={styles.oldPrice}>{formatVND(product.oldPrice)}</Text>
            ) : null}
          </View>
          <Text style={styles.shortDesc}>{product.shortDesc}</Text>

          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.paragraph}>{product.description}</Text>

          <Text style={styles.sectionTitle}>Thông số</Text>
          <View style={styles.specCard}>
            {product.specs.map((s, i) => (
              <View
                key={s.label}
                style={[styles.specRow, i < product.specs.length - 1 && styles.specRowLine]}
              >
                <Text style={styles.specLabel}>{s.label}</Text>
                <Text style={styles.specValue}>{s.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Số lượng</Text>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                hitSlop={6}
              >
                <MaterialIcons name="remove" size={18} color={colors.ink} />
              </Pressable>
              <Text style={styles.qtyText}>{qty}</Text>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setQty((q) => Math.min(99, q + 1))}
                hitSlop={6}
              >
                <MaterialIcons name="add" size={18} color={colors.ink} />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={styles.callRow}
            onPress={() => void Linking.openURL(`tel:${shop.phone}`)}
          >
            <MaterialIcons name="phone" size={16} color={colors.navy} />
            <Text style={styles.callText}>
              Cần tư vấn thêm? Gọi {shop.phone} (miễn phí tư vấn, {shop.hours})
            </Text>
          </Pressable>
        </View>

        {related.length > 0 ? (
          <View style={styles.relatedWrap}>
            <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>Sản phẩm liên quan</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedList}
            >
              {related.map((p) => (
                <ProductCard key={p.id} product={p} width={168} />
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      {/* Thanh mua dính đáy */}
      <View style={styles.buyBar}>
        <Pressable
          style={[styles.buyBtn, styles.buyBtnOutline, added && styles.buyBtnDone]}
          onPress={addToCart}
        >
          <MaterialIcons
            name={added ? 'check' : 'add-shopping-cart'}
            size={17}
            color={added ? colors.green : colors.primary}
          />
          <Text style={[styles.buyBtnText, { color: added ? colors.green : colors.primary }]}>
            {added ? 'Đã thêm' : 'Thêm vào giỏ'}
          </Text>
        </Pressable>
        <Pressable style={[styles.buyBtn, styles.buyBtnPrimary]} onPress={buyNow}>
          <Text style={[styles.buyBtnText, { color: '#fff' }]}>Mua ngay</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 16 },
  imageWrap: { width: '100%', aspectRatio: 1, backgroundColor: '#f5f5f4', position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  illusBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  illusText: { color: '#fff', fontSize: 11, fontWeight: '500' },
  body: { padding: 16, gap: 8 },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  name: { fontSize: 21, fontWeight: '800', color: colors.ink, lineHeight: 27 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: colors.muted },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  price: { fontSize: 24, fontWeight: '800', color: colors.red },
  oldPrice: { fontSize: 15, color: colors.faint, textDecorationLine: 'line-through' },
  shortDesc: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.ink, marginTop: 10 },
  paragraph: { fontSize: 14, color: colors.muted, lineHeight: 21 },
  specCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
  },
  specRow: { flexDirection: 'row', gap: 12, paddingVertical: 11 },
  specRowLine: { borderBottomWidth: 1, borderBottomColor: colors.line },
  specLabel: { width: 110, fontSize: 13, fontWeight: '600', color: colors.muted },
  specValue: { flex: 1, fontSize: 13, color: colors.ink },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  qtyLabel: { fontSize: 14, fontWeight: '700', color: colors.ink },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontSize: 15, fontWeight: '800', color: colors.ink, minWidth: 22, textAlign: 'center' },
  callRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  callText: { flex: 1, fontSize: 13, color: colors.navy, fontWeight: '600' },
  relatedWrap: { marginTop: 4, gap: 10 },
  relatedList: { gap: 12, paddingHorizontal: 16 },
  buyBar: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  buyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 999,
    paddingVertical: 13,
  },
  buyBtnOutline: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: '#fff' },
  buyBtnDone: { borderColor: colors.green, backgroundColor: '#ecfdf5' },
  buyBtnPrimary: { backgroundColor: colors.primary },
  buyBtnText: { fontSize: 15, fontWeight: '700' },
  notFound: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 10,
  },
  notFoundTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  notFoundText: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  backBtn: {
    marginTop: 6,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  backBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
})
