# 과일 시즌 커머스 웹서비스 프로젝트 아키텍처 명세서

## 1. 문서 개요

### 1.1 목적

본 문서는 **과일 시즌 커머스 웹서비스**의 시스템 구성, 애플리케이션 구조, 데이터 흐름, 외부 연동, 보안 경계, 배포 구조 및 향후 확장 원칙을 정의한다.

본 문서는 다음 작업의 기준으로 사용한다.

- 프로젝트 Scaffold
- Repository 구조 설계
- Frontend / Backend 경계 설정
- API 구현
- Prisma / PostgreSQL 연결
- 관리자 인증
- 이미지 업로드
- 주문 / 결제 / 배송 처리
- 배포 및 환경변수 구성
- 테스트 전략
- 운영 및 유지보수

---

# 2. 프로젝트 아키텍처 목표

본 프로젝트는 가족 단위 운영자가 실제로 유지보수 가능한 구조를 목표로 한다.

핵심 목표:

1. 초기 개발 복잡도를 낮춘다.
2. 고객 화면과 관리자 화면을 하나의 애플리케이션에서 관리한다.
3. 별도 Backend 서버를 두지 않는다.
4. 서버에서 가격, 주문, 결제 상태를 최종 검증한다.
5. PostgreSQL을 단일 Source of Truth로 사용한다.
6. 이미지 파일은 Object Storage로 분리한다.
7. 결제는 PG에 위임하고 민감 결제정보를 직접 저장하지 않는다.
8. 실제 사업 확장 전까지 Microservice를 도입하지 않는다.
9. 필요성이 검증된 기능만 점진적으로 확장한다.

---

# 3. Architecture Style

본 프로젝트의 기본 Architecture Style은 다음과 같다.

> **Mobile First Responsive Monolithic Web Application**

구성:

```text
Customer Web
Admin Web
API
Business Logic
Authentication
Order Processing
Payment Processing
Shipping Processing

→ Single Next.js Application
```

---

# 4. 전체 시스템 아키텍처

```text
                           ┌────────────────────┐
                           │      Customer      │
                           │   Mobile/Desktop   │
                           └─────────┬──────────┘
                                     │
                                     │ HTTPS
                                     ▼
                           ┌────────────────────┐
                           │     Cloudflare     │
                           │ DNS / CDN / HTTPS  │
                           └─────────┬──────────┘
                                     │
                                     ▼
                           ┌────────────────────┐
                           │       Vercel       │
                           │     Next.js App    │
                           └─────────┬──────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
     ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
     │   PostgreSQL   │    │ Cloudflare R2  │    │ Toss Payments  │
     │ Prisma / Data  │    │ Product Images │    │ Payment API    │
     └────────────────┘    └────────────────┘    └────────────────┘

                                     ▲
                                     │
                           ┌─────────┴──────────┐
                           │       Admin        │
                           │  Mobile/Desktop    │
                           └────────────────────┘
```

---

# 5. 주요 기술 스택

## 5.1 Application

- Next.js
- React
- TypeScript

## 5.2 UI

- Tailwind CSS
- shadcn/ui
- Lucide React

## 5.3 Form / Validation

- React Hook Form
- Zod

## 5.4 State

- Zustand

## 5.5 Backend Runtime

- Next.js Route Handlers
- Next.js Server Actions

## 5.6 Database

- PostgreSQL

## 5.7 ORM

- Prisma

## 5.8 Storage

- Cloudflare R2

## 5.9 Payment

- Toss Payments

## 5.10 Address

- Daum Postcode API

## 5.11 Deployment

- Vercel

## 5.12 Network / CDN

- Cloudflare

## 5.13 Analytics

- GA4 또는 Cloudflare Web Analytics

---

# 6. 초기 제외 기술

다음 기술은 MVP 단계에서 사용하지 않는다.

```text
FastAPI
Spring Boot
Separate Backend Repository
Redis
Kafka
RabbitMQ
Kubernetes
Docker Swarm
Elasticsearch
GraphQL
React Native
Flutter
Microservices
Dedicated API Gateway
Event Bus
Separate Authentication Server
```

도입은 실제 운영 요구가 발생한 이후 검토한다.

