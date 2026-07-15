import Link from 'next/link';
import Nav from '@/components/Nav';
import Cassette from '@/components/Cassette';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <section className="flex-1 px-6 sm:px-10 grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto w-full py-10">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-reel uppercase mb-4">
            익명 사연 · 노래 교환
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-6">
            오늘의 이야기를 <span className="italic text-tape">테이프</span>에
            흘려보내면,
            <br />
            누군가 어울리는 노래를 얹어 돌려보내요.
          </h1>
          <p className="text-paper/70 leading-relaxed mb-8 max-w-md">
            이름도, 얼굴도 몰라요. 짧은 사연 하나를 세상에 띄우면, 그 이야기를
            읽은 낯선 사람이 노래 한 곡과 한마디 답장을 골라 보내줍니다.
            당신도 누군가의 사연에 노래를 추천할 수 있어요.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/write"
              className="focus-ring inline-flex items-center gap-2 bg-tape text-ink font-mono text-sm px-6 py-3 rounded-full hover:brightness-110 transition"
            >
              사연 보내기 →
            </Link>
            <Link
              href="/answer"
              className="focus-ring inline-flex items-center gap-2 border border-reel/60 text-reel font-mono text-sm px-6 py-3 rounded-full hover:bg-reel/10 transition"
            >
              노래 추천하러 가기
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <Cassette className="w-full max-w-sm drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]" />
        </div>
      </section>

      <section className="px-6 sm:px-10 max-w-6xl mx-auto w-full pb-16 grid sm:grid-cols-3 gap-6 font-mono text-sm">
        <div className="border-t border-line pt-4">
          <p className="text-tape mb-1">A면</p>
          <p className="text-paper/70">사연을 적어 익명으로 보냅니다.</p>
        </div>
        <div className="border-t border-line pt-4">
          <p className="text-reel mb-1">B면</p>
          <p className="text-paper/70">
            다른 사람의 사연을 읽고 어울리는 노래와 한마디를 답장합니다.
          </p>
        </div>
        <div className="border-t border-line pt-4">
          <p className="text-paper mb-1">되감기</p>
          <p className="text-paper/70">
            내 사연함에서 도착한 노래와 답장을 확인합니다.
          </p>
        </div>
      </section>
    </main>
  );
}
