'use client';

import { useEffect, useState, useCallback } from 'react';
import Nav from '@/components/Nav';
import { supabase } from '@/lib/supabaseClient';
import { getLocalUserId } from '@/lib/localUser';

export default function AnswerPage() {
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState(null);
  const [songTitle, setSongTitle] = useState('');
  const [songUrl, setSongUrl] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadRandomStory = useCallback(async () => {
    setLoading(true);
    setSentOk(false);
    setSongTitle('');
    setSongUrl('');
    setMessage('');
    setLoadError('');

    const myId = getLocalUserId();

    // 최근 대기 중인 사연을 여러 개 가져와서 그 중 하나를 무작위로 고릅니다.
    const { data, error } = await supabase
      .from('stories')
      .select('id, sender_id, content, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      setLoadError('사연을 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
      setStory(null);
      setLoading(false);
      return;
    }

    const candidates = (data || []).filter((s) => s.sender_id !== myId);
    const pool = candidates.length > 0 ? candidates : data || [];

    if (pool.length === 0) {
      setStory(null);
      setLoading(false);
      return;
    }

    const picked = pool[Math.floor(Math.random() * pool.length)];
    setStory(picked);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRandomStory();
  }, [loadRandomStory]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!story) return;

    setSending(true);
    const myId = getLocalUserId();

    const { error: insertError } = await supabase.from('responses').insert({
      story_id: story.id,
      responder_id: myId,
      song_title: songTitle.trim(),
      song_url: songUrl.trim() || null,
      message: message.trim(),
    });

    if (insertError) {
      setSending(false);
      setLoadError(
        '답장을 보내지 못했어요. 이미 다른 사람이 답장했을 수도 있어요.'
      );
      return;
    }

    await supabase.from('stories').update({ status: 'answered' }).eq('id', story.id);

    setSending(false);
    setSentOk(true);
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      <section className="flex-1 px-6 sm:px-10 max-w-2xl mx-auto w-full py-10">
        <p className="font-mono text-xs tracking-[0.2em] text-reel uppercase mb-3">
          B면 · 노래 추천하기
        </p>
        <h1 className="font-display text-3xl mb-8">누군가의 사연이에요</h1>

        {loading && <p className="text-paper/50 font-mono text-sm">불러오는 중…</p>}

        {!loading && !story && (
          <div className="border border-line rounded-2xl p-8 text-center text-paper/60">
            지금은 대기 중인 사연이 없어요. 잠시 후 다시 와주세요.
          </div>
        )}

        {loadError && <p className="text-sm text-tape mb-4">{loadError}</p>}

        {!loading && story && !sentOk && (
          <>
            <blockquote className="border border-line rounded-2xl p-6 mb-8 leading-relaxed whitespace-pre-wrap font-display text-lg italic">
              {story.content}
            </blockquote>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-paper/50 mb-1.5">
                  추천곡 (제목 · 아티스트)
                </label>
                <input
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="예: 좋은 사람 - 언니네 이발관"
                  className="focus-ring w-full bg-white/5 border border-line rounded-xl px-4 py-3 placeholder:text-paper/30"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-paper/50 mb-1.5">
                  링크 (선택 · 유튜브 등)
                </label>
                <input
                  value={songUrl}
                  onChange={(e) => setSongUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  type="url"
                  className="focus-ring w-full bg-white/5 border border-line rounded-xl px-4 py-3 placeholder:text-paper/30"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-paper/50 mb-1.5">
                  한마디 답장
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                  placeholder="이 노래를 고른 이유, 혹은 짧은 위로를 적어주세요"
                  rows={4}
                  className="focus-ring w-full bg-white/5 border border-line rounded-xl p-4 placeholder:text-paper/30 resize-none"
                  required
                  maxLength={300}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sending || !songTitle.trim() || !message.trim()}
                  className="focus-ring bg-reel text-ink font-mono text-sm px-6 py-3 rounded-full hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? '보내는 중…' : '노래와 함께 답장 보내기'}
                </button>
                <button
                  type="button"
                  onClick={loadRandomStory}
                  className="focus-ring border border-line font-mono text-sm px-5 py-3 rounded-full hover:bg-white/5 transition"
                >
                  다른 사연 보기
                </button>
              </div>
            </form>
          </>
        )}

        {sentOk && (
          <div className="border border-reel/40 rounded-2xl p-8 text-center">
            <p className="font-display text-xl mb-2 text-reel">
              답장이 전달됐어요.
            </p>
            <p className="text-paper/60 mb-6">
              당신이 고른 노래가 누군가의 하루에 닿을 거예요.
            </p>
            <button
              onClick={loadRandomStory}
              className="focus-ring bg-paper text-ink font-mono text-sm px-5 py-2.5 rounded-full hover:brightness-95 transition"
            >
              다른 사연에도 답장하기
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
