# 가족 과일 시즌 커머스 웹서비스

## 서비스 기획 · UI/UX · 기술 스택 · 시스템 아키텍처 · DB/ERD 통합 설계서

---

# 1. 프로젝트 개요

## 1.1 프로젝트 정의

본 프로젝트는 가족 단위로 운영하는 과일 판매·중매 사업을 온라인으로 확장하기 위한 **모바일 중심 시즌형 과일 커머스 웹서비스** 구축을 목표로 한다.

주요 판매 품목은 다음 두 종류로 한정한다.

* 복숭아
* 곶감

다양한 상품을 상시 판매하는 종합 쇼핑몰이 아니라 각 과일의 출하 및 판매 시기에 맞춰 사이트의 콘텐츠와 상품을 전환하는 **Season First Commerce** 구조를 적용한다.

예를 들어 여름에는 복숭아가 사이트의 주요 상품으로 노출되고 겨울에는 곶감 중심으로 자동 또는 관리자 설정에 의해 변경된다.

서비스 이용자의 대부분이 스마트폰을 사용할 것으로 예상하므로 PC 웹을 축소하여 모바일에 대응하는 방식이 아니라 처음부터 **Mobile First Responsive Web Application**으로 개발한다.

초기에는 별도의 iOS/Android 앱을 개발하지 않고 모바일 웹을 중심으로 서비스를 제공하며, 향후 필요성이 확인되면 PWA 및 Native App으로 단계적으로 확장한다.

---

# 2. 추진 배경

현재 가족 단위 과일 판매 사업은 전화, 문자, 지인 소개 및 기존 거래 관계 등을 중심으로 운영될 가능성이 높다.

이러한 방식은 기존 고객과의 거래에는 효과적이지만 다음과 같은 한계가 존재한다.

* 신규 고객이 상품 정보를 확인하기 어려움
* 매번 가격과 상품 정보를 개별적으로 안내해야 함
* 상품 사진과 산지 정보를 체계적으로 전달하기 어려움
* 주문 정보를 전화나 문자에서 다시 정리해야 함
* 주문 및 배송 상태 관리가 어려움
* 시즌 변경 시 고객에게 정보를 전달하기 어려움
* 공식적인 온라인 브랜드 채널이 없음

따라서 고객이 모바일 환경에서 직접 상품을 확인하고 주문할 수 있는 온라인 판매 채널을 구축한다.

---

# 3. 서비스 목표

본 프로젝트는 단순한 홈페이지 제작이 아니라 실제 가족 사업에서 지속적으로 운영 가능한 온라인 판매 시스템 구축을 목표로 한다.

핵심 목표는 다음과 같다.

### 3.1 공식 온라인 판매 채널 구축

고객이 언제든지 복숭아와 곶감의 판매 여부, 가격, 중량, 포장 형태, 배송 정보 등을 확인할 수 있도록 한다.

### 3.2 모바일 구매 편의성 확보

고객이 스마트폰에서 다음 과정을 최소한의 단계로 완료할 수 있도록 한다.

```text
접속
 ↓
상품 확인
 ↓
옵션 선택
 ↓
주문서 작성
 ↓
결제
 ↓
주문 완료
```

### 3.3 시즌 운영 자동화

관리자가 복숭아, 곶감, 비시즌 중 현재 상태를 선택하면 홈페이지의 메인 콘텐츠와 판매 상품이 변경되도록 한다.

### 3.4 운영 편의성 확보

개발 지식이 없는 가족 구성원도 관리자 화면에서 다음 작업을 수행할 수 있도록 한다.

* 시즌 변경
* 상품 등록
* 상품 수정
* 가격 변경
* 품절 처리
* 이미지 변경
* 주문 확인
* 배송 상태 변경
* 송장번호 등록

### 3.5 브랜드 신뢰 확보

단순히 가격만 보여주는 쇼핑몰이 아니라 실제 산지, 상품, 선별 및 포장 과정 등을 콘텐츠화하여 가족 사업의 신뢰도를 높인다.

---

# 4. 서비스 핵심 콘셉트

서비스의 핵심 메시지는 다음과 같다.

> **두 계절, 두 가지 과일에 집중하는 가족 과일 브랜드**

서비스 구조 역시 상품 카테고리가 아닌 시즌을 중심으로 설계한다.

