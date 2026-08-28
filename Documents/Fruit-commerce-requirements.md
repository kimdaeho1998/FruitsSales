# 가족 과일 시즌 커머스 웹서비스 요구사항 명세서

## 1. 문서 개요

### 1.1 문서 목적

본 문서는 복숭아와 곶감을 시즌별로 판매하는 가족 운영형 모바일 커머스 웹서비스의 요구사항을 정의한다.

본 명세서는 서비스 기획, UI/UX 설계, 데이터베이스 설계, API 설계, 구현, 테스트, 배포의 기준 문서로 사용한다.

### 1.2 프로젝트 정의

본 프로젝트는 가족 단위로 운영하는 과일 판매·중매 사업을 온라인으로 확장하기 위한 **Mobile First 시즌형 과일 커머스 웹서비스**이다.

주요 판매 품목은 다음 두 종류로 한정한다.

- 복숭아
- 곶감

서비스는 일반적인 종합 쇼핑몰이 아니라 각 과일의 출하 및 판매 시기에 맞춰 메인 콘텐츠와 상품 구성을 전환하는 **Season First Commerce** 구조를 따른다.

### 1.3 핵심 목표

- 모바일 사용자가 상품 확인부터 주문·결제까지 짧은 흐름으로 완료할 수 있어야 한다.
- 복숭아 시즌, 곶감 시즌, 비시즌을 관리자 설정으로 전환할 수 있어야 한다.
- 가족 운영자가 개발자 도움 없이 상품, 가격, 품절, 주문, 배송 상태를 관리할 수 있어야 한다.
- 회원가입 없이 비회원 주문이 가능해야 한다.
- 주문과 결제를 분리하고 서버에서 결제 금액과 PG 승인 결과를 검증해야 한다.
- 초기에는 단일 Next.js 애플리케이션으로 구성하고 향후 필요 시 점진적으로 확장할 수 있어야 한다.

---

## 2. 서비스 범위

### 2.1 MVP 포함 범위

#### 고객 서비스

- 모바일 홈
- 현재 시즌 표시
- 상품 목록
- 상품 상세
- 상품 옵션 선택
- 장바구니
- 비회원 주문서
- 주문 생성
- 결제
- 주문 완료
- 비회원 주문 조회
- 배송 상태 조회
- 브랜드/가족 소개
- 배송 및 교환/환불 안내
- 전화/문자/카카오톡 문의 연결

#### 관리자 서비스

- 관리자 로그인
- 관리자 대시보드
- 시즌 관리
- 상품 관리
- 상품 옵션 관리
- 상품 이미지 관리
- 가격 변경
- 판매중/품절/비활성 상태 관리
- 주문 목록
- 주문 상세
- 주문 상태 변경
- 배송 상태 변경
- 택배사 및 송장번호 관리
- 기본 사이트 설정 관리

#### 시스템

- PostgreSQL 기반 데이터 저장
- 상품 이미지 외부 Object Storage 저장
- PG 결제 연동
- 서버 기반 주문/금액 검증
- 모바일 우선 반응형 UI
- 관리자 인증
- HTTPS 배포

### 2.2 초기 제외 범위

다음 기능은 MVP에서 제외한다.

- 광고
- 제휴 마케팅
- 추천 알고리즘
- AI 기능
- Native App
- React Native
- Flutter
- Microservice Architecture
- FastAPI 별도 Backend
- Spring Boot
- Kubernetes
- Kafka
- Elasticsearch
- 복잡한 ERP
- 포인트
- 회원 등급
- 쿠폰 시스템
- 리뷰 시스템
- 복잡한 CRM
- 자동 재고 최적화
- 다중 판매자
- 다중 브랜드 Marketplace

---

## 3. 사용자 정의

### 3.1 고객

서비스에 접속하여 상품을 조회하고 주문·결제를 진행하는 일반 사용자이다.

기본적으로 비회원 사용을 전제로 한다.

### 3.2 관리자

가족 운영자 또는 사업 운영 담당자이다.

관리자는 다음 업무를 수행한다.

