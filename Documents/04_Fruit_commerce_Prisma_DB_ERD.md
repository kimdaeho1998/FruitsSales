# 과일 시즌 커머스 웹서비스 Prisma 기반 DB/ERD 명세서

## 1. 문서 개요

### 1.1 목적

본 문서는 **과일 시즌 커머스 웹서비스**의 PostgreSQL 데이터베이스 구조를 Prisma ORM 기준으로 정의한다.

본 명세서는 다음 구현의 기준 문서로 사용한다.

- Prisma `schema.prisma`
- PostgreSQL Schema
- Migration
- Seed Data
- Repository / Service Layer
- API Request / Response 설계
- 관리자 CRUD
- 주문 / 결제 / 배송 처리
- 테스트 데이터 생성

### 1.2 적용 기술

- Database: PostgreSQL
- ORM: Prisma
- Application: Next.js
- Language: TypeScript
- Primary Key: UUID
- Date/Time: UTC 저장 권장
- Money: 정수형 KRW 기준

---

# 2. 설계 원칙

## DB-001 UUID Primary Key

주요 Entity의 Primary Key는 UUID를 사용한다.

예:

```prisma
id String @id @default(uuid()) @db.Uuid
```

고객에게 노출되는 주문번호는 내부 PK와 분리한다.

---

## DB-002 금액은 정수형 저장

대한민국 원화(KRW)를 기준으로 금액을 소수점 없이 정수형으로 저장한다.

예:

```text
39,000원
→ 39000
```

권장 타입:

```prisma
Int
```

향후 매우 큰 금액 또는 다통화 지원이 필요하면 `BigInt` 또는 Decimal 전환을 검토한다.

---

## DB-003 주문 Snapshot

상품명, 옵션명, 가격은 주문 시점의 값을 OrderItem에 Snapshot으로 저장한다.

상품 정보가 이후 변경되더라도 과거 주문 기록은 변경되지 않아야 한다.

---

## DB-004 Order와 Payment 분리

주문과 결제는 별도 Entity로 관리한다.

하나의 Order에 여러 Payment 시도가 존재할 수 있다.

```text
ORDER 1:N PAYMENT
```

---

## DB-005 상품과 판매 옵션 분리

상품 자체와 실제 판매 단위를 분리한다.

```text
Product
  │
  └── ProductVariant
```

예:

```text
백도 복숭아

3kg 가정용
3kg 선물용
4kg 선물용
5kg 선물용
```

---

## DB-006 이미지 Binary DB 저장 금지

이미지 파일은 Cloudflare R2 등 Object Storage에 저장한다.

DB에는 다음 정보만 저장한다.

- URL
- Object Key
- Image Type
- Alt Text
- Display Order

---

## DB-007 Soft Delete 우선

주문 이력이 연결된 Product, Variant 등은 물리 삭제보다 비활성화를 우선한다.

예:

```text
saleStatus = INACTIVE
```

관리 기능에서 Delete가 필요한 경우 참조 무결성을 확인해야 한다.

---

# 3. 전체 Entity

MVP 핵심 Entity:

```text
User
Season
Product
ProductVariant
ProductImage
Order
OrderItem
Payment
Shipment
SiteSetting
```

선택 Entity:

```text
Notice
```

향후 확장 후보:

```text
Customer
Refund
InventoryHistory
NotificationSubscription
Coupon
OrderStatusHistory
```

---

# 4. ERD

