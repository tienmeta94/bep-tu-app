import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { products } from '../data/products'

export interface CartItem {
  id: string
  qty: number
}

interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  add: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'duchuong-cart-v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as CartItem[]
            setItems(parsed.filter((i) => products.some((p) => p.id === i.id)))
          } catch {
            // Dữ liệu cũ hỏng — bỏ qua, bắt đầu giỏ trống
          }
        }
      })
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (loaded) void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, loaded])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0)
    const subtotal = items.reduce((sum, i) => {
      const p = products.find((x) => x.id === i.id)
      return sum + (p ? p.price * i.qty : 0)
    }, 0)
    return {
      items,
      count,
      subtotal,
      add: (id, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.id === id)
          if (existing)
            return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(99, i.qty + qty) } : i))
          return [...prev, { id, qty }]
        }),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart phải dùng trong CartProvider')
  return ctx
}
