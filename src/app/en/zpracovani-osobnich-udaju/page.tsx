import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HtmlLangSetter from "@/components/HtmlLangSetter";
import { withBasePath } from "@/lib/basePath";
import { getNews } from "@/lib/notion";
import { V } from "@/generated/variables";

export const metadata: Metadata = {
  title: "Personal Data Processing",
  description: "What personal data we process from the contact form, why, and what rights you have.",
  alternates: {
    canonical: `${V.SITE_URL}/en/zpracovani-osobnich-udaju`,
    languages: { cs: `${V.SITE_URL}/zpracovani-osobnich-udaju`, en: `${V.SITE_URL}/en/zpracovani-osobnich-udaju` },
  },
  openGraph: { locale: "en_US" },
};

// English mirror of the Czech page — keep both in sync when the underlying
// contact form behaviour changes (see the Czech file for the longer note).
const SECTIONS = [
  {
    heading: "Who is the data controller",
    body: (
      <>
        <p>
          The data controller is the operator of Roubenka Ořechovka, {V.ADRESA_RADEK_1} — {V.ADRESA_RADEK_2}, email{" "}
          <a href={`mailto:${V.KONTAKT_EMAIL}`} className="font-semibold text-brand hover:underline">
            {V.KONTAKT_EMAIL}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    heading: "What data we process",
    body: (
      <>
        <p>Through the contact form on the Contact page we may collect:</p>
        <ul className="list-disc pl-5">
          <li>your full name,</li>
          <li>email address,</li>
          <li>phone number (optional),</li>
          <li>the subject and content of your message.</li>
        </ul>
        <p>We don't collect any other personal data through the website.</p>
      </>
    ),
  },
  {
    heading: "How the form technically works",
    body: (
      <>
        <p>
          The contact form doesn't send anything to our server or to any database. Clicking &ldquo;Send message&rdquo;
          opens your own email client on your device with a pre-filled message addressed to {V.KONTAKT_EMAIL} — you
          then send the email yourself, just like any other email. The website itself never stores the data you
          enter; processing only begins once the email arrives in our inbox, where we handle it like any regular
          email correspondence.
        </p>
      </>
    ),
  },
  {
    heading: "Why we process the data and on what legal basis",
    body: (
      <>
        <p>
          The purpose is to reply to your enquiry and, if needed, continue the conversation about your stay. The
          legal basis is your consent, given by ticking the checkbox before submitting the form. You can withdraw
          your consent at any time — just write to us at {V.KONTAKT_EMAIL}.
        </p>
        <p>
          Booking a stay doesn't happen through this website — it's handled exclusively via Booking.com, which has
          its own privacy policy.
        </p>
      </>
    ),
  },
  {
    heading: "How long we keep the data",
    body: (
      <>
        <p>
          We keep emails from the contact form only for as long as necessary to handle your enquiry and any
          follow-up communication, for no longer than 2 years after the last contact, unless there's a reason to
          keep it longer (e.g. an ongoing arrangement about your stay).
        </p>
      </>
    ),
  },
  {
    heading: "Cookies and third-party services",
    body: (
      <>
        <p>The website itself doesn't use any cookies for tracking visitors, nor any analytics tools.</p>
        <p>Some pages embed third-party services that may process technical data (e.g. your IP address) under their own policies:</p>
        <ul className="list-disc pl-5">
          <li>Google Maps — the map showing the cabin's location,</li>
          <li>an external webcam feed (holidayinfo.cz) — a live view of the area,</li>
          <li>Booking.com — the booking system.</li>
        </ul>
      </>
    ),
  },
  {
    heading: "Your rights",
    body: (
      <>
        <p>In connection with the processing of your personal data, you have the right to:</p>
        <ul className="list-disc pl-5">
          <li>access your personal data,</li>
          <li>have inaccurate data corrected,</li>
          <li>have your data erased,</li>
          <li>restrict processing,</li>
          <li>data portability,</li>
          <li>withdraw your consent at any time,</li>
          <li>lodge a complaint with the Czech Office for Personal Data Protection (uoou.cz).</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href={`mailto:${V.KONTAKT_EMAIL}`} className="font-semibold text-brand hover:underline">
            {V.KONTAKT_EMAIL}
          </a>
          .
        </p>
      </>
    ),
  },
];

export default async function PersonalDataProcessingPageEn() {
  const news = await getNews();

  return (
    <>
      <HtmlLangSetter lang="en" />
      <Navbar hasNews={news.length > 0} locale="en" />
      <main>
        <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
          <Image
            src={withBasePath("/images/hero-facade.jpg")}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_50%] [filter:sepia(0.12)_saturate(1.04)]"
          />
          <div className="absolute inset-0 bg-[#2a1c12]/55" />
          <div className="relative z-10 flex flex-col items-center gap-3 px-6">
            <h1 className="font-serif text-[32px] font-bold text-white sm:text-[44px]">Personal Data Processing</h1>
            <p className="max-w-xl text-[16px] font-medium text-cream sm:text-[18px]">
              What data we process from the contact form, and what rights you have.
            </p>
          </div>
        </section>

        <section className="bg-cream px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-24">
          <div className="mx-auto max-w-[760px]">
            <p className="text-[13px] font-medium text-clay">Last updated: 23 September 2026</p>

            <div className="mt-10 flex flex-col gap-10">
              {SECTIONS.map((section) => (
                <div key={section.heading}>
                  <h2 className="font-subhead text-[20px] font-bold text-ink sm:text-[22px]">{section.heading}</h2>
                  <div className="mt-3 flex flex-col gap-3 text-[15px] leading-[1.7] text-clay">{section.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale="en" />
    </>
  );
}