```text
┌─────────────────┐
│      User       │
├─────────────────┤
│ id              │
│ username        │
│ passwordHash    │
│ name            │
│ role            │
│ isActive        │
│ lastLoginAt     │
└─────────────────┘


┌─────────────────┐
│     Season      │
├─────────────────┤
│ id              │
│ year            │
│ type            │
│ name            │
│ startDate       │
│ endDate         │
│ status          │
│ heroTitle       │
│ heroDescription │
│ heroImageUrl    │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│     Product     │
├─────────────────┤
│ id              │
│ seasonId        │
│ name            │
│ slug            │
│ category        │
│ variety         │
│ origin          │
│ description     │
│ saleStatus      │
│ displayOrder    │
└────────┬────────┘
         │
         ├────────────────────┐
         │                    │
         │ 1:N                │ 1:N
         ▼                    ▼
┌─────────────────┐   ┌─────────────────┐
│ ProductVariant  │   │  ProductImage   │
├─────────────────┤   ├─────────────────┤
│ id              │   │ id              │
│ productId       │   │ productId       │
│ optionName      │   │ imageUrl        │
│ weightOrCount   │   │ objectKey       │
│ grade           │   │ imageType       │
│ price           │   │ altText         │
│ stockStatus     │   │ displayOrder    │
│ saleStatus      │   └─────────────────┘
└────────┬────────┘
         │
         │ 1:N
         ▼
┌──────────────────────┐
│      OrderItem       │
├──────────────────────┤
│ id                   │
│ orderId              │
│ variantId            │
│ productNameSnapshot  │
│ optionNameSnapshot   │
│ quantity             │
│ unitPrice            │
│ totalPrice           │
└──────────┬───────────┘
           │
           │ N:1
           ▼
┌──────────────────────┐
│        Order         │
├──────────────────────┤
│ id                   │
│ orderNumber          │
│ customerName         │
│ customerPhone        │
│ receiverName         │
│ receiverPhone        │
│ postalCode           │
│ address1             │
│ address2             │
│ subtotalAmount       │
│ shippingAmount       │
│ totalAmount          │
│ orderStatus          │
│ paymentStatus        │
└──────────┬───────────┘
           │
           ├───────────────────────┐
           │                       │
           │ 1:N                   │ 1:N
           ▼                       ▼
┌──────────────────────┐   ┌──────────────────────┐
│       Payment        │   │       Shipment       │
├──────────────────────┤   ├──────────────────────┤
│ id                   │   │ id                   │
│ orderId              │   │ orderId              │
│ provider             │   │ carrier              │
│ paymentKey           │   │ trackingNumber       │
│ method               │   │ status               │
│ requestedAmount      │   │ shippedAt            │
│ approvedAmount       │   │ deliveredAt          │
│ status               │   └──────────────────────┘
│ approvedAt           │
│ cancelledAmount      │
└──────────────────────┘


┌──────────────────────┐
│     SiteSetting      │
├──────────────────────┤
│ id                   │
│ key                  │
│ value                │
│ description          │
└──────────────────────┘
```

---

# 5. Enum 정의

## 5.1 UserRole

```prisma
enum UserRole {
  OWNER
  ADMIN
}
```

---

## 5.2 SeasonType

```prisma
enum SeasonType {
  PEACH
  GOTGAM
  OFF_SEASON
}
```

---

## 5.3 SeasonStatus

```prisma
enum SeasonStatus {
  UPCOMING
  ACTIVE
  CLOSED
}
```

---

## 5.4 ProductCategory

```prisma
enum ProductCategory {
  HOME
  GIFT
}
```

필요 시 향후 `GENERAL` 등을 추가할 수 있다.

---

## 5.5 SaleStatus

```prisma
enum SaleStatus {
  ACTIVE
  INACTIVE
}
```

---

## 5.6 StockStatus

```prisma
enum StockStatus {
  IN_STOCK
  SOLD_OUT
}
```

---

## 5.7 ProductImageType

```prisma
enum ProductImageType {
  THUMBNAIL
  GALLERY
  DETAIL
}
```

---

## 5.8 OrderStatus