```text
                 FAMILY FRUIT

                      │
             ┌────────┴────────┐
             │                 │
       PEACH SEASON       GOTGAM SEASON
             │                 │
           복숭아              곶감
             │                 │
         상품/옵션           상품/옵션
             │                 │
             └────────┬────────┘
                      │
                     주문
                      │
                     결제
                      │
                     배송
```

---

# 5. 서비스 설계 원칙

## Season First

상품보다 시즌을 중심으로 서비스를 운영한다.

## Mobile First

모바일 환경을 기본 UI로 개발하고 태블릿 및 PC 화면으로 확장한다.

## Non-Member First

초기 구매 과정에서 회원가입을 강제하지 않는다.

## Admin Simple

가족 구성원이 쉽게 사용할 수 있도록 관리자 기능을 단순하게 유지한다.

## Content First

가격뿐 아니라 실제 상품 사진, 산지, 선별 및 포장 과정 등의 정보를 적극적으로 활용한다.

## Progressive Commerce

상품 소개 → 주문 → 결제 → 배송 → 고객관리 순으로 단계적으로 기능을 확장한다.

---

# 6. 고객 서비스 구성

전체 고객 서비스는 다음과 같이 구성한다.

```text
HOME
 │
 ├── 현재 시즌
 ├── 대표 상품
 ├── 브랜드 소개
 ├── 산지/선별 소개
 └── 주문 문의
 │
 ▼
PRODUCTS
 │
 ▼
PRODUCT DETAIL
 │
 ├── 상품 이미지
 ├── 상품 정보
 ├── 옵션
 ├── 수량
 └── 구매
 │
 ▼
CART
 │
 ▼
CHECKOUT
 │
 ├── 주문자
 ├── 배송지
 └── 결제수단
 │
 ▼
PAYMENT
 │
 ▼
ORDER COMPLETE
 │
 ▼
ORDER LOOKUP
```

---

# 7. 모바일 Navigation

고객이 가장 많이 사용하는 기능만 하단에 노출한다.

```text
┌──────────────────────────────┐
│                              │
│                              │
│        PAGE CONTENT          │
│                              │
│                              │
├──────────────────────────────┤
│   홈      상품     장바구니  주문조회 │
│   ●        ○         ○        ○      │
└──────────────────────────────┘
```

초기에는 회원제가 없으므로 마이페이지를 필수 메뉴로 만들지 않는다.

---

# 8. HOME

메인 화면의 목적은 고객이 사이트 접속 후 몇 초 안에 다음을 파악하도록 만드는 것이다.

* 현재 무엇을 판매하는가
* 상품 가격대는 얼마인가
* 어떻게 구매하는가

구조:

```text
┌────────────────────────────┐
│ LOGO                    ☰  │
├────────────────────────────┤
│                            │
│     2026 PEACH SEASON      │
│                            │
│ 가족이 먹는다는 마음으로   │
│ 좋은 과일을 준비합니다.    │
│                            │
│      [복숭아 보러가기]      │
│                            │
│       대표 상품 이미지      │
│                            │
├────────────────────────────┤
│ 현재 판매중                │
│                            │
│ 백도 복숭아                │
│ 39,000원부터               │
│                            │
│ [상품 보기]                │
├────────────────────────────┤
│                            │
│ 가족이 직접 선별합니다.    │
│                            │
│ 산지 → 선별 → 포장 → 배송 │
│                            │
├────────────────────────────┤
│ 주문이 어려우신가요?       │
│                            │
│ [전화] [문자] [카카오톡]   │
└────────────────────────────┘
```

---

# 9. 시즌별 HOME

복숭아 시즌:

```text
2026 PEACH SEASON

올해 복숭아 판매를 시작합니다.

[복숭아 보러가기]
```

곶감 시즌:

```text
2026 GOTGAM SEASON

겨울 곶감 판매를 시작합니다.

[곶감 보러가기]
```

비시즌:

```text
이번 시즌 판매가 종료되었습니다.

다음 시즌을 준비하고 있습니다.

다음 판매
곶감 · 11월 예정
```

관리자가 코드를 수정하지 않고 관리자 화면에서 시즌을 전환할 수 있도록 한다.

---

# 10. 상품 목록

```text
복숭아

[전체] [가정용] [선물용]


┌──────────────────────┐
│                      │
│      상품 이미지     │
│                      │
├──────────────────────┤
│ 백도 복숭아          │
│                      │
│ 4kg · 11~15과        │
│                      │
│ 39,000원             │
│                      │
│ 무료배송             │
└──────────────────────┘
```

