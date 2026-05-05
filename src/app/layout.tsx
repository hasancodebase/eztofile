import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Layout/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Eztofile — Simple image & file conversion',
  description:
    'Resize pictures and change image formats in your browser. Clear steps, large controls, no account needed.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${display.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#main-content"
            className="fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-lg outline-none ring-2 ring-ring ring-offset-2 ring-offset-background transition-transform focus:translate-y-0"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="pt-16 md:pt-20" tabIndex={-1}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
