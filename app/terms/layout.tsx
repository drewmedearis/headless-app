import { generatePageMetadata } from '@/lib/og';

export const metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'Terms of Service for Headless Markets Protocol.',
  type: 'legal',
  path: '/terms',
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