필터는 복잡하게 구성하지 않는다.

* 전체
* 가정용
* 선물용
* 판매중

정도로 제한한다.

---

# 11. 상품과 옵션 구조

상품과 실제 판매 옵션을 분리한다.

예:

```text
백도 복숭아
 │
 ├── 3kg 가정용    29,000원
 ├── 3kg 선물용    35,000원
 ├── 4kg 선물용    39,000원
 └── 5kg 선물용    49,000원
```

곶감:

```text
상주 곶감
 │
 ├── 20개입       32,000원
 ├── 30개입       45,000원
 └── 선물세트     59,000원
```

따라서 Product와 ProductVariant를 분리한다.

---

# 12. 상품 상세

모바일 상품 상세:

```text
┌─────────────────────────┐
│ ←                 🛒    │
├─────────────────────────┤
│                         │
│       상품 이미지       │
│                         │
├─────────────────────────┤
│ 백도 복숭아             │
│                         │
│ 39,000원                │
│ ★ 선물용                │
│                         │
│ 원산지   ○○             │
│ 배송     무료           │
├─────────────────────────┤
│ 옵션 선택               │
│                         │
│ [3kg]                   │
│ [4kg · 39,000원] ✓     │
│ [5kg]                   │
├─────────────────────────┤
│ 수량                    │
│                         │
│       [-] 1 [+]         │
├─────────────────────────┤
│ 상품 설명               │
│                         │
│ 산지                    │
│ 선별 과정               │
│ 포장                    │
│ 배송 안내               │
│ 교환/환불               │
│                         │
├─────────────────────────┤
│ [장바구니] [바로 구매] │
└─────────────────────────┘
```

구매 CTA는 모바일 하단에 고정한다.

---

# 13. 장바구니

장바구니에서는 다음만 제공한다.

* 상품 확인
* 옵션 확인
* 수량 변경
* 삭제
* 상품금액
* 배송비
* 총 결제금액

```text
장바구니

백도 복숭아
4kg / 선물용

39,000원

[-] 2 [+]

78,000원

────────────────

상품금액       78,000원
배송비              0원

총 결제금액     78,000원

[주문하기]
```

---

# 14. 주문서

회원가입 없이 주문할 수 있도록 한다.

입력 정보:

### 주문자

* 이름
* 휴대전화

### 배송

* 받는 사람
* 휴대전화
* 우편번호
* 기본주소
* 상세주소
* 배송 요청사항

주소 입력은 Daum Postcode API 사용을 고려한다.

---

# 15. 주문·결제 구조

주문과 결제를 반드시 분리한다.

```text
상품 선택
 ↓
주문서
 ↓
서버 주문 생성
 ↓
PAYMENT_PENDING
 ↓
PG 결제
 ↓
결제 인증
 ↓
서버 승인
 ↓
결제금액 검증
 ↓
PAID
 ↓
배송 준비
```

브라우저에서 결제 성공 화면이 표시되었다는 이유만으로 결제 완료 상태를 저장하지 않는다.

서버에서 PG 승인 결과를 검증한 후 결제 완료로 처리한다.

---

# 16. 결제 서비스

초기 PG는 하나만 사용한다.

권장:

**Toss Payments**

초기 지원 범위:

* 신용카드
* 체크카드
* PG에서 제공하는 간편결제
* 필요 시 계좌 관련 결제수단

각 간편결제를 처음부터 별도 API로 직접 연동하지 않는다.

---

# 17. 가격 검증

클라이언트에서 전달한 가격을 신뢰하지 않는다.

클라이언트:

```text
productVariantId
quantity
```

전달

서버:

```text
Variant DB 조회

39,000원 × 2

= 78,000원
```

계산

그리고:

```text
DB 주문금액
=
PG 승인금액
```

을 확인한 후 결제 완료 처리한다.

---

# 18. 주문 상태

Order Status:

```text
PAYMENT_PENDING
      ↓
PAID
      ↓
PREPARING
      ↓
READY_TO_SHIP
      ↓
SHIPPED
      ↓
DELIVERED
```

예외:

```text
CANCELLED
REFUNDED
```

Payment Status:

```text
READY
IN_PROGRESS
PAID
FAILED
CANCELLED
PARTIALLY_CANCELLED
```

