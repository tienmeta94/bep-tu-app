import { StyleSheet, Text, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { colors } from '../../constants/theme'
import { repairGroups } from '../../data/services'
import { formatVND } from '../../lib/format'

export default function RepairScreen() {
  return (
    <View style={styles.wrap}>
      <MaterialIcons name="build" size={44} color={colors.faint} />
      <Text style={styles.title}>Sửa chữa tại nhà</Text>
      <View style={styles.card}>
        {repairGroups.map((g) => (
          <View key={g.category} style={styles.row}>
            <Text style={styles.name}>{g.title}</Text>
            <Text style={styles.price}>
              từ {formatVND(Math.min(...g.faults.map((f) => f.priceFrom)))}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.text}>
        Bảng giá chi tiết từng lỗi và form đặt lịch sửa (tạo phiếu mã SC…) thuộc mốc A4. Ở Trang chủ
        đã có lối tắt gọi hotline / nhắn Zalo để đặt lịch ngay.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12 },
  title: { fontSize: 19, fontWeight: '800', color: colors.ink },
  card: { alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.line, padding: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12 },
  name: { fontSize: 14, fontWeight: '600', color: colors.ink, flex: 1 },
  price: { fontSize: 14, fontWeight: '800', color: colors.primary },
  text: { fontSize: 14, color: colors.muted, lineHeight: 20, textAlign: 'center' },
})
