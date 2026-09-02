"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  IconAlertCircle,
  IconArrowRight,
  IconArrowsExchange,
  IconChevronDown,
  IconCircleCheck,
  IconClock,
  IconCreditCard,
  IconGlobe,
  IconInfoCircle,
  IconLoader2,
  IconRefresh,
  IconShieldCheck,
  IconTrendingUp,
  IconX,
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

const currencySymbol = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AED: "د.إ",
  SAR: "﷼",
  CAD: "$",
  AUD: "$",
  CHF: "Fr",
  JPY: "¥",
  CNY: "¥",
  SGD: "$",
  HKD: "$",
  NZD: "$",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  ZAR: "R",
  THB: "฿",
  MYR: "RM",
};

const formatNumber = (value, maximumFractionDigits = 2) => {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits,
  });
};

function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className="fixed right-4 top-4 z-[100000] w-[calc(100%-32px)] max-w-[390px] sm:right-6 sm:top-6">
      <div className="animate-[slideIn_0.25s_ease-out] overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="flex items-start gap-3 p-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isSuccess
                ? "bg-emerald-50 text-emerald-600"
                : isError
                  ? "bg-red-50 text-red-600"
                  : "bg-blue-50 text-blue-600"
            }`}
          >
            {isSuccess ? (
              <IconCircleCheck size={19} />
            ) : isError ? (
              <IconAlertCircle size={19} />
            ) : (
              <IconInfoCircle size={19} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black text-[#292721]">
              {toast.title}
            </p>

            <p className="mt-1 text-[10px] leading-4 text-[#858078]">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#99938a] transition hover:bg-[#f5f2ec] hover:text-[#292721]"
            aria-label="Close notification"
          >
            <IconX size={14} />
          </button>
        </div>

        <div
          className={`h-1 ${
            isSuccess
              ? "bg-emerald-500"
              : isError
                ? "bg-red-500"
                : "bg-blue-500"
          }`}
        />
      </div>
    </div>
  );
}

function CurrencyDropdown({ value, onChange, exclude }) {
  const [open, setOpen] = useState(false);

  const selected = currencies.find(
    (currency) => currency.code === value
  );

  const options = currencies.filter(
    (currency) => currency.code !== exclude
  );

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[58px] w-full items-center justify-between rounded-xl border border-[#e6e2da] bg-white px-3.5 transition hover:border-[var(--primary)]"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">
            {selected?.flag || "🌐"}
          </span>

          <div className="text-left">
            <div className="text-[13px] font-extrabold text-[#27251f]">
              {selected?.code || value}
            </div>

            <div className="text-[9px] font-medium text-[#99948a]">
              {selected?.name || "Currency"}
            </div>
          </div>
        </div>

        <IconChevronDown
          size={16}
          className={`text-[#858077] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9998] cursor-default"
            aria-label="Close currency dropdown"
          />

          <div className="absolute left-0 top-[calc(100%+8px)] z-[9999] max-h-[280px] w-full overflow-y-auto rounded-xl border border-[#e3ded5] bg-white p-1.5 shadow-2xl">
            {options.map((currency) => (
              <button
                type="button"
                key={currency.code}
                onClick={() => {
                  onChange(currency.code);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[#f7f5f0]"
              >
                <span className="text-lg">
                  {currency.flag}
                </span>

                <span>
                  <span className="block text-[11px] font-extrabold text-[#292721]">
                    {currency.code}
                  </span>

                  <span className="block text-[8px] text-[#99948b]">
                    {currency.name}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PaymentModal({
  open,
  onClose,
  customer,
  setCustomer,
  amount,
  from,
  to,
  rate,
  converted,
  paymentLoading,
  onPayment,
}) {
  if (!open) {
    return null;
  }

  const symbol = currencySymbol[to] || to;
  const fromSymbol = currencySymbol[from] || from;

  return (
    <div className="fixed inset-0 z-[99999] flex min-h-screen items-center justify-center overflow-y-auto bg-[#11100e]/80 px-3 py-4 backdrop-blur-md sm:px-5">
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!paymentLoading) {
            onClose();
          }
        }}
      />

      <div className="relative z-10 my-auto w-full max-w-[980px] overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-[#ece8e1] bg-white px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-lg">
              <IconCreditCard size={20} />
            </div>

            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
                Secure checkout
              </p>

              <h2 className="mt-0.5 text-[20px] font-black tracking-[-0.04em] text-[#24231e] sm:text-[22px]">
                Complete your payment
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={paymentLoading}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e1d9] bg-[#faf9f6] text-[#716c63] transition hover:bg-[#f1eee8] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close payment modal"
          >
            <IconX size={17} />
          </button>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="px-5 py-6 sm:px-7 sm:py-8">
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[9px] font-black text-white">
                  1
                </span>

                <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[var(--primary)]">
                  Customer details
                </span>
              </div>

              <h3 className="text-[23px] font-black tracking-[-0.04em] text-[#292721]">
                Where should we send your receipt?
              </h3>

              <p className="mt-2 max-w-[430px] text-[10px] leading-5 text-[#8c877e]">
                Enter your details below to continue with your secure payment.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#625e56]">
                  Full name
                </label>

                <input
                  type="text"
                  value={customer.name}
                  onChange={(event) =>
                    setCustomer((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="h-[54px] w-full rounded-xl border border-[#dfdbd3] bg-white px-4 text-[13px] font-semibold text-[#25231e] outline-none transition placeholder:text-[#aaa59d] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#625e56]">
                  Email address
                </label>

                <input
                  type="email"
                  value={customer.email}
                  onChange={(event) =>
                    setCustomer((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-[54px] w-full rounded-xl border border-[#dfdbd3] bg-white px-4 text-[13px] font-semibold text-[#25231e] outline-none transition placeholder:text-[#aaa59d] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#625e56]">
                  Phone number
                </label>

                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(event) =>
                    setCustomer((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="9876543210"
                  autoComplete="tel"
                  className="h-[54px] w-full rounded-xl border border-[#dfdbd3] bg-white px-4 text-[13px] font-semibold text-[#25231e] outline-none transition placeholder:text-[#aaa59d] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                />
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-[#eeeae3] bg-[#faf9f6] p-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--primary)] shadow-sm">
                  <IconShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-black text-[#49453e]">
                    Your payment is secure
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-[#858078]">
                    Your information is securely processed and used only to
                    complete this payment.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[8px] font-bold text-[#aaa59c]">
              <IconShieldCheck size={13} />

              <span>
                Secure checkout powered by Cashfree
              </span>
            </div>
          </div>

          <div className="border-t border-[#ebe7df] bg-[#f8f7f3] px-5 py-6 sm:px-7 sm:py-8 lg:border-l lg:border-t-0">
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1d1c19] text-[9px] font-black text-white">
                  2
                </span>

                <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#8c877e]">
                  Payment summary
                </span>
              </div>

              <h3 className="text-[23px] font-black tracking-[-0.04em] text-[#292721]">
                Review your payment
              </h3>
            </div>

            <div className="rounded-2xl border border-[#e5e0d7] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#a29c92]">
                    You send
                  </p>

                  <p className="mt-1 text-[19px] font-black tracking-[-0.03em] text-[#282721]">
                    {fromSymbol}
                    {formatNumber(amount)}
                  </p>

                  <p className="mt-0.5 text-[8px] font-bold text-[#a19b91]">
                    {from}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f2ec] text-[#716c63]">
                  <IconArrowRight size={15} />
                </div>

                <div className="text-right">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#a29c92]">
                    You receive
                  </p>

                  <p className="mt-1 text-[19px] font-black tracking-[-0.03em] text-[#282721]">
                    {symbol}
                    {formatNumber(converted)}
                  </p>

                  <p className="mt-0.5 text-[8px] font-bold text-[#a19b91]">
                    {to}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-[#e5e0d7] bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] font-bold text-[#99938a]">
                  Exchange rate
                </span>

                <span className="text-right text-[9px] font-black text-[#4e4a43]">
                  1 {from} ={" "}
                  {rate !== null
                    ? formatNumber(rate, 4)
                    : "--"}{" "}
                  {to}
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl bg-[#1d1c19] text-white">
              <div className="border-b border-white/10 px-5 py-4">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-white/40">
                  Payment details
                </p>
              </div>

              <div className="px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold text-white/55">
                    Amount
                  </span>

                  <span className="text-[11px] font-black">
                    {symbol}
                    {formatNumber(converted)}
                  </span>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-white/40">
                      Total payable
                    </p>

                    <p className="mt-1 text-[30px] font-black tracking-[-0.05em]">
                      {symbol}
                      {formatNumber(converted)}
                    </p>

                    <p className="mt-1 text-[8px] font-semibold text-white/35">
                      Charged in {to}
                    </p>
                  </div>

                  <span className="mb-1 flex items-center gap-1 rounded-full bg-[var(--primary)]/15 px-2.5 py-1.5 text-[7px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                    <IconShieldCheck size={10} />
                    Secure
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onPayment}
              disabled={
                paymentLoading ||
                rate === null ||
                Number(amount) <= 0
              }
              className="group mt-4 flex h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-[var(--primary)] px-5 text-[10px] font-black uppercase tracking-[0.13em] text-white shadow-[0_15px_35px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {paymentLoading ? (
                <>
                  <IconLoader2
                    size={17}
                    className="animate-spin"
                  />
                  Creating secure payment
                </>
              ) : (
                <>
                  Pay {symbol}
                  {formatNumber(converted)}

                  <IconArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2">
              <IconShieldCheck
                size={13}
                className="text-[#aaa59c]"
              />

              <span className="text-[8px] font-bold text-[#aaa59c]">
                Secure payment powered by Cashfree
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Banner() {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const [toast, setToast] = useState(null);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const showToast = (type, title, message) => {
    setToast({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchRate = async () => {
    if (!from || !to) {
      return;
    }

    if (from === to) {
      setRate(1);
      setError("");
      setUpdatedAt(new Date().toISOString());
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/exchange-rate?from=${from}&to=${to}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Unable to fetch exchange rate."
        );
      }

      const numericRate = Number(data.rate);

      if (
        !Number.isFinite(numericRate) ||
        numericRate <= 0
      ) {
        throw new Error(
          "Invalid exchange rate received."
        );
      }

      setRate(numericRate);

      setUpdatedAt(
        data.date || new Date().toISOString()
      );
    } catch (err) {
      console.error(err);

      setRate(null);

      setError(
        err?.message ||
          "Unable to load exchange rate."
      );

      showToast(
        "error",
        "Exchange rate unavailable",
        err?.message ||
          "Unable to load the latest exchange rate."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, [from, to]);

  useEffect(() => {
    if (!paymentModal) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [paymentModal]);

  const converted = useMemo(() => {
    const numericAmount = Number(amount) || 0;

    if (rate === null) {
      return 0;
    }

    return numericAmount * rate;
  }, [amount, rate]);

  const formattedUpdatedTime = useMemo(() => {
    if (!updatedAt) {
      return "";
    }

    try {
      return new Date(updatedAt).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "";
    }
  }, [updatedAt]);

  const openPayment = () => {
    if (!amount || Number(amount) <= 0) {
      showToast(
        "error",
        "Invalid amount",
        "Please enter an amount greater than zero."
      );
      return;
    }

    if (rate === null) {
      showToast(
        "error",
        "Rate unavailable",
        "Please wait for the exchange rate to load."
      );
      return;
    }

    setPaymentModal(true);
  };

  const startCashfreePayment = async () => {
    if (!customer.name.trim()) {
      showToast(
        "error",
        "Name required",
        "Please enter your full name."
      );
      return;
    }

    if (!customer.email.trim()) {
      showToast(
        "error",
        "Email required",
        "Please enter your email address."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(customer.email.trim())) {
      showToast(
        "error",
        "Invalid email",
        "Please enter a valid email address."
      );
      return;
    }

    if (!customer.phone.trim()) {
      showToast(
        "error",
        "Phone required",
        "Please enter your phone number."
      );
      return;
    }

    const cleanPhone = customer.phone.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      showToast(
        "error",
        "Invalid phone",
        "Please enter a valid phone number."
      );
      return;
    }

    if (rate === null) {
      showToast(
        "error",
        "Rate unavailable",
        "The exchange rate is currently unavailable."
      );
      return;
    }

    if (Number(converted) <= 0) {
      showToast(
        "error",
        "Invalid payment amount",
        "Please enter a valid amount."
      );
      return;
    }

    try {
      setPaymentLoading(true);

      const paymentAmount = Number(
        converted.toFixed(2)
      );

      const response = await fetch(
        "/api/cashfree/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: paymentAmount,
            currency: to,

            customerName: customer.name.trim(),
            customerEmail: customer.email.trim(),
            customerPhone: cleanPhone,

            fromCurrency: from,
            toCurrency: to,

            exchangeRate: Number(
              rate.toFixed(6)
            ),

            convertedAmount: paymentAmount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Unable to create payment."
        );
      }

      if (!data.paymentSessionId) {
        throw new Error(
          "Cashfree payment session was not generated."
        );
      }

      if (
        typeof window === "undefined" ||
        typeof window.Cashfree !== "function"
      ) {
        throw new Error(
          "Cashfree SDK is not loaded. Please refresh the page."
        );
      }

      const cashfree = window.Cashfree({
        mode:
          process.env.NEXT_PUBLIC_CASHFREE_MODE ||
          "sandbox",
      });

      showToast(
        "success",
        "Payment ready",
        "Opening secure Cashfree checkout..."
      );

      setPaymentModal(false);

      await cashfree.checkout({
        paymentSessionId:
          data.paymentSessionId,

        redirectTarget: "_modal",
      });

      setPaymentLoading(false);
    } catch (err) {
      console.error(
        "Cashfree payment error:",
        err
      );

      setPaymentLoading(false);

      showToast(
        "error",
        "Payment failed",
        err?.message ||
          "Unable to start Cashfree payment."
      );
    }
  };

  const swapCurrencies = () => {
    const oldFrom = from;
    const oldTo = to;

    setFrom(oldTo);
    setTo(oldFrom);

    showToast(
      "info",
      "Currencies swapped",
      `${oldTo} is now your source currency and ${oldFrom} is your target currency.`
    );
  };

  return (
    <>
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

      <section className="relative overflow-hidden bg-[#f8f7f3]">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[var(--primary)]/10 blur-3xl" />

        <div className="absolute -bottom-60 -left-40 h-[520px] w-[520px] rounded-full bg-[#ded8cd]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pb-8 sm:pt-16 lg:px-8 lg:pb-10 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_500px] xl:gap-24">
            <div className="max-w-[680px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ded8cc] bg-white px-3.5 py-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-50" />
                  <span className="relative h-2 w-2 rounded-full bg-[var(--primary)]" />
                </span>

                <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#716c63]">
                  Live currency rates
                </span>
              </div>

              <h1 className="text-[44px] font-black leading-[1.02] tracking-[-0.055em] text-[#20201c] sm:text-[58px] lg:text-[70px]">
                Exchange money
                <br />
                <span className="text-[var(--primary)]">
                  without the guesswork.
                </span>
              </h1>

              <p className="mt-6 max-w-[580px] text-[14px] leading-7 text-[#77736b] sm:text-[16px] sm:leading-8">
                Get a clear view of global exchange
                rates and calculate your currency
                conversion instantly. Simple,
                transparent and built for the modern
                world.
              </p>

              <div className="mt-7 flex flex-wrap gap-5">
                <div className="flex items-center gap-2">
                  <IconTrendingUp
                    size={15}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[10px] font-bold text-[#625e57]">
                    Live market rates
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <IconGlobe
                    size={15}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[10px] font-bold text-[#625e57]">
                    Global currencies
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <IconShieldCheck
                    size={15}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[10px] font-bold text-[#625e57]">
                    Secure platform
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/currency-converter"
                  className="group flex h-12 items-center gap-2 rounded-xl bg-[#1c1b18] px-6 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--primary)] transition hover:bg-[#292823]"
                >
                  Convert Currency

                  <IconArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/exchange-rates"
                  className="flex h-12 items-center rounded-xl border border-[#ddd8ce] bg-white px-6 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#57534c] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Explore Rates
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[30px] bg-[var(--primary)]/10 blur-2xl" />

              <div className="relative rounded-[24px] border border-[#e2ded6] bg-white p-5 shadow-[0_25px_80px_rgba(35,32,27,0.12)] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[var(--primary)]">
                      Currency converter
                    </p>

                    <h2 className="mt-1 text-[22px] font-black tracking-[-0.04em] text-[#282721]">
                      Convert instantly
                    </h2>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${
                      loading
                        ? "bg-[#fff7e7] text-[#ad7f2c]"
                        : error
                          ? "bg-red-50 text-red-600"
                          : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {loading
                      ? "Updating"
                      : error
                        ? "Unavailable"
                        : "Live Rate"}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#777269]">
                    Amount
                  </label>

                  <div className="flex h-[62px] items-center rounded-xl border border-[#e4e0d8] bg-[#faf9f6] px-4 focus-within:border-[var(--primary)]">
                    <span className="mr-2 text-[18px] font-black text-[#aaa59c]">
                      {currencySymbol[from] || from}
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={amount}
                      onChange={(event) =>
                        setAmount(event.target.value)
                      }
                      className="w-full bg-transparent text-[21px] font-black text-[#282721] outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                  <div>
                    <label className="mb-2 block text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#777269]">
                      From
                    </label>

                    <CurrencyDropdown
                      value={from}
                      onChange={setFrom}
                      exclude={to}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={swapCurrencies}
                    className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-[#ded9d0] bg-white text-[#69645c] shadow-sm transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    aria-label="Swap currencies"
                  >
                    <IconArrowsExchange size={16} />
                  </button>

                  <div>
                    <label className="mb-2 block text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#777269]">
                      To
                    </label>

                    <CurrencyDropdown
                      value={to}
                      onChange={setTo}
                      exclude={from}
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[9px] font-semibold leading-4 text-red-600">
                        {error}
                      </p>

                      <button
                        type="button"
                        onClick={fetchRate}
                        className="shrink-0 text-[9px] font-extrabold text-red-700 underline"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-5 rounded-2xl bg-[#f7f5f0] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] font-bold text-[#8d887f]">
                      Exchange rate
                    </span>

                    <span className="text-[10px] font-black text-[#302e28]">
                      {loading ? (
                        <IconLoader2
                          size={13}
                          className="animate-spin"
                        />
                      ) : rate !== null ? (
                        `1 ${from} = ${formatNumber(
                          rate,
                          4
                        )} ${to}`
                      ) : (
                        "--"
                      )}
                    </span>
                  </div>

                  <div className="my-3 h-px bg-[#e6e1d9]" />

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-[#918c83]">
                        You receive
                      </p>

                      <p className="mt-1 text-[25px] font-black tracking-[-0.04em] text-[#24231e]">
                        {rate !== null
                          ? formatNumber(converted)
                          : "--"}{" "}
                        <span className="text-[13px] text-[#858078]">
                          {to}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-right text-[8px] font-bold text-[#969188]">
                      <IconRefresh size={12} />

                      {formattedUpdatedTime ||
                        "Live rate"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openPayment}
                  disabled={
                    loading ||
                    rate === null ||
                    Number(amount) <= 0
                  }
                  className="group mt-4 flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-[10px] font-extrabold uppercase tracking-[0.13em] text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to Payment

                  <IconArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <div className="mt-4 flex justify-center gap-4">
                  <span className="flex items-center gap-1.5 text-[8px] font-bold text-[#aaa59c]">
                    <IconShieldCheck size={12} />
                    Secure
                  </span>

                  <span className="h-3 w-px bg-[#ded9d1]" />

                  <span className="flex items-center gap-1.5 text-[8px] font-bold text-[#aaa59c]">
                    <IconClock size={12} />
                    Live rates
                  </span>

                  <span className="h-3 w-px bg-[#ded9d1]" />

                  <span className="flex items-center gap-1.5 text-[8px] font-bold text-[#aaa59c]">
                    <IconGlobe size={12} />
                    Global
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-[#e2ddd4] pt-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#aaa49a]">
                  Popular currency pairs
                </p>

                <p className="mt-1 text-[10px] font-medium text-[#8a857c]">
                  Quickly check commonly used global currencies
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  ["USD", "INR"],
                  ["USD", "EUR"],
                  ["GBP", "EUR"],
                  ["AED", "INR"],
                  ["USD", "AED"],
                  ["EUR", "INR"],
                  ["USD", "JPY"],
                ].map(([base, target]) => (
                  <button
                    type="button"
                    key={`${base}-${target}`}
                    onClick={() => {
                      setFrom(base);
                      setTo(target);

                      showToast(
                        "info",
                        "Currency pair selected",
                        `${base} to ${target} exchange rate is being updated.`
                      );
                    }}
                    className="rounded-full border border-[#e0dbd2] bg-white px-3.5 py-2 text-[9px] font-extrabold text-[#625e56] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    {base} / {target}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal
        open={paymentModal}
        onClose={() => setPaymentModal(false)}
        customer={customer}
        setCustomer={setCustomer}
        amount={amount}
        from={from}
        to={to}
        rate={rate}
        converted={converted}
        paymentLoading={paymentLoading}
        onPayment={startCashfreePayment}
      />
    </>
  );
}