주문 상태와 결제 상태는 서로 분리한다.

---

# 19. 주문 완료

```text
✓ 주문이 완료되었습니다.

주문번호
PF-20260828-A7F92

백도 복숭아 4kg
× 2

결제금액
78,000원

상품을 준비하여 보내드리겠습니다.

[주문조회]

[홈으로]
```

---

# 20. 비회원 주문조회

초기에는 회원 시스템 대신 다음 조합으로 주문을 조회한다.

```text
주문번호
+
휴대전화번호
```

사용자는 다음 정보를 확인할 수 있다.

* 주문 상품
* 결제금액
* 주문 상태
* 배송 상태
* 택배사
* 송장번호

---

# 21. 배송관리

주문 이후 실제 업무 흐름은 다음과 같다.

```text
결제완료
 ↓
주문확인
 ↓
과일 선별
 ↓
포장
 ↓
배송 준비
 ↓
택배 접수
 ↓
송장번호 등록
 ↓
배송중
 ↓
배송완료
```

Shipment 정보:

```text
shipping_company
tracking_number
shipped_at
delivered_at
```

향후 판매량이 증가하면 택배 API 연동을 검토한다.

---

# 22. 관리자 서비스

관리자는 PC뿐 아니라 스마트폰에서도 사용할 수 있도록 Responsive UI로 개발한다.

```text
/admin
 │
 ├── Dashboard
 ├── Seasons
 ├── Products
 ├── Orders
 ├── Shipping
 └── Settings
```

---

# 23. 관리자 Dashboard

```text
오늘 주문
12건

결제완료
10건

배송준비
7건

────────────────

최근 주문

김○○
백도 4kg × 2

78,000원
결제완료

[주문 확인]
```

관리자에게 복잡한 BI Dashboard를 제공하지 않는다.

운영에 필요한 정보만 보여준다.

---

# 24. 시즌 관리

관리자는 다음 중 하나를 선택한다.

```text
현재 시즌

● 복숭아
○ 곶감
○ 비시즌
```

시즌 데이터:

* 시즌명
* 연도
* 시작일
* 종료일
* 상태
* 메인 제목
* 메인 설명
* 대표 이미지

---

# 25. 상품 관리

관리자 기능:

* 상품 등록
* 상품 수정
* 옵션 등록
* 가격 변경
* 판매 여부
* 품절 처리
* 이미지 업로드
* 상품 설명
* 노출 순서

예:

```text
백도 복숭아

현재 상태
판매중

옵션

3kg 가정용
29,000원

4kg 선물용
39,000원

5kg 선물용
49,000원

[수정]
```

---

# 26. 주문 관리

관리자는 상태별로 주문을 확인한다.

```text
[전체]
[결제완료]
[상품준비]
[배송준비]
[배송중]
[배송완료]
[취소]
```

주문 상세:

* 주문번호
* 주문일
* 주문자
* 연락처
* 수령자
* 배송주소
* 상품
* 옵션
* 수량
* 금액
* 결제상태
* 주문상태
* 배송상태
* 송장번호
* 관리자 메모

---

# 27. 권장 기술 스택

## Application

| 영역            | 기술           |
| ------------- | ------------ |
| Language      | TypeScript   |
| Framework     | Next.js      |
| Frontend      | React        |
| CSS           | Tailwind CSS |
| UI Components | shadcn/ui    |
| Icons         | Lucide React |

## Client

| 영역           | 기술              |
| ------------ | --------------- |
| Form         | React Hook Form |
| Validation   | Zod             |
| Client State | Zustand         |
| Address      | Daum Postcode   |

## Server

| 영역               | 기술             |
| ---------------- | -------------- |
| Backend          | Next.js Server |
| API              | Route Handlers |
| Server Operation | Server Actions |
| ORM              | Prisma         |

## Data

| 영역            | 기술               |
| ------------- | ---------------- |
| Database      | PostgreSQL       |
| DB Hosting    | Supabase 또는 Neon |
| Image Storage | Cloudflare R2    |

## Commerce

| 영역       | 기술             |
| -------- | -------------- |
| Payment  | Toss Payments  |
| Order    | 자체 주문 시스템      |
| Shipping | 초기 수동 → 추후 API |

## Infrastructure

