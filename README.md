# 📷 Camera24h.Shop - Hệ Thống Thương Mại Điện Tử

> Đồ án môn học **Chuyên đề ASP.NET + ReactJS**  
> Dự án e-commerce bán máy ảnh, ống kính và phụ kiện摄影器材

## 👤 Thông tin sinh viên

| Họ tên | Mã SV | Lớp |
|--------|-------|-----|
| Trần Trung Nhân | 2123110136 | 24DTH26 |

**Giảng viên hướng dẫn:** Ths. Nguyễn Cao Thái

---

## 🛠️ Công nghệ sử dụng

| Layer | Công nghệ | Phiên bản |
|-------|-----------|-----------|
| **Backend** | ASP.NET Core (MVC + Web API) | .NET 8.0 |
| **Frontend** | ReactJS + React Router DOM | React 19 |
| **Database** | SQL Server Express + Entity Framework Core | SQL Server / EF Core 8.0 |
| **ORM** | Entity Framework Core (Code-First) | 8.0.23 |
| **API Docs** | Swagger UI (Swashbuckle) | 10.1.7 |
| **HTTP Client** | Axios | 1.17.0 |
| **CSS** | Custom CSS + Bootstrap | - |

---

## 📁 Cấu trúc dự án

```
TrungNhan-CMS_Solution/
├── CMS.Data/                    # Data Access Layer (Class Library)
│   ├── Entities/                # 9 Entity classes
│   │   ├── Category.cs          # Danh mục bài viết
│   │   ├── Post.cs              # Bài viết blog
│   │   ├── CategoryProduct.cs   # Danh mục sản phẩm
│   │   ├── Product.cs           # Sản phẩm
│   │   ├── Customer.cs          # Khách hàng
│   │   ├── Order.cs             # Đơn hàng
│   │   ├── OrderDetail.cs       # Chi tiết đơn hàng
│   │   ├── User.cs              # Tài khoản quản trị
│   │   └── BannerImage.cs       # Ảnh banner
│   └── ApplicationDbContext.cs  # DbContext (9 DbSets)
│
├── CMS.Backend/                 # Presentation Layer (ASP.NET Core)
│   ├── Controllers/
│   │   ├── API Controllers/     # 7 API controllers
│   │   │   ├── ProductsController.cs
│   │   │   ├── PostsController.cs
│   │   │   ├── CategoriesController.cs
│   │   │   ├── CategoriesProductsController.cs
│   │   │   ├── OrdersController.cs
│   │   │   ├── AuthController.cs
│   │   │   └── BannerImagesController.cs
│   │   └── MVC Controllers/     # 10 Admin controllers
│   │       ├── HomeController.cs (Dashboard)
│   │       ├── AccountController.cs (Login/Logout)
│   │       ├── AdminProductsController.cs
│   │       ├── AdminOrdersController.cs
│   │       ├── AdminCustomersController.cs
│   │       ├── AdminCategoriesProductsController.cs
│   │       ├── AdminBannerImagesController.cs
│   │       ├── CategoryController.cs
│   │       ├── PostController.cs
│   │       └── UserController.cs
│   ├── Services/
│   │   └── EmailService.cs      # Gửi email xác nhận đơn hàng
│   ├── Views/                   # Razor Views (Admin UI)
│   ├── Program.cs               # Middleware & Services config
│   └── appsettings.json         # Connection string + SMTP config
│
└── cms.frontend/                # Client Layer (ReactJS)
    └── src/
        ├── api/axiosClient.js   # HTTP client chung
        ├── components/          # 12 reusable components
        ├── context/             # CartContext, ToastContext
        ├── pages/               # 7 pages
        │   ├── HomePage.jsx
        │   ├── ProductDetailPage.jsx
        │   ├── PostDetailPage.jsx
        │   ├── BlogPage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   └── OrderHistoryPage.jsx
        ├── services/            # 6 API service files
        └── utils/formatters.js  # formatPrice, formatDate
```

---

## 🚀 Hướng dẫn cài đặt & chạy dự án

### Yêu cầu
- .NET 8.0 SDK
- Node.js 18+ và npm
- SQL Server Express
- Visual Studio 2022 (khuyến nghị)

### 1. Database Setup

```bash
# Mở SQL Server Management Studio
# Tạo database mới:
CREATE DATABASE [TrungNhan-CMS_DB];
```

