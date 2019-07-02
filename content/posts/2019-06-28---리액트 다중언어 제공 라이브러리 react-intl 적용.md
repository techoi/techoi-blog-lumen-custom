---
title: "리액트 다중언어 제공 라이브러리 react-intl 적용"
date: "2019-06-28T09:32:05.962Z"
template: "post"
draft: false
slug: "/posts/react-intl"
category: "Tech"
tags:
  - "React"
  - "React-intl"
  - "Global"
  - "npm"
  - "Languages"
description: "po, mo 파일들과 헤어지는 가장 쿨한 방법"
---

> ##### React를 사용한다면 po, mo 파일들과의 결별을 선언하고 새로운 인연을 찾자..

---

> 결론만 말하면...

리액트로 새로운 프로젝트를 구성한다면, 다중언어를 제공하기 위해 일반적으로 사용하는 po, mo 파일들을 관리하지 않아도된다. json형태로 언어별 번역 문구를 관리할 수 있는 react-intl를 적용하면, 그간 번역 파일 관리하면서 아팠던 두통을 훌훌 털어버릴 수 있다. Server Side Render(SSR) 프레임워크인 Next.js에서 적용한 사례를 통해 react-intl의 장점만 알아보자 ~~단점도 있겠지만 레거시의 php에서 번역파일 수정하고 apache reload 하던 것과 비교할소냐...~~

---

![](/images/2019-06-28/react-intl-comparision.png)

> 여러 Alternatives 중에 월등한 사용률과 안정성도 어느정도 인정받은 모듈이라 볼 수 있음

npm 모듈을 정할때는 일단 사용자 수, 깃이라면 이슈관리, 의존성 등을 확인하고 현재 사용하고 있는 구조에 적절하게 묻어날 수 있으면 붙이는 식으로 결정하곤 한다.


주어진 상황마다 조금씩 설정 방식이 다르겠지만,
일반적인 리액트 환경이라면 [react-intl로 번역 적용하기](https://gracefullight.dev/2018/01/15/react-intl%EB%A1%9C-%EB%B2%88%EC%97%AD-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0-react-i18n/) 링크를 참조하면 좋을 듯

위 블로그에서는
1. react-intl 설치
2. 번역 데이터 생성
3. 연동
4. 사용

순으로 설명을 잘해놨지만

Next.js 에서의 설정 방식과 좀 더 나은 번역데이터 활용을 위한 몇가지 팁을 덧붙이자면 다음과 같다.

---

> ####Next.js React-intl 적용하기

1. Next.js 프로젝트 생성(이미 되있다고 가정)

2. [Next.js react-intl 세팅](https://github.com/soulmachine/nextjs-starter-kit#step4-react-intl) 따라하기
  
    - 패키지 설치

    ```bash
      $ npm install react-intl intl accepts glob
    ```

    - `server.js` 에 accept Language에 따라서 번역파일 읽도록 설정

    - `_document.js` 에 모든 페이지에 localeDataScript 주입해주도록 설정

    - HOC 만들기 IntlProvider로 component 감싸기(Hooks를 이용해서 HOC를 대체할 수도 있음)

3. 실제 사용 방법

    - ./lang 폴더에 en.json, ko.json, ja.json 등 accept Language에 맞춰 번역 파일들을 넣어둔다. 
    - 각 컴포넌트를 Hoc로 감싸서 export 해주면 사용이 가능함

  ```json
  {
    "description": "An example app integrating React Intl with Next.js",
    "greeting": "Hello, World!",
  }
  ```
  

  * Component 자체로 번역 문구를 사용하고 싶을때: FormattedMessage 컴포넌트에 id를 주면 됨

  ```jsx
      import { FormattedMessage } from 'react-intl'

      <FormattedMessage id="greeting"/>
  ```
      
  
  * 컴포넌트가 아니라 그냥 문구만 사용하고 싶을때: props로 intl 객체를 받아서 사용하면 됨


  ```jsx
    import React, { Component } from 'react'
    import { injectIntl } from 'react-intl'

    class JoinForm extends Component {
      render() {
        const { intl } = this.props

        return (
          <form>
            <input
              type="text"
              name="id"
              placeholder={
                intl.formatMessage({
                  id: 'greeting'
                })
              }
            />
          </form>
        )
      }
    }

    export default injectIntl(JoinForm)
  ```

4. 꿀팁(번역파일 관리와 id를 통한 호출을 직관적으로 바꾸기)

    - AS-IS

    en.json
    ```json
      {
        "meta": {
          "title": "Techoi's Blog",
          "description": "Read, Inspired and Write.",
          "keywords": "Technology, Blog, ..."
        }
      }
    ```

    번역문구는 페이지별로 각각 다르기 마련이고, 그렇게 되면 id를 특정하는데 굉장히 피곤해진다. 번역 파일을 정갈하게 만들기 위해
    번역파일이 위와 같이 json의 일반적인 형태로 묶여있으면 intl.formatMessage({ id: 'meta.title' })로 불러올 meta 안의 title을 불러올 수 없다.
    정 하고 싶다면 json 파일안에서 title을 "meta.title" 이란 이름으로 저장해야함.

    en.json
    ```json
      {
        "meta.title": "Techoi's Blog",
        "meta.description": "Read, Inspired and Write.",
        "meta.keywords": "Technology, Blog, ..."
      }
    ```

    다양한 컴포넌트에서 번역 문구를 사용하고 관리하기 위해서는 번역 파일도 구조적으로 만들어서 사용하는게 훨씬 수월하기 때문에 이부분은 커스텀해서 고칠 필요가 있다.
    react-intl 커뮤니티를 보면 특정 버전 이전에는 가능했었던 기능인데 구조가 변경되면서 사용이 불가능해졌다고 한다.
    
    - TO-BE

    번역파일을 구조적으로 수정한다.
    
    en.json
    ```json
      {
        "meta": {
          "title": "Techoi's Blog",
          "description": "Read, Inspired and Write.",
          "keywords": "Technology, Blog, ..."
        }
      }
    ```

    HOC 파일을 일부 수정한다.

    ```js
      .
      .
      .

      render() {
            const { locale, messages, now, ...props } = this.props
            
            // intl.formatMessage({id: 'watem.jr.option'}) 식으로 요청하기 위한 함수
            function flattenMessages(nestedMessages, prefix = '') {
                return Object.keys(nestedMessages).reduce((messages, key) => {
                    let value       = nestedMessages[key];
                    let prefixedKey = prefix ? `${prefix}.${key}` : key;
            
                    if (typeof value === 'string') {
                        messages[prefixedKey] = value;
                    } else {
                        Object.assign(messages, flattenMessages(value, prefixedKey));
                    }
            
                    return messages;
                }, {});
            }
            
            let flattedMessages = flattenMessages(messages);
            
            return (
                <IntlProvider locale={locale} messages={flattedMessages} initialNow={now}>
                    <IntlPage {...props} />
                </IntlProvider>
            )
        }
    ```

    그러고 나면 intl.formatMessage({ id: 'meta.title' }) 라고 불러도 편하게 관리가 가능하다.


끗

> #### 이정도까지만 커스텀하고는 react-intl 사용하는데 불편함 없이 잘 쓰고 있다.