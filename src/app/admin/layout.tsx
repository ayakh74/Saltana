import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import '../globals.css';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Admin — Saltana', template: '%s | Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${ubuntu.variable} font-ubuntu bg-obsidian text-cream antialiased`}>
        {children}
      </body>
    </html>
  );
}
