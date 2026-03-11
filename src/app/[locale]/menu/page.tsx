import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import MenuPage from '@/components/menu/MenuPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'menu' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function MenuRoute() {
  return <MenuPage />;
}