Hoặc chạy file SQL import dữ liệu mẫu:
```bash
# Import 89 sản phẩm mẫu từ mayanh24h.com
sqlcmd -S .\SQLEXPRESS -d TrungNhan-CMS_DB -i import_products.sql
```

### 2. Backend (ASP.NET Core)

```bash
# Mở Visual Studio → Open Solution → Chọn TrungNhan-CMS_Solution.sln

# Hoặc chạy từ terminal:
cd CMS.Backend
dotnet restore
dotnet run
```

**Backend chạy tại:** `http://localhost:5175`  
**Swagger UI:** `http://localhost:5175/swagger`  
**Admin Panel:** `http://localhost:5175/`

**Tài khoản Admin mặc định:**
| Username | Password | Vai trò |
|----------|----------|---------|
| admin | 123456 | Admin |
| editor | 123456 | Editor |

### 3. Frontend (ReactJS)

```bash
cd cms.frontend
npm install
npm start
```

**Frontend chạy tại:** `http://localhost:3000`

---

## 🌟 Tính năng chính

### 👥 Khách hàng (Frontend)
- 🔐 Đăng ký / Đăng nhập tài khoản
- 🏠 Trang chủ với banner slideshow, danh mục, sản phẩm nổi bật
- 🛍️ Duyệt sản phẩm theo danh mục, bộ lọc giá, tìm kiếm
- 📦 Chi tiết sản phẩm với ảnh gallery, thông số kỹ thuật
- 🛒 Giỏ hàng (thêm/xóa/sửa số lượng, tính tổng tiền)
- 💳 Thanh toán (COD / Chuyển khoản)
- 📋 Lịch sử đơn hàng
- 📰 Đọc bài viết blog

### 👨‍💼 Quản trị (Admin)
- 📊 Dashboard thống kê (doanh thu, đơn hàng, khách hàng)
- 📦 CRUD Sản phẩm (hỗ trợ upload nhiều ảnh)
- 📂 CRUD Danh mục sản phẩm
- 📰 CRUD Bài viết blog (CKEditor rich text)
- 📋 Quản lý Đơn hàng (duyệt, cập nhật trạng thái, xuất Word)
- 👤 Quản lý Khách hàng
- 🖼️ Quản lý Banner quảng cáo
- 👥 Quản lý Tài khoản Admin/Editor

---

## 📡 Danh mục Web API

| # | Method | Endpoint | Mô tả |
|---|--------|----------|-------|
| 1 | GET | `/api/Products` | Tất cả sản phẩm |
| 2 | GET | `/api/Products/{id}` | Chi tiết sản phẩm |
| 3 | GET | `/api/Products/category/{id}` | Sản phẩm theo danh mục |
| 4 | GET | `/api/Posts` | Tất cả bài viết |
| 5 | GET | `/api/Posts/{id}` | Chi tiết bài viết |
| 6 | GET | `/api/Categories` | Danh mục bài viết |
| 7 | GET | `/api/CategoriesProducts` | Danh mục sản phẩm |
| 8 | GET | `/api/BannerImages` | Banner đang hoạt động |
| 9 | POST | `/api/Orders` | Tạo đơn hàng |
| 10 | GET | `/api/Orders/customer/{id}` | Đơn hàng theo KH |
| 11 | POST | `/api/Auth/CustomerRegister` | Đăng ký KH |
| 12 | POST | `/api/Auth/CustomerLogin` | Đăng nhập KH |

---

## 🗃️ Database Schema (ERD)

```
Category (1) ──── (N) Post
CategoryProduct (1) ──── (N) Product
Customer (1) ──── (N) Order
Order (1) ──── (N) OrderDetail
Product (1) ──── (N) OrderDetail
```

---

## 🚀 Hướng dẫn cài đặt nhanh

### Yêu cầu hệ thống
- .NET 8.0 SDK
- Node.js 18+
- SQL Server Express

### Bước nhanh
```bash
# 1. Clone repo
git clone https://github.com/nhanthach2603/TrungNhan_0136_CMS_Solution.git

# 2. Import database
sqlcmd -S .\SQLEXPRESS -i import_products.sql

# 3. Chạy Backend
cd CMS.Backend && dotnet run

# 4. Chạy Frontend (cửa sổ terminal mới)
cd cms.frontend && npm install && npm start
```

---

## 📝 License

Dự án được tạo cho mục đích học tập.

---

*Tháng 06/2026 - Học phần Chuyên đề ASP.NET + ReactJS*
