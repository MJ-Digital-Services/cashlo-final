/*
 * Lead delivery: every lead form (the callback / distributor forms and the
 * shop registration form) is emailed to the Cashlo team through FormSubmit
 * (https://formsubmit.co) — no backend needed.
 *
 * FormSubmit activation: the very first submission to a new address sends
 * a one-time "confirm your form" email to that inbox, and nothing is
 * delivered until it's confirmed. After confirming, FormSubmit shows a
 * random alias (e.g. https://formsubmit.co/ajax/a1b2c3…) — put that in
 * NEXT_PUBLIC_LEADS_ENDPOINT so the real address isn't in the page source.
 */
const LEADS_ENDPOINT =
  process.env.NEXT_PUBLIC_LEADS_ENDPOINT ?? 'https://formsubmit.co/ajax/harender@cashlo.app';

export type LeadSubmission = {
  /** Email subject line. */
  subject: string;
  /** Rows of the email table, label → value. Empty values are left out. */
  fields: Record<string, string | string[] | undefined>;
  /** Lead's own email, so "Reply" in the inbox goes straight to them. */
  replyTo?: string;
  /** Hidden honeypot input's value; bots fill it, FormSubmit then drops the lead. */
  honey?: string;
};

export async function submitLead({ subject, fields, replyTo, honey }: LeadSubmission) {
  const rows: Record<string, string> = {};
  for (const [label, value] of Object.entries(fields)) {
    const text = Array.isArray(value) ? value.join(', ') : value?.trim();
    if (text) rows[label] = text;
  }
  rows['Page'] = window.location.origin + window.location.pathname;

  const res = await fetch(LEADS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...rows,
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      ...(replyTo?.trim() ? { _replyto: replyTo.trim() } : {}),
      _honey: honey ?? '',
    }),
  });

  // FormSubmit answers 200 with { success: "false", message } for some
  // failures, so the status code alone isn't enough.
  const data = (await res.json().catch(() => ({}))) as { success?: boolean | string; message?: string };
  if (!res.ok || String(data.success) !== 'true') {
    throw new Error(data.message || 'Could not send your request');
  }
  return data;
}