| 영역        | 기술                              |
| --------- | ------------------------------- |
| Hosting   | Vercel                          |
| DNS       | Cloudflare                      |
| CDN       | Cloudflare                      |
| HTTPS     | Cloudflare / Vercel             |
| Analytics | GA4 또는 Cloudflare Web Analytics |

---

# 28. 현재 사용하지 않는 기술

현재 규모에서는 다음 기술을 도입하지 않는다.

```text
FastAPI

Spring Boot

Microservices

Kubernetes

Kafka

Redis

Elasticsearch

React Native

Flutter
```

서비스가 성장하여 실제 필요성이 발생할 경우에만 추가한다.

---

# 29. Application Architecture

아키텍처 유형:

> **Mobile First Responsive Monolithic Web Application**

초기에는 Frontend와 Backend Repository를 분리하지 않는다.

Next.js 하나에서 고객 Web, 관리자 Web, 서버 로직을 함께 운영한다.

```text
              Smartphone
                  │
                HTTPS
                  │
                  ▼
             Cloudflare
                  │
                  ▼
               Vercel
                  │
                  ▼
       ┌──────────────────────┐
       │       Next.js        │
       │                      │
       │ Customer Mobile Web  │
       │                      │
       │ Admin Responsive Web │
       │                      │
       │ Server               │
       │                      │
       │ API                  │
       │ Business Logic       │
       │ Validation           │
       │ Payment Logic        │
       │ Authentication       │
       └──────────┬───────────┘
                  │
         ┌────────┼────────┐
         │        │        │
         ▼        ▼        ▼
   PostgreSQL     R2      Toss
                 Images  Payments
```

---

# 30. Database Entity

핵심 테이블:

```text
users
seasons
products
product_variants
product_images

orders
order_items
payments
shipments

site_settings
```

선택:

```text
notices
```

향후:

```text
customers
refunds
inventory_history
notification_subscriptions
coupons
```

---

# 31. ERD

```text
┌───────────────┐
│     USERS     │
├───────────────┤
│ id            │
│ username      │
│ password_hash │
│ name          │
│ role          │
│ is_active     │
└───────────────┘


┌────────────────┐
│    SEASONS     │
├────────────────┤
│ id             │
│ year           │
│ type           │
│ name           │
│ start_date     │
│ end_date       │
│ status         │
│ hero_title     │
│ hero_desc      │
│ hero_image_url │
└───────┬────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│    PRODUCTS     │
├─────────────────┤
│ id              │
│ season_id       │
│ name            │
│ slug            │
│ category        │
│ variety         │
│ origin          │
│ description     │
│ sale_status     │
└───────┬─────────┘
        │
        ├───────────────┐
        │               │
        │ 1:N           │ 1:N
        ▼               ▼
┌─────────────────┐  ┌─────────────────┐
│PRODUCT_VARIANTS │  │ PRODUCT_IMAGES  │
├─────────────────┤  ├─────────────────┤
│ id              │  │ id              │
│ product_id      │  │ product_id      │
│ option_name     │  │ image_url       │
│ weight          │  │ image_type      │
│ grade           │  │ display_order   │
│ price           │  └─────────────────┘
│ stock_status    │
│ sale_status     │
└───────┬─────────┘
        │
        │
        ▼
┌─────────────────┐
│   ORDER_ITEMS   │
├─────────────────┤
│ id              │
│ order_id        │
│ variant_id      │
│ product_snapshot│
│ option_snapshot │
│ quantity        │
│ unit_price      │
│ total_price     │
└────────┬────────┘
         │
         │ N:1
         ▼
┌─────────────────┐
│     ORDERS      │
├─────────────────┤
│ id              │
│ order_number    │
│ customer_name   │
│ customer_phone  │
│ receiver_name   │
│ receiver_phone  │
│ postal_code     │
│ address1        │
│ address2        │
│ subtotal        │
│ shipping        │
│ total           │
│ order_status    │
│ payment_status  │
│ created_at      │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         │ 1:N              │ 1:1/N
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│    PAYMENTS     │  │    SHIPMENTS    │
├─────────────────┤  ├─────────────────┤
│ id              │  │ id              │
│ order_id        │  │ order_id        │
│ provider        │  │ carrier         │
│ payment_key     │  │ tracking_number │
│ method          │  │ shipped_at      │
│ amount          │  │ delivered_at    │
│ status          │  └─────────────────┘
│ approved_at     │
└─────────────────┘
```

