import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Sparkles, Heart, Star, Phone } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'experiences' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

const experiences = [
  {
    key: 'ramadan',
    icon: Sparkles,
    accentColor: 'rgba(201,165,106,0.15)',
    borderColor: 'rgba(201,165,106,0.3)',
    details: [
      'أجواء رمضانية فريدة',
      'موائد فطور فاخرة',
      'مشروبات شرقية متنوعة',
      'أجواء عائلية ومائدة تجمع الجميع',
    ],
  },
  {
    key: 'private',
    icon: Heart,
    accentColor: 'rgba(244,63,94,0.1)',
    borderColor: 'rgba(244,63,94,0.25)',
    details: [
      'حفلات خطوبة وأعراس',
      'أعياد الميلاد الخاصة',
      'مناسبات العائلة والأصدقاء',
      'تصميم خاص لكل مناسبة',
    ],
  },
  {
    key: 'newyear',
    icon: Star,
    accentColor: 'rgba(167,139,250,0.1)',
    borderColor: 'rgba(167,139,250,0.2)',
    details: [
      'سهرات موسيقية حية',
      'أجواء راقية وفخمة',
      'عروض مميزة للمناسبة',
      'قائمة طعام استثنائية',
    ],
  },
];

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'experiences' });
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  return (
    <div className="min-h-screen bg-obsidian pt-24">
      {/* Header */}
      <div className="relative py-16 sm:py-20 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(201,165,106,0.07) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
            <span className="section-label">{t('title')}</span>
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cream/90 mb-4">
            {t('subtitle')}
          </h1>
        </div>
      </div>

      {/* Experience Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {experiences.map(({ key, icon: Icon, accentColor, borderColor, details }) => (
            <div
              key={key}
              className="glass-card p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500"
              style={{ borderColor }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at center, ${accentColor}, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6 border transition-all duration-300 group-hover:scale-110"
                  style={{ borderColor, background: accentColor }}
                >
                  <Icon size={22} className="text-gold-DEFAULT" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-black text-cream/90 mb-3 text-right">
                  {t(`${key}.title` as 'ramadan.title')}
                </h2>
                <p className="text-cream/50 text-sm leading-relaxed text-right mb-6">
                  {t(`${key}.desc` as 'ramadan.desc')}
                </p>
                <ul className="space-y-2 text-right">
                  {details.map((d) => (
                    <li key={d} className="flex items-center gap-3 justify-end">
                      <span className="text-cream/50 text-sm" lang="ar">{d}</span>
                      <div className="w-1 h-1 bg-gold-DEFAULT/50 rounded-full flex-shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Booking CTA Section */}
        <div className="glass-card p-10 sm:p-16 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(201,165,106,0.05), transparent 70%)' }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-gold-DEFAULT/30" />
              <span className="section-label" lang="ar">للحجز</span>
              <div className="h-px w-16 bg-gold-DEFAULT/30" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-cream/90 mb-4" lang="ar">
              هل تخطط لمناسبة خاصة؟
            </h2>
            <p className="text-cream/40 text-sm max-w-md mx-auto mb-10" lang="ar">
              تواصل معنا مباشرة لتنظيم تجربتك الخاصة في سلطنة — كل لحظة معمولة بحب
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reservations"
                className="btn-gold px-10 py-4 text-sm font-bold tracking-[0.2em] rounded-sm uppercase"
              >
                <span lang="ar">احجز الآن</span>
              </Link>
              <a
                href={`tel:${tFooter('phone')}`}
                className="btn-outline-gold px-10 py-4 text-sm font-semibold tracking-widest rounded-sm uppercase flex items-center justify-center gap-2.5"
              >
                <Phone size={14} strokeWidth={1.5} />
                <span dir="ltr">{tFooter('phone')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
