import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers/providers';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'CryptoTracker - Crypto Price Tracker',
  description:
    'Crypto dashboard with live markets, top movers, watchlist, and detailed analytics powered by CoinGecko API.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                <div className="container px-4 pb-24 pt-6 sm:px-6 lg:px-8">
                  <div className="content-flow">{children}</div>
                </div>
              </main>
              <Footer />
              <MobileBottomNav />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
