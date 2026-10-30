import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../constants/theme'

export default function NotFoundScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Không tìm thấy màn hình này</Text>
      <Link href="/" style={styles.link}>
        Về trang chủ
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
  link: { fontSize: 15, fontWeight: '600', color: colors.primary },
})
