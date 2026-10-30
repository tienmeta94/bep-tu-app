import { StyleSheet, Text, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { colors } from '../../constants/theme'

export default function ProductsScreen() {
  return (
    <View style={styles.wrap}>
      <MaterialIcons name="category" size={44} color={colors.faint} />
      <Text style={styles.title}>Danh sách sản phẩm</Text>
      <Text style={styles.text}>
        Màn hình này thuộc mốc A2: lưới sản phẩm đầy đủ, tìm kiếm không dấu, lọc theo danh mục và
        khoảng giá, trang chi tiết. Ở mốc A1 bạn xem trước sản phẩm nổi bật và bán chạy ở Trang chủ.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 10 },
  title: { fontSize: 19, fontWeight: '800', color: colors.ink },
  text: { fontSize: 14, color: colors.muted, lineHeight: 20, textAlign: 'center' },
})
