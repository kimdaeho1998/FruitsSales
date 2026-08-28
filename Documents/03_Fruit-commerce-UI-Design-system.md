# 과일 시즌 커머스 웹서비스 UI 디자인 시스템

## 1. 문서 개요

### 1.1 목적

본 문서는 **과일 시즌 커머스 웹서비스**의 고객용 모바일 웹과 관리자
웹에서 일관된 사용자 경험을 제공하기 위한 UI 디자인 시스템을 정의한다.

본 디자인 시스템은 다음 구현 환경을 기준으로 한다.

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   Lucide React
-   Mobile First Responsive Web

본 문서는 화면 설계, 컴포넌트 구현, 코드 리뷰 및 향후 UI 확장의 기준
문서로 사용한다.

### 1.2 디자인 목표

서비스의 UI는 다음 목표를 따른다.

1.  신선식품의 품질과 신뢰감을 시각적으로 전달한다.
2.  복숭아와 곶감의 계절감을 자연스럽게 표현한다.
3.  상품 이미지가 UI보다 우선적으로 보이도록 한다.
4.  모바일에서 상품 선택과 구매가 빠르게 이루어지도록 한다.
5.  고령 사용자도 쉽게 이해할 수 있는 명확한 인터페이스를 제공한다.
6.  관리자 화면은 장식보다 빠른 운영과 상태 파악을 우선한다.

------------------------------------------------------------------------

# 2. 디자인 원칙

## DS-001 Mobile First

모든 고객 화면은 모바일을 기본으로 설계한다.

PC 화면을 먼저 제작한 뒤 축소하는 방식을 사용하지 않는다.

기본 우선순위:

``` text
Mobile
  ↓
Tablet
  ↓
Desktop
```

------------------------------------------------------------------------

## DS-002 Product First

과일 사진과 상품 정보가 가장 중요한 콘텐츠이다.

UI 장식이 상품보다 강하게 보이지 않아야 한다.

``` text
상품 이미지
   ↓
상품명
   ↓
가격
   ↓
옵션
   ↓
구매 CTA
```

------------------------------------------------------------------------

## DS-003 Season Identity

서비스 전체 브랜드는 동일하게 유지하되 현재 시즌에 따라 일부 Accent를
변경할 수 있다.

``` text
복숭아 시즌
→ 따뜻하고 밝은 Peach 계열

곶감 시즌
→ 차분하고 깊은 Amber 계열

비시즌
→ Neutral 계열
```

시즌별로 전체 UI를 완전히 다른 디자인으로 변경하지 않는다.

------------------------------------------------------------------------

## DS-004 Simple Commerce

고객에게 한 화면에서 너무 많은 선택지를 제공하지 않는다.

우선순위가 높은 CTA 하나를 명확하게 강조한다.

------------------------------------------------------------------------

## DS-005 Trust

신선식품 구매에 필요한 다음 정보를 쉽게 확인할 수 있어야 한다.

-   원산지
-   중량/수량
-   상품 등급
-   실제 상품 이미지
-   배송 정보
-   교환/환불 정보
-   판매자 연락처

------------------------------------------------------------------------

## DS-006 Accessible Touch

모바일 버튼과 입력 요소는 손가락으로 쉽게 조작할 수 있어야 한다.

최소 터치 영역:

``` text
44px × 44px 이상
```

주요 구매 CTA는 가능하면 48\~56px 높이를 사용한다.

------------------------------------------------------------------------

# 3. 브랜드 디자인 방향

## 3.1 핵심 이미지

브랜드가 전달해야 하는 인상:

-   신선함
-   정직함
-   따뜻함
-   산지 신뢰
-   가족 운영의 친근함
-   과하지 않은 프리미엄
-   계절감

## 3.2 피해야 할 방향

다음 스타일은 기본 방향에서 제외한다.

-   지나치게 화려한 Marketplace UI
-   과도한 Gradient
-   Neon Color
-   지나치게 많은 Badge
-   게임형 UI
-   복잡한 Dashboard 스타일의 고객 화면
-   지나친 Luxury Black/Gold 디자인
-   상품보다 UI가 강조되는 구성

