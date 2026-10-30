import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { CartProvider } from '../store/cart'

export default function RootLayout() {
  return (
    <CartProvider>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Không tìm thấy' }} />
      </Stack>
    </CartProvider>
  )
}
