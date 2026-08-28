# 과일 시즌 커머스 웹서비스 REST/OpenAPI 명세서

## 1. 문서 개요

### 1.1 목적

본 문서는 **과일 시즌 커머스 웹서비스**에서 사용하는 REST API의 계약을 정의한다.

본 명세서는 다음 구현의 기준 문서로 사용한다.

- Next.js Route Handlers
- Client ↔ Server 통신
- 관리자 API
- 주문 생성
- 결제 승인
- 배송 관리
- OpenAPI 문서화
- API 테스트
- 통합 테스트

### 1.2 적용 기술

- Framework: Next.js
- Runtime: Node.js
- Language: TypeScript
- Validation: Zod
- Database: PostgreSQL
- ORM: Prisma
- API Style: REST
- Documentation: OpenAPI 3.1
- Content-Type: `application/json`
- Character Encoding: UTF-8

---

# 2. API 설계 원칙

## API-001 REST Resource 중심

URL은 행위보다 Resource 중심으로 설계한다.

권장:

```text
GET /api/products
GET /api/orders/{orderNumber}
```

지양:

```text
GET /api/getProducts
POST /api/createOrder
```

---

## API-002 JSON 기반

기본 Request/Response는 JSON을 사용한다.

```http
Content-Type: application/json
```

이미지 업로드는 별도 Multipart 또는 Signed Upload 구조를 사용할 수 있다.

---

## API-003 Server Validation

모든 입력값은 서버에서 Zod 등으로 검증한다.

Client Validation만 신뢰하지 않는다.

---

## API-004 Error Format 통일

모든 API 오류는 동일한 구조를 사용한다.

예:

```json
{
  "error": {
    "code": "PRODUCT_SOLD_OUT",
    "message": "선택한 상품 옵션이 품절되었습니다.",
    "details": null
  }
}
```

---

## API-005 개인정보 최소 노출

공개 API에서 고객 개인정보를 불필요하게 반환하지 않는다.

---

## API-006 Admin API 인증

`/api/admin/**`는 관리자 인증을 요구한다.

---

## API-007 Payment Idempotency

결제 승인 및 취소는 중복 요청을 고려한다.

동일 결제에 대한 중복 승인 처리가 발생하지 않아야 한다.

---

# 3. Base URL

개발:

```text
http://localhost:3000/api
```

Production:

```text
https://{domain}/api
```

본 문서에서는 다음을 Base Path로 사용한다.

```text
/api
```

---

# 4. API 영역

## Public API

```text
/api/seasons
/api/products
/api/cart        (서버 저장형이 아닐 경우 API 불필요)
/api/orders
/api/payments
```

## Admin API

```text
/api/admin/auth
/api/admin/dashboard
/api/admin/seasons
/api/admin/products
/api/admin/orders
/api/admin/shipments
/api/admin/settings
```

---

# 5. 공통 HTTP Status Code

| Status | 의미 |
|---|---|
| 200 | 요청 성공 |
| 201 | Resource 생성 성공 |
| 204 | 성공, Response Body 없음 |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | Resource 없음 |
| 409 | 상태 충돌 / 중복 |
| 422 | Validation 실패 |
| 429 | Rate Limit |
| 500 | 서버 오류 |
| 502 | 외부 PG/서비스 오류 |
| 503 | 일시적 서비스 불가 |

---

# 6. 공통 Error Schema

```ts
type ApiErrorResponse = {
  error: {
    code: string
    message: string
    details?: unknown
  }
}
```

예:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값을 확인해주세요.",
    "details": {
      "customerPhone": "올바른 휴대전화번호를 입력해주세요."
    }
  }
}
```

---

# 7. 공통 Pagination

관리자 주문 목록 등에서는 Cursor 또는 Page 기반 Pagination을 사용할 수 있다.

MVP 권장:

```text
page
limit
```

예:

```text
GET /api/admin/orders?page=1&limit=20
```

Response:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

---

# 8. Public API

# 8.1 현재 시즌 조회

## Endpoint

```http
GET /api/seasons/current
```

## 설명

현재 활성화된 시즌 정보를 조회한다.

## 인증

없음

## Response 200

```json
{
  "id": "uuid",
  "year": 2026,
  "type": "PEACH",
  "name": "2026 복숭아 시즌",
  "status": "ACTIVE",
  "startDate": "2026-07-01T00:00:00.000Z",
  "endDate": "2026-09-15T00:00:00.000Z",
  "heroTitle": "올해 복숭아 판매를 시작합니다.",
  "heroDescription": "좋은 복숭아를 골라 보내드립니다.",
  "heroImageUrl": "https://cdn.example.com/hero/peach.webp"
}
```

## 비시즌 Response 200

```json
{
  "id": null,
  "year": 2026,
  "type": "OFF_SEASON",
  "name": "비시즌",
  "status": "ACTIVE",
  "startDate": null,
  "endDate": null,
  "heroTitle": "다음 계절의 과일을 준비하고 있습니다.",
  "heroDescription": null,
  "heroImageUrl": null
}
```

---

# 8.2 상품 목록 조회

## Endpoint

```http
GET /api/products
```

## Query

| Parameter | Type | Required | 설명 |
|---|---|---|---|
| season | string | No | `PEACH`, `GOTGAM` |
| category | string | No | `HOME`, `GIFT` |
| saleStatus | string | No | 기본 `ACTIVE` |
| includeSoldOut | boolean | No | 기본 `true` |

## 예시

```http
GET /api/products?category=GIFT
```

## Response 200

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "백도 복숭아",
      "slug": "baekdo-peach",
      "category": "GIFT",
      "variety": "백도",
      "origin": "충북",
      "shortDescription": "선물용 백도 복숭아",
      "thumbnailUrl": "https://cdn.example.com/products/peach.webp",
      "priceFrom": 39000,
      "saleStatus": "ACTIVE",
      "hasInStockVariant": true
    }
  ]
}
```

---

# 8.3 상품 상세 조회

## Endpoint

```http
GET /api/products/{slug}
```

## Path Parameter

| Parameter | Type | Required |
|---|---|---|
| slug | string | Yes |

## Response 200

```json
{
  "id": "uuid",
  "season": {
    "id": "uuid",
    "type": "PEACH",
    "name": "2026 복숭아 시즌"
  },
  "name": "백도 복숭아",
  "slug": "baekdo-peach",
  "category": "GIFT",
  "variety": "백도",
  "origin": "충북",
  "shortDescription": "선물용 백도 복숭아",
  "description": "상품 상세 설명",
  "saleStatus": "ACTIVE",
  "images": [
    {
      "id": "uuid",
      "imageType": "THUMBNAIL",
      "imageUrl": "https://cdn.example.com/products/peach-01.webp",
      "altText": "백도 복숭아"
    }
  ],
  "variants": [
    {
      "id": "uuid",
      "optionName": "4kg 선물용",
      "weightOrCount": "4kg",
      "grade": "선물용",
      "price": 39000,
      "stockStatus": "IN_STOCK",
      "saleStatus": "ACTIVE"
    }
  ]
}
```

