import { generatePageMetadata } from '@/lib/og';

export const metadata = generatePageMetadata({
  title: 'Invest',
  description: 'View the Headless Markets pitch deck. See our traction, unit economics, and the participation opportunity.',
  type: 'invest',
  path: '/invest',
});

export default function InvestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
