# CMS & Annotation

👉 Working [here](http://223.130.134.235:3000)

## Installation

```bash
$ git clone https://{USER_NAME}@github.com/dayludenscom/survey-text-annotation-react.git
$ cd survey-text-annotation-react
$ yarn
```

## 실행 방법

```bash
$ yarn start
```

## 환경변수

### REACT_APP_MODE

#### 개발모드 구분 스크립트

```typescript
REACT_APP_MODE = 'DEV';
REACT_APP_MODE = 'PROD';
```

#### 사용법

```typescript
if (process.env.REACT_APP_MODE === 'DEV') {
  // ...
}
```

## 브랜치

### 종류

- `main`: 실서버, 운영
- `develop`: 개발서버

### 사용

❗️일반적인 경우❗️

1. 작업 시, `develop` 브랜치에서 작업브랜치(ex. `feature/XXXX`, `fix/XXXX`) 생성
2. 작업 완료 후 작업브랜치를 `develop`으로 merge
3. `develop`을 `main`으로 merge

❗️`develop`에 검수중인 작업이 있을 때 운영에 반영되어야 하는 수정사항이 있을 경우❗️

1. 작업 시, `main` 브랜치에서 작업브랜치(ex. `feature/XXXX`, `fix/XXXX`) 생성
2. 작업 완료 후 작업브랜치를 `develop`으로 merge
3. 작업 완료 후 작업브랜치를 `main`으로 merge

### 기타

merge된 or 사용하지 않는 브랜치는 삭제해주세요.

## 배포

Github Actions 로 자동 배포

```bash
.github
  └── workflows
      ├── dev.yml        - 개발서버
      └── main.yml       - 실서버
```