## Response 404

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "상품을 찾을 수 없습니다."
  }
}
```

---

# 8.4 주문 생성

## Endpoint

```http
POST /api/orders
```

## 설명

결제 전 주문을 생성한다.

서버는 반드시 Variant 상태와 가격을 DB에서 다시 조회한다.

## Request

```json
{
  "items": [
    {
      "variantId": "uuid",
      "quantity": 2
    }
  ],
  "customer": {
    "name": "홍길동",
    "phone": "01012345678"
  },
  "shipping": {
    "receiverName": "홍길동",
    "receiverPhone": "01012345678",
    "postalCode": "12345",
    "address1": "대전광역시 ...",
    "address2": "101동 101호",
    "requestMessage": "문 앞에 놓아주세요."
  }
}
```

## Validation

```text
items.length >= 1
quantity >= 1
name required
phone valid
postalCode required
address1 required
```

## 서버 처리

```text
1. Variant 조회
2. Product 상태 검증
3. Variant 상태 검증
4. 품절 여부 검증
5. 가격 재조회
6. 금액 계산
7. 배송비 계산
8. Order 생성
9. OrderItem Snapshot 생성
10. 주문번호 생성
```

## Response 201

```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "PF-20260828-A7F92",
    "orderStatus": "PAYMENT_PENDING",
    "paymentStatus": "READY",
    "subtotalAmount": 78000,
    "shippingAmount": 0,
    "totalAmount": 78000
  }
}
```

## 주요 오류

### 품절

```json
{
  "error": {
    "code": "PRODUCT_SOLD_OUT",
    "message": "선택한 상품 옵션이 품절되었습니다."
  }
}
```

### 비활성 상품

```json
{
  "error": {
    "code": "PRODUCT_NOT_AVAILABLE",
    "message": "현재 구매할 수 없는 상품입니다."
  }
}
```

---

# 8.5 결제 승인

## Endpoint

```http
POST /api/payments/confirm
```

## 설명

Toss Payments 인증 성공 후 서버에서 결제를 승인한다.

## Request

```json
{
  "orderId": "PF-20260828-A7F92",
  "paymentKey": "tgen_2026...",
  "amount": 78000
}
```

## 서버 검증

```text
Order 존재
Order.paymentStatus != PAID
Order.totalAmount == amount
Payment 중복 승인 여부
PG 승인 결과 검증
```

## 처리 순서

```text
1. 주문 조회
2. 금액 비교
3. PG Confirm API 호출
4. PG 승인금액 확인
5. Payment 저장
6. Order.paymentStatus = PAID
7. Order.orderStatus = PAID
```

## Response 200

```json
{
  "orderNumber": "PF-20260828-A7F92",
  "paymentStatus": "PAID",
  "orderStatus": "PAID",
  "approvedAmount": 78000,
  "approvedAt": "2026-08-28T02:00:00.000Z"
}
```

## 금액 불일치

```http
409 Conflict
```

```json
{
  "error": {
    "code": "PAYMENT_AMOUNT_MISMATCH",
    "message": "결제 금액이 주문 금액과 일치하지 않습니다."
  }
}
```

---

# 8.6 비회원 주문 조회

## Endpoint

```http
POST /api/orders/lookup
```

## Request

```json
{
  "orderNumber": "PF-20260828-A7F92",
  "phone": "01012345678"
}
```

## Response 200

```json
{
  "orderNumber": "PF-20260828-A7F92",
  "createdAt": "2026-08-28T01:30:00.000Z",
  "orderStatus": "READY_TO_SHIP",
  "orderStatusLabel": "배송 준비중",
  "paymentStatus": "PAID",
  "items": [
    {
      "productName": "백도 복숭아",
      "optionName": "4kg 선물용",
      "quantity": 2,
      "unitPrice": 39000,
      "totalPrice": 78000
    }
  ],
  "subtotalAmount": 78000,
  "shippingAmount": 0,
  "totalAmount": 78000,
  "shipment": {
    "status": "READY",
    "carrier": null,
    "trackingNumber": null,
    "shippedAt": null,
    "deliveredAt": null
  }
}
```

## 조회 실패

공격자가 주문 존재 여부를 추정하기 어렵도록 동일한 오류 메시지를 사용할 수 있다.

```json
{
  "error": {
    "code": "ORDER_LOOKUP_FAILED",
    "message": "주문번호 또는 연락처를 확인해주세요."
  }
}
```

---

# 9. 관리자 인증 API

# 9.1 관리자 로그인

## Endpoint

```http
POST /api/admin/auth/login
```

## Request

```json
{
  "username": "owner",
  "password": "********"
}
```

## Response 200

```json
{
  "user": {
    "id": "uuid",
    "username": "owner",
    "name": "관리자",
    "role": "OWNER"
  }
}
```

Session Cookie를 사용할 경우 Response Header에서 Secure/HttpOnly Cookie를 설정한다.

## 오류

```http
401 Unauthorized
```

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "아이디 또는 비밀번호를 확인해주세요."
  }
}
```

---

# 9.2 관리자 로그아웃

## Endpoint

```http
POST /api/admin/auth/logout
```

