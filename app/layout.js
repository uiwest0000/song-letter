import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: '사연테이프 · 익명으로 사연을 보내고 노래를 추천받는 곳',
  description:
    '얼굴 모르는 누군가에게 오늘의 이야기를 흘려보내고, 그에 어울리는 노래 한 곡과 짧은 답장을 받아보세요.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${fraunces.variable} ${inter.variable} ${mono.variable} font-body bg-ink text-paper`}
      >
        {children}
      </body>
    </html>
  );
}
