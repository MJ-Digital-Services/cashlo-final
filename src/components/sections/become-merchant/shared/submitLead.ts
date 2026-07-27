export type LeadPayload = Record<string, unknown>;

/** Posts to /api/leads. Swap the endpoint for your CRM webhook. */
export async function submitLead(payload: LeadPayload) {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Could not send your request');
  return res.json().catch(() => ({}));
}