- 시즌 설정
- 상품 등록/수정
- 가격 변경
- 품절 처리
- 주문 확인
- 주문 상태 변경
- 배송 처리
- 송장번호 등록
- 사이트 기본 정보 관리

---

## 4. 서비스 운영 원칙

### 4.1 Season First

상품보다 시즌을 중심으로 서비스 노출을 관리한다.

지원 시즌 타입:

- `PEACH`
- `GOTGAM`
- `OFF_SEASON`

### 4.2 Mobile First

모바일 화면을 기준으로 UI를 설계하고 태블릿 및 PC에 반응형으로 확장한다.

### 4.3 Non-Member First

구매 전에 회원가입을 강제하지 않는다.

비회원 주문 조회는 다음 조합을 기본으로 한다.

- 주문번호
- 휴대전화번호

### 4.4 Admin Simple

관리자는 웹 개발 지식 없이 주요 운영 작업을 수행할 수 있어야 한다.

### 4.5 Progressive Commerce

서비스는 다음 순서로 확장 가능해야 한다.

1. 상품 소개
2. 주문
3. 결제
4. 배송
5. 고객관리
6. 알림
7. 매출 분석

---

# 5. 기능 요구사항

## FR-001 현재 시즌 조회

### 설명

고객이 사이트에 접속하면 현재 활성화된 시즌을 조회하여 메인 화면을 구성해야 한다.

### 요구사항

- 시스템은 현재 `ACTIVE` 상태의 시즌을 조회해야 한다.
- 활성 시즌이 복숭아인 경우 복숭아 중심 콘텐츠를 노출해야 한다.
- 활성 시즌이 곶감인 경우 곶감 중심 콘텐츠를 노출해야 한다.
- 활성 시즌이 없거나 비시즌 상태인 경우 비시즌 안내 화면을 노출해야 한다.

### 수용 기준

- 관리자가 시즌을 변경하면 코드 수정이나 재배포 없이 고객 화면에 반영되어야 한다.

---

## FR-002 홈 화면

### 설명

홈 화면은 현재 판매 상품, 시즌 정보, 브랜드 신뢰 정보, 구매 진입 경로를 제공한다.

### 필수 요소

- 브랜드 로고
- 현재 시즌명
- Hero 이미지
- Hero 제목
- Hero 설명
- 대표 상품
- 상품 보기 CTA
- 산지/선별/포장 소개
- 전화/문자/카카오톡 문의
- 배송 안내 링크

### 수용 기준

- 모바일 환경에서 주요 CTA가 첫 화면 또는 짧은 스크롤 내에 노출되어야 한다.

---

## FR-003 상품 목록

### 설명

현재 시즌에서 판매 가능한 상품 목록을 제공한다.

### 기능

- 현재 시즌 상품 조회
- 판매중 상품 우선 노출
- 대표 이미지
- 상품명
- 가격 시작값
- 판매 상태
- 가정용/선물용 구분
- 상품 상세 이동

### 필터

- 전체
- 가정용
- 선물용
- 판매중

---

## FR-004 상품 상세

### 필수 정보

- 상품명
- 대표 이미지
- 추가 이미지
- 품종
- 산지
- 상품 설명
- 판매 옵션
- 옵션별 가격
- 중량 또는 개수
- 등급
- 배송비
- 판매 상태
- 품절 상태
- 배송 안내
- 교환/환불 안내

### 기능

- 옵션 선택
- 수량 선택
- 장바구니 추가
- 바로 구매

### 수용 기준

- 판매 불가 또는 품절 옵션은 구매할 수 없어야 한다.
- 모바일 화면 하단에 구매 CTA를 고정할 수 있어야 한다.

---

## FR-005 상품 옵션

### 설명

실제 판매 단위는 Product와 분리된 Product Variant로 관리한다.

### 예시

복숭아:

- 3kg 가정용
- 3kg 선물용
- 4kg 선물용
- 5kg 선물용

곶감:

- 20개입
- 30개입
- 선물세트

### 필수 데이터

