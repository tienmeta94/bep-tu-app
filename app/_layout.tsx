import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { CartProvider } from '../store/cart'
import { OrdersProvider } from '../store/orders'

export default function RootLayout() {
  return (
    <CartProvider>
      <OrdersProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[slug]" options={{ title: 'Chi tiết sản phẩm' }} />
          <Stack.Screen name="checkout" options={{ title: 'Đặt hàng' }} />
          <Stack.Screen name="repair-booking" options={{ title: 'Đặt lịch sửa chữa' }} />
          <Stack.Screen name="+not-found" options={{ title: 'Không tìm thấy' }} />
        </Stack>
      </OrdersProvider>
    </CartProvider>
  )
}
