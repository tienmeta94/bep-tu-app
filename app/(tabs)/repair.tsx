import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { colors, radius } from '../../constants/theme'
import { repairGroups, repairSteps } from '../../data/services'
import { formatVND } from '../../lib/format'
import { shop, zaloChatLink } from '../../lib/config'

export default function RepairScreen() {
  const router = useRouter()

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sửa chữa tại nhà</Text>
      <Text style={styles.intro}>
        Kỹ thuật đến tận nhà kiểm tra, báo giá chốt trước khi sửa — khu vực: {shop.serviceArea}.
        Giá dưới đây là giá tham khảo theo từng lỗi thường gặp.
      </Text>

      {repairGroups.map((g) => (
        <View key={g.category} style={styles.groupCard}>
          <Text style={styles.groupTitle}>{g.title}</Text>
          <Text style={styles.groupTag}>{g.tagline}</Text>
          <View style={styles.faultList}>
            {g.faults.map((f) => (
              <View key={f.name} style={styles.faultRow}>
                <Text style={styles.faultName}>{f.name}</Text>
                <Text style={styles.faultPrice}>từ {formatVND(f.priceFrom)}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Quy trình 4 bước</Text>
      {repairSteps.map((s, i) => (
        <View key={s.title} style={styles.stepRow}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.stepTitle}>{s.title}</Text>
            <Text style={styles.stepText}>{s.text}</Text>
          </View>
        </View>
      ))}

      <Pressable style={styles.bookBtn} onPress={() => router.push('/repair-booking')}>
        <MaterialIcons name="event-available" size={18} color="#fff" />
        <Text style={styles.bookBtnText}>Đặt lịch sửa chữa</Text>
      </Pressable>

      <View style={styles.btnRow}>
        <Pressable
          style={[styles.btn, styles.btnNavy]}
          onPress={() => void Linking.openURL(`tel:${shop.phone}`)}
        >
          <MaterialIcons name="phone" size={16} color="#fff" />
          <Text style={styles.btnText}>Gọi {shop.phone}</Text>
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
        Giá “từ” chỉ là tham khảo — kỹ thuật kiểm tra thực tế và báo giá cụ thể trước khi sửa, bạn
        đồng ý mới làm. Bảo hành sửa chữa 3–6 tháng tuỳ hạng mục.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 28 },
  title: { fontSize: 21, fontWeight: '800', color: colors.ink, marginTop: 4 },
  intro: { fontSize: 14, color: colors.muted, lineHeight: 20 },
  groupCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
    gap: 6,
  },
  groupTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  groupTag: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  faultList: { marginTop: 6 },
  faultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  faultName: { flex: 1, fontSize: 13.5, color: colors.ink },
  faultPrice: { fontSize: 13.5, fontWeight: '800', color: colors.primary },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.ink, marginTop: 8 },
  stepRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  stepTitle: { fontSize: 14.5, fontWeight: '700', color: colors.ink },
  stepText: { fontSize: 13, color: colors.muted, lineHeight: 19, marginTop: 2 },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    marginTop: 6,
  },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 999,
    paddingVertical: 11,
  },
  btnNavy: { backgroundColor: colors.navy },
  btnZalo: { backgroundColor: colors.zalo },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  note: { fontSize: 12.5, color: colors.muted, lineHeight: 18 },
})
