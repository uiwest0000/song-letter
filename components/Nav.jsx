import Link from 'next/link';

export default function Nav() {
  return (
    <header className="w-full px-6 sm:px-10 py-6 flex items-center justify-between">
      <Link href="/" className="font-display italic text-lg tracking-tight">
        사연테이프
      </Link>
      <nav className="flex items-center gap-5 text-sm font-mono">
        <Link href="/write" className="hover:text-tape transition-colors focus-ring rounded">
          사연 보내기
        </Link>
        <Link href="/answer" className="hover:text-reel transition-colors focus-ring rounded">
          노래 추천하기
        </Link>
        <Link href="/inbox" className="opacity-70 hover:opacity-100 transition-opacity focus-ring rounded">
          내 사연함
        </Link>
      </nav>
    </header>
  );
}
