"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconAlertCircle,
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconHeart,
  IconInfoCircle,
  IconPackage,
  IconRefresh,
  IconShieldCheck,
  IconShoppingBag,
  IconShoppingCart,
  IconStar,
  IconTruck,
  IconX,
} from "@tabler/icons-react";
import { useCart } from "../context/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formatNumber = (value, maximumFractionDigits = 2) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits,
  });
};

const getPlainText = (html = "") => {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
};

const getImageUrl = (image) => {
  if (!image) {
    return "/placeholder-product.png";
  }

  const imageValue = String(image).trim();

  if (
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://") ||
    imageValue.startsWith("data:")
  ) {
    return imageValue;
  }

  const baseUrl = API_URL
    ?.replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

  if (!baseUrl) {
    return `/${imageValue.replace(/^\/+/, "")}`;
  }

  return `${baseUrl}/${imageValue.replace(/^\/+/, "")}`;
};

const Toast = ({ toast, onClose }) => {
  if (!toast) {
    return null;
  }

  const styles = {
    success: {
      icon: <IconCircleCheck size={22} />,
      wrapper: "border-[#cddfc9] bg-[#f3f8f1] text-[#41553b]",
      iconBg: "bg-[#dfeedd]",
    },
    error: {
      icon: <IconAlertCircle size={22} />,
      wrapper: "border-[#ead0cb] bg-[#fbf3f1] text-[#74443b]",
      iconBg: "bg-[#f2dfda]",
    },
    info: {
      icon: <IconInfoCircle size={22} />,
      wrapper: "border-[#ddd8ca] bg-[#f8f6ef] text-[#5e584b]",
      iconBg: "bg-[#ebe7da]",
    },
  };

  const currentStyle = styles[toast.type] || styles.info;

  return (
    <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-[390px] animate-[toastIn_0.3s_ease-out] sm:right-6 sm:top-6">
      <div
        className={`flex items-start gap-3 rounded-[18px] border p-4 shadow-[0_18px_50px_rgba(41,39,33,0.14)] backdrop-blur-xl ${currentStyle.wrapper}`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${currentStyle.iconBg}`}
        >
          {currentStyle.icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold tracking-[-0.01em]">
            {toast.title}
          </p>

          {toast.message && (
            <p className="mt-1 text-[13px] leading-5 opacity-80">
              {toast.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-black/5"
          aria-label="Close notification"
        >
          <IconX size={17} />
        </button>
      </div>
    </div>
  );
};

const ProductSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e8e4da] bg-white">
      <div className="aspect-[1.15/1] animate-pulse bg-[#ebe8e0]" />

      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded-full bg-[#ebe8e0]" />
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-[#ebe8e0]" />
        <div className="h-3 w-full animate-pulse rounded-full bg-[#ebe8e0]" />
        <div className="h-3 w-3/4 animate-pulse rounded-full bg-[#ebe8e0]" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-[#ebe8e0]" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-[#ebe8e0]" />
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const { cartItems, addToCart: addProductToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedProduct, setAddedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message = "") => {
    setToast({
      type,
      title,
      message,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(
        `${API_URL.replace(/\/+$/, "")}/products`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("Invalid response received from server.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to load products right now."
        );
      }

      if (data?.status === false) {
        throw new Error(
          data?.message || "Unable to load products right now."
        );
      }

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.products)
            ? data.products
            : [];

      setProducts(productList);
    } catch (err) {
      setProducts([]);

      const message =
        err?.message ||
        "Something went wrong while loading products.";

      setError(message);

      showToast(
        "error",
        "Products unavailable",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");

      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);

        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist);
        }
      }
    } catch {
      setWishlist([]);
    }

    fetchProducts();
  }, []);

  const getDiscount = (product) => {
    const price = Number(product?.price);
    const discountPrice = Number(product?.discount_price);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(discountPrice) ||
      price <= 0 ||
      discountPrice <= 0 ||
      discountPrice >= price
    ) {
      return 0;
    }

    return Math.round(
      ((price - discountPrice) / price) * 100
    );
  };

  const getProductPrice = (product) => {
    const price = Number(product?.price);
    const discountPrice = Number(product?.discount_price);

    if (
      Number.isFinite(discountPrice) &&
      discountPrice > 0 &&
      Number.isFinite(price) &&
      discountPrice < price
    ) {
      return discountPrice;
    }

    return Number.isFinite(price) ? price : 0;
  };

  const getProductId = (product) => {
    return (
      product?.id ??
      product?._id ??
      product?.product_id
    );
  };

  const isProductInCart = (product) => {
    const productId = getProductId(product);

    return cartItems?.some(
      (item) =>
        String(item?.id ?? item?.product_id) ===
        String(productId)
    );
  };

  const addToCart = (product) => {
    try {
      addProductToCart(product);

      const productId = getProductId(product);

      setAddedProduct(productId);

      showToast(
        "success",
        "Added to cart",
        `${product?.name || "Product"} has been added to your cart.`
      );

      window.setTimeout(() => {
        setAddedProduct(null);
      }, 1500);
    } catch (err) {
      showToast(
        "error",
        "Unable to add product",
        err?.message || "Please try again."
      );
    }
  };

  const toggleWishlist = (product) => {
    const productId = getProductId(product);

    if (!productId) {
      return;
    }

    setWishlist((current) => {
      const exists = current.some(
        (id) => String(id) === String(productId)
      );

      const updated = exists
        ? current.filter(
            (id) => String(id) !== String(productId)
          )
        : [...current, productId];

      try {
        localStorage.setItem(
          "wishlist",
          JSON.stringify(updated)
        );
      } catch {}

      if (exists) {
        showToast(
          "info",
          "Removed from wishlist",
          `${product?.name || "Product"} was removed from your wishlist.`
        );
      } else {
        showToast(
          "success",
          "Added to wishlist",
          `${product?.name || "Product"} was added to your wishlist.`
        );
      }

      return updated;
    });
  };

  return (
    <>
    

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

      <main className="min-h-screen bg-[#f8f7f3] text-[#292721]">
        <section className="relative overflow-hidden border-b border-[#e5e1d8] bg-[#efede7]">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#d9d3c4]/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-[#ded8c9]/70 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d8d2c5] bg-white/70 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />

                <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#716c63]">
                  Premium Collection
                </span>
              </div>

              <h1 className="max-w-3xl text-[44px] font-black leading-[1.02] tracking-[-0.055em] text-[#20201c] sm:text-[58px] lg:text-[70px]">
                Discover products
                <span className="block text-[var(--primary)]">
                  made for you.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-[13px] leading-7 tracking-[0.01em] text-[#77736b] sm:text-[15px] sm:leading-8">
                Explore our carefully selected collection of quality
                products, designed to make your shopping experience
                simple, smooth and reliable.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd8cc] bg-white/75 px-4 py-2.5">
                  <IconShieldCheck
                    size={17}
                    stroke={1.8}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[9px] font-bold tracking-[0.02em] text-[#625e57]">
                    Quality Assured
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd8cc] bg-white/75 px-4 py-2.5">
                  <IconShoppingBag
                    size={17}
                    stroke={1.8}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[9px] font-bold tracking-[0.02em] text-[#625e57]">
                    Easy Shopping
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd8cc] bg-white/75 px-4 py-2.5">
                  <IconPackage
                    size={17}
                    stroke={1.8}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[9px] font-bold tracking-[0.02em] text-[#625e57]">
                    Premium Products
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-8 rounded-full bg-[var(--primary)]" />

                <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#aaa49a]">
                  Our Collection
                </span>
              </div>

              <h2 className="text-[30px] font-black tracking-[-0.035em] text-[#292721] sm:text-[36px]">
                Shop Products
              </h2>

              {!loading && !error && (
                <p className="mt-2 text-[12px] tracking-[0.01em] text-[#817b6d]">
                  {products.length}{" "}
                  {products.length === 1
                    ? "product"
                    : "products"}{" "}
                  available
                </p>
              )}
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <ProductSkeleton key={index} />
                )
              )}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[24px] border border-[#e4ded1] bg-white px-6 py-14 text-center shadow-[0_8px_30px_rgba(41,39,33,0.04)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3eee6] text-[#766f61]">
                <IconAlertCircle
                  size={27}
                  stroke={1.7}
                />
              </div>

              <h3 className="mt-5 text-[21px] font-black tracking-[-0.02em] text-[#292721]">
                Unable to load products
              </h3>

              <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-[#777164]">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchProducts}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#292721] px-6 py-3 text-[9px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[var(--primary)]"
              >
                <IconRefresh size={16} />
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="rounded-[24px] border border-[#e4ded1] bg-white px-6 py-14 text-center shadow-[0_8px_30px_rgba(41,39,33,0.04)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3eee6] text-[#766f61]">
                  <IconPackage
                    size={27}
                    stroke={1.7}
                  />
                </div>

                <h3 className="mt-5 text-[21px] font-black tracking-[-0.02em] text-[#292721]">
                  No products found
                </h3>

                <p className="mt-2 text-[13px] text-[#777164]">
                  There are currently no products available.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                  const productId = getProductId(product);
                  const discount = getDiscount(product);
                  const currentPrice = getProductPrice(product);
                  const originalPrice = Number(product?.price);

                  const isWishlisted = wishlist.some(
                    (id) =>
                      String(id) === String(productId)
                  );

                  const isAdded =
                    String(addedProduct) ===
                    String(productId);

                  const inCart =
                    isProductInCart(product);

                  const description = getPlainText(
                    product?.short_description ||
                      product?.description ||
                      product?.details ||
                      ""
                  );

                  return (
                    <article
                      key={
                        productId ||
                        product?.slug ||
                        product?.name
                      }
                      className="group overflow-hidden rounded-[24px] border border-[#e5e1d8] bg-white shadow-[0_7px_26px_rgba(41,39,33,0.055)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_38px_rgba(41,39,33,0.10)]"
                    >
                      <div className="relative aspect-[1.15/1] overflow-hidden bg-[#f2f0ea]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.85),transparent_68%)]" />

                        {discount > 0 && (
                          <div className="absolute left-4 top-4 z-10 rounded-full bg-[var(--primary)] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white shadow-sm">
                            -{discount}% OFF
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            toggleWishlist(product)
                          }
                          className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                            isWishlisted
                              ? "border-[#d7c6a7] bg-[#292721] text-white"
                              : "border-white/80 bg-white/85 text-[#5d584d] hover:bg-white hover:text-[var(--primary)]"
                          }`}
                          aria-label={
                            isWishlisted
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <IconHeart
                            size={17}
                            stroke={1.8}
                            fill={
                              isWishlisted
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>

                        {product?.category?.name && (
                          <div className="absolute bottom-4 left-4 z-10 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#5d584d] backdrop-blur-md">
                            {product.category.name}
                          </div>
                        )}

                        <img
                          src={getImageUrl(
                            product?.image ||
                              product?.image_url ||
                              product?.thumbnail
                          )}
                          alt={
                            product?.name ||
                            "Product"
                          }
                          className="relative h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.045]"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.src =
                              "/placeholder-product.png";
                          }}
                        />
                      </div>

                      <div className="p-5">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-[var(--primary)]">
                            {product?.category?.name ||
                              product?.category_name ||
                              "Product"}
                          </span>

                          {product?.sku && (
                            <span className="text-[9px] font-medium tracking-[0.02em] text-[#aaa49a]">
                              SKU {product.sku}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/products/${
                            product?.slug ||
                            productId
                          }`}
                          className="block"
                        >
                          <h3 className="line-clamp-2 text-[17px] font-black leading-6 tracking-[-0.025em] text-[#292721] transition-colors group-hover:text-[var(--primary)]">
                            {product?.name ||
                              "Untitled Product"}
                          </h3>
                        </Link>

                        <div className="mt-2 flex items-center gap-1">
                          {Array.from({
                            length: 5,
                          }).map((_, index) => (
                            <IconStar
                              key={index}
                              size={13}
                              stroke={1.6}
                              fill="currentColor"
                              className="text-[#d6b76e]"
                            />
                          ))}

                          <span className="ml-1 text-[9px] font-medium tracking-[0.03em] text-[#8b8578]">
                            5.0
                          </span>
                        </div>

                        {description && (
                          <p className="mt-3 line-clamp-2 text-[10px] leading-5 tracking-[0.01em] text-[#858078]">
                            {description}
                          </p>
                        )}

                        <div className="mt-4 flex items-end gap-2">
                          <span className="text-[23px] font-black leading-none tracking-[-0.045em] text-[#292721]">
                            {formatNumber(currentPrice)}
                          </span>

                          {discount > 0 &&
                            Number.isFinite(originalPrice) &&
                            originalPrice > currentPrice && (
                              <span className="mb-0.5 text-[11px] font-medium tracking-[0.01em] text-[#9b9589] line-through">
                                {formatNumber(originalPrice)}
                              </span>
                            )}
                        </div>

                        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                          <Link
                            href={`/products/${
                              product?.slug ||
                              productId
                            }`}
                            className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#ddd8ce] bg-white px-3 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#4d493f] transition hover:border-[var(--primary)] hover:bg-[#faf8f3] hover:text-[var(--primary)]"
                          >
                            Details

                            <IconArrowRight
                              size={14}
                              stroke={1.8}
                            />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              addToCart(product)
                            }
                            className={`relative flex h-10 min-w-[112px] items-center justify-center gap-1.5 rounded-xl px-3 text-[8px] font-extrabold uppercase tracking-[0.08em] transition-all ${
                              isAdded || inCart
                                ? "bg-[var(--primary)] text-white shadow-[0_6px_18px_rgba(89,107,69,0.18)]"
                                : "bg-[#292721] text-white hover:bg-[var(--primary)]"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <IconCheck
                                  size={15}
                                  stroke={2.2}
                                />
                                Added
                              </>
                            ) : inCart ? (
                              <>
                                <IconShoppingCart
                                  size={15}
                                  stroke={1.9}
                                />
                                In Cart
                              </>
                            ) : (
                              <>
                                <IconShoppingCart
                                  size={15}
                                  stroke={1.9}
                                />
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </section>

        <section className="border-t border-[#e5e1d8] bg-[#eeece6]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 py-10 sm:grid-cols-3 sm:px-8 lg:px-10">
            <div className="flex items-center gap-4 rounded-[20px] border border-[#ddd8cc] bg-white/65 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4e9df] text-[var(--primary)]">
                <IconTruck
                  size={21}
                  stroke={1.7}
                />
              </div>

              <div>
                <p className="text-[12px] font-black tracking-[-0.01em] text-[#292721]">
                  Reliable Delivery
                </p>

                <p className="mt-1 text-[10px] leading-4 tracking-[0.01em] text-[#7b7569]">
                  Fast and secure order delivery
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[20px] border border-[#ddd8cc] bg-white/65 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4e9df] text-[var(--primary)]">
                <IconShieldCheck
                  size={21}
                  stroke={1.7}
                />
              </div>

              <div>
                <p className="text-[12px] font-black tracking-[-0.01em] text-[#292721]">
                  Secure Shopping
                </p>

                <p className="mt-1 text-[10px] leading-4 tracking-[0.01em] text-[#7b7569]">
                  Safe and protected checkout
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[20px] border border-[#ddd8cc] bg-white/65 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4e9df] text-[var(--primary)]">
                <IconRefresh
                  size={21}
                  stroke={1.7}
                />
              </div>

              <div>
                <p className="text-[12px] font-black tracking-[-0.01em] text-[#292721]">
                  Easy Support
                </p>

                <p className="mt-1 text-[10px] leading-4 tracking-[0.01em] text-[#7b7569]">
                  We are here when you need us
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