- 옵션명
- 중량 또는 개수
- 상품 등급
- 가격
- 재고 상태
- 판매 상태

---

## FR-006 장바구니

### 기능

- 상품 추가
- 옵션별 상품 유지
- 수량 변경
- 상품 삭제
- 상품금액 계산
- 배송비 계산
- 총 결제금액 계산
- 주문서 이동

### 검증

- 장바구니의 가격은 최종 주문 생성 시 서버에서 다시 검증해야 한다.

---

## FR-007 비회원 주문서

### 필수 입력

#### 주문자

- 이름
- 휴대전화번호

#### 배송정보

- 받는 사람
- 받는 사람 휴대전화번호
- 우편번호
- 기본주소
- 상세주소
- 배송 요청사항

### 기타

- 주소 입력은 주소 검색 API 연동을 고려한다.
- 개인정보 수집·이용 동의를 받아야 한다.

---

## FR-008 주문 생성

### 설명

사용자가 결제를 요청하기 전에 서버에서 주문을 생성한다.

### 입력

클라이언트는 최소한 다음 정보를 전달한다.

- `productVariantId`
- `quantity`
- 주문자 정보
- 배송정보

### 서버 처리

서버는 다음을 수행해야 한다.

1. Variant 존재 여부 확인
2. 판매 가능 여부 확인
3. 품절 여부 확인
4. DB에서 실제 가격 재조회
5. 수량 검증
6. 상품금액 계산
7. 배송비 계산
8. 최종 금액 계산
9. Order 생성
10. OrderItem 생성
11. 주문번호 생성
12. 주문 상태를 `PAYMENT_PENDING`으로 설정

### 금지 사항

클라이언트가 전달한 가격을 그대로 신뢰해서는 안 된다.

---

## FR-009 주문번호

### 요구사항

- 고객용 주문번호를 생성해야 한다.
- 단순 연속 정수 PK를 고객에게 그대로 노출하지 않는다.
- 주문번호는 중복되어서는 안 된다.

### 예시

`PF-20260828-A7F92`

---

## FR-010 결제 요청

### 권장 PG

- Toss Payments

### 요구사항

- 결제 인증은 PG SDK를 통해 수행한다.
- 결제 Secret Key는 서버에서만 사용한다.
- 브라우저에 Secret Key를 노출해서는 안 된다.

---

## FR-011 결제 승인

### 설명

PG 인증 성공 이후 서버가 결제 승인 API를 호출한다.

### 서버 검증

- 주문 존재 여부
- 주문 상태
- 주문 금액
- PG 승인 요청 금액
- PG 승인 결과 금액
- 결제 식별값
- 중복 승인 여부

### 상태 변경

결제 승인 성공 시:

- `Payment.status = PAID`
- `Order.payment_status = PAID`
- `Order.order_status = PAID`

### 금지 사항

PG 성공 Redirect만으로 결제 완료 처리해서는 안 된다.

---

## FR-012 결제 실패

결제 실패 시 다음을 처리해야 한다.

- Payment 실패 정보 기록 가능
- Order는 결제 완료 상태로 변경하지 않음
- 사용자가 재결제를 시도할 수 있는 구조를 허용

한 주문에 여러 Payment 시도가 존재할 수 있다.

---

## FR-013 결제 취소

### 기본 정책

초기에는 관리자만 결제 취소를 수행한다.

### 처리 순서

1. 관리자 취소 요청
2. PG 취소 API 호출
3. PG 취소 성공 확인
4. Payment 상태 갱신
5. Order 상태 갱신

### 금지 사항

PG 취소 전에 DB 상태를 먼저 최종 `CANCELLED`로 변경하지 않는다.

---

## FR-014 주문 완료 화면

### 표시 정보

- 주문 완료 메시지
- 주문번호
- 상품명
- 옵션
- 수량
- 결제금액
- 주문 조회 버튼
- 홈 이동 버튼

---

## FR-015 비회원 주문 조회

### 입력

- 주문번호
- 휴대전화번호

### 표시 정보

- 주문 상품
- 옵션
- 수량
- 결제금액
- 주문 상태
- 결제 상태
- 배송 상태
- 택배사
- 송장번호

