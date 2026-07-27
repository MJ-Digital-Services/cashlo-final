'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './shared/tokens';
import { Field } from './shared/Field';
import { Dropdown } from './shared/Dropdown';
import { Button } from './shared/Button';
import { SuccessState } from './shared/SuccessState';
import { useToast } from './shared/Toast';
import { validators, type FormErrors } from './shared/validators';
import { INDIAN_STATES } from './shared/data';
import { submitLead } from './shared/submitLead';

export type FormKind = 'sales' | 'distributor';

const FORM_CONFIG = {
  sales: {
    formType: 'contact-sales',
    submitLabel: 'Request callback',
    successTitle: 'Callback requested',
    successMessage:
      'A Cashlo sales executive will call you on the number you shared, usually within 30 minutes during business hours.',
    toastBody: 'We will call you within 30 minutes.',
  },
  distributor: {
    formType: 'contact-distributor',
    submitLabel: 'Connect now',
    successTitle: 'Distributor matched',
    successMessage:
      'We are locating the nearest Cashlo distributor for your PIN code. You will get their details on WhatsApp shortly.',
    toastBody: 'Distributor details are on the way.',
  },
} as const;

export default function LeadForm({ kind, compact = false }: { kind: FormKind; compact?: boolean }) {
  const config = FORM_CONFIG[kind];
  const [values, setValues] = React.useState<Record<string, string>>({
    fullName: '',
    mobile: '',
    email: '',
    shopName: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const notify = useToast();

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
    if (!validate()) return;
    setStatus('sending');
    try {
      await submitLead({ ...values, formType: config.formType });
      setStatus('done');
      notify({ tone: 'success', title: config.successTitle, body: config.toastBody });
    } catch {
      setStatus('error');
      notify({ tone: 'error', title: 'Could not send your request', body: 'Please try again in a moment.' });
    }
  };

  const reset = () => {
    setValues({
      fullName: '', mobile: '', email: '', shopName: '', city: '', state: '', pincode: '',
    });
    setErrors({});
    setStatus('idle');
  };

  if (status === 'done') {
    return (
      <SuccessState
        title={config.successTitle}
        message={config.successMessage}
        onReset={reset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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