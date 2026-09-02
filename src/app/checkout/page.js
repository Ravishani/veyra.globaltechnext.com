"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  IconArrowLeft,
  IconArrowRight,
  IconCreditCard,
  IconLock,
  IconMinus,
  IconPackage,
  IconPlus,
  IconShieldCheck,
  IconShoppingBag,
  IconTruck,
} from "@tabler/icons-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

function formatNumber(value) {
  return Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}

function getImageUrl(image) {
  if (!image) {
    return null;
  }

  const imageValue = String(image).trim();

  if (!imageValue) {
    return null;
  }

  if (
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://")
  ) {
    return imageValue;
  }

  const laravelUrl = API_URL
    ?.replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

  if (!laravelUrl) {
    return null;
  }

  return `${laravelUrl}/${imageValue.replace(
    /^\/+/,
    ""
  )}`;
}

function getProductPrice(product) {
  const price = Number(product?.price || 0);

  const discountPrice = Number(
    product?.discount_price || 0
  );

  if (
    discountPrice > 0 &&
    discountPrice < price
  ) {
    return discountPrice;
  }

  return price;
}

function getDiscount(product) {
  const price = Number(product?.price || 0);

  const discountPrice = Number(
    product?.discount_price || 0
  );

  if (
    !price ||
    !discountPrice ||
    discountPrice >= price
  ) {
    return 0;
  }

  return Math.round(
    ((price - discountPrice) / price) * 100
  );
}