------------------------------------------------------------------------

# 4. Color System

색상은 Tailwind Design Token으로 관리한다.

실제 최종 색상은 브랜드 로고 및 실제 상품 사진 확보 후 미세 조정할 수
있다.

## 4.1 Base Colors

  Token                권장값      용도
  -------------------- ----------- --------------
  `background`         `#FFFDFC`   기본 배경
  `surface`            `#FFFFFF`   Card / Sheet
  `foreground`         `#241F1D`   기본 Text
  `muted`              `#F6F3F1`   보조 배경
  `muted-foreground`   `#756D69`   보조 Text
  `border`             `#E9E3DF`   Border
  `destructive`        `#DC2626`   오류/삭제

------------------------------------------------------------------------

## 4.2 Peach Season

  Token         권장값      용도
  ------------- ----------- ----------------
  `peach-50`    `#FFF7F3`   Hero/Subtle BG
  `peach-100`   `#FFE9DF`   Badge
  `peach-300`   `#FDBFA8`   Decorative
  `peach-500`   `#F47F5F`   Primary Accent
  `peach-600`   `#DC6547`   Hover/Pressed
  `peach-700`   `#B94E35`   Strong Text

Primary:

``` text
#F47F5F
```

------------------------------------------------------------------------

## 4.3 Gotgam Season

  Token          권장값      용도
  -------------- ----------- ----------------
  `gotgam-50`    `#FFF9ED`   Hero/Subtle BG
  `gotgam-100`   `#FDECC8`   Badge
  `gotgam-300`   `#E8B15A`   Decorative
  `gotgam-500`   `#C97928`   Primary Accent
  `gotgam-600`   `#A95F1D`   Hover/Pressed
  `gotgam-700`   `#814615`   Strong Text

Primary:

``` text
#C97928
```

------------------------------------------------------------------------

## 4.4 Off Season

비시즌에서는 Neutral 중심으로 구성한다.

Primary CTA가 필요한 경우 브랜드 기본 Peach 색상을 유지할 수 있다.

------------------------------------------------------------------------

## 4.5 Semantic Colors

  상태      권장 색상
  --------- -----------
  Success   `#15803D`
  Warning   `#B45309`
  Error     `#DC2626`
  Info      `#2563EB`

상태를 색상만으로 구분하지 않고 Icon 또는 Text Label을 함께 사용한다.

------------------------------------------------------------------------

# 5. Typography

## 5.1 Font

한글 가독성을 우선한다.

권장:

``` text
Pretendard
```

Fallback:

``` css
font-family:
  Pretendard,
  "Noto Sans KR",
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;
```

## 5.2 Type Scale

  Token          Mobile   Desktop   Weight 용도
  ------------ -------- --------- -------- ------------
  Display          32px      48px      700 Hero
  H1               28px      36px      700 Page Title
  H2               24px      30px      700 Section
  H3               20px      24px      600 Card/Block
  Body Large       18px      18px      400 강조 본문
  Body             16px      16px      400 기본 본문
  Body Small       14px      14px      400 보조정보
  Caption          12px      12px      400 Caption

## 5.3 Price

가격은 상품 정보에서 강하게 표시한다.

예:

``` text
39,000원
```

권장:

-   20\~24px
-   Weight 700
-   숫자와 `원`의 가독성 유지

------------------------------------------------------------------------

# 6. Spacing System

4px 기반 Scale을 사용한다.

``` text
1 = 4px
2 = 8px
3 = 12px
4 = 16px
5 = 20px
6 = 24px
8 = 32px
10 = 40px
12 = 48px
16 = 64px
```

## 모바일 기본 Padding

``` text
좌우 16px
```

큰 모바일/태블릿:

``` text
24px
```

Desktop Content:

``` text
max-width: 1200px
margin: auto
```

------------------------------------------------------------------------

# 7. Radius

