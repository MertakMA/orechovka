"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Send } from "lucide-react";
import { V } from "@/generated/variables";

const inputClass =
  "w-full rounded-md border border-border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-clay/60 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMPTY_FORM: FormState = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange =
    (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  // TODO: nahradit skutečným odesláním (např. API route + e-mailová služba).
  // Zatím formulář sestaví e-mail a otevře poštovního klienta uživatele.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Vyplňte prosím všechna povinná pole.");
      setSubmitted(false);
      return;
    }
    if (!agreed) {
      setError("Pro odeslání je potřeba souhlasit se zpracováním osobních údajů.");
      setSubmitted(false);
      return;
    }
    setError(null);

    const body = `Jméno: ${form.name}\nE-mail: ${form.email}\nTelefon: ${form.phone || "neuvedeno"}\n\n${form.message}`;
    const mailto = `mailto:${V.KONTAKT_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-ink">Jméno a příjmení</label>
          <input
            required
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Vaše jméno a příjmení"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-ink">E-mail</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="vas@email.cz"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">Telefon (nepovinné)</label>
        <input
          type="tel"
          value={form.phone}
          onChange={handleChange("phone")}
          placeholder={V.KONTAKT_TELEFON}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">Předmět zprávy</label>
        <input
          required
          value={form.subject}
          onChange={handleChange("subject")}
          placeholder="O čem chcete psát?"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-ink">Zpráva</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={handleChange("message")}
          placeholder="Vaše zpráva..."
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
        Souhlasím se zpracováním osobních údajů pro účely odpovědi.
      </label>

      {error && <p className="text-[13px] text-live">{error}</p>}
      {submitted && !error && (
        <p className="text-[13px] text-brand">
          Otevřel se váš e-mailový klient s předvyplněnou zprávou. Pokud se nic neotevřelo, napište nám prosím přímo
          na {V.KONTAKT_EMAIL}.
        </p>
      )}

      <button
        type="submit"
        className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-brand px-8 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-light"
      >
        <Send className="size-4" aria-hidden />
        Odeslat zprávu
      </button>
    </form>
  );
}
