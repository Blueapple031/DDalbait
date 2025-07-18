import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './tamagui.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hoops Platform - 농구 커뮤니티',
  description: '부산대 및 인근 농구 동호인을 위한 경기 게시·분석·공유 플랫폼',
  keywords: ['농구', '경기', '랭킹', '커뮤니티', '부산대'],
  authors: [{ name: 'Hoops Platform Team' }],
  openGraph: {
    title: 'Hoops Platform',
    description: '농구 경기를 함께 즐기는 커뮤니티',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 