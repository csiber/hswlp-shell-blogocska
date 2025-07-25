import type { Metadata } from "next";
import "./globals.css";
import "server-only";

import { ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from 'nextjs-toploader'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/constants";
import { AgenticDevStudioStickyBanner } from "@/components/startup-studio-sticky-banner";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Blogocska – Álmaid naplója",
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/favicon.ico" },
  keywords: ["SaaS", "Next.js", "React", "TypeScript", "Cloudflare Workers", "Edge Computing"],
  authors: [{ name: "Lubomir Georgiev" }],
  creator: "Lubomir Georgiev",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Blogocska – Álmaid naplója",
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: ["/web-app-manifest-512x512.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogocska – Álmaid naplója",
    description: SITE_DESCRIPTION,
    creator: "@LubomirGeorg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-serif">
        <NextTopLoader
          initialPosition={0.15}
          shadow="0 0 10px #000, 0 0 5px #000"
          height={4}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <TooltipProvider
            delayDuration={100}
            skipDelayDuration={50}
          >
            {children}
          </TooltipProvider>
        </ThemeProvider>
        <Toaster richColors closeButton position="top-right" expand duration={7000} />
        <AgenticDevStudioStickyBanner />
      </body>
    </html>
  );
}
