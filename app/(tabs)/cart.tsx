import { useState } from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { colors, radius } from '../../constants/theme'
import { products } from '../../data/products'
import { formatVND } from '../../lib/format'
import { FREE_SHIP_THRESHOLD, shippingFee } from '../../lib/config'
import { useCart } from '../../store/cart'

export default function CartScreen() {
  const router = useRouter()
  const { items, count, subtotal, setQty, remove, clear } = useCart()
  const [failedImgs, setFailedImgs] = useState<Record<string, boolean>>({})
  const fee = shippingFee(subtotal)
  const missingForFreeShip = Math.max(0, FREE_SHIP_THRESHOLD - subtotal)

  const lines = items
    .map((i) => ({ item: i, product: products.find((p) => p.id === i.id) }))
    .filter((l) => l.product)

  if (lines.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <MaterialIcons name="shopping-cart" size={48} color={colors.faint} />
        <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
        <Text style={styles.emptyText}>
          Chọn vài thiết bị bếp rồi quay lại đây để đặt hàng nhé.
        </Text>
        <Pressable style={styles.shopBtn} onPress={() => router.push('/products')}>
          <Text style={styles.shopBtnText}>Xem sản phẩm</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Giỏ hàng ({count})</Text>
        <Pressable onPress={clear} hitSlop={8}>
          <Text style={styles.clearText}>Xóa tất cả</Text>
        </Pressable>
      </View>

      {lines.map(({ item, product }) => (
        <View key={item.id} style={styles.lineCard}>
          <Pressable
            onPress={() =>
              router.push({ pathname: '/product/[slug]', params: { slug: product!.slug } })
            }
          >
            {product!.image && !failedImgs[item.id] ? (
              <Image
                source={{ uri: product!.image }}
                style={styles.thumb}
                resizeMode="cover"
                onError={() => setFailedImgs((s) => ({ ...s, [item.id]: true }))}
              />
            ) : (
              <View style={[styles.thumb, styles.thumbFallback]}>
                <MaterialIcons name="kitchen" size={26} color={colors.faint} />
              </View>
            )}
          </Pressable>
          <View style={styles.lineBody}>
            <Text style={styles.lineName} numberOfLines={2}>
              {product!.name}
            </Text>
            <Text style={styles.linePrice}>{formatVND(product!.price)}</Text>
            <View style={styles.lineActions}>
              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setQty(item.id, item.qty - 1)}
                  hitSlop={6}
                >
                  <MaterialIcons name="remove" size={16} color={colors.ink} />
                </Pressable>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setQty(item.id, Math.min(99, item.qty + 1))}
                  hitSlop={6}
                >
                  <MaterialIcons name="add" size={16} color={colors.ink} />
                </Pressable>
              </View>
              <Text style={styles.lineTotal}>{formatVND(product!.price * item.qty)}</Text>
              <Pressable onPress={() => remove(item.id)} hitSlop={8}>
                <MaterialIcons name="delete-outline" size={20} color={colors.red} />
              </Pressable>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.summaryCard}>
        <View style={styles.sumRow}>
          <Text style={styles.sumLabel}>Tạm tính</Text>
          <Text style={styles.sumValue}>{formatVND(subtotal)}</Text>
        </View>
        <View style={styles.sumRow}>
          <Text style={styles.sumLabel}>Phí giao hàng</Text>
          <Text style={styles.sumValue}>{fee === 0 ? 'Miễn phí' : formatVND(fee)}</Text>
        </View>
        {fee > 0 ? (
          <Text style={styles.freeShipHint}>
            Mua thêm {formatVND(missingForFreeShip)} nữa để được miễn phí giao hàng (áp dụng cho
            đơn từ {formatVND(FREE_SHIP_THRESHOLD)}).
          </Text>
        ) : (
          <Text style={[styles.freeShipHint, { color: colors.green }]}>
            Đơn của bạn được miễn phí giao hàng.
          </Text>
        )}
        <View style={[styles.sumRow, styles.sumRowTotal]}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatVND(subtotal + fee)}</Text>
        </View>
        <Text style={styles.codNote}>Thanh toán COD khi nhận hàng — kiểm hàng trước khi trả.</Text>
      </View>

      <Pressable style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
        <Text style={styles.checkoutText}>Đặt hàng</Text>
        <MaterialIcons name="arrow-forward" size={18} color="#fff" />
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 28 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  title: { fontSize: 21, fontWeight: '800', color: colors.ink },
  clearText: { fontSize: 13, fontWeight: '600', color: colors.red },
  lineCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 12,
  },
  thumb: { width: 76, height: 76, borderRadius: radius.md, backgroundColor: '#f5f5f4' },
  thumbFallback: { alignItems: 'center', justifyContent: 'center' },
  lineBody: { flex: 1, gap: 4 },
  lineName: { fontSize: 14, fontWeight: '600', color: colors.ink },
  linePrice: { fontSize: 13, color: colors.muted },
  lineActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontSize: 14, fontWeight: '800', color: colors.ink, minWidth: 18, textAlign: 'center' },
  lineTotal: { flex: 1, fontSize: 15, fontWeight: '800', color: colors.red, textAlign: 'right' },
  summaryCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
    gap: 8,
  },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { fontSize: 14, color: colors.muted },
  sumValue: { fontSize: 14, fontWeight: '600', color: colors.ink },
  freeShipHint: { fontSize: 12.5, color: colors.muted, lineHeight: 18 },
  sumRowTotal: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, marginTop: 2 },
  totalLabel: { fontSize: 15, fontWeight: '800', color: colors.ink },
  totalValue: { fontSize: 18, fontWeight: '800', color: colors.red },
  codNote: { fontSize: 12, color: colors.faint },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  emptyWrap: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  shopBtn: {
    marginTop: 6,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  shopBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
})
