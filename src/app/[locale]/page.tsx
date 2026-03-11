import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import AboutSection from '@/components/home/AboutSection';
import MenuPreview from '@/components/home/MenuPreview';
import ExperiencesPreview from '@/components/home/ExperiencesPreview';
import InstagramSection from '@/components/home/InstagramSection';
import ContactSection from '@/components/home/ContactSection';
import { getFullMenu } from '@/lib/actions/menu-items';
import type { MenuCategory } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return { title: 'سلطنة | Saltana — غذاء الروح والجسد', description: t('subtitle') };
}

export default async function HomePage() {
  let categories: MenuCategory[] = [];
  try {
    categories = await getFullMenu() as MenuCategory[];
  } catch {
    // DB not configured yet — homepage still renders
  }

  return (
    <>
      <Hero />
      <AboutSection />
      <MenuPreview categories={categories} />
      <ExperiencesPreview />
      <InstagramSection />
      <ContactSection />
    </>
  );
}
