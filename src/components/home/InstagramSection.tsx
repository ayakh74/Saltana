'use client';

import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { Instagram, ExternalLink } from 'lucide-react';

// Instagram oEmbed feed - loads the embed script from Instagram
// The actual posts are loaded dynamically via the embed
export default function InstagramSection() {
  const t = useTranslations('instagram');
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-28 sm:py-36 bg-obsidian-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="ornament-line absolute top-0 left-0 right-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
            <Instagram size={14} className="text-gold-DEFAULT" strokeWidth={1.5} />
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-cream/90 mb-3">
            {t('title')}
          </h2>
          <p className="text-cream/40 text-sm">{t('subtitle')}</p>
        </div>

        {/* Instagram Embed Feed */}
        <div
          className={`transition-all duration-1000 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Elfsight / Behold Instagram Feed Widget */}
          {/* To activate: Replace the placeholder with your actual Elfsight or Behold feed embed code */}
          {/* Example: <div className="elfsight-app-YOUR_APP_ID"></div> */}
          {/* Or use the Behold.so iframe embed */}

          {/* Placeholder grid showing Instagram aesthetic */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <a
                key={i}
                href="https://www.instagram.com/saltana.il"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square bg-obsidian-200 border border-gold/8 overflow-hidden group"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-full h-full opacity-20"
                    style={{
                      background: `radial-gradient(ellipse at ${(i % 3) * 50}% ${Math.floor(i / 3) * 50}%, rgba(201,165,106,0.3), transparent)`,
                    }}
                  />
                  <Instagram
                    size={24}
                    className="text-gold-DEFAULT/20 absolute"
                    strokeWidth={1}
                  />
                </div>
                <div className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <ExternalLink size={18} className="text-gold-DEFAULT" strokeWidth={1.5} />
                </div>
              </a>
            ))}
          </div>

          {/* Integration note + CTA */}
          <div className="text-center">
            <p className="text-cream/25 text-xs mb-6 max-w-md mx-auto leading-relaxed">
              {/* This will automatically display live Instagram posts after connecting the feed widget */}
            </p>
            <a
              href="https://www.instagram.com/saltana.il"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 btn-outline-gold px-8 py-3.5 text-sm font-semibold tracking-widest rounded-sm uppercase group"
            >
              <Instagram size={15} strokeWidth={1.5} />
              <span>{t('handle')}</span>
              <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
