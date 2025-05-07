## 배포링크

origin : https://singyukang.github.io/front_5th_chapter2-2/index.origin.html

refactoring : https://singyukang.github.io/front_5th_chapter2-2/index.refactoring.html

## 과제의 핵심취지

- React의 hook 이해하기
- 함수형 프로그래밍에 대한 이해
- 액션과 순수함수의 분리

## 과제에서 꼭 알아가길 바라는 점

- 엔티티를 다루는 상태와 그렇지 않은 상태 - cart, isCartFull vs isShowPopup
- 엔티티를 다루는 컴포넌트와 훅 - CartItemView, useCart(), useProduct()
- 엔티티를 다루지 않는 컴포넌트와 훅 - Button, useRoute, useEvent 등
- 엔티티를 다루는 함수와 그렇지 않은 함수 - calculateCartTotal(cart) vs capaitalize(str)

### 기본과제

- Component에서 비즈니스 로직을 분리하기
- 비즈니스 로직에서 특정 엔티티만 다루는 계산을 분리하기
- 뷰데이터와 엔티티데이터의 분리에 대한 이해
- entities -> features -> UI 계층에 대한 이해

- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?
- [x] 특정 Entitiy만 다루는 함수는 분리되어 있나요?
- [x] 특정 Entitiy만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요?
- [x] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요?

### 심화과제

- 재사용 가능한 Custom UI 컴포넌트를 만들어 보기
- 재사용 가능한 Custom 라이브러리 Hook을 만들어 보기
- 재사용 가능한 Custom 유틸 함수를 만들어 보기
- 그래서 엔티티와는 어떤 다른 계층적 특징을 가지는지 이해하기

- [x] UI 컴포넌트 계층과 엔티티 컴포넌트의 계층의 성격이 다르다는 것을 이해하고 적용했는가?
- [x] 엔티티 Hook과 라이브러리 훅과의 계층의 성격이 다르다는 것을 이해하고 적용했는가?
- [x] 엔티티 순수함수와 유틸리티 함수의 계층의 성격이 다르다는 것을 이해하고 적용했는가?

## 과제 셀프회고

### (1) 순수함수를 도대체 왜 써야하지

지난 토요일 과제 발제시간에 `순수함수를 써야합니다` `순수함수를 쓰면은 테스트 코드가 편해져요` `액션과 순수함수를 구분하면은 좋아요` 이야기를 들었지만은 사실 크게 와닿지 않는 부분이었습니다. 

`전역적으로 상태`를 왜 건들이면은 안되지? `순수함수로 굳이 짜야하는 이유`가 뭘까? 기존에는 순수함수없이 `상태만 변경`해오는걸로 충분히 다 구현이 가능했는데.. 등 의문점을 가진채 과제를 시작했습니다.

제일먼저 `CartPage`의 `useCart` 리팩토링을 진행하였습니다.

```jsx
// CartPage.tsx

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();

const getRemainingStock = (product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

// 사용 방식
<ProductItem
  product={product}
  remainingStock={getRemainingStock(product)}
  // ...
/>
```

위의 코드형태로`useCart를 리팩토링`을 진행하였으며

`CartPage에는 getRemainingStock`가 선언되어있고 이를 `하위 컴포넌트에 넘겨 계산`하도록 하였습니다.

여기서 저는 `CartPage내부 안에 cart라는 state`를 가지고 있고 `getRemainingStock에 cart가 의존`되어 있는 상황인거는 알겠는데, `안좋은 형태가 맞나?` 에 의문점이 들었습니다.

그래서 지난 토요일발제시간에 진행했던 `안좋은 코드에 대한 테스트코드 작성`을 진행을 해보았습니다.

```jsx
//비순수 함수 테스트
import { render, screen } from '@testing-library/react';
import { CartPage } from './CartPage';

// 이 함수를 직접 테스트하기 위해서는 컴포넌트를 렌더링해야 함
jest.mock('../../hooks/useCart', () => ({
  useCart: () => ({
    cart: [
      { 
        product: { id: '1', name: 'Test Product', price: 100, stock: 10, discounts: [] }, 
        quantity: 3 
      }
    ],
    addToCart: jest.fn(),
    // 다른 필요한 값과 함수들...
  })
}));

describe('CartPage', () => {
  // getRemainingStock 함수를 직접 테스트할 수 없음
  // 대신 컴포넌트의 동작을 통해 간접적으로 테스트해야 함
  
  test('상품 목록에 올바른 남은 재고가 표시되어야 합니다', () => {
    const products = [
      { id: '1', name: 'Test Product', price: 100, stock: 10, discounts: [] },
      { id: '2', name: 'Another Product', price: 200, stock: 20, discounts: [] }
    ];
    const coupons = [];
    
    render(
        <CartPage products={products} coupons={coupons} />
    );
    
    // 화면에서 재고 정보를 찾아 검증해야 함
    expect(screen.getByText('재고: 7개')).toBeInTheDocument(); // 첫 번째 상품
    expect(screen.getByText('재고: 20개')).toBeInTheDocument(); // 두 번째 상품
  });
});
```

