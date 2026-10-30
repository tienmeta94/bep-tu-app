import { useMemo, useState } from 'react'
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ChipSelect, Field } from '../components/FormBits'
import { colors, radius } from '../constants/theme'
import { shop, zaloLink } from '../lib/config'
import { useOrders, type RepairTicket } from '../store/orders'

// Đồng bộ với form đặt lịch trên web bepduchuong.com
const deviceOptions = ['Bếp từ', 'Máy rửa bát', 'Máy hút mùi', 'Thiết bị bếp khác']
const areaOptions = [
  'Thanh Trì (Yên Xá, Tân Triều, Tứ Hiệp…)',
  'Hoàng Mai, Hà Đông, Thanh Xuân',
  'Đống Đa, Hai Bà Trưng, Hoàn Kiếm, Ba Đình',
  'Cầu Giấy, Nam Từ Liêm, Bắc Từ Liêm',
  'Long Biên, Gia Lâm',
  'Khu vực khác (trao đổi qua Zalo)',
]
const slotOptions = [
  'Càng sớm càng tốt',
  'Buổi sáng (8:00 – 12:00)',
  'Buổi chiều (13:00 – 17:00)',
  'Buổi tối (17:00 – 20:00)',
]

interface FormState {
  name: string
  phone: string
  address: string
  area: string
  device: string
  model: string
  symptom: string
  slot: string
}

const initialForm: FormState = {
  name: '',
  phone: '',
  address: '',
  area: areaOptions[0],
  device: deviceOptions[0],
  model: '',
  symptom: '',
  slot: slotOptions[0],
}

type Step = 'form' | 'send' | 'done'

