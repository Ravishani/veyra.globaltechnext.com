"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconCreditCard,
  IconLock,
  IconMinus,
  IconPackage,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconShoppingBag,
  IconTruck,
  IconX,
} from "@tabler/icons-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
];

const COUNTRIES = [
  { name: "India", code: "+91", iso: "IN", flag: "🇮🇳", digits: 10 },
  { name: "United States", code: "+1", iso: "US", flag: "🇺🇸", digits: 10 },
  { name: "Canada", code: "+1", iso: "CA", flag: "🇨🇦", digits: 10 },
  { name: "United Kingdom", code: "+44", iso: "GB", flag: "🇬🇧", digits: 10 },
  { name: "United Arab Emirates", code: "+971", iso: "AE", flag: "🇦🇪", digits: 9 },
  { name: "Saudi Arabia", code: "+966", iso: "SA", flag: "🇸🇦", digits: 9 },
  { name: "Australia", code: "+61", iso: "AU", flag: "🇦🇺", digits: 9 },
  { name: "Germany", code: "+49", iso: "DE", flag: "🇩🇪", digits: 10 },
  { name: "France", code: "+33", iso: "FR", flag: "🇫🇷", digits: 9 },
  { name: "Singapore", code: "+65", iso: "SG", flag: "🇸🇬", digits: 8 },
  { name: "Malaysia", code: "+60", iso: "MY", flag: "🇲🇾", digits: 9 },
  { name: "Qatar", code: "+974", iso: "QA", flag: "🇶🇦", digits: 8 },
  { name: "Kuwait", code: "+965", iso: "KW", flag: "🇰🇼", digits: 8 },
  { name: "Oman", code: "+968", iso: "OM", flag: "🇴🇲", digits: 8 },
  { name: "Bahrain", code: "+973", iso: "BH", flag: "🇧🇭", digits: 8 },
  { name: "South Africa", code: "+27", iso: "ZA", flag: "🇿🇦", digits: 9 },
  { name: "New Zealand", code: "+64", iso: "NZ", flag: "🇳🇿", digits: 9 },
  { name: "Japan", code: "+81", iso: "JP", flag: "🇯🇵", digits: 10 },
  { name: "China", code: "+86", iso: "CN", flag: "🇨🇳", digits: 11 },
];

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getImageUrl(image) {
  if (!image) return null;

  const imageValue = String(image).trim();

  if (!imageValue) return null;

  if (
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://")
  ) {
    return imageValue;
  }

  const laravelUrl = API_URL
    ?.replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

  if (!laravelUrl) return null;

  return `${laravelUrl}/${imageValue.replace(/^\/+/, "")}`;
}

function getProductPrice(product) {
  const price = Number(product?.price || 0);
  const discountPrice = Number(product?.discount_price || 0);

  if (discountPrice > 0 && discountPrice < price) {
    return discountPrice;
  }

  return price;
}

function getDiscount(product) {
  const price = Number(product?.price || 0);
  const discountPrice = Number(product?.discount_price || 0);

  if (!price || !discountPrice || discountPrice >= price) {
    return 0;
  }

  return Math.round(((price - discountPrice) / price) * 100);
}

