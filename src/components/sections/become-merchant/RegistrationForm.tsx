'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Banknote, BookText, Check, Landmark, Lightbulb, Loader2, QrCode, Smartphone } from 'lucide-react';
import { cn } from './shared/tokens';
import { Reveal } from './shared/motion';
import { GlassCard } from './shared/GlassCard';
import { Field } from './shared/Field';
import { Dropdown } from './shared/Dropdown';
import { Button } from './shared/Button';
import { useToast } from './shared/Toast';
import { validators, type FormErrors } from './shared/validators';
import { INDIAN_STATES, BUSINESS_TYPES } from './shared/data';
import { submitLead } from './shared/submitLead';

const SERVICE_OPTIONS = [
  { id: 'UPI Cash Point', icon: Banknote },
  { id: 'Recharge', icon: Smartphone },
  { id: 'Bill Payment', icon: Lightbulb },
  { id: 'Loan Services', icon: Landmark },
  { id: 'Smart Khata', icon: BookText },
  { id: 'Digital QR', icon: QrCode },
];

const EMPTY = {
  fullName: '',
  mobile: '',
  email: '',
  shopName: '',
  businessType: '',
  city: '',
  state: '',
  pincode: '',
};

/** Single source of truth for the form's validity — drives both the errors and the submit button. */
function validateRegistration(v: typeof EMPTY): FormErrors {
  const next: FormErrors = {
    fullName: validators.required(v.fullName, 'Full name'),
    mobile: validators.mobile(v.mobile),
    email: validators.email(v.email),
    shopName: validators.required(v.shopName, 'Shop name'),
    businessType: validators.required(v.businessType, 'Business type'),
    city: validators.required(v.city, 'City'),
    state: validators.required(v.state, 'State'),
    pincode: validators.pin(v.pincode),
  };
  return Object.fromEntries(Object.entries(next).filter(([, msg]) => msg));
}