## Response

```http
204 No Content
```

---

# 9.3 현재 관리자 조회

## Endpoint

```http
GET /api/admin/auth/me
```

## Response 200

```json
{
  "id": "uuid",
  "username": "owner",
  "name": "관리자",
  "role": "OWNER"
}
```

---

# 10. 관리자 Dashboard API

# 10.1 Dashboard Summary

## Endpoint

```http
GET /api/admin/dashboard
```

## Response 200

```json
{
  "currentSeason": {
    "id": "uuid",
    "type": "PEACH",
    "name": "2026 복숭아 시즌"
  },
  "todayOrderCount": 12,
  "paidOrderCount": 10,
  "readyToShipCount": 7,
  "recentOrders": [
    {
      "orderNumber": "PF-20260828-A7F92",
      "customerNameMasked": "김○○",
      "totalAmount": 78000,
      "orderStatus": "PAID",
      "createdAt": "2026-08-28T01:30:00.000Z"
    }
  ]
}
```

---

# 11. 관리자 시즌 API

# 11.1 시즌 목록

```http
GET /api/admin/seasons
```

## Response

```json
{
  "items": [
    {
      "id": "uuid",
      "year": 2026,
      "type": "PEACH",
      "name": "2026 복숭아 시즌",
      "status": "ACTIVE"
    }
  ]
}
```

---

# 11.2 시즌 생성

```http
POST /api/admin/seasons
```

## Request

```json
{
  "year": 2026,
  "type": "GOTGAM",
  "name": "2026 곶감 시즌",
  "startDate": "2026-11-01T00:00:00.000Z",
  "endDate": "2027-02-28T00:00:00.000Z",
  "heroTitle": "겨울 곶감 판매를 시작합니다.",
  "heroDescription": "좋은 곶감을 준비했습니다."
}
```

## Response

```http
201 Created
```

---

# 11.3 시즌 수정

```http
PATCH /api/admin/seasons/{id}
```

## Request 예

```json
{
  "heroTitle": "2026 겨울 곶감 판매 시작",
  "heroDescription": "올해도 좋은 곶감을 준비했습니다."
}
```

---

# 11.4 시즌 활성화

```http
POST /api/admin/seasons/{id}/activate
```

## 처리

- 기존 ACTIVE 시즌 종료 또는 비활성화
- 대상 Season → ACTIVE

## Response 200

```json
{
  "id": "uuid",
  "status": "ACTIVE"
}
```

---

# 12. 관리자 상품 API

# 12.1 상품 목록

```http
GET /api/admin/products
```

## Query

```text
page
limit
seasonId
saleStatus
search
```

---

# 12.2 상품 생성

```http
POST /api/admin/products
```

## Request

```json
{
  "seasonId": "uuid",
  "name": "백도 복숭아",
  "slug": "baekdo-peach",
  "category": "GIFT",
  "variety": "백도",
  "origin": "충북",
  "shortDescription": "선물용 백도 복숭아",
  "description": "상품 상세 설명",
  "saleStatus": "ACTIVE",
  "displayOrder": 1
}
```

---

# 12.3 상품 상세

```http
GET /api/admin/products/{id}
```

## Response

상품 + Variant + Image 포함.

---

# 12.4 상품 수정

```http
PATCH /api/admin/products/{id}
```

---

# 12.5 상품 비활성화

권장:

```http
PATCH /api/admin/products/{id}
```

```json
{
  "saleStatus": "INACTIVE"
}
```

물리 삭제 API는 MVP에서 제공하지 않는 것을 권장한다.

---

# 13. 관리자 Variant API

# 13.1 Variant 생성

```http
POST /api/admin/products/{productId}/variants
```

## Request

```json
{
  "optionName": "4kg 선물용",
  "weightOrCount": "4kg",
  "grade": "선물용",
  "price": 39000,
  "stockStatus": "IN_STOCK",
  "saleStatus": "ACTIVE",
  "displayOrder": 1
}
```

---

# 13.2 Variant 수정

```http
PATCH /api/admin/variants/{id}
```

## 가격 변경

