import { StyleSheet, Text, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { colors } from '../../constants/theme'
import { formatVND } from '../../lib/format'
import { FREE_SHIP_THRESHOLD, shippingFee } from '../../lib/config'
import { useCart } from '../../store/cart'

export default function CartScreen() {
  const { count, subtotal } = useCart()
  const fee = shippingFee(subtotal)
  return (
    <View style={styles.wrap}>
      <MaterialIcons name="shopping-cart" size={44} color={colors.faint} />
      <Text style={styles.title}>Giỏ hàng</Text>
      {count > 0 ? (
        <View style={styles.card}>
          <Text style={styles.row}>Số sản phẩm: {count}</Text>
          <Text style={styles.row}>Tạm tính: {formatVND(subtotal)}</Text>
          <Text style={styles.row}>
            Phí giao hàng: {fee === 0 ? 'Miễn phí' : formatVND(fee)}
            {fee > 0 ? ` (miễn phí từ ${formatVND(FREE_SHIP_THRESHOLD)})` : ''}
          </Text>
          <Text style={styles.row}>Tổng tạm tính: {formatVND(subtotal + fee)}</Text>
        </View>
      ) : (
        <Text style={styles.text}>Giỏ đang trống — bấm "Thêm vào giỏ" ở Trang chủ để thử.</Text>
      )}
      <Text style={styles.text}>
        Màn hình giỏ đầy đủ (đổi số lượng, xoá món) và đặt hàng tạo đơn thuộc mốc A3. Giỏ của bạn đã
        được lưu tự động trên máy.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12 },
  title: { fontSize: 19, fontWeight: '800', color: colors.ink },
  card: { alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.line, padding: 16, gap: 6 },
  row: { fontSize: 14, color: colors.ink },
  text: { fontSize: 14, color: colors.muted, lineHeight: 20, textAlign: 'center' },
})
