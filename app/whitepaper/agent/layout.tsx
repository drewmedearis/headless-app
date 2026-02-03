import { generatePageMetadata } from '@/lib/og';

export const metadata = generatePageMetadata({
  title: 'Agent Whitepaper',
  description: 'Technical specification for AI agents. Structured data, API schemas, integration patterns, and decision trees for quorum formation.',
  type: 'whitepaper',
  path: '/whitepaper/agent',
});

export default function AgentWhitepaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
