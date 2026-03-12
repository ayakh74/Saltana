import type { Metadata } from 'next';
import { Cairo, Ubuntu, Heebo } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/app/globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
});

const ubuntu = Ubuntu({
  subsets: ['latin'],
  variable: '--font-ubuntu',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  return {
    title: {
      default: 'سلطنة | Saltana Restaurant',
      template: '%s | سلطنة',
    },
    description: t('subtitle'),
    keywords: ['مطعم سلطنة', 'عرابة', 'Saltana', 'Arraba', 'مطعم', 'restaurant', 'Israeli restaurant'],
    openGraph: {
      title: 'سلطنة | Saltana',
      description: t('subtitle'),
      type: 'website',
      locale: locale,
      url: 'https://saltanaa.com',
      siteName: 'Saltana',
      images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Saltana Restaurant' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'سلطنة | Saltana',
    },
    icons: {
      icon: '/logo.png',
      apple: '/logo.png',
    },
    other: {
      'og:locale:alternate': ['ar_IL', 'he_IL', 'en_IL'],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ar' | 'he' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  const dir = locale === 'he' || locale === 'ar' ? 'rtl' : 'ltr';

  const fontFamily = locale === 'ar' ? 'font-cairo' : locale === 'he' ? 'font-heebo' : 'font-ubuntu';

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} ${ubuntu.variable} ${heebo.variable}`}>
      <body className={`bg-obsidian text-cream ${fontFamily} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