export default function CheckoutPage() {
  const [product, setProduct] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [quantity, setQuantity] =
    useState(1);

  const [errors, setErrors] =
    useState({});

  const [processing, setProcessing] =
    useState(false);

  useEffect(() => {
    const savedProduct =
      localStorage.getItem("buyNow");

    if (!savedProduct) {
      window.location.href = "/products";
      return;
    }

    try {
      const parsedProduct =
        JSON.parse(savedProduct);

      if (!parsedProduct?.id) {
        window.location.href =
          "/products";

        return;
      }

      setProduct(parsedProduct);

      setQuantity(
        Number(
          parsedProduct.quantity || 1
        )
      );
    } catch {
      window.location.href =
        "/products";
    }
  }, []);

  const unitPrice = useMemo(() => {
    return getProductPrice(product);
  }, [product]);

  const discount = useMemo(() => {
    return getDiscount(product);
  }, [product]);

  const subtotal = useMemo(() => {
    return unitPrice * quantity;
  }, [unitPrice, quantity]);

  const deliveryCharge = useMemo(() => {
    return subtotal >= 999 ? 0 : 49;
  }, [subtotal]);

  const total = useMemo(() => {
    return (
      subtotal + deliveryCharge
    );
  }, [
    subtotal,
    deliveryCharge,
  ]);

  const imageUrl = useMemo(() => {
    return getImageUrl(
      product?.image
    );
  }, [product]);

  const updateQuantity = (value) => {
    if (value < 1) {
      return;
    }

    setQuantity(value);

    if (product) {
      const updatedProduct = {
        ...product,
        quantity: value,
      };

      setProduct(updatedProduct);

      localStorage.setItem(
        "buyNow",
        JSON.stringify(
          updatedProduct
        )
      );
    }
  };

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required.";
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
      !/^[0-9]{10}$/.test(
        form.phone
      )
    ) {
      newErrors.phone =
        "Enter a valid 10 digit phone number.";
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
        "State is required.";
    }

    if (!form.pincode.trim()) {
      newErrors.pincode =
        "Pincode is required.";
    } else if (
      !/^[0-9]{6}$/.test(
        form.pincode
      )
    ) {
      newErrors.pincode =
        "Enter a valid 6 digit pincode.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    const orderData = {
      product_id: product.id,
      product_name: product.name,
      quantity,
      unit_price: unitPrice,
      subtotal,
      delivery_charge:
        deliveryCharge,
      total,
      customer: form,
    };

    console.log(
      "Order Data:",
      orderData
    );

    setTimeout(() => {
      setProcessing(false);

      alert(
        "Order details submitted successfully."
      );
    }, 1200);
  };

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ded9d1] border-t-[var(--primary)]" />

          <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#858078]">
            Preparing Checkout
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2]">
      <header className="border-b border-[#e4dfd7] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#777168] transition hover:text-[var(--primary)]"
          >
            <IconArrowLeft size={15} />
            Back to Product
          </Link>

          <div className="flex items-center gap-2 text-[#292721]">
            <IconLock
              size={15}
              className="text-emerald-600"
            />

            <span className="text-[8px] font-extrabold uppercase tracking-[0.12em]">
              Secure Checkout
            </span>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-8">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">
              Complete Your Purchase
            </p>

            <h1 className="mt-2 text-[32px] font-black tracking-[-0.05em] text-[#292721] sm:text-[42px]">
              Checkout
            </h1>

            <p className="mt-2 max-w-xl text-[10px] leading-5 text-[#858078]">
              Enter your delivery details
              and review your order before
              payment.
            </p>
          </div>

          <form
            onSubmit={placeOrder}
            className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]"
          >
            <div className="space-y-6">
              <div className="rounded-[26px] border border-[#e2ded6] bg-white p-5 shadow-[0_15px_45px_rgba(35,32,27,0.05)] sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff7ed] text-[var(--primary)]">
                    <IconTruck size={20} />
                  </div>

                  <div>
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#aaa49a]">
                      Delivery
                    </p>

                    <h2 className="mt-1 text-[19px] font-black text-[#292721]">
                      Shipping Information
                    </h2>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[9px] font-bold text-[#625e57]">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={`h-12 w-full rounded-xl border bg-[#faf9f6] px-4 text-[11px] text-[#292721] outline-none transition focus:border-[var(--primary)] ${
                        errors.name
                          ? "border-red-300"
                          : "border-[#ded9d1]"
                      }`}
                    />

                    {errors.name && (
                      <p className="mt-1 text-[8px] text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-[9px] font-bold text-[#625e57]">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`h-12 w-full rounded-xl border bg-[#faf9f6] px-4 text-[11px] text-[#292721] outline-none transition focus:border-[var(--primary)] ${
                        errors.email
                          ? "border-red-300"
                          : "border-[#ded9d1]"
                      }`}
                    />

                    {errors.email && (
                      <p className="mt-1 text-[8px] text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-[9px] font-bold text-[#625e57]">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="10 digit mobile number"
                      className={`h-12 w-full rounded-xl border bg-[#faf9f6] px-4 text-[11px] text-[#292721] outline-none transition focus:border-[var(--primary)] ${
                        errors.phone
                          ? "border-red-300"
                          : "border-[#ded9d1]"
                      }`}
                    />

                    {errors.phone && (
                      <p className="mt-1 text-[8px] text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-[9px] font-bold text-[#625e57]">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      placeholder="110001"
                      className={`h-12 w-full rounded-xl border bg-[#faf9f6] px-4 text-[11px] text-[#292721] outline-none transition focus:border-[var(--primary)] ${
                        errors.pincode
                          ? "border-red-300"
                          : "border-[#ded9d1]"
                      }`}
                    />

                    {errors.pincode && (
                      <p className="mt-1 text-[8px] text-red-500">
                        {errors.pincode}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[9px] font-bold text-[#625e57]">
                      Complete Address
                    </label>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={4}
                      placeholder="House / Flat / Street / Area"
                      className={`w-full resize-none rounded-xl border bg-[#faf9f6] px-4 py-3 text-[11px] text-[#292721] outline-none transition focus:border-[var(--primary)] ${
                        errors.address
                          ? "border-red-300"
                          : "border-[#ded9d1]"
                      }`}
                    />

                    {errors.address && (
                      <p className="mt-1 text-[8px] text-red-500">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-[9px] font-bold text-[#625e57]">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Delhi"
                      className={`h-12 w-full rounded-xl border bg-[#faf9f6] px-4 text-[11px] text-[#292721] outline-none transition focus:border-[var(--primary)] ${
                        errors.city
                          ? "border-red-300"
                          : "border-[#ded9d1]"
                      }`}
                    />

                    {errors.city && (
                      <p className="mt-1 text-[8px] text-red-500">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-[9px] font-bold text-[#625e57]">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Delhi"
                      className={`h-12 w-full rounded-xl border bg-[#faf9f6] px-4 text-[11px] text-[#292721] outline-none transition focus:border-[var(--primary)] ${
                        errors.state
                          ? "border-red-300"
                          : "border-[#ded9d1]"
                      }`}
                    />

                    {errors.state && (
                      <p className="mt-1 text-[8px] text-red-500">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e2ded6] bg-white p-5">
                  <IconShieldCheck
                    size={20}
                    className="text-[var(--primary)]"
                  />

                  <p className="mt-3 text-[9px] font-black text-[#292721]">
                    Secure Payment
                  </p>

                  <p className="mt-1 text-[8px] leading-4 text-[#aaa49a]">
                    Your information is protected.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e2ded6] bg-white p-5">
                  <IconTruck
                    size={20}
                    className="text-[var(--primary)]"
                  />

                  <p className="mt-3 text-[9px] font-black text-[#292721]">
                    Reliable Delivery
                  </p>

                  <p className="mt-1 text-[8px] leading-4 text-[#aaa49a]">
                    Fast and convenient delivery.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e2ded6] bg-white p-5">
                  <IconPackage
                    size={20}
                    className="text-[var(--primary)]"
                  />

                  <p className="mt-3 text-[9px] font-black text-[#292721]">
                    Quality Product
                  </p>

                  <p className="mt-1 text-[8px] leading-4 text-[#aaa49a]">
                    Carefully packed for you.
                  </p>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-6 lg:h-fit">
              <div className="overflow-hidden rounded-[28px] border border-[#e2ded6] bg-white shadow-[0_20px_60px_rgba(35,32,27,0.08)]">
                <div className="border-b border-[#e6e1d8] px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#aaa49a]">
                        Your Order
                      </p>

                      <h2 className="mt-1 text-[20px] font-black text-[#292721]">
                        Order Summary
                      </h2>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff7ed] text-[var(--primary)]">
                      <IconShoppingBag size={18} />
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#e3ded5] bg-[#f1eee8]">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#c9c3ba]">
                          <IconPackage size={30} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[11px] font-black leading-5 text-[#292721]">
                        {product.name}
                      </p>

                      {product.sku && (
                        <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#aaa49a]">
                          SKU:{" "}
                          {product.sku}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex h-9 items-center rounded-lg border border-[#ded9d1]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                quantity - 1
                              )
                            }
                            className="flex h-full w-8 items-center justify-center text-[#625e57]"
                          >
                            <IconMinus size={12} />
                          </button>

                          <span className="flex h-full min-w-8 items-center justify-center border-x border-[#ded9d1] text-[9px] font-black">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                quantity + 1
                              )
                            }
                            className="flex h-full w-8 items-center justify-center text-[#625e57]"
                          >
                            <IconPlus size={12} />
                          </button>
                        </div>

                        <p className="text-[12px] font-black text-[#292721]">
                          ₹
                          {formatNumber(
                            unitPrice
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {discount > 0 && (
                    <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                      <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-emerald-700">
                        You Save
                      </span>

                      <span className="text-[10px] font-black text-emerald-700">
                        {discount}% OFF
                      </span>
                    </div>
                  )}

                  <div className="my-6 h-px bg-[#e5e0d8]" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[#858078]">
                        Subtotal
                      </span>

                      <span className="text-[10px] font-bold text-[#292721]">
                        ₹
                        {formatNumber(
                          subtotal
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[#858078]">
                        Delivery
                      </span>

                      {deliveryCharge ===
                      0 ? (
                        <span className="text-[9px] font-black text-emerald-600">
                          FREE
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#292721]">
                          ₹
                          {formatNumber(
                            deliveryCharge
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="my-5 h-px bg-[#e5e0d8]" />

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#aaa49a]">
                        Total Amount
                      </p>

                      <p className="mt-1 text-[28px] font-black tracking-[-0.05em] text-[#292721]">
                        ₹
                        {formatNumber(
                          total
                        )}
                      </p>
                    </div>

                    <span className="mb-1 rounded-full bg-[#f7f4ef] px-3 py-1.5 text-[8px] font-bold text-[#777168]">
                      INR
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_10px_25px_rgba(255,114,0,0.18)] transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {processing ? (
                      <>
                        Processing...
                      </>
                    ) : (
                      <>
                        <IconCreditCard
                          size={16}
                        />
                        Proceed to Payment
                        <IconArrowRight
                          size={15}
                        />
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-center">
                    <IconLock
                      size={12}
                      className="text-emerald-600"
                    />

                    <span className="text-[8px] font-semibold text-[#aaa49a]">
                      Secure & protected
                      checkout
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </main>
  );
}