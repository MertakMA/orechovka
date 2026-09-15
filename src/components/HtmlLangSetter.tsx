"use client";

import { useEffect } from "react";

// Root layout (src/app/layout.tsx) definuje jediný <html> tag pro celý web
// a natvrdo mu nastavuje lang="cs" — Next.js App Router nedovoluje mít
// druhý <html>/<body> v vnořeném layoutu. Anglické stránky proto lang
// opraví takhle na klientovi, hned po připojení.
export default function HtmlLangSetter({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "cs";
    };
  }, [lang]);

  return null;
}