```json
{
  "price": 42000
}
```

## 품절

```json
{
  "stockStatus": "SOLD_OUT"
}
```

---

# 14. 관리자 이미지 API

이미지 업로드는 두 가지 방식 중 하나를 선택할 수 있다.

MVP 권장:

```text
Client
 ↓
서버 Upload Endpoint
 ↓
Cloudflare R2
```

## Endpoint

```http
POST /api/admin/products/{productId}/images
```

Content-Type:

```text
multipart/form-data
```

Form:

```text
file
imageType
altText
displayOrder
```

## Response 201

```json
{
  "id": "uuid",
  "imageUrl": "https://cdn.example.com/products/...",
  "imageType": "GALLERY",
  "displayOrder": 2
}
```

---

# 15. 관리자 주문 API

# 15.1 주문 목록

```http
GET /api/admin/orders
```

## Query

| Parameter | 설명 |
|---|---|
| page | 페이지 |
| limit | 페이지 크기 |
| orderStatus | 주문 상태 |
| paymentStatus | 결제 상태 |
| search | 주문번호/고객 검색 |
| from | 시작일 |
| to | 종료일 |

## Response

```json
{
  "items": [
    {
      "id": "uuid",
      "orderNumber": "PF-20260828-A7F92",
      "customerName": "김대호",
      "customerPhone": "01012345678",
      "totalAmount": 78000,
      "orderStatus": "PAID",
      "paymentStatus": "PAID",
      "createdAt": "2026-08-28T01:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

# 15.2 주문 상세

```http
GET /api/admin/orders/{id}
```

## Response

```json
{
  "id": "uuid",
  "orderNumber": "PF-20260828-A7F92",
  "customer": {
    "name": "김대호",
    "phone": "01012345678"
  },
  "receiver": {
    "name": "김대호",
    "phone": "01012345678"
  },
  "address": {
    "postalCode": "12345",
    "address1": "대전광역시 ...",
    "address2": "101동 101호"
  },
  "items": [
    {
      "productName": "백도 복숭아",
      "optionName": "4kg 선물용",
      "quantity": 2,
      "unitPrice": 39000,
      "totalPrice": 78000
    }
  ],
  "subtotalAmount": 78000,
  "shippingAmount": 0,
  "totalAmount": 78000,
  "orderStatus": "PAID",
  "paymentStatus": "PAID",
  "payments": [],
  "shipments": [],
  "adminMemo": null,
  "createdAt": "2026-08-28T01:30:00.000Z"
}
```

---

# 15.3 주문 상태 변경

```http
PATCH /api/admin/orders/{id}/status
```

## Request

```json
{
  "status": "PREPARING"
}
```

## 상태 전이 검증

허용 예:

```text
PAID → PREPARING
PREPARING → READY_TO_SHIP
READY_TO_SHIP → SHIPPED
SHIPPED → DELIVERED
```

잘못된 상태 전이는 `409 Conflict`.

---

# 15.4 관리자 메모 변경

```http
PATCH /api/admin/orders/{id}
```

```json
{
  "adminMemo": "전화 확인 완료"
}
```

---

# 16. 관리자 결제 취소 API

## Endpoint

```http
POST /api/admin/orders/{id}/payments/cancel
```

## Request

전체취소:

```json
{
  "reason": "고객 요청"
}
```

향후 부분취소:

```json
{
  "reason": "일부 상품 취소",
  "amount": 39000
}
```

MVP에서는 전체취소만 지원해도 된다.

## 처리 순서

```text
1. Order/Payment 조회
2. 취소 가능 여부 확인
3. Toss Cancel API 호출
4. 성공 확인
5. Payment 상태 변경
6. Order 상태 변경
```

## Response 200

```json
{
  "orderNumber": "PF-20260828-A7F92",
  "paymentStatus": "CANCELLED",
  "orderStatus": "CANCELLED"
}
```

---

# 17. 관리자 배송 API

# 17.1 배송 등록/수정

```http
PATCH /api/admin/orders/{id}/shipment
```

## Request

```json
{
  "carrier": "CJ대한통운",
  "trackingNumber": "123456789012",
  "status": "SHIPPED"
}
```

## 서버 처리

`SHIPPED`일 경우:

```text
shippedAt = 현재 시간
Order.orderStatus = SHIPPED
```

## Response

```json
{
  "shipment": {
    "id": "uuid",
    "carrier": "CJ대한통운",
    "trackingNumber": "123456789012",
    "status": "SHIPPED",
    "shippedAt": "2026-08-28T05:00:00.000Z"
  }
}
```

---

# 17.2 배송 완료

```http
PATCH /api/admin/orders/{id}/shipment
```

```json
{
  "status": "DELIVERED"
}
```

서버:

```text
deliveredAt 설정
Order.orderStatus = DELIVERED
```

---

# 18. 관리자 설정 API

# 18.1 설정 조회

```http
GET /api/admin/settings
```

## Response

```json
{
  "BRAND_NAME": "과일상점",
  "PHONE": "01012345678",
  "KAKAO_URL": "https://...",
  "DEFAULT_SHIPPING_FEE": "4000",
  "FREE_SHIPPING_THRESHOLD": "50000"
}
```

---

# 18.2 설정 수정

```http
PATCH /api/admin/settings
```

## Request

```json
{
  "PHONE": "01099998888",
  "DEFAULT_SHIPPING_FEE": "4000"
}
```

---

# 19. Zod Validation 예시

## 주문 생성

```ts
import { z } from "zod"

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().uuid(),
      quantity: z.number().int().min(1).max(99),
    })
  ).min(1),

  customer: z.object({
    name: z.string().min(1).max(100),
    phone: z.string().min(10).max(20),
  }),

  shipping: z.object({
    receiverName: z.string().min(1).max(100),
    receiverPhone: z.string().min(10).max(20),
    postalCode: z.string().min(3).max(20),
    address1: z.string().min(1).max(255),
    address2: z.string().max(255).optional(),
    requestMessage: z.string().max(500).optional(),
  }),
})
```

---

# 20. API Error Code

권장 Error Code:

```text
VALIDATION_ERROR