```prisma
enum OrderStatus {
  PAYMENT_PENDING
  PAID
  PREPARING
  READY_TO_SHIP
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

---

## 5.9 PaymentStatus

```prisma
enum PaymentStatus {
  READY
  IN_PROGRESS
  PAID
  FAILED
  CANCELLED
  PARTIALLY_CANCELLED
}
```

---

## 5.10 PaymentProvider

```prisma
enum PaymentProvider {
  TOSS
}
```

향후 다른 PG 추가 가능.

---

## 5.11 ShipmentStatus

```prisma
enum ShipmentStatus {
  READY
  SHIPPED
  DELIVERED
  CANCELLED
}
```

---

# 6. User

## 목적

관리자 계정을 관리한다.

고객 비회원 주문 계정과는 분리한다.

## Prisma Model

```prisma
model User {
  id           String    @id @default(uuid()) @db.Uuid
  username     String    @unique @db.VarChar(100)
  passwordHash String    @db.VarChar(255)
  name         String    @db.VarChar(100)
  role         UserRole  @default(ADMIN)
  isActive     Boolean   @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@index([isActive])
  @@map("users")
}
```

## 비즈니스 규칙

- `username`은 Unique
- Password 평문 저장 금지
- 비활성 관리자 로그인 차단
- `OWNER`는 최고 관리자 역할로 사용 가능

---

# 7. Season

## 목적

복숭아, 곶감, 비시즌의 운영 기간과 메인 콘텐츠를 관리한다.

## Prisma Model

```prisma
model Season {
  id              String       @id @default(uuid()) @db.Uuid
  year            Int
  type            SeasonType
  name            String       @db.VarChar(100)
  startDate       DateTime?
  endDate         DateTime?
  status          SeasonStatus @default(UPCOMING)
  heroTitle       String?      @db.VarChar(200)
  heroDescription String?      @db.Text
  heroImageUrl    String?      @db.Text
  displayOrder    Int          @default(0)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  products Product[]

  @@index([status])
  @@index([year, type])
  @@map("seasons")
}
```

## 비즈니스 규칙

- 고객 홈은 원칙적으로 `ACTIVE` 시즌 하나를 기준으로 렌더링한다.
- Application Layer에서 동시에 여러 시즌이 ACTIVE가 되지 않도록 검증한다.
- DB 레벨의 Partial Unique Index가 필요할 경우 Prisma Migration에 Raw SQL 추가를 검토한다.
- `OFF_SEASON`도 Season Entity로 표현 가능하다.

---

# 8. Product

## 목적

복숭아 또는 곶감의 상품 단위를 정의한다.

예:

- 백도 복숭아
- 황도 복숭아
- 상주 곶감

## Prisma Model

```prisma
model Product {
  id               String          @id @default(uuid()) @db.Uuid
  seasonId         String          @db.Uuid
  name             String          @db.VarChar(150)
  slug             String          @unique @db.VarChar(180)
  category         ProductCategory
  variety          String?         @db.VarChar(100)
  origin           String?         @db.VarChar(150)
  shortDescription String?         @db.VarChar(300)
  description      String?         @db.Text
  saleStatus       SaleStatus      @default(ACTIVE)
  displayOrder     Int             @default(0)
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  season   Season           @relation(fields: [seasonId], references: [id], onDelete: Restrict)
  variants ProductVariant[]
  images   ProductImage[]

  @@index([seasonId])
  @@index([seasonId, saleStatus])
  @@index([displayOrder])
  @@map("products")
}
```

## 비즈니스 규칙

- `slug`는 고객 URL에서 사용한다.
- 주문 이력이 있는 Product는 가급적 물리 삭제하지 않는다.
- 시즌 종료 후 `INACTIVE` 처리 가능
- 가격은 Product가 아니라 ProductVariant가 소유한다.

---

# 9. ProductVariant

## 목적

실제 구매 가능한 판매 옵션을 정의한다.

## Prisma Model

```prisma
model ProductVariant {
  id            String      @id @default(uuid()) @db.Uuid
  productId     String      @db.Uuid
  optionName    String      @db.VarChar(150)
  weightOrCount String?     @db.VarChar(100)
  grade         String?     @db.VarChar(100)
  price         Int
  stockStatus   StockStatus @default(IN_STOCK)
  saleStatus    SaleStatus  @default(ACTIVE)
  displayOrder  Int         @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  product    Product     @relation(fields: [productId], references: [id], onDelete: Restrict)
  orderItems OrderItem[]

  @@index([productId])
  @@index([productId, saleStatus, stockStatus])
  @@index([displayOrder])
  @@map("product_variants")
}
```

## 비즈니스 규칙

주문 생성 가능 조건:

```text
Product.saleStatus == ACTIVE
AND
ProductVariant.saleStatus == ACTIVE
AND
ProductVariant.stockStatus == IN_STOCK
```

---

# 10. ProductImage

## 목적

상품 이미지 Metadata를 저장한다.

## Prisma Model

```prisma
model ProductImage {
  id           String           @id @default(uuid()) @db.Uuid
  productId    String           @db.Uuid
  imageUrl     String           @db.Text
  objectKey    String?          @db.VarChar(500)
  imageType    ProductImageType
  altText      String?          @db.VarChar(255)
  displayOrder Int              @default(0)
  createdAt    DateTime         @default(now())

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId, imageType])
  @@index([productId, displayOrder])
  @@map("product_images")
}
```

## 비즈니스 규칙

- 실제 이미지 Binary는 DB에 저장하지 않는다.
- R2 삭제 시 `objectKey`를 기준으로 Object 삭제 가능
- 대표 이미지는 `THUMBNAIL` 사용
- 상품당 Thumbnail 수를 1개로 제한하려면 Application Layer 검증 또는 Partial Unique Index를 검토한다.

---

# 11. Order

## 목적

비회원 고객의 주문 Header 정보를 저장한다.

## Prisma Model

```prisma
model Order {
  id               String        @id @default(uuid()) @db.Uuid
  orderNumber      String        @unique @db.VarChar(50)

  customerName     String        @db.VarChar(100)
  customerPhone    String        @db.VarChar(30)

  receiverName     String        @db.VarChar(100)
  receiverPhone    String        @db.VarChar(30)

  postalCode       String        @db.VarChar(20)
  address1         String        @db.VarChar(255)
  address2         String?       @db.VarChar(255)
  requestMessage   String?       @db.VarChar(500)

  subtotalAmount   Int
  shippingAmount   Int
  totalAmount      Int

  orderStatus      OrderStatus   @default(PAYMENT_PENDING)
  paymentStatus    PaymentStatus @default(READY)

  adminMemo        String?       @db.Text

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  items      OrderItem[]
  payments   Payment[]
  shipments  Shipment[]

  @@index([orderStatus])
  @@index([paymentStatus])
  @@index([createdAt])
  @@index([customerPhone])
  @@index([orderNumber, customerPhone])
  @@map("orders")
}
```

## 비즈니스 규칙

총 금액:

```text
subtotalAmount + shippingAmount = totalAmount
```

모든 금액은 서버에서 계산한다.

---

# 12. OrderItem

## 목적

주문에 포함된 상품 옵션과 주문 시점 Snapshot을 저장한다.

## Prisma Model

```prisma
model OrderItem {
  id                   String @id @default(uuid()) @db.Uuid
  orderId              String @db.Uuid
  variantId            String @db.Uuid

  productNameSnapshot  String @db.VarChar(150)
  optionNameSnapshot   String @db.VarChar(150)

  quantity             Int
  unitPrice            Int
  totalPrice           Int

  createdAt            DateTime @default(now())

  order   Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variant ProductVariant @relation(fields: [variantId], references: [id], onDelete: Restrict)

  @@index([orderId])
  @@index([variantId])
  @@map("order_items")
}
```

## 계산 규칙

```text
quantity >= 1

