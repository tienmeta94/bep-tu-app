import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

// Đơn hàng và phiếu sửa tạo trên máy — lưu AsyncStorage, xem lại ở mục "Của tôi".
// Giai đoạn 1 chưa có backend: đơn/phiếu chỉ thật sự tới shop khi khách bấm gửi Zalo.

export interface OrderLine {
  id: string
  name: string
  price: number
  qty: number
}

export interface Order {
  code: string
  createdAt: string // ISO
  customerName: string
  phone: string
  address: string
  note: string
  lines: OrderLine[]
  subtotal: number
  fee: number
}

export interface RepairTicket {
  code: string
  createdAt: string // ISO
  name: string
  phone: string
  address: string
  area: string
  device: string
  model: string
  symptom: string
  slot: string
}

interface OrdersContextValue {
  orders: Order[]
  tickets: RepairTicket[]
  addOrder: (order: Order) => void
  addTicket: (ticket: RepairTicket) => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)
const ORDERS_KEY = 'duchuong-orders-v1'
const TICKETS_KEY = 'duchuong-tickets-v1'

async function readList<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw) as T[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<RepairTicket[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([readList<Order>(ORDERS_KEY), readList<RepairTicket>(TICKETS_KEY)])
      .then(([o, t]) => {
        setOrders(o)
        setTickets(t)
      })
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (loaded) void AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders, loaded])

  useEffect(() => {
    if (loaded) void AsyncStorage.setItem(TICKETS_KEY, JSON.stringify(tickets))
  }, [tickets, loaded])

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders,
      tickets,
      addOrder: (order) => setOrders((prev) => [order, ...prev]),
      addTicket: (ticket) => setTickets((prev) => [ticket, ...prev]),
    }),
    [orders, tickets],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders phải dùng trong OrdersProvider')
  return ctx
}

export const formatDateTime = (iso: string): string => {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
