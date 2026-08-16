import type { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import { AgentationGuard } from '@/components/AgentationGuard';
import { HappySeedsWatermark } from '@/components/HappySeedsWatermark';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import './globals.css';
import jsonMetadata from '../metadata.json';

export const metadata: Metadata = {
  ...jsonMetadata,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon-512.png',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Aion',
  },
  applicationName: 'Aion',
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#09090b" />
        {process.env.NODE_ENV === 'production' && (
          <Script
            async
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </head>
      <body className="antialiased">
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
        <HappySeedsWatermark />
        <AgentationGuard />
        <ServiceWorkerRegister />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
