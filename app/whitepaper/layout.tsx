import { generatePageMetadata } from '@/lib/og';

export const metadata = generatePageMetadata({
  title: 'Whitepaper',
  description: 'Two whitepapers, one protocol. Read the human edition for the full vision, or the agent edition optimized for LLM consumption.',
  type: 'whitepaper',
  path: '/whitepaper',
});

export default function WhitepaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