---

# 32. 데이터 설계 핵심 원칙

## 상품 가격 Snapshot

주문 당시 상품 가격을 OrderItem에 별도로 저장한다.

예를 들어 고객이 39,000원에 구매한 이후 관리자가 가격을 42,000원으로 변경해도 과거 주문은 계속 39,000원으로 유지되어야 한다.

따라서:

```text
ProductVariant.price
```

만 참조하지 않고

```text
OrderItem.unit_price
OrderItem.product_snapshot
OrderItem.option_snapshot
```

을 저장한다.

---

# 33. 이미지 Architecture

이미지는 PostgreSQL에 저장하지 않는다.

```text
Cloudflare R2
      │
      ├── peach
      ├── gotgam
      ├── hero
      └── story
```

DB에는 URL 및 Metadata만 저장한다.

모바일 성능을 위해 WebP/AVIF 등의 최적화된 이미지 포맷을 사용하고 Next.js Image 기능을 활용한다.

---

# 34. Repository 구조

```text
family-fruit-shop/
│
├── app/
│   │
│   ├── (customer)/
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── orders/
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
│   └── api/
│       ├── products/
│       ├── orders/
│       ├── payments/
│       └── admin/
│
├── components/
│   │
│   ├── ui/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── order/
│   └── admin/
│
├── lib/
│   │
│   ├── db/
│   ├── auth/
│   ├── payment/
│   ├── validation/
│   └── storage/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
└── package.json
```

단일 Repository 구조를 기본으로 한다.

---

# 35. Mobile Performance

과일 쇼핑몰은 이미지 비중이 높기 때문에 모바일 성능을 중요하게 관리한다.

특히 다음을 적용한다.

* Next.js Image
* Responsive Image
* Lazy Loading
* WebP / AVIF
* 이미지 크기 제한
* CDN 활용
* 필요 이상의 JavaScript 사용 제한
* Server Component 적극 활용
* 모바일 네트워크 환경 기준 성능 테스트

목표는 고객이 카카오톡이나 문자 링크를 통해 접속했을 때 상품 화면을 빠르게 확인할 수 있도록 하는 것이다.

---

# 36. PWA

PWA는 MVP 필수 요구사항으로 지정하지 않는다.

서비스 운영 후 필요성이 확인되면 적용한다.

```text
Mobile Responsive Web
        ↓
       PWA
        ↓
필요 시 Native App
```

PWA 적용 시 사용자는 모바일 브라우저에서 사이트를 홈 화면에 추가하여 앱과 유사하게 접근할 수 있다.

---

# 37. 보안 기본 원칙

커머스 서비스이므로 초기부터 다음 원칙을 적용한다.

* HTTPS 강제
* 관리자 페이지 인증
* 관리자 API Authorization
* Password Hash 저장
* 서버 입력값 Zod 검증
* SQL Injection 방어
* XSS 방어
* CSRF 고려
* Rate Limiting 검토
* 주문번호 추측 방지
* 환경변수를 통한 Secret 관리
* PG Secret Key Client 노출 금지
* 결제금액 서버 재검증
* 개인정보 최소 수집

특히 카드번호 등의 결제정보를 자체 DB에 저장하지 않는다.

결제 관련 민감정보는 PG를 통해 처리한다.

---

# 38. 개인정보

비회원 주문에서도 개인정보가 발생한다.

주요 개인정보:

```text
이름
휴대전화
수령인
수령인 연락처
배송주소
```

따라서 실제 서비스 오픈 전에는 다음 정책이 필요하다.

* 개인정보처리방침
* 이용약관
* 개인정보 수집·이용 동의
* 보관기간 정의
* 주문정보 삭제 정책
* 관리자 접근 제한

---

# 39. MVP 개발 범위

첫 개발에서 모든 기능을 구현하지 않는다.

## MVP 1

브랜드 및 상품 서비스

```text
Mobile Home
Season
Products
Product Detail
Story
Guide
Contact

Admin Login
Season Management
Product Management

PostgreSQL
Image Storage
Deployment
```

## MVP 2

주문

```text
Cart
Checkout
Non-member Order
Orders
OrderItems
Order Lookup
Admin Order Management
```

## MVP 3

결제

```text
Toss Payments Test Environment

Payment Request
Payment Confirm
Payment Failure
Payment Cancel

Payments Table
```

## MVP 4

배송

