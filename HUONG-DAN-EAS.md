# Hướng dẫn build bản cài thẳng lên điện thoại (EAS Build)

Mục tiêu: tạo **file APK Android** của app Đức Hương trên đám mây của Expo, lấy **link/QR cài
trực tiếp** trên trang build — điện thoại mở link là cài được, không cần máy chủ chạy liên tục.

> iPhone: bản cài nội bộ trên iOS bị Apple bắt đăng ký thiết bị (UDID) trước. Hãy thử Android
> trước; iOS xử lý ở giai đoạn phát hành/TestFlight.

## Chuẩn bị một lần

1. Tạo tài khoản Expo miễn phí tại https://expo.dev/signup
2. Trên máy tính của bạn:

```bash
git clone https://github.com/tienmeta94/bep-tu-app.git
cd bep-tu-app
npm install
npx eas-cli login        # đăng nhập tài khoản Expo vừa tạo
npx eas-cli init         # liên kết project — lệnh này ghi projectId vào app.json, hãy commit lại file app.json sau khi chạy
```

## Mỗi lần muốn có bản cài mới

```bash
npx eas-cli build --profile preview --platform android
```

- Lần build đầu tiên, EAS sẽ hỏi tạo **keystore** ký app → chọn **Yes** để EAS tự quản lý.
- Build chạy trên máy chủ Expo (thường 10–20 phút). Xong, trang kết quả (mở từ link EAS in ra
  terminal, hoặc mục **Builds** trên expo.dev) hiện **mã QR + nút Install**.
- Trên điện thoại Android: quét QR / mở link → tải APK → cài đặt (cho phép "cài từ trình duyệt"
  nếu máy hỏi). App "Đức Hương – Thiết bị nhà bếp" xuất hiện như app thường.
- Muốn người khác cùng thử (gia đình, nhân viên shop): gửi họ cùng link build đó là cài được.

## Các profile đã cấu hình sẵn trong `eas.json`

| Profile | Dùng để |
| --- | --- |
| `preview` | Bản APK nội bộ để cài thử trên điện thoại (đang dùng) |
| `development` | Bản dev client — chỉ cần khi muốn debug native sâu |
| `production` | Bản AAB để nộp Google Play ở giai đoạn phát hành |

## Sau này phát hành chính thức

- Google Play: cần tài khoản Play Developer (25 USD một lần) → dùng profile `production` +
  `npx eas-cli submit`.
- App Store: cần Apple Developer (99 USD/năm) → TestFlight hoặc submit qua EAS.
