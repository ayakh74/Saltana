'use client';

import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Clock, MapPin, Star } from 'lucide-react';

export default function AboutSection() {
  const t = useTranslations('about');
  const tNav = useTranslations('nav');

  const { ref: sectionRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36 overflow-hidden bg-obsidian">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] -translate-y-1/2 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #C9A56A, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Visual */}
          <div
            className={`relative transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            {/* Decorative frame */}
            <div className="relative">
              {/* Outer frame lines */}
              <div className="absolute -top-4 -right-4 w-full h-full border border-gold/15 rounded-none" />
              <div className="absolute -top-2 -right-2 w-full h-full border border-gold/8 rounded-none" />

              {/* Main visual block */}
              <div className="relative bg-obsidian-200 border border-gold/20 overflow-hidden aspect-[4/5]">
                {/* Atmospheric gradient inside */}
                <div className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(201,165,106,0.06) 0%, transparent 70%)' }} />

                {/* Central logo mark */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-12">
                  <div className="text-gold-DEFAULT/15">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                      <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="0.5" />
                      <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.3" />
                      <path d="M60 10 L60 110 M10 60 L110 60" stroke="currentColor" strokeWidth="0.3" />
                      <circle cx="60" cy="60" r="6" fill="currentColor" opacity="0.4" />
                      <path d="M60 2 L63 14 L76 6 L70 18 L82 16 L74 26 L86 28 L76 36 L86 42 L74 44 L82 54 L70 50 L72 64 L62 58 L60 72 L58 58 L48 64 L50 50 L38 54 L46 44 L34 42 L44 36 L34 28 L46 26 L38 16 L50 18 L44 6 L57 14 Z" fill="currentColor" opacity="0.15" />
                    </svg>
                  </div>

                  <div className="text-center">
                    <p className="gold-text text-5xl font-black mb-2">سلطنة</p>
                    <div className="ornament-line w-full my-3" />
                    <p className="text-cream/30 text-xs tracking-[0.25em] uppercase">
                      Since 2019 · Arraba, Galilee
                    </p>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 w-full mt-4">
                    {[
                      { num: '5+', label: 'سنوات' },
                      { num: '50+', label: 'طبقاً' },
                      { num: '10K+', label: 'متابع' },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center border border-gold/10 py-3 px-2">
                        <p className="gold-text text-xl font-bold">{stat.num}</p>
                        <p className="text-cream/30 text-[10px] mt-1 tracking-wide">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute bottom-6 -left-6 glass-card p-4 border border-gold/20 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-DEFAULT/10 flex items-center justify-center">
                    <Star size={14} className="text-gold-DEFAULT" fill="#C9A56A" />
                  </div>
                  <div>
                    <p className="text-cream/80 text-xs font-semibold">في سلطنة</p>
                    <p className="text-cream/40 text-[10px]">دائماً أنت السلطان</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div
            className={`transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            {/* Section label */}
            <div className="flex items-center gap-4 mb-8 justify-end">
              <div className="h-px flex-1 max-w-[60px] bg-gold-DEFAULT/30" />
              <span className="section-label">{t('label')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-right leading-tight mb-8">
              <span className="gold-text">{t('title')}</span>
            </h2>

            <div className="ornament-line w-full mb-8" />

            <p className="text-cream/60 text-base sm:text-lg leading-loose text-right mb-12">
              {t('body')}
            </p>

            {/* Info pills */}
            <div className="space-y-4 mb-10">
              {[
                { icon: Clock, text: t('open_hours'), sub: t('days') },
                { icon: MapPin, text: t('location'), sub: '', href: 'https://waze.com/ul/hsvc4gvm5j5' },
              ].map(({ icon: Icon, text, sub, href }) => {
                const content = (
                  <div className="flex items-center gap-4 glass-card px-5 py-4 justify-end group cursor-pointer">
                    <div className="text-right">
                      <p className="text-cream/80 text-sm font-medium">{text}</p>
                      {sub && <p className="text-cream/40 text-xs mt-0.5">{sub}</p>}
                    </div>
                    <div className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center flex-shrink-0 group-hover:border-gold-DEFAULT group-hover:bg-gold/5 transition-all duration-300">
                      <Icon size={14} className="text-gold-DEFAULT" strokeWidth={1.5} />
                    </div>
                  </div>
                );
                return href ? (
                  <a key={text} href={href} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  <div key={text}>{content}</div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Link
                href="/menu"
                className="btn-gold px-7 py-3.5 text-sm font-bold tracking-widest rounded-sm uppercase"
              >
                {tNav('menu')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
