import { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import type { Product } from '../data/products'
import { discountPercent, formatVND } from '../lib/format'
import { colors, radius } from '../constants/theme'
import { useCart } from '../store/cart'

export default function ProductCard({
  product,
  width,
}: {
  product: Product
  width?: number
}) {
  const { add } = useCart()
  const router = useRouter()
  const [added, setAdded] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const discount = discountPercent(product.price, product.oldPrice)
  const openDetail = () =>
    router.push({ pathname: '/product/[slug]', params: { slug: product.slug } })

  return (
    <View style={[styles.card, width ? { width } : { flex: 1 }]}>
      <Pressable style={styles.imageWrap} onPress={openDetail}>
        {product.image && !imgFailed ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <View style={styles.imageFallback}>
            <MaterialIcons name="kitchen" size={44} color={colors.faint} />
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
      </Pressable>
      <View style={styles.body}>
        <Pressable onPress={openDetail}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
        </Pressable>
        <View style={styles.metaRow}>
          <MaterialIcons name="star" size={14} color="#f59e0b" />
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
        <Pressable
          onPress={() => {
            add(product.id, 1)
            setAdded(true)
            setTimeout(() => setAdded(false), 1200)
          }}
          style={[styles.addBtn, added && styles.addBtnDone]}
        >
          <MaterialIcons
            name={added ? 'check' : 'add-shopping-cart'}
            size={16}
            color={added ? colors.green : colors.primary}
          />
          <Text style={[styles.addText, added && { color: colors.green }]}>
            {added ? 'Đã thêm' : 'Thêm vào giỏ'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
  },
  imageWrap: { width: '100%', aspectRatio: 1, backgroundColor: '#f5f5f4' },
  image: { width: '100%', height: '100%' },
  imageFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.red,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  illusBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  illusText: { color: '#fff', fontSize: 10, fontWeight: '500' },
  body: { padding: 12, gap: 6 },
  name: { fontSize: 14, fontWeight: '600', color: colors.ink, minHeight: 36 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: colors.muted },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' },
  price: { fontSize: 16, fontWeight: '800', color: colors.red },
  oldPrice: { fontSize: 12, color: colors.faint, textDecorationLine: 'line-through' },
  addBtn: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 7,
  },
  addBtnDone: { borderColor: colors.green, backgroundColor: '#ecfdf5' },
  addText: { fontSize: 13, fontWeight: '600', color: colors.primary },
})