UNAUTHORIZED
FORBIDDEN

SEASON_NOT_FOUND
ACTIVE_SEASON_NOT_FOUND

PRODUCT_NOT_FOUND
PRODUCT_NOT_AVAILABLE
PRODUCT_SOLD_OUT

VARIANT_NOT_FOUND
VARIANT_NOT_AVAILABLE

ORDER_NOT_FOUND
ORDER_LOOKUP_FAILED
ORDER_STATE_CONFLICT

PAYMENT_NOT_FOUND
PAYMENT_ALREADY_COMPLETED
PAYMENT_AMOUNT_MISMATCH
PAYMENT_CONFIRM_FAILED
PAYMENT_CANCEL_FAILED

SHIPMENT_NOT_FOUND
SHIPMENT_STATE_CONFLICT

IMAGE_UPLOAD_FAILED

INTERNAL_SERVER_ERROR
EXTERNAL_SERVICE_ERROR
RATE_LIMIT_EXCEEDED
```

---

# 21. 인증 정책

## 고객

기본 공개 API 사용.

주문 조회는:

```text
orderNumber
+
phone
```

검증.

## 관리자

Session 기반 인증 권장.

Cookie 권장 설정:

```text
HttpOnly
Secure
SameSite=Lax 또는 Strict
```

관리자 API 요청 시 서버에서 Session 검증.

---

# 22. Rate Limit 권장

특히 다음 API에 Rate Limit 적용을 검토한다.

```text
POST /api/admin/auth/login

POST /api/orders

POST /api/orders/lookup

POST /api/payments/confirm
```

예:

```text
IP + Route 기준
```

실제 운영 규모에 따라 Cloudflare Rate Limiting 또는 Application 수준 제한을 선택한다.

---

# 23. 개인정보 로그 정책

다음 값 전체를 Application Log에 기록하지 않는 것을 권장한다.

```text
customerName
customerPhone
receiverName
receiverPhone
address1
address2
paymentKey 전체
```

필요 시 Masking한다.

예:

```text
010****5678
```

---

# 24. Payment 보안 규칙

Client는 다음 정보를 임의로 결정할 수 없다.

```text
상품 가격
배송비
총 결제금액
결제 완료 상태
```

서버가 DB를 기반으로 계산하고 최종 검증한다.

---

# 25. 주문 생성 Sequence

```text
Customer
   │
   │ POST /api/orders
   ▼
