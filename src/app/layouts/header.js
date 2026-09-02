"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  IconArrowRight,
  IconArrowsExchange,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
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
  const allHref =
    title === "Currencies"
      ? "/currencies"
      : title === "Send Money"
        ? "/send-money"
        : "/resources";

  return (
    <div className="absolute left-1/2 top-full z-[3000] w-[min(620px,calc(100vw-32px))] -translate-x-1/2 pt-2">
      <div className="overflow-hidden rounded-[22px] border border-[#e6e2db] bg-white shadow-[0_25px_80px_rgba(30,27,22,0.16)]">
        <div className="grid grid-cols-[190px_1fr]">
          <div className="bg-[#171816] p-6 text-white">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-[var(--primary)]">
              Explore
            </span>

            <h3 className="mt-2 text-[24px] font-black tracking-[-0.035em]">
              {title}
            </h3>

            <p className="mt-3 text-[10px] leading-5 tracking-[0.01em] text-white/40">
              Simple tools and services designed for your global currency
              needs.
            </p>

            <Link
              href={allHref}
              className="group mt-7 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]"
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
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">
                  Services
                </span>

                <h4 className="mt-1 text-[17px] font-black tracking-[-0.02em] text-[#292722]">
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

                    <p className="mt-3 text-[11px] font-extrabold tracking-[0.01em] text-[#35322c] group-hover:text-[var(--primary)]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[8px] leading-4 tracking-[0.01em] text-[#99958d]">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#eeeae4] bg-[#faf9f6] px-5 py-3">
          <div className="flex items-center gap-2 text-[8px] font-semibold tracking-[0.02em] text-[#99958d]">
            <IconShieldCheck
              size={13}
              className="text-[var(--primary)]"
            />

            Secure & transparent platform
          </div>

          <Link
            href="/help"
            className="text-[8px] font-extrabold tracking-[0.03em] text-[#69645c] transition hover:text-[var(--primary)]"
          >
            Need help?
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoginModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
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

          <p className="mt-1.5 text-[10px] leading-5 tracking-[0.01em] text-white/40">
            Sign in to manage your currency tools and transfers.
          </p>
        </div>

        <form
          className="p-6 sm:p-8"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="mb-2 block text-[10px] font-extrabold tracking-[0.02em] text-[#514d46]">
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

          <label className="mb-2 mt-5 block text-[10px] font-extrabold tracking-[0.02em] text-[#514d46]">
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
              className="text-[9px] font-extrabold tracking-[0.02em] text-[var(--primary)]"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-[var(--primary)] text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--primary-hover)]"
          >
            Sign In

            <IconArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          <p className="mt-5 text-center text-[10px] tracking-[0.01em] text-[#99958d]">
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
      <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-[#eeeae4] px-4 sm:px-5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f1ed]"
        >
          <IconChevronLeft size={19} />
        </button>

        <div className="min-w-0">
          <span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">
            Explore
          </span>

          <h3 className="truncate text-[17px] font-black tracking-[-0.02em] text-[#292722]">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f1ed]"
        >
          <IconX size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
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
                  <p className="text-[12px] font-extrabold tracking-[0.01em] text-[#35322d]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 tracking-[0.01em] text-[#99958d]">
                    {item.description}
                  </p>
                </div>

                <IconChevronRight
                  size={16}
                  className="shrink-0 text-[#aaa59d]"
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
        open ? "pointer-events-auto" : "pointer-events-none"
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
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`absolute inset-0 flex flex-col bg-white transition-transform duration-300 ${
            submenu ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#eeeae4] px-4 sm:px-5">
            <Link
              href="/"
              onClick={onClose}
              className="text-[25px] font-black tracking-[-0.06em]"
            >
              Veyra
              <span className="text-[var(--primary)]">.</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f1ed]"
            >
              <IconX size={19} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
            <div className="rounded-[21px] bg-[#171816] p-5 text-white">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.22em] text-[var(--primary)]">
                Currency platform
              </span>

              <h3 className="mt-2 text-[22px] font-black leading-tight tracking-[-0.035em]">
                Smarter currency.
                <br />
                Simpler transfers.
              </h3>

              <p className="mt-2 text-[9px] leading-4 tracking-[0.01em] text-white/40">
                Everything you need to manage global currencies.
              </p>
            </div>

            <div className="mt-5 space-y-1">
              {[
                ["Home", "/"],
                ["Exchange Rates", "/exchange-rates"],
                ["Business", "/business"],
                ["About", "/about"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex min-h-[52px] items-center justify-between rounded-xl px-3 text-[13px] font-bold tracking-[0.01em] transition hover:bg-[#f5f3ef]"
                >
                  {label}
                  <IconChevronRight size={16} />
                </Link>
              ))}

              {Object.entries(dropdownData).map(([title, data]) => (
                <button
                  type="button"
                  key={title}
                  onClick={() => setSubmenu(title)}
                  className="flex min-h-[52px] w-full items-center justify-between rounded-xl px-3 text-left text-[13px] font-bold tracking-[0.01em] transition hover:bg-[#f5f3ef]"
                >
                  {title}
                  <IconChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 border-t border-[#eeeae4] bg-white p-4 sm:p-5">
            <button
              type="button"
              onClick={onLogin}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#e2ded7] text-[10px] font-extrabold uppercase tracking-[0.14em]"
            >
              <IconUser size={16} />
              Sign In
            </button>

            <Link
              href="/currency-converter"
              onClick={onClose}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-[10px] font-extrabold uppercase tracking-[0.14em] text-white"
            >
              Convert Now
              <IconArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div
          className={`absolute inset-0 bg-white transition-transform duration-300 ${
            submenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {submenu && (
            <MobileSubMenu
              title={submenu}
              data={dropdownData[submenu]}
              onBack={() => setSubmenu(null)}
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

  useEffect(() => {
    const handleOutside = (event) => {
      if (!event.target.closest("[data-currency-dropdown]")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  return (
    <div data-currency-dropdown className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-[11px] font-extrabold tracking-[0.02em] text-[#555149] transition hover:bg-[#f4f1ec] hover:text-[var(--primary)]"
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
          {currencies.map(([code, name, CurrencyIcon]) => (
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
                <span className="block text-[10px] font-extrabold tracking-[0.03em]">
                  {code}
                </span>

                <span className="block text-[8px] tracking-[0.01em] text-[#99958d]">
                  {name}
                </span>
              </span>

              {currency === code && (
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
              )}
            </button>
          ))}
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
        if (window.innerWidth >= 1024) {
          setOpen(false);
        }
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    if (window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    }

    const handleResize = () => {
      document.body.style.overflow =
        window.innerWidth < 1024 && open ? "hidden" : "";
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  const getProductPrice = (item) => {
    const price = Number(item?.price || 0);
    const discountPrice = Number(item?.discount_price || 0);

    if (discountPrice > 0 && discountPrice < price) {
      return discountPrice;
    }

    return price;
  };

  const getImageUrl = (image) => {
    if (!image) return null;

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const baseUrl = apiUrl
      .replace(/\/api\/?$/, "")
      .replace(/\/+$/, "");

    return `${baseUrl}/${image.replace(/^\/+/, "")}`;
  };

  const formatPrice = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const closeCart = () => {
    setOpen(false);
  };

  return (
    <div ref={cartRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Cart with ${cartCount} items`}
        aria-expanded={open}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
          open
            ? "bg-[#171816] text-[var(--primary)]"
            : "text-[#555149] hover:bg-[#f4f1ec] hover:text-[var(--primary)]"
        }`}
      >
        <IconShoppingCart size={20} stroke={1.9} />

        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[8px] font-black leading-none text-white shadow-sm ring-2 ring-white">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="fixed inset-0 z-[9990] hidden bg-black/20 backdrop-blur-[1px] lg:block"
          />

          <div
            className="
              fixed
              left-0
              right-0
              top-0
              z-[10000]
              flex
              max-h-[92dvh]
              flex-col
              overflow-hidden
              rounded-b-[26px]
              border-b
              border-[#e4dfd7]
              bg-white
              shadow-[0_25px_70px_rgba(25,23,19,0.20)]

              lg:absolute
              lg:left-auto
              lg:right-0
              lg:top-[calc(100%+14px)]
              lg:w-[430px]
              lg:max-h-[min(690px,calc(100vh-110px))]
              lg:rounded-[26px]
              lg:border
              lg:shadow-[0_30px_90px_rgba(25,23,19,0.20)]
            "
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#eee9e1] bg-white px-4 py-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#171816] text-[var(--primary)]">
                  <IconShoppingBag size={20} stroke={1.8} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-black tracking-[-0.02em] text-[#292721]">
                      Your Cart
                    </h3>

                    {cartCount > 0 && (
                      <span className="rounded-full bg-[#f3f0ea] px-2 py-0.5 text-[8px] font-black tracking-[0.03em] text-[#6f695f]">
                        {cartCount}
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-[9px] tracking-[0.01em] text-[#9a948b]">
                    {cartCount > 0
                      ? `${cartCount} ${
                          cartCount === 1 ? "item" : "items"
                        } ready for checkout`
                      : "Your shopping bag is waiting"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5f2ed] text-[#777168] transition hover:bg-[#eeeae4] hover:text-[#292721]"
              >
                <IconX size={16} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center px-6 py-10 text-center">
                <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[24px] bg-[#f6f3ed] text-[#aaa49b]">
                  <IconShoppingBag size={32} stroke={1.5} />
                </div>

                <h4 className="mt-5 text-[16px] font-black tracking-[-0.025em] text-[#292721]">
                  Your cart is empty
                </h4>

                <p className="mt-2 max-w-[260px] text-[9px] leading-5 tracking-[0.01em] text-[#938d84]">
                  Looks like you haven't added anything yet. Explore our
                  products and find something you love.
                </p>

                <Link
                  href="/products"
                  onClick={closeCart}
                  className="group mt-6 flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_8px_22px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]"
                >
                  Shop Products

                  <IconArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#faf9f6] px-3 py-3 sm:px-4 sm:py-4 lg:max-h-[390px]">
                  <div className="space-y-2.5">
                    {cartItems.map((item) => {
                      const imageUrl = getImageUrl(item.image);
                      const price = getProductPrice(item);
                      const originalPrice = Number(item?.price || 0);
                      const quantity = Math.max(
                        1,
                        Number(item.quantity || 1)
                      );
                      const subtotal = price * quantity;
                      const hasDiscount = originalPrice > price;

                      return (
                        <div
                          key={item.id}
                          className="group overflow-hidden rounded-[19px] border border-[#ebe6de] bg-white p-3 transition-all duration-200 hover:border-[#dcd5cb] hover:shadow-[0_8px_25px_rgba(35,31,25,0.06)]"
                        >
                          <div className="flex gap-3">
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={closeCart}
                              className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-[15px] bg-[#f3f0ea] sm:h-[84px] sm:w-[84px]"
                            >
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={item.name || "Product"}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#aaa49a]">
                                  <IconShoppingBag
                                    size={26}
                                    stroke={1.5}
                                  />
                                </div>
                              )}

                              {hasDiscount && (
                                <span className="absolute left-1.5 top-1.5 rounded-md bg-[var(--primary)] px-1.5 py-1 text-[6px] font-black uppercase tracking-[0.06em] text-white">
                                  Sale
                                </span>
                              )}
                            </Link>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <Link
                                    href={`/products/${item.slug}`}
                                    onClick={closeCart}
                                    className="line-clamp-2 text-[10px] font-black leading-[1.45] tracking-[0.005em] text-[#292721] transition hover:text-[var(--primary)] sm:text-[11px]"
                                  >
                                    {item.name}
                                  </Link>

                                  {item.sku && (
                                    <p className="mt-1 truncate text-[7px] font-bold uppercase tracking-[0.1em] text-[#aaa49a]">
                                      SKU: {item.sku}
                                    </p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFromCart(item.id)
                                  }
                                  aria-label={`Remove ${
                                    item.name || "product"
                                  }`}
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#aaa49a] transition hover:bg-red-50 hover:text-red-500"
                                >
                                  <IconX size={13} stroke={1.8} />
                                </button>
                              </div>

                              <div className="mt-3 flex items-end justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[12px] font-black tracking-[-0.015em] text-[#292721] sm:text-[13px]">
                                      ₹{formatPrice(price)}
                                    </span>

                                    {hasDiscount && (
                                      <span className="text-[8px] font-medium tracking-[0.01em] text-[#aaa39a] line-through">
                                        ₹{formatPrice(originalPrice)}
                                      </span>
                                    )}
                                  </div>

                                  {quantity > 1 && (
                                    <p className="mt-0.5 text-[7px] tracking-[0.01em] text-[#aaa49a]">
                                      ₹{formatPrice(price)} each
                                    </p>
                                  )}
                                </div>

                                <div className="flex h-8 items-center overflow-hidden rounded-[9px] border border-[#e1dcd4] bg-[#faf9f6]">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      decreaseQuantity(item.id)
                                    }
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                    className="flex h-8 w-8 items-center justify-center text-[#625d55] transition hover:bg-[#eeeae4] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-35"
                                  >
                                    <IconMinus size={11} stroke={2} />
                                  </button>

                                  <span className="flex h-8 min-w-[27px] items-center justify-center border-x border-[#e1dcd4] bg-white px-1 text-[9px] font-black text-[#292721]">
                                    {quantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      increaseQuantity(item.id)
                                    }
                                    aria-label="Increase quantity"
                                    className="flex h-8 w-8 items-center justify-center text-[#625d55] transition hover:bg-[#eeeae4] hover:text-[var(--primary)]"
                                  >
                                    <IconPlus size={11} stroke={2} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-[#f0ece5] pt-2.5">
                            <span className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#aaa39a]">
                              Item total
                            </span>

                            <span className="text-[10px] font-black tracking-[0.01em] text-[#292721]">
                              ₹{formatPrice(subtotal)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="shrink-0 border-t border-[#e8e3db] bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 sm:px-5">
                  <div className="flex items-end justify-between gap-4 rounded-[17px] bg-[#faf8f4] p-3.5">
                    <div>
                      <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-[#938d84]">
                        Order summary
                      </p>

                      <div className="mt-1.5 flex items-center gap-1.5 text-[8px] tracking-[0.01em] text-[#aaa39a]">
                        <IconShieldCheck
                          size={12}
                          className="text-[var(--primary)]"
                        />
                        <span>Secure checkout</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8d877e]">
                        Subtotal
                      </p>

                      <p className="mt-0.5 text-[18px] font-black tracking-[-0.035em] text-[#292721]">
                        ₹{formatPrice(cartTotal)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="flex h-11 items-center justify-center rounded-[13px] border border-[#ddd8d0] bg-white text-[8px] font-extrabold uppercase tracking-[0.13em] text-[#625e56] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      View Cart
                    </Link>

                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="group flex h-11 items-center justify-center gap-2 rounded-[13px] bg-[var(--primary)] text-[8px] font-extrabold uppercase tracking-[0.13em] text-white shadow-[0_10px_25px_rgba(0,0,0,0.10)] transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]"
                    >
                      Checkout

                      <IconArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const closeTimer = useRef(null);

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
    }, 120);
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

  const closeAll = () => {
    setActiveMenu(null);
    setMobileMenu(false);
    setLoginOpen(false);
  };

  const submitSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) return;

    window.location.href = `/search?q=${encodeURIComponent(value)}`;
  };

  const focusSearch = () => {
    if (window.innerWidth >= 1280) {
      desktopSearchRef.current?.focus();
    } else {
      mobileSearchRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeAll();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      loginOpen || mobileMenu ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [loginOpen, mobileMenu]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
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
                className="flex items-center gap-2 text-[10px] font-medium tracking-[0.01em] text-white/55 transition hover:text-[var(--primary)]"
              >
                <IconMail size={13} />
                globaltechnext@gmail.com
              </Link>

              <span className="h-3 w-px bg-white/10" />

              <Link
                href="tel:+919555787844"
                className="flex items-center gap-2 text-[10px] font-medium tracking-[0.02em] text-white/55 transition hover:text-[var(--primary)]"
              >
                <IconPhone size={13} />
                +91 9555787844
              </Link>
            </div>

            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
              <IconShieldCheck size={13} />
              Secure currency platform
            </span>
          </div>
        </div>

        <nav className="border-b border-[#e8e4dc] bg-white">
          <div className="mx-auto flex min-h-[72px] max-w-[1400px] items-center gap-2 px-3 py-2.5 sm:min-h-[78px] sm:gap-3 sm:px-6 sm:py-3 xl:px-8">
            <Link
              href="/"
              className="shrink-0 text-[24px] font-black tracking-[-0.06em] text-[#1d1b18] sm:text-[28px]"
            >
              Veyra
              <span className="text-[var(--primary)]">.</span>
            </Link>

            <div className="ml-auto hidden h-full items-center lg:flex">
              <Link
                href="/"
                className="relative flex h-full items-center px-3 text-[13px] font-bold tracking-[0.005em] text-[#514d46] transition hover:text-[var(--primary)] xl:px-4"
              >
                Home
              </Link>

              <Link
                href="/exchange-rates"
                className="relative flex h-full items-center px-3 text-[13px] font-bold tracking-[0.005em] text-[#514d46] transition hover:text-[var(--primary)] xl:px-4"
              >
                Exchange Rates
              </Link>

              {Object.entries(dropdownData).map(([title, data]) => {
                const active = activeMenu === title;

                return (
                  <div
                    key={title}
                    className="relative flex h-full items-center"
                    onMouseEnter={() => openMenu(title)}
                    onMouseLeave={delayedClose}
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        if (active) {
                          setActiveMenu(null);
                        } else {
                          openMenu(title);
                        }
                      }}
                      className={`flex h-full items-center gap-1.5 px-3 text-[13px] font-bold tracking-[0.005em] transition xl:px-4 ${
                        active
                          ? "text-[var(--primary)]"
                          : "text-[#514d46] hover:text-[var(--primary)]"
                      }`}
                    >
                      {title}

                      <IconChevronDown
                        size={14}
                        className={`transition-transform ${
                          active ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {active && (
                      <div
                        className="absolute left-1/2 top-full h-auto -translate-x-1/2 pt-2"
                        onMouseEnter={keepMenuOpen}
                        onMouseLeave={delayedClose}
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
                className="px-3 text-[13px] font-bold tracking-[0.005em] text-[#514d46] transition hover:text-[var(--primary)] xl:px-4"
              >
                Business
              </Link>
            </div>

            <div className="ml-auto flex min-w-0 items-center gap-0.5 sm:gap-1 lg:ml-5">
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
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search..."
                  aria-label="Search"
                  className="ml-2 min-w-0 flex-1 bg-transparent text-[11px] font-semibold tracking-[0.01em] text-[#292722] outline-none placeholder:text-[#aaa59d]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
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
                className="hidden h-10 items-center gap-1.5 rounded-xl px-3 text-[11px] font-extrabold tracking-[0.02em] text-[#514d46] transition hover:bg-[#f4f1ec] hover:text-[var(--primary)] md:flex"
              >
                <IconUser size={17} />

                <span className="hidden xl:inline">Sign In</span>
              </button>

              <Link
                href="/currency-converter"
                className="hidden h-11 items-center gap-2 rounded-xl bg-[#171816] px-4 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)] shadow-[0_8px_22px_rgba(20,18,15,0.12)] transition hover:-translate-y-0.5 hover:bg-[#292a27] xl:flex xl:px-5"
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

          <div className="border-t border-[#eeeae4] px-3 py-2 xl:hidden sm:px-4">
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search currencies, rates, transfers..."
                aria-label="Mobile search"
                className="ml-2 min-w-0 flex-1 bg-transparent text-[11px] font-semibold tracking-[0.01em] text-[#292722] outline-none placeholder:text-[#aaa59d]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
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
          <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-center gap-7 px-6 text-[8px] font-bold uppercase tracking-[0.11em] text-[#918c84]">
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
        onClose={() => setLoginOpen(false)}
      />

      <MobileMenu
        open={mobileMenu}
        onClose={() => setMobileMenu(false)}
        onLogin={openLogin}
      />
    </>
  );
}
