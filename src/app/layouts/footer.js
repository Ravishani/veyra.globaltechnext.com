"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconArrowUpRight,
  IconChevronDown,
  IconChevronRight,
  IconGlobe,
  IconMail,
  IconShieldCheck,
  IconTrendingUp,
} from "@tabler/icons-react";

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
];

const tools = [
  { label: "Currency Converter", href: "/currency-converter" },
  { label: "Exchange Rates", href: "/exchange-rates" },
  { label: "Currency Charts", href: "/currency-charts" },
  { label: "Popular Currencies", href: "/popular-currencies" },
  { label: "Currency News", href: "/currency-news" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  const [currency, setCurrency] = useState("USD");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const selectedCurrency =
    currencies.find((item) => item.code === currency) || currencies[0];

  return (
    <footer className="relative overflow-hidden bg-[#211f1a] text-white">
      <div className="pointer-events-none absolute -left-56 -top-56 h-[600px] w-[600px] rounded-full bg-[var(--primary)]/[0.07] blur-[140px]" />

      <div className="pointer-events-none absolute -bottom-64 -right-56 h-[620px] w-[620px] rounded-full bg-white/[0.025] blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-10 sm:py-14 lg:py-16">
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-[var(--primary)]/[0.08] blur-[70px]" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-[680px]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />

                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--primary)]">
                    Currency conversion
                  </span>
                </div>

                <h2 className="mt-3 max-w-[650px] text-[27px] font-black leading-[1.15] tracking-[-0.025em] text-white sm:text-[33px] lg:text-[38px]">
                  Convert currencies with confidence.
                </h2>

                <p className="mt-4 max-w-[590px] text-[13px] leading-7 tracking-[0.035em] text-white/40 sm:text-[14px]">
                  Check exchange rates, compare currencies and convert your
                  money using simple and reliable currency tools.
                </p>
              </div>

              <Link
                href="/currency-converter"
                className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-[var(--primary-hover)] sm:h-[52px] sm:px-7"
              >
                Open Converter

                <IconArrowUpRight
                  size={15}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.08] py-12 sm:py-14 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-14">
            <div>
              <Link href="/" className="group inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-[var(--primary)] text-[17px] font-black tracking-[-0.03em] shadow-[0_12px_35px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:-translate-y-0.5">
                  FX
                </span>

                <div>
                  <div className="text-[20px] font-black leading-none tracking-[-0.02em]">
                    Exchange
                  </div>

                  <div className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.27em] text-white/30">
                    Currency platform
                  </div>
                </div>
              </Link>

              <p className="mt-7 max-w-[420px] text-[14px] leading-7 tracking-[0.035em] text-white/40">
                Your simple destination for currency conversion, exchange
                rates and global currency information.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3.5 py-2.5">
                  <IconTrendingUp
                    size={14}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[10px] font-bold tracking-[0.06em] text-white/55">
                    Exchange Rates
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3.5 py-2.5">
                  <IconGlobe
                    size={14}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[10px] font-bold tracking-[0.06em] text-white/55">
                    Global Currencies
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3.5 py-2.5">
                  <IconShieldCheck
                    size={14}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[10px] font-bold tracking-[0.06em] text-white/55">
                    Reliable Tools
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--primary)]">
                Explore
              </p>

              <h3 className="mt-2.5 text-[19px] font-black tracking-[-0.015em] text-white">
                Currency tools
              </h3>

              <div className="mt-6 space-y-1">
                {tools.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center rounded-xl px-2 py-2.5 transition hover:bg-white/[0.045]"
                  >
                    <span className="text-[12px] font-semibold tracking-[0.04em] text-white/45 transition group-hover:text-white">
                      {item.label}
                    </span>

                    <IconChevronRight
                      size={14}
                      className="ml-auto text-white/10 transition-all group-hover:translate-x-1 group-hover:text-[var(--primary)]"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--primary)]">
                Company
              </p>

              <h3 className="mt-2.5 text-[19px] font-black tracking-[-0.015em] text-white">
                Information
              </h3>

              <div className="mt-6 space-y-1">
                {companyLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center rounded-xl px-2 py-2.5 transition hover:bg-white/[0.045]"
                  >
                    <span className="text-[12px] font-semibold tracking-[0.04em] text-white/45 transition group-hover:text-white">
                      {item.label}
                    </span>

                    <IconChevronRight
                      size={14}
                      className="ml-auto text-white/10 transition-all group-hover:translate-x-1 group-hover:text-[var(--primary)]"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--primary)]">
                Stay updated
              </p>

              <h3 className="mt-2.5 text-[19px] font-black tracking-[-0.015em] text-white">
                Market updates
              </h3>

              <p className="mt-4 text-[12px] leading-6 tracking-[0.04em] text-white/35">
                Stay informed about exchange-rate movements and global
                currency markets.
              </p>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/[0.10]">
                  <IconMail
                    size={16}
                    className="text-[var(--primary)]"
                  />
                </span>

                <div>
                  <p className="text-[11px] font-black tracking-[0.06em] text-white/70">
                    Currency insights
                  </p>

                  <p className="mt-1 text-[9px] leading-5 tracking-[0.035em] text-white/25">
                    Explore rates and market information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.08] py-7 sm:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[520px]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />

                <p className="text-[10px] font-black uppercase tracking-[0.23em] text-white/35">
                  Preferred currency
                </p>
              </div>

              <p className="mt-2 text-[11px] leading-5 tracking-[0.035em] text-white/25">
                Select your preferred currency for your experience.
              </p>
            </div>

            <div className="relative w-full sm:w-[290px]">
              <button
                type="button"
                onClick={() => setCurrencyOpen((prev) => !prev)}
                className="group flex h-[58px] w-full items-center justify-between rounded-2xl border border-white/[0.09] bg-white/[0.045] px-4 transition hover:border-[var(--primary)]/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-[19px]">
                    {selectedCurrency.flag}
                  </span>

                  <div className="text-left">
                    <p className="text-[12px] font-black tracking-[0.09em] text-white">
                      {selectedCurrency.code}
                    </p>

                    <p className="mt-0.5 text-[9px] tracking-[0.035em] text-white/30">
                      {selectedCurrency.name}
                    </p>
                  </div>
                </div>

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                  <IconChevronDown
                    size={15}
                    className={`text-white/35 transition-transform duration-200 ${
                      currencyOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {currencyOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close currency selector"
                    onClick={() => setCurrencyOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />

                  <div className="currency-scrollbar absolute bottom-[calc(100%+10px)] left-0 z-50 max-h-[320px] w-full overflow-y-auto rounded-2xl border border-white/[0.10] bg-[#2b2924] p-2 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
                    {currencies.map((item) => {
                      const active = currency === item.code;

                      return (
                        <button
                          type="button"
                          key={item.code}
                          onClick={() => {
                            setCurrency(item.code);
                            setCurrencyOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                            active
                              ? "bg-[var(--primary)]/[0.10]"
                              : "hover:bg-white/[0.05]"
                          }`}
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.045] text-[17px]">
                            {item.flag}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-[11px] font-black tracking-[0.07em] text-white">
                              {item.code}
                            </span>

                            <span className="mt-0.5 block truncate text-[9px] tracking-[0.025em] text-white/30">
                              {item.name}
                            </span>
                          </span>

                          {active && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)]/[0.12]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.08] py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.05em] text-white/25">
                © {new Date().getFullYear()} Currency Exchange. All rights
                reserved.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/about"
                className="text-[10px] font-semibold tracking-[0.055em] text-white/25 transition hover:text-white"
              >
                About
              </Link>

              <Link
                href="/privacy-policy"
                className="text-[10px] font-semibold tracking-[0.055em] text-white/25 transition hover:text-white"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="text-[10px] font-semibold tracking-[0.055em] text-white/25 transition hover:text-white"
              >
                Terms
              </Link>

              <Link
                href="/contact"
                className="text-[10px] font-semibold tracking-[0.055em] text-white/25 transition hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

  
    </footer>
  );
}
