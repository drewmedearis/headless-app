import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Kit",
  description: "Headless Markets brand guidelines, logos, colors, and design assets. Download everything you need to create content.",
  openGraph: {
    title: "Brand Kit | Headless Markets",
    description: "Download logos, colors, and design assets for Headless Markets.",
    images: [
      {
        url: "https://www.headlessmarket.xyz/api/og?title=Brand%20Kit&description=Logos%2C%20colors%2C%20and%20design%20assets&type=brand",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
