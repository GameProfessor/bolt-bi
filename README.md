# BI Dashboard - Business Intelligence Platform

Nền tảng Business Intelligence hiện đại được xây dựng với Vue 3, TypeScript và TailwindCSS, cung cấp các công cụ phân tích dữ liệu và tạo dashboard trực quan.

## 🚀 Tính năng chính

- **Dashboard tương tác**: Tạo và quản lý dashboard với các biểu đồ động
- **Quản lý dữ liệu**: Kết nối và xử lý nhiều nguồn dữ liệu khác nhau
- **Biểu đồ đa dạng**: Hỗ trợ nhiều loại biểu đồ (Line, Bar, Pie, KPI Cards)
- **Template Designer**: Công cụ thiết kế template dashboard
- **Authentication**: Hệ thống xác thực và phân quyền
- **Responsive Design**: Giao diện thích ứng trên mọi thiết bị

## 🛠️ Công nghệ sử dụng

- **Frontend Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Pinia (Modular Store)
- **Routing**: Vue Router (Modular Routes)
- **Charts**: Chart.js
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Build Tool**: Vite

## 📁 Cấu trúc Project

```
src/
├── assets/                 # Tài nguyên tĩnh
│   ├── images/            # Hình ảnh
│   └── style/             # CSS/SCSS files
├── components/            # Vue Components
│   ├── charts/           # Components biểu đồ
│   ├── common/           # Components dùng chung
│   ├── dashboard/        # Components dashboard
│   ├── data/             # Components quản lý dữ liệu
│   ├── demo/             # Components demo
│   ├── layout/           # Components layout
│   └── ui/               # UI Components cơ bản
├── layouts/              # Layout templates
│   ├── AuthLayout.vue    # Layout cho trang đăng nhập
│   ├── DefaultLayout.vue # Layout chính của ứng dụng
│   ├── ErrorLayout.vue   # Layout cho trang lỗi
│   └── LayoutWrapper.vue # Wrapper quản lý layout
├── pages/                # Page components (Views)
│   ├── auth/             # Trang xác thực
│   ├── chart/            # Trang quản lý biểu đồ
│   ├── dashboard/        # Trang dashboard
│   ├── data/             # Trang quản lý dữ liệu
│   ├── design/           # Trang thiết kế
│   └── error/            # Trang lỗi
├── router/               # Vue Router configuration
│   ├── modules/          # Route modules
│   ├── guards.ts         # Router guards
│   └── index.ts          # Main router
├── services/             # API services
│   ├── api/              # API clients
│   ├── auth/             # Authentication services
│   ├── chart/            # Chart services
│   ├── dashboard/        # Dashboard services
│   └── data/             # Data services
├── stores/               # Pinia stores (State management)
│   ├── modules/          # Store modules
│   └── index.ts          # Store exports
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── App.vue               # Root component
```

## 🏗️ Kiến trúc hệ thống

### 1. **Layout System**
- **LayoutWrapper**: Component quản lý việc chọn layout dựa trên route meta
- **AuthLayout**: Layout đặc biệt cho trang đăng nhập với header/footer riêng
- **DefaultLayout**: Layout chính với header, sidebar, footer
- **ErrorLayout**: Layout đơn giản cho trang lỗi

### 2. **Router Architecture**
- **Modular Routes**: Routes được tổ chức theo modules (dashboard, chart, data, design)
- **Router Guards**: Hệ thống guards toàn diện cho authentication, authorization
- **Meta Properties**: Cấu hình layout, permissions, titles cho từng route

### 3. **State Management**
- **Modular Stores**: Pinia stores được tổ chức theo modules
- **App Store**: Quản lý state toàn cục (loading, notifications, navigation)
- **Feature Stores**: Stores riêng cho từng tính năng (dashboard, chart, data)

### 4. **Component Organization**
- **Feature-based**: Components được nhóm theo tính năng
- **Reusable**: Components UI có thể tái sử dụng
- **Composition API**: Sử dụng `<script setup>` syntax

## 🔐 Authentication & Authorization

### Router Guards
- **authGuard**: Kiểm tra trạng thái đăng nhập
- **permissionGuard**: Kiểm tra quyền truy cập
- **titleGuard**: Quản lý title trang động
- **loadingGuard**: Quản lý loading states
- **errorHandlerGuard**: Xử lý lỗi navigation

### Permission System
```typescript
interface UserPermissions {
  canViewDashboard: boolean
  canEditDashboard: boolean
  canViewCharts: boolean
  canEditCharts: boolean
  canViewData: boolean
  canEditData: boolean
  canViewDesign: boolean
  canEditDesign: boolean
  isAdmin: boolean
}
```

## 📊 Data Flow

1. **API Layer**: Services xử lý HTTP requests với Axios
2. **Store Layer**: Pinia stores quản lý state và business logic
3. **Component Layer**: Vue components hiển thị UI và xử lý user interactions
4. **Router Layer**: Guards kiểm soát navigation và permissions

## 🎨 Styling System

- **TailwindCSS**: Utility-first CSS framework
- **Custom Components**: Styled components với consistent design
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Chuẩn bị sẵn cho dark mode

## 🧪 Testing Strategy

- **Unit Tests**: Test individual components và functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test user workflows
- **Type Safety**: TypeScript đảm bảo type safety

## 📱 Responsive Design

- **Mobile First**: Thiết kế ưu tiên mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible Layouts**: Grid và Flexbox layouts
- **Touch Friendly**: UI elements phù hợp với touch devices

## 🔧 Development Setup

```bash
# Clone repository
git clone <repository-url>
cd bolt-bi

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Type checking
npm run type-check
```

## 📝 Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting và formatting
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message standards
- **Component Naming**: PascalCase cho components
- **File Naming**: kebab-case cho files

## 🚀 Deployment

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Static Hosting**: Có thể deploy lên Netlify, Vercel, GitHub Pages
- **Docker**: Dockerfile có sẵn cho containerization

## 📚 Documentation

- **Component Docs**: JSDoc comments cho components
- **API Docs**: OpenAPI/Swagger documentation
- **User Guide**: Hướng dẫn sử dụng cho end users
- **Developer Guide**: Hướng dẫn phát triển

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend**: Vue 3 + TypeScript
- **Backend**: API integration ready
- **Design**: TailwindCSS + Custom components
- **DevOps**: Vite + Modern tooling

## 📞 Support

- **Documentation**: [Link to docs]
- **Issues**: [GitHub Issues]
- **Email**: support@bidashboard.com
- **Discord**: [Community Discord]

---

**Made with ❤️ by BI Dashboard Team**
