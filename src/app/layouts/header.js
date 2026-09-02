"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconArrowRight,
  IconArrowsExchange,
  IconChevronDown,
  IconChevronRight,
  IconChevronLeft,
  IconCoin,
  IconCurrencyDollar,
  IconCurrencyEuro,
  IconCurrencyPound,
  IconGlobe,
  IconHelpCircle,
  IconMail,
  IconMenu2,
  IconMinus,
  IconPhone,
  IconPlus,
  IconSearch,
  IconSend,
  IconShieldCheck,
  IconShoppingBag,
  IconShoppingCart,
  IconTrendingUp,
  IconUser,
  IconWorld,
  IconX,
} from "@tabler/icons-react";

import { useCart } from "../context/CartContext";

const dropdownData = {
  Currencies: {
    items: [
      {
        title: "Currency Converter",
        description: "Convert currencies quickly and easily.",
        href: "/currency-converter",
        icon: IconArrowsExchange,
      },
      {
        title: "All Currencies",
        description: "Explore currencies from around the world.",
        href: "/currencies",
        icon: IconGlobe,
      },
      {
        title: "Popular Currencies",
        description: "See the most popular global currencies.",
        href: "/currencies/popular",
        icon: IconCoin,
      },
      {
        title: "Currency Pairs",
        description: "Compare popular currency pairs.",
        href: "/currency-pairs",
        icon: IconTrendingUp,
      },
    ],
  },

  "Send Money": {
    items: [
      {
        title: "International Transfer",
        description: "Send money internationally with confidence.",
        href: "/send-money",
        icon: IconSend,
      },
      {
        title: "Business Transfer",
        description: "Simple solutions for global businesses.",
        href: "/business/transfers",
        icon: IconWorld,
      },
      {
        title: "Transfer Rates",
        description: "Check rates before making a transfer.",
        href: "/transfer-rates",
        icon: IconTrendingUp,
      },
      {
        title: "Track Transfer",
        description: "Track your transfer status.",
        href: "/track-transfer",
        icon: IconShieldCheck,
      },
    ],
  },

  Resources: {
    items: [
      {
        title: "Currency Guide",
        description: "Learn how exchange rates work.",
        href: "/currency-guide",
        icon: IconGlobe,
      },
      {
        title: "Money Transfer Guide",
        description: "Helpful international transfer information.",
        href: "/money-transfer-guide",
        icon: IconSend,
      },
      {
        title: "FAQ",
        description: "Find answers to common questions.",
        href: "/faq",
        icon: IconHelpCircle,
      },
      {
        title: "Blog",
        description: "Latest currency and market insights.",
        href: "/blog",
        icon: IconWorld,
      },
    ],
  },
};

