# Đức Hương – App thiết bị nhà bếp (Expo / React Native)

App khách hàng của shop **Thiết bị nhà bếp Đức Hương** (web: https://tienmeta94.github.io/bep-tu-store/):
xem sản phẩm, đặt hàng qua Zalo và đặt lịch sửa chữa tại nhà.

- Kế hoạch & lộ trình: xem [PLAN.md](./PLAN.md) (mốc A1–A4 + giai đoạn Supabase/phát hành).
- Công nghệ: Expo (React Native) + TypeScript + Expo Router; dữ liệu giai đoạn 1 dùng lại từ web.

## Chạy thử

```bash
npm install
npx expo start          # quét QR bằng Expo Go (dùng --tunnel nếu khác mạng)
npx expo start --web    # chạy bản web trong trình duyệt
```

Kiểm tra tĩnh: `npx tsc --noEmit` và `npx expo-doctor`.
