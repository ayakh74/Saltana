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
      <span lang="ar">{label}</span>
    </span>
  );
}

function MenuItemCard({ item, onClick }: { item: MenuItem; onClick?: () => void }) {
  const t = useTranslations('menu');
  const locale = useLocale();
  const [imgError, setImgError] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const name = locale === 'he' ? (item.name_he || item.name_ar) : locale === 'en' ? (item.name_en || item.name_ar) : item.name_ar;
  const desc = locale === 'he' ? (item.desc_he || item.desc_ar) : locale === 'en' ? (item.desc_en || item.desc_ar) : item.desc_ar;
  const nameIsArabic = locale === 'ar' || (locale === 'he' && !item.name_he) || (locale === 'en' && !item.name_en);
  const descIsArabic = locale === 'ar' || (locale === 'he' && !item.desc_he) || (locale === 'en' && !item.desc_en);

  return (
    <div
      ref={ref}
      className={cn(
        'glass-card glass-card-hover group transition-all duration-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-obsidian-200 border-b border-gold/8 flex items-center justify-center">
        {item.image_url && !imgError ? (
          <Image
            src={item.image_url}
            alt={name}
            fill
            className="object-contain object-center bg-obsidian-200 transition-transform duration-700"
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
            <h3 className="text-cream/90 font-semibold text-base leading-snug">{nameIsArabic ? <span lang="ar">{name}</span> : name}</h3>
            {locale === 'ar' && item.name_he && (
              <p className="text-cream/25 text-xs mt-0.5 font-heebo" dir="rtl">{item.name_he}</p>
            )}
          </div>
        </div>
        {desc && (
          <p className="text-cream/40 text-xs leading-relaxed text-right mt-2 line-clamp-2">{descIsArabic ? <span lang="ar">{desc}</span> : desc}</p>
        )}
      </div>
    </div>
  );
}

function SectionedGrid({
  items,
  cols = 2,
  onItemClick,
}: {
  items: MenuItem[];
  cols?: 2 | 3;
  onItemClick?: (item: MenuItem) => void;
}) {
  const locale = useLocale();
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);

  // Group consecutive items by section label
  const groups: { label: string | null; items: MenuItem[] }[] = [];
  for (const item of sorted) {
    const label = item.section ?? null;
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }

  const sectionLabel = (label: string) => {
    if (label === 'بارد') return { ar: 'مشروبات باردة', he: 'שתייה קרה', en: 'Cold Drinks' };
    if (label === 'ساخن') return { ar: 'مشروبات ساخنة', he: 'שתייה חמה', en: 'Hot Drinks' };
    return { ar: label, he: label, en: label };
  };

  const getLabel = (label: string) => {
    const s = sectionLabel(label);
    return locale === 'he' ? s.he : locale === 'en' ? s.en : s.ar;
  };
  const labelIsArabic = (label: string) => /[\u0600-\u06FF]/.test(getLabel(label));

  return (
    <div className="space-y-10">
      {groups.map((group, idx) => (
        <div key={idx}>
          {group.label && (
            <div className="flex items-center justify-center sm:justify-between gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-gold/15 to-transparent hidden sm:block" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-DEFAULT/60 px-3 py-1 border border-gold/15 rounded-sm text-center" {...(labelIsArabic(group.label) && { lang: 'ar' })}>
                {getLabel(group.label)}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-gold/15 to-transparent hidden sm:block" />
            </div>
          )}
          <div
            className={cn(
              'grid gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4',
              cols === 3 ? 'grid-cols-3' : 'grid-cols-2'
            )}
          >
            {group.items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onClick={onItemClick ? () => onItemClick(item) : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type Props = { categories: MenuCategory[] };

export default function MenuPage({ categories }: Props) {
  const t = useTranslations('menu');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? '');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
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
      // Offset for fixed header (~68px) + sticky category nav (~60px + ~50px) so title isn't hidden
      const offset = 140;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
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
      {/* Page Header — section label only (no duplicate title), centered on mobile */}
      <div className="relative pt-16 pb-24 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(201,165,106,0.06) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
            <span className="section-label">{t('title')}</span>
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cream/90 mb-4 text-center">{t('subtitle')}</h1>
        </div>
      </div>

      {/* Sticky Category Nav */}
      <div className="sticky top-[76px] sm:top-[60px] z-40 bg-obsidian/95 backdrop-blur-xl border-y border-gold/8">
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
                {...(/[\u0600-\u06FF]/.test(getCategoryName(cat)) && { lang: 'ar' })}
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
              className="scroll-mt-[140px]"
            >
              <div className="mb-8 w-full" dir="ltr" style={{ textAlign: 'center' }}>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-gold-DEFAULT rotate-45 flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-black text-cream/90" style={{ textAlign: 'center' }} {...(/[\u0600-\u06FF]/.test(getCategoryName(category)) && { lang: 'ar' })}>{getCategoryName(category)}</h2>
                </div>
                <div className="h-px mt-2 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
              </div>
              {availableItems.length === 0 ? (
                <p className="text-cream/25 text-sm text-right">{t('no_image')}</p>
              ) : (
                <SectionedGrid
                  items={availableItems}
                  cols={2}
                  onItemClick={(item) => setSelectedItem(item)}
                />
              )}
            </section>
          );
        })}
      </div>

      {/* Item Details Dialog */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-lg w-full max-h-[80vh] overflow-y-auto glass-card border border-gold/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 left-3 text-cream/60 hover:text-cream/90 text-sm"
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>
            <div className="relative aspect-[16/9] bg-obsidian-200 border-b border-gold/10 flex items-center justify-center">
              {selectedItem.image_url ? (
                <Image
                  src={selectedItem.image_url}
                  alt={selectedItem.name_ar}
                  fill
                  className="object-contain object-center bg-obsidian-200"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-cream/25">
                  <ImageOff size={24} strokeWidth={1} className="text-gold-DEFAULT" />
                  <span className="text-[10px] tracking-widest uppercase">{t('no_image')}</span>
                </div>
              )}
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-shrink-0 text-left">
                  <span className="text-gold-DEFAULT font-bold text-xl">{selectedItem.price}</span>
                  <span className="text-gold-DEFAULT/60 text-sm ml-0.5">₪</span>
                </div>
                <div className="text-right flex-1 min-w-0">
                  {(() => {
                    const name =
                      locale === 'he'
                        ? selectedItem.name_he || selectedItem.name_ar
                        : locale === 'en'
                        ? selectedItem.name_en || selectedItem.name_ar
                        : selectedItem.name_ar;
                    const nameIsArabic =
                      locale === 'ar' ||
                      (locale === 'he' && !selectedItem.name_he) ||
                      (locale === 'en' && !selectedItem.name_en);
                    return (
                      <h2 className="text-cream/95 font-semibold text-lg leading-snug">
                        {nameIsArabic ? <span lang="ar">{name}</span> : name}
                      </h2>
                    );
                  })()}
                  {locale === 'ar' && selectedItem.name_he && (
                    <p className="text-cream/30 text-xs mt-0.5 font-heebo" dir="rtl">
                      {selectedItem.name_he}
                    </p>
                  )}
                </div>
              </div>

              {selectedItem.desc_ar || selectedItem.desc_he || selectedItem.desc_en ? (
                <div className="pt-2 text-sm leading-relaxed text-cream/80 text-right space-y-2">
                  {(() => {
                    const desc =
                      locale === 'he'
                        ? selectedItem.desc_he || selectedItem.desc_ar
                        : locale === 'en'
                        ? selectedItem.desc_en || selectedItem.desc_ar
                        : selectedItem.desc_ar;
                    const descIsArabic =
                      locale === 'ar' ||
                      (locale === 'he' && !selectedItem.desc_he) ||
                      (locale === 'en' && !selectedItem.desc_en);
                    return desc ? (descIsArabic ? <p lang="ar">{desc}</p> : <p>{desc}</p>) : null;
                  })()}
                </div>
              ) : null}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