### 보안

주문번호만으로 개인정보를 조회할 수 없어야 한다.

---

## FR-016 배송 관리

### 관리자 기능

- 배송 준비 상태 변경
- 택배사 입력
- 송장번호 입력
- 배송중 상태 변경
- 배송 완료 상태 변경

### Shipment 데이터

- carrier
- tracking_number
- shipped_at
- delivered_at

---

## FR-017 브랜드 소개

### 페이지 목적

가족 운영 사업과 상품 신뢰도를 설명한다.

### 콘텐츠

- 가족/사업 소개
- 과일 판매 배경
- 산지
- 선별 과정
- 포장 과정
- 배송 과정
- 실제 이미지

---

## FR-018 배송 및 교환/환불 안내

고객이 확인할 수 있어야 하는 정보:

- 주문 방법
- 배송 일정
- 배송비
- 도서산간 정책
- 상품 보관 방법
- 교환/환불 조건
- 신선식품 관련 주의사항
- 고객 문의 방법

---

# 6. 관리자 기능 요구사항

## FR-100 관리자 로그인

### 요구사항

- 관리자 전용 로그인 화면을 제공한다.
- 비밀번호는 평문으로 저장하지 않는다.
- 인증되지 않은 사용자는 관리자 페이지에 접근할 수 없어야 한다.

---

## FR-101 관리자 대시보드

### 표시 정보

- 현재 시즌
- 오늘 주문 수
- 결제 완료 주문 수
- 배송 준비 주문 수
- 최근 주문
- 빠른 작업 링크

### 원칙

복잡한 BI 기능은 MVP에서 제외한다.

---

## FR-102 시즌 관리

### 기능

- 시즌 생성
- 시즌 수정
- 시즌 활성화
- 시즌 종료
- 복숭아/곶감/비시즌 전환
- 판매 시작일
- 판매 종료일
- Hero 제목
- Hero 설명
- Hero 이미지

### 상태

- `UPCOMING`
- `ACTIVE`
- `CLOSED`

---

## FR-103 상품 관리

### 기능

- 상품 등록
- 상품 수정
- 상품 비활성화
- 상품 노출 순서 변경
- 상품 설명 수정
- 산지 수정
- 품종 수정
- 가정용/선물용 구분

---

## FR-104 상품 옵션 관리

### 기능

- 옵션 등록
- 옵션 수정
- 가격 변경
- 중량/개수 변경
- 등급 변경
- 판매 상태 변경
- 품절 상태 변경

---

## FR-105 상품 이미지 관리

### 기능

- 대표 이미지 업로드
- 갤러리 이미지 업로드
- 상세 이미지 업로드
- 이미지 순서 변경
- 이미지 삭제

### 저장 방식

실제 이미지 파일은 Object Storage에 저장하고 DB에는 URL과 Metadata만 저장한다.

---

## FR-106 주문 관리

### 목록 필터

- 전체
- 결제대기
- 결제완료
- 상품준비
- 배송준비
- 배송중
- 배송완료
- 취소
- 환불

### 주문 상세

- 주문번호
- 주문일
- 주문자
- 주문자 연락처
- 수령자
- 수령자 연락처
- 배송주소
- 상품
- 옵션
- 수량
- 금액
- 결제 상태
- 주문 상태
- 배송 상태
- 송장번호
- 관리자 메모

---

## FR-107 사이트 설정

관리자는 다음 기본 정보를 관리할 수 있어야 한다.

- 브랜드명
- 대표 전화번호
- 문자 연락처
- 카카오톡 링크
- 사업자 정보
- 기본 배송비
- 무료배송 기준
- 기본 택배사
- 고객센터 운영시간
- Footer 정보

---

# 7. 상태 정의

## 7.1 Order Status

```text
PAYMENT_PENDING
PAID
PREPARING
READY_TO_SHIP
SHIPPED
DELIVERED
CANCELLED
REFUNDED
```

## 7.2 Payment Status