function DesktopDropdown({ title, data }) {
  return (
    <div
      className="absolute left-1/2 top-[calc(100%-1px)] z-[3000] w-[620px] -translate-x-1/2 pt-3"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="overflow-hidden rounded-[22px] border border-[#e6e2db] bg-white shadow-[0_25px_80px_rgba(30,27,22,0.16)]">
        <div className="grid grid-cols-[190px_1fr]">
          <div className="bg-[#171816] p-6 text-white">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">
              Explore
            </span>

            <h3 className="mt-2 text-[24px] font-black tracking-[-0.04em]">
              {title}
            </h3>

            <p className="mt-3 text-[10px] leading-5 text-white/40">
              Simple tools and services designed for your global currency
              needs.
            </p>

            <Link
              href={
                title === "Currencies"
                  ? "/currencies"
                  : title === "Send Money"
                    ? "/send-money"
                    : "/resources"
              }
              className="group mt-7 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[var(--primary)]"
            >
              View all

              <IconArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
                  Services
                </span>

                <h4 className="mt-1 text-[17px] font-black text-[#292722]">
                  {title}
                </h4>
              </div>

              <IconChevronRight size={16} className="text-[#c2bdb4]" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {data.items.map((item) => {
                const ItemIcon = item.icon;

                return (
                  <Link
                    href={item.href}
                    key={item.title}
                    className="group rounded-[16px] border border-[#ebe7e0] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:bg-[#fffdf9] hover:shadow-[0_10px_25px_rgba(30,27,22,0.07)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f2ed] text-[#5d5952] transition group-hover:bg-[var(--primary)] group-hover:text-white">
                        <ItemIcon size={17} />
                      </div>

                      <IconArrowRight
                        size={13}
                        className="text-[#c5c0b7] opacity-0 transition group-hover:translate-x-0.5 group-hover:text-[var(--primary)] group-hover:opacity-100"
                      />
                    </div>

                    <p className="mt-3 text-[11px] font-extrabold text-[#35322c] group-hover:text-[var(--primary)]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[8px] leading-4 text-[#99958d]">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#eeeae4] bg-[#faf9f6] px-5 py-3">
          <div className="flex items-center gap-2 text-[8px] font-semibold text-[#99958d]">
            <IconShieldCheck
              size={13}
              className="text-[var(--primary)]"
            />
            Secure & transparent platform
          </div>

          <Link
            href="/help"
            className="text-[8px] font-extrabold text-[#69645c] transition hover:text-[var(--primary)]"
          >
            Need help?
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoginModal({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close login"
      />

      <div className="relative z-10 w-full max-w-[430px] overflow-hidden rounded-[25px] bg-white shadow-[0_30px_100px_rgba(20,18,15,0.25)]">
        <div className="relative bg-[#171816] px-6 py-7 text-white sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/15 hover:text-white"
          >
            <IconX size={17} />
          </button>

          <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--primary)]">
            <IconUser size={22} />
          </div>

          <h2 className="mt-5 text-[25px] font-black tracking-[-0.04em]">
            Welcome back
          </h2>

          <p className="mt-1.5 text-[10px] leading-5 text-white/40">
            Sign in to manage your currency tools and transfers.
          </p>
        </div>

        <form
          className="p-6 sm:p-8"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="mb-2 block text-[10px] font-extrabold text-[#514d46]">
            Email address
          </label>

          <div className="flex h-12 items-center rounded-[13px] border border-[#e2ded7] bg-[#faf9f6] px-3.5 focus-within:border-[var(--primary)]">
            <IconMail size={17} className="text-[#9b968e]" />

            <input
              type="email"
              placeholder="you@example.com"
              className="ml-3 min-w-0 flex-1 bg-transparent text-[12px] outline-none"
            />
          </div>

          <label className="mb-2 mt-5 block text-[10px] font-extrabold text-[#514d46]">
            Password
          </label>

          <div className="flex h-12 items-center rounded-[13px] border border-[#e2ded7] bg-[#faf9f6] px-3.5 focus-within:border-[var(--primary)]">
            <IconShieldCheck size={17} className="text-[#9b968e]" />

            <input
              type="password"
              placeholder="Enter password"
              className="ml-3 min-w-0 flex-1 bg-transparent text-[12px] outline-none"
            />
          </div>

          <div className="mt-3 text-right">
            <Link
              href="/forgot-password"
              onClick={onClose}
              className="text-[9px] font-extrabold text-[var(--primary)]"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-[var(--primary)] text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--primary-hover)]"
          >
            Sign In

            <IconArrowRight
              size={14}
              className="transition group-hover:translate-x-1"
            />
          </button>

          <p className="mt-5 text-center text-[10px] text-[#99958d]">
            Don't have an account?{" "}
            <Link
              href="/register"
              onClick={onClose}
              className="font-extrabold text-[var(--primary)]"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function MobileSubMenu({ title, data, onBack, onClose }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white">
      <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-[#eeeae4] px-5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f1ed]"
        >
          <IconChevronLeft size={19} />
        </button>

        <div>
          <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
            Explore
          </span>

          <h3 className="text-[18px] font-black text-[#292722]">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f1ed]"
        >
          <IconX size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="space-y-2">
          {data.items.map((item) => {
            const ItemIcon = item.icon;

            return (
              <Link
                href={item.href}
                key={item.title}
                onClick={onClose}
                className="flex items-center gap-3 rounded-[17px] border border-[#e9e5de] p-3.5 transition hover:border-[var(--primary)]/30 hover:bg-[#fffdf9]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f4f2ed]">
                  <ItemIcon size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-extrabold text-[#35322d]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-[#99958d]">
                    {item.description}
                  </p>
                </div>

                <IconChevronRight
                  size={16}
                  className="text-[#aaa59d]"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose, onLogin }) {
  const [submenu, setSubmenu] = useState(null);

  useEffect(() => {
    if (!open) {
      setSubmenu(null);
    }
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[4500] lg:hidden ${
        open
          ? "pointer-events-auto"
          : "pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close menu"
      />

      <aside
        className={`absolute left-0 top-0 h-full w-[min(390px,88vw)] overflow-hidden bg-white shadow-[20px_0_70px_rgba(0,0,0,0.2)] transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div
          className={`absolute inset-0 flex flex-col bg-white transition-transform duration-300 ${
            submenu
              ? "-translate-x-full"
              : "translate-x-0"
          }`}
        >
          <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#eeeae4] px-5">
            <Link
              href="/"
              onClick={onClose}
              className="text-[25px] font-black tracking-[-0.06em]"
            >
              Veyra
              <span className="text-[var(--primary)]">
                .
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f1ed]"
            >
              <IconX size={19} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <div className="rounded-[21px] bg-[#171816] p-5 text-white">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">
                Currency platform
              </span>

              <h3 className="mt-2 text-[22px] font-black leading-tight tracking-[-0.04em]">
                Smarter currency.
                <br />
                Simpler transfers.
              </h3>

              <p className="mt-2 text-[9px] leading-4 text-white/40">
                Everything you need to manage global currencies.
              </p>
            </div>

            <div className="mt-5 space-y-1">
              <Link
                href="/"
                onClick={onClose}
                className="flex h-13 items-center justify-between rounded-xl px-3 text-[13px] font-bold hover:bg-[#f5f3ef]"
              >
                Home
                <IconChevronRight size={16} />
              </Link>

              <Link
                href="/exchange-rates"
                onClick={onClose}
                className="flex h-13 items-center justify-between rounded-xl px-3 text-[13px] font-bold hover:bg-[#f5f3ef]"
              >
                Exchange Rates
                <IconChevronRight size={16} />
              </Link>

              {Object.entries(dropdownData).map(
                ([title, data]) => (
                  <button
                    type="button"
                    key={title}
                    onClick={() =>
                      setSubmenu(title)
                    }
                    className="flex h-14 w-full items-center justify-between rounded-xl px-3 text-left hover:bg-[#f5f3ef]"
                  >
                    <span className="text-[13px] font-bold">
                      {title}
                    </span>

                    <IconChevronRight size={16} />
                  </button>
                )
              )}

              <Link
                href="/business"
                onClick={onClose}
                className="flex h-13 items-center justify-between rounded-xl px-3 text-[13px] font-bold hover:bg-[#f5f3ef]"
              >
                Business
                <IconChevronRight size={16} />
              </Link>

              <Link
                href="/about"
                onClick={onClose}
                className="flex h-13 items-center justify-between rounded-xl px-3 text-[13px] font-bold hover:bg-[#f5f3ef]"
              >
                About
                <IconChevronRight size={16} />
              </Link>

              <Link
                href="/contact"
                onClick={onClose}
                className="flex h-13 items-center justify-between rounded-xl px-3 text-[13px] font-bold hover:bg-[#f5f3ef]"
              >
                Contact
                <IconChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="border-t border-[#eeeae4] p-5">
            <button
              type="button"
              onClick={onLogin}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#e2ded7] text-[10px] font-extrabold uppercase tracking-[0.1em]"
            >
              <IconUser size={16} />
              Sign In
            </button>

            <Link
              href="/currency-converter"
              onClick={onClose}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-[10px] font-extrabold uppercase tracking-[0.1em] text-white"
            >
              Convert Now
              <IconArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div
          className={`absolute inset-0 bg-white transition-transform duration-300 ${
            submenu
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          {submenu && (
            <MobileSubMenu
              title={submenu}
              data={dropdownData[submenu]}
              onBack={() =>
                setSubmenu(null)
              }
              onClose={onClose}
            />
          )}
        </div>
      </aside>
    </div>
  );
}

function CurrencyDropdown() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");

  const currencies = [
    ["USD", "US Dollar", IconCurrencyDollar],
    ["EUR", "Euro", IconCurrencyEuro],
    ["GBP", "British Pound", IconCurrencyPound],
    ["INR", "Indian Rupee", IconCurrencyDollar],
    ["AED", "UAE Dirham", IconCurrencyDollar],
  ];

  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className="flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-[11px] font-extrabold text-[#555149] transition hover:bg-[#f4f1ec] hover:text-[var(--primary)]"
      >
        <IconGlobe size={16} />

        {currency}

        <IconChevronDown
          size={13}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[4000] w-[205px] rounded-[17px] border border-[#e5e1d9] bg-white p-2 shadow-[0_20px_55px_rgba(30,27,22,0.14)]">
          {currencies.map(
            ([code, name, CurrencyIcon]) => (
              <button
                type="button"
                key={code}
                onClick={() => {
                  setCurrency(code);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left hover:bg-[#f5f3ef]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f1ed]">
                  <CurrencyIcon size={16} />
                </span>

                <span className="flex-1">
                  <span className="block text-[10px] font-extrabold">
                    {code}
                  </span>

                  <span className="block text-[8px] text-[#99958d]">
                    {name}
                  </span>
                </span>

                {currency === code && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

function CartButton() {
  const {
    cartItems = [],
    cartCount = 0,
    cartTotal = 0,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const [open, setOpen] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const getProductPrice = (item) => {
    const price = Number(item?.price || 0);
    const discountPrice = Number(
      item?.discount_price || 0
    );

    if (
      discountPrice > 0 &&
      discountPrice < price
    ) {
      return discountPrice;
    }

    return price;
  };

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "";

    const baseUrl = apiUrl
      .replace(/\/api\/?$/, "")
      .replace(/\/+$/, "");

    return `${baseUrl}/${image.replace(
      /^\/+/,
      ""
    )}`;
  };

  return (
    <div
      ref={cartRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        aria-label={`Cart with ${cartCount} items`}
        aria-expanded={open}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
          open
            ? "bg-[#f4f1ec] text-[var(--primary)]"
            : "text-[#555149] hover:bg-[#f4f1ec] hover:text-[var(--primary)]"
        }`}
      >
        <IconShoppingCart size={20} />

        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[8px] font-black text-white shadow-sm">
            {cartCount > 99
              ? "99+"
              : cartCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-[99999] w-[calc(100vw-24px)] max-w-[420px] overflow-hidden rounded-[22px] border border-[#e5e0d8] bg-white shadow-[0_25px_80px_rgba(25,23,19,0.18)]">
          <div className="border-b border-[#eeeae3] bg-[#fbfaf7] px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#aaa49a]">
                  Shopping Cart
                </p>

                <h3 className="mt-1 text-[15px] font-black tracking-[-0.025em] text-[#292721]">
                  Your Cart
                </h3>

                {cartCount > 0 && (
                  <p className="mt-1 text-[9px] text-[#858078]">
                    {cartCount}{" "}
                    {cartCount === 1
                      ? "item"
                      : "items"}{" "}
                    in your cart
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#858078] transition hover:bg-[#eeeae3] hover:text-[#292721]"
              >
                <IconX size={15} />
              </button>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f2ec] text-[#aaa49a]">
                <IconShoppingBag size={26} />
              </div>

              <h4 className="mt-4 text-[14px] font-black text-[#292721]">
                Your cart is empty
              </h4>

              <p className="mt-1 text-[9px] leading-4 text-[#858078]">
                Add some products to your
                cart to continue.
              </p>

              <Link
                href="/products"
                onClick={() =>
                  setOpen(false)
                }
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-[8px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[var(--primary-hover)]"
              >
                Shop Products
                <IconArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <>
              <div className="max-h-[350px] overflow-y-auto p-4">
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const imageUrl =
                      getImageUrl(
                        item.image
                      );

                    const price =
                      getProductPrice(
                        item
                      );

                    const quantity =
                      Number(
                        item.quantity || 1
                      );

                    const subtotal =
                      price * quantity;

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[#eeeae3] bg-white p-3 transition hover:border-[#ded8ce]"
                      >
                        <div className="flex gap-3">
                          <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-[#f3f0ea]">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={
                                  item.name ||
                                  "Product"
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#aaa49a]">
                                <IconShoppingBag
                                  size={24}
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <Link
                                  href={`/products/${item.slug}`}
                                  onClick={() =>
                                    setOpen(
                                      false
                                    )
                                  }
                                  className="line-clamp-2 text-[10px] font-black leading-4 text-[#292721] transition hover:text-[var(--primary)]"
                                >
                                  {item.name}
                                </Link>

                                {item.sku && (
                                  <p className="mt-1 truncate text-[7px] font-bold uppercase tracking-[0.08em] text-[#aaa49a]">
                                    SKU:{" "}
                                    {
                                      item.sku
                                    }
                                  </p>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(
                                    item.id
                                  )
                                }
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[#aaa49a] transition hover:bg-red-50 hover:text-red-500"
                                aria-label="Remove product"
                              >
                                <IconX size={13} />
                              </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="flex items-center rounded-lg border border-[#e4dfd7] bg-[#faf9f6]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(
                                      item.id
                                    )
                                  }
                                  className="flex h-7 w-7 items-center justify-center text-[#716c63] transition hover:text-[var(--primary)]"
                                >
                                  <IconMinus
                                    size={11}
                                  />
                                </button>

                                <span className="flex h-7 min-w-[24px] items-center justify-center text-[9px] font-black text-[#292721]">
                                  {
                                    quantity
                                  }
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    increaseQuantity(
                                      item.id
                                    )
                                  }
                                  className="flex h-7 w-7 items-center justify-center text-[#716c63] transition hover:text-[var(--primary)]"
                                >
                                  <IconPlus
                                    size={11}
                                  />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="text-[11px] font-black text-[#292721]">
                                  ₹
                                  {subtotal.toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </p>

                                {quantity > 1 && (
                                  <p className="text-[7px] text-[#aaa49a]">
                                    ₹
                                    {price.toLocaleString(
                                      "en-IN",
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )}{" "}
                                    each
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#eeeae3] bg-[#fbfaf7] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#858078]">
                    Subtotal
                  </span>

                  <span className="text-[17px] font-black tracking-[-0.03em] text-[#292721]">
                    ₹
                    {Number(
                      cartTotal
                    ).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>

                <p className="mt-1 text-[8px] text-[#aaa49a]">
                  Shipping and taxes calculated at checkout.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={() =>
                      setOpen(false)
                    }
                    className="flex h-11 items-center justify-center rounded-xl border border-[#ded9d1] bg-white text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#625e56] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    View Cart
                  </Link>

                  <Link
                    href="/checkout"
                    onClick={() =>
                      setOpen(false)
                    }
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[var(--primary)] text-[8px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--primary-hover)]"
                  >
                    Checkout
                    <IconArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [activeMenu, setActiveMenu] =
    useState(null);

  const [loginOpen, setLoginOpen] =
    useState(false);

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const desktopSearchRef =
    useRef(null);

  const mobileSearchRef =
    useRef(null);

  const closeTimer =
    useRef(null);

  const openMenu = (menu) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    setActiveMenu(menu);
  };

  const delayedClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    closeTimer.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  const keepMenuOpen = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
  };

  const openLogin = () => {
    setLoginOpen(true);
    setActiveMenu(null);
    setMobileMenu(false);
  };

  const submitSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    window.location.href = `/search?q=${encodeURIComponent(
      value
    )}`;
  };

  const focusSearch = () => {
    if (window.innerWidth >= 1280) {
      desktopSearchRef.current?.focus();
    } else {
      mobileSearchRef.current?.focus();
    }
  };

  useEffect(() => {
    document.body.style.overflow =
      loginOpen || mobileMenu
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [loginOpen, mobileMenu]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(
          closeTimer.current
        );
      }
    };
  }, []);

  return (
    <>
      <header className="relative z-[2000] w-full bg-white text-[#25231f]">
        <div className="hidden bg-[#171816] lg:block">
          <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-6 xl:px-8">
            <div className="flex items-center gap-5">
              <Link
                href="mailto:globaltechnext@gmail.com"
                className="flex items-center gap-2 text-[10px] font-medium text-white/55 transition hover:text-[var(--primary)]"
              >
                <IconMail size={13} />
                globaltechnext@gmail.com
              </Link>

              <span className="h-3 w-px bg-white/10" />

              <Link
                href="tel:+919555787844"
                className="flex items-center gap-2 text-[10px] font-medium text-white/55 transition hover:text-[var(--primary)]"
              >
                <IconPhone size={13} />
                +91 9555787844
              </Link>
            </div>

            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
              <IconShieldCheck size={13} />
              Secure currency platform
            </span>
          </div>
        </div>

        <nav className="border-b border-[#e8e4dc] bg-white">
          <div className="mx-auto flex min-h-[78px] max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6 xl:px-8">
            <Link
              href="/"
              className="shrink-0 text-[25px] font-black tracking-[-0.06em] text-[#1d1b18] sm:text-[28px]"
            >
              Veyra
              <span className="text-[var(--primary)]">
                .
              </span>
            </Link>

            <div className="ml-auto hidden h-full items-center lg:flex">
              <Link
                href="/"
                className="relative flex h-full items-center px-4 text-[13px] font-bold text-[#514d46] transition hover:text-[var(--primary)]"
              >
                Home
              </Link>

              <Link
                href="/exchange-rates"
                className="relative flex h-full items-center px-4 text-[13px] font-bold text-[#514d46] transition hover:text-[var(--primary)]"
              >
                Exchange Rates
              </Link>

              {Object.entries(
                dropdownData
              ).map(([title, data]) => {
                const active =
                  activeMenu === title;

                return (
                  <div
                    key={title}
                    className="relative h-full"
                    onMouseEnter={() =>
                      openMenu(title)
                    }
                    onMouseLeave={
                      delayedClose
                    }
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        if (active) {
                          setActiveMenu(
                            null
                          );
                        } else {
                          openMenu(title);
                        }
                      }}
                      className={`flex h-full items-center gap-1.5 px-4 text-[13px] font-bold transition ${
                        active
                          ? "text-[var(--primary)]"
                          : "text-[#514d46] hover:text-[var(--primary)]"
                      }`}
                    >
                      {title}

                      <IconChevronDown
                        size={14}
                        className={`transition-transform ${
                          active
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {active && (
                      <div
                        onMouseEnter={
                          keepMenuOpen
                        }
                        onMouseLeave={
                          delayedClose
                        }
                      >
                        <DesktopDropdown
                          title={title}
                          data={data}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                href="/business"
                className="px-4 text-[13px] font-bold text-[#514d46] transition hover:text-[var(--primary)]"
              >
                Business
              </Link>
            </div>

            <div className="ml-auto flex min-w-0 items-center gap-1 lg:ml-5">
              <CurrencyDropdown />

              <form
                onSubmit={submitSearch}
                className="hidden h-10 w-[190px] items-center rounded-xl border border-[#e2ded7] bg-[#faf9f6] px-3 transition focus-within:border-[var(--primary)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--primary)]/10 xl:flex"
              >
                <IconSearch
                  size={17}
                  className="shrink-0 text-[var(--primary)]"
                />

                <input
                  ref={desktopSearchRef}
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search..."
                  aria-label="Search"
                  className="ml-2 min-w-0 flex-1 bg-transparent text-[11px] font-semibold text-[#292722] outline-none placeholder:text-[#aaa59d]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    aria-label="Clear search"
                    className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#aaa59d] transition hover:bg-[#eeeae4] hover:text-[#514d46]"
                  >
                    <IconX size={13} />
                  </button>
                )}
              </form>

              <button
                type="button"
                aria-label="Search"
                onClick={focusSearch}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-[#555149] transition hover:bg-[#f4f1ec] hover:text-[var(--primary)] xl:hidden"
              >
                <IconSearch size={20} />
              </button>

              <CartButton />

              <button
                type="button"
                onClick={openLogin}
                className="hidden h-10 items-center gap-1.5 rounded-xl px-3 text-[11px] font-extrabold text-[#514d46] transition hover:bg-[#f4f1ec] hover:text-[var(--primary)] md:flex"
              >
                <IconUser size={17} />
                Sign In
              </button>

              <Link
                href="/currency-converter"
                className="hidden h-11 items-center gap-2 rounded-xl bg-[#171816] px-5 text-[9px] font-extrabold uppercase tracking-[0.11em] text-[var(--primary)] shadow-[0_8px_22px_rgba(20,18,15,0.12)] transition hover:-translate-y-0.5 hover:bg-[#292a27] md:flex"
              >
                Convert Now
                <IconArrowRight size={14} />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenu(true);
                  setActiveMenu(null);
                }}
                aria-label="Open mobile menu"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2ded7] text-[#403d37] transition hover:border-[var(--primary)] hover:text-[var(--primary)] sm:h-11 sm:w-11 lg:hidden"
              >
                <IconMenu2 size={21} />
              </button>
            </div>
          </div>

          <div className="border-t border-[#eeeae4] px-4 py-2 xl:hidden">
            <form
              onSubmit={submitSearch}
              className="mx-auto flex h-11 max-w-[1400px] items-center rounded-xl border border-[#e2ded7] bg-[#faf9f6] px-3 transition focus-within:border-[var(--primary)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--primary)]/10"
            >
              <IconSearch
                size={17}
                className="shrink-0 text-[var(--primary)]"
              />

              <input
                ref={mobileSearchRef}
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search currencies, rates, transfers..."
                aria-label="Mobile search"
                className="ml-2 min-w-0 flex-1 bg-transparent text-[11px] font-semibold text-[#292722] outline-none placeholder:text-[#aaa59d]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#aaa59d] hover:bg-[#eeeae4]"
                >
                  <IconX size={14} />
                </button>
              )}
            </form>
          </div>
        </nav>

        <div className="hidden border-b border-[#eeeae4] bg-[#faf9f6] lg:block">
          <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-center gap-7 px-6 text-[8px] font-bold uppercase tracking-[0.08em] text-[#918c84]">
            <span className="flex items-center gap-1.5">
              <IconTrendingUp
                size={13}
                className="text-[var(--primary)]"
              />
              Live Rates
            </span>

            <span className="h-3 w-px bg-[#ddd8d0]" />

            <span className="flex items-center gap-1.5">
              <IconShieldCheck
                size={13}
                className="text-[var(--primary)]"
              />
              Secure Transfers
            </span>

            <span className="h-3 w-px bg-[#ddd8d0]" />

            <span className="flex items-center gap-1.5">
              <IconGlobe
                size={13}
                className="text-[var(--primary)]"
              />
              Global Currencies
            </span>
          </div>
        </div>
      </header>

      <LoginModal
        open={loginOpen}
        onClose={() =>
          setLoginOpen(false)
        }
      />

      <MobileMenu
        open={mobileMenu}
        onClose={() =>
          setMobileMenu(false)
        }
        onLogin={openLogin}
      />
    </>
  );
}