Next.js Server
   │
   │ Variant/Product 조회
   ▼
PostgreSQL
   │
   │ 가격/상태 반환
   ▼
Next.js
   │
   │ Order + OrderItems Transaction
   ▼
PostgreSQL
   │
   ▼
Customer
   │
   │ OrderNumber / TotalAmount
   ▼
Toss Payment UI
```

---

# 26. 결제 승인 Sequence

```text
Customer
   │
   │ Toss 인증
   ▼
Toss
   │
   │ paymentKey
   ▼
Customer
   │
   │ POST /api/payments/confirm
   ▼
Next.js
   │
   │ Order.totalAmount 확인
   ▼
PostgreSQL
   │
   ▼
Next.js
   │
   │ Toss Confirm API
   ▼
Toss
   │
   │ 승인 결과
   ▼
Next.js
   │
   │ Payment + Order Transaction
   ▼
PostgreSQL
```

---

# 27. 배송 Sequence

```text
Admin
   │
   │ PATCH Shipment
   ▼
Next.js
   │
   │ 상태 검증
   ▼
PostgreSQL
   │
   │ Shipment 갱신
   │ Order 갱신
   ▼
Admin / Customer
```

---

# 28. OpenAPI 기본 구조

```yaml
openapi: 3.1.0

info:
  title: 과일 시즌 커머스 API
  version: 1.0.0
  description: 복숭아·곶감 시즌 커머스 REST API

servers:
  - url: /api

tags:
  - name: Seasons
  - name: Products
  - name: Orders
  - name: Payments
  - name: Admin Auth
  - name: Admin Seasons
  - name: Admin Products
  - name: Admin Orders
  - name: Admin Shipments
  - name: Admin Settings

paths:
  /seasons/current:
    get:
      tags:
        - Seasons

  /products:
    get:
      tags:
        - Products

  /products/{slug}:
    get:
      tags:
        - Products

  /orders:
    post:
      tags:
        - Orders

  /orders/lookup:
    post:
      tags:
        - Orders

  /payments/confirm:
    post:
      tags:
        - Payments
```

---

# 29. OpenAPI Error Component 예

```yaml
components:
  schemas:
    ApiError:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
            message:
              type: string
            details:
              nullable: true
```

---

# 30. OpenAPI Order Schema 예

```yaml
components:
  schemas:
    CreateOrderRequest:
      type: object
      required:
        - items
        - customer
        - shipping
      properties:
        items:
          type: array
          minItems: 1
          items:
            type: object
            required:
              - variantId
              - quantity
            properties:
              variantId:
                type: string
                format: uuid
              quantity:
                type: integer
                minimum: 1

        customer:
          type: object
          required:
            - name
            - phone
          properties:
            name:
              type: string
            phone:
              type: string

        shipping:
          type: object
          required:
            - receiverName
            - receiverPhone
            - postalCode
            - address1
          properties:
            receiverName:
              type: string
            receiverPhone:
              type: string
            postalCode:
              type: string
            address1:
              type: string
            address2:
              type: string
            requestMessage:
              type: string
```

---

# 31. API Versioning

초기 MVP에서는 URL Version을 생략할 수 있다.

```text
/api/products
```

외부 공개 API 또는 다중 Client가 생기면 다음 구조를 검토한다.

```text
/api/v1/products
```

초기에는 과도한 Versioning을 도입하지 않는다.

---

# 32. API 구현 디렉터리 예시

```text
app/
└── api/
    ├── seasons/
    │   └── current/
    │       └── route.ts
    │
    ├── products/
    │   ├── route.ts
    │   └── [slug]/
    │       └── route.ts
    │
    ├── orders/
    │   ├── route.ts
    │   └── lookup/
    │       └── route.ts
    │
    ├── payments/
    │   └── confirm/
    │       └── route.ts
    │
    └── admin/
        ├── auth/
        ├── dashboard/
        ├── seasons/
        ├── products/
        ├── variants/
        ├── orders/
        └── settings/
