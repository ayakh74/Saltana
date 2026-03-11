'use client';

import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { menuData } from '@/lib/menu-data';

const featuredCategories = ['mains', 'fish', 'italian', 'appetizers'];

export default function MenuPreview() {
  const t = useTranslations('menu');
  const tNav = useTranslations('nav');
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const featured = menuData.filter((c) => featuredCategories.includes(c.key));

  return (
    <section ref={ref} className="relative py-28 sm:py-36 bg-obsidian overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className={`mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-center gap-4 mb-4 justify-end">
            <span className="section-label">{t('title')}</span>
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
          </div>
          <div className="flex items-end justify-between">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-gold-DEFAULT text-sm hover:gap-3 transition-all duration-300 group"
            >
              <span className="tracking-wide">{tNav('menu')}</span>
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            </Link>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cream/90 text-right">
              {t('subtitle')}
            </h2>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featured.map((category, i) => {
            const categoryTitle = t(`categories.${category.key}` as 'categories.mains');
            const topItems = category.items.slice(0, 3);

            return (
              <div
                key={category.id}
                style={{ transitionDelay: `${i * 100}ms` }}
                className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              >
                <Link href="/menu" className="block glass-card group hover:border-gold/25 transition-all duration-500 overflow-hidden">
                  {/* Category Header */}
                  <div className="px-6 pt-6 pb-4 border-b border-gold/8 flex items-center justify-between">
                    <div className="w-1.5 h-1.5 bg-gold-DEFAULT rounded-full" />
                    <h3 className="text-gold-DEFAULT font-bold text-lg">{categoryTitle}</h3>
                  </div>

                  {/* Items list */}
                  <div className="p-6 space-y-4">
                    {topItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="text-left">
                          <span className="text-gold-DEFAULT text-sm font-semibold">
                            {item.price}
                            <span className="text-gold-DEFAULT/70 text-xs">{t('price_unit')}</span>
                          </span>
                          {item.tag && (
                            <span className="mr-2 text-[9px] font-semibold tracking-widest uppercase bg-gold/10 text-gold-DEFAULT border border-gold/20 px-1.5 py-0.5 rounded-sm">
                              {item.tag === 'popular' ? '✦' : item.tag === 'signature' ? '★' : ''}
                            </span>
                          )}
                        </div>
                        <div className="text-right flex-1 min-w-0">
                          <p className="text-cream/80 text-sm font-medium truncate">{item.nameAr}</p>
                          {item.descAr && (
                            <p className="text-cream/35 text-xs mt-0.5 truncate">{item.descAr}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-DEFAULT/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Full menu CTA */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-600 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <Link
            href="/menu"
            className="btn-gold inline-block px-10 py-4 text-sm font-bold tracking-[0.2em] rounded-sm uppercase"
          >
            {tNav('menu')}
          </Link>
        </div>
      </div>
    </section>
  );
}
