// 로그인 없이도 "내 사연함"을 볼 수 있도록, 브라우저에 임의의 익명 ID를 저장해 둡니다.
// 이 ID는 서버로는 전송되지만 이름/이메일 등 개인정보는 전혀 포함하지 않습니다.
export function getLocalUserId() {
  if (typeof window === 'undefined') return null;

  const KEY = 'song-letter-uid';
  let id = window.localStorage.getItem(KEY);

  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }

  return id;
}