unitPrice
=
주문 생성 시점 ProductVariant.price

totalPrice
=
unitPrice × quantity
```

---

# 13. Payment

## 목적

PG 결제 시도와 승인 결과를 저장한다.

## Prisma Model

```prisma
model Payment {
  id              String          @id @default(uuid()) @db.Uuid
  orderId         String          @db.Uuid
  provider        PaymentProvider @default(TOSS)
  paymentKey      String?         @unique @db.VarChar(255)
  method          String?         @db.VarChar(100)

  requestedAmount Int
  approvedAmount  Int?

  status          PaymentStatus   @default(READY)

  approvedAt      DateTime?
  cancelledAmount Int             @default(0)

  failureCode     String?         @db.VarChar(100)
  failureMessage  String?         @db.VarChar(500)

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  order Order @relation(fields: [orderId], references: [id], onDelete: Restrict)

  @@index([orderId])
  @@index([orderId, status])
  @@index([createdAt])
  @@map("payments")
}
```

## 관계

```text
Order 1:N Payment
```

## 비즈니스 규칙

- 결제 실패 후 새로운 Payment Row를 생성할 수 있다.
- `paymentKey`는 PG에서 발급된 경우 Unique
- 승인 전 `approvedAmount`는 NULL 가능
- 결제 성공 시 `approvedAmount == Order.totalAmount` 검증
- PG 취소 성공 이후 상태 변경

---

# 14. Shipment

## 목적

배송 정보를 저장한다.

초기에는 주문당 Shipment 1건이 대부분이지만 향후 분할 배송 가능성을 고려하여 `Order 1:N Shipment` 구조를 사용한다.

## Prisma Model

```prisma
model Shipment {
  id             String         @id @default(uuid()) @db.Uuid
  orderId        String         @db.Uuid
  carrier        String?        @db.VarChar(100)
  trackingNumber String?        @db.VarChar(100)
  status         ShipmentStatus @default(READY)

  shippedAt      DateTime?
  deliveredAt    DateTime?

  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  order Order @relation(fields: [orderId], references: [id], onDelete: Restrict)

  @@index([orderId])
  @@index([status])
  @@index([trackingNumber])
  @@map("shipments")
}
```

## 상태 흐름

```text
READY
 ↓
SHIPPED
 ↓