```text
READY
IN_PROGRESS
PAID
FAILED
CANCELLED
PARTIALLY_CANCELLED
```

## 7.3 Season Status

```text
UPCOMING
ACTIVE
CLOSED
```

## 7.4 Product Sale Status

```text
ACTIVE
INACTIVE
```

## 7.5 Stock Status

```text
IN_STOCK
SOLD_OUT
```

---

# 8. 데이터 요구사항

## DR-001 Users

주요 컬럼:

- id
- username
- password_hash
- name
- role
- is_active
- last_login_at
- created_at
- updated_at

---

## DR-002 Seasons

주요 컬럼:

- id
- year
- type
- name
- start_date
- end_date
- status
- hero_title
- hero_description
- hero_image_url
- created_at
- updated_at

---

## DR-003 Products

주요 컬럼:

- id
- season_id
- name
- slug
- category
- variety
- origin
- short_description
- description
- sale_status
- display_order
- created_at
- updated_at

---

## DR-004 Product Variants

주요 컬럼:

- id
- product_id
- option_name
- weight_or_count
- grade
- price
- stock_status
- sale_status
- display_order
- created_at
- updated_at

---

## DR-005 Product Images

주요 컬럼:

- id
- product_id
- image_url
- image_type
- alt_text
- display_order
- created_at

Image Type:

- `THUMBNAIL`
- `GALLERY`
- `DETAIL`

---

## DR-006 Orders

주요 컬럼:

- id
- order_number
- customer_name
- customer_phone
- receiver_name
- receiver_phone
- postal_code
- address1
- address2
- request_message
- subtotal_amount
- shipping_amount
- total_amount
- order_status
- payment_status
- admin_memo
- created_at
- updated_at

---

## DR-007 Order Items

주요 컬럼:

- id
- order_id
- variant_id
- product_name_snapshot
- option_name_snapshot
- quantity
- unit_price
- total_price

### Snapshot 원칙

과거 주문 데이터는 상품 가격 변경의 영향을 받으면 안 된다.

따라서 주문 당시의 다음 값을 OrderItem에 별도로 저장한다.

- 상품명
- 옵션명
- 단가

---

## DR-008 Payments

주요 컬럼:

- id
- order_id
- provider
- payment_key
- method
- requested_amount
- approved_amount
- status
- approved_at
- cancelled_amount
- created_at
- updated_at

### 관계

한 Order에는 여러 Payment 시도가 존재할 수 있다.

---

## DR-009 Shipments

주요 컬럼:

- id
- order_id
- carrier
- tracking_number
- shipped_at
- delivered_at
- created_at
- updated_at

---

## DR-010 Site Settings

예시 Key:

- BRAND_NAME
- PHONE
- KAKAO_URL
- BUSINESS_NUMBER
- DEFAULT_SHIPPING_FEE
- FREE_SHIPPING_THRESHOLD
- DEFAULT_CARRIER
- CUSTOMER_CENTER_HOURS

---

# 9. ERD 관계 요구사항

```text
SEASONS
   │
   │ 1:N
   ▼
PRODUCTS
   │
   ├──────────────┐
   │              │
   │ 1:N          │ 1:N
   ▼              ▼
PRODUCT_VARIANTS PRODUCT_IMAGES
   │
   │ 1:N
   ▼
ORDER_ITEMS
   │
   │ N:1
   ▼
ORDERS
   │
   ├──────────────┐
   │              │
   │ 1:N          │ 1:1/N
   ▼              ▼
PAYMENTS       SHIPMENTS
```

---

# 10. UI/UX 요구사항

## UX-001 Mobile First

- 기본 디자인 기준 폭은 모바일로 한다.
- 태블릿과 PC는 breakpoint 기반으로 확장한다.
- 모바일에서 가로 스크롤이 발생해서는 안 된다.

## UX-002 구매 CTA

상품 상세 화면에서 구매 CTA는 쉽게 접근 가능해야 한다.

권장:

- 모바일 하단 고정 CTA
- 장바구니
- 바로 구매

## UX-003 입력 최소화

주문 과정에서 불필요한 필드를 요구하지 않는다.

