# 🥗 Fridge-to-Table (스마트 냉장고 파먹기)

> "냉장고 속 방치되는 식재료는 줄이고, 음식물 쓰레기와 지출을 동시에 아끼는 스마트한 순수 구독형 냉장고 관리 서비스"

---

## 📌 프로젝트 소개
바쁘다는 이유로 냉장고 속에 방치되어 유통기한이 지나 버려지는 식재료들이 많으신가요?  
**Fridge-to-Table**은 사용자가 보유한 식재료의 유통기한을 한눈에 관리하고, 남은 재료로 만들 수 있는 최적의 레시피를 추천해 주는 웹 서비스입니다.  
복잡한 외부 쇼핑몰 연동 없이 서비스 자체의 가치에 집중한 **순수 구독형(Pro Tier) 비즈니스 모델**을 채택하여 깔끔하고 완성도 높은 사용자 경험을 제공합니다.

---

## 🛠️ 기술 스택 (Tech Stack)
* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Deployment:** Vercel
* **State/Logic:** Local State Management & Interactive UI Components

---

## ✨ 주요 기능 (Key Features)

### 1. 냉장고 식재료 관리 & 유통기한 시각화
* 식재료 추가, 수정, 삭제 기능
* 유통기한에 따른 **D-Day 및 상태 뱃지** 표기 (임박/만료 안내)
* 빠른 테스트를 위한 **샘플 식재료 일괄 추가** 기능 지원

### 2. 맞춤형 레시피 추천 및 재료 차감
* 현재 보유 중인 재료 기반의 추천 요리 리스트업
* '요리하기' 버튼 클릭 시, 사용된 재료가 냉장고 목록에서 자동으로 차감되는 인터랙션 구현

### 3. Pro 프리미엄 구독 모델 (BM)
* 광고 없는 쾌적한 UI 환경 제공
* AI 맞춤 주간 식단표 및 영양 분석 혜택 안내 모달 및 결제 시뮬레이션 플로우

### 4. 사용자 커스텀 레시피 & 성취감 시스템
* 나만의 시크릿 레시피를 직접 등록하고 관리하는 메모장 기능
* 식재료 소모 및 '냉장고 구출' 성취감을 보여주는 뱃지 시스템

---

## 🚀 시작하기 (Getting Started)

프로젝트를 로컬 환경에서 실행하려면 아래 명령어를 입력하세요:

```bash
# 저장소 클론
git clone [https://github.com/your-username/fridge-to-table.git](https://github.com/your-username/fridge-to-table.git)

# 프로젝트 폴더 이동
cd fridge-to-table

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