DELIVERED
```

예외:

```text
CANCELLED
```

---

# 15. SiteSetting

## 목적

관리자가 변경 가능한 사이트 운영 설정을 Key-Value 형태로 저장한다.

## Prisma Model

```prisma
model SiteSetting {
  id          String   @id @default(uuid()) @db.Uuid
  key         String   @unique @db.VarChar(100)
  value       String   @db.Text
  description String?  @db.VarChar(255)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("site_settings")
}
```

## 예시 Key

```text
BRAND_NAME
PHONE
SMS_PHONE
KAKAO_URL
BUSINESS_NUMBER
DEFAULT_SHIPPING_FEE
FREE_SHIPPING_THRESHOLD
DEFAULT_CARRIER
CUSTOMER_CENTER_HOURS
```

---

# 16. 선택 모델: Notice

```prisma
model Notice {
  id          String   @id @default(uuid()) @db.Uuid
  title       String   @db.VarChar(200)
  content     String   @db.Text
  isPublished Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isPublished, publishedAt])
  @@map("notices")
}
```

MVP에서 공지 기능이 필요하지 않다면 생략 가능하다.

---

# 17. 통합 schema.prisma 초안

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  OWNER
  ADMIN
}

enum SeasonType {
  PEACH
  GOTGAM
  OFF_SEASON
}

enum SeasonStatus {
  UPCOMING
  ACTIVE
  CLOSED
}

enum ProductCategory {
  HOME
  GIFT
}

enum SaleStatus {
  ACTIVE
  INACTIVE
}

enum StockStatus {
  IN_STOCK
  SOLD_OUT
}

enum ProductImageType {
  THUMBNAIL
  GALLERY
  DETAIL
}

enum OrderStatus {
  PAYMENT_PENDING
  PAID
  PREPARING
  READY_TO_SHIP
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  READY
  IN_PROGRESS
  PAID
  FAILED
  CANCELLED
  PARTIALLY_CANCELLED
}

enum PaymentProvider {
  TOSS
}

enum ShipmentStatus {
  READY
  SHIPPED
  DELIVERED
  CANCELLED
}

model User {
  id           String   @id @default(uuid()) @db.Uuid
  username     String   @unique @db.VarChar(100)
  passwordHash String   @db.VarChar(255)
  name         String   @db.VarChar(100)
  role         UserRole @default(ADMIN)
  isActive     Boolean  @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([isActive])
  @@map("users")
}

model Season {
  id              String       @id @default(uuid()) @db.Uuid
  year            Int
  type            SeasonType
  name            String       @db.VarChar(100)
  startDate       DateTime?
  endDate         DateTime?
  status          SeasonStatus @default(UPCOMING)
  heroTitle       String?      @db.VarChar(200)
  heroDescription String?      @db.Text
  heroImageUrl    String?      @db.Text
  displayOrder    Int          @default(0)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  products Product[]

  @@index([status])
  @@index([year, type])
  @@map("seasons")
}

model Product {
  id               String          @id @default(uuid()) @db.Uuid
  seasonId         String          @db.Uuid
  name             String          @db.VarChar(150)
  slug             String          @unique @db.VarChar(180)
  category         ProductCategory
  variety          String?         @db.VarChar(100)
  origin           String?         @db.VarChar(150)
  shortDescription String?         @db.VarChar(300)
  description      String?         @db.Text
  saleStatus       SaleStatus      @default(ACTIVE)
  displayOrder     Int             @default(0)
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  season   Season           @relation(fields: [seasonId], references: [id], onDelete: Restrict)
  variants ProductVariant[]
  images   ProductImage[]

  @@index([seasonId])
  @@index([seasonId, saleStatus])
  @@index([displayOrder])
  @@map("products")
}

model ProductVariant {
  id            String      @id @default(uuid()) @db.Uuid
  productId     String      @db.Uuid
  optionName    String      @db.VarChar(150)
  weightOrCount String?     @db.VarChar(100)
  grade         String?     @db.VarChar(100)
  price         Int
  stockStatus   StockStatus @default(IN_STOCK)
  saleStatus    SaleStatus  @default(ACTIVE)
  displayOrder  Int         @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  product    Product     @relation(fields: [productId], references: [id], onDelete: Restrict)
  orderItems OrderItem[]

  @@index([productId])
  @@index([productId, saleStatus, stockStatus])
  @@index([displayOrder])
  @@map("product_variants")
}

model ProductImage {
  id           String           @id @default(uuid()) @db.Uuid
  productId    String           @db.Uuid
  imageUrl     String           @db.Text
  objectKey    String?          @db.VarChar(500)
  imageType    ProductImageType
  altText      String?          @db.VarChar(255)
  displayOrder Int              @default(0)
  createdAt    DateTime         @default(now())

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId, imageType])
  @@index([productId, displayOrder])
  @@map("product_images")
}

model Order {
  id             String        @id @default(uuid()) @db.Uuid
  orderNumber    String        @unique @db.VarChar(50)
  customerName   String        @db.VarChar(100)
  customerPhone  String        @db.VarChar(30)
  receiverName   String        @db.VarChar(100)
  receiverPhone  String        @db.VarChar(30)
  postalCode     String        @db.VarChar(20)
  address1       String        @db.VarChar(255)
  address2       String?       @db.VarChar(255)
  requestMessage String?       @db.VarChar(500)

  subtotalAmount Int
  shippingAmount Int
  totalAmount    Int

  orderStatus   OrderStatus   @default(PAYMENT_PENDING)
  paymentStatus PaymentStatus @default(READY)

  adminMemo      String?  @db.Text
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  items     OrderItem[]
  payments  Payment[]
  shipments Shipment[]

  @@index([orderStatus])
  @@index([paymentStatus])
  @@index([createdAt])
  @@index([customerPhone])
  @@index([orderNumber, customerPhone])
  @@map("orders")
}

model OrderItem {
  id                  String @id @default(uuid()) @db.Uuid
  orderId             String @db.Uuid
  variantId           String @db.Uuid
  productNameSnapshot String @db.VarChar(150)
  optionNameSnapshot  String @db.VarChar(150)
  quantity            Int
  unitPrice           Int
  totalPrice          Int
  createdAt           DateTime @default(now())

  order   Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variant ProductVariant @relation(fields: [variantId], references: [id], onDelete: Restrict)

  @@index([orderId])
  @@index([variantId])
  @@map("order_items")
}

model Payment {
  id              String          @id @default(uuid()) @db.Uuid
  orderId         String          @db.Uuid
  provider        PaymentProvider @default(TOSS)
  paymentKey      String?         @unique @db.VarChar(255)
  method          String?         @db.VarChar(100)
  requestedAmount Int
  approvedAmount  Int?
  status          PaymentStatus   @default(READY)
  approvedAt      DateTime?
  cancelledAmount Int             @default(0)
  failureCode     String?         @db.VarChar(100)
  failureMessage  String?         @db.VarChar(500)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  order Order @relation(fields: [orderId], references: [id], onDelete: Restrict)

  @@index([orderId])
  @@index([orderId, status])
  @@index([createdAt])
  @@map("payments")
}

model Shipment {
  id             String         @id @default(uuid()) @db.Uuid
  orderId        String         @db.Uuid
  carrier        String?        @db.VarChar(100)
  trackingNumber String?        @db.VarChar(100)
  status         ShipmentStatus @default(READY)
  shippedAt      DateTime?
  deliveredAt    DateTime?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  order Order @relation(fields: [orderId], references: [id], onDelete: Restrict)

  @@index([orderId])
  @@index([status])
  @@index([trackingNumber])
  @@map("shipments")
}

model SiteSetting {
  id          String   @id @default(uuid()) @db.Uuid
  key         String   @unique @db.VarChar(100)
  value       String   @db.Text
  description String?  @db.VarChar(255)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("site_settings")
}
```

---

# 18. 관계 및 삭제 정책

| Parent | Child | 관계 | 삭제 정책 |
|---|---|---|---|
| Season | Product | 1:N | Restrict |
| Product | ProductVariant | 1:N | Restrict |
| Product | ProductImage | 1:N | Cascade |
| ProductVariant | OrderItem | 1:N | Restrict |
| Order | OrderItem | 1:N | Cascade |
| Order | Payment | 1:N | Restrict |
| Order | Shipment | 1:N | Restrict |

## 원칙

주문/결제/배송 이력은 감사 및 고객 대응에 필요하기 때문에 Cascade 삭제를 최소화한다.

Order 자체를 운영 UI에서 물리 삭제하는 기능은 제공하지 않는 것을 권장한다.

---

# 19. Index 설계

## 필수 Index

### Season

```text
status
year + type
```

### Product

```text
seasonId
seasonId + saleStatus
slug UNIQUE
displayOrder
```

### ProductVariant

```text
productId
productId + saleStatus + stockStatus
```

### Order

```text
orderNumber UNIQUE
orderStatus
paymentStatus
createdAt
customerPhone
orderNumber + customerPhone
```

### Payment

```text
paymentKey UNIQUE
orderId
orderId + status
createdAt
```

### Shipment

```text
orderId
status
trackingNumber
```

---

# 20. 주문 생성 Transaction

주문 생성은 Transaction으로 처리하는 것을 권장한다.

```text
BEGIN

1. Variant 조회
2. Product 상태 검증
3. Variant 상태 검증
4. 가격 조회
5. 주문 총액 계산
6. Order 생성
7. OrderItem 생성

COMMIT
```

Prisma 예:

```ts
await prisma.$transaction(async (tx) => {
  const variant = await tx.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  })

  // validation

  const order = await tx.order.create({
    data: {
      // ...
    },
  })

  await tx.orderItem.create({
    data: {
      orderId: order.id,
      variantId: variant.id,
      productNameSnapshot: variant.product.name,
      optionNameSnapshot: variant.optionName,
      quantity,
      unitPrice: variant.price,
      totalPrice: variant.price * quantity,
    },
  })
})
```

---

# 21. 결제 승인 Transaction

PG 승인 성공 후 DB 갱신은 Transaction으로 처리한다.

```text
PG Confirm 성공
        ↓
DB Transaction
        ↓
Payment PAID
        ↓
Order PaymentStatus PAID
        ↓
Order OrderStatus PAID
```

중복 요청에 대한 Idempotency를 반드시 고려한다.

---

# 22. 주문번호 생성 규칙

내부 UUID와 별도의 고객용 주문번호를 생성한다.

예:

```text
PF-20260828-A7F92
```

구성 예:

```text
PF
+
YYYYMMDD
+
Random Token
```

요구사항:

- Unique
- 단순 순번 노출 금지
- 추측이 어려운 Random 영역 포함
- 고객센터에서 읽기 쉬운 길이 유지

---

# 23. 전화번호 저장 정책

DB에는 검색 및 비교가 가능한 Canonical 형태로 저장하는 것을 권장한다.

예:

```text
01012345678
```

UI에서는:

```text
010-1234-5678
```

형태로 표시할 수 있다.

비회원 주문 조회 시 입력값을 Canonicalize한 뒤 비교한다.

---

# 24. 개인정보 관련 DB 정책

개인정보 대상:

- customerName
- customerPhone
- receiverName
- receiverPhone
- postalCode
- address1
- address2
- requestMessage

운영 환경에서는 다음을 고려한다.

- DB 접근 계정 최소 권한
- Production DB 직접 접근 제한
- Backup 보안
- 관리자 Authorization
- 로그에 개인정보 전체 출력 금지
- 주문 보관기간 정책
- 필요 시 애플리케이션 레벨 암호화 검토

---

# 25. Seed Data

최초 개발 Seed에 다음 데이터를 포함하는 것을 권장한다.

## 관리자

```text
OWNER 1명
```

실제 Production Password를 Seed 파일에 하드코딩하지 않는다.

## 시즌

```text
2026 PEACH
2026 GOTGAM
```

## 상품 Sample

```text
백도 복숭아
상주 곶감
```

## Variant Sample

```text
백도 복숭아
- 3kg 가정용
- 4kg 선물용
- 5kg 선물용

상주 곶감
- 20개입
- 30개입
- 선물세트
```

---

# 26. Migration 정책

Prisma Migration을 사용한다.

개발:

```bash
npx prisma migrate dev
```

Production:

```bash
npx prisma migrate deploy
```

원칙:

- Production에서 임의 `db push` 사용을 피한다.
- Migration File은 Git에 포함한다.
- Schema 변경은 Migration을 통해 추적한다.
- 데이터 손실 가능 Migration은 사전 Backup 후 적용한다.

---

# 27. 환경변수

필수:

```env
DATABASE_URL=
```

예:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
```

실제 Secret은 Repository에 Commit하지 않는다.

---

# 28. Prisma Client 관리

권장 Singleton:

```ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

개발 환경 Hot Reload에서 불필요한 Connection 증가를 방지한다.

---

# 29. Repository / Service 경계

Route Handler에서 Prisma Query를 무분별하게 직접 작성하지 않는 것을 권장한다.

예:

```text
app/api
   ↓
Service
   ↓
Repository / Prisma
   ↓
PostgreSQL
```

소규모 MVP에서는 과도한 Layering을 피하되, 다음 도메인은 Service 단위로 분리하는 것이 좋다.

```text
SeasonService
ProductService
OrderService
PaymentService
ShipmentService
AdminService
```

---

# 30. 주요 Query 요구사항

## 현재 시즌

```ts
prisma.season.findFirst({
  where: {
    status: "ACTIVE",
  },
})
```

---

## 현재 시즌 판매 상품

```ts
prisma.product.findMany({
  where: {
    seasonId,
    saleStatus: "ACTIVE",
  },
  include: {
    variants: {
      where: {
        saleStatus: "ACTIVE",
      },
    },
    images: true,
  },
  orderBy: {
    displayOrder: "asc",
  },
})
```

---

## 주문 조회