export default function RepairBookingScreen() {
  const router = useRouter()
  const { addTicket } = useOrders()
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [step, setStep] = useState<Step>('form')
  const [ticketCode, setTicketCode] = useState('')
  const [copied, setCopied] = useState(false)

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const message = useMemo(() => {
    if (!ticketCode) return ''
    return [
      `PHIẾU ĐẶT LỊCH SỬA CHỮA — MÃ ${ticketCode}`,
      `Cửa hàng: ${shop.name}`,
      `Khách hàng: ${form.name.trim()}`,
      `Số điện thoại: ${form.phone.trim()}`,
      `Địa chỉ: ${form.address.trim()}`,
      `Khu vực: ${form.area}`,
      `Thiết bị: ${form.device}${form.model.trim() ? ` (${form.model.trim()})` : ''}`,
      `Triệu chứng: ${form.symptom.trim()}`,
      `Khung giờ mong muốn: ${form.slot}`,
      'Nhờ shop liên hệ lại để xác nhận lịch hẹn. Cảm ơn!',
    ].join('\n')
  }, [ticketCode, form])

  const submit = () => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (form.name.trim().length < 2) next.name = 'Vui lòng nhập họ tên của bạn.'
    if (!/^0\d{9}$/.test(form.phone.trim()))
      next.phone = 'Số điện thoại chưa đúng định dạng (10 số, bắt đầu bằng 0).'
    if (form.address.trim().length < 8)
      next.address = 'Vui lòng nhập địa chỉ cụ thể để kỹ thuật tìm nhà.'
    if (form.symptom.trim().length < 5)
      next.symptom = 'Hãy mô tả ngắn gọn triệu chứng, ví dụ: bếp báo lỗi E1, không nóng.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const code = `SC${Date.now().toString().slice(-8)}`
    const ticket: RepairTicket = {
      code,
      createdAt: new Date().toISOString(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      area: form.area,
      device: form.device,
      model: form.model.trim(),
      symptom: form.symptom.trim(),
      slot: form.slot,
    }
    // Lưu phiếu vào máy ngay khi tạo — khách xem lại được ở mục "Của tôi"
    addTicket(ticket)
    setTicketCode(code)
    setStep('send')
  }

  const copyMessage = async () => {
    await Clipboard.setStringAsync(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (step === 'done') {
    return (
      <View style={styles.doneWrap}>
        <View style={styles.doneIcon}>
          <MaterialIcons name="event-available" size={34} color={colors.green} />
        </View>
        <Text style={styles.doneTitle}>Phiếu {ticketCode} đã được lưu!</Text>
        <Text style={styles.doneText}>
          Shop sẽ liên hệ lại số <Text style={{ fontWeight: '700', color: colors.ink }}>{form.phone}</Text>{' '}
          để xác nhận lịch hẹn sửa {form.device.toLowerCase()} — khung giờ: {form.slot}. Phiếu của
          bạn nằm ở mục “Của tôi” trong app.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/mine')}>
          <Text style={styles.primaryBtnText}>Xem phiếu ở Của tôi</Text>
        </Pressable>
        <Pressable style={styles.ghostBtn} onPress={() => router.push('/repair')}>
          <Text style={styles.ghostBtnText}>Quay lại trang Sửa chữa</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Đặt lịch sửa chữa tại nhà</Text>
      <Text style={styles.intro}>
        Điền thông tin bên dưới — phiếu được tạo mã SC…, lưu trong máy của bạn và gửi cho shop qua
        Zalo để xác nhận lịch.
      </Text>

      {step === 'send' ? (
        <View style={styles.readyCard}>
          <View style={styles.readyHead}>
            <MaterialIcons name="check-circle" size={20} color={colors.green} />
            <Text style={styles.readyTitle}>Phiếu {ticketCode} đã sẵn sàng — gửi cho shop:</Text>
          </View>
          <View style={styles.msgBox}>
            <Text style={styles.msgText}>{message}</Text>
          </View>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.zalo }]}
            onPress={() => void Linking.openURL(zaloLink(message))}
          >
            <MaterialIcons name="chat" size={17} color="#fff" />
            <Text style={styles.actionBtnText}>Gửi phiếu qua Zalo</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, styles.actionBtnNavy]} onPress={() => void copyMessage()}>
            <MaterialIcons name={copied ? 'check' : 'content-copy'} size={17} color="#fff" />
            <Text style={styles.actionBtnText}>{copied ? 'Đã sao chép' : 'Sao chép nội dung phiếu'}</Text>
          </Pressable>
          <Pressable style={styles.finishBtn} onPress={() => setStep('done')}>
            <Text style={styles.finishBtnText}>Đã gửi xong — Hoàn tất</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.form}>
          <Field
            label="Họ tên *"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={form.name}
            onChangeText={(v) => set('name', v)}
            error={errors.name}
            autoComplete="name"
          />
          <Field
            label="Số điện thoại *"
            placeholder="Ví dụ: 09xx xxx xxx"
            value={form.phone}
            onChangeText={(v) => set('phone', v)}
            error={errors.phone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          <Field
            label="Địa chỉ nhà *"
            placeholder="Số nhà, đường, phường/xã…"
            value={form.address}
            onChangeText={(v) => set('address', v)}
            error={errors.address}
            multiline
          />
          <ChipSelect
            label="Khu vực"
            options={areaOptions}
            value={form.area}
            onChange={(v) => set('area', v)}
          />
          <ChipSelect
            label="Thiết bị cần sửa"
            options={deviceOptions}
            value={form.device}
            onChange={(v) => set('device', v)}
          />
          <Field
            label="Hãng / model (không bắt buộc)"
            placeholder="Ví dụ: bếp từ đôi Electrolux…"
            value={form.model}
            onChangeText={(v) => set('model', v)}
          />
          <Field
            label="Triệu chứng *"
            placeholder="Ví dụ: bếp báo lỗi E1, không nóng; máy rửa bát không thoát nước…"
            value={form.symptom}
            onChangeText={(v) => set('symptom', v)}
            error={errors.symptom}
            multiline
          />
          <ChipSelect
            label="Khung giờ mong muốn"
            options={slotOptions}
            value={form.slot}
            onChange={(v) => set('slot', v)}
          />
          <Pressable style={styles.primaryBtn} onPress={submit}>
            <Text style={styles.primaryBtnText}>Tạo phiếu đặt lịch</Text>
          </Pressable>
          <Text style={styles.note}>
            Kỹ thuật sẽ gọi lại xác nhận trước khi đến. Giá chốt được báo sau khi kiểm tra thực tế
            — bạn đồng ý mới sửa.
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  title: { fontSize: 21, fontWeight: '800', color: colors.ink, marginTop: 4 },
  intro: { fontSize: 13.5, color: colors.muted, lineHeight: 20 },
  form: { gap: 12 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  ghostBtn: { paddingVertical: 8 },
  ghostBtnText: { fontSize: 14, fontWeight: '600', color: colors.navy },
  note: { fontSize: 12.5, color: colors.muted, lineHeight: 18 },
  readyCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
  },
  readyHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  readyTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: '#065f46', lineHeight: 21 },
  msgBox: { backgroundColor: '#fff', borderRadius: radius.md, padding: 12 },
  msgText: { fontSize: 13, color: colors.ink, lineHeight: 19 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 999,
    paddingVertical: 12,
  },
  actionBtnNavy: { backgroundColor: colors.navy },
  actionBtnText: { color: '#fff', fontSize: 14.5, fontWeight: '700' },
  finishBtn: {
    borderWidth: 1.5,
    borderColor: colors.green,
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  finishBtnText: { fontSize: 14.5, fontWeight: '700', color: colors.green },
  doneWrap: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 12,
  },
  doneIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneTitle: { fontSize: 19, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  doneText: { fontSize: 14, color: colors.muted, lineHeight: 21, textAlign: 'center' },
})
