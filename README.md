# 🎵 Music Streaming Web App

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://vannguyen799.github.io/MusicApp-AngularJS/redirect)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-Backend-blue)](https://script.google.com/)
[![AngularJS](https://img.shields.io/badge/AngularJS-Frontend-red)](https://angularjs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-Database-green)](https://www.mongodb.com/atlas)

> 🎧 **Một ứng dụng nghe nhạc trực tuyến hiện đại, sử dụng Google Drive làm kho lưu trữ và Google Sheets làm cơ sở dữ liệu chính**

## 📖 Tổng quan

Music Streaming Web App là một ứng dụng web cho phép người dùng nghe nhạc trực tuyến từ các file audio được lưu trữ trên Google Drive. Ứng dụng sử dụng Google Sheets để quản lý metadata của bài hát và MongoDB Atlas để lưu trữ thông tin người dùng.

### ✨ Tính năng chính

- 🎵 **Phát nhạc trực tuyến** từ Google Drive
- 📝 **Quản lý playlist** cá nhân
- ❤️ **Yêu thích bài hát** và tạo danh sách ưa thích
- 🎤 **Hiển thị lời bài hát** với hỗ trợ đa ngôn ngữ (Tiếng Việt, Tiếng Anh)
- 🔍 **Tìm kiếm và lọc** bài hát theo tên, ca sĩ
- 📊 **Thống kê lượt nghe** cho từng bài hát
- 👤 **Đăng nhập/Đăng ký** người dùng
- 📱 **Giao diện responsive** hoạt động tốt trên mọi thiết bị

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AngularJS     │    │  Google Apps     │    │  Google Drive   │
│   Frontend      │◄──►│     Script       │◄──►│  Audio Files    │
│                 │    │   (Backend)      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Google Sheets   │    │  MongoDB Atlas  │
                       │   (Metadata)     │    │  (User Data)    │
                       └──────────────────┘    └─────────────────┘
```

## 🛠️ Công nghệ sử dụng

### Backend
- **Google Apps Script** - Server-side logic và API endpoints
- **Google Sheets API** - Quản lý metadata bài hát
- **Google Drive API** - Lưu trữ và streaming file audio
- **MongoDB Atlas Data API** - Lưu trữ thông tin người dùng

### Frontend
- **AngularJS 1.8.2** - Framework JavaScript
- **Bootstrap 5.3.1** - UI Framework
- **HTML5 Audio API** - Phát nhạc
- **CSS3** - Styling và animations

### Development Tools
- **Google CLASP** - Deploy và quản lý Google Apps Script
- **TypeScript definitions** - Type safety cho Google Apps Script

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js (phiên bản 14 trở lên)
- Tài khoản Google
- Tài khoản MongoDB Atlas
- Google Apps Script project

### Bước 1: Clone repository
```bash
git clone https://github.com/vannguyen799/MusicApp-AngularJS.git
cd MusicApp-AngularJS
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình Google Apps Script

1. **Tạo Google Apps Script project mới**
   - Truy cập [script.google.com](https://script.google.com)
   - Tạo project mới

2. **Cấu hình CLASP**
   ```bash
   npx clasp login
   npx clasp create --type webapp --title "Music Streaming App"
   ```

3. **Deploy code lên Google Apps Script**
   ```bash
   npx clasp push
   ```

### Bước 4: Cấu hình Google Sheets

1. **Tạo Google Spreadsheet mới** để lưu metadata bài hát
2. **Thiết lập cấu trúc sheet** với các cột:
   - `name` - Tên bài hát
   - `singer` - Ca sĩ
   - `vname` - Tên tiếng Việt
   - `vsinger` - Ca sĩ tiếng Việt
   - `link up` - Link Google Drive
   - `status` - Trạng thái
   - `filename` - Tên file
   - `listens` - Lượt nghe
   - `lyric` - Lời bài hát
   - `lyric_vn` - Lời tiếng Việt
   - `lyric_en` - Lời tiếng Anh

### Bước 5: Cấu hình MongoDB Atlas

1. **Tạo cluster MongoDB Atlas**
2. **Tạo database với 2 collections:**
   - `Users` - Thông tin người dùng
   - `songs` - Thông tin bài hát

3. **Cấu hình Data API** và lấy API key

### Bước 6: Cấu hình secrets

Tạo file `src/_secrect.js` với nội dung:
```javascript
var secrect_ = {
    secrectKey: "your-secret-key",
    driveApiKey: ["your-drive-api-key"],
    db: {
        url: "your-mongodb-atlas-data-api-url",
        apiKey: "your-mongodb-api-key",
        dataSource: "your-cluster-name",
        database: "your-database-name"
    }
}
```

### Bước 7: Deploy webapp

1. **Deploy Google Apps Script như webapp**
   ```bash
   npx clasp deploy
   ```

2. **Cấu hình quyền truy cập:**
   - Execute as: "Me"
   - Who has access: "Anyone"

## 📚 API Documentation

### Authentication Endpoints
- `POST /login` - Đăng nhập người dùng
- `POST /register` - Đăng ký tài khoản mới
- `POST /logout` - Đăng xuất

### Song Management
- `GET /getSongs` - Lấy danh sách bài hát theo category
- `GET /getAllSheetName` - Lấy tất cả categories
- `POST /updateSong` - Cập nhật thông tin bài hát
- `POST /setFavoriteSong` - Thêm bài hát yêu thích
- `POST /rmvFavoriteSong` - Xóa bài hát yêu thích

### Playlist Management
- `GET /getPlaylist` - Lấy playlist của người dùng
- `POST /addPlaylist` - Tạo playlist mới
- `POST /removePlaylist` - Xóa playlist
- `POST /updatePlaylist` - Cập nhật playlist

## 🎯 Cách sử dụng

### 1. Truy cập ứng dụng
Mở trình duyệt và truy cập URL webapp đã deploy

### 2. Đăng nhập/Đăng ký
- Click "Login/Register" ở góc phải
- Tạo tài khoản mới hoặc đăng nhập

### 3. Duyệt nhạc
- Chọn category từ menu điều hướng
- Sử dụng thanh tìm kiếm để lọc bài hát
- Click vào bài hát để phát nhạc

### 4. Quản lý playlist
- Tạo playlist mới từ panel bên phải
- Thêm bài hát vào playlist
- Quản lý và chỉnh sửa playlist

## 🔧 Development

### Cấu trúc thư mục
```
src/
├── controller/          # AngularJS controllers
├── service/            # Business logic services
├── model/              # Data models
├── sheet/              # Google Sheets integration
├── rpc/                # JSON-RPC server
├── view/               # HTML templates
├── type/               # TypeScript definitions
├── app.js              # Main application file
├── server.js           # Server configuration
└── database.js         # Database connections
```

### Chạy development mode
```bash
# Watch và auto-push changes
npx clasp push --watch
```


## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Tác giả

**Van Nguyen** - [GitHub](https://github.com/vannguyen799)

## 🔗 Links

- **Live Demo**: [https://vannguyen799.github.io/MusicApp-AngularJS/redirect](https://vannguyen799.github.io/MusicApp-AngularJS/redirect)
- **Repository**: [https://github.com/vannguyen799/MusicApp-AngularJS](https://github.com/vannguyen799/MusicApp-AngularJS)

---

⭐ **Nếu project này hữu ích, hãy cho một star nhé!** ⭐
