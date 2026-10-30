import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { colors, radius } from '../../constants/theme'
import { shop, zaloChatLink } from '../../lib/config'
import { formatVND } from '../../lib/format'
import { formatDateTime, useOrders } from '../../store/orders'

export default function MineScreen() {
  const router = useRouter()
  const { orders, tickets } = useOrders()

  const rows = [
    { label: 'Cửa hàng', value: shop.name },
    { label: 'Hotline / Zalo', value: shop.phone },
    { label: 'Địa chỉ', value: shop.address },
    { label: 'Giờ mở cửa', value: shop.hours },
    { label: 'Khu vực sửa tại nhà', value: shop.serviceArea },
  ]

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Của tôi</Text>

      <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>
      {orders.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Bạn chưa tạo đơn nào trên máy này. Đơn đặt qua app sẽ hiện ở đây.
          </Text>
          <Pressable onPress={() => router.push('/products')}>
            <Text style={styles.linkText}>Xem sản phẩm →</Text>
          </Pressable>
        </View>
      ) : (
        orders.map((o) => (
          <View key={o.code} style={styles.itemCard}>
            <View style={styles.itemHead}>
              <Text style={styles.itemCode}>Đơn {o.code}</Text>
              <Text style={styles.itemDate}>{formatDateTime(o.createdAt)}</Text>
            </View>
            {o.lines.map((l) => (
              <Text key={l.id} style={styles.itemLine}>
                • {l.name} × {l.qty} — {formatVND(l.price * l.qty)}
              </Text>
            ))}
            <Text style={styles.itemMeta}>
              Phí giao hàng: {o.fee === 0 ? 'Miễn phí' : formatVND(o.fee)} · Tổng:{' '}
              <Text style={styles.itemTotal}>{formatVND(o.subtotal + o.fee)}</Text>
            </Text>
            <Text style={styles.itemStatus}>
              Đã lưu trên máy này — đơn đến tay shop khi bạn gửi nội dung đơn qua Zalo cho shop.
            </Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Phiếu sửa chữa của tôi</Text>
      {tickets.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Bạn chưa có phiếu sửa nào. Khi đặt lịch sửa, phiếu mã SC… sẽ hiện ở đây.
          </Text>
          <Pressable onPress={() => router.push('/repair-booking')}>
            <Text style={styles.linkText}>Đặt lịch sửa →</Text>
          </Pressable>
        </View>
      ) : (
        tickets.map((t) => (
          <View key={t.code} style={styles.itemCard}>
            <View style={styles.itemHead}>
              <Text style={styles.itemCode}>Phiếu {t.code}</Text>
              <Text style={styles.itemDate}>{formatDateTime(t.createdAt)}</Text>
            </View>
            <Text style={styles.itemLine}>
              Thiết bị: {t.device}
              {t.model ? ` (${t.model})` : ''}
            </Text>
            <Text style={styles.itemLine}>Triệu chứng: {t.symptom}</Text>
            <Text style={styles.itemLine}>Khung giờ: {t.slot}</Text>
            <Text style={styles.itemLine}>Địa chỉ: {t.address}</Text>
            <Text style={styles.itemStatus}>
              Đã lưu trên máy này — shop xác nhận lịch sau khi nhận phiếu qua Zalo / cuộc gọi của
              bạn.
            </Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Thông tin shop</Text>
      <View style={styles.card}>
        {rows.map((r) => (
          <View key={r.label} style={styles.rowWrap}>
            <Text style={styles.label}>{r.label}</Text>
            <Text style={styles.value}>{r.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.btnRow}>
        <Pressable
          style={[styles.btn, styles.btnNavy]}
          onPress={() => void Linking.openURL(`tel:${shop.phone}`)}
        >
          <MaterialIcons name="phone" size={16} color="#fff" />
          <Text style={styles.btnText}>Gọi ngay</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnZalo]}
          onPress={() => void Linking.openURL(zaloChatLink)}
        >
          <MaterialIcons name="chat" size={16} color="#fff" />
          <Text style={styles.btnText}>Nhắn Zalo</Text>
        </Pressable>
      </View>
      <Text style={styles.note}>
        Đơn hàng và phiếu sửa ở giai đoạn này chỉ lưu trên điện thoại của bạn (chưa đồng bộ tài
        khoản) — xóa app hoặc đổi máy sẽ mất danh sách này. Shop vẫn giữ thông tin qua Zalo bạn đã
        gửi.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 28 },
  title: { fontSize: 21, fontWeight: '800', color: colors.ink, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.ink, marginTop: 8 },
  emptyCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
    gap: 8,
  },
  emptyText: { fontSize: 13.5, color: colors.muted, lineHeight: 19 },
  linkText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  itemCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 14,
    gap: 5,
  },
  itemHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  itemCode: { fontSize: 15, fontWeight: '800', color: colors.navy },
  itemDate: { fontSize: 12, color: colors.faint },
  itemLine: { fontSize: 13.5, color: colors.ink, lineHeight: 19 },
  itemMeta: { fontSize: 13.5, color: colors.muted },
  itemTotal: { fontWeight: '800', color: colors.red },
  itemStatus: { fontSize: 12, color: colors.faint, lineHeight: 17, marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 12,
  },
  rowWrap: { gap: 2 },
  label: { fontSize: 12, fontWeight: '700', color: colors.faint, textTransform: 'uppercase' },
  value: { fontSize: 15, color: colors.ink, fontWeight: '500' },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  btnNavy: { backgroundColor: colors.navy },
  btnZalo: { backgroundColor: colors.zalo },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  note: { fontSize: 12.5, color: colors.muted, lineHeight: 18 },
})