function getInitialProduct() {
  if (typeof window === "undefined") return null;

  const keys = [
    "buyNowProduct",
    "checkoutProduct",
    "buyNow",
  ];

  for (const key of keys) {
    const storedProduct = localStorage.getItem(key);

    if (!storedProduct) continue;

    try {
      const parsedProduct = JSON.parse(storedProduct);

      if (parsedProduct?.id) {
        return parsedProduct;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function FieldLabel({ children }) {
  return (
    <label className="mb-2.5 block text-[12px] font-extrabold tracking-[0.01em] text-[#403b36]">
      {children}
      <span className="ml-1 text-[#ff7200]">*</span>
    </label>
  );
}

function FieldError({ children }) {
  if (!children) return null;

  return (
    <p className="mt-2 text-[11px] font-semibold leading-5 text-red-500">
      {children}
    </p>
  );
}

export default function CheckoutPage() {
  const [product, setProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const [stateOpen, setStateOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");

  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES[0]
  );

  const stateDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);

  useEffect(() => {
    const savedProduct = getInitialProduct();

    if (!savedProduct) {
      window.location.href = "/products";
      return;
    }

    setProduct(savedProduct);

    setQuantity(
      Math.max(1, Number(savedProduct.quantity || 1))
    );
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target)
      ) {
        setStateOpen(false);
      }

      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setCountryOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setStateOpen(false);
        setCountryOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const filteredStates = useMemo(() => {
    const search = stateSearch.trim().toLowerCase();

    if (!search) {
      return INDIAN_STATES;
    }

    return INDIAN_STATES.filter((state) =>
      state.toLowerCase().includes(search)
    );
  }, [stateSearch]);

  const filteredCountries = useMemo(() => {
    const search = countrySearch.trim().toLowerCase();

    if (!search) {
      return COUNTRIES;
    }

    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(search) ||
        country.code.includes(search) ||
        country.iso.toLowerCase().includes(search)
    );
  }, [countrySearch]);

  const unitPrice = useMemo(
    () => getProductPrice(product),
    [product]
  );

  const originalPrice = useMemo(
    () => Number(product?.price || 0),
    [product]
  );

  const discount = useMemo(
    () => getDiscount(product),
    [product]
  );

  const subtotal = useMemo(
    () => unitPrice * quantity,
    [unitPrice, quantity]
  );

  const deliveryCharge = useMemo(
    () => (subtotal >= 999 ? 0 : 49),
    [subtotal]
  );

  const total = useMemo(
    () => subtotal + deliveryCharge,
    [subtotal, deliveryCharge]
  );

  const totalSavings = useMemo(() => {
    if (
      originalPrice > 0 &&
      unitPrice > 0 &&
      unitPrice < originalPrice
    ) {
      return (
        (originalPrice - unitPrice) *
        quantity
      );
    }

    return 0;
  }, [
    originalPrice,
    unitPrice,
    quantity,
  ]);

  const imageUrl = useMemo(
    () => getImageUrl(product?.image),
    [product]
  );

  const updateQuantity = (value) => {
    if (value < 1) return;

    setQuantity(value);

    if (product) {
      const updatedProduct = {
        ...product,
        quantity: value,
      };

      setProduct(updatedProduct);

      localStorage.setItem(
        "buyNowProduct",
        JSON.stringify(updatedProduct)
      );

      localStorage.setItem(
        "checkoutProduct",
        JSON.stringify(updatedProduct)
      );

      localStorage.setItem(
        "buyNow",
        JSON.stringify(updatedProduct)
      );
    }
  };

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    let nextValue = value;

    if (
      name === "phone" ||
      name === "pincode"
    ) {
      nextValue = value.replace(/\D/g, "");
    }

    setForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);

    setCountryOpen(false);
    setCountrySearch("");

    setForm((previous) => ({
      ...previous,
      phone: "",
    }));

    setErrors((previous) => ({
      ...previous,
      phone: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[0-9]+$/.test(form.phone) ||
      form.phone.length !==
        selectedCountry.digits
    ) {
      newErrors.phone = `Enter a valid ${selectedCountry.digits} digit phone number.`;
    }

    if (!form.address.trim()) {
      newErrors.address =
        "Address is required.";
    }

    if (!form.city.trim()) {
      newErrors.city =
        "City is required.";
    }

    if (!form.state.trim()) {
      newErrors.state =
        "Please select your state.";
    }

    if (!form.pincode.trim()) {
      newErrors.pincode =
        "Pincode is required.";
    } else if (
      !/^[0-9]{6}$/.test(form.pincode)
    ) {
      newErrors.pincode =
        "Enter a valid 6 digit pincode.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setProcessing(true);

    const orderData = {
      product_id: product.id,
      product_name: product.name,
      quantity,
      unit_price: unitPrice,
      subtotal,
      delivery_charge: deliveryCharge,
      total,
      customer: {
        ...form,
        country: selectedCountry.name,
        country_code: selectedCountry.code,
        country_iso: selectedCountry.iso,
        phone: `${selectedCountry.code} ${form.phone}`,
      },
    };

    console.log("Order Data:", orderData);

    setTimeout(() => {
      setProcessing(false);

      alert(
        "Order details submitted successfully."
      );
    }, 1200);
  };

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f1] px-5">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e3ded6] bg-white shadow-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ddd7ce] border-t-[#ff7200]" />
          </div>

          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.16em] text-[#6f6962]">
            Preparing Checkout
          </p>

          <p className="mt-2 text-[13px] text-[#99928a]">
            Please wait a moment...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f5f1] text-[#292622]">
      <header className="sticky top-0 z-50 border-b border-[#e4dfd7] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link
            href={`/products/${product.slug}`}
            className="group inline-flex items-center gap-2.5 rounded-xl px-2 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-[#6f6962] transition hover:bg-[#f8f5f0] hover:text-[#ff7200]"
          >
            <IconArrowLeft
              size={17}
              className="transition group-hover:-translate-x-0.5"
            />

            <span className="hidden sm:inline">
              Back to Product
            </span>

            <span className="sm:hidden">
              Back
            </span>
          </Link>

          <div className="flex items-center gap-2.5 rounded-full border border-[#e4eadf] bg-[#f4faf5] px-3.5 py-2">
            <IconLock
              size={15}
              className="text-[#32824a]"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.09em] text-[#39734a]">
              Secure Checkout
            </span>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-48 -top-32 h-[520px] w-[520px] rounded-full bg-[#ff7200]/[0.055] blur-3xl" />

        <div className="pointer-events-none absolute -left-48 bottom-0 h-[420px] w-[420px] rounded-full bg-[#d6b76e]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#9a938b]">
              <span className="text-[#ff7200]">
                Checkout
              </span>

              <span>/</span>

              <span>
                Delivery Details
              </span>

              <span>/</span>

              <span>
                Payment
              </span>
            </div>

            <h1 className="mt-4 text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-[#292622] sm:text-[46px] lg:text-[52px]">
              Complete Your Purchase
            </h1>

            <p className="mt-3 max-w-2xl text-[14px] leading-7 tracking-[0.01em] text-[#777069] sm:text-[15px]">
              Enter your delivery information,
              review your order, and continue
              securely to payment.
            </p>
          </div>

          <form
            onSubmit={placeOrder}
            className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-10"
          >
            <div className="space-y-6">
              <div className="overflow-visible rounded-[30px] border border-[#e1dcd4] bg-white shadow-[0_20px_60px_rgba(35,32,27,0.06)]">
                <div className="rounded-t-[30px] border-b border-[#ebe6de] bg-gradient-to-r from-white to-[#fcfaf7] px-5 py-6 sm:px-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff2e7] text-[#ff7200] shadow-sm">
                      <IconTruck
                        size={22}
                        stroke={2}
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#a19a92]">
                        Step 01
                      </p>

                      <h2 className="mt-1 text-[21px] font-black tracking-[-0.025em] text-[#292622] sm:text-[23px]">
                        Shipping Information
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-8">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="min-w-0">
                      <FieldLabel>
                        Full Name
                      </FieldLabel>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        className={`h-14 w-full rounded-2xl border bg-[#fcfbf9] px-4 text-[14px] font-semibold text-[#292622] outline-none transition placeholder:font-medium placeholder:text-[#aaa39b] hover:border-[#cfc8bf] focus:bg-white focus:ring-4 focus:ring-[#ff7200]/[0.07] ${
                          errors.name
                            ? "border-red-300 focus:border-red-400"
                            : "border-[#ddd8d0] focus:border-[#ff7200]"
                        }`}
                      />

                      <FieldError>
                        {errors.name}
                      </FieldError>
                    </div>

                    <div className="min-w-0">
                      <FieldLabel>
                        Email Address
                      </FieldLabel>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={`h-14 w-full min-w-0 rounded-2xl border bg-[#fcfbf9] px-4 text-[14px] font-semibold text-[#292622] outline-none transition placeholder:font-medium placeholder:text-[#aaa39b] hover:border-[#cfc8bf] focus:bg-white focus:ring-4 focus:ring-[#ff7200]/[0.07] ${
                          errors.email
                            ? "border-red-300 focus:border-red-400"
                            : "border-[#ddd8d0] focus:border-[#ff7200]"
                        }`}
                      />

                      <FieldError>
                        {errors.email}
                      </FieldError>
                    </div>

                    <div
                      ref={countryDropdownRef}
                      className="relative min-w-0"
                    >
                      <FieldLabel>
                        Phone Number
                      </FieldLabel>

                      <div
                        className={`flex h-14 min-w-0 w-full overflow-visible rounded-2xl border bg-[#fcfbf9] transition ${
                          errors.phone
                            ? "border-red-300"
                            : countryOpen
                              ? "border-[#ff7200] ring-4 ring-[#ff7200]/[0.07]"
                              : "border-[#ddd8d0] hover:border-[#cfc8bf]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setCountryOpen(
                              (previous) =>
                                !previous
                            );

                            setCountrySearch("");
                            setStateOpen(false);
                          }}
                          className="flex h-full w-[104px] shrink-0 items-center gap-1.5 border-r border-[#e3ded6] bg-[#f7f4ef] px-2.5 transition hover:bg-[#f1ece5] sm:w-[116px] sm:gap-2 sm:px-3"
                        >
                          <span className="flex h-7 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-white text-[19px] leading-none shadow-sm sm:text-[20px]">
                            {selectedCountry.flag}
                          </span>

                          <span className="min-w-0 shrink-0 text-[12px] font-black tracking-tight text-[#514b45] sm:text-[13px]">
                            {selectedCountry.code}
                          </span>

                          <IconChevronDown
                            size={14}
                            stroke={2}
                            className={`ml-auto shrink-0 text-[#817a72] transition ${
                              countryOpen
                                ? "rotate-180 text-[#ff7200]"
                                : ""
                            }`}
                          />
                        </button>

                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          maxLength={
                            selectedCountry.digits
                          }
                          inputMode="numeric"
                          placeholder={`Enter ${selectedCountry.digits} digit number`}
                          autoComplete="tel"
                          className="h-full min-w-0 flex-1 overflow-hidden rounded-r-2xl bg-transparent px-3 text-[13px] font-semibold text-[#292622] outline-none placeholder:truncate placeholder:font-medium placeholder:text-[#aaa39b] sm:px-4 sm:text-[14px]"
                        />
                      </div>

                      {countryOpen && (
                        <div className="absolute left-0 top-[calc(100%+10px)] z-[100] w-full max-w-[calc(100vw-32px)] overflow-hidden rounded-[22px] border border-[#ddd8d0] bg-white shadow-[0_24px_70px_rgba(35,32,27,0.18)] sm:w-[360px]">
                          <div className="border-b border-[#ebe6de] bg-[#fcfaf7] p-3">
                            <div className="relative">
                              <IconSearch
                                size={17}
                                stroke={2}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a938b]"
                              />

                              <input
                                type="text"
                                value={countrySearch}
                                onChange={(e) =>
                                  setCountrySearch(
                                    e.target.value
                                  )
                                }
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                                placeholder="Search country or code..."
                                className="h-11 w-full rounded-xl border border-[#ddd8d0] bg-white pl-10 pr-10 text-[13px] font-semibold text-[#292622] outline-none transition placeholder:font-medium placeholder:text-[#aaa39b] focus:border-[#ff7200] focus:ring-4 focus:ring-[#ff7200]/[0.07]"
                                autoFocus
                              />

                              {countrySearch && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCountrySearch("")
                                  }
                                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#8d857c] transition hover:bg-[#f4f0ea] hover:text-[#ff7200]"
                                >
                                  <IconX size={15} />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="checkout-scrollbar max-h-[270px] overflow-y-auto p-2">
                            {filteredCountries.length >
                            0 ? (
                              filteredCountries.map(
                                (country) => {
                                  const selected =
                                    selectedCountry.iso ===
                                    country.iso;

                                  return (
                                    <button
                                      key={country.iso}
                                      type="button"
                                      onClick={() =>
                                        handleCountrySelect(
                                          country
                                        )
                                      }
                                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                                        selected
                                          ? "bg-[#fff2e7]"
                                          : "hover:bg-[#f8f5f0]"
                                      }`}
                                    >
                                      <span className="flex h-9 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f7f4ef] text-[23px]">
                                        {country.flag}
                                      </span>

                                      <span className="min-w-0 flex-1">
                                        <span
                                          className={`block truncate text-[13px] ${
                                            selected
                                              ? "font-black text-[#ff7200]"
                                              : "font-bold text-[#403b36]"
                                          }`}
                                        >
                                          {
                                            country.name
                                          }
                                        </span>

                                        <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9a938b]">
                                          {country.iso}
                                        </span>
                                      </span>

                                      <span className="shrink-0 text-[12px] font-black text-[#686159]">
                                        {
                                          country.code
                                        }
                                      </span>

                                      {selected && (
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#ff7200] text-white">
                                          <IconCheck
                                            size={14}
                                            stroke={2.5}
                                          />
                                        </span>
                                      )}
                                    </button>
                                  );
                                }
                              )
                            ) : (
                              <div className="px-4 py-8 text-center">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f4ef] text-[#918980]">
                                  <IconSearch size={18} />
                                </div>

                                <p className="mt-3 text-[12px] font-black text-[#4b4640]">
                                  No country found
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-[#ebe6de] bg-[#fcfaf7] px-4 py-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9b948c]">
                                Countries
                              </span>

                              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-[#706960] shadow-sm">
                                {
                                  filteredCountries.length
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <FieldError>
                        {errors.phone}
                      </FieldError>
                    </div>

                    <div className="min-w-0">
                      <FieldLabel>
                        Pincode
                      </FieldLabel>

                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="Enter 6 digit pincode"
                        autoComplete="postal-code"
                        className={`h-14 w-full min-w-0 rounded-2xl border bg-[#fcfbf9] px-4 text-[14px] font-semibold text-[#292622] outline-none transition placeholder:font-medium placeholder:text-[#aaa39b] hover:border-[#cfc8bf] focus:bg-white focus:ring-4 focus:ring-[#ff7200]/[0.07] ${
                          errors.pincode
                            ? "border-red-300 focus:border-red-400"
                            : "border-[#ddd8d0] focus:border-[#ff7200]"
                        }`}
                      />

                      <FieldError>
                        {errors.pincode}
                      </FieldError>
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>
                        Complete Address
                      </FieldLabel>

                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={4}
                        placeholder="House / Flat / Street / Area"
                        autoComplete="street-address"
                        className={`w-full resize-none rounded-2xl border bg-[#fcfbf9] px-4 py-4 text-[14px] font-semibold leading-6 text-[#292622] outline-none transition placeholder:font-medium placeholder:text-[#aaa39b] hover:border-[#cfc8bf] focus:bg-white focus:ring-4 focus:ring-[#ff7200]/[0.07] ${
                          errors.address
                            ? "border-red-300 focus:border-red-400"
                            : "border-[#ddd8d0] focus:border-[#ff7200]"
                        }`}
                      />

                      <div className="mt-2 flex justify-between gap-3">
                        <FieldError>
                          {errors.address}
                        </FieldError>

                        <span className="ml-auto text-[10px] font-medium text-[#aaa39b]">
                          Delivery address
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <FieldLabel>
                        City
                      </FieldLabel>

                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        autoComplete="address-level2"
                        className={`h-14 w-full min-w-0 rounded-2xl border bg-[#fcfbf9] px-4 text-[14px] font-semibold text-[#292622] outline-none transition placeholder:font-medium placeholder:text-[#aaa39b] hover:border-[#cfc8bf] focus:bg-white focus:ring-4 focus:ring-[#ff7200]/[0.07] ${
                          errors.city
                            ? "border-red-300 focus:border-red-400"
                            : "border-[#ddd8d0] focus:border-[#ff7200]"
                        }`}
                      />

                      <FieldError>
                        {errors.city}
                      </FieldError>
                    </div>

                    <div
                      ref={stateDropdownRef}
                      className="relative min-w-0"
                    >
                      <FieldLabel>
                        State
                      </FieldLabel>

                      <button
                        type="button"
                        onClick={() => {
                          setStateOpen(
                            (previous) =>
                              !previous
                          );

                          setStateSearch("");
                          setCountryOpen(false);
                        }}
                        className={`flex h-14 w-full min-w-0 items-center justify-between rounded-2xl border bg-white px-4 text-left shadow-[0_3px_12px_rgba(35,32,27,0.025)] outline-none transition duration-200 hover:border-[#c8c0b6] hover:bg-[#fefdfb] focus:ring-4 focus:ring-[#ff7200]/[0.08] ${
                          errors.state
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : stateOpen
                              ? "border-[#ff7200]"
                              : "border-[#ddd8d0]"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                              form.state
                                ? "bg-[#fff2e7] text-[#ff7200]"
                                : "bg-[#f6f3ee] text-[#8d857c]"
                            }`}
                          >
                            <IconTruck
                              size={16}
                              stroke={2}
                            />
                          </div>

                          <span
                            className={`truncate text-[14px] font-semibold ${
                              form.state
                                ? "text-[#292622]"
                                : "text-[#aaa39b]"
                            }`}
                          >
                            {form.state ||
                              "Select your state"}
                          </span>
                        </div>

                        <span
                          className={`ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                            stateOpen
                              ? "rotate-180 bg-[#fff2e7] text-[#ff7200]"
                              : "bg-[#f7f4ef] text-[#686159]"
                          }`}
                        >
                          <IconChevronDown
                            size={17}
                            stroke={2}
                          />
                        </span>
                      </button>

                      {stateOpen && (
                        <div className="absolute left-0 top-[calc(100%+10px)] z-[100] w-full max-w-[calc(100vw-32px)] overflow-hidden rounded-[22px] border border-[#ddd8d0] bg-white shadow-[0_24px_70px_rgba(35,32,27,0.16)]">
                          <div className="border-b border-[#ebe6de] bg-[#fcfaf7] p-3">
                            <div className="relative">
                              <IconSearch
                                size={17}
                                stroke={2}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a938b]"
                              />

                              <input
                                type="text"
                                value={stateSearch}
                                onChange={(e) =>
                                  setStateSearch(
                                    e.target.value
                                  )
                                }
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                                placeholder="Search state..."
                                className="h-11 w-full rounded-xl border border-[#ddd8d0] bg-white pl-10 pr-10 text-[13px] font-semibold text-[#292622] outline-none transition placeholder:font-medium placeholder:text-[#aaa39b] focus:border-[#ff7200] focus:ring-4 focus:ring-[#ff7200]/[0.07]"
                                autoFocus
                              />

                              {stateSearch && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStateSearch("")
                                  }
                                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#8d857c] transition hover:bg-[#f4f0ea] hover:text-[#ff7200]"
                                >
                                  <IconX size={15} />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="checkout-scrollbar max-h-[260px] overflow-y-auto p-2">
                            {filteredStates.length >
                            0 ? (
                              filteredStates.map(
                                (state) => {
                                  const selected =
                                    form.state ===
                                    state;

                                  return (
                                    <button
                                      key={state}
                                      type="button"
                                      onClick={() => {
                                        setForm(
                                          (previous) => ({
                                            ...previous,
                                            state,
                                          })
                                        );

                                        setErrors(
                                          (previous) => ({
                                            ...previous,
                                            state: "",
                                          })
                                        );

                                        setStateOpen(
                                          false
                                        );

                                        setStateSearch(
                                          ""
                                        );
                                      }}
                                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-left transition ${
                                        selected
                                          ? "bg-[#fff2e7] text-[#ff7200]"
                                          : "text-[#4c4741] hover:bg-[#f8f5f0] hover:text-[#ff7200]"
                                      }`}
                                    >
                                      <span
                                        className={`truncate text-[13px] ${
                                          selected
                                            ? "font-black"
                                            : "font-semibold"
                                        }`}
                                      >
                                        {state}
                                      </span>

                                      {selected && (
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#ff7200] text-white">
                                          <IconCheck
                                            size={14}
                                            stroke={2.5}
                                          />
                                        </span>
                                      )}
                                    </button>
                                  );
                                }
                              )
                            ) : (
                              <div className="px-4 py-8 text-center">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f4ef] text-[#918980]">
                                  <IconSearch size={18} />
                                </div>

                                <p className="mt-3 text-[12px] font-black text-[#4b4640]">
                                  No state found
                                </p>

                                <p className="mt-1 text-[11px] text-[#99928a]">
                                  Try searching with another name.
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-[#ebe6de] bg-[#fcfaf7] px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9b948c]">
                                Available States
                              </span>

                              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-[#706960] shadow-sm">
                                {
                                  filteredStates.length
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <FieldError>
                        {errors.state}
                      </FieldError>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-[0_10px_30px_rgba(35,32,27,0.035)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff2e7] text-[#ff7200]">
                    <IconShieldCheck size={21} />
                  </div>

                  <h3 className="mt-4 text-[13px] font-black text-[#292622]">
                    Secure Payment
                  </h3>

                  <p className="mt-1.5 text-[12px] leading-5 text-[#8b847c]">
                    Your payment information stays protected.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-[0_10px_30px_rgba(35,32,27,0.035)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff2e7] text-[#ff7200]">
                    <IconTruck size={21} />
                  </div>

                  <h3 className="mt-4 text-[13px] font-black text-[#292622]">
                    Reliable Delivery
                  </h3>

                  <p className="mt-1.5 text-[12px] leading-5 text-[#8b847c]">
                    Fast and convenient delivery service.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e2ddd5] bg-white p-5 shadow-[0_10px_30px_rgba(35,32,27,0.035)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff2e7] text-[#ff7200]">
                    <IconPackage size={21} />
                  </div>

                  <h3 className="mt-4 text-[13px] font-black text-[#292622]">
                    Quality Packaging
                  </h3>

                  <p className="mt-1.5 text-[12px] leading-5 text-[#8b847c]">
                    Carefully packed for safe delivery.
                  </p>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-[92px] lg:h-fit">
              <div className="overflow-hidden rounded-[28px] border border-[#ded9d1] bg-white shadow-[0_22px_65px_rgba(35,32,27,0.09)]">
                <div className="border-b border-[#e7e2da] bg-[#fcfbf9] px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#a09a92]">
                        Your Order
                      </p>

                      <h2 className="mt-1 text-[21px] font-black tracking-[-0.025em] text-[#292622]">
                        Order Summary
                      </h2>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2e7] text-[#ff7200]">
                      <IconShoppingBag size={20} />
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex gap-4">
                    <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#e1dcd4] bg-[#f5f2ed] p-2 sm:h-[104px] sm:w-[104px]">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <IconPackage
                          size={32}
                          className="text-[#c7c0b7]"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[14px] font-black leading-5 text-[#292622]">
                        {product.name}
                      </p>

                      {product.sku && (
                        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9b948c]">
                          SKU: {product.sku}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex h-10 items-center overflow-hidden rounded-xl border border-[#ddd8d0] bg-[#fcfbf9]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                quantity - 1
                              )
                            }
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="flex h-full w-9 items-center justify-center text-[#5e5851] transition hover:bg-[#f3eee8] hover:text-[#ff7200] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <IconMinus size={14} />
                          </button>

                          <span className="flex h-full min-w-10 items-center justify-center border-x border-[#ddd8d0] px-2 text-[13px] font-black text-[#292622]">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                            className="flex h-full w-9 items-center justify-center text-[#5e5851] transition hover:bg-[#f3eee8] hover:text-[#ff7200]"
                          >
                            <IconPlus size={14} />
                          </button>
                        </div>

                        <p className="text-[15px] font-black text-[#292622]">
                          ₹
                          {formatNumber(
                            unitPrice
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {discount > 0 && (
                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#d9eadc] bg-[#f2faf3] px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#dff1e2] text-[#32824a]">
                          <IconCheck size={15} />
                        </div>

                        <span className="text-[11px] font-black uppercase tracking-[0.08em] text-[#39764b]">
                          Discount Applied
                        </span>
                      </div>

                      <span className="text-[12px] font-black text-[#32824a]">
                        {discount}% OFF
                      </span>
                    </div>
                  )}

                  <div className="my-6 h-px bg-[#e7e2da]" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[13px] font-medium text-[#817a72]">
                        Subtotal
                      </span>

                      <span className="text-[13px] font-bold text-[#292622]">
                        ₹
                        {formatNumber(
                          subtotal
                        )}
                      </span>
                    </div>

                    {totalSavings > 0 && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[13px] font-medium text-[#817a72]">
                          Product Savings
                        </span>

                        <span className="text-[13px] font-bold text-[#32824a]">
                          -₹
                          {formatNumber(
                            totalSavings
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[13px] font-medium text-[#817a72]">
                        Delivery
                      </span>

                      {deliveryCharge ===
                      0 ? (
                        <span className="rounded-full bg-[#edf8ef] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.06em] text-[#32824a]">
                          Free
                        </span>
                      ) : (
                        <span className="text-[13px] font-bold text-[#292622]">
                          ₹
                          {formatNumber(
                            deliveryCharge
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {deliveryCharge > 0 && (
                    <div className="mt-5 rounded-xl bg-[#faf7f2] px-3.5 py-3">
                      <p className="text-[11px] leading-5 text-[#8a837b]">
                        Add{" "}
                        <span className="font-black text-[#292622]">
                          ₹
                          {formatNumber(
                            999 -
                              subtotal
                          )}
                        </span>{" "}
                        more to unlock free
                        delivery.
                      </p>
                    </div>
                  )}

                  <div className="my-6 h-px bg-[#e7e2da]" />

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#9d968e]">
                        Total Amount
                      </p>

                      <p className="mt-1 text-[31px] font-black tracking-[-0.04em] text-[#292622]">
                        ₹
                        {formatNumber(
                          total
                        )}
                      </p>
                    </div>

                    <div className="mb-1 rounded-full border border-[#e2ddd5] bg-[#faf8f5] px-3 py-1.5">
                      <span className="text-[10px] font-black uppercase tracking-[0.08em] text-[#716a63]">
                        INR
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#ff7200] px-5 text-[13px] font-black uppercase tracking-[0.08em] text-white shadow-[0_14px_32px_rgba(255,114,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e96800] hover:shadow-[0_17px_38px_rgba(255,114,0,0.26)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
                  >
                    {processing ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                        Processing...
                      </>
                    ) : (
                      <>
                        <IconCreditCard size={18} />

                        Proceed to Payment

                        <IconArrowRight
                          size={17}
                        />
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <IconLock
                      size={14}
                      className="text-[#32824a]"
                    />

                    <span className="text-[11px] font-semibold text-[#948d85]">
                      Secure & protected checkout
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#e1ddd5] bg-white px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f4f1eb] text-[#6f6860]">
                    <IconShieldCheck size={17} />
                  </div>

                  <div>
                    <p className="text-[12px] font-black text-[#37322d]">
                      Your information is safe
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#928b83]">
                      We use secure checkout technology to protect your information.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#e2ddd5] pt-6">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.06em] text-[#6d665e] transition hover:text-[#ff7200]"
            >
              <IconArrowLeft
                size={16}
                className="transition group-hover:-translate-x-1"
              />

              Continue Shopping
            </Link>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#99928a]">
              <IconLock size={14} />
              Secure checkout
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}