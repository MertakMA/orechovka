"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { texty, type Locale } from "@/lib/texty";

// Web3Forms zprávu z formuláře doručí e-mailem na adresu, na kterou je klíč
// založený (roubenkaorechovka@email.cz). Klíč je veřejný už z podstaty —
// posílá se z prohlížeče, takže nejde o tajemství.
const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "98aba21e-70d4-49b7-86fe-45808ab69288";

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

// Souhlas v Notionu: "Souhlasím se [zpracováním osobních údajů] pro účely odpovědi."
// — část v hranatých závorkách se stane odkazem na stránku o osobních údajích.
function Consent({ text, href }: { text: string; href: string }) {
  const match = text.match(/^([\s\S]*?)\[([\s\S]+?)\]([\s\S]*)$/);
  if (!match) return <>{text}</>;
  const [, before, link, after] = match;
  return (
    <span>
      {before}
      <Link href={href} target="_blank" className="font-semibold text-brand hover:underline">
        {link}
      </Link>
      {after}
    </span>
  );
}

export default function ContactForm({ locale = "cs" }: { locale?: Locale }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const k = texty("kontakt", locale);

  // Povinná pole se nedají skrýt (formulář by pak nešel odeslat), proto vzdy/polozka bez Skrýt.
  const field = (id: string) => ({ label: k.vzdy(id), placeholder: k.polozka(id)?.p ?? "" });
  const name = field("formular.jmeno");
  const email = field("formular.email");
  const subject = field("formular.predmet");
  const message = field("formular.zprava");
  const phone = k.polozka("formular.telefon");

  const handleChange =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSubmitted(false);
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError(k.vzdy("formular.chyba-povinne"));
      return;
    }
    if (!agreed) {
      setError(k.vzdy("formular.chyba-souhlas"));
      return;
    }
    setError(null);
    setSending(true);

    try {
      const response = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          from_name: "Web Roubenka Ořechovka",
          subject: form.subject,
          name: form.name,
          email: form.email,
          phone: form.phone || "–",
          message: form.message,
          language: locale === "cs" ? "čeština" : "angličtina",
          // Past na roboty: skryté pole, které člověk nevyplní.
          botcheck: (new FormData(e.currentTarget).get("botcheck") as string) || "",
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setForm(EMPTY_FORM);
      setAgreed(false);
      setSubmitted(true);
    } catch {
      setError(k.vzdy("formular.chyba-odeslani"));
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-ink">{name.label}</label>
          <input
            required
            value={form.name}
            onChange={handleChange("name")}
            placeholder={name.placeholder}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-ink">{email.label}</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder={email.placeholder}
            className={inputClass}
          />
        </div>
      </div>

      {phone && (
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-ink">{phone.t}</label>
          <input
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder={phone.p ?? ""}
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">{subject.label}</label>
        <input
          required
          value={form.subject}
          onChange={handleChange("subject")}
          placeholder={subject.placeholder}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">{message.label}</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={handleChange("message")}
          placeholder={message.placeholder}
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
        <Consent
          text={k.vzdy("formular.souhlas")}
          href={locale === "cs" ? "/zpracovani-osobnich-udaju" : "/en/zpracovani-osobnich-udaju"}
        />
      </label>

      {error && <p className="text-[13px] text-live">{error}</p>}
      {submitted && !error && (
        <p role="status" className="text-[13px] text-brand">
          {k.vzdy("formular.uspech")}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-brand px-8 py-3 text-[15px] font-semibold text-cream transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
      >
        <Send className="size-4" aria-hidden />
        {sending ? k.vzdy("formular.odesilani") : k.vzdy("formular.odeslat")}
      </button>
    </form>
  );
}
