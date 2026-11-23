# 🎯 ICOIN 2027 Technical English Roadmap - Web Frontend

Giao diện Web theo dõi Lộ trình học Tiếng Anh Chuyên ngành (B1 ➔ B2/C1) phục vụ Hội thảo Quốc tế **ICOIN 2027** (AI, LLM, OWC, OCC, Firmware, Hardware, IoT).

## 🌟 Tính năng
- **Single Page App (SPA)** thuần HTML5/CSS3/Vanilla JS, không cần cài đặt node_modules hay build phức tạp.
- **Hỗ trợ GitHub Pages**: Chạy trực tiếp từ thư mục gốc của repository.
- **Bảo mật**: Kết nối an toàn tới Server C++ local (hoặc qua IP Tailscale) thông qua chữ ký xác thực HMAC-SHA256 kết hợp Device UUID.
- **Luyện nói & Nghe tại chỗ**: Tích hợp Text-To-Speech (phát âm bản ngữ) và Speech Recognition (nhận dạng giọng nói luyện phản xạ).

## 🚀 Triển khai nhanh trên GitHub Pages
1. Tạo một repository mới trên GitHub (ví dụ: `icoin_2027_roadmap` hoặc `icoin-roadmap-web`).
2. Push mã nguồn này lên nhánh `main`.
3. Vào **Settings ➔ Pages** trên GitHub repository:
   - Source: **Deploy from a branch**
   - Branch: **main**, Folder: **/ (root)** ➔ Bấm **Save**.
4. Truy cập trang web: `https://<tên_github>.github.io/<tên_repo>/`.
5. Bấm vào nút **"Chưa xác thực Token"**, nhập:
   - **Địa chỉ Server C++**: IP Tailscale của máy bạn (hoặc `http://localhost:8766`).
   - **Token thiết bị**: Token do Bot Quản gia Telegram cấp (`v1.<uuid>.<auth_code>.<mac>`).
