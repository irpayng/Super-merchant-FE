import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { ProgressBar } from '@/components/progress-bar';
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider } from '@/components/theme-provider';
import ReduxStoreProvider from './redux/ReduxStoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IRPAY Super Merchant App',
  description: 'IRPAY Super Merchant App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/IrpayLogoIcon.svg' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
        <meta name='google' content='notranslate' />
        <title>IRPAY Super Merchant Appl</title>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ReduxStoreProvider>
          <ThemeProvider>
            <ToastProvider>
              <Suspense fallback={null}>
                <ProgressBar />
              </Suspense>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </ReduxStoreProvider>
      </body>
    </html>
  );
}
