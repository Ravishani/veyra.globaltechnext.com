"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  IconAlertCircle,
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconHeart,
  IconInfoCircle,
  IconRefresh,
  IconShoppingBag,
  IconShoppingCart,
  IconStar,
  IconX,
  IconPackage,
  IconTruck,
  IconShieldCheck,
} from "@tabler/icons-react";

import { useCart } from "../context/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function formatNumber(
  value,
  maximumFractionDigits = 2
) {
  return Number(value || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits,
    }
  );
}

function getPlainText(html = "") {
  if (!html) {
    return "";
  }

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
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

function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className="fixed right-4 top-4 z-[100000] w-[calc(100%-32px)] max-w-[390px] sm:right-6 sm:top-6">
      <div className="overflow-hidden rounded-2xl border border-white bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
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

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 8 }).map(
        (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[26px] border border-[#e6e1d8] bg-white"
          >
            <div className="aspect-square animate-pulse bg-[#eeeae3]" />

            <div className="space-y-3 p-5">
              <div className="h-2.5 w-20 animate-pulse rounded-full bg-[#eeeae3]" />

              <div className="h-5 w-4/5 animate-pulse rounded-full bg-[#eeeae3]" />

              <div className="h-5 w-3/5 animate-pulse rounded-full bg-[#eeeae3]" />

              <div className="h-7 w-32 animate-pulse rounded-full bg-[#eeeae3]" />

              <div className="grid grid-cols-2 gap-2">
                <div className="h-11 animate-pulse rounded-xl bg-[#eeeae3]" />
                <div className="h-11 animate-pulse rounded-xl bg-[#eeeae3]" />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default function ProductsPage() {
  const {
    cartItems,
    addToCart: addProductToCart,
  } = useCart();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [addedProduct, setAddedProduct] =
    useState(null);

  const [wishlist, setWishlist] =
    useState([]);

  const [toast, setToast] =
    useState(null);

  const showToast = (
    type,
    title,
    message
  ) => {
    setToast({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    const savedWishlist =
      localStorage.getItem(
        "wishlist"
      );

    if (savedWishlist) {
      try {
        const parsedWishlist =
          JSON.parse(savedWishlist);

        setWishlist(
          Array.isArray(parsedWishlist)
            ? parsedWishlist
            : []
        );
      } catch {
        setWishlist([]);
      }
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      if (!API_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured."
        );
      }

      const apiUrl = API_URL.replace(
        /\/+$/,
        ""
      );

      const productsUrl = `${apiUrl}/products`;

      const response = await fetch(
        productsUrl,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        !contentType
          .toLowerCase()
          .includes("application/json")
      ) {
        const text =
          await response.text();

        console.error(
          "Products API returned non-JSON:",
          {
            url: productsUrl,
            status: response.status,
            statusText:
              response.statusText,
            contentType,
            response:
              text.substring(0, 500),
          }
        );

        throw new Error(
          `API returned ${response.status} ${response.statusText} instead of JSON.`
        );
      }

      const data =
        await response.json();

      if (
        !response.ok ||
        data?.status !== true
      ) {
        throw new Error(
          data?.message ||
            "Unable to fetch products."
        );
      }

      setProducts(
        Array.isArray(data?.data)
          ? data.data
          : []
      );
    } catch (err) {
      console.error(
        "Products API Error:",
        err
      );

      setProducts([]);

      const message =
        err?.message ||
        "Unable to load products.";

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

  const getDiscount = (product) => {
    const price = Number(
      product?.price || 0
    );

    const discountPrice = Number(
      product?.discount_price || 0
    );

    if (
      !discountPrice ||
      !price ||
      discountPrice >= price
    ) {
      return 0;
    }

    return Math.round(
      ((price - discountPrice) /
        price) *
        100
    );
  };

  const getProductPrice = (
    product
  ) => {
    const price = Number(
      product?.price || 0
    );

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
  };

  const addToCart = (product) => {
    if (!product) {
      return;
    }

    const existingProduct =
      cartItems.find(
        (item) =>
          Number(item.id) ===
          Number(product.id)
      );

    addProductToCart(product);

    if (existingProduct) {
      showToast(
        "success",
        "Cart updated",
        `${product.name} quantity has been increased.`
      );
    } else {
      showToast(
        "success",
        "Added to cart",
        `${product.name} has been added to your cart.`
      );
    }

    setAddedProduct(
      product.id
    );

    setTimeout(() => {
      setAddedProduct(null);
    }, 1500);
  };

  const toggleWishlist = (
    product
  ) => {
    const exists =
      wishlist.some(
        (id) =>
          Number(id) ===
          Number(product.id)
      );

    let updatedWishlist;

    if (exists) {
      updatedWishlist =
        wishlist.filter(
          (id) =>
            Number(id) !==
            Number(product.id)
        );

      showToast(
        "info",
        "Removed from wishlist",
        `${product.name} was removed from your wishlist.`
      );
    } else {
      updatedWishlist = [
        ...wishlist,
        product.id,
      ];

      showToast(
        "success",
        "Added to wishlist",
        `${product.name} was added to your wishlist.`
      );
    }

    setWishlist(
      updatedWishlist
    );

    localStorage.setItem(
      "wishlist",
      JSON.stringify(
        updatedWishlist
      )
    );
  };

  return (
    <>
      <Toast
        toast={toast}
        onClose={() =>
          setToast(null)
        }
      />

      <main className="min-h-screen bg-[#f8f7f3]">
        <section className="relative overflow-hidden border-b border-[#e6e1d8]">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-3xl" />

          <div className="absolute -bottom-60 -left-40 h-[500px] w-[500px] rounded-full bg-[#ded8cd]/30 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pb-16 lg:pt-20">
            <div className="max-w-[720px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ded8cc] bg-white px-3.5 py-2 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-50" />

                  <span className="relative h-2 w-2 rounded-full bg-[var(--primary)]" />
                </span>

                <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#716c63]">
                  Premium Collection
                </span>
              </div>

              <h1 className="text-[44px] font-black leading-[1.02] tracking-[-0.055em] text-[#20201c] sm:text-[58px] lg:text-[70px]">
                Discover products
                <br />
                <span className="text-[var(--primary)]">
                  made for you.
                </span>
              </h1>

              <p className="mt-6 max-w-[610px] text-[13px] leading-7 text-[#77736b] sm:text-[15px] sm:leading-8">
                Explore our carefully
                selected collection of
                quality products,
                transparent pricing and
                a simple premium shopping
                experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-[#e1ddd5] bg-white px-4 py-2.5">
                  <IconShieldCheck
                    size={14}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[9px] font-bold text-[#625e57]">
                    Quality Assured
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[#e1ddd5] bg-white px-4 py-2.5">
                  <IconTruck
                    size={14}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[9px] font-bold text-[#625e57]">
                    Easy Shopping
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[#e1ddd5] bg-white px-4 py-2.5">
                  <IconPackage
                    size={14}
                    className="text-[var(--primary)]"
                  />

                  <span className="text-[9px] font-bold text-[#625e57]">
                    Premium Products
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-7 flex flex-col gap-4 border-b border-[#e2ddd4] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#aaa49a]">
                Product Collection
              </p>

              <div className="mt-1 flex items-center gap-2">
                <h2 className="text-[18px] font-black tracking-[-0.03em] text-[#292721]">
                  Shop Products
                </h2>

                {!loading && (
                  <span className="rounded-full bg-[#ebe7df] px-2 py-1 text-[8px] font-black text-[#777168]">
                    {products.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {loading && (
            <ProductSkeleton />
          )}

          {!loading && error && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="w-full max-w-[440px] rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-[0_20px_60px_rgba(35,32,27,0.06)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <IconAlertCircle
                    size={28}
                  />
                </div>

                <h2 className="mt-5 text-[21px] font-black text-[#292721]">
                  Products
                  unavailable
                </h2>

                <p className="mt-2 text-[10px] leading-5 text-[#858078]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    fetchProducts
                  }
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--primary-hover)]"
                >
                  <IconRefresh
                    size={14}
                  />

                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#aaa59c] shadow-sm">
                    <IconShoppingBag
                      size={30}
                    />
                  </div>

                  <h2 className="mt-5 text-[20px] font-black text-[#292721]">
                    No products found
                  </h2>

                  <p className="mt-2 text-[10px] text-[#858078]">
                    Products will
                    appear here once
                    they are added.
                  </p>
                </div>
              </div>
            )}

          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(
                  (product) => {
                    const discount =
                      getDiscount(
                        product
                      );

                    const currentPrice =
                      getProductPrice(
                        product
                      );

                    const imageUrl =
                      getImageUrl(
                        product.image
                      );

                    const isAdded =
                      addedProduct ===
                      product.id;

                    const isWishlisted =
                      wishlist.some(
                        (id) =>
                          Number(id) ===
                          Number(
                            product.id
                          )
                      );

                    const description =
                      getPlainText(
                        product.description
                      );

                    const cartItem =
                      cartItems.find(
                        (item) =>
                          Number(
                            item.id
                          ) ===
                          Number(
                            product.id
                          )
                      );

                    return (
                      <article
                        key={
                          product.id
                        }
                        className="group relative overflow-hidden rounded-[26px] border border-[#e2ded6] bg-white shadow-[0_15px_50px_rgba(35,32,27,0.055)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--primary)]/30 hover:shadow-[0_28px_70px_rgba(35,32,27,0.12)]"
                      >
                        <div className="relative aspect-square overflow-hidden bg-[#f1eee8]">
                          {imageUrl ? (
                            <img
                              src={
                                imageUrl
                              }
                              alt={
                                product.name ||
                                "Product"
                              }
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                              onError={(
                                event
                              ) => {
                                console.error(
                                  "Laravel image failed:",
                                  imageUrl
                                );

                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <IconShoppingBag
                                size={65}
                                className="text-[#d0cbc2]"
                              />
                            </div>
                          )}

                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                          {discount >
                            0 && (
                            <div className="absolute left-4 top-4 rounded-full bg-[var(--primary)] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-white shadow-lg">
                              {discount}% OFF
                            </div>
                          )}

                          {product.category && (
                            <div className="absolute bottom-4 left-4 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 backdrop-blur-md">
                              <span className="text-[7px] font-black uppercase tracking-[0.14em] text-[#625e57]">
                                {
                                  product
                                    .category
                                    .name
                                }
                              </span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              toggleWishlist(
                                product
                              )
                            }
                            className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition ${
                              isWishlisted
                                ? "border-red-100 bg-red-50 text-red-500"
                                : "border-white/80 bg-white/95 text-[#716c63] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                            }`}
                            aria-label={
                              isWishlisted
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                          >
                            <IconHeart
                              size={17}
                              fill={
                                isWishlisted
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        </div>

                        <div className="p-5">
                          {product.category && (
                            <p className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-[var(--primary)]">
                              {
                                product
                                  .category
                                  .name
                              }
                            </p>
                          )}

                          <h2 className="mt-2 min-h-[48px] line-clamp-2 text-[17px] font-black leading-6 tracking-[-0.025em] text-[#292721] transition-colors group-hover:text-[#181713]">
                            {
                              product.name
                            }
                          </h2>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="flex gap-0.5 text-[#d6b76e]">
                                {[
                                  1,
                                  2,
                                  3,
                                  4,
                                  5,
                                ].map(
                                  (
                                    star
                                  ) => (
                                    <IconStar
                                      key={
                                        star
                                      }
                                      size={
                                        12
                                      }
                                      fill="currentColor"
                                    />
                                  )
                                )}
                              </div>

                              <span className="ml-1 text-[8px] font-bold text-[#aaa59c]">
                                5.0
                              </span>
                            </div>

                            {product.sku && (
                              <span className="max-w-[90px] truncate text-[7px] font-bold uppercase tracking-[0.08em] text-[#aaa49a]">
                                SKU:{" "}
                                {
                                  product.sku
                                }
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex items-end gap-2">
                            <span className="text-[23px] font-black tracking-[-0.045em] text-[#292721]">
                              ₹
                              {formatNumber(
                                currentPrice,
                                2
                              )}
                            </span>

                            {discount >
                              0 && (
                              <span className="pb-1 text-[10px] font-bold text-[#aaa59c] line-through">
                                ₹
                                {formatNumber(
                                  product.price,
                                  2
                                )}
                              </span>
                            )}
                          </div>

                          {description && (
                            <p className="mt-3 min-h-[32px] line-clamp-2 text-[9px] leading-4 text-[#858078]">
                              {
                                description
                              }
                            </p>
                          )}

                          <div className="mt-5 grid grid-cols-2 gap-2.5">
                            <Link
                              href={`/products/${product.slug}`}
                              className="group/details flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[#ded9d1] bg-white text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#625e56] transition hover:border-[var(--primary)] hover:bg-[#fffaf2] hover:text-[var(--primary)]"
                            >
                              View Details

                              <IconArrowRight
                                size={
                                  13
                                }
                                className="transition-transform group-hover/details:translate-x-0.5"
                              />
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                addToCart(
                                  product
                                )
                              }
                              className={`relative flex h-11 items-center justify-center gap-1.5 rounded-xl text-[8px] font-extrabold uppercase tracking-[0.08em] text-white shadow-sm transition ${
                                isAdded
                                  ? "bg-emerald-600"
                                  : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <IconCheck
                                    size={
                                      14
                                    }
                                  />

                                  Added
                                </>
                              ) : (
                                <>
                                  <IconShoppingCart
                                    size={
                                      14
                                    }
                                  />

                                  Add to Cart
                                </>
                              )}

                              {cartItem &&
                                Number(
                                  cartItem.quantity
                                ) >
                                  0 && (
                                  <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#171816] px-1 text-[7px] font-black text-white">
                                    {
                                      cartItem.quantity
                                    }
                                  </span>
                                )}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
        </section>
      </main>
    </>
  );
}