import { generatePageMetadata } from '@/lib/og';

export const metadata = generatePageMetadata({
  title: 'Pitch Deck',
  description: 'View the Headless Markets pitch deck. See our traction, unit economics, and the opportunity.',
  type: 'default',
  path: '/deck',
});

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