친근하고 부드러운 인상을 위해 중간 정도의 Radius를 사용한다.

  Component       Radius
  --------------- --------------
  Button          10\~12px
  Input           10px
  Card            14\~16px
  Product Image   16px
  Bottom Sheet    20\~24px Top
  Badge           Full/Pill

과도하게 둥근 UI는 피한다.

------------------------------------------------------------------------

# 8. Shadow

Shadow는 최소한으로 사용한다.

기본 Card는 Border 중심으로 구성한다.

``` text
Default
→ Border

Elevated
→ Small Shadow

Modal / Sheet
→ Medium Shadow
```

상품 Card 전체에 강한 그림자를 반복 사용하지 않는다.

------------------------------------------------------------------------

# 9. Responsive Breakpoints

Tailwind 기본 Breakpoint를 기준으로 한다.

``` text
Default : Mobile
sm      : 640px
md      : 768px
lg      : 1024px
xl      : 1280px
2xl     : 1536px
```

UI 구현은 기본적으로 Mobile CSS를 먼저 작성한다.

예:

``` tsx
<div className="px-4 md:px-6 lg:mx-auto lg:max-w-6xl">
```

------------------------------------------------------------------------

# 10. Layout System

## 10.1 Customer Mobile

``` text
┌──────────────────────────┐
│ Header                   │
├──────────────────────────┤
│                          │
│ Page Content             │
│                          │
│                          │
├──────────────────────────┤
│ Bottom Navigation / CTA  │
└──────────────────────────┘
```

## 10.2 Desktop

``` text
┌────────────────────────────────────┐
│ Header                             │
├────────────────────────────────────┤
│                                    │
│       Max Width Content Area       │
│                                    │
└────────────────────────────────────┘
```

## 10.3 Admin Mobile

관리자 모바일은 Card/List 중심으로 구성한다.

## 10.4 Admin Desktop

관리자 PC는 Sidebar + Content Layout을 사용할 수 있다.

``` text
┌────────────┬───────────────────────┐
│ Sidebar    │ Header                │
│            ├───────────────────────┤
│            │                       │
│            │ Content               │
│            │                       │
└────────────┴───────────────────────┘
```

------------------------------------------------------------------------

# 11. Header

## 모바일

포함 요소:

-   Logo
-   장바구니
-   필요 시 Menu

높이 권장:

``` text
56~64px
```

## Desktop

-   Logo
-   시즌
-   상품
-   이야기
-   배송안내
-   문의
-   장바구니

------------------------------------------------------------------------

# 12. Bottom Navigation

모바일 고객용 기본 메뉴:

``` text
홈
상품
장바구니
주문조회
```

구성:

``` text
┌──────────────────────────────┐
│  Home   Product  Cart  Order │
│   홈      상품   장바구니 조회 │
└──────────────────────────────┘
```

### 규칙

-   Icon + Label 사용
-   현재 메뉴 명확히 표시
-   Safe Area 고려
-   구매 CTA와 겹치지 않도록 화면별 처리

------------------------------------------------------------------------

# 13. Button System

## Primary

주요 구매 행동.

예:

-   바로 구매
-   주문하기
-   결제하기
-   저장

권장:

``` text
height: 52px
font-weight: 600
width: mobile에서는 필요 시 100%
```

## Secondary

보조 행동.

예:

-   장바구니
-   수정
-   다시 시도

## Outline

낮은 우선순위 행동.

## Destructive

-   삭제
-   주문 취소
-   결제 취소

Destructive 작업은 필요 시 Confirmation Dialog를 제공한다.

------------------------------------------------------------------------

# 14. Input System

기본 높이:

``` text
48~52px
```

입력 구성:

``` text
Label

[ Input                    ]

Helper / Error
```

### 필수 규칙

-   Placeholder만으로 Label을 대체하지 않는다.
-   오류 메시지는 입력 필드 가까이에 표시한다.
-   전화번호 입력은 모바일 숫자 Keyboard를 유도한다.
-   우편번호는 주소 검색 CTA와 함께 제공한다.

------------------------------------------------------------------------

