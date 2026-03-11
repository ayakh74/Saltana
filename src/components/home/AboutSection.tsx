'use client';

import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { Clock, MapPin } from 'lucide-react';

export default function AboutSection() {
  const t = useTranslations('about');

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
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                    <Image
                      src="/logo.png"
                      alt="سلطنة Saltana"
                      fill
                      className="object-contain drop-shadow-[0_0_20px_rgba(201,165,106,0.3)]"
                    />
                  </div>

                  <div className="text-center">
                    <p className="gold-text text-5xl font-black mb-2" lang="ar">سلطنة</p>
                    <div className="ornament-line w-full my-3" />
                    <p className="text-cream/30 text-xs tracking-[0.25em] uppercase">
                      Since 2019 · Arraba, Galilee
                    </p>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 w-full mt-4">
                    {[
                      { num: '5+', label: 'سنوات' },
                      { num: '100+', label: 'طبقاً' },
                      { num: '30K+', label: 'متابع' },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center border border-gold/10 py-3 px-2">
                        <p className="gold-text text-xl font-bold">{stat.num}</p>
                        <p className="text-cream/30 text-[10px] mt-1 tracking-wide" lang="ar">{stat.label}</p>
                      </div>
                    ))}
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
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-gold-DEFAULT/30" />
              <span className="section-label text-xl">{t('label')}</span>
              <div className="h-px w-12 bg-gold-DEFAULT/30" />
            </div>

            <div className="ornament-line w-full mb-8" />

            <p className="text-cream/60 text-base sm:text-lg leading-loose text-center sm:text-right mb-12">
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
          </div>
        </div>
      </div>
    </section>
  );
}
