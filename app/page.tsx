"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  UserRound,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Star,
  MessageCircle,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

import { categories, products } from "../data/products";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [mobileCategories, setMobileCategories] = useState(false);
  const [sliderIndex, setSliderIndex] = useState<Record<string, number>>({});
  const [sort, setSort] = useState("popular");

  const mainCategories = categories.slice(0, 9);

  /*
   * Automatically move every category slider.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setSliderIndex((previous) => {
        const next = { ...previous };

        mainCategories.forEach((category) => {
          const categoryProducts = products.filter(
            (product) =>
              String(product.category || "").toLowerCase() ===
              String(category.name || "").toLowerCase()
          );

          if (categoryProducts.length > 1) {
            const current = next[category.name] || 0;

            next[category.name] =
              (current + 1) % categoryProducts.length;
          }
        });

        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [mainCategories]);

  /*
   * Search + category filtering.
   */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All Products") {
      result = result.filter(
        (product) =>
          String(product.category || "").toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((product) => {
        const name = String(product.name || "").toLowerCase();
        const category = String(product.category || "").toLowerCase();
        const description = String(
          product.description || ""
        ).toLowerCase();

        return (
          name.includes(query) ||
          category.includes(query) ||
          description.includes(query)
        );
      });
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    return result;
  }, [search, selectedCategory, sort]);

  const getCategoryProducts = (categoryName: string) => {
    return products.filter(
      (product) =>
        String(product.category || "").toLowerCase() ===
        String(categoryName || "").toLowerCase()
    );
  };

  const moveSlider = (
    categoryName: string,
    direction: "next" | "prev"
  ) => {
    const categoryProducts = getCategoryProducts(categoryName);

    if (!categoryProducts.length) return;

    setSliderIndex((previous) => {
      const current = previous[categoryName] || 0;

      const next =
        direction === "next"
          ? (current + 1) % categoryProducts.length
          : (current - 1 + categoryProducts.length) %
            categoryProducts.length;

      return {
        ...previous,
        [categoryName]: next,
      };
    });
  };

  const renderProductCard = (
    product: (typeof products)[number]
  ) => (
    <article className="productCard" key={product.id}>
      <div className="productImageWrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

        {product.badge && (
          <span className="badge">{product.badge}</span>
        )}
      </div>

      <div className="productBody">
        <div className="miniCat">
          {product.category}
        </div>

        <h3>{product.name}</h3>

        <div className="rating">
          <Star size={14} fill="currentColor" />
          <strong>{product.rating}</strong>
          <span>({product.reviews})</span>
        </div>

        <div className="price">{product.price}</div>

        <div className="orderLabel">
          Order Now
        </div>

        <a
          className="amazonBtn"
          href={product.amazonUrl}
          target="_blank"
          rel="nofollow sponsored noopener"
        >
          🛒 View on Amazon
        </a>
      </div>
    </article>
  );

  return (
    <main>
      {/* ================= HEADER ================= */}

      <header className="topbar">
        <div className="brand">
          <span className="brandMark">Z</span>

          <span>
            Zishi<span>Buys</span>
          </span>
        </div>

        <div className="search">
          <Search size={19} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search thousands of products..."
          />

          <button>Search</button>
        </div>

        <div className="headActions">
          <button className="iconBtn">
            <UserRound size={20} />
            <span>Account</span>
          </button>

          <button className="iconBtn">
            <ShoppingBag size={20} />
            <span>Orders</span>
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="heroWrap">
        {/* LEFT CATEGORY SIDEBAR */}

        <aside className="categoryPanel">
          <div className="panelTitle">
            SHOP CATEGORIES
          </div>

          <button
            className="mobileCategoryToggle"
            onClick={() =>
              setMobileCategories(!mobileCategories)
            }
          >
            <span>
              <SlidersHorizontal size={17} />
              Categories
            </span>

            <ChevronDown size={17} />
          </button>

          <div
            className={
              mobileCategories
                ? "categoryList open"
                : "categoryList"
            }
          >
            <button
              className={
                selectedCategory === "All Products"
                  ? "categoryRow active"
                  : "categoryRow"
              }
              onClick={() => {
                setSelectedCategory("All Products");
                setMobileCategories(false);
              }}
            >
              <span>🛍️ All Products</span>
              <ChevronRight size={16} />
            </button>

            {mainCategories.map((category) => (
              <button
                className={
                  selectedCategory === category.name
                    ? "categoryRow active"
                    : "categoryRow"
                }
                key={category.name}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setMobileCategories(false);
                }}
              >
                <span>
                  {category.icon} {category.name}
                </span>

                <ChevronRight size={16} />
              </button>
            ))}
          </div>

          <a
            className="allCats"
            href="#all-products"
          >
            View all products →
          </a>
        </aside>

        {/* HERO */}

        <div className="hero">
          <div className="heroCopy">
            <div className="eyebrow">
              <Sparkles size={15} />
              TRENDING HOME FINDS
            </div>

            <h1>
              Better products.
              <br />
              <strong>Smarter living.</strong>
            </h1>

            <p>
              Discover useful household essentials,
              clever gadgets and products worth knowing
              about.
            </p>

            <div className="heroButtons">
              <a
                href="#all-products"
                className="primaryBtn"
              >
                Explore Products
              </a>

              <a
                href="#special"
                className="ghostBtn"
              >
                Custom Order
              </a>
            </div>
          </div>

          <div className="heroOrb">ZB</div>
        </div>
      </section>

      {/* ================= CATEGORY SLIDERS ================= */}

      <section className="section">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">
              SHOP BY CATEGORY
            </div>

            <h2>
              Explore Our Main Categories
            </h2>

            <p className="sectionSub">
              Discover products from our latest
              collections.
            </p>
          </div>
        </div>

        {mainCategories.map((category) => {
          const categoryProducts =
            getCategoryProducts(category.name);

          if (!categoryProducts.length) {
            return null;
          }

          const currentIndex =
            sliderIndex[category.name] || 0;

          const visibleProducts = [];

          for (let i = 0; i < Math.min(4, categoryProducts.length); i++) {
            visibleProducts.push(
              categoryProducts[
                (currentIndex + i) %
                  categoryProducts.length
              ]
            );
          }

          return (
            <div
              className="categorySliderSection"
              key={category.name}
            >
              <div className="sliderHeader">
                <div>
                  <div className="eyebrow">
                    {category.icon} CATEGORY
                  </div>

                  <h2>{category.name}</h2>
                </div>

                <div className="sliderButtons">
                  <button
                    className="sliderBtn"
                    onClick={() =>
                      moveSlider(
                        category.name,
                        "prev"
                      )
                    }
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    className="sliderBtn"
                    onClick={() =>
                      moveSlider(
                        category.name,
                        "next"
                      )
                    }
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="productSlider">
                <div className="productSliderTrack">
                  {visibleProducts.map(
                    (product) =>
                      renderProductCard(product)
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ================= ALL PRODUCTS ================= */}

      <section
        className="section allProductsSection"
        id="all-products"
      >
        <div className="sectionHead">
          <div>
            <div className="eyebrow">
              COMPLETE COLLECTION
            </div>

            <h2>
              All Uploaded Products
            </h2>

            <p className="sectionSub">
              {filteredProducts.length} products available
            </p>
          </div>

          <select
            className="sortBtn"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
          >
            <option value="popular">
              Sort: Popular
            </option>

            <option value="rating">
              Sort: Top Rated
            </option>
          </select>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="productGrid">
            {filteredProducts.map((product) =>
              renderProductCard(product)
            )}
          </div>
        ) : (
          <div className="emptyProducts">
            <Search size={35} />

            <h3>No products found</h3>

            <p>
              Try another search or select a different
              category.
            </p>
          </div>
        )}
      </section>

      {/* ================= SPECIAL ================= */}

      <section
        className="special"
        id="special"
      >
        <div>
          <div className="eyebrow">
            SPECIAL / CUSTOM PRODUCTS
          </div>

          <h2>
            Looking for something specific?
          </h2>

          <p>
            Tell ZishiBuys what you need and contact us
            directly on WhatsApp.
          </p>
        </div>

        <a
          className="whatsappBtn"
          href="https://wa.me/933252466277?text=Hello%20ZishiBuys%2C%20I%20want%20to%20order%20a%20special%2Fcustom%20product."
          target="_blank"
          rel="noopener"
        >
          <MessageCircle size={21} />
          Order Custom Product on WhatsApp
        </a>
      </section>

      {/* ================= FOOTER ================= */}

      <footer>
        <div className="brand footerBrand">
          <span className="brandMark">Z</span>

          <span>
            Zishi<span>Buys</span>
          </span>
        </div>

        <p>
          Smart finds for modern homes.
        </p>
      </footer>
    </main>
  );
}
