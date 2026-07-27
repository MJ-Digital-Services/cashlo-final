'use client';

import * as React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { cn, EASE } from './shared/tokens';
import { SectionHeader } from './shared/SectionHeader';

type Testimonial = {
  name: string;
  city: string;
  business: string;
  rating: number;
  quote: string;
  /** Drop a real photo in /public/merchants/ and set the path here. */
  image?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ramesh Gupta',
    city: 'Kanpur, UP',
    business: 'Kirana store',
    rating: 5,
    quote:
      'Villagers used to travel 6 km to the nearest ATM. Now they come to my shop for cash and buy groceries on the way out. My daily sale went up along with the commission.',
  },
  {
    name: 'Sunita Devi',
    city: 'Patna, Bihar',
    business: 'General store',
    rating: 5,
    quote:
      'Smart Khata ended my udhaar arguments. The reminder goes on WhatsApp, the customer pays, and nobody has to feel bad about asking.',
  },
  {
    name: 'Imran Sheikh',
    city: 'Nagpur, Maharashtra',
    business: 'Mobile shop',
    rating: 4,
    quote:
      'Recharge and bill payment run all day between phone sales. I earn around ₹9,000 extra a month without hiring anyone or buying a machine.',
  },
  {
    name: 'Anitha Reddy',
    city: 'Warangal, Telangana',
    business: 'Medical store',
    rating: 5,
    quote:
      'Settlement lands in my bank the same evening. That reliability is why I stopped using the other app I had.',
  },
];

function Avatar({ t }: { t: Testimonial }) {
  const initials = t.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  if (t.image) {
    return (
      <Image
        src={t.image}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3F5EF7] to-[#1B2A8A] text-base font-bold text-white"
    >
      {initials}
    </span>
  );
}

export default function Testimonials() {
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 5500);
    return () => window.clearInterval(id);
  }, [paused, reduce]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  const t = TESTIMONIALS[index];

  return (
    <section className="px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="testimonials-heading">
      <SectionHeader
        eyebrow="Merchant stories"
        title={<span id="testimonials-heading">Shopkeepers, in their own words</span>}
      />

      <div
        className="mx-auto mt-12 max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="relative min-h-[300px] sm:min-h-[260px]"
          aria-live="polite"
          aria-atomic="true"
          aria-roledescription="carousel"
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={t.name}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_-30px_rgba(11,16,32,0.4)] backdrop-blur-xl sm:p-10 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <Quote
                aria-hidden
                className="absolute right-7 top-7 h-12 w-12 text-[#3F5EF7]/10"
                strokeWidth={1.5}
              />
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden
                    className={cn(
                      'h-4 w-4',
                      i < t.rating ? 'fill-[#F5A623] text-[#F5A623]' : 'text-slate-300',
                    )}
                  />
                ))}
              </div>
              <blockquote className="mt-5 text-lg font-medium leading-relaxed tracking-tight text-[#0B1020] dark:text-white">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4">
                <Avatar t={t} />
                <span>
                  <span className="block font-bold tracking-tight text-[#0B1020] dark:text-white">
                    {t.name}
                  </span>
                  <span className="block text-sm text-slate-500 dark:text-slate-400">
                    {t.business} · {t.city}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous story"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#3F5EF7] hover:text-[#3F5EF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.name}
                onClick={() => setIndex(i)}
                aria-label={`Show story ${i + 1} of ${TESTIMONIALS.length}`}
                aria-current={i === index}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] focus-visible:ring-offset-2',
                  i === index ? 'w-7 bg-[#3F5EF7]' : 'w-2 bg-slate-300 dark:bg-white/20',
                )}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next story"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#3F5EF7] hover:text-[#3F5EF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-300"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}