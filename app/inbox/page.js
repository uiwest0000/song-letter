'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { supabase } from '@/lib/supabaseClient';
import { getLocalUserId } from '@/lib/localUser';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
}

export default function InboxPage() {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const myId = getLocalUserId();
      const { data, error } = await supabase
        .from('stories')
        .select('id, content, status, created_at, responses(song_title, song_url, message, created_at)')
        .eq('sender_id', myId)
        .order('created_at', { ascending: false });

      if (error) {
        setError('사연함을 불러오지 못했어요.');
      } else {
        setStories(data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <section className="flex-1 px-6 sm:px-10 max-w-2xl mx-auto w-full py-10">
        <p className="font-mono text-xs tracking-[0.2em] text-paper/50 uppercase mb-3">
          되감기 · 내 사연함
        </p>
        <h1 className="font-display text-3xl mb-2">내가 보낸 사연들</h1>
        <p className="text-paper/50 mb-8 text-sm leading-relaxed">
          이 브라우저에서 보낸 사연만 보여요. 브라우저나 기기를 바꾸면 목록이
          비어 보일 수 있어요.
        </p>

        {loading && <p className="text-paper/50 font-mono text-sm">불러오는 중…</p>}
        {error && <p className="text-tape text-sm">{error}</p>}

        {!loading && stories.length === 0 && !error && (
          <div className="border border-line rounded-2xl p-8 text-center text-paper/60">
            아직 보낸 사연이 없어요.
            <div className="mt-4">
              <Link
                href="/write"
                className="focus-ring inline-block bg-tape text-ink font-mono text-sm px-5 py-2.5 rounded-full hover:brightness-110 transition"
              >
                첫 사연 보내기
              </Link>
            </div>
          </div>
        )}

        <ul className="space-y-5">
          {stories.map((s) => {
            const response = Array.isArray(s.responses) ? s.responses[0] : s.responses;
            return (
              <li key={s.id} className="border border-line rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-paper/40">
                    {formatDate(s.created_at)}
                  </span>
                  <span
                    className={`font-mono text-xs px-2.5 py-1 rounded-full ${
                      s.status === 'answered'
                        ? 'bg-reel/15 text-reel'
                        : 'bg-white/5 text-paper/40'
                    }`}
                  >
                    {s.status === 'answered' ? '답장 도착' : '대기 중'}
                  </span>
                </div>

                <p className="leading-relaxed whitespace-pre-wrap mb-4">{s.content}</p>

                {response && (
                  <div className="mt-4 border-t border-line pt-4">
                    <p className="font-mono text-xs text-tape mb-1">추천곡</p>
                    {response.song_url ? (
                      <a
                        href={response.song_url}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring text-tape underline underline-offset-4 font-display italic"
                      >
                        {response.song_title}
                      </a>
                    ) : (
                      <p className="font-display italic">{response.song_title}</p>
                    )}
                    <p className="mt-3 text-paper/70 leading-relaxed">
                      &ldquo;{response.message}&rdquo;
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