단순 함수하나 `테스트 코드 작성`을 위해서 `전체 컴포넌트와 관련 상태 렌더링`을 시킨후, `useCart훅을 선언`하여 넣어준다음에 필요한 `props 설정`.. 벌써부터 너무 `신경써야 할게 많다.`



```jsx
// 순수함수 테스트 

  export const getRemainingStock = (product: Product, cart: CartItem[]) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  test('상품이 장바구니에 없을 때 전체 재고를 반환해야 합니다', () => {
    const product = { id: '1', name: 'Test Product', price: 100, stock: 10, discounts: [] };
    const cart: CartItem[] = [];

    expect(getRemainingStock(product, cart)).toBe(10);
  });
```

반면에 `순수함수의 테스트코드`는 위와 같이 짧은 형태이며 `테스트하기 정말 편하다` 라는 생각이 들었습니다.

`외부에서 넣어주는 값`과 `리턴 받는 값이 정해져`있다보니 `다른 상황을 고려하지 않고 테스트 진행`이 가능했습니다.

회사프로젝트를 진행하다보면은 `계산을 하는 함수가 많을것` 입니다. 그렇다면은 첫번째 형태처럼 테스트 코드를 진행하다보면은 `외부요인으로 인해 실패하는 케이스`가 발생할 것이며 `작성하는 시간이 엄청 오래걸릴 것`입니다. 

제가 이해한 바로는 `액션 함수 테스트 코드는 작성하는데 시간이 엄청 오래 걸리고` `테스트하는데 외부 요인`이 따라온다. 따라서 처음과 끝의 액션함수에 대한 테스트 코드 진행이 오래 걸리는 것은 어쩔수 없으니, `계산하는 쪽은 최대한 순수함수로 빼내어 작성하는 것`이 좋은 형태라고 느꼈습니다.

```tsx
  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };
```

따라서 위와 같이 작성이 되어있다면은 판단을 해야합니다. → 과연 `cart라는 상태를 꼭!! 해당하는 컴포넌트에서 가져와야` 하는것일까?

단순히 `cart Array`에 `product id`가 같은 요소를 꺼내오는 거면은 `cart상태를 주입받아 사용하는 상태`로 바꿔도 괜찮겠네?

```jsx
export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};
```

`의존성이 없는 함수로 변환`후 순수함수 로직이 있는 `cart.ts`에 추가 하는 식으로 해야겠다 라고 느꼈습니다.


![클린코드](https://github.com/user-attachments/assets/bed9ac6d-7586-42b8-b045-c80d4fa35d4b)
![클린코드](https://github.com/user-attachments/assets/3f7b02ef-3c2d-4f83-b8fd-8267edf9cdd4)

`CartPage`를 예시로 

`버튼을 클릭하는 이벤트 발생`으로 `onAddToCart함수를 실행`하게 됩니다.(액션)

`onAddToCart는 Product`를 전달해주어서 `해당 Product와 이전 상태 Cart를 비교`를 진행하여 `카트 아이템을 업데이트`를 시켜 반환을 시켜줍니다.(계산)

반환된 값을 `setCart를 통해 변경`하여 사용자에게 변화된 값을 보여줍니다.(액션)


### (2) 공통 컴포넌트 고민

`공통 컴포넌트`를 설계하면서 가장 많이한 고민은 

`"어떻게 하면 다양한 상황에서 유연하게 사용할 수 있는 컴포넌트를 만들 수 있을까?"` 였습니다. 

`Heading`을 예시로

기존에는 다음과 같이 `각 헤딩 태그마다` `개별적으로 스타일을 적용`했습니다:
 
```jsx
 <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
 <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
 <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
 <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
```

이 문제를 해결하기 위해 `TypeScript의 동적 태그 기능을 활용`하여 `모든 헤딩 레벨을 지원하는 재사용 가능한 Heading 컴포넌트`를 구현했습니다

```jsx
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
  children: ReactNode;
  as?: HeadingLevel;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ children, as = 'h2', className = '' }) => {
  const Tag = as;

  const finalClassName = `${className}`;

  return <Tag className={finalClassName}>{children}</Tag>;
};

export default Heading;

      <Heading as="h2" className="text-2xl font-semibold mb-4">
        쿠폰 관리
      </Heading>

      <Heading as="h1" className="text-3xl font-bold mb-6">
        관리자 페이지
      </Heading>

```

### (3) validate 검증 기능

상품, 쿠폰, 수정 시에 `입력폼 validate`가 안되어 있어 `잘못된값(0원짜리 쿠폰)`이 들어가도 되는것 개선

```ts
export function validateDiscount(discount: Discount): boolean {
  let isValid = true;

  if (discount.quantity <= 0) {
    isValid = false;
  }

  if (discount.rate <= 0) {
    isValid = false;
  }

  return isValid;
}

//계산함수 테스트코드
  describe('validateDiscount 테스트', () => {
    it('갯수 할인률 0 초과', () => {
      const validDiscount: Discount = { quantity: 5, rate: 10 };

      const result = validateDiscount(validDiscount);

      expect(result).toBe(true);
    });

    it('갯수 0이 들어간경우', () => {
      const invalidDiscount: Discount = { quantity: 0, rate: 10 };

      const result = validateDiscount(invalidDiscount);

      expect(result).toBe(false);
    });

    it('할인률 0인경우', () => {
      const invalidDiscount: Discount = { quantity: 5, rate: 0 };

      const result = validateDiscount(invalidDiscount);

      expect(result).toBe(false);
    });
  });

```
해당 기능을 추가하면서 `클린코드가 정말 중요하구나` 라고 느꼈습니다.

`할인 정보를 추가` 해줄때 `새로운 할인 정보가 0이 섞여있으면은 안된다는 문제`를 파악 -> 자연스럽게 `마지막 액션에서 문제`가 있으니 `계산쪽에서 처리`해주면 가능하다고 판단 -> `hook을 찾아` `마지막 액션(handleAddDiscount)` 을 찾은후에 여기에 `계산하는 함수`를 작성하면 되겠다고 생각 -> `model validateDiscount`함수생성후 연결 -> 테스트 코드 작성

클린코드를 하니 `기능 위치를 찾는 속도` + `테스트코드 작성 속도`가 진짜 빨라졌습니다

액션 -> 계산 -> 액션 으로 끝나는 구조가 정말 편하다라고 느낌


### (4) props drilling

```jsx
const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);

  const [isAdmin, setIsAdmin] = useState(false);

  const handleToggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <Layout isAdmin={isAdmin} onToggleAdmin={handleToggleAdmin}>
      {isAdmin ? (
        <AdminPage
          products={products}
          coupons={coupons}
          onProductUpdate={updateProduct}
          onProductAdd={addProduct}
          onCouponAdd={addCoupon}
        />
      ) : (
        <CartPage products={products} coupons={coupons} />
      )}
    </Layout>
  );
};

```
![클린코드2](https://github.com/user-attachments/assets/6e681f3a-da18-4439-ac81-44f91f432b55)

`App 컴포넌트`에서 `관리자 페이지`와 `카트 페이지`를 분리시에 `product에 대한 정보가 서로 필요`하여 `App에 useProduct를 선언`하고 `하위 컴포넌트에 뿌려주는 방식`으로 진행

하지만 `컴포넌트를 통해 값을 넘겨`주다 보니 `products를  사용하지 않는데` `products를 가지고있는 이상한 현상` -> `단순히 넘겨주는 역할`

또한 함수의 이름을 변경해야하는 경우가 있었는데 `연결되어있는 모든 컴포넌트를 변경`해주어야한다는 불편함을 겪었습니다.

이래서 ` Context API ` 나 ` 다른 상태 관리 라이브러리 `를 사용한다는 것을 알았습니다.


## 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문
 
컴포넌트에 대한 폴더 구조를 common, domain, layout으로 나누었는데 domain에서 기능별로 컴포넌트를 나누다 보니 양이 너무 커지는거같다는 생각이 듭니다. 이 구조가 좋은구조인지 아니면 다른 구조로하는게 나은지 궁금합니다!

hooks 와 models의 폴더 구조를 기능별로 나누는게 좋을까요?! 컴포넌트, hook, model 에 대한 좋은 폴더구조가 궁금합니다!

## 리뷰내용
신규님, 이번주차도 수고많으셨습니다~ PR에 작업 흐름 상세히 적어주셔서 좋았어요. 쌍엄지척.. 입니다~

----

- feature단위로 먼저 분리하고 그 다음에 내부에서 컴포넌트/훅/모델을 구분하는게 거의 모든 전세계 리액트 엔지니어가 동의하는 구조입니다. 코칭시간에도 추천드린 대규모 리액트 웹앱 개발 책 꼭 보세요. FSD는 사용자수가 늘어나곤 있지만 동의하지 않는 엔지니어가 꽤 많습니다. 그렇기때문에 FSD, 클린아키텍쳐 관련한 폴더 세팅은.. 과제 의도 파악이 중요해서 발제 코치님께 여쭤보는걸 추천합니다.