# 15. Card System

## Product Card

포함 정보:

-   상품 이미지
-   상품명
-   짧은 옵션 정보
-   가격
-   배송 정보
-   품절 Badge

모바일에서는 1열 또는 2열을 화면/이미지 크기에 따라 선택한다.

권장 기본:

``` text
Mobile → 2 Column Product Grid
Small Mobile → 2 Column 유지 가능하나 가독성 검증
Desktop → 3~4 Column
```

------------------------------------------------------------------------

# 16. Product Image

과일 커머스에서 가장 중요한 Visual Component이다.

## 권장 비율

상품 목록:

``` text
1:1
```

상품 상세:

``` text
1:1
또는
4:5
```

Hero:

``` text
Mobile 4:5 또는 3:4
Desktop 16:9 또는 Split Layout
```

## 규칙

-   실제 상품 사진 우선
-   지나친 Filter 사용 금지
-   이미지 Crop 기준 통일
-   품질 저하 이미지 사용 금지
-   WebP/AVIF 최적화
-   Lazy Loading 적용
-   적절한 alt text 제공

------------------------------------------------------------------------

# 17. Badge

사용 예:

``` text
판매중
품절
선물용
가정용
무료배송
신상품
```

Badge를 과도하게 사용하지 않는다.

상품 Card 기준 핵심 Badge 1\~2개를 권장한다.

------------------------------------------------------------------------

# 18. Price Component

구조:

``` text
정상가
45,000원

판매가
39,000원
```

할인이 없는 경우 판매가만 표시한다.

배송비는 가격과 혼동되지 않도록 별도 표시한다.

------------------------------------------------------------------------

# 19. Product Option Selector

모바일에서 Select Box보다 선택 가능한 Card/Chip을 우선 고려한다.

예:

``` text
옵션 선택

[ 3kg 가정용 ]
  29,000원

[ 4kg 선물용 ✓ ]
  39,000원

[ 5kg 선물용 ]
  49,000원
```

품절:

``` text
[ 5kg 선물용 ]
   품절
```

선택 불가 상태를 시각적으로 명확히 한다.

------------------------------------------------------------------------

# 20. Quantity Selector

``` text
┌────┬─────┬────┐
│ −  │  1  │ +  │
└────┴─────┴────┘
```

버튼 터치 영역은 최소 44px 이상으로 한다.

------------------------------------------------------------------------

# 21. Mobile Purchase CTA

상품 상세에서 구매 CTA를 화면 하단에 고정한다.

``` text
┌────────────────────────────┐
│ [장바구니] [바로 구매하기] │
└────────────────────────────┘
```

### 고려사항

-   iOS Safe Area
-   Android Browser UI
-   Bottom Navigation과 중복 방지
-   Keyboard 활성화 시 Layout 깨짐 방지

------------------------------------------------------------------------

# 22. Cart UI

상품별로 다음 정보를 표시한다.

-   Thumbnail
-   상품명
-   옵션
-   가격
-   수량
-   삭제

하단에는 주문 Summary를 제공한다.

``` text
상품금액       78,000원
배송비              0원
────────────────────
총 결제금액     78,000원

[주문하기]
```

------------------------------------------------------------------------

# 23. Checkout UI

Checkout은 한 페이지 기반을 우선한다.

구조:

``` text
주문 상품
 ↓
주문자 정보
 ↓
배송 정보
 ↓
배송 요청사항
 ↓
결제 금액
 ↓
개인정보 동의
 ↓
결제하기
```

필요 이상으로 Multi-Step Form을 사용하지 않는다.

------------------------------------------------------------------------

# 24. Order Status UI

고객이 쉽게 이해할 수 있는 한글 Label을 제공한다.

  내부 상태         고객 표시
  ----------------- -------------
  PAYMENT_PENDING   결제 대기
  PAID              결제 완료
  PREPARING         상품 준비중
  READY_TO_SHIP     배송 준비중
  SHIPPED           배송중
  DELIVERED         배송 완료
  CANCELLED         주문 취소
  REFUNDED          환불 완료

