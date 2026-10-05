"use client";

import { useEffect, useState } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Flame,
  Truck,
  ShieldCheck,
  Headphones,
  Tag,
  Star,
  Grid3X3,
  ExternalLink,
  MessageCircle,
  Play,
  Image as ImageIcon,
} from "lucide-react";

import { categories, products } from "@/data/products";

const WHATSAPP_NUMBER = "923252466277";

const whatsappMessage = encodeURIComponent(
  "Hello ZishiBuys, I want to place a special custom order."
);

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % categories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentCategory = categories[slide];

  const currentProduct =
    products.find(
      (product) => product.category === currentCategory.name
    ) || products[0];

  const currentImage =
    currentProduct.images?.[0] || "/placeholder-product.jpg";

  const nextSlide = () => {
    setSlide((current) => (current + 1) % categories.length);
  };

  const previousSlide = () => {
    setSlide(
      (current) =>
        (current - 1 + categories.length) % categories.length
    );
  };

  const normalizedSearch = search.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const selectCategory = (
    categoryName: string,
    index?: number
  ) => {
    setSelectedCategory(categoryName);

    if (typeof index === "number") {
      setSlide(index);
    }

    setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <main className="site">
      {/* TOP BAR */}
      <div className="topbar">
        <div>Welcome to ZishiBuys</div>

        <div className="top-links">
          <span>📱 Download App</span>
          <span>🛍️ Sell on ZishiBuys</span>
          <span>❓ Help Center</span>
        </div>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-box">Z</div>

            <div>
              <div className="logo-name">
                Zishi<span>Buys</span>
              </div>

              <div className="tagline">
                Better products. Better prices.
              </div>
            </div>
          </div>

          <div className="search-box">
            <button
              className="category-select"
              type="button"
              onClick={() => selectCategory("All")}
            >
              All Categories
              <ChevronDown size={15} />
            </button>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
            />

            <button
              className="search-button"
              type="button"
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Search size={18} />
              Search
            </button>
          </div>

          <div className="header-actions">
            <div className="header-action">
              <User size={20} />
              <span>Account</span>
            </div>

            <div className="header-action wishlist">
              <Heart size={20} />
              <span>Wishlist</span>
            </div>

            <div className="header-action cart">
              <ShoppingCart size={21} />
              <span>Amazon Orders</span>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="navigation">
        <div className="navigation-inner">
          <button
            className="all-category"
            type="button"
            onClick={() => selectCategory("All")}
          >
            <Menu size={18} />
            All Categories
          </button>

          <div className="nav-links">
            {categories.slice(0, 7).map((category, index) => (
              <button
                key={category.name}
                type="button"
                onClick={() =>
                  selectCategory(category.name, index)
                }
              >
                {category.name}
              </button>
            ))}
          </div>

          <button
            className="flash-link"
            type="button"
            onClick={() =>
              document
                .getElementById("deals")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Flame size={17} />
            Flash Deals
          </button>
        </div>
      </nav>

      <div className="container">
        {/* HERO */}
        <section className="hero-layout">
          <aside className="category-sidebar">
            <div className="sidebar-title">
              SHOP CATEGORIES
            </div>

            <button
              className={
                selectedCategory === "All"
                  ? "sidebar-all selected"
                  : "sidebar-all"
              }
              onClick={() => selectCategory("All")}
              type="button"
            >
              <span>
                <Grid3X3 size={15} />
                All Products
              </span>

              <ChevronRight size={15} />
            </button>

            {categories.map((category, index) => (
              <button
                key={category.name}
                className={
                  slide === index
                    ? "sidebar-category active"
                    : "sidebar-category"
                }
                onClick={() =>
                  selectCategory(category.name, index)
                }
                type="button"
              >
                <span>
                  {category.icon} {category.name}
                </span>

                <ChevronRight size={14} />
              </button>
            ))}

            <button
              className="view-products"
              type="button"
              onClick={() => selectCategory("All")}
            >
              View all products →
            </button>
          </aside>

          {/* SLIDER */}
          <section className="category-slider">
            <div className="slider-inner">
              <div
                className="slider-info"
                key={`text-${currentProduct.id}`}
              >
                <div className="slider-category">
                  {currentCategory.icon}{" "}
                  {currentCategory.name}
                </div>

                <h1>
                  Shop smarter.
                  <br />
                  <span>Save bigger.</span>
                </h1>

                <p>
                  Discover useful products, trending gadgets
                  and everyday essentials at amazing prices.
                </p>

                <div className="slider-product-name">
                  {currentProduct.name}
                </div>

                <div className="slider-rating">
                  <Star size={15} fill="currentColor" />

                  {currentProduct.rating}

                  <span>
                    ({currentProduct.reviews})
                  </span>
                </div>

                <div className="slider-price">
                  {currentProduct.price}
                </div>

                <div className="slider-buttons">
                  <a
                    href={currentProduct.amazonUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="order-now-button"
                  >
                    <span className="amazon-icon">
                      a
                    </span>

                    <span>Order Now</span>

                    <ExternalLink size={15} />
                  </a>

                  <button
                    className="explore-button"
                    type="button"
                    onClick={() =>
                      selectCategory(
                        currentProduct.category,
                        categories.findIndex(
                          (category) =>
                            category.name ===
                            currentProduct.category
                        )
                      )
                    }
                  >
                    Explore Deals
                  </button>
                </div>
              </div>

              {/* SLIDER IMAGE */}
              <div
                className="slider-image-area"
                key={`image-${currentProduct.id}`}
              >
                <img
                  src={currentImage}
                  alt={`${currentProduct.name} - ZishiBuys`}
                  className="slider-product-image"
                />

                <div className="sale-badge">
                  <small>SALE</small>
                  <strong>70%</strong>
                  <span>OFF</span>
                </div>

                {currentProduct.images.length > 1 && (
                  <div className="image-count-badge">
                    <ImageIcon size={13} />
                    {currentProduct.images.length}
                  </div>
                )}

                {currentProduct.videos.length > 0 && (
                  <a
                    href={currentProduct.videos[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-badge"
                  >
                    <Play
                      size={13}
                      fill="currentColor"
                    />
                    Watch Video
                  </a>
                )}
              </div>

              <button
                className="slider-arrow left"
                onClick={previousSlide}
                aria-label="Previous product"
                type="button"
              >
                <ChevronLeft size={25} />
              </button>

              <button
                className="slider-arrow right"
                onClick={nextSlide}
                aria-label="Next product"
                type="button"
              >
                <ChevronRight size={25} />
              </button>

              <div className="slider-dots">
                {categories.map((category, index) => (
                  <button
                    key={category.name}
                    onClick={() => setSlide(index)}
                    className={
                      slide === index
                        ? "slider-dot active"
                        : "slider-dot"
                    }
                    aria-label={`Show ${category.name}`}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </section>
        </section>

        {/* BENEFITS */}
        <section className="benefits">
          <div className="benefit">
            <Truck />

            <div>
              <strong>Free Shipping</strong>
              <small>Selected products</small>
            </div>
          </div>

          <div className="benefit">
            <ShieldCheck />

            <div>
              <strong>Buyer Protection</strong>
              <small>Shop with confidence</small>
            </div>
          </div>

          <div className="benefit">
            <Headphones />

            <div>
              <strong>24/7 Support</strong>
              <small>We're here to help</small>
            </div>
          </div>
        </section>

        {/* CUSTOM ORDERS */}
        <section className="custom-orders">
          <div className="custom-orders-icon">
            <MessageCircle size={30} />
          </div>

          <div className="custom-orders-content">
            <span>SPECIAL CUSTOM ORDERS</span>

            <h2>
              Can't find what you're looking for?
            </h2>

            <p>
              Send us your product request on WhatsApp
              and our team will help you find it.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-order-button"
          >
            <MessageCircle size={20} />
            WhatsApp Us
          </a>
        </section>

        {/* FLASH DEALS */}
        <section className="flash-deals" id="deals">
          <div className="flash-heading">
            <div className="limited">
              🔥 LIMITED TIME
            </div>

            <h2>Flash Deals</h2>

            <p>
              Grab today's hottest deals before they're
              gone.
            </p>
          </div>

          <div className="flash-items">
            <div>
              <Flame />
              <strong>HOT DEALS</strong>
              <small>Up to 70% OFF</small>
            </div>

            <div>
              <Truck />
              <strong>FAST SHIPPING</strong>
              <small>On selected items</small>
            </div>

            <div>
              <ShieldCheck />
              <strong>EASY PAYMENT</strong>
              <small>Safe &amp; secure checkout</small>
            </div>
          </div>

          <button
            className="view-deals"
            type="button"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            View All Deals →
          </button>
        </section>

        {/* PRODUCTS */}
        <section
          className="products-section"
          id="products"
        >
          <div className="section-heading">
            <div>
              <div className="trending">
                <Tag size={15} />
                TRENDING NOW
              </div>

              <h2>Popular Products</h2>

              <p>
                Popular picks our customers are loving
                right now.
              </p>
            </div>

            <strong>
              {filteredProducts.length} products
            </strong>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <Search size={30} />

              <h3>No products found</h3>

              <p>
                Try another product name or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const productImage =
                  product.images?.[0] ||
                  "/placeholder-product.jpg";

                return (
                  <article
                    className="product-card"
                    key={product.id}
                  >
                    <div className="product-image-wrapper">
                      <span className="product-badge">
                        {product.badge}
                      </span>

                      <button
                        className="heart-button"
                        type="button"
                        aria-label={`Add ${product.name} to wishlist`}
                      >
                        <Heart size={17} />
                      </button>

                      <img
                        src={productImage}
                        alt={`${product.name} - ${product.category}`}
                        loading="lazy"
                      />

                      {/* IMAGE COUNT */}
                      {product.images.length > 1 && (
                        <div className="product-media-count">
                          <ImageIcon size={13} />
                          {product.images.length} Images
                        </div>
                      )}
                    </div>

                    <div className="product-content">
                      <div className="product-category">
                        {product.category}
                      </div>

                      <h3>{product.name}</h3>

                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-rating">
                        <Star
                          size={14}
                          fill="currentColor"
                        />

                        <b>{product.rating}</b>

                        <span>
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="product-price">
                        {product.price}
                      </div>

                      <div className="shipping">
                        FREE SHIPPING
                      </div>

                      {/* MULTIPLE VIDEOS */}
                      {product.videos.length > 0 && (
                        <div className="product-videos">
                          {product.videos.map(
                            (video, videoIndex) => (
                              <a
                                key={`${product.id}-video-${videoIndex}`}
                                href={video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="watch-video-button"
                              >
                                <Play
                                  size={14}
                                  fill="currentColor"
                                />

                                {product.videos.length >
                                1
                                  ? `Watch Video ${
                                      videoIndex + 1
                                    }`
                                  : "Watch Product Video"}
                              </a>
                            )
                          )}
                        </div>
                      )}

                      <a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        className="amazon-order-button"
                      >
                        <span className="amazon-small-icon">
                          a
                        </span>

                        <span>Order Now</span>

                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* AFFILIATE NOTICE */}
        <section className="affiliate-notice">
          <strong>
            Amazon Affiliate Disclosure
          </strong>

          <p>
            ZishiBuys may earn a commission when you
            purchase through qualifying Amazon affiliate
            links. Product prices and availability are
            determined by Amazon.
          </p>
        </section>

        {/* TRUST BAR */}
        <section className="trust-bar">
          <div>
            <ShieldCheck />

            <div>
              <strong>Secure Shopping</strong>
              <small>
                Your information is protected
              </small>
            </div>
          </div>

          <div>
            <Truck />

            <div>
              <strong>Fast Delivery</strong>
              <small>
                Reliable shipping options
              </small>
            </div>
          </div>

          <div>
            <Tag />

            <div>
              <strong>Great Prices</strong>
              <small>
                Deals you'll love
              </small>
            </div>
          </div>

          <div>
            <Headphones />

            <div>
              <strong>Customer Support</strong>
              <small>
                We're here when you need us
              </small>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-box">Z</div>

              <div className="logo-name">
                Zishi<span>Buys</span>
              </div>
            </div>

            <p>
              Better products. Better prices.
            </p>

            <small>
              Discover useful products, trending gadgets
              and everyday essentials at great prices.
            </small>
          </div>

          <div className="footer-column">
            <h4>Customer Service</h4>
            <span>Help Center</span>
            <span>Shipping Information</span>
            <span>Returns &amp; Refunds</span>
            <span>Contact Us</span>
          </div>

          <div className="footer-column">
            <h4>Shop</h4>
            <span>All Products</span>
            <span>Flash Deals</span>
            <span>New Arrivals</span>
            <span>Best Sellers</span>
          </div>

          <div className="footer-column">
            <h4>About ZishiBuys</h4>
            <span>About Us</span>
            <span>Privacy Policy</span>
            <span>Terms &amp; Conditions</span>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 ZishiBuys. All rights reserved.
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-floating"
        aria-label="Special Custom Orders on WhatsApp"
      >
        <MessageCircle size={24} />
        <span>Custom Order</span>
      </a>

      {/* MOBILE NAV */}
      <div className="mobile-bottom-nav">
        <button
          className="active"
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <Grid3X3 size={19} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("products")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          <Menu size={19} />
          <span>Products</span>
        </button>

        <button
          type="button"
          onClick={() => selectCategory("All")}
        >
          <Heart size={19} />
          <span>Wishlist</span>
        </button>

        <button
          type="button"
          onClick={() =>
            window.open(
              whatsappUrl,
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <MessageCircle size={19} />
          <span>WhatsApp</span>
        </button>

        <button type="button">
          <User size={19} />
          <span>Account</span>
        </button>
      </div>
    </main>
  );
}
