"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { V } from "@/generated/variables";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-clay/60 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMPTY_FORM: FormState = { name: "", email: "", phone: "", subject: "", message: "" };

type Locale = "cs" | "en";

const TEXT: Record<
  Locale,
  {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    consent: ReactNode;
    submit: string;
    errorRequired: string;
    errorConsent: string;
    success: string;
    notProvided: string;
    mailName: string;
    mailPhone: string;
  }
> = {
  cs: {
    nameLabel: "Jméno a příjmení",
    namePlaceholder: "Vaše jméno a příjmení",
    emailLabel: "E-mail",
    emailPlaceholder: "vas@email.cz",
    phoneLabel: "Telefon (nepovinné)",
    subjectLabel: "Předmět zprávy",
    subjectPlaceholder: "O čem chcete psát?",
    messageLabel: "Zpráva",
    messagePlaceholder: "Vaše zpráva...",
    consent: (
      <>
        Souhlasím se{" "}
        <Link href="/zpracovani-osobnich-udaju" target="_blank" className="font-semibold text-brand hover:underline">
          zpracováním osobních údajů
        </Link>{" "}
        pro účely odpovědi.
      </>
    ),
    submit: "Odeslat zprávu",
    errorRequired: "Vyplňte prosím všechna povinná pole.",
    errorConsent: "Pro odeslání je potřeba souhlasit se zpracováním osobních údajů.",
    success: "Otevřel se váš e-mailový klient s předvyplněnou zprávou. Pokud se nic neotevřelo, napište nám prosím přímo na",
    notProvided: "neuvedeno",
    mailName: "Jméno",
    mailPhone: "Telefon",
  },
  en: {
    nameLabel: "Full name",
    namePlaceholder: "Your full name",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    phoneLabel: "Phone (optional)",
    subjectLabel: "Subject",
    subjectPlaceholder: "What's this about?",
    messageLabel: "Message",
    messagePlaceholder: "Your message...",
    consent: (
      <>
        I agree to the{" "}
        <Link
          href="/en/zpracovani-osobnich-udaju"
          target="_blank"
          className="font-semibold text-brand hover:underline"
        >
          processing of my personal data
        </Link>{" "}
        for the purpose of a reply.
      </>
    ),
    submit: "Send message",
    errorRequired: "Please fill in all required fields.",
    errorConsent: "You need to agree to the processing of personal data before sending.",
    success: "Your email client should have opened with a pre-filled message. If nothing opened, please write to us directly at",
    notProvided: "not provided",
    mailName: "Name",
    mailPhone: "Phone",
  },
};

export default function ContactForm({ locale = "cs" }: { locale?: Locale }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const t = TEXT[locale];

  const handleChange =
    (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  // TODO: nahradit skutečným odesláním (např. API route + e-mailová služba).
  // Zatím formulář sestaví e-mail a otevře poštovního klienta uživatele.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError(t.errorRequired);
      setSubmitted(false);
      return;
    }
    if (!agreed) {
      setError(t.errorConsent);
      setSubmitted(false);
      return;
    }
    setError(null);

    const body = `${t.mailName}: ${form.name}\n${t.mailPhone}: ${form.phone || t.notProvided}\n\n${form.message}`;
    const mailto = `mailto:${V.KONTAKT_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-ink">{t.nameLabel}</label>
          <input
            required
            value={form.name}
            onChange={handleChange("name")}
            placeholder={t.namePlaceholder}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-ink">{t.emailLabel}</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder={t.emailPlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">{t.phoneLabel}</label>
        <input
          type="tel"
          value={form.phone}
          onChange={handleChange("phone")}
          placeholder={V.KONTAKT_TELEFON}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">{t.subjectLabel}</label>
        <input
          required
          value={form.subject}
          onChange={handleChange("subject")}
          placeholder={t.subjectPlaceholder}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">{t.messageLabel}</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={handleChange("message")}
          placeholder={t.messagePlaceholder}
          className={inputClass}
        />
      </div>

      <label className="flex items-start gap-3 text-[13px] text-clay">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded-[3px] border-border text-brand focus:ring-brand"
        />
        {t.consent}
      </label>

      {error && <p className="text-[13px] text-live">{error}</p>}
      {submitted && !error && (
        <p className="text-[13px] text-brand">
          {t.success} {V.KONTAKT_EMAIL}.
        </p>
      )}

      <button
        type="submit"
        className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-brand px-8 py-3 text-[15px] font-semibold text-cream transition-colors hover:bg-brand-dark"
      >
        <Send className="size-4" aria-hidden />
        {t.submit}
      </button>
    </form>
  );
}