내부 Enum을 고객에게 그대로 노출하지 않는다.

------------------------------------------------------------------------

# 25. Empty State

빈 화면을 단순 공백으로 제공하지 않는다.

예:

``` text
장바구니가 비어 있습니다.

현재 판매 중인 과일을 확인해보세요.

[상품 보러가기]
```

------------------------------------------------------------------------

# 26. Loading State

권장:

-   Skeleton
-   Button Loading
-   Inline Spinner

페이지 전체를 장시간 Spinner 하나로 막는 방식을 최소화한다.

------------------------------------------------------------------------

# 27. Error State

오류 메시지는 사용자가 다음 행동을 알 수 있도록 작성한다.

잘못된 예:

``` text
Error 500
```

권장:

``` text
주문 정보를 불러오지 못했습니다.

잠시 후 다시 시도해주세요.

[다시 시도]
```

------------------------------------------------------------------------

# 28. Toast

Toast는 짧은 상태 알림에 사용한다.

예:

-   장바구니에 담았습니다.
-   상품이 저장되었습니다.
-   송장번호가 등록되었습니다.

중요한 오류나 결제 결과는 Toast만으로 전달하지 않는다.

------------------------------------------------------------------------

# 29. Modal / Dialog

사용 예:

-   삭제 확인
-   주문 취소 확인
-   결제 취소 확인
-   관리자 중요 작업 확인

모바일에서는 내용이 많은 경우 Bottom Sheet를 우선 고려한다.

------------------------------------------------------------------------

# 30. Customer Home Components

권장 컴포넌트 구조:

``` text
Header
SeasonHero
SeasonStatus
FeaturedProducts
BrandStoryPreview
ProcessSection
ShippingGuidePreview
ContactCTA
Footer
MobileBottomNavigation
```

------------------------------------------------------------------------

# 31. Product Detail Components

``` text
ProductGallery
ProductHeader
ProductPrice
ProductMeta
VariantSelector
QuantitySelector
ProductDescription
OriginSection
ShippingGuide
RefundGuide
StickyPurchaseBar
```

------------------------------------------------------------------------

# 32. Admin Design System

관리자 UI는 고객 화면과 목적이 다르다.

우선순위:

``` text
정보 밀도
상태 파악
빠른 수정
실수 방지
```

브랜드 Accent는 유지하되 장식적 요소는 줄인다.

------------------------------------------------------------------------

# 33. Admin Status Badge

예:

``` text
결제완료
상품준비
배송준비
배송중
배송완료
취소
```

상태는 색상 + Text로 표현한다.

------------------------------------------------------------------------

# 34. Admin Mobile Order Card

``` text
주문번호 PF-20260828-A7F92

김○○
백도 복숭아 4kg × 2

78,000원

결제완료 · 배송준비

[주문 상세]
```

------------------------------------------------------------------------

# 35. Admin Desktop Order Table

Column 예:

``` text
주문일
주문번호
고객
상품
금액
결제
주문상태
배송상태
관리
```

모바일에서는 동일 Table을 억지로 축소하지 않고 Card 형태로 전환한다.

------------------------------------------------------------------------

# 36. Icon System

기본 Icon Library:

``` text
Lucide React
```

예:

-   Home
-   ShoppingBag
-   ShoppingCart
-   Package
-   Truck
-   Phone
-   MessageCircle
-   MapPin
-   ChevronRight
-   Plus
-   Minus
-   Search
-   Settings
-   LogOut

서로 다른 Icon Library를 혼용하지 않는다.

------------------------------------------------------------------------

# 37. Image & Icon Accessibility

의미 있는 이미지:

``` text
alt="백도 복숭아 4kg 선물용 상품"
```

장식용 이미지는 적절하게 비워둘 수 있다.

Icon-only Button에는 Accessible Label을 제공한다.

------------------------------------------------------------------------

# 38. Animation

Animation은 최소한으로 사용한다.

허용:

-   Button feedback
-   Accordion
-   Sheet
-   Modal
-   작은 Fade/Slide

지양:

-   과도한 Parallax
-   긴 Intro Animation
-   상품 탐색을 방해하는 Motion

권장 Duration:

``` text
150~250ms
```

------------------------------------------------------------------------

# 39. Mobile Safe Area

하단 고정 UI에서는 Safe Area를 고려한다.

예:

``` css
padding-bottom: env(safe-area-inset-bottom);
```

특히 다음 컴포넌트에 적용한다.

-   Bottom Navigation
-   Sticky Purchase Bar
-   Checkout CTA

------------------------------------------------------------------------

# 40. Accessibility

최소 기준:

-   충분한 Color Contrast
-   Form Label
-   Keyboard Navigation
-   Focus State
-   Semantic HTML
-   alt text
-   Button 최소 터치 영역
-   색상만으로 상태 전달 금지

------------------------------------------------------------------------

# 41. Content Writing

UI 문구는 간결하고 구체적으로 작성한다.

권장:

``` text
바로 구매하기
장바구니에 담기
배송 준비중
주문 조회하기
```

지양:

``` text
확인
진행
실행
Submit
```

가능하면 행동의 결과를 버튼명에 포함한다.

------------------------------------------------------------------------

# 42. 상품 상태 표현

판매중:

``` text
판매중
```

품절:

``` text
품절
```

판매 종료:

``` text
이번 시즌 판매가 종료되었습니다.
```

판매 예정:

``` text
곧 판매를 시작합니다.
```

------------------------------------------------------------------------

# 43. 시즌별 Hero

## Peach

``` text
2026 PEACH SEASON

올해 복숭아 판매를 시작합니다.

[복숭아 보러가기]
```

## Gotgam

``` text
2026 GOTGAM SEASON

겨울 곶감 판매를 시작합니다.

[곶감 보러가기]
```

## Off Season

``` text
이번 시즌 판매가 종료되었습니다.

다음 계절의 과일을 준비하고 있습니다.
```

------------------------------------------------------------------------

# 44. Tailwind Token 권장 구조

예시:

``` css
:root {
  --background: #fffdfc;
  --foreground: #241f1d;

  --surface: #ffffff;

  --muted: #f6f3f1;
  --muted-foreground: #756d69;

  --border: #e9e3df;

  --primary: #f47f5f;
  --primary-foreground: #ffffff;

  --destructive: #dc2626;
}
```

시즌 전환 시 Primary Token을 변경할 수 있도록 설계한다.

``` text
PEACH
primary = peach-500

GOTGAM
primary = gotgam-500
```

------------------------------------------------------------------------

# 45. shadcn/ui 활용 범위

권장 컴포넌트:

``` text
Button
Input
Textarea
Label
Card
Badge
Dialog
Sheet
Select
Checkbox
RadioGroup
Tabs
Accordion
Table
DropdownMenu
Alert
Skeleton
Toast/Sonner
```

shadcn/ui 기본 스타일을 그대로 사용하기보다 본 디자인 Token에 맞게
조정한다.

------------------------------------------------------------------------

# 46. 컴포넌트 계층

``` text
components/
│
├── ui/
│   ├── button
│   ├── input
│   ├── card
│   ├── badge
│   └── dialog
│
├── layout/
│   ├── Header
│   ├── Footer
│   ├── MobileNavigation
│   └── PageContainer
│
├── product/
│   ├── ProductCard
│   ├── ProductGallery
│   ├── ProductPrice
│   ├── VariantSelector
│   └── QuantitySelector
│
├── cart/
│   ├── CartItem
│   └── CartSummary
│
├── checkout/
│   ├── CustomerForm
│   ├── ShippingForm
│   └── PaymentSummary
│
├── order/
│   ├── OrderStatus
│   └── OrderSummary
│
└── admin/
    ├── AdminSidebar
    ├── AdminHeader
    ├── OrderCard
    ├── OrderTable
    └── StatusBadge
```

------------------------------------------------------------------------

# 47. UI 상태 정의