```text
Shipping Management
Carrier
Tracking Number
Shipping Status
Customer Order Tracking
```

---

# 40. 이후 확장

실제 판매량과 운영 필요성이 확인된 이후에만 확장한다.

```text
PWA

알림톡 / SMS

택배 API

고객 관리

재구매 관리

시즌 판매 알림

재고 자동화

환불 관리

매출 Dashboard

상품별 판매 분석

시즌별 매출 비교
```

회원제 역시 이 단계에서 검토한다.

---

# 41. 현재 제외 범위

초기 프로젝트에서는 다음을 제외한다.

* 광고
* 제휴 마케팅
* 광고 플랫폼
* 복잡한 CRM
* 포인트
* 등급제
* 쿠폰 시스템
* 리뷰 시스템
* 추천 알고리즘
* AI
* Microservice
* Native App
* 복잡한 ERP

사업적으로 필요성이 확인될 경우 별도 Phase로 검토한다.

---

# 42. 최종 시스템 구조

```text
                  CUSTOMER
                     │
                     ▼
              Smartphone Web
                     │
                     ▼
                Cloudflare
              DNS / CDN / HTTPS
                     │
                     ▼
                   Vercel
                     │
                     ▼
        ┌──────────────────────────┐
        │          Next.js         │
        │                          │
        │ CUSTOMER                 │
        │ ├─ Home                  │
        │ ├─ Season                │
        │ ├─ Products              │
        │ ├─ Product Detail        │
        │ ├─ Cart                  │
        │ ├─ Checkout              │
        │ ├─ Payment               │
        │ └─ Order Lookup          │
        │                          │
        │ ADMIN                    │
        │ ├─ Dashboard             │
        │ ├─ Seasons               │
        │ ├─ Products              │
        │ ├─ Orders                │
        │ ├─ Shipping              │
        │ └─ Settings              │
        │                          │
        │ SERVER                   │
        │ ├─ Business Logic        │
        │ ├─ API                   │
        │ ├─ Validation            │
        │ ├─ Authentication        │
        │ ├─ Order Processing      │
        │ └─ Payment Processing    │
        └────────────┬─────────────┘
                     │
          ┌──────────┼───────────┐
          │          │           │
          ▼          ▼           ▼
    PostgreSQL      R2          Toss
                    │          Payments
                    │
                 Images
```

---

# 43. 프로젝트 최종 기술 구성

```text
Architecture
Mobile First Responsive Monolithic Web Application

Language
TypeScript

Application
Next.js + React

UI
Tailwind CSS
shadcn/ui
Lucide

Form / Validation
React Hook Form
Zod

State
Zustand

Server
Next.js Route Handlers
Server Actions

Database
PostgreSQL

ORM
Prisma

Storage
Cloudflare R2

Payment
Toss Payments

Address
Daum Postcode

Infrastructure
Vercel
Cloudflare

Optional
PWA
```

---

# 44. 최종 개발 방향

본 프로젝트에서 중요한 것은 대형 쇼핑몰과 동일한 기능을 구현하는 것이 아니다.

사업의 실제 특성은 다음과 같다.

```text
상품 종류가 적음
        +
시즌성이 강함
        +
가족 단위 운영
        +
모바일 고객 중심
        +
신선식품
```

따라서 시스템도 이 조건에 맞춰 단순하게 설계한다.

초기 핵심 사용자 경험은 다음 한 줄로 정의한다.

> **고객이 모바일 링크를 눌러 접속한 뒤 원하는 과일을 확인하고 옵션을 선택하여 주문·결제를 최대한 짧고 간단하게 완료할 수 있는 서비스**

운영 측면에서는 다음을 목표로 한다.

> **가족 구성원이 개발자 도움 없이 스마트폰이나 PC에서 시즌, 상품, 가격, 품절, 주문 및 배송을 관리할 수 있는 서비스**

최종적으로 본 프로젝트는

**복숭아·곶감 시즌 판매 → 모바일 주문 → 결제 → 배송 → 재구매**

라는 하나의 단순한 흐름을 중심으로 개발한다.

아키텍처는 처음부터 과도하게 확장하지 않고 **Next.js + PostgreSQL 기반의 단일 애플리케이션**으로 시작하며, 실제 사업 성장에 따라 PWA, 고객관리, 택배 자동화, 알림, 매출 분석 등을 점진적으로 추가한다.