## UX-004 비회원 구매

회원가입 없이 구매가 가능해야 한다.

## UX-005 관리자 반응형

관리자 기능도 스마트폰과 PC에서 사용할 수 있어야 한다.

## UX-006 상품 이미지 중심

과일 특성상 실제 이미지의 품질과 가독성을 중요하게 처리한다.

---

# 11. 비기능 요구사항

## NFR-001 성능

- 모바일 네트워크 환경을 우선 고려한다.
- 상품 이미지는 필요 해상도에 맞춰 제공한다.
- Lazy Loading을 적용한다.
- WebP 또는 AVIF 사용을 권장한다.
- 불필요한 클라이언트 JavaScript를 최소화한다.
- 서버 렌더링 또는 Server Component 활용을 우선 고려한다.

## NFR-002 반응형

다음 화면을 지원한다.

- Mobile
- Tablet
- Desktop

## NFR-003 접근성

- 이미지에 적절한 alt text 제공
- 버튼 및 입력 요소 Label 제공
- 키보드 접근 가능성 고려
- 충분한 터치 영역 확보

## NFR-004 SEO

공개 상품 페이지는 검색 엔진에서 식별 가능한 Metadata를 제공해야 한다.

예:

- title
- description
- Open Graph
- 상품 이미지

---

# 12. 보안 요구사항

## SEC-001 HTTPS

Production 환경에서는 HTTPS를 강제한다.

## SEC-002 관리자 인증

관리자 페이지와 관리자 API는 인증된 사용자만 접근할 수 있어야 한다.

## SEC-003 Password

비밀번호는 Hash 형태로 저장한다.

평문 비밀번호 저장을 금지한다.

## SEC-004 Server Validation

모든 중요 입력값은 서버에서 다시 검증한다.

## SEC-005 결제 Secret

PG Secret Key는 서버 환경변수로 관리한다.

Client Bundle에 포함해서는 안 된다.

## SEC-006 가격 변조 방지

결제 금액은 DB 가격을 기준으로 서버에서 계산한다.

Client가 전달한 금액을 신뢰하지 않는다.

## SEC-007 결제 승인 검증

PG 승인 결과와 서버 주문 금액이 동일한지 확인한다.

## SEC-008 주문조회 보호

주문번호 하나만으로 주문 개인정보를 조회할 수 없어야 한다.

## SEC-009 민감 결제정보

카드번호 등 PG가 처리해야 하는 민감한 결제정보를 자체 DB에 저장하지 않는다.

## SEC-010 일반 Web 보안

다음을 고려한다.

- SQL Injection
- XSS
- CSRF
- Rate Limiting
- Session Security
- Cookie Security
- Secret Management

---

# 13. 개인정보 요구사항

## PRIV-001 최소 수집

비회원 주문에서 필요한 최소 정보만 수집한다.

- 주문자 이름
- 주문자 연락처
- 수령자 이름
- 수령자 연락처
- 배송주소
- 배송 요청사항

## PRIV-002 동의

주문 전 개인정보 수집·이용 동의를 받아야 한다.

## PRIV-003 정책 문서

실서비스 오픈 전 다음 문서를 준비해야 한다.

- 개인정보처리방침
- 이용약관
- 개인정보 수집·이용 동의
- 교환/환불 정책
- 배송 정책

## PRIV-004 접근 제한

주문 개인정보는 관리자 권한 사용자만 접근할 수 있어야 한다.

---

# 14. 권장 기술 스택

## 14.1 Language

- TypeScript

## 14.2 Application

- Next.js
- React

## 14.3 UI

- Tailwind CSS
- shadcn/ui
- Lucide React

## 14.4 Client

- React Hook Form
- Zod
- Zustand

## 14.5 Backend

- Next.js Route Handlers
- Next.js Server Actions

## 14.6 Database

- PostgreSQL

## 14.7 ORM

- Prisma

## 14.8 Database Hosting

후보:

- Supabase
- Neon

실제 서비스 배포 시점의 가격, 운영 정책, 지역, 백업 정책을 비교하여 최종 결정한다.

