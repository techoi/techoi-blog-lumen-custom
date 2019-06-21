---
title: "기분 좋게 IE 해소하는 가장 좋은 방법"
date: "2019-06-20T20:53:56.738Z"
template: "post"
draft: false
slug: "/posts/ie-style-issue-solve-with-react-hooks"
category: "Tech"
tags:
  - "CSS"
  - "IE"
  - "React"
  - "React Hooks"
description: "리액트 훅스로 IE에서 발생하는 overflow scroll 이슈 해소"
---


### 리액트 훅스로 IE에서 발생하는 overflow scroll 이슈 해소

---

*블로그를 작성할 시간을 내는게 정말 쉽지 않다. 그래도 자주 써보자는 생각이 다시 들게 해준 상황 덕분에 정리한다*


본론으로 바로 들어간다.

이슈는 다음과 같다.
Chrome 류에서는 max-height만 가지고 overflow를 쉽게 관리할 수 있다.

![모달 레이아웃](/images/2019-06-20/popup-layout.png)

위의 형태의 레이아웃을 만들기 위해서 Chrome류에서는
부모 component에  max-height를 주고,
스크롤을 붙이고 싶은 component에 height와 overflow: auto;를 주면 된다.
```css
.parent {
  max-height: 70%;
}

.content {
  height: 85%;
  overflow: auto;
}

```


하지만 한국에서 웹서비스를 운영하고 있다면 어김없기 고려해야하는 IE라는 큰 산이 있다.

각종 polyfill로 해소할 수 있는 부분은 해소했다 손 치더라도..
스타일링을 돕는 다양한 속성들이 IE에서는 예상과 다르게 보여질때가 있기에...
~~IE 지원안하고싶...~~ 이를 대응해줄 필요가 있다!

>*위 스타일을 적용하면 IE에서는 부모 component에 스크롤이 붙어버린다.
그럼 고정하고 싶은 header와 footer가 고정되지 못한다.*

이를 해결하는 다양한 방식이 있다.

가장 간단한 방식은 아마도
> 부모의 사이즈를 고정해버리는 것!

```css
.parent {
  height: 700px;
}
```

딱 봐도 알겠지만, 명료하지만 다양한 경우를 다 담을 수 없다.

리액트 컴포넌트의 재사용성을 고려하기 위해 다른 방법을 생각해보다가

## React Hooks 를 활용해보기로 했다.

모달 컴포넌트 자체가 애초에 function component였기에  ~~최근 리액트 공식 문서를 다시 읽었기에...~~

요즘은 핫하기도 하지만 어느정도 안정적으로 판단되는 기술들을 새로운 프로젝트에 녹여내는걸로 바쁜 일정에 대한 자기 위안을 삼고 있다(지금 진행하고 있는 신규 프로젝트에는 React, Next.js(SSR), React Hooks, Sass, Type Script, Jest가 기본 골조)

모달 컴포넌트는 담기는 내용이 통신 결과에 따라 변경되는 구조이기에 빅 사이즈 경우와 작은 사이즈 경우가 있다.

![빅 사이즈 모달](/images/2019-06-20/big-size-popup.png)
![스몰 사이즈 모달](/images/2019-06-20/small-size-popup.png)


목표는 부모 component의 height를 자식(스크롤을 달고 싶은) component의 height에 따라 동적으로 설정하는 것!

자식의 사이즈는 동적으로 결정되므로, 컴포넌트가 그려진 다음에 사이즈를 확인해서 부모의 스타일을 바꿔줘야한다.

1. 자식까지 일단 다 그려진다.
2. 자식의 사이즈를 확인한다.
3. 자식의 사이즈에 따라 부모의 사이즈를 수정한다.

리액트 클래스 컴포넌트를 사용하고 있다면 componentDidMount() life cycle에서 자식의 사이즈를 통해 부모의 사이즈를 바꿔주면 될테고,
바닐라 JS를 사용하고 있다면, JQuery로 load된 후 해당 작업을 하면 될테다.

리액트 펑션 컴포넌트를 사용하고 있었다면, 라이프 사이클을 사용하기 위해서 클래스 컴포넌트로 바꾸지말고,
리액트 훅스를 사용해주자!


## React Hooks로 작업한 코드는 다음과 같다.


```tsx
/* tsx 파일 */
import React, { useState, useEffect } from 'react'

const CheckCategory: React.SFC<Props> = () => {
    let popupBox = React.createRef<HTMLDivElement>();
    let popupWrapper = React.createRef<HTMLDivElement>();

    useEffect(() => {
        if(popupWrapper.current) {
          popupWrapper.current.style.height = popupBox.current && popupBox.current.clientHeight + 120 + 'px';
        }
    });

    return (
      <div>
          ...
            <div className='parent' ref={popupWrapper}>
                ...
                <div className='content' ref={ popupBox }>
                    ...
                </div>
            </div>
      </div>
    )
```

```scss
/* scss 파일 */
.parent {
  max-height: 70%;
}

.content {
  overflow: auto;
  @include respond-to("pc") { /* 요건 반응형 대응 코드(sass를 사용하고 있다는?)*/
    width: 1150px;
    height: 85%;
  }
}
```

useEffect를 사용해서 render하는 타이밍마다 
자식의 사이즈를 통해 부모의 height를 동적으로 줄 수 있다.

*사실 이 코드도 보면 고정값으로 120 을 더하고 있는 부분이 있는데, 이는 모달 컴포넌트의 header와 footer의 고정적인 높이의 합이므로 예외로 하자*


최적의 코드라는 생각은 아니지만, IE를 대응해야하는 ~~조금은 귀찮은~~ 상황에서 스스로를 위안할 수 있는 접근을 찾다보니...

