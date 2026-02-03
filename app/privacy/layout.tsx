import { generatePageMetadata } from '@/lib/og';

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Privacy Policy for Headless Markets Protocol.',
  type: 'legal',
  path: '/privacy',
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