## 14.9 Image Storage

- Cloudflare R2

## 14.10 Payment

- Toss Payments

## 14.11 Address

- Daum Postcode API

## 14.12 Infrastructure

- Vercel
- Cloudflare

## 14.13 Analytics

후보:

- GA4
- Cloudflare Web Analytics

## 14.14 Optional

- PWA

---

# 15. 시스템 아키텍처 요구사항

아키텍처 유형:

**Mobile First Responsive Monolithic Web Application**

```text
                  CUSTOMER
                     │
                     ▼
              Smartphone Web
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
        ┌──────────────────────────┐
        │          Next.js         │
        │                          │
        │ Customer Web             │
        │ Admin Web                │
        │ Route Handlers           │
        │ Server Actions           │
        │ Business Logic           │
        │ Validation               │
        │ Authentication           │
        │ Order Processing         │
        │ Payment Processing       │
        └────────────┬─────────────┘
                     │
          ┌──────────┼───────────┐
          │          │           │
          ▼          ▼           ▼
    PostgreSQL      R2          Toss
                 Object Store   Payments
```

---

# 16. Repository 구조 요구사항

초기에는 단일 Repository를 사용한다.

```text
family-fruit-shop/
│
├── app/
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
│   ├── ui/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── order/
│   └── admin/
│
├── lib/
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

---

# 17. API 요구사항 초안

## 공개 API

```text
GET  /api/seasons/current
GET  /api/products
GET  /api/products/:slug

POST /api/orders

POST /api/payments/confirm

POST /api/orders/lookup
```

## 관리자 API

```text
POST   /api/admin/login

GET    /api/admin/seasons
POST   /api/admin/seasons
PATCH  /api/admin/seasons/:id

GET    /api/admin/products
POST   /api/admin/products
PATCH  /api/admin/products/:id

POST   /api/admin/products/:id/variants
PATCH  /api/admin/variants/:id

GET    /api/admin/orders
GET    /api/admin/orders/:id
PATCH  /api/admin/orders/:id

PATCH  /api/admin/orders/:id/shipment

