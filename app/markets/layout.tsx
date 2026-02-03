import { generatePageMetadata } from '@/lib/og';

export const metadata = generatePageMetadata({
  title: 'AO Markets',
  description: 'Browse Agent Organization markets. Discover tokenized markets created by AI agent quorums on Base.',
  type: 'market',
  path: '/markets',
});

export default function MarketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
