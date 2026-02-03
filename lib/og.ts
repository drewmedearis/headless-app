import { Metadata } from 'next';

type OGType = 'default' | 'market' | 'whitepaper' | 'invest' | 'legal';

interface GenerateMetadataOptions {
  title: string;
  description: string;
  type?: OGType;
  path?: string;
}

/**
 * Generate metadata with dynamic OG image for a page
 */
export function generatePageMetadata({
  title,
  description,
  type = 'default',
  path = '',
}: GenerateMetadataOptions): Metadata {
  const ogImageUrl = `/api/og?${new URLSearchParams({
    title,
    description: description.substring(0, 150),
    type,
  }).toString()}`;

  const url = `https://headlessmarkets.xyz${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Headless Markets',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - Headless Markets`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Generate metadata for a market page
 */
export function generateMarketMetadata({
  name,
  description,
  address,
}: {
  name: string;
  description: string;
  address: string;
}): Metadata {
  return generatePageMetadata({
    title: name,
    description,
    type: 'market',
    path: `/markets/${address}`,
  });
}
