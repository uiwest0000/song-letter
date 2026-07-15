-- Supabase SQL Editor에서 이 파일 전체를 붙여넣고 실행하세요.

create extension if not exists "pgcrypto";

-- 1. 사연 (story) 테이블
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null,
  content text not null check (char_length(content) between 1 and 1000),
  status text not null default 'pending' check (status in ('pending', 'answered')),
  created_at timestamptz not null default now()
);

-- 2. 답장 (response: 추천곡 + 한마디) 테이블
create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  responder_id uuid not null,
  song_title text not null check (char_length(song_title) between 1 and 200),
  song_url text,
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now(),
  unique(story_id) -- 사연 하나당 답장은 하나만 (선착순)
);

create index if not exists idx_stories_status on stories(status);
create index if not exists idx_stories_sender on stories(sender_id);
create index if not exists idx_responses_story on responses(story_id);

-- 3. RLS 활성화
alter table stories enable row level security;
alter table responses enable row level security;

-- 4. 정책: 누구나(anon) 읽고 쓸 수 있지만, 아래 규칙을 따름
--    - 사연은 누구나 새로 등록 가능
drop policy if exists "누구나 사연 등록 가능" on stories;
create policy "누구나 사연 등록 가능"
  on stories for insert
  to anon
  with check (true);

--    - 사연은 누구나 조회 가능 (본인 것도, 남에게 답장할 대상도 봐야 하므로)
drop policy if exists "누구나 사연 조회 가능" on stories;
create policy "누구나 사연 조회 가능"
  on stories for select
  to anon
  using (true);

--    - status 변경(답장 완료 처리)은 누구나 가능 (답장 등록 시 트리거로 대체 권장이지만 MVP는 update 허용)
drop policy if exists "누구나 상태 변경 가능" on stories;
create policy "누구나 상태 변경 가능"
  on stories for update
  to anon
  using (true)
  with check (true);

--    - 답장은 누구나 등록 가능
drop policy if exists "누구나 답장 등록 가능" on responses;
create policy "누구나 답장 등록 가능"
  on responses for insert
  to anon
  with check (true);

--    - 답장은 누구나 조회 가능
drop policy if exists "누구나 답장 조회 가능" on responses;
create policy "누구나 답장 조회 가능"
  on responses for select
  to anon
  using (true);
