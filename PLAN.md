# PLAN — App BepTu Store (bản phác thảo, chờ duyệt)

> App di động cho khách hàng của shop BepTu Store: **xem hàng + đặt hàng** và **đặt lịch sửa
> chữa tại nhà** — hai mảng của web https://tienmeta94.github.io/bep-tu-store/ đưa lên điện
> thoại. Bản này là phác thảo để duyệt hướng đi, chưa viết code.

## 1. Vì sao làm app cho BepTu Store trước

- Web BepTu Store có đủ cả hai mảng **bán + sửa** nên app tận dụng được trọn vẹn; web Hoang
  Lighting chỉ có bán (sau này nhân bản mẫu app sang rất nhanh, bỏ phần sửa).
- Toàn bộ dữ liệu mẫu đã có sẵn từ web: 16 sản phẩm, 3 nhóm dịch vụ sửa + bảng giá, thông tin
  shop (`products.ts`, `services.ts`, `config.ts`) — app dùng lại nguyên, không nhập lại.

## 2. Công nghệ

| Hạng mục | Chọn | Lý do |
| --- | --- | --- |
| Framework | **Expo (React Native) + TypeScript** | Đúng stack React Native bạn đang làm hằng ngày; một codebase cho Android + iOS |
| Điều hướng | Expo Router (tab + stack) | Chuẩn hiện tại của Expo, cấu trúc giống thư mục web |
| Dữ liệu giai đoạn 1 | File dữ liệu dùng lại từ web + lưu máy (AsyncStorage) cho giỏ hàng & phiếu sửa | Chạy ngay không cần backend |
| Dữ liệu giai đoạn 2 | **Supabase dùng chung với web** | Một backend cho cả web + app; trang admin của web quản luôn dữ liệu app — không quản hai nơi |
| Đặt hàng / phiếu sửa | Mở Zalo với nội dung soạn sẵn (giống web) | Thói quen khách Việt; không cần cổng thanh toán ở giai đoạn đầu |
| Đóng gói phát hành | EAS Build (đám mây của Expo) | Máy của Muse không build native được; EAS build APK/AAB/IPA bằng tài khoản Expo của bạn |

## 3. Màn hình & luồng chính

Thanh tab dưới cùng 5 mục: **Trang chủ · Sản phẩm · Sửa chữa · Giỏ hàng · Của tôi**

- **Trang chủ:** banner shop, lối tắt 4 danh mục, sản phẩm nổi bật (cuộn ngang), khối "Thiết
  bị hỏng?" dẫn sang đặt lịch sửa, sản phẩm bán chạy.
- **Sản phẩm:** danh sách có tìm kiếm (gõ không dấu), lọc danh mục + khoảng giá, sắp xếp —
  giống web; trang chi tiết có thông số, chọn số lượng, Thêm vào giỏ / Mua ngay, thanh mua
  dính đáy.
- **Sửa chữa:** 3 nhóm dịch vụ + bảng giá tham khảo từng lỗi, quy trình 4 bước, nút Đặt lịch.
- **Đặt lịch sửa:** form (tên, SĐT, địa chỉ, khu vực, thiết bị, triệu chứng, khung giờ) có
  kiểm tra dữ liệu → tạo phiếu mã `SC…` → gửi qua Zalo / sao chép; phiếu được **lưu trong máy**
  để khách xem lại ở mục "Của tôi".
- **Giỏ hàng & đặt hàng:** sửa số lượng, tính phí ship (miễn phí từ 2.000.000đ, dưới thì
  40.000đ — giống web) → form thông tin → tạo đơn mã `BTS…` → gửi Zalo / sao chép.
- **Của tôi:** danh sách phiếu sửa + đơn hàng đã tạo trên máy này, thông tin shop, giờ mở cửa,
  nút gọi hotline / nhắn Zalo.

Chưa làm ở giai đoạn 1: đăng ký/đăng nhập, thanh toán online, thông báo đẩy — để giai đoạn
Supabase (đăng nhập + đồng bộ phiếu/đơn giữa web và app, shop nhận thông báo khi có phiếu mới).

## 4. Lộ trình (mỗi mốc: build → Muse tự kiểm chứng phần làm được → bạn chạy thử trên máy bạn)