모든 주요 Interactive Component는 다음 상태를 고려한다.

``` text
Default
Hover
Focus
Active
Disabled
Loading
Error
```

모바일에서는 Hover에 의존하지 않는다.

------------------------------------------------------------------------

# 48. Skeleton 기준

상품 목록:

``` text
Image Skeleton
Text Skeleton
Price Skeleton
```

상품 상세:

``` text
Gallery Skeleton
Title Skeleton
Price Skeleton
Option Skeleton
```

관리자:

``` text
Dashboard Card Skeleton
Order List Skeleton
```

------------------------------------------------------------------------

# 49. 주요 화면 Mobile Layout

## Home

``` text
Header
Hero
Featured Products
Story
Process
Shipping
Contact
Footer
Bottom Navigation
```

## Product Detail

``` text
Header
Gallery
Product Information
Variant
Quantity
Description
Shipping
Refund
Sticky Purchase Bar
```

## Checkout

``` text
Header
Order Summary
Customer
Shipping Address
Request
Price Summary
Privacy Agreement
Payment CTA
```

## Order Lookup

``` text
Header
Order Number
Phone
Lookup CTA
Result
```

------------------------------------------------------------------------

# 50. 관리자 Mobile Layout

``` text
Admin Header
Summary Cards
Status Filter
Recent Orders
Quick Actions
```

Desktop에서는 Sidebar를 추가한다.

------------------------------------------------------------------------

# 51. 디자인 QA 체크리스트

## Mobile

-   360px 수준의 작은 화면에서도 정상 표시되는가
-   가로 스크롤이 발생하지 않는가
-   CTA가 엄지손가락으로 쉽게 눌리는가
-   하단 UI가 Browser/Safe Area와 겹치지 않는가
-   상품 가격과 옵션이 명확한가

## Product

-   상품 이미지 품질이 충분한가
-   품절 여부가 명확한가
-   옵션 선택 상태가 명확한가
-   가격을 오해할 여지가 없는가

## Checkout

-   필수 입력이 명확한가
-   오류 위치가 명확한가
-   총 결제금액이 명확한가
-   개인정보 동의가 제공되는가

## Admin

-   주문 상태를 빠르게 파악할 수 있는가
-   모바일에서 Table이 깨지지 않는가
-   중요한 변경에 확인 절차가 있는가

------------------------------------------------------------------------

# 52. MVP 디자인 완료 기준

다음 조건을 만족하면 MVP UI 디자인 시스템 적용이 완료된 것으로 판단한다.

-   Mobile First 기준이 모든 고객 화면에 적용됨
-   공통 Color Token 적용
-   공통 Typography 적용
-   공통 Spacing 적용
-   Button/Input/Card 공통 컴포넌트 사용
-   상품 Card 디자인 통일
-   상품 옵션 UI 통일
-   모바일 구매 CTA 적용
-   Empty/Loading/Error 상태 구현
-   주문 상태 Label 통일
-   관리자 Status Badge 통일
-   관리자 Mobile/Desktop Responsive 적용
-   이미지 최적화 기준 적용
-   기본 접근성 기준 적용

------------------------------------------------------------------------

# 53. 최종 디자인 방향

본 서비스의 디자인은 대형 쇼핑몰의 복잡한 UI를 모방하지 않는다.

서비스의 핵심은 다음과 같다.

``` text
좋은 상품 사진
      +
명확한 상품 정보
      +
쉬운 옵션 선택
      +
간단한 주문
      +
명확한 결제
      +
신뢰할 수 있는 배송 정보
```

고객 UI는 **신선함, 계절감, 신뢰, 구매 편의성**을 중심으로 구성한다.

관리자 UI는 **상태 파악, 빠른 처리, 실수 방지**를 중심으로 구성한다.

최종 UI 방향은 다음 한 문장으로 정의한다.

> **상품 자체가 가장 돋보이면서도 모바일에서 누구나 쉽게 주문할 수 있는
> 단순하고 신뢰감 있는 시즌 과일 커머스 UI**
