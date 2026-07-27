'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Banknote, Landmark, Lightbulb, QrCode, Smartphone, TrendingUp } from 'lucide-react';
import { cn, EASE, inr } from './shared/tokens';
import { SectionHeader } from './shared/SectionHeader';
import { GlassCard } from './shared/GlassCard';
import { Button } from './shared/Button';
import { useAnimatedNumber } from './shared/hooks';

type CalcService = {
  id: string;
  label: string;
  icon: React.ElementType;
  /** average commission the merchant keeps per transaction, in rupees */
  perTxn: number;
  /** typical share of the shop's daily service transactions */
  share: number;
};

const CALC_SERVICES: CalcService[] = [
  { id: 'cash', label: 'UPI Cash Point', icon: Banknote, perTxn: 11, share: 3 },
  { id: 'recharge', label: 'Recharge', icon: Smartphone, perTxn: 6, share: 2.5 },
  { id: 'bills', label: 'Bill payments', icon: Lightbulb, perTxn: 9, share: 2 },
  { id: 'loans', label: 'Loans', icon: Landmark, perTxn: 900, share: 0.06 },
  { id: 'qr', label: 'QR collection', icon: QrCode, perTxn: 2.5, share: 4 },
];

const RAMP = [0.5, 0.68, 0.82, 0.93, 1, 1.08];

/** Pure, so the numbers can be reasoned about (and tested) on their own. */
function computeEarnings(selectedIds: string[], customersPerDay: number) {
  const active = CALC_SERVICES.filter((s) => selectedIds.includes(s.id));
  const shareTotal = active.reduce((sum, s) => sum + s.share, 0);
  const breakdown = active.map((s) => {
    const dailyTxns = shareTotal > 0 ? (customersPerDay * s.share) / shareTotal : 0;
    return { id: s.id, label: s.label, icon: s.icon, dailyTxns, monthly: dailyTxns * s.perTxn * 30 };
  });
  const monthly = breakdown.reduce((sum, b) => sum + b.monthly, 0);
  return { breakdown, monthly, daily: monthly / 30 };
}

export default function EarningsCalculator({ onBecomeMerchant }: { onBecomeMerchant: () => void }) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = React.useState<string[]>(['cash', 'recharge', 'qr']);
  const [customers, setCustomers] = React.useState(40);

  // Recomputed on every change — selecting a chip or dragging the slider
  // updates the headline, the daily figure, the breakdown and the graph at once.
  const { breakdown, monthly, daily } = React.useMemo(
    () => computeEarnings(selected, customers),
    [selected, customers],
  );

  const shownMonthly = useAnimatedNumber(monthly);
  const shownDaily = useAnimatedNumber(daily);
  const peak = Math.max(...RAMP) * monthly;

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  return (
    <section id="earnings" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="earnings-heading">
      <SectionHeader
        eyebrow="Earnings calculator"
        title={<span id="earnings-heading">See what your counter could earn</span>}
        subtitle="Pick the services you want to offer and set how many customers you serve a day. Figures are indicative averages, not a guarantee."
      />

      <div className="mx-auto mt-12 max-w-6xl">
        <GlassCard hover={false} className="grid gap-0 lg:grid-cols-[1fr_1.05fr]">
          {/* ---- Controls ---- */}
          <div className="p-7 sm:p-9">
            <fieldset>
              <legend className="text-sm font-bold tracking-tight text-[#0B1020] dark:text-white">
                Services you will offer
              </legend>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {CALC_SERVICES.map((s) => {
                  const Icon = s.icon;
                  const on = selected.includes(s.id);
                  return (
                    <motion.button
                      key={s.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(s.id)}
                      whileTap={reduce ? undefined : { scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B1020]',
                        on
                          ? 'border-[#3F5EF7] bg-[#3F5EF7] text-white shadow-[0_10px_24px_-12px_rgba(63,94,247,0.8)]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-[#3F5EF7]/40 hover:text-[#3F5EF7] dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-300',
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {s.label}
                    </motion.button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-9">
              <div className="flex items-baseline justify-between">
                <label htmlFor="customers" className="text-sm font-bold tracking-tight text-[#0B1020] dark:text-white">
                  Service customers per day
                </label>
                <motion.span
                  key={customers}
                  initial={reduce ? false : { scale: 1.25, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="text-2xl font-extrabold tabular-nums text-[#3F5EF7]"
                >
                  {customers}
                </motion.span>
              </div>
              <input
                id="customers"
                type="range"
                min={5}
                max={150}
                step={5}
                value={customers}
                onChange={(e) => setCustomers(Number(e.target.value))}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E8EDFF] accent-[#3F5EF7] dark:bg-white/10"
                aria-describedby="customers-hint"
                aria-valuetext={`${customers} customers per day`}
              />
              <p id="customers-hint" className="mt-2 flex justify-between text-xs text-slate-500">
                <span>5 a day</span>
                <span>150 a day</span>
              </p>
            </div>

            <div className="mt-8 space-y-2.5">
              <AnimatePresence initial={false} mode="popLayout">
                {breakdown.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl bg-[#F5F8FF] px-4 py-3 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300"
                  >
                    Select at least one service to see an estimate.
                  </motion.p>
                ) : (
                  breakdown.map((b) => {
                    const Icon = b.icon;
                    return (
                      <motion.div
                        key={b.id}
                        layout
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="flex items-center justify-between rounded-2xl bg-[#F5F8FF] px-4 py-3 text-sm dark:bg-white/[0.04]"
                      >
                        <span className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                          <Icon className="h-4 w-4 text-[#3F5EF7]" aria-hidden />
                          {b.label}
                          <span className="hidden text-xs text-slate-400 sm:inline">
                            ~{b.dailyTxns.toFixed(0)}/day
                          </span>
                        </span>
                        <span className="font-bold tabular-nums text-[#0B1020] dark:text-white">
                          {inr(b.monthly)}
                          <span className="ml-1 font-medium text-slate-400">/mo</span>
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ---- Result ---- */}
          <div className="relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-[#1B2A8A] via-[#2A43D6] to-[#3F5EF7] p-7 text-white sm:p-9 lg:rounded-l-none lg:rounded-r-3xl">
            <span aria-hidden className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
              Estimated monthly earnings
            </p>
            <p className="mt-3 text-5xl font-extrabold tracking-tight tabular-nums sm:text-6xl">
              {inr(shownMonthly)}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
              <TrendingUp className="h-4 w-4" aria-hidden />
              <span className="tabular-nums">{inr(shownDaily)}</span> a day in commission
            </p>

            {/* six-month ramp — columns are full height so the percentage
                heights below actually resolve */}
            <div className="mt-9">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Typical ramp-up, first 6 months
              </p>
              <div
                className="mt-4 flex h-40 items-end gap-2.5"
                role="img"
                aria-label={`Projected monthly earnings reaching ${inr(monthly * 1.08)} by month six`}
              >
                {RAMP.map((r, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col justify-end">
                    <motion.div
                      animate={{ height: peak > 0 ? `${(r * monthly * 100) / peak}%` : '2%' }}
                      initial={false}
                      transition={{ duration: 0.55, ease: EASE, delay: reduce ? 0 : i * 0.04 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-white/25 to-white/80"
                      style={{ minHeight: 6 }}
                    />
                    <span className="mt-2 text-center text-[10px] font-medium text-white/50">
                      M{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="onDark" size="lg" className="mt-8 w-full" onClick={onBecomeMerchant}>
              Start earning this
            </Button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-white/55">
              Estimates use average commission rates across active Cashlo merchants. Actual earnings
              depend on your location, footfall and service mix.
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}