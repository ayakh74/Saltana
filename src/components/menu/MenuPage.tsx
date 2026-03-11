'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import type { MenuCategory, MenuItem } from '@/lib/supabase';
import { ImageOff, Flame, Sparkles, Star } from 'lucide-react';

function TagBadge({ tag }: { tag: MenuItem['tag'] }) {
  if (!tag) return null;
  const config = {
    popular: { icon: Flame, label: 'شائع', color: 'text-orange-400 border-orange-400/30 bg-orange-400/5' },
    signature: { icon: Sparkles, label: 'مميز', color: 'text-gold-DEFAULT border-gold/30 bg-gold/5' },
    new: { icon: Star, label: 'جديد', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5' },
  };
  const { icon: Icon, label, color } = config[tag];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase border px-1.5 py-0.5 rounded-sm', color)}>
      <Icon size={8} />
      {label}
    </span>
  );
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const t = useTranslations('menu');
  const locale = useLocale();
  const [imgError, setImgError] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const name = locale === 'he' ? (item.name_he || item.name_ar) : locale === 'en' ? (item.name_en || item.name_ar) : item.name_ar;
  const desc = locale === 'he' ? (item.desc_he || item.desc_ar) : locale === 'en' ? (item.desc_en || item.desc_ar) : item.desc_ar;

  return (
    <div
      ref={ref}
      className={cn(
        'glass-card glass-card-hover group transition-all duration-700',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-obsidian-200 border-b border-gold/8">
        {item.image_url && !imgError ? (
          <Image
            src={item.image_url}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-20">
            <ImageOff size={24} strokeWidth={1} className="text-gold-DEFAULT" />
            <span className="text-[10px] text-cream/40 tracking-widest uppercase">{t('no_image')}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {item.tag && (
          <div className="absolute top-3 left-3">
            <TagBadge tag={item.tag} />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-shrink-0 text-left">
            <span className="text-gold-DEFAULT font-bold text-lg">{item.price}</span>
            <span className="text-gold-DEFAULT/60 text-xs">₪</span>
          </div>
          <div className="text-right flex-1 min-w-0">
            <h3 className="text-cream/90 font-semibold text-base leading-snug">{name}</h3>
            {locale === 'ar' && item.name_he && (
              <p className="text-cream/25 text-xs mt-0.5 font-heebo" dir="rtl">{item.name_he}</p>
            )}
          </div>
        </div>
        {desc && (
          <p className="text-cream/40 text-xs leading-relaxed text-right mt-2 line-clamp-2">{desc}</p>
        )}
      </div>
    </div>
  );
}

type Props = { categories: MenuCategory[] };

export default function MenuPage({ categories }: Props) {
  const t = useTranslations('menu');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? '');
  const navRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (categories.length > 0) setActiveCategory(categories[0].id);
  }, [categories]);

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;
    const activeEl = navEl.querySelector(`[data-cat="${activeCategory}"]`) as HTMLElement;
    if (activeEl) {
      const offset = activeEl.offsetLeft - navEl.clientWidth / 2 + activeEl.clientWidth / 2;
      navEl.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [activeCategory]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    categories.forEach((cat) => {
      const el = sectionRefs.current[cat.id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveCategory(cat.id); },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = sectionRefs.current[catId];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const getCategoryName = (cat: MenuCategory) =>
    locale === 'he' ? (cat.name_he || cat.name_ar) : locale === 'en' ? (cat.name_en || cat.name_ar) : cat.name_ar;

  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-cream/30 text-sm">{t('subtitle')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian pt-24">
      {/* Page Header */}
      <div className="relative py-16 sm:py-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(201,165,106,0.06) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
            <span className="section-label">{t('title')}</span>
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cream/90 mb-4">{t('title')}</h1>
          <p className="text-cream/40 text-base max-w-md mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Sticky Category Nav */}
      <div className="sticky top-[60px] z-40 bg-obsidian/95 backdrop-blur-xl border-y border-gold/8">
        <div ref={navRef} className="menu-scroll flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center px-4 gap-1 py-1 min-w-max mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                data-cat={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={cn(
                  'px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-300 border-b-2',
                  activeCategory === cat.id
                    ? 'text-gold-DEFAULT border-gold-DEFAULT'
                    : 'text-cream/50 border-transparent hover:text-cream/80 hover:border-gold/30'
                )}
              >
                {getCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {categories.map((category) => {
          const availableItems = (category.menu_items ?? []).filter((i) => i.is_available);
          return (
            <section
              key={category.id}
              id={category.id}
              ref={(el) => { sectionRefs.current[category.id] = el; }}
            >
              <div className="flex items-center gap-6 mb-8 justify-end">
                <div className="flex-1 h-px bg-gradient-to-l from-gold/20 to-transparent" />
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-cream/90">{getCategoryName(category)}</h2>
                  <div className="w-2 h-2 bg-gold-DEFAULT rotate-45 flex-shrink-0" />
                </div>
              </div>
              {availableItems.length === 0 ? (
                <p className="text-cream/25 text-sm text-right">{t('no_image')}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {availableItems
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
