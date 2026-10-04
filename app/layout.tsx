import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zishibuys.com"),
  title: {
    default: "ZishiBuys | Smart Finds for Modern Homes",
    template: "%s | ZishiBuys",
  },
  description:
    "Discover useful, trending and carefully selected household products at ZishiBuys.",
  keywords: [
    "home products",
    "household products",
    "kitchen gadgets",
    "home organization",
    "smart home products",
  ],
  openGraph: {
    title: "ZishiBuys | Smart Finds for Modern Homes",
    description:
      "Useful and trending household products, buying guides and smart home finds.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