---

# 7. Application Layer 구조

```text
Presentation Layer
        │
        ▼
Application / Service Layer
        │
        ▼
Data Access Layer
        │
        ▼
Infrastructure / External Services
```

---

# 8. Presentation Layer

역할:

- 화면 렌더링
- 사용자 입력
- Form Validation
- Route Navigation
- UI State
- API 호출
- Server Action 호출

구성:

```text
app/
components/
```

고객 영역:

```text
app/(customer)
```

관리자 영역:

```text
app/admin
```

---

# 9. Application / Service Layer

비즈니스 로직은 가능한 한 Route Handler에서 분리한다.

권장 Service:

```text
SeasonService
ProductService
OrderService
PaymentService
ShipmentService
AdminAuthService
SiteSettingService
ImageService
```

예:

```text
Route Handler
     │
     ▼
Zod Validation
     │
     ▼
OrderService
     │
     ▼
Prisma Transaction
```

---

# 10. Data Access Layer

초기에는 별도의 복잡한 Repository Pattern을 강제하지 않는다.

Prisma Client를 직접 Service Layer에서 사용할 수 있다.

권장:

```text
Service
   │
   ▼
Prisma Client
   │
   ▼
PostgreSQL
```

프로젝트가 커질 경우 다음 구조로 확장 가능하다.

```text
Service
   │
   ▼
Repository
   │
   ▼
Prisma
```

---

# 11. Infrastructure Layer

외부 시스템을 독립적인 Adapter 형태로 관리한다.

예:

```text
lib/
├── db/
├── auth/
├── payment/
├── storage/
└── validation/
```

Infrastructure 예:

```text
TossPaymentClient
R2StorageClient
PrismaClient
SessionManager
```

---

# 12. Repository 구조

```text
fruit-season-commerce/
│
├── app/
│   │
│   ├── (customer)/
│   │   ├── page.tsx
│   │   ├── season/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── payment/
│   │   ├── order/
│   │   ├── story/
│   │   ├── guide/
│   │   └── contact/
│   │
│   ├── admin/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── seasons/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── shipping/
│   │   └── settings/
│   │
│   ├── api/
│   │   ├── seasons/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── payments/
│   │   └── admin/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── order/
│   └── admin/
│
├── services/
│   ├── season.service.ts
│   ├── product.service.ts
│   ├── order.service.ts
│   ├── payment.service.ts
│   ├── shipment.service.ts
│   ├── admin-auth.service.ts
│   └── site-setting.service.ts
│
├── lib/
│   ├── db/
│   │   └── prisma.ts
│   ├── auth/
│   ├── payment/
│   │   └── toss.ts
│   ├── storage/
│   │   └── r2.ts
│   ├── validation/
│   ├── constants/
│   └── utils/
│
├── store/
│   └── cart.store.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── types/
│
├── public/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── middleware.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

# 13. 고객 영역 Architecture

고객 영역은 Server Component 우선으로 구성한다.

권장:

```text
상품 목록
상품 상세
시즌
Story
Guide

