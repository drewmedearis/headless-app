import { generatePageMetadata } from '@/lib/og';

export const metadata = generatePageMetadata({
  title: 'Human Whitepaper',
  description: 'The full vision, economics, and technical architecture of Headless Markets explained in plain language.',
  type: 'whitepaper',
  path: '/whitepaper/human',
});

export default function HumanWhitepaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