export default function RegistrationForm() {
  const [values, setValues] = React.useState(EMPTY);
  const [services, setServices] = React.useState<string[]>(['UPI Cash Point', 'Digital QR']);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const notify = useToast();
  const reduce = useReducedMotion();
  const router = useRouter();
  // Belt and braces against a double submit: the button is disabled while
  // sending, and this ref blocks a second call even if one slips past it.
  const inFlight = React.useRef(false);

  React.useEffect(() => {
    router.prefetch('/become-merchant/success');
  }, [router]);

  const errors = React.useMemo(() => validateRegistration(values), [values]);
  const isValid = Object.keys(errors).length === 0;
  // Only surface an error once the field has been visited.
  const shown = (key: keyof typeof EMPTY) => (touched[key] ? errors[key] : undefined);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const blur = (key: keyof typeof EMPTY) => () => setTouched((t) => ({ ...t, [key]: true }));

  const setChoice = (key: 'businessType' | 'state') => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setTouched((t) => ({ ...t, [key]: true }));
  };

  const toggleService = (id: string) =>
    setServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;

    if (!isValid) {
      setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
      const first = Object.keys(errors)[0];
      document.getElementById(`reg-${first}`)?.focus();
      notify({
        tone: 'error',
        title: 'Check the highlighted fields',
        body: 'A few details are still missing.',
      });
      return;
    }

    inFlight.current = true;
    setStatus('sending');

    // Exactly the shape the backend expects for a merchant lead.
    const lead = {
      name: values.fullName.trim(),
      mobile: values.mobile.trim(),
      email: values.email.trim(),
      shopName: values.shopName.trim(),
      businessType: values.businessType,
      city: values.city.trim(),
      state: values.state,
      pinCode: values.pincode.trim(),
      selectedServices: services,
      source: 'Become Merchant Page',
    };

    try {
      await submitLead(lead);
      setStatus('done');
      notify({
        tone: 'success',
        title: 'Merchant lead created',
        body: 'Taking you to your confirmation…',
      });
      setValues(EMPTY);
      setServices([]);
      setTouched({});
      router.push('/become-merchant/success');
    } catch {
      inFlight.current = false;
      setStatus('error');
      notify({
        tone: 'error',
        title: 'Could not submit',
        body: 'Check your connection and try again, or call 1800-000-000.',
      });
    }
  };

  return (
    <section id="register" className="scroll-mt-24 px-5 py-16 sm:px-8 lg:py-20" aria-labelledby="register-heading">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <GlassCard hover={false} className="p-7 sm:p-10">
            <>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#3F5EF7]/10 px-3 py-1 text-xs font-semibold text-[#3F5EF7]">
                  Free registration
                </span>
                <h2 id="register-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
                  Register your shop
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Fill this once. Our team handles the rest and calls you for KYC.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="reg-fullName" label="Full name" autoComplete="name" value={values.fullName} onChange={set('fullName')} onBlur={blur('fullName')} error={shown('fullName')} />
                    <Field id="reg-mobile" label="Mobile number" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" value={values.mobile} onChange={set('mobile')} onBlur={blur('mobile')} error={shown('mobile')} />
                    <Field id="reg-email" label="Email address (optional)" type="email" autoComplete="email" value={values.email} onChange={set('email')} onBlur={blur('email')} error={shown('email')} />
                    <Field id="reg-shopName" label="Shop name" autoComplete="organization" value={values.shopName} onChange={set('shopName')} onBlur={blur('shopName')} error={shown('shopName')} />
                  </div>

                  <Dropdown
                    id="reg-businessType"
                    label="Business type"
                    options={BUSINESS_TYPES}
                    value={values.businessType}
                    onChange={setChoice('businessType')}
                    onBlur={blur('businessType')}
                    error={shown('businessType')}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="reg-city" label="City" autoComplete="address-level2" value={values.city} onChange={set('city')} onBlur={blur('city')} error={shown('city')} />
                    <Dropdown
                      id="reg-state"
                      label="State"
                      options={INDIAN_STATES}
                      value={values.state}
                      onChange={setChoice('state')}
                      onBlur={blur('state')}
                      error={shown('state')}
                    />
                  </div>

                  <Field id="reg-pincode" label="PIN code" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={values.pincode} onChange={set('pincode')} onBlur={blur('pincode')} error={shown('pincode')} />

                  <fieldset className="pt-2">
                    <legend className="text-sm font-bold tracking-tight text-[#0B1020] dark:text-white">
                      Services you want to offer
                    </legend>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Pick any number. You can switch services on or off later from the app.
                    </p>
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {SERVICE_OPTIONS.map((s) => {
                        const Icon = s.icon;
                        const on = services.includes(s.id);
                        return (
                          <motion.label
                            key={s.id}
                            whileTap={reduce ? undefined : { scale: 0.98 }}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all duration-200',
                              on
                                ? 'border-[#3F5EF7] bg-[#F5F8FF] text-[#1B2A8A] shadow-[0_10px_26px_-18px_rgba(63,94,247,0.9)] dark:bg-[#3F5EF7]/15 dark:text-white'
                                : 'border-slate-200 text-slate-600 hover:border-[#3F5EF7]/40 dark:border-white/10 dark:text-slate-300',
                            )}
                          >
                            <input type="checkbox" checked={on} onChange={() => toggleService(s.id)} className="peer sr-only" />
                            <span
                              aria-hidden
                              className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[#3F5EF7] peer-focus-visible:ring-offset-2',
                                on ? 'border-[#3F5EF7] bg-[#3F5EF7] text-white' : 'border-slate-300 dark:border-white/20',
                              )}
                            >
                              <AnimatePresence>
                                {on && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </span>
                            <Icon className="h-4 w-4 text-[#3F5EF7]" aria-hidden />
                            {s.id}
                          </motion.label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {status === 'error' && (
                    <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                      We could not submit your registration. Please try again, or call 1800-000-000.
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!isValid || status === 'sending' || status === 'done'}
                    className="mt-2 w-full"
                  >
                    {status === 'sending' || status === 'done' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        {status === 'done' ? 'Redirecting' : 'Submitting'}
                      </>
                    ) : (
                      'Get started'
                    )}
                  </Button>
                  <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {isValid
                      ? 'No joining fee. No monthly rental. Cancel any time.'
                      : 'Fill in your details above to continue.'}
                  </p>
                </form>
            </>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}