→ Server Component 우선
```

Client Component가 필요한 경우:

```text
장바구니
옵션 선택
수량 변경
Checkout Form
결제 UI
```

원칙:

```text
Server Component First
Client Component Only When Needed
```

---

# 14. 관리자 영역 Architecture

관리자 화면은 인증 이후 접근 가능해야 한다.

관리자 페이지:

```text
/admin/dashboard
/admin/seasons
/admin/products
/admin/orders
/admin/shipping
/admin/settings
```

인증 체크 위치:

```text
middleware
+
Server-side Session Validation
```

중요 관리자 API는 반드시 서버에서 다시 Authorization을 확인한다.

---

# 15. Middleware 역할

`middleware.ts` 권장 역할:

```text
/admin/login 제외
/admin/** 접근 시 인증 여부 확인
```

Middleware만으로 최종 보안을 보장하지 않는다.

API Route에서도 인증을 재검증한다.

---

# 16. 상태 관리

## Client State

Zustand 사용 대상:

```text
Cart
Checkout Temporary State
UI-only State
```

DB에 저장해야 하는 상태:

```text
Order
Payment
Shipment
Product
Season
```

Client State는 Source of Truth가 아니다.

---

# 17. Cart Architecture

MVP에서는 비회원 장바구니를 Client State로 유지할 수 있다.

예:

```text
Zustand
+
localStorage Persist
```

구조:

```text
CartItem
- variantId
- productName
- optionName
- quantity
- displayPrice
```

중요:

Cart의 가격은 UI 표시용이다.

실제 주문 생성 시 서버가 DB 가격을 다시 계산한다.

---

# 18. Database Architecture

PostgreSQL은 서비스의 Primary Data Store이다.

핵심 Entity:

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

주요 관계:

```text
Season
  │
  └── Product
       │
       ├── ProductVariant
       │       │
       │       └── OrderItem
       │              │
       │              └── Order
       │                   ├── Payment
       │                   └── Shipment
       │
       └── ProductImage
```

---

# 19. Prisma Architecture

Prisma Client는 Singleton 패턴을 사용한다.

```text
Next.js
   │
   ▼
Prisma Client
   │
   ▼
PostgreSQL
```

모든 Schema 변경은 Migration으로 관리한다.

개발:

```bash
npx prisma migrate dev
```

운영:

```bash
npx prisma migrate deploy
```

---

# 20. Order Architecture

주문 생성은 반드시 서버에서 처리한다.

```text
Customer
   │
   ▼
POST /api/orders
   │
   ▼
OrderService
   │
   ├── Variant 조회
   ├── Product 상태 확인
   ├── 가격 재조회
   ├── 수량 검증
   ├── 배송비 계산
   │
   ▼
Prisma Transaction
   │
   ├── Order 생성
   └── OrderItem Snapshot 생성
```

---

# 21. 주문 Snapshot Architecture

다음 값은 주문 시점에 복사한다.

```text
Product Name
Option Name
Unit Price
```

이유:

```text
상품 가격 변경
상품명 변경
옵션명 변경
```

이 발생해도 기존 주문 기록은 변하지 않아야 한다.

---

# 22. Payment Architecture

결제는 다음 두 단계로 분리한다.

```text
1. Payment Authentication
2. Payment Confirmation
```

흐름:

```text
Customer
   │
   │ Order 생성
   ▼
Next.js
   │
   ▼
Toss SDK
   │
   │ 인증
   ▼
Toss
   │
   │ paymentKey
   ▼
Client
   │
   │ POST /api/payments/confirm
   ▼
Next.js
   │
   │ 금액 검증
   ▼
Toss Confirm API
   │
   ▼
Next.js
   │
   │ DB Transaction
   ▼
Payment + Order
```

---

# 23. Payment Source of Truth

결제 완료 여부의 최종 판단은 서버에서 수행한다.

금지:

```text
Client Redirect 성공
=
결제 성공
```

필수:

```text
Order.totalAmount
==
PG approvedAmount
```

검증 후 DB 상태 갱신.

---

# 24. Payment Idempotency

다음 문제를 방지해야 한다.

```text
브라우저 새로고침
중복 요청
Network Retry
Double Click
```

결제 승인 API는 다음을 검증한다.

```text
paymentKey Unique
Order 이미 PAID 여부
동일 Payment 승인 여부
```

---

# 25. Payment Cancellation Architecture

```text
Admin
   │
   │ 취소 요청
   ▼
Next.js
   │
   │ Payment 조회
   ▼
Toss Cancel API
   │
   │ 성공
   ▼
Next.js
   │
   ▼
DB Transaction
   │
   ├── Payment CANCELLED
   └── Order CANCELLED
```

DB 상태를 PG보다 먼저 변경하지 않는다.

---

# 26. Shipping Architecture

초기에는 수동 송장 등록 방식을 사용한다.

```text
Admin
   │
   ├── 택배사
   ├── 송장번호
   └── 배송상태
   ▼
ShipmentService
   ▼
PostgreSQL
```

향후 택배 API 연동 가능.

---

# 27. Image Storage Architecture

이미지는 Cloudflare R2에 저장한다.

```text
Admin
   │
   │ Upload
   ▼
Next.js Server
   │
   ▼
Cloudflare R2
   │
   │ Object URL / Key
   ▼
PostgreSQL
```

DB 저장:

```text
imageUrl
objectKey
imageType
altText
displayOrder
```

---

# 28. 이미지 최적화

고객 화면에서는 Next.js Image를 사용한다.

권장:

```text
WebP
AVIF
Responsive Sizes
Lazy Loading
```

상품 목록 Thumbnail과 상품 상세 Image의 크기를 구분한다.

---

# 29. Authentication Architecture

초기에는 Admin-only 인증을 사용한다.

고객:

```text
No Login
Guest Checkout
```

관리자:

```text
Username
Password
Session
```

Password:

```text
Hash 저장
```

Session Cookie:

```text
HttpOnly
Secure
SameSite
```

---

# 30. Authorization Architecture

Role:

```text
OWNER
ADMIN
```

초기에는 기능 차이를 크게 두지 않아도 된다.

향후:

```text
OWNER
- 관리자 계정 관리
- 중요 설정

ADMIN
- 상품
- 주문
- 배송
```

형태로 확장 가능.

---

# 31. 주문 조회 보안

비회원 주문 조회:

```text
Order Number
+
Phone Number
```

두 값을 모두 검증한다.

주문번호 하나만으로 개인정보를 노출하지 않는다.

---

# 32. Validation Architecture

Client:

```text
React Hook Form
+
Zod
```

Server:

```text
Zod
```

원칙:

```text
Client Validation = UX

Server Validation = Security / Integrity
```

---

# 33. Error Handling Architecture

공통 Error Contract:

```json
{
  "error": {
    "code": "PRODUCT_SOLD_OUT",
    "message": "선택한 상품 옵션이 품절되었습니다.",
    "details": null
  }
}
```

Layer별:

```text
Validation Error
Domain Error
External Service Error
Infrastructure Error
Unexpected Error
```

---

# 34. Logging Architecture

초기에는 구조화된 Application Log를 권장한다.

기록 대상:

```text
Request ID
Route
Error Code
Order Number
Payment Status
External API Result
```

기록 금지 또는 Masking:

```text
Full Phone
Full Address
Password
Payment Secret
Card Data
Full PaymentKey
```

---

# 35. Security Boundary

```text
Browser
  │
  │ Untrusted
  ▼
Next.js Server
  │
  │ Trusted Business Boundary
  ▼
PostgreSQL
```

Client에서 전달되는 모든 값은 신뢰하지 않는다.

특히:

```text
price
shippingFee
totalAmount
paymentStatus
stockStatus
adminRole
```

---

# 36. External Service Boundary

외부 시스템:

```text
Toss Payments
Cloudflare R2
Daum Postcode
Analytics
```

각 외부 연동은 Adapter / Client를 통해 격리한다.

예:

```text
lib/payment/toss.ts
lib/storage/r2.ts
```

---

# 37. Deployment Architecture

```text
Git Repository
      │
      ▼
    Vercel
      │
      ├── Preview
      └── Production
```

Database:

```text
Managed PostgreSQL
```

Storage:

```text
Cloudflare R2
```

DNS:

```text
Cloudflare
```

---

# 38. Environment 분리

권장 환경:

```text
local
preview/staging
production
```

환경별로 다음 값을 분리한다.

```text
DATABASE_URL
AUTH_SECRET
TOSS_CLIENT_KEY
TOSS_SECRET_KEY
R2_ACCOUNT_ID
R2_ACCESS_KEY
R2_SECRET_KEY
R2_BUCKET
R2_PUBLIC_URL
NEXT_PUBLIC_SITE_URL
```

---

# 39. Secret 관리

Secret은 다음 위치에 저장하지 않는다.

```text
Git
Source Code
public/
Client Component
README
```

사용 위치:

```text
Vercel Environment Variables
Local .env.local
```

`.env*`는 적절히 `.gitignore` 처리한다.

---

# 40. CI/CD

초기 CI 권장:

```text
Git Push
   │
   ▼
Lint
   │
   ▼
Type Check
   │
   ▼
Unit Test
   │
   ▼
Build
   │
   ▼
Vercel Preview
```

Main Branch:

```text
Production Deploy
```

---

# 41. Git Branch 전략

소규모 1인 개발 기준으로 단순하게 운영한다.

권장:

```text
main
feature/*
fix/*
```

과도한 Git Flow는 사용하지 않는다.

---

# 42. Testing Architecture

## Unit Test

대상:

```text
Price Calculation
Shipping Fee
Order Status Transition
Payment Validation
Phone Normalization
```

## Integration Test

대상:

```text
Prisma
Order Transaction
Payment Update
Shipment Update
Admin Authorization
```

## E2E

대상:

```text
상품 조회
장바구니
Checkout
Guest Order
Test Payment
Order Lookup
Admin Login
Order Processing
```

---

# 43. Database Test 정책

테스트 DB를 Production과 분리한다.

금지:

```text
Production DATABASE_URL로 자동 테스트
```

CI에서도 별도 Test Database를 사용한다.

---

# 44. Availability / Failure 대응

외부 서비스 오류 시:

## Toss 장애

```text
주문 생성 가능
결제 승인 실패 안내
재시도 허용
```

## R2 장애

```text
상품 데이터는 유지
이미지 업로드 실패 처리
```

## DB 장애

```text
주문/결제/관리 기능 차단
명확한 오류 응답
```

---

# 45. Transaction Boundary

반드시 Transaction을 고려할 영역:

```text
Order 생성
OrderItem 생성

Payment 저장
Order 상태 갱신

Shipment 상태 변경
Order 상태 갱신
```

외부 PG API 호출 자체는 DB Transaction 내부에 장시간 포함하지 않는 것을 권장한다.

---

# 46. Concurrency 고려

특히 다음 영역에서 동시 요청을 고려한다.

```text
결제 승인
결제 취소
주문 상태 변경
품절 직전 주문
```

MVP에서는 재고 수량 대신 `SOLD_OUT` 중심 운영이므로 복잡한 재고 Lock은 생략할 수 있다.

---

# 47. Performance Architecture

고객 공개 페이지:

```text
Server Rendering
Caching 가능
Image CDN
```

관리자:

```text
Dynamic Data
No Public Cache
```

상품 변경 후 Cache Revalidation을 적용할 수 있다.

---

# 48. Cache 전략

캐시 가능:

```text
현재 시즌
상품 목록
상품 상세
SiteSetting 일부
```

캐시 지양:

```text
주문
결제
배송
관리자 Dashboard
```

상품/시즌 변경 후 Revalidate를 수행한다.

---

# 49. SEO Architecture

공개 페이지:

```text
Home
Season
Products
Product Detail
Story
Guide
```

Metadata:

```text
title
description
Open Graph
canonical
```

관리자 페이지는 검색 엔진에 노출하지 않는다.

---

# 50. Monitoring

초기 최소 Monitoring:

```text
Vercel Logs
Database Provider Monitoring
Cloudflare Analytics
Toss Dashboard
```

향후:

```text
Sentry
Structured Logging
APM
```

실제 오류 빈도가 증가할 때 추가한다.

---

# 51. Backup

Managed PostgreSQL의 Backup 기능을 활성화하는 것을 권장한다.

중요 대상:

```text
Orders
Payments
Shipments
Products
Settings
```

R2도 Object 삭제 실수를 고려한 운영 정책을 마련한다.

---

# 52. 개인정보 보안 Architecture

개인정보:

```text
Name
Phone
Address
Delivery Message
```

원칙:

```text
Minimum Collection
Admin-only Access
No Sensitive Logging
Retention Policy
HTTPS
```

향후 필요 시 개인정보 Column Application-level Encryption을 검토한다.

---

# 53. Admin Operational Safety

관리자 UI에서 위험 작업은 확인 절차를 둔다.

예:

```text
결제 취소
상품 비활성화
시즌 전환
배송 완료
```

결제 취소는 반드시 PG 결과 확인 이후 성공 표시한다.

---

# 54. MVP Architecture Boundary

MVP에 포함:

```text
Customer Responsive Web
Admin Responsive Web
Next.js
PostgreSQL
Prisma
R2
Toss
Daum Address
Guest Checkout
Order Lookup
Shipping Management
```

MVP에 포함하지 않음:

```text
회원제
CRM
추천
AI
ERP
자동 물류
Microservice
Native App
```

---

# 55. Phase별 Architecture 확장

## Phase 1

```text
Next.js
PostgreSQL
Prisma
R2
Product / Season
```

## Phase 2

```text
Cart
Order
OrderItem
Guest Lookup
```

## Phase 3

```text
Toss Payments
Payment
Cancel
```

## Phase 4

```text
Shipment
Tracking
```

## Phase 5

```text
Monitoring
Security Hardening
Performance Optimization
```

---

# 56. 향후 확장 Architecture

실제 사업 성장 후 필요한 경우 다음을 검토한다.

```text
Customer Account
Notification Service
SMS / Kakao
Courier API
Inventory Service
Refund Entity
Sales Analytics
PWA
```

대규모 트래픽 또는 조직 확장 전에는 Application 분리를 하지 않는다.

---

# 57. Microservice 전환 기준

다음 조건이 실제로 발생하기 전에는 Microservice를 권장하지 않는다.

```text
개발팀 다수
도메인별 독립 배포 필요
서비스별 확장 요구
수십만~수백만 규모 트래픽
독립적인 장애 격리 요구
```

현재 프로젝트에서는 Monolith가 적합하다.

---

# 58. Architecture Decision Summary

| 영역 | 선택 |
|---|---|
| Architecture | Next.js Monolith |
| Customer | Responsive Web |
| Admin | Responsive Web |
| Backend | Next.js Server |
| API | REST |
| Database | PostgreSQL |
| ORM | Prisma |
| Image | Cloudflare R2 |
| Payment | Toss Payments |
| Auth | Admin-only Session |
| Customer Auth | 없음 |
| Cart | Zustand + localStorage |
| Deploy | Vercel |
| DNS/CDN | Cloudflare |
| Address | Daum Postcode |
| Native App | 제외 |
| Microservice | 제외 |

---

# 59. Architecture 완료 기준

다음 조건을 만족하면 초기 Architecture Scaffold가 완료된 것으로 본다.

- Next.js 프로젝트 생성
- TypeScript 설정
- Tailwind 설정
- shadcn/ui 설정
- Customer Route Group 생성
- Admin Route 생성
- API Route 생성
- Prisma 설정
- PostgreSQL 연결
- Migration 성공
- Prisma Singleton 적용
- Service Layer 구조 생성
- 관리자 인증 구조 생성
- Middleware 적용
- Cart Store 생성
- R2 Client 구성
- Toss Client 구성
- 환경변수 Schema 구성
- Error Contract 적용
- 기본 Logging 적용
- Unit/Integration Test 구조 생성
- Vercel Preview 배포 성공

---

# 60. 최종 아키텍처 정의

본 프로젝트의 최종 초기 구조는 다음과 같다.

```text
Mobile / Desktop Browser
          │
          ▼
      Cloudflare
          │
          ▼
        Vercel
          │
          ▼
      Next.js Monolith
          │
     ┌────┼────┐
     │    │    │
     ▼    ▼    ▼
 PostgreSQL R2 Toss
```

애플리케이션 내부 구조:

```text
UI / Route
    │
    ▼
Validation
    │
    ▼
Service
    │
    ▼
Prisma / External Adapter
    │
    ▼
Database / External Service
```

본 프로젝트의 Architecture 핵심 원칙은 다음과 같다.

1. **하나의 Next.js 애플리케이션으로 고객·관리자·API를 통합한다.**
2. **비즈니스 데이터의 Source of Truth는 PostgreSQL이다.**
3. **Client State와 Server State를 명확히 구분한다.**
4. **상품 가격과 결제 상태는 서버에서 최종 검증한다.**
5. **이미지, 결제 등 외부 기능은 Adapter 형태로 격리한다.**
6. **사업 규모가 실제로 커지기 전까지 시스템을 불필요하게 분리하지 않는다.**

최종적으로 본 서비스는 다음 방향을 유지한다.

> **작고 명확한 Monolith로 빠르게 운영을 시작하고, 실제 사업 요구가 검증되는 기능만 점진적으로 확장한다.**