GET    /api/admin/settings
PATCH  /api/admin/settings
```

실제 구현에서는 Next.js Server Actions와 Route Handlers 중 목적에 맞게 조정할 수 있다.

---

# 18. 주요 비즈니스 규칙

## BR-001 활성 시즌

고객용 메인 화면에서는 활성화된 시즌 하나를 기준으로 한다.

## BR-002 비시즌

판매 시즌이 아닌 경우 구매 가능한 상품을 강제로 노출하지 않는다.

## BR-003 판매 상태

상품과 옵션이 모두 구매 가능 상태여야 주문할 수 있다.

## BR-004 품절

품절 옵션은 주문 생성 단계에서 다시 차단해야 한다.

## BR-005 가격

실제 주문 가격의 Source of Truth는 서버 DB이다.

## BR-006 주문 Snapshot

주문 완료 이후 상품명이나 가격이 변경되어도 과거 주문의 상품명과 금액은 변경되지 않아야 한다.

## BR-007 결제

Order와 Payment는 별도 Entity로 관리한다.

## BR-008 결제 재시도

하나의 Order에서 여러 Payment 시도를 허용한다.

## BR-009 취소

결제 취소 성공 후에 주문/결제 상태를 최종 갱신한다.

## BR-010 배송

결제 완료 전 배송 처리 상태로 변경할 수 없어야 한다.

---

# 19. MVP 개발 단계

## Phase 1: 기본 서비스

- 프로젝트 Scaffold
- 모바일 Layout
- Home
- Season
- Product List
- Product Detail
- Story
- Guide
- Contact
- Admin Login
- Season Management
- Product Management
- PostgreSQL
- R2
- 배포

## Phase 2: 주문

- Product Variant
- Cart
- Checkout
- Order
- OrderItem
- 비회원 주문 조회
- 관리자 주문 관리

## Phase 3: 결제

- Toss Payments Test 환경
- 결제 요청
- 서버 승인
- 실패 처리
- 결제 재시도
- 관리자 취소
- Payment Entity

## Phase 4: 배송

- Shipment Entity
- 배송 준비
- 택배사
- 송장번호
- 배송중
- 배송완료
- 주문조회 반영

## Phase 5: 운영 안정화

- 관리자 UX 개선
- 모바일 성능 최적화
- 로그/에러 처리
- 보안 점검
- 개인정보 정책 반영
- 테스트
- Production 배포

---

# 20. 향후 확장 후보

다음 기능은 실제 사업 운영 결과를 보고 추가한다.

- PWA
- 알림톡
- SMS
- 택배 API
- 고객 관리
- 재구매 고객 관리
- 시즌 판매 알림
- 재고 이력
- 환불 관리
- 매출 Dashboard
- 상품별 판매 분석
- 시즌별 매출 비교
- 회원제
- 쿠폰
- 리뷰

---

# 21. 테스트 요구사항

## TEST-001 상품

- 활성 상품만 정상 노출
- 비활성 상품 주문 차단
- 품절 옵션 주문 차단
- 옵션별 가격 정상 표시

## TEST-002 주문

- 잘못된 Variant 차단
- 수량 0 이하 차단
- 서버 가격 계산 검증
- 주문번호 중복 방지
- 주문 Snapshot 보존

## TEST-003 결제

- 정상 승인
- 결제 실패
- 중복 승인 요청
- 주문금액과 PG 금액 불일치
- 취소 성공
- 취소 실패

## TEST-004 주문 조회

- 주문번호 + 전화번호 일치
- 주문번호만 입력 시 조회 차단
- 다른 전화번호 사용 시 조회 차단

## TEST-005 관리자

- 비인증 사용자 접근 차단
- 관리자 로그인
- 시즌 변경
- 가격 변경
- 품절 변경
- 주문 상태 변경
- 배송정보 등록

## TEST-006 반응형

최소 다음 화면 크기에서 확인한다.

- Mobile
- Tablet
- Desktop

---

# 22. 완료 기준

MVP는 다음 조건을 모두 만족하면 기능 완료로 판단한다.

- 모바일에서 현재 시즌 상품을 조회할 수 있다.
- 상품 옵션을 선택할 수 있다.
- 장바구니 또는 바로 구매가 가능하다.
- 비회원 주문을 생성할 수 있다.
- 서버에서 주문 가격을 검증한다.
- 테스트 PG를 통해 정상 결제를 완료할 수 있다.
- 결제 실패가 정상 처리된다.
- 관리자에서 주문을 확인할 수 있다.
- 관리자에서 배송 상태와 송장번호를 입력할 수 있다.
- 고객이 주문번호와 휴대전화번호로 주문 상태를 조회할 수 있다.
- 관리자에서 시즌과 상품 가격을 수정할 수 있다.
- 모바일, 태블릿, PC에서 UI가 정상 동작한다.
- 관리자 페이지가 인증으로 보호된다.
- Production에서 HTTPS가 적용된다.

---

# 23. 최종 프로젝트 정의

본 프로젝트의 핵심 사용자 경험은 다음과 같이 정의한다.

> 고객이 모바일 링크를 통해 접속하여 현재 판매 중인 복숭아 또는 곶감을 확인하고, 원하는 옵션을 선택한 뒤 비회원 주문 및 결제를 짧고 간단하게 완료할 수 있어야 한다.

운영자 경험은 다음과 같이 정의한다.

> 가족 운영자가 개발자 도움 없이 모바일 또는 PC 관리자 화면에서 시즌, 상품, 가격, 품절, 주문 및 배송을 관리할 수 있어야 한다.

초기 아키텍처는 다음 기준을 따른다.

> **Next.js + TypeScript + PostgreSQL 기반 Mobile First Responsive Monolithic Web Application**

사업 성장 전까지 시스템을 불필요하게 분리하지 않으며, 실제 요구가 발생하는 시점에 PWA, 고객관리, 택배 자동화, 알림, 매출 분석 등의 기능을 단계적으로 확장한다.
