"use client";

import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const contactDetails = [
  { icon: Phone, label: "Phone", value: "+91 00000 00000" },
  { icon: Mail, label: "Email", value: "support@cashlo.in" },
  { icon: MapPin, label: "Office", value: "Gurugram, Haryana, India" },
];

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
      </svg>
    );
  }
  function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.57h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.94-1.79-2.94-1.8 0-2.08 1.4-2.08 2.85V21h-4V9.5Z" />
      </svg>
    );
  }
  function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.49 20.5 12 20.5 12 20.5s7.51 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
      </svg>
    );
  }

  const socials = [
    { icon: FacebookIcon, href: "#", label: "Facebook" },
    { icon: InstagramIcon, href: "#", label: "Instagram" },
    { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
    { icon: YoutubeIcon, href: "#", label: "YouTube" },
  ];

type Status = "idle" | "submitting" | "sent";

export default function ContactSection() {
  const scope = useScrollReveal();
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    // TODO: wire this up once the Cashlo backend contact API exists.
    // Example once ready:
    // await fetch("/api/contact", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });

    await new Promise((r) => setTimeout(r, 800)); // fake latency for now
    setStatus("sent");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  return (
    <section ref={scope} className="bg-surface py-20 sm:py-24">
      <Container className="grid gap-12 sm:grid-cols-2 sm:gap-16">
        {/* Left: contact info */}
        <div data-reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Get in Touch
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Talk to Our Team
          </h2>
          <p className="mt-4 max-w-sm text-ink/60">
            Whether you&apos;re a customer, a merchant, or just curious about
            Cashlo — we&apos;re here to help.
          </p>

          <div className="mt-8 space-y-5">
            {contactDetails.map((c) => (
              <div key={c.label} className="flex items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-ink/50">{c.label}</p>
                  <p className="text-sm font-medium text-ink">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-ink/60 transition-colors hover:border-brand hover:text-brand"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div data-reveal>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="name" className="text-sm font-medium text-ink">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand"
                  placeholder="Your name"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="phone" className="text-sm font-medium text-ink">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand"
                  placeholder="+91 00000 00000"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand"
                  placeholder="you@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="subject" className="text-sm font-medium text-ink">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand"
                  placeholder="How can we help?"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="text-sm font-medium text-ink">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="mt-1.5 w-full resize-none rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand"
                  placeholder="Tell us more..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-6 w-full rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>

            {status === "sent" && (
              <p className="mt-3 text-center text-sm text-brand">
                Thanks! We&apos;ll get back to you shortly.
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}