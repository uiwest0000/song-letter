# 사연테이프 🎧

익명으로 사연을 보내면, 다른 누군가가 그 사연에 어울리는 노래와 짧은 답장을 보내주는
웹사이트입니다. Next.js + Supabase + Vercel, 전부 무료 요금제로 배포할 수 있어요.

## 어떻게 동작하나요

- **사연 보내기** (`/write`) — 누구나 로그인 없이 짧은 글을 익명으로 등록합니다.
- **노래 추천하기** (`/answer`) — 대기 중인 사연 중 하나를 무작위로 보여주고,
  추천곡(제목 + 선택적 링크)과 한마디 답장을 보낼 수 있습니다.
- **내 사연함** (`/inbox`) — 브라우저에 저장된 익명 ID로, 내가 보낸 사연과 도착한
  답장을 확인합니다. (로그인이 없기 때문에 브라우저/기기를 바꾸면 기록이 보이지
  않아요 — 아래 "알아두면 좋은 점" 참고)

---

## 1단계 · Supabase 프로젝트 만들기 (무료 DB)

1. https://supabase.com 에서 회원가입 후 **New Project** 생성
2. 프로젝트가 만들어지면 왼쪽 메뉴 **SQL Editor** 로 이동
3. 이 저장소의 `supabase/schema.sql` 파일 내용을 전부 복사해서 붙여넣고 **Run** 실행
   → `stories`, `responses` 테이블과 접근 권한(RLS 정책)이 자동으로 생성됩니다
4. 왼쪽 메뉴 **Project Settings → API** 에서 아래 두 값을 복사해두세요
   - `Project URL`
   - `anon public` 키

## 2단계 · 로컬에서 실행하기 (VS Code)

```bash
# 압축을 푼 폴더로 이동
cd song-letter

# 의존성 설치
npm install

# 환경변수 파일 만들기
cp .env.local.example .env.local
```

`.env.local` 파일을 열어 1단계에서 복사한 값을 넣어주세요:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

그다음 실행:

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속 → 정상 동작하는지 확인합니다.

## 3단계 · GitHub에 올리기

```bash
git init
git add .
git commit -m "사연테이프 초기 버전"
gh repo create song-letter --private --source=. --push
```

(`gh` CLI가 없다면 GitHub 웹사이트에서 새 저장소를 만든 뒤, 안내되는 명령어로
`git remote add origin ...` → `git push` 하면 됩니다.)

> `.env.local`은 `.gitignore`에 포함되어 있어 GitHub에는 올라가지 않습니다. 안심하세요.

## 4단계 · Vercel로 배포하기 (무료)

1. https://vercel.com 에서 GitHub 계정으로 로그인
2. **Add New → Project** → 방금 만든 `song-letter` 저장소 선택
3. **Environment Variables** 섹션에 아래 두 개를 그대로 추가
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** 클릭 → 1~2분 뒤 `song-letter.vercel.app` 같은 주소로 접속 가능

이후 GitHub에 새 커밋을 푸시할 때마다 Vercel이 자동으로 재배포합니다.

---

## 프로젝트 구조

```
song-letter/
├─ app/
│  ├─ page.js          # 홈
│  ├─ write/page.js     # 사연 보내기
│  ├─ answer/page.js    # 노래 추천하기
│  ├─ inbox/page.js     # 내 사연함
│  └─ layout.js, globals.css
├─ components/
│  ├─ Nav.jsx
│  └─ Cassette.jsx       # 홈 화면의 카세트테이프 일러스트
├─ lib/
│  ├─ supabaseClient.js
│  └─ localUser.js       # 로그인 없이 브라우저별 익명 ID 부여
└─ supabase/schema.sql    # DB 테이블 + 권한 SQL
```

## 알아두면 좋은 점 (MVP 한계와 다음 개선 아이디어)

- **로그인이 없어요.** 브라우저의 `localStorage`에 저장된 임의의 ID로 "내 사연"을
  구분합니다. 빠르게 만들고 테스트하기엔 좋지만, 기기를 바꾸면 기록이 안 보이고
  브라우저 데이터를 지우면 기록도 사라져요. 나중에 카카오/이메일 로그인을 붙이면
  더 안정적으로 만들 수 있습니다.
- **답장은 사연 하나당 1개**로 제한했어요 (선착순). 여러 명이 답장할 수 있게
  하고 싶다면 `supabase/schema.sql`의 `unique(story_id)` 제약을 지우고,
  상태를 'answered'로 바꾸는 로직도 조정하면 됩니다.
- **보안(RLS)은 익명 프로젝트에 맞춰 느슨하게** 설정되어 있어요. 지금은 "누구나
  사연 상태를 바꿀 수 있음" 같은 정책이 있어, 악의적인 사용자가 임의로 상태를
  바꿀 여지가 있습니다. 실제 서비스로 키우고 싶다면 답장 등록 시 서버(Supabase
  Edge Function 등)에서 상태를 바꾸도록 옮기는 걸 추천해요.
- **신고/차단 기능은 없어요.** 익명 서비스이니만큼 나중에 부적절한 사연을
  신고하거나 숨기는 기능을 추가하면 좋아요.
- 랜덤 사연 뽑기는 최근 50개 중에서 무작위로 고르는 방식이라, 사연이 아주
  많아지면 페이지네이션이나 서버 쪽 랜덤 함수로 바꾸는 게 좋습니다.

## 궁금한 걸 더 물어보고 싶다면

이 코드는 Cursor, v0, Claude Code 같은 다른 AI 코딩 도구에 그대로 붙여넣어도
이해할 수 있도록 평범한 Next.js + Supabase 구조로 짰어요. 로그인 기능 추가,
디자인 변경, 신고 기능 등 다음 단계도 언제든 물어보세요.
