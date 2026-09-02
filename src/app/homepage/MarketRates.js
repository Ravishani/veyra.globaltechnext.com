"use client";

import React from "react";
import Link from "next/link";
import {
  IconArrowUpRight,
  IconArrowsExchange,
  IconChartLine,
  IconChevronRight,
  IconClock,
  IconTrendingUp,
} from "@tabler/icons-react";

const currencyRates = [
  {
    code: "USD",
    name: "US Dollar",
    flag: "🇺🇸",
    rate: "88.15",
    change: "+0.24%",
    positive: true,
  },
  {
    code: "EUR",
    name: "Euro",
    flag: "🇪🇺",
    rate: "75.82",
    change: "+0.18%",
    positive: true,
  },
  {
    code: "GBP",
    name: "British Pound",
    flag: "🇬🇧",
    rate: "101.76",
    change: "-0.12%",
    positive: false,
  },
  {
    code: "AED",
    name: "UAE Dirham",
    flag: "🇦🇪",
    rate: "23.99",
    change: "+0.05%",
    positive: true,
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    flag: "🇸🇦",
    rate: "23.50",
    change: "+0.09%",
    positive: true,
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    flag: "🇨🇦",
    rate: "63.88",
    change: "-0.07%",
    positive: false,
  },
];

export default function MarketRates() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="absolute left-[-180px] top-[120px] h-[350px] w-[350px] rounded-full bg-[var(--primary)]/5 blur-3xl" />

      <div className="absolute bottom-[-180px] right-[-120px] h-[400px] w-[400px] rounded-full bg-[#f2eee7] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e5dfd5] bg-[#faf9f6] px-3.5 py-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)]/10">
                <IconChartLine
                  size={12}
                  stroke={2}
                  className="text-[var(--primary)]"
                />
              </span>

              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#777168]">
                Market snapshot
              </span>
            </div>

            <h2 className="text-[34px] font-black leading-[1.05] tracking-[-0.045em] text-[#22211d] sm:text-[44px] lg:text-[50px]">
              Global rates,
              <span className="text-[var(--primary)]"> at a glance.</span>
            </h2>

            <p className="mt-5 max-w-xl text-[14px] leading-7 text-[#817c73] sm:text-[15px] sm:leading-8">
              Stay updated with the latest exchange rates for popular global
              currencies and make smarter conversion decisions.
            </p>
          </div>

          <Link
            href="/exchange-rates"
            className="group inline-flex h-12 w-fit items-center gap-2 rounded-xl border border-[#ddd7cd] bg-white px-5 text-[10px] font-black uppercase tracking-[0.13em] text-[#514d46] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            View All Rates

            <IconArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currencyRates.map((currency) => (
            <div
              key={currency.code}
              className="group relative overflow-hidden rounded-2xl border border-[#e8e3da] bg-[#fcfbf9] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:bg-white hover:shadow-[0_18px_50px_rgba(35,32,27,0.08)]"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[var(--primary)]/5 blur-2xl transition-transform duration-500 group-hover:scale-150" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7e1d7] bg-white text-[21px] shadow-sm">
                    {currency.flag}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-black text-[#292721]">
                        {currency.code}
                      </span>

                      <span className="rounded-md bg-[#f0ede7] px-1.5 py-0.5 text-[7px] font-bold text-[#89837a]">
                        INR
                      </span>
                    </div>

                    <p className="mt-0.5 text-[9px] font-medium text-[#9a958c]">
                      {currency.name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5dfd6] bg-white text-[#827c72] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  aria-label={`View ${currency.code} details`}
                >
                  <IconChevronRight size={14} />
                </button>
              </div>

              <div className="relative mt-6 flex items-end justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#aaa49a]">
                    1 {currency.code}
                  </p>

                  <p className="mt-1 text-[25px] font-black tracking-[-0.04em] text-[#25231f]">
                    ₹{currency.rate}
                  </p>
                </div>

                <div
                  className={`mb-1 flex items-center gap-1 rounded-full px-2 py-1 ${
                    currency.positive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  <IconTrendingUp
                    size={10}
                    stroke={2.5}
                    className={!currency.positive ? "rotate-180" : ""}
                  />

                  <span className="text-[8px] font-black">
                    {currency.change}
                  </span>
                </div>
              </div>

              <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-[#eeeae3]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    currency.positive
                      ? "w-[68%] bg-emerald-400"
                      : "w-[42%] bg-red-300"
                  }`}
                />
              </div>

              <div className="relative mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[8px] font-semibold text-[#aaa49b]">
                  <IconClock size={11} />
                  Updated just now
                </span>

                <span className="text-[8px] font-bold text-[#8d877e]">
                  1 {currency.code} = ₹{currency.rate}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-[#e7e1d8] bg-[#f8f6f1] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <IconArrowsExchange
                size={19}
                className="text-[var(--primary)]"
              />
            </div>

            <div>
              <p className="text-[12px] font-black text-[#302e28]">
                Looking for another currency?
              </p>

              <p className="mt-1 text-[9px] font-medium text-[#8e897f]">
                Compare exchange rates for 150+ currencies.
              </p>
            </div>
          </div>

          <Link
            href="/currency-converter"
            className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1d1c19] px-5 text-[9px] font-black uppercase tracking-[0.13em] text-[var(--primary)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#292823]"
          >
            Start Converting

            <IconArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}