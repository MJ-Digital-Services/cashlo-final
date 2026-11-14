'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './shared/tokens';
import { Field } from './shared/Field';
import { Dropdown } from './shared/Dropdown';
import { Button } from './shared/Button';
import { useLeadSuccess, type LeadSuccess } from './shared/LeadSuccess';
import { useToast } from './shared/Toast';
import { validators, type FormErrors } from './shared/validators';
import { INDIAN_STATES } from './shared/data';
import { submitLead } from './shared/submitLead';

export type FormKind = 'sales' | 'distributor';

const FORM_CONFIG = {
  sales: {
    formType: 'Contact sales',
    submitLabel: 'Request callback',
    errorBody: 'Please try again in a moment.',
    success: (mobile: string): LeadSuccess => ({
      title: 'Callback requested',
      message: `A Cashlo sales executive will call you on ${mobile}, usually within 30 minutes during business hours.`,
      steps: [
        { title: 'We call you back', body: 'A sales executive calls you on the number you shared.' },
        { title: 'Pick your services', body: 'They walk you through the services that suit your shop.' },
        { title: 'Get set up', body: 'We help you finish registration and KYC.' },
      ],
    }),
  },
  distributor: {
    formType: 'Find a distributor',
    submitLabel: 'Connect now',
    errorBody: 'Please try again in a moment.',
    success: (mobile: string): LeadSuccess => ({
      title: 'Request received',
      message: `We are finding the nearest Cashlo distributor for your PIN code. Their details will reach you on WhatsApp at ${mobile} shortly.`,
      steps: [
        { title: 'We match your PIN code', body: 'We find the Cashlo distributor closest to your shop.' },
        { title: 'Details on WhatsApp', body: 'You get the distributor’s name and number.' },
        { title: 'Get onboarded', body: 'Your distributor helps you set up and start earning.' },
      ],
    }),
  },
} as const;

const EMPTY = { fullName: '', mobile: '', email: '', shopName: '', city: '', state: '', pincode: '' };

/** 9876543210 → "+91 98765 43210", with non-breaking spaces so it never wraps mid-number */
const formatMobile = (m: string) => `+91 ${m.slice(0, 5)} ${m.slice(5)}`;

export default function LeadForm({
  kind,
  compact = false,
  onSuccess,
}: {
  kind: FormKind;
  compact?: boolean;
  /** Runs once the lead is sent, before the confirmation dialog opens (LeadModal closes itself here). */
  onSuccess?: () => void;
}) {
  const config = FORM_CONFIG[kind];
  const [values, setValues] = React.useState<Record<string, string>>(EMPTY);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'error'>('idle');
  const honeyRef = React.useRef<HTMLInputElement>(null);
  const notify = useToast();
  const showSuccess = useLeadSuccess();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((err) => (err[key] ? { ...err, [key]: '' } : err));
  };

  const validate = () => {
    const next: FormErrors = {
      fullName: validators.required(values.fullName, 'Full name'),
      mobile: validators.mobile(values.mobile),
      email: validators.email(values.email),
      shopName: validators.required(values.shopName, 'Shop name'),
    };
    if (kind === 'sales') {
      next.city = validators.required(values.city, 'City');
      next.state = validators.required(values.state, 'State');
    } else {
      next.pincode = validators.pin(values.pincode);
    }
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(cleaned);
    return Object.keys(cleaned).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending' || !validate()) return;
    setStatus('sending');
    try {
      const v = Object.fromEntries(Object.entries(values).map(([k, val]) => [k, val.trim()]));
      await submitLead({
        subject: `New Cashlo lead: ${config.formType} (${v.fullName})`,
        fields: {
          'Form': config.formType,
          'Name': v.fullName,
          'Mobile': v.mobile,
          'Email': v.email,
          'Shop name': v.shopName,
          ...(kind === 'sales' ? { 'City': v.city, 'State': v.state } : { 'PIN code': v.pincode }),
        },
        replyTo: v.email,
        honey: honeyRef.current?.value,
      });
      setValues(EMPTY);
      setErrors({});
      setStatus('idle');
      onSuccess?.();
      showSuccess(config.success(formatMobile(v.mobile)));
    } catch {
      setStatus('error');
      notify({ tone: 'error', title: 'Could not send your request', body: config.errorBody });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* honeypot: hidden from people, filled in by bots (FormSubmit drops those leads) */}
      <input ref={honeyRef} type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
        <Field
          id={`${kind}-name`}
          label="Full name"
          autoComplete="name"
          value={values.fullName}
          onChange={set('fullName')}
          error={errors.fullName}
        />
        <Field
          id={`${kind}-mobile`}
          label="Mobile number"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel-national"
          value={values.mobile}
          onChange={set('mobile')}
          error={errors.mobile}
        />
      </div>
      <Field
        id={`${kind}-email`}
        label="Email address (optional)"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={set('email')}
        error={errors.email}
      />
      <Field
        id={`${kind}-shop`}
        label="Shop name"
        autoComplete="organization"
        value={values.shopName}
        onChange={set('shopName')}
        error={errors.shopName}
      />

      {kind === 'sales' ? (
        <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
          <Field
            id="sales-city"
            label="City"
            autoComplete="address-level2"
            value={values.city}
            onChange={set('city')}
            error={errors.city}
          />
          <Dropdown
            id="sales-state"
            label="State"
            options={INDIAN_STATES}
            value={values.state}
            onChange={(state) => {
              setValues((v) => ({ ...v, state }));
              setErrors((err) => (err.state ? { ...err, state: '' } : err));
            }}
            error={errors.state}
          />
        </div>
      ) : (
        <Field
          id="distributor-pin"
          label="PIN code"
          inputMode="numeric"
          maxLength={6}
          autoComplete="postal-code"
          value={values.pincode}
          onChange={set('pincode')}
          error={errors.pincode}
        />
      )}

      {status === 'error' && (
        <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          We could not send your request. Check your connection and try again, or call 1800-000-000.
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === 'sending'} className="w-full">
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending
          </>
        ) : (
          config.submitLabel
        )}
      </Button>
      <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        By submitting you agree to be contacted by Cashlo about merchant onboarding.
      </p>
    </form>
  );
}