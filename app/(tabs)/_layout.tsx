import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Tabs } from 'expo-router'
import { colors } from '../../constants/theme'
import { useCart } from '../../store/cart'

export default function TabsLayout() {
  const { count } = useCart()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: colors.line },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Sản phẩm',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="repair"
        options={{
          title: 'Sửa chữa',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="build" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Giỏ hàng',
          tabBarBadge: count > 0 ? count : undefined,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-cart" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: 'Của tôi',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color as string} />
          ),
        }}
      />
    </Tabs>
  )
}