```ts
prisma.order.findFirst({
  where: {
    orderNumber,
    customerPhone,
  },
  include: {
    items: true,
    payments: true,
    shipments: true,
  },
})
```

---

# 31. 데이터 무결성 규칙

## 금액

```text
Order.subtotalAmount
=
SUM(OrderItem.totalPrice)
```

```text
Order.totalAmount
=
Order.subtotalAmount + Order.shippingAmount
```

## Item

```text
OrderItem.totalPrice
=
OrderItem.unitPrice × OrderItem.quantity
```

## Payment

결제 승인 성공 시:

```text
Payment.approvedAmount
=
Order.totalAmount
```

## 배송

`DELIVERED` 상태라면 원칙적으로 `deliveredAt`이 존재해야 한다.

`SHIPPED` 이상 상태라면 원칙적으로 `shippedAt`이 존재해야 한다.

---

# 32. Application Level Validation

Prisma Schema만으로 충분히 표현하기 어려운 다음 규칙은 Application Service에서 검증한다.

- ACTIVE Season은 하나만 허용
- 상품 옵션 가격은 0보다 커야 함
- 주문 수량은 1 이상
- 품절 상품 주문 차단
- 비활성 상품 주문 차단
- 주문금액 서버 재계산
- 결제금액 일치
- Order 상태 전이 검증
- Payment 상태 전이 검증
- Shipment 상태 전이 검증

---

# 33. 권장 상태 전이

## Order

```text
PAYMENT_PENDING
      │
      ▼
     PAID
      │
      ▼
  PREPARING
      │
      ▼
READY_TO_SHIP
      │
      ▼
   SHIPPED
      │
      ▼
 DELIVERED
```

취소/환불:

```text
PAYMENT_PENDING → CANCELLED

PAID → CANCELLED / REFUNDED
```

실제 취소 가능 여부는 PG/상품 준비 상태 정책과 함께 정의한다.

---

# 34. 향후 확장 모델

## Customer

회원제를 도입할 경우 추가.

```text
Customer
 └── Orders
```

현재 비회원 주문 구조는 유지한다.

---

## Refund

부분환불 및 복수 환불 처리가 복잡해지면 Payment 내부 필드만 사용하지 않고 별도 Entity로 분리한다.

```text
Payment
  │
  └── Refund
```

---

## InventoryHistory

실재고 수량 관리를 시작할 경우 추가.

```text
ProductVariant
   │
   └── InventoryHistory
```

---

## OrderStatusHistory

운영 감사 로그가 중요해지면 추가.

```text
Order
  │
  └── OrderStatusHistory
```

---

# 35. MVP DB 완료 기준

다음 조건을 모두 만족하면 Prisma 기반 MVP DB 구조가 완료된 것으로 본다.

- Prisma Client 생성 성공
- PostgreSQL 연결 성공
- 최초 Migration 성공
- User 모델 생성
- Season 모델 생성
- Product 모델 생성
- ProductVariant 모델 생성
- ProductImage 모델 생성
- Order 모델 생성
- OrderItem 모델 생성
- Payment 모델 생성
- Shipment 모델 생성
- SiteSetting 모델 생성
- 주요 Enum 생성
- 모든 FK Relation 검증
- 주요 Unique Constraint 검증
- 주요 Index 생성
- Seed Data 입력 가능
- 주문 Transaction 테스트
- 주문 Snapshot 테스트
- 가격 재계산 테스트
- Payment 1:N 관계 테스트
- 비회원 주문 조회 테스트
- 삭제 정책 테스트

---

# 36. 최종 DB 구조 요약

```text
SEASON
  │
  └── PRODUCT
        │
        ├── PRODUCT_VARIANT
        │       │
        │       └── ORDER_ITEM
        │               │
        │               └── ORDER
        │                    │
        │                    ├── PAYMENT
        │                    └── SHIPMENT
        │
        └── PRODUCT_IMAGE


USER
SITE_SETTING
```

본 프로젝트의 DB 설계 핵심은 다음 네 가지이다.

1. **Season과 Product를 분리하여 시즌형 판매를 지원한다.**
2. **Product와 ProductVariant를 분리하여 실제 판매 옵션과 가격을 관리한다.**
3. **OrderItem Snapshot을 저장하여 과거 주문 이력을 보존한다.**
4. **Order, Payment, Shipment를 분리하여 결제와 물류 상태를 독립적으로 관리한다.**

초기에는 이 구조를 유지하며, 실제 사업 운영에서 필요성이 확인된 경우에만 Customer, Refund, InventoryHistory, Notification 등 추가 Entity를 확장한다.
