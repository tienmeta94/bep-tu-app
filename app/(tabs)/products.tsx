import { useMemo, useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import ProductCard from '../../components/ProductCard'
import { colors } from '../../constants/theme'
import { categories, products, type CategorySlug } from '../../data/products'
import { formatVND } from '../../lib/format'
import { normalizeVi } from '../../lib/text'

type PriceRange = 'all' | 'u1' | '1-3' | '3-6' | 'o6'
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'sold'

const priceRanges: { key: PriceRange; label: string; test: (price: number) => boolean }[] = [
  { key: 'all', label: 'Mọi giá', test: () => true },
  { key: 'u1', label: 'Dưới 1 triệu', test: (p) => p < 1_000_000 },
  { key: '1-3', label: '1 – 3 triệu', test: (p) => p >= 1_000_000 && p < 3_000_000 },
  { key: '3-6', label: '3 – 6 triệu', test: (p) => p >= 3_000_000 && p < 6_000_000 },
  { key: 'o6', label: 'Trên 6 triệu', test: (p) => p >= 6_000_000 },
]

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Nổi bật' },
  { key: 'sold', label: 'Bán chạy' },
  { key: 'price-asc', label: 'Giá tăng dần' },
  { key: 'price-desc', label: 'Giá giảm dần' },
  { key: 'rating', label: 'Đánh giá cao' },
]

export default function ProductsScreen() {
  const params = useLocalSearchParams<{ cat?: string }>()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategorySlug | 'all'>('all')
  const [priceRange, setPriceRange] = useState<PriceRange>('all')
  const [sort, setSort] = useState<SortKey>('featured')

  // Trang chủ bấm vào 1 danh mục sẽ mở tab này kèm ?cat=<slug>:
  // đồng bộ state khi param đổi (mẫu "điều chỉnh state khi props đổi" của React)
  const [seenCat, setSeenCat] = useState(params.cat)
  if (params.cat !== seenCat) {
    setSeenCat(params.cat)
    if (params.cat && categories.some((c) => c.slug === params.cat)) {
      setCategory(params.cat as CategorySlug)
    }
  }

  const filtered = useMemo(() => {
    const q = normalizeVi(query.trim())
    const range = priceRanges.find((r) => r.key === priceRange) ?? priceRanges[0]
    const list = products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (!range.test(p.price)) return false
      if (q && !normalizeVi(`${p.name} ${p.shortDesc}`).includes(q)) return false
      return true
    })
    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating)
      case 'sold':
        return [...list].sort((a, b) => b.sold - a.sold)
      default:
        return [...list].sort(
          (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.sold - a.sold,
        )
    }
  }, [query, category, priceRange, sort])

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Sản phẩm</Text>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color={colors.faint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm bếp từ, máy rửa bát… (gõ không dấu cũng được)"
            placeholderTextColor={colors.faint}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <MaterialIcons name="close" size={18} color={colors.faint} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.chipRow}>
          <Pressable
            onPress={() => setCategory('all')}
            style={[styles.chip, category === 'all' && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === 'all' && styles.chipTextActive]}>
              Tất cả
            </Text>
          </Pressable>
          {categories.map((c) => (
            <Pressable
              key={c.slug}
              onPress={() => setCategory(c.slug)}
              style={[styles.chip, category === c.slug && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === c.slug && styles.chipTextActive]}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.chipRow}>
          {priceRanges.map((r) => (
            <Pressable
              key={r.key}
              onPress={() => setPriceRange(r.key)}
              style={[styles.chip, styles.chipSoft, priceRange === r.key && styles.chipSoftActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  styles.chipTextSoft,
                  priceRange === r.key && styles.chipTextActive,
                ]}
              >
                {r.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sortRow}>
          <Text style={styles.countText}>
            {filtered.length} sản phẩm
            {filtered.length > 0
              ? ` · ${formatVND(Math.min(...filtered.map((p) => p.price)))} – ${formatVND(
                  Math.max(...filtered.map((p) => p.price)),
                )}`
              : ''}
          </Text>
          <View style={styles.sortChips}>
            {sortOptions.map((s) => (
              <Pressable key={s.key} onPress={() => setSort(s.key)} hitSlop={4}>
                <Text style={[styles.sortText, sort === s.key && styles.sortTextActive]}>
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <View style={styles.gridCell}>
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="search-off" size={40} color={colors.faint} />
            <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm phù hợp</Text>
            <Text style={styles.emptyText}>
              Thử đổi từ khóa, danh mục hoặc khoảng giá khác nhé.
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 16, paddingBottom: 8, gap: 10 },
  title: { fontSize: 21, fontWeight: '800', color: colors.ink, marginTop: 4 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.ink, paddingVertical: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipSoft: { backgroundColor: colors.bg },
  chipSoftActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.ink },
  chipTextSoft: { fontSize: 12 },
  chipTextActive: { color: '#fff' },
  sortRow: { gap: 6 },
  countText: { fontSize: 12, color: colors.muted },
  sortChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  sortText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  sortTextActive: { color: colors.primary, textDecorationLine: 'underline' },
  gridContent: { padding: 16, paddingTop: 8, gap: 12 },
  gridRow: { gap: 12 },
  gridCell: { flex: 1 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 48, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  emptyText: { fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 19 },
})
