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
import { Field } from '../components/FormBits'
import { colors, radius } from '../constants/theme'
import { products } from '../data/products'
import { formatVND } from '../lib/format'
import { shippingFee, shop, zaloLink } from '../lib/config'
import { useCart } from '../store/cart'
import { useOrders, type Order } from '../store/orders'

interface Customer {
  name: string
  phone: string
  address: string
  note: string
}

type Stage = 'form' | 'ready' | 'done'

export default function CheckoutScreen() {
  const router = useRouter()
  const { items, subtotal, clear } = useCart()
  const { addOrder } = useOrders()
  const [stage, setStage] = useState<Stage>('form')
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '', address: '', note: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({})
  const [orderCode, setOrderCode] = useState('')
  const [copied, setCopied] = useState(false)

  const lines = useMemo(
    () =>
      items
        .map((i) => {
          const p = products.find((x) => x.id === i.id)
          return p ? { id: p.id, name: p.name, price: p.price, qty: i.qty } : null
        })
        .filter((l): l is NonNullable<typeof l> => l !== null),
    [items],
  )
  const fee = shippingFee(subtotal)

  const orderMessage = useMemo(() => {
    if (!orderCode) return ''
    const linesText = lines
      .map((l) => `• ${l.name} × ${l.qty} = ${formatVND(l.price * l.qty)}`)
      .join('\n')
    return [
      `ĐƠN HÀNG MỚI — ${shop.name}`,
      `Mã đơn: ${orderCode}`,
      '——————————',
      linesText,
      '——————————',
      `Tạm tính: ${formatVND(subtotal)}`,
      `Phí giao hàng: ${fee === 0 ? 'Miễn phí' : formatVND(fee)}`,
      `Tổng cộng: ${formatVND(subtotal + fee)}`,
      `Họ tên: ${customer.name.trim()}`,
      `Số điện thoại: ${customer.phone.trim()}`,
      `Địa chỉ: ${customer.address.trim()}`,
      customer.note.trim() ? `Ghi chú: ${customer.note.trim()}` : '',
      'Thanh toán: COD khi nhận hàng',
    ]
      .filter(Boolean)
      .join('\n')
  }, [orderCode, lines, subtotal, fee, customer])

  const set = (key: keyof Customer, value: string) => {
    setCustomer((c) => ({ ...c, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof Customer, string>> = {}
    if (customer.name.trim().length < 2) next.name = 'Vui lòng nhập họ tên người nhận.'
    const phone = customer.phone.replace(/[\s.]/g, '')
    if (!/^0\d{9}$/.test(phone)) next.phone = 'Số điện thoại cần đủ 10 số và bắt đầu bằng 0.'
    if (customer.address.trim().length < 10)
      next.address = 'Vui lòng nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = () => {
    if (!validate()) return
    setOrderCode(`DH${Date.now().toString().slice(-8)}`)
    setStage('ready')
  }

  const copyOrder = async () => {
    await Clipboard.setStringAsync(orderMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const finish = () => {
    const order: Order = {
      code: orderCode,
      createdAt: new Date().toISOString(),
      customerName: customer.name.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      note: customer.note.trim(),
      lines,
      subtotal,
      fee,
    }
    addOrder(order)
    clear()
    setStage('done')
  }

  if (stage === 'done') {
    return (
      <View style={styles.doneWrap}>
        <View style={styles.doneIcon}>
          <MaterialIcons name="celebration" size={36} color={colors.green} />
        </View>
        <Text style={styles.doneTitle}>Đơn hàng {orderCode} đã được ghi nhận!</Text>
        <Text style={styles.doneText}>
          Cảm ơn bạn đã mua hàng. Shop sẽ gọi tới số{' '}
          <Text style={{ fontWeight: '700', color: colors.ink }}>{customer.phone}</Text> để xác
          nhận đơn và báo phí giao hàng trước khi gửi. Vui lòng để ý điện thoại nhé.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/products')}>
          <Text style={styles.primaryBtnText}>Tiếp tục mua sắm</Text>
        </Pressable>
        <Pressable style={styles.ghostBtn} onPress={() => router.push('/mine')}>
          <Text style={styles.ghostBtnText}>Xem đơn ở mục Của tôi</Text>
        </Pressable>
      </View>
    )
  }

  if (lines.length === 0) {
    return (
      <View style={styles.doneWrap}>
        <MaterialIcons name="shopping-cart" size={44} color={colors.faint} />
        <Text style={styles.doneTitle}>Chưa có gì để đặt hàng</Text>
        <Text style={styles.doneText}>
          Giỏ hàng của bạn đang trống. Hãy chọn vài thiết bị bếp rồi quay lại đây nhé.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/products')}>
          <Text style={styles.primaryBtnText}>Xem sản phẩm</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Đặt hàng</Text>

      <View style={styles.summaryCard}>
        {lines.map((l) => (
          <View key={l.id} style={styles.sumLine}>
            <Text style={styles.sumName} numberOfLines={1}>
              {l.name} × {l.qty}
            </Text>
            <Text style={styles.sumPrice}>{formatVND(l.price * l.qty)}</Text>
          </View>
        ))}
        <View style={styles.sumLine}>
          <Text style={styles.sumName}>Phí giao hàng</Text>
          <Text style={styles.sumPrice}>{fee === 0 ? 'Miễn phí' : formatVND(fee)}</Text>
        </View>
        <View style={[styles.sumLine, styles.sumTotalLine]}>
          <Text style={styles.sumTotalLabel}>Tổng cộng</Text>
          <Text style={styles.sumTotal}>{formatVND(subtotal + fee)}</Text>
        </View>
      </View>

      {stage === 'form' ? (
        <View style={styles.form}>
          <Field
            label="Họ tên người nhận *"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={customer.name}
            onChangeText={(v) => set('name', v)}
            error={errors.name}
            autoComplete="name"
          />
          <Field
            label="Số điện thoại *"
            placeholder="Ví dụ: 09xx xxx xxx"
            value={customer.phone}
            onChangeText={(v) => set('phone', v)}
            error={errors.phone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          <Field
            label="Địa chỉ giao hàng *"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            value={customer.address}
            onChangeText={(v) => set('address', v)}
            error={errors.address}
            multiline
          />
          <Field
            label="Ghi chú (không bắt buộc)"
            placeholder="Giờ giao thuận tiện, yêu cầu lắp đặt…"
            value={customer.note}
            onChangeText={(v) => set('note', v)}
            multiline
          />
          <Pressable style={styles.primaryBtn} onPress={submit}>
            <Text style={styles.primaryBtnText}>Tạo đơn hàng</Text>
          </Pressable>
          <Text style={styles.note}>
            Đơn được tạo mã DH… và lưu trên máy này. Bạn cần bấm gửi qua Zalo (hoặc sao chép gửi
            shop) ở bước tiếp theo để shop nhận được đơn.
          </Text>
        </View>
      ) : (
        <View style={styles.readyCard}>
          <View style={styles.readyHead}>
            <MaterialIcons name="check-circle" size={20} color={colors.green} />
            <Text style={styles.readyTitle}>
              Đơn {orderCode} đã sẵn sàng — chọn cách gửi cho shop:
            </Text>
          </View>
          <View style={styles.msgBox}>
            <Text style={styles.msgText}>{orderMessage}</Text>
          </View>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: colors.zalo }]}
            onPress={() => void Linking.openURL(zaloLink(orderMessage))}
          >
            <MaterialIcons name="chat" size={17} color="#fff" />
            <Text style={styles.actionBtnText}>Gửi đơn qua Zalo</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, styles.actionBtnNavy]} onPress={() => void copyOrder()}>
            <MaterialIcons name={copied ? 'check' : 'content-copy'} size={17} color="#fff" />
            <Text style={styles.actionBtnText}>{copied ? 'Đã sao chép' : 'Sao chép nội dung đơn'}</Text>
          </Pressable>
          <Pressable style={styles.finishBtn} onPress={finish}>
            <Text style={styles.finishBtnText}>Đã gửi xong — Hoàn tất</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  title: { fontSize: 21, fontWeight: '800', color: colors.ink, marginTop: 4 },
  summaryCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
    gap: 7,
  },
  sumLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  sumName: { flex: 1, fontSize: 13.5, color: colors.muted },
  sumPrice: { fontSize: 13.5, fontWeight: '600', color: colors.ink },
  sumTotalLine: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 9, marginTop: 2 },
  sumTotalLabel: { fontSize: 15, fontWeight: '800', color: colors.ink },
  sumTotal: { fontSize: 17, fontWeight: '800', color: colors.red },
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
