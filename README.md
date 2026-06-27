# 乌东文旅"衣食住行"综合服务平台
## 模块四：行——线路订票模块

技术栈：Node.js 24 + Midway.js 3.x + React 18 + Vite + Ant Design 5.x

---

## 快速启动

### 前置条件
- Node.js 20+ (当前 v24.15)
- MySQL 8.0 (当前 MySQL80 服务已运行)

### 1. 启动后端（终端 1）
cd server
npm run dev

后端地址: http://localhost:7001
API 文档: http://localhost:7001/swagger-ui/

### 2. 启动前端（终端 2）
cd web-pc
npm run dev

前端地址: http://localhost:5173

### 3. 访问页面
- 线路订票首页: http://localhost:5173/travel
- 景区详情: http://localhost:5173/travel/scenic-spots/1
- 路线详情: http://localhost:5173/travel/routes/1
- 旅游订单: http://localhost:5173/travel/orders

---

## API 接口

| 功能 | 方法 | 路径 |
|------|------|------|
| 景区列表 | GET | /api/scenic-spots |
| 景区详情 | GET | /api/scenic-spots/:id |
| 票种列表 | GET | /api/scenic-spots/:id/tickets |
| 路线列表 | GET | /api/routes |
| 路线详情 | GET | /api/routes/:id |
| 交通攻略 | GET | /api/transport-guides |
| 下单 | POST | /api/travel/orders |
| 订单列表 | GET | /api/travel/orders |
| 订单详情 | GET | /api/travel/orders/:id |
| 取消订单 | POST | /api/travel/orders/:id/cancel |
| 电子票列表 | GET | /api/e-tickets |
| 电子票详情 | GET | /api/e-tickets/:id |
| 核销 | POST | /api/e-tickets/verify |
| 评价列表/发布 | GET/POST | /api/travel/reviews |

---

## 数据库
- MySQL 用户: wudong / wudong123
- 数据库: wudong_wenlv
- 表数量: 42 张 (TypeORM 自动同步)
- 种子数据操作: database/seed/travel-seed.sql

---

## 页面与功能

1. 出行首页 (/travel) — 4个Tab：游玩路线、景区门票、交通攻略、我的电子票
2. 景区详情 (/travel/scenic-spots/1) — 选票种+数量+下单（需登录）
3. 路线详情 (/travel/routes/1) — 行程时间线+预订
4. 订单列表 (/travel/orders) — 我的旅游订单
5. 电子票详情 (/travel/e-tickets/1) — 二维码+有效期+核销状态
6. 管理后台 — 景区/路线/订单管理+电子票核销
7. 小程序 — 景区/路线/电子票/订单（微信开发者工具打开）