| Mốc | Nội dung | Đầu ra kiểm chứng được |
| --- | --- | --- |
| A1 — Khung + trang chủ ✅ | Khởi tạo Expo + TS, tab navigation, giao diện cam/xanh navy như web, trang chủ đầy đủ với dữ liệu thật (mẫu) | Chạy bản web của app để Muse tự bấm thử + chụp màn hình; bạn quét QR Expo Go xem trên điện thoại |
| A2 — Mua sắm | Danh sách + lọc/tìm/sắp xếp, chi tiết sản phẩm, sản phẩm liên quan | Tìm "bep tu doi" không dấu ra đúng hàng; lọc giá chạy đúng |
| A3 — Giỏ + đặt hàng | Giỏ lưu trên máy, tính ship, form đặt hàng, tạo đơn BTS… mở Zalo soạn sẵn | Đặt thử 1 đơn, nội dung Zalo đúng tổng tiền |
| A4 — Sửa chữa | Trang dịch vụ, form đặt lịch có validate, phiếu SC… lưu máy, mục "Của tôi" | Đặt thử 1 phiếu, mở lại app vẫn thấy phiếu |
| Giai đoạn 2 | Nối Supabase (dữ liệu thật, đăng nhập, đồng bộ), EAS Build, đưa lên CH Play / App Store | Cần tài khoản developer của bạn (mục 6) |

## 4b. Bản cài thẳng qua EAS (đã chuẩn bị 2026-10-30)

- Đã có sẵn `eas.json` (profile `preview` xuất APK Android để cài nội bộ) và mã định danh app
  `vn.duchuong.beptuapp` trong `app.json`; hướng dẫn từng bước ở `HUONG-DAN-EAS.md`.
- Người dùng cần: tạo tài khoản Expo miễn phí, `npx eas-cli login` + `npx eas-cli init` một lần
  trên máy mình, sau đó mỗi lần build chỉ một lệnh — trang kết quả của Expo cho QR/link cài
  trực tiếp lên điện thoại Android. iOS cài nội bộ phải đăng ký UDID nên để giai đoạn TestFlight.

## 5. Cách chạy thử — nói thẳng giới hạn

- Máy Linux của Muse **không chạy được giả lập Android/iOS** (không có KVM; iOS chỉ có trên
  macOS) — Muse kiểm chứng bằng: biên dịch TypeScript, unit test logic, và chạy **bản web của
  app** trong trình duyệt của Muse để bấm thử từng màn hình + chụp ảnh gửi bạn.
- Bạn chạy thử bản native trên điện thoại của bạn: cài **Expo Go**, quét mã QR (chế độ tunnel
  qua internet, không cần chung Wi-Fi) hoặc clone repo về chạy `npx expo start`. Lỗi/hình ảnh
  lạ bạn gửi lại, Muse sửa tiếp.
- Khi gần phát hành: chuyển sang **EAS dev build** cài thẳng vào máy bạn — chạy như app thật,
  gồm cả phần native mà Expo Go không có.

## 6. Việc cần bạn chốt / cung cấp khi bắt đầu

1. **Tên app hiển thị** (đề xuất: "BepTu Store" — trùng tên web; đổi sau vẫn được nhưng nên
   chốt trước khi phát hành).
2. **Repo GitHub mới** cho app nếu muốn Muse đẩy code như 2 web trước: bạn tạo repo Public
   trống (đề xuất tên `bep-tu-app`) và mở rộng token hiện tại sang repo này (Contents +
   Workflows) — đúng quy trình đã làm 2 lần. Chưa có repo thì Muse vẫn làm và giữ code ở máy
   Muse trước cũng được.
3. Khi tới giai đoạn phát hành (chưa cần ngay): tài khoản Expo (miễn phí), Google Play
   Developer (25 USD một lần), Apple Developer (99 USD/năm) — giá tham khảo tại thời điểm
   viết plan, kiểm tra lại khi thực hiện.

## 7. Ngoài phạm vi bản này

- App riêng cho Hoang Lighting (nhân bản từ app này khi cần).
- App nội bộ cho shop (nhận phiếu/đơn, đổi trạng thái xử lý) — nếu làm Supabase giai đoạn 2,
  trang admin web đã gánh phần lớn nhu cầu này.
