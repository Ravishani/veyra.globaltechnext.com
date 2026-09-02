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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  const laravelUrl = API_URL?.replace(/\/api\/?$/, "").replace(/\/+$/, "");

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

function stripHtml(value) {
  if (!value) return "";

  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ProductDetailsPage() {
  const params = useParams();

  const slug = params?.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/products/${slug}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const result = await response.json();

        const productData = result?.data || result?.product || result;

        setProduct(productData);

        const image = getImageUrl(productData?.image);

        setActiveImage(image);

        const wishlist = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        );

        setIsWishlisted(
          wishlist.includes(productData?.id)
        );

        const cart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        const existingProduct = cart.find(
          (item) => item.id === productData?.id
        );

        setCartAdded(Boolean(existingProduct));

        if (existingProduct?.quantity) {
          setQuantity(existingProduct.quantity);
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const unitPrice = useMemo(() => {
    return getProductPrice(product);
  }, [product]);

  const discount = useMemo(() => {
    return getDiscount(product);
  }, [product]);

  const originalPrice = Number(product?.price || 0);

  const savings = useMemo(() => {
    if (!originalPrice || !discount) return 0;

    return (originalPrice - unitPrice) * quantity;
  }, [originalPrice, unitPrice, quantity, discount]);

  const subtotal = useMemo(() => {
    return unitPrice * quantity;
  }, [unitPrice, quantity]);

  const description = useMemo(() => {
    return stripHtml(product?.description);
  }, [product]);

  const specifications = useMemo(() => {
    if (!product?.specifications) return [];

    if (typeof product.specifications === "object") {
      return Object.entries(product.specifications);
    }

    try {
      const parsed = JSON.parse(product.specifications);

      if (typeof parsed === "object") {
        return Object.entries(parsed);
      }
    } catch {}

    return [];
  }, [product]);

  const updateQuantity = (value) => {
    if (value < 1) return;

    setQuantity(value);

    if (!product) return;

    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingIndex = cart.findIndex(
      (item) => item.id === product.id
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity = value;

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );
    }
  };

  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingIndex = cart.findIndex(
      (item) => item.id === product.id
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        price: product.price,
        discount_price: product.discount_price,
        image: product.image,
        category: product.category,
        quantity,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    setCartAdded(true);
  };

  const toggleWishlist = () => {
    if (!product) return;

    const wishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    if (wishlist.includes(product.id)) {
      const updated = wishlist.filter(
        (id) => id !== product.id
      );

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updated)
      );

      setIsWishlisted(false);
    } else {
      wishlist.push(product.id);

      localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
      );

      setIsWishlisted(true);
    }
  };

  const buyNow = () => {
    if (!product) return;

    const buyNowProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      discount_price: product.discount_price,
      image: product.image,
      category: product.category,
      quantity,
    };

    localStorage.setItem(
      "buyNow",
      JSON.stringify(buyNowProduct)
    );

    window.location.href = "/checkout";
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3]">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-[3px] border-[#e8e2d8] border-t-[#FF7200]" />

          <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#777168]">
            Loading Product
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f3] px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#FF7200] shadow-sm">
            <IconPackage size={34} />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-[#171614]">
            Product Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#777168]">
            The product you are looking for may have been
            removed or is currently unavailable.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-[#FF7200] px-6 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#e86600]"
          >
            <IconArrowLeft size={15} />
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = activeImage || getImageUrl(product.image);

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#171614]">
      <div className="border-b border-[#e8e2d8] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#888178]">
            <Link
              href="/products"
              className="shrink-0 transition hover:text-[#FF7200]"
            >
              Products
            </Link>

            <IconChevronRight
              size={13}
              className="shrink-0"
            />

            <span className="truncate text-[#171614]">
              {product.name}
            </span>
          </div>

          <Link
            href="/cart"
            className="hidden items-center gap-2 rounded-full border border-[#e4ddd3] bg-white px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#3d3934] transition hover:border-[#FF7200] hover:text-[#FF7200] sm:flex"
          >
            <IconShoppingBag size={15} />
            View Cart
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden bg-white">
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#FF7200]/5 blur-3xl" />

        <div className="absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-[#D6B76E]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)] lg:items-start lg:gap-14">
            <div>
              <div className="relative overflow-hidden rounded-[30px] border border-[#e7e0d6] bg-[#f7f5f0] shadow-[0_25px_70px_rgba(32,29,24,0.07)]">
                {discount > 0 && (
                  <div className="absolute left-5 top-5 z-10 rounded-full bg-[#FF7200] px-4 py-2 text-[9px] font-black uppercase tracking-[0.1em] text-white shadow-lg">
                    {discount}% OFF
                  </div>
                )}

                <button
                  type="button"
                  onClick={toggleWishlist}
                  className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#e5ded4] bg-white text-[#55504a] shadow-md transition hover:border-[#FF7200] hover:text-[#FF7200]"
                >
                  {isWishlisted ? (
                    <IconHeartFilled
                      size={19}
                      className="text-[#FF7200]"
                    />
                  ) : (
                    <IconHeart size={20} />
                  )}
                </button>

                <div className="flex min-h-[420px] items-center justify-center p-8 sm:min-h-[540px] sm:p-14">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="max-h-[500px] w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.08)] transition duration-500 hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-72 w-full items-center justify-center text-[#c8c1b7]">
                      <IconPackage size={70} stroke={1} />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveImage(getImageUrl(product.image))
                  }
                  className="flex h-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#FF7200] bg-white p-2"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <IconPackage
                      size={22}
                      className="text-[#c8c1b7]"
                    />
                  )}
                </button>

                <div className="flex h-20 items-center justify-center rounded-2xl border border-dashed border-[#ded7cd] bg-white text-[#b4ada3]">
                  <IconPackage size={21} />
                </div>

                <div className="flex h-20 items-center justify-center rounded-2xl border border-dashed border-[#ded7cd] bg-white text-[#b4ada3]">
                  <IconShieldCheck size={21} />
                </div>

                <div className="flex h-20 items-center justify-center rounded-2xl border border-dashed border-[#ded7cd] bg-white text-[#b4ada3]">
                  <IconTruck size={21} />
                </div>
              </div>
            </div>

            <div className="lg:pt-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.category?.name && (
                  <span className="rounded-full bg-[#fff4e9] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.13em] text-[#FF7200]">
                    {product.category.name}
                  </span>
                )}

                <span className="flex items-center gap-1.5 rounded-full bg-[#edf8f1] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.1em] text-[#198754]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#198754]" />
                  In Stock
                </span>
              </div>

              <h1 className="mt-5 text-[34px] font-black leading-[1.08] tracking-[-0.045em] text-[#171614] sm:text-[46px]">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconStar
                      key={star}
                      size={16}
                      className="fill-[#D6B76E] text-[#D6B76E]"
                    />
                  ))}

                  <span className="ml-2 text-[10px] font-bold text-[#6e6860]">
                    5.0
                  </span>
                </div>

                {product.sku && (
                  <>
                    <span className="h-4 w-px bg-[#ded8cf]" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#969087]">
                      SKU: {product.sku}
                    </span>
                  </>
                )}
              </div>

              <div className="mt-7 rounded-[24px] border border-[#eadfce] bg-[#fffaf3] p-5 sm:p-6">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-[34px] font-black tracking-[-0.04em] text-[#FF7200]">
                    ₹{formatNumber(unitPrice)}
                  </span>

                  {discount > 0 && (
                    <span className="mb-1 text-[16px] font-bold text-[#a19a91] line-through">
                      ₹{formatNumber(originalPrice)}
                    </span>
                  )}
                </div>

                {discount > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-md bg-[#eaf7ef] px-2 py-1 text-[8px] font-black uppercase tracking-[0.08em] text-[#198754]">
                      Save ₹{formatNumber(originalPrice - unitPrice)}
                    </span>

                    <span className="text-[9px] font-semibold text-[#827b72]">
                      Limited time offer
                    </span>
                  </div>
                )}
              </div>

              {description && (
                <div className="mt-7">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#aaa39a]">
                    Product Overview
                  </p>

                  <p className="mt-3 text-[13px] leading-7 text-[#666058]">
                    {description.length > 400
                      ? `${description.substring(0, 400)}...`
                      : description}
                  </p>
                </div>
              )}

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e7e0d7] bg-white p-4">
                  <IconTruck
                    size={20}
                    className="text-[#FF7200]"
                  />

                  <p className="mt-3 text-[9px] font-black text-[#25221f]">
                    Fast Delivery
                  </p>

                  <p className="mt-1 text-[8px] leading-4 text-[#969087]">
                    Quick doorstep delivery
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7e0d7] bg-white p-4">
                  <IconShieldCheck
                    size={20}
                    className="text-[#FF7200]"
                  />

                  <p className="mt-3 text-[9px] font-black text-[#25221f]">
                    Secure Payment
                  </p>

                  <p className="mt-1 text-[8px] leading-4 text-[#969087]">
                    Safe & protected checkout
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7e0d7] bg-white p-4">
                  <IconRefresh
                    size={20}
                    className="text-[#FF7200]"
                  />

                  <p className="mt-3 text-[9px] font-black text-[#25221f]">
                    Easy Returns
                  </p>

                  <p className="mt-1 text-[8px] leading-4 text-[#969087]">
                    Simple return process
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-[#e8e2d9] pt-7">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex h-14 w-fit items-center rounded-xl border border-[#ded7ce] bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(quantity - 1)
                      }
                      disabled={quantity <= 1}
                      className="flex h-full w-12 items-center justify-center text-[#55504a] transition hover:text-[#FF7200] disabled:opacity-40"
                    >
                      <IconMinus size={17} />
                    </button>

                    <span className="flex h-full min-w-14 items-center justify-center border-x border-[#e1dbd2] text-[13px] font-black text-[#25221f]">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(quantity + 1)
                      }
                      className="flex h-full w-12 items-center justify-center text-[#55504a] transition hover:text-[#FF7200]"
                    >
                      <IconPlus size={17} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={buyNow}
                    className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF7200] px-6 text-[10px] font-black uppercase tracking-[0.13em] text-white shadow-[0_12px_30px_rgba(255,114,0,0.2)] transition hover:-translate-y-0.5 hover:bg-[#e86600]"
                  >
                    Buy Now
                    <IconArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={addToCart}
                    className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border border-[#1c1a18] bg-[#1c1a18] px-6 text-[10px] font-black uppercase tracking-[0.13em] text-white transition hover:bg-[#FF7200] hover:border-[#FF7200]"
                  >
                    <IconShoppingBag size={17} />

                    {cartAdded
                      ? "Added to Cart"
                      : "Add to Cart"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={toggleWishlist}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#e1dbd2] bg-white text-[9px] font-black uppercase tracking-[0.12em] text-[#55504a] transition hover:border-[#FF7200] hover:text-[#FF7200]"
                >
                  {isWishlisted ? (
                    <>
                      <IconHeartFilled
                        size={16}
                        className="text-[#FF7200]"
                      />
                      Remove from Wishlist
                    </>
                  ) : (
                    <>
                      <IconHeart size={17} />
                      Add to Wishlist
                    </>
                  )}
                </button>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#e8e2d9] pt-5">
                <div className="flex items-center gap-2">
                  <IconClock
                    size={15}
                    className="text-[#D6B76E]"
                  />
                  <span className="text-[9px] font-bold text-[#716b63]">
                    Quick Dispatch
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <IconShieldCheck
                    size={15}
                    className="text-[#D6B76E]"
                  />
                  <span className="text-[9px] font-bold text-[#716b63]">
                    Secure Checkout
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <IconTruck
                    size={15}
                    className="text-[#D6B76E]"
                  />
                  <span className="text-[9px] font-bold text-[#716b63]">
                    Doorstep Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e7e1d8] bg-[#f8f7f3]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-[28px] border border-[#e2dcd3] bg-white p-6 shadow-[0_15px_45px_rgba(35,32,27,0.04)] sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff4e9] text-[#FF7200]">
                  <IconPackage size={21} />
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#aaa39a]">
                    Product Information
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-tight text-[#171614]">
                    Product Details
                  </h2>
                </div>
              </div>

              {description ? (
                <div className="mt-7 text-[13px] leading-7 text-[#666058]">
                  {description}
                </div>
              ) : (
                <p className="mt-7 text-sm text-[#999188]">
                  Product description is currently unavailable.
                </p>
              )}
            </div>

            <div className="rounded-[28px] border border-[#e2dcd3] bg-white p-6 shadow-[0_15px_45px_rgba(35,32,27,0.04)] sm:p-8">
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#aaa39a]">
                Product Data
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#171614]">
                Specifications
              </h2>

              {specifications.length > 0 ? (
                <div className="mt-6 divide-y divide-[#eee8df]">
                  {specifications.map(
                    ([key, value], index) => (
                      <div
                        key={`${key}-${index}`}
                        className="flex items-start justify-between gap-5 py-4"
                      >
                        <span className="text-[9px] font-bold capitalize text-[#969087]">
                          {String(key).replace(
                            /_/g,
                            " "
                          )}
                        </span>

                        <span className="max-w-[55%] text-right text-[10px] font-black text-[#292622]">
                          {String(value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-[#faf8f4] p-5">
                  <p className="text-[10px] leading-5 text-[#8d867d]">
                    Specifications for this product are
                    currently unavailable.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-[30px] bg-[#171614] p-7 text-white sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D6B76E]">
                  Ready to Order?
                </p>

                <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  Get {product.name} delivered to your doorstep.
                </h2>

                <p className="mt-3 max-w-xl text-[11px] leading-6 text-[#bcb6ae]">
                  Complete your purchase with our secure
                  checkout and enjoy a smooth shopping
                  experience.
                </p>
              </div>

              <button
                type="button"
                onClick={buyNow}
                className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#FF7200] px-7 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#e86600]"
              >
                Buy Now
                <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e8e2d9] bg-[#f8f7f3]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF7200]">
                Customer Feedback
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#171614]">
                Customer Reviews
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconStar
                    key={star}
                    size={17}
                    className="fill-[#D6B76E] text-[#D6B76E]"
                  />
                ))}
              </div>

              <span className="text-[10px] font-bold text-[#777168]">
                5.0 out of 5
              </span>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                name: "Verified Customer",
                text: "Great product quality and smooth overall shopping experience.",
              },
              {
                name: "Happy Customer",
                text: "Product was exactly as described. Very happy with the purchase.",
              },
              {
                name: "Verified Buyer",
                text: "Good quality, clean packaging and fast delivery.",
              },
            ].map((review, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-[#e2dcd3] bg-white p-6"
              >
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconStar
                      key={star}
                      size={13}
                      className="fill-[#D6B76E] text-[#D6B76E]"
                    />
                  ))}
                </div>

                <p className="mt-5 text-[11px] leading-6 text-[#666058]">
                  “{review.text}”
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff4e9] text-[9px] font-black text-[#FF7200]">
                    {review.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-[9px] font-black text-[#292622]">
                      {review.name}
                    </p>

                    <div className="mt-0.5 flex items-center gap-1 text-[7px] font-bold uppercase tracking-[0.08em] text-[#198754]">
                      <IconCheck size={10} />
                      Verified Purchase
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}