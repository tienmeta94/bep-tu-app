import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { colors, radius } from '../../constants/theme'
import { shop, zaloChatLink } from '../../lib/config'

export default function MineScreen() {
  const rows = [
    { label: 'Cửa hàng', value: shop.name },
    { label: 'Hotline / Zalo', value: shop.phone },
    { label: 'Địa chỉ', value: shop.address },
    { label: 'Giờ mở cửa', value: shop.hours },
    { label: 'Khu vực sửa tại nhà', value: shop.serviceArea },
  ]
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Thông tin shop</Text>
      <View style={styles.card}>
        {rows.map((r) => (
          <View key={r.label} style={styles.rowWrap}>
            <Text style={styles.label}>{r.label}</Text>
            <Text style={styles.value}>{r.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.btnRow}>
        <Pressable style={[styles.btn, styles.btnNavy]} onPress={() => void Linking.openURL(`tel:${shop.phone}`)}>
          <MaterialIcons name="phone" size={16} color="#fff" />
          <Text style={styles.btnText}>Gọi ngay</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnZalo]} onPress={() => void Linking.openURL(zaloChatLink)}>
          <MaterialIcons name="chat" size={16} color="#fff" />
          <Text style={styles.btnText}>Nhắn Zalo</Text>
        </Pressable>
      </View>
      <Text style={styles.note}>
        Đơn hàng và phiếu sửa bạn tạo sẽ xuất hiện tại đây từ mốc A3/A4 (lưu trên máy của bạn).
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, padding: 20, gap: 14 },
  title: { fontSize: 21, fontWeight: '800', color: colors.ink, marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 16, gap: 12 },
  rowWrap: { gap: 2 },
  label: { fontSize: 12, fontWeight: '700', color: colors.faint, textTransform: 'uppercase' },
  value: { fontSize: 15, color: colors.ink, fontWeight: '500' },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 11 },
  btnNavy: { backgroundColor: colors.navy },
  btnZalo: { backgroundColor: colors.zalo },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  note: { fontSize: 13, color: colors.muted, lineHeight: 19 },
})