```

---

# 33. Service Layer 권장

```text
Route Handler
   ↓
Zod Validation
   ↓
Domain Service
   ↓
Prisma
```

예:

```text
SeasonService
ProductService
OrderService
PaymentService
ShipmentService
AdminAuthService
```

결제처럼 외부 API가 포함된 로직은 Route Handler에 직접 구현하지 않고 Service로 분리한다.

---

# 34. API 테스트 기준

## 상품

- 상품 목록 정상 조회
- 존재하지 않는 slug 404
- 비활성 상품 정책 검증

## 주문

- 정상 주문 생성
- 잘못된 Variant
- 품절 Variant
- 비활성 Variant
- 수량 0
- 가격 변조 무시
- 서버 계산 금액 검증

## 결제

- 정상 승인
- 잘못된 주문번호
- 금액 불일치
- 중복 승인
- PG 오류
- 결제 취소

## 주문 조회

- 주문번호/전화번호 일치
- 전화번호 불일치
- 존재하지 않는 주문

## 관리자

- 미인증 401
- 정상 로그인
- 상품 수정
- 시즌 활성화
- 주문 상태 전이
- 송장 등록

---

# 35. API 완료 기준

MVP API는 다음 조건을 만족해야 한다.

- 현재 시즌 조회 가능
- 상품 목록 조회 가능
- 상품 상세 조회 가능
- 주문 생성 가능
- 서버 가격 재계산 수행
- OrderItem Snapshot 저장
- 결제 승인 API 동작
- 결제 금액 검증
- 비회원 주문 조회 가능
- 관리자 로그인 가능
- 시즌 CRUD 가능
- 상품 CRUD 가능
- Variant CRUD 가능
- 주문 목록/상세 조회 가능
- 주문 상태 변경 가능
- 결제 취소 가능
- 배송정보 등록 가능
- 사이트 설정 변경 가능
- 공통 Error Schema 적용
- Zod Validation 적용
- 관리자 API 인증 적용
- OpenAPI 문서 생성 가능

---

# 36. 최종 API 구조 요약

```text
PUBLIC

GET  /api/seasons/current

GET  /api/products
GET  /api/products/{slug}

POST /api/orders
POST /api/orders/lookup

POST /api/payments/confirm


ADMIN

POST /api/admin/auth/login
POST /api/admin/auth/logout
GET  /api/admin/auth/me

GET  /api/admin/dashboard

GET  /api/admin/seasons
POST /api/admin/seasons
PATCH /api/admin/seasons/{id}
POST /api/admin/seasons/{id}/activate

GET  /api/admin/products
POST /api/admin/products
GET  /api/admin/products/{id}
PATCH /api/admin/products/{id}

POST  /api/admin/products/{productId}/variants
PATCH /api/admin/variants/{id}

POST /api/admin/products/{productId}/images

GET   /api/admin/orders
GET   /api/admin/orders/{id}
PATCH /api/admin/orders/{id}
PATCH /api/admin/orders/{id}/status

POST  /api/admin/orders/{id}/payments/cancel

PATCH /api/admin/orders/{id}/shipment

GET   /api/admin/settings
PATCH /api/admin/settings
```

본 API 구조의 핵심 원칙은 다음과 같다.

1. **가격과 상품 상태는 서버가 최종 판단한다.**
2. **Order와 Payment를 분리한다.**
3. **PG 성공 화면만으로 결제 완료 처리하지 않는다.**
4. **비회원 주문 조회는 주문번호 + 연락처를 함께 검증한다.**
5. **관리자 API는 인증된 사용자만 접근한다.**
6. **모든 오류는 통일된 Error Contract를 사용한다.**

초기에는 위 REST 구조를 기준으로 구현하고, 실제 운영에서 요구가 발생할 경우에만 Webhook, 배송 API, 알림 API, 회원 API 등을 확장한다.
