'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { supabase } from '@/lib/supabaseClient';
import { getLocalUserId } from '@/lib/localUser';

const MAX_LEN = 500;

export default function WritePage() {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setStatus('sending');
    setErrorMsg('');

    const senderId = getLocalUserId();

    const { error } = await supabase.from('stories').insert({
      sender_id: senderId,
      content: trimmed,
    });

    if (error) {
      setStatus('error');
      setErrorMsg('사연을 보내지 못했어요. 잠시 후 다시 시도해주세요.');
      return;
    }

    setStatus('sent');
    setContent('');
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <section className="flex-1 px-6 sm:px-10 max-w-2xl mx-auto w-full py-10">
        <p className="font-mono text-xs tracking-[0.2em] text-tape uppercase mb-3">
          A면 · 사연 보내기
        </p>
        <h1 className="font-display text-3xl mb-3">지금 마음을 적어보세요</h1>
        <p className="text-paper/60 mb-8 leading-relaxed">
          이름은 남지 않아요. 오늘 있었던 일, 요즘 드는 생각, 누군가에게
          듣고 싶은 위로 — 무엇이든 괜찮습니다.
        </p>

        {status === 'sent' ? (
          <div className="border border-reel/40 rounded-2xl p-8 text-center">
            <p className="font-display text-xl mb-2 text-reel">
              사연이 세상에 띄워졌어요.
            </p>
            <p className="text-paper/60 mb-6">
              누군가 답장을 보내면 &lsquo;내 사연함&rsquo;에서 확인할 수 있어요.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/inbox"
                className="focus-ring bg-paper text-ink font-mono text-sm px-5 py-2.5 rounded-full hover:brightness-95 transition"
              >
                내 사연함 보기
              </Link>
              <button
                onClick={() => setStatus('idle')}
                className="focus-ring border border-line font-mono text-sm px-5 py-2.5 rounded-full hover:bg-white/5 transition"
              >
                사연 하나 더 보내기
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX_LEN))}
                placeholder="오늘, 나는…"
                rows={8}
                className="focus-ring w-full bg-white/5 border border-line rounded-2xl p-5 leading-relaxed placeholder:text-paper/30 resize-none"
                required
              />
              <span className="absolute bottom-3 right-4 text-xs font-mono text-paper/30">
                {content.length}/{MAX_LEN}
              </span>
            </div>

            {status === 'error' && (
              <p className="text-sm text-tape">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending' || !content.trim()}
              className="focus-ring w-full sm:w-auto bg-tape text-ink font-mono text-sm px-6 py-3 rounded-full hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? '보내는 중…' : '익명으로 사연 보내기'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
