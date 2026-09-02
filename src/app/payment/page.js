"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  IconArrowRight,
  IconArrowsDownUp,
  IconCheck,
  IconChevronDown,
  IconCreditCard,
  IconGlobe,
  IconInfoCircle,
  IconLock,
  IconRefresh,
  IconShieldCheck,
  IconWallet,
} from "@tabler/icons-react";

const API_URL = "/api/exchange-rate";

const currencies = [
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
  },
  {
    code: "AED",
    name: "UAE Dirham",
    symbol: "د.إ",
    flag: "🇦🇪",
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    symbol: "﷼",
    flag: "🇸🇦",
  },
];

const formatNumber = (value, digits = 2) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);
};

export default function PaymentPage() {
  const [amount, setAmount] = useState("10000");

  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("AED");

  const [exchangeRate, setExchangeRate] = useState(null);
  const [rateDate, setRateDate] = useState("");

  const [loadingRate, setLoadingRate] = useState(false);
  const [rateError, setRateError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const from = useMemo(
    () => currencies.find((item) => item.code === fromCurrency),
    [fromCurrency]
  );

  const to = useMemo(
    () => currencies.find((item) => item.code === toCurrency),
    [toCurrency]
  );

  const numericAmount = Number(amount) || 0;

  /*
  |--------------------------------------------------------------------------
  | Fetch Exchange Rate
  |--------------------------------------------------------------------------
  */

  const fetchExchangeRate = async () => {
    if (!fromCurrency || !toCurrency) return;

    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      setRateDate(new Date().toISOString());
      setRateError("");
      return;
    }

    try {
      setLoadingRate(true);
      setRateError("");

      const response = await fetch(
        `${API_URL}?from=${encodeURIComponent(
          fromCurrency
        )}&to=${encodeURIComponent(toCurrency)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message || "Unable to fetch exchange rate."
        );
      }

      const rate = Number(data.rate);

      if (!Number.isFinite(rate) || rate <= 0) {
        throw new Error("Invalid exchange rate received.");
      }

      setExchangeRate(rate);
      setRateDate(data.date || new Date().toISOString());
    } catch (error) {
      console.error("Exchange Rate Error:", error);

      setExchangeRate(null);
      setRateError(
        error?.message || "Unable to load exchange rate."
      );
    } finally {
      setLoadingRate(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  /*
  |--------------------------------------------------------------------------
  | Calculations
  |--------------------------------------------------------------------------
  */

  const convertedAmount = useMemo(() => {
    if (exchangeRate === null) return 0;

    return numericAmount * exchangeRate;
  }, [numericAmount, exchangeRate]);

  const serviceFee = useMemo(() => {
    return convertedAmount * 0.01;
  }, [convertedAmount]);

  const totalAmount = useMemo(() => {
    return convertedAmount + serviceFee;
  }, [convertedAmount, serviceFee]);

  /*
  |--------------------------------------------------------------------------
  | Swap
  |--------------------------------------------------------------------------
  */

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  /*
  |--------------------------------------------------------------------------
  | Payment
  |--------------------------------------------------------------------------
  */

  const handlePayment = async () => {
    if (numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (exchangeRate === null) {
      alert("Exchange rate is unavailable.");
      return;
    }

    try {
      setProcessing(true);

      /*
       * Replace this with your actual
       * payment gateway API.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      alert("Payment initialized successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to initialize payment.");
    } finally {
      setProcessing(false);
    }
  };

  const formattedDate = useMemo(() => {
    if (!rateDate) return "";

    try {
      return new Date(rateDate).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }, [rateDate]);

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#101010]">

        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold text-orange-400">

              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

              Secure payment gateway

            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">

              Pay globally.

              <span className="block text-orange-500">
                Simple & secure.
              </span>

            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">

              Convert your money using current exchange rates
              and continue securely to payment.

            </p>

          </div>

          <div className="mt-8 flex flex-wrap gap-3">

            <TrustBadge
              icon={<IconLock size={15} />}
              text="SSL encrypted"
            />

            <TrustBadge
              icon={<IconShieldCheck size={15} />}
              text="Secure checkout"
            />

            <TrustBadge
              icon={<IconGlobe size={15} />}
              text="Global currencies"
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">

          {/* =================================================
              PAYMENT CARD
          ================================================== */}

          <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

            {/* HEADER */}

            <div className="border-b border-gray-100 px-5 py-5 sm:px-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-500">
                    Payment details
                  </p>

                  <h2 className="mt-1 text-xl font-black sm:text-2xl">
                    Send money
                  </h2>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <IconCreditCard size={21} />
                </div>

              </div>

            </div>

            <div className="p-5 sm:p-7">

              {/* =================================================
                  AMOUNT
              ================================================== */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <label className="text-sm font-bold">
                    You pay
                  </label>

                  <span className="text-xs text-gray-400">
                    Amount
                  </span>

                </div>

                <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 transition focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/10">

                  <CurrencySelect
                    value={fromCurrency}
                    onChange={setFromCurrency}
                  />

                  <div className="flex min-h-[105px] flex-1 items-center px-4 sm:px-6">

                    <span className="mr-2 text-2xl font-bold text-gray-400 sm:text-3xl">
                      {from?.symbol}
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) =>
                        setAmount(e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full min-w-0 bg-transparent text-right text-3xl font-black outline-none sm:text-4xl"
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  SWAP
              ================================================== */}

              <div className="relative my-8 flex items-center justify-center">

                <div className="h-px w-full bg-gray-100" />

                <button
                  type="button"
                  onClick={handleSwap}
                  disabled={loadingRate}
                  className="absolute flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-500 active:scale-95 disabled:opacity-50"
                >
                  <IconArrowsDownUp size={20} />
                </button>

              </div>

              {/* =================================================
                  RECEIVE
              ================================================== */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <label className="text-sm font-bold">
                    You receive
                  </label>

                  <span
                    className={`text-xs font-bold ${
                      rateError
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {loadingRate
                      ? "Updating..."
                      : rateError
                      ? "Unavailable"
                      : "Estimated amount"}
                  </span>

                </div>

                <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

                  <CurrencySelect
                    value={toCurrency}
                    onChange={setToCurrency}
                  />

                  <div className="flex min-h-[105px] flex-1 items-center justify-end px-4 sm:px-6">

                    {loadingRate ? (

                      <div className="flex items-center gap-2 text-gray-400">

                        <IconRefresh
                          size={20}
                          className="animate-spin"
                        />

                        <span className="text-sm font-bold">
                          Calculating...
                        </span>

                      </div>

                    ) : rateError ? (

                      <button
                        type="button"
                        onClick={fetchExchangeRate}
                        className="flex items-center gap-2 text-sm font-bold text-red-500"
                      >
                        <IconRefresh size={17} />
                        Retry
                      </button>

                    ) : (

                      <span className="text-right text-3xl font-black tracking-tight sm:text-4xl">

                        {to?.symbol}
                        {formatNumber(convertedAmount)}

                      </span>

                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  RATE
              ================================================== */}

              <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
                      <IconGlobe size={18} />
                    </div>

                    <div>

                      <p className="text-xs font-bold text-gray-500">
                        Current exchange rate
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {formattedDate
                          ? `Updated ${formattedDate}`
                          : "Live rate"}
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    {loadingRate ? (

                      <span className="text-xs font-bold text-gray-400">
                        Updating...
                      </span>

                    ) : exchangeRate !== null ? (

                      <>

                        <p className="text-sm font-black text-gray-900">
                          1 {fromCurrency}
                        </p>

                        <p className="text-xs font-bold text-orange-500">
                          =
                          {" "}
                          {formatNumber(
                            exchangeRate,
                            6
                          )}{" "}
                          {toCurrency}
                        </p>

                      </>

                    ) : (

                      <span className="text-sm font-bold text-red-500">
                        --
                      </span>

                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  QUICK CURRENCIES
              ================================================== */}

              <div className="mt-7">

                <div className="mb-3 flex items-center justify-between">

                  <p className="text-xs font-black uppercase tracking-[0.15em] text-gray-400">
                    Popular currencies
                  </p>

                  <span className="text-[11px] text-gray-400">
                    Receive in
                  </span>

                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">

                  {currencies.map((currency) => (

                    <button
                      key={currency.code}
                      type="button"
                      onClick={() =>
                        setToCurrency(currency.code)
                      }
                      className={`rounded-xl border px-2 py-3 transition ${
                        toCurrency === currency.code
                          ? "border-orange-500 bg-orange-50 text-orange-500"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >

                      <span className="block text-lg">
                        {currency.flag}
                      </span>

                      <span className="mt-1 block text-xs font-black">
                        {currency.code}
                      </span>

                    </button>

                  ))}

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              SUMMARY
          ================================================== */}

          <aside className="overflow-hidden rounded-[28px] bg-[#151515] text-white shadow-[0_25px_70px_rgba(0,0,0,0.18)] lg:sticky lg:top-6">

            <div className="p-5 sm:p-6">

              {/* SUMMARY HEADER */}

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-400">
                    Order summary
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Payment total
                  </h2>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <IconWallet size={19} />
                </div>

              </div>

              {/* TOTAL */}

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                <div className="flex items-center justify-between">

                  <p className="text-xs font-medium text-white/40">
                    You will pay
                  </p>

                  <span className="rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-bold text-green-400">
                    Secure
                  </span>

                </div>

                <div className="mt-3">

                  <p className="text-3xl font-black sm:text-4xl">

                    {to?.symbol}

                    {rateError
                      ? "--"
                      : formatNumber(totalAmount)}

                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    {toCurrency}
                  </p>

                </div>

              </div>

              {/* BREAKDOWN */}

              <div className="my-6 h-px bg-white/10" />

              <div className="space-y-4">

                <SummaryRow
                  label={`Amount (${fromCurrency})`}
                  value={`${from?.symbol}${formatNumber(
                    numericAmount
                  )}`}
                />

                <SummaryRow
                  label="Exchange rate"
                  value={
                    exchangeRate !== null
                      ? formatNumber(
                          exchangeRate,
                          6
                        )
                      : "--"
                  }
                />

                <SummaryRow
                  label={`Converted amount (${toCurrency})`}
                  value={`${to?.symbol}${formatNumber(
                    convertedAmount
                  )}`}
                />

                <SummaryRow
                  label="Service fee"
                  value={`${to?.symbol}${formatNumber(
                    serviceFee
                  )}`}
                />

                <div className="h-px bg-white/10" />

                <div className="flex items-center justify-between">

                  <span className="text-sm font-bold">
                    Total
                  </span>

                  <span className="text-lg font-black text-orange-400">

                    {to?.symbol}

                    {rateError
                      ? "--"
                      : formatNumber(totalAmount)}

                  </span>

                </div>

              </div>

              {/* PAYMENT METHOD */}

              <div className="mt-7">

                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.15em] text-white/35">
                  Payment method
                </p>

                <div className="grid grid-cols-2 gap-3">

                  <PaymentMethod
                    active={paymentMethod === "card"}
                    icon={<IconCreditCard size={20} />}
                    title="Card"
                    description="Visa / Mastercard"
                    onClick={() =>
                      setPaymentMethod("card")
                    }
                  />

                  <PaymentMethod
                    active={paymentMethod === "wallet"}
                    icon={<IconWallet size={20} />}
                    title="Wallet"
                    description="Fast checkout"
                    onClick={() =>
                      setPaymentMethod("wallet")
                    }
                  />

                </div>

              </div>

              {/* BUTTON */}

              <button
                type="button"
                onClick={handlePayment}
                disabled={
                  processing ||
                  loadingRate ||
                  !!rateError ||
                  exchangeRate === null ||
                  numericAmount <= 0
                }
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
              >

                {processing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </>
                ) : loadingRate ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Updating rate...
                  </>
                ) : (
                  <>
                    Continue to payment
                    <IconArrowRight size={18} />
                  </>
                )}

              </button>

              {/* SECURITY */}

              <div className="mt-5 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <IconLock size={16} />
                </div>

                <div>

                  <p className="text-xs font-bold">
                    Secure & protected
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-white/35">
                    Your payment information is encrypted
                    and processed securely.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

        {/* =====================================================
            BOTTOM FEATURES
        ====================================================== */}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">

          <FeatureCard
            icon={<IconShieldCheck size={19} />}
            title="Secure payments"
            text="Encrypted checkout"
          />

          <FeatureCard
            icon={<IconGlobe size={19} />}
            title="Global currency"
            text="International payments"
          />

          <FeatureCard
            icon={<IconCreditCard size={19} />}
            title="Flexible payment"
            text="Card & wallet support"
          />

        </div>

      </section>

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Currency Select
|--------------------------------------------------------------------------
*/

function CurrencySelect({ value, onChange }) {
  const selected = currencies.find(
    (currency) => currency.code === value
  );

  return (
    <div className="relative flex w-[120px] shrink-0 items-center border-r border-gray-200 sm:w-[140px]">

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-full w-full cursor-pointer appearance-none bg-transparent px-4 pr-9 text-sm font-black outline-none sm:px-5"
      >

        {currencies.map((currency) => (
          <option
            key={currency.code}
            value={currency.code}
          >
            {currency.flag} {currency.code}
          </option>
        ))}

      </select>

      <IconChevronDown
        size={16}
        className="pointer-events-none absolute right-4 text-gray-400"
      />

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Summary Row
|--------------------------------------------------------------------------
*/

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">

      <span className="text-white/45">
        {label}
      </span>

      <span className="font-bold text-white">
        {value}
      </span>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Payment Method
|--------------------------------------------------------------------------
*/

function PaymentMethod({
  active,
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-orange-500 bg-orange-500/10"
          : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
      }`}
    >

      <div
        className={
          active
            ? "text-orange-400"
            : "text-white/40"
        }
      >
        {icon}
      </div>

      <p className="mt-3 text-sm font-black">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-white/35">
        {description}
      </p>

    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Feature Card
|--------------------------------------------------------------------------
*/

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          {icon}
        </div>

        <div>

          <p className="text-sm font-black text-gray-900">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-gray-500">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Trust Badge
|--------------------------------------------------------------------------
*/

function TrustBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-white/60">

      <span className="text-orange-400">
        {icon}
      </span>

      {text}

    </div>
  );
}