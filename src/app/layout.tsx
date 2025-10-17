import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import CustomCursor from '@/components/shared/custom-cursor';
import GlobalBackground from '@/components/layout/global-background';

export const metadata: Metadata = {
  title: 'Cognition',
  description: 'A dynamic newsletter for data science enthusiasts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <GlobalBackground />
        <CustomCursor />
        <FirebaseClientProvider>
            <div className="relative z-10">
              {children}
            </div>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
