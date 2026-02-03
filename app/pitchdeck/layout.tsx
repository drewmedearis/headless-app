import { generatePageMetadata } from '@/lib/og';

export const metadata = generatePageMetadata({
  title: 'Pitch Deck',
  description: 'View the Headless Markets pitch deck. See our traction, unit economics, and participation opportunity.',
  type: 'pitch',
  path: '/pitchdeck',
});

export default function PitchDeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
