# 🏀 Hoops Platform

부산대 및 인근 농구 동호인을 위한 경기 게시·분석·공유 플랫폼

## 📋 프로젝트 개요

농구 경기를 등록·조회하고, 개인·동아리 통계를 확인하며, 모두의 참여로 커지는 농구 커뮤니티를 경험할 수 있는 통합 플랫폼입니다.

### 🎯 주요 기능

- **경기 게시**: 날짜, 장소, 상대팀, 룰 설정으로 경기 생성
- **랭킹 시스템**: 동아리·개인 실시간 랭킹 및 리더보드
- **통계 분석**: 개인/팀 상세 경기 통계 및 시각화
- **매칭 시스템**: 자동 매칭 제안 및 일정 관리
- **심판 모드**: 실시간 경기 기록 및 결과 등록
- **콘텐츠 공유**: 사진·영상 업로드 및 SNS 연동

## 🏗️ 기술 스택

### Frontend
- **Mobile**: React Native 0.73 + Expo SDK 50
- **Web**: Next.js 14 (App Router)
- **UI**: Tamagui + Tailwind-in-JS
- **State**: React Query + Context API

### Backend
- **Runtime**: Node.js 20 + TypeScript 5
- **Framework**: NestJS 10 + GraphQL
- **Database**: PostgreSQL 15 + Redis 7
- **ORM**: MikroORM

### Infrastructure
- **Cloud**: AWS (ECS Fargate, RDS, S3, CloudFront)
- **CI/CD**: GitHub Actions
- **IaC**: Terraform
- **Monitoring**: CloudWatch, X-Ray, Grafana Cloud

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 20+
- Yarn 1.22+
- Docker (optional)

### 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행 (모든 앱)
yarn dev

# 특정 앱만 실행
yarn workspace @hoops-platform/mobile dev
yarn workspace @hoops-platform/web dev
yarn workspace @hoops-platform/api dev
```

### 빌드

```bash
# 전체 빌드
yarn build

# 특정 앱 빌드
yarn workspace @hoops-platform/web build
```

### 테스트

```bash
# 전체 테스트
yarn test

# 린트 검사
yarn lint

# 타입 체크
yarn type-check

# 코드 포맷팅
yarn format
```

## 📁 프로젝트 구조

```
hoops-platform/
├── apps/
│   ├── mobile/          # React Native + Expo 앱
│   └── web/             # Next.js 웹 앱
├── services/
│   └── api/             # NestJS GraphQL API
├── packages/
│   ├── ui/              # 공유 UI 컴포넌트
│   ├── graphql-client/  # GraphQL 클라이언트
│   └── config/          # 공유 설정
├── infrastructure/
│   ├── terraform/       # AWS 인프라 코드
│   └── github-actions/  # CI/CD 워크플로우
└── docs/                # 문서
```

## 🔧 개발 가이드

### 코드 스타일
- **TypeScript**: Strict 모드 활성화
- **ESLint**: Airbnb + Prettier 규칙
- **커밋**: Conventional Commits 규칙 준수
- **테스트**: TDD 방식 권장

### 워크플로우
1. Feature 브랜치 생성
2. 코드 작성 및 테스트
3. Pre-commit 훅 (lint, format)
4. Pull Request 생성
5. 코드 리뷰 및 CI 통과
6. Merge to main

### 환경 변수
각 앱별 `.env.example` 파일을 참고하여 `.env.local` 파일을 생성하세요.

## 📚 문서

- [API 문서](./docs/api.md)
- [배포 가이드](./docs/deployment.md)
- [기여 가이드](./docs/contributing.md)
- [아키텍처 가이드](./docs/architecture.md)

## 📝 라이선스

MIT License

## 👥 팀

Hoops Platform Team

---

**🏀 농구를 사랑하는 모든 이들을 위한 플랫폼입니다!** 