"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconHeart,
  IconHeartFilled,
  IconMinus,
  IconPackage,
  IconPlus,
  IconRefresh,
  IconShieldCheck,
  IconShoppingBag,
  IconStar,
  IconTruck,
} from "@tabler/icons-react";
import { useCart } from "../../context/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function stripHtml(value) {
  if (!value) return "";

  return String(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<\/div>/gi, " ")
    .replace(/<\/li>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function getImageUrl(value) {
  if (!value) return "";

  const imageValue = String(value).trim();

  if (
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://")
  ) {
    return imageValue;
  }

  const baseUrl = API_URL
    ?.replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

  if (!baseUrl) return imageValue;

  return `${baseUrl}/${imageValue.replace(/^\/+/, "")}`;
}

function formatPrice(value) {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(number);
}

function calculateDiscount(price, discountPrice) {
  const original = Number(price || 0);
  const discounted = Number(discountPrice || 0);

  if (!original || !discounted || discounted >= original) {
    return 0;
  }

  return Math.round(((original - discounted) / original) * 100);
}

export default function ProductDetails() {
  const params = useParams();
  const slug = params?.slug;

  const cart = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [error, setError] = useState("");

  const description = useMemo(
    () => stripHtml(product?.description),
    [product?.description]
  );

  const specifications = useMemo(
    () => stripHtml(product?.specifications),
    [product?.specifications]
  );

  const review = useMemo(
    () => stripHtml(product?.reviews),
    [product?.reviews]
  );

  const originalPrice = Number(product?.price || 0);
  const salePrice = Number(product?.discount_price || 0);

  const hasDiscount =
    originalPrice > 0 &&
    salePrice > 0 &&
    salePrice < originalPrice;

  const currentPrice = hasDiscount ? salePrice : originalPrice;

  const discount = calculateDiscount(
    originalPrice,
    salePrice
  );

  const savings = hasDiscount
    ? originalPrice - salePrice
    : 0;

  const isAvailable = Number(product?.status) === 1;

  useEffect(() => {
    if (!slug || !API_URL) {
      if (!API_URL) {
        setError("API URL is not configured.");
        setLoading(false);
      }

      return;
    }

    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(slug)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch product.");
        }

        const result = await response.json();

        if (cancelled) return;

        const productData = result?.data;

        if (!productData) {
          throw new Error("Product data not found.");
        }

        setProduct(productData);
        setActiveImage(getImageUrl(productData.image));
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Something went wrong while loading the product."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!product?.id || typeof window === "undefined") {
      return;
    }

    try {
      const storedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      if (!Array.isArray(storedWishlist)) {
        setIsWishlisted(false);
        return;
      }

      const exists = storedWishlist.some(
        (item) =>
          String(item?.id) === String(product.id)
      );

      setIsWishlisted(exists);
    } catch {
      setIsWishlisted(false);
    }
  }, [product?.id]);

  const notifyCart = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const notifyWishlist = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    }
  };

  const getCartProduct = () => {
    return {
      ...product,
      id: product?.id,
      product_id: product?.id,
      productId: product?.id,
      quantity,
      price: currentPrice,
      discount_price: salePrice,
      original_price: originalPrice,
      image: product?.image,
    };
  };

  const handleAddToCart = () => {
    if (!product || !isAvailable) return;

    const item = getCartProduct();

    try {
      if (typeof cart?.addToCart === "function") {
        cart.addToCart(item, quantity);
      } else if (typeof cart?.addItem === "function") {
        cart.addItem(item, quantity);
      } else if (typeof cart?.add === "function") {
        cart.add(item, quantity);
      } else if (
        typeof cart?.addProduct === "function"
      ) {
        cart.addProduct(item, quantity);
      } else {
        const storedCart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        const cartArray = Array.isArray(storedCart)
          ? storedCart
          : [];

        const existingIndex = cartArray.findIndex(
          (cartItem) =>
            String(cartItem?.id) ===
              String(product.id) ||
            String(cartItem?.product_id) ===
              String(product.id) ||
            String(cartItem?.productId) ===
              String(product.id)
        );

        if (existingIndex !== -1) {
          cartArray[existingIndex] = {
            ...cartArray[existingIndex],
            quantity:
              Number(
                cartArray[existingIndex]?.quantity || 0
              ) + quantity,
          };
        } else {
          cartArray.push(item);
        }

        localStorage.setItem(
          "cart",
          JSON.stringify(cartArray)
        );
      }

      notifyCart();

      setCartAdded(true);

      window.setTimeout(() => {
        setCartAdded(false);
      }, 2500);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const handleBuyNow = () => {
    if (!product || !isAvailable) return;

    const item = getCartProduct();

    try {
      localStorage.setItem(
        "buyNowProduct",
        JSON.stringify(item)
      );

      localStorage.setItem(
        "checkoutProduct",
        JSON.stringify(item)
      );

      window.location.href = "/checkout";
    } catch (err) {
      console.error("Buy now error:", err);
    }
  };

  const handleWishlist = () => {
    if (!product || typeof window === "undefined") {
      return;
    }

    try {
      const storedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      const wishlist = Array.isArray(storedWishlist)
        ? storedWishlist
        : [];

      const existingIndex = wishlist.findIndex(
        (item) =>
          String(item?.id) === String(product.id)
      );

      if (existingIndex !== -1) {
        wishlist.splice(existingIndex, 1);
        setIsWishlisted(false);
      } else {
        wishlist.push({
          ...product,
          id: product.id,
          price: currentPrice,
          quantity: 1,
        });

        setIsWishlisted(true);
      }

      localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
      );

      notifyWishlist();
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5f1] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-8 h-5 w-56 rounded-full bg-[#e5e0d8]" />

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="h-[420px] rounded-[30px] bg-white sm:h-[540px]" />

            <div className="space-y-5">
              <div className="h-5 w-32 rounded-full bg-[#e5e0d8]" />

              <div className="h-12 w-4/5 rounded-xl bg-[#e5e0d8]" />

              <div className="h-9 w-48 rounded-xl bg-[#e5e0d8]" />

              <div className="h-28 rounded-2xl bg-white" />

              <div className="h-14 rounded-xl bg-[#e5e0d8]" />

              <div className="h-14 rounded-xl bg-[#e5e0d8]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f1] px-5">
        <div className="w-full max-w-xl rounded-[30px] border border-[#e4dfd7] bg-white p-8 text-center shadow-[0_25px_70px_rgba(35,30,25,0.08)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#ff7200]">
            <IconPackage size={29} stroke={1.7} />
          </div>

          <h1 className="mt-6 text-2xl font-black tracking-[-0.025em] text-[#24211e] sm:text-3xl">
            Product Not Found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-[#77716a]">
            {error ||
              "The requested product could not be found."}
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ff7200] px-6 text-sm font-extrabold tracking-[0.02em] text-white transition hover:bg-[#e86600]"
          >
            <IconArrowLeft size={17} />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const image =
    activeImage || getImageUrl(product.image);

  return (
    <main className="min-h-screen bg-[#f7f5f1] text-[#292622]">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="mb-7 flex flex-wrap items-center gap-2 text-[12px] font-bold tracking-[0.06em] text-[#8b847c] sm:text-[13px]">
          <Link
            href="/"
            className="transition hover:text-[#ff7200]"
          >
            Home
          </Link>

          <IconChevronRight size={15} />

          <Link
            href="/products"
            className="transition hover:text-[#ff7200]"
          >
            Products
          </Link>

          <IconChevronRight size={15} />

          <span className="text-[#403b36]">
            {product?.category?.name || "Product"}
          </span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:gap-12 xl:gap-16">
          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-[30px] border border-[#e5e0d8] bg-white p-4 shadow-[0_18px_55px_rgba(35,30,25,0.06)] sm:p-8">
              {discount > 0 && (
                <div className="absolute left-5 top-5 z-10 rounded-full bg-[#ff7200] px-4 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-white shadow-lg sm:left-7 sm:top-7">
                  Save {discount}%
                </div>
              )}

              <button
                type="button"
                onClick={handleWishlist}
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#e5e0d8] bg-white/95 text-[#38332e] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#ff7200] hover:text-[#ff7200] sm:right-7 sm:top-7"
              >
                {isWishlisted ? (
                  <IconHeartFilled size={20} />
                ) : (
                  <IconHeart size={20} stroke={1.8} />
                )}
              </button>

              <div className="flex min-h-[360px] items-center justify-center sm:min-h-[520px]">
                {image ? (
                  <img
                    src={image}
                    alt={product.name || "Product"}
                    className="h-auto max-h-[460px] w-full max-w-[620px] object-contain transition duration-500 hover:scale-[1.025]"
                  />
                ) : (
                  <div className="flex h-80 w-full items-center justify-center rounded-3xl bg-[#f4f1ec] text-[#999189]">
                    <IconPackage
                      size={50}
                      stroke={1.3}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() =>
                    setActiveImage(
                      getImageUrl(product.image)
                    )
                  }
                  className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white p-2 transition ${
                    activeImage ===
                    getImageUrl(product.image)
                      ? "border-[#ff7200] shadow-[0_8px_25px_rgba(255,114,0,0.12)]"
                      : "border-[#e5e0d8]"
                  }`}
                >
                  {product.image ? (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name || "Product"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <IconPackage size={22} />
                  )}
                </button>
              </div>

              <div className="hidden shrink-0 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#8d867e] sm:flex">
                <IconShieldCheck
                  size={16}
                  className="text-[#ff7200]"
                />
                Secure Product
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              {product?.category?.name && (
                <span className="rounded-full bg-[#fff0e5] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#d95f00]">
                  {product.category.name}
                </span>
              )}

              {product?.sku && (
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#918a82]">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <h1 className="mt-5 max-w-3xl text-[32px] font-black leading-[1.08] tracking-[-0.035em] text-[#24211e] sm:text-[42px] lg:text-[48px]">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
              <span className="text-[32px] font-black tracking-[-0.025em] text-[#ff7200] sm:text-[38px]">
                ₹{formatPrice(currentPrice)}
              </span>

              {hasDiscount && (
                <span className="pb-1 text-[18px] font-bold text-[#9b938b] line-through sm:text-[20px]">
                  ₹{formatPrice(originalPrice)}
                </span>
              )}

              {hasDiscount && (
                <span className="mb-1 rounded-lg bg-[#edf7ef] px-2.5 py-1.5 text-[11px] font-black uppercase tracking-[0.06em] text-[#32824a]">
                  Save ₹{formatPrice(savings)}
                </span>
              )}
            </div>

            <div className="mt-7 rounded-2xl border border-[#e6e1d9] bg-white p-5 sm:p-6">
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4eb] text-[#ff7200]">
                    <IconTruck size={18} />
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#4b4640]">
                      Fast Delivery
                    </p>

                    <p className="mt-1 text-[12px] text-[#8b847c]">
                      Quick & reliable
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4eb] text-[#ff7200]">
                    <IconShieldCheck size={18} />
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#4b4640]">
                      Secure Checkout
                    </p>

                    <p className="mt-1 text-[12px] text-[#8b847c]">
                      Protected payment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4eb] text-[#ff7200]">
                    <IconRefresh size={18} />
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#4b4640]">
                      Easy Support
                    </p>

                    <p className="mt-1 text-[12px] text-[#8b847c]">
                      We're here to help
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 border-y border-[#e4dfd7] py-6">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.11em] text-[#918a82]">
                    Quantity
                  </p>

                  <div className="mt-3 flex h-12 items-center rounded-xl border border-[#ddd7cf] bg-white">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="flex h-full w-12 items-center justify-center text-[#4b4640] transition hover:text-[#ff7200] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <IconMinus size={17} />
                    </button>

                    <span className="flex w-12 justify-center text-[16px] font-black text-[#292622]">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      className="flex h-full w-12 items-center justify-center text-[#4b4640] transition hover:text-[#ff7200]"
                    >
                      <IconPlus size={17} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-black uppercase tracking-[0.11em] text-[#918a82]">
                    Availability
                  </p>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isAvailable
                          ? "bg-[#36a35b]"
                          : "bg-[#c74b4b]"
                      }`}
                    />

                    <span
                      className={`text-[13px] font-extrabold ${
                        isAvailable
                          ? "text-[#32824a]"
                          : "text-[#b44343]"
                      }`}
                    >
                      {isAvailable
                        ? "In Stock"
                        : "Currently Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_0.72fr]">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`group flex h-14 items-center justify-center gap-3 rounded-2xl px-5 text-[14px] font-black tracking-[0.025em] transition ${
                  !isAvailable
                    ? "cursor-not-allowed bg-[#d8d3cc] text-white"
                    : cartAdded
                    ? "bg-[#32824a] text-white shadow-[0_12px_30px_rgba(50,130,74,0.18)]"
                    : "bg-[#292622] text-white shadow-[0_12px_30px_rgba(41,38,34,0.16)] hover:-translate-y-0.5 hover:bg-[#171513]"
                }`}
              >
                {cartAdded ? (
                  <>
                    <IconCheck size={19} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <IconShoppingBag size={19} />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!isAvailable}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#ff7200] px-5 text-[14px] font-black tracking-[0.025em] text-white shadow-[0_12px_30px_rgba(255,114,0,0.2)] transition hover:-translate-y-0.5 hover:bg-[#e96700] disabled:cursor-not-allowed disabled:bg-[#d8d3cc] disabled:shadow-none"
              >
                Buy Now
                <IconArrowRight size={18} />
              </button>
            </div>

            {cartAdded && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#cde7d4] bg-[#f1faf3] px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dff2e3] text-[#32824a]">
                  <IconCheck size={18} />
                </div>

                <div>
                  <p className="text-[13px] font-black text-[#2e7544]">
                    Product added to your cart
                  </p>

                  <p className="mt-0.5 text-[12px] text-[#6f8c76]">
                    Quantity {quantity} added successfully.
                  </p>
                </div>

                <Link
                  href="/cart"
                  className="ml-auto hidden text-[12px] font-black text-[#32824a] hover:underline sm:block"
                >
                  View Cart
                </Link>
              </div>
            )}

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#e4dfd7] bg-white p-4">
                <div className="flex items-center gap-3">
                  <IconClock
                    size={19}
                    className="shrink-0 text-[#ff7200]"
                  />

                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.07em] text-[#39342f]">
                      Quick Processing
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#8c857d]">
                      Order processed quickly
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e4dfd7] bg-white p-4">
                <div className="flex items-center gap-3">
                  <IconPackage
                    size={19}
                    className="shrink-0 text-[#ff7200]"
                  />

                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.07em] text-[#39342f]">
                      Quality Product
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#8c857d]">
                      Carefully packed for delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-[30px] border border-[#e4dfd7] bg-white p-5 shadow-[0_18px_55px_rgba(35,30,25,0.045)] sm:p-8 lg:mt-20 lg:p-10">
          <div className="flex gap-2 overflow-x-auto border-b border-[#e7e2db]">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`shrink-0 border-b-2 px-4 pb-4 text-[13px] font-black tracking-[0.03em] transition sm:px-5 ${
                activeTab === "description"
                  ? "border-[#ff7200] text-[#ff7200]"
                  : "border-transparent text-[#817a72] hover:text-[#292622]"
              }`}
            >
              Description
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("specifications")
              }
              className={`shrink-0 border-b-2 px-4 pb-4 text-[13px] font-black tracking-[0.03em] transition sm:px-5 ${
                activeTab === "specifications"
                  ? "border-[#ff7200] text-[#ff7200]"
                  : "border-transparent text-[#817a72] hover:text-[#292622]"
              }`}
            >
              Specifications
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`shrink-0 border-b-2 px-4 pb-4 text-[13px] font-black tracking-[0.03em] transition sm:px-5 ${
                activeTab === "reviews"
                  ? "border-[#ff7200] text-[#ff7200]"
                  : "border-transparent text-[#817a72] hover:text-[#292622]"
              }`}
            >
              Reviews
            </button>
          </div>

          {activeTab === "description" && (
            <div className="max-w-4xl pt-8">
              <p className="text-[15px] leading-8 tracking-[0.01em] text-[#625c55] sm:text-[16px]">
                {description ||
                  "No description available for this product."}
              </p>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="max-w-4xl pt-8">
              <p className="text-[15px] leading-8 tracking-[0.01em] text-[#625c55] sm:text-[16px]">
                {specifications ||
                  "No specifications available for this product."}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="pt-8">
              {review ? (
                <div className="max-w-4xl rounded-2xl border border-[#e4dfd7] bg-[#fcfbf9] p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2e7] text-[#ff7200]">
                      <IconStar
                        size={19}
                        fill="currentColor"
                      />
                    </div>

                    <div>
                      <p className="text-[13px] font-black tracking-[0.02em] text-[#302d29]">
                        Customer Review
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#8d867e]">
                        Product feedback
                      </p>
                    </div>
                  </div>

                  <p className="text-[15px] leading-8 text-[#625c55]">
                    {review}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#e5e0d8] bg-[#faf9f7] p-6">
                  <p className="text-[14px] font-semibold leading-7 text-[#706960]">
                    No reviews available for this product yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-[#e4dfd7] bg-white p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1e7] text-[#ff7200]">
              <IconTruck size={21} />
            </div>

            <div>
              <p className="text-[13px] font-black text-[#302d29]">
                Reliable Delivery
              </p>

              <p className="mt-1 text-[11px] text-[#8b847c]">
                Fast & secure shipping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#e4dfd7] bg-white p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1e7] text-[#ff7200]">
              <IconShieldCheck size={21} />
            </div>

            <div>
              <p className="text-[13px] font-black text-[#302d29]">
                Secure Payment
              </p>

              <p className="mt-1 text-[11px] text-[#8b847c]">
                Protected checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#e4dfd7] bg-white p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1e7] text-[#ff7200]">
              <IconRefresh size={21} />
            </div>

            <div>
              <p className="text-[13px] font-black text-[#302d29]">
                Customer Support
              </p>

              <p className="mt-1 text-[11px] text-[#8b847c]">
                Help when you need it
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-[13px] font-black tracking-[0.02em] text-[#4d4741] transition hover:text-[#ff7200]"
          >
            <IconArrowLeft
              size={17}
              className="transition group-hover:-translate-x-1"
            />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}