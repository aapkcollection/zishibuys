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
  ArrowRight,
  ExternalLink,
} from "lucide-react";

import { categories, products } from "@/data/products";

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % categories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentCategory = categories[slide];

  const currentProduct =
    products.find((product) => product.category === currentCategory.name) ||
    products[0];

  const nextSlide = () => {
    setSlide((current) => (current + 1) % categories.length);
  };

  const previousSlide = () => {
    setSlide(
      (current) => (current - 1 + categories.length) % categories.length
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

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

            <button className="category-select">
              All Categories
              <ChevronDown size={15} />
            </button>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
            />

            <button className="search-button">
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
              <span>Cart</span>
              <b>0</b>
            </div>

          </div>

        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="navigation">
        <div className="navigation-inner">

          <div className="all-category">
            <Menu size={18} />
            All Categories
          </div>

          <div className="nav-links">
            <span>Electronics</span>
            <span>Fashion</span>
            <span>Home & Living</span>
            <span>Beauty & Health</span>
            <span>Sports</span>
            <span>Toys</span>
            <span>Automotive</span>
          </div>

          <div className="flash-link">
            <Flame size={17} />
            Flash Deals
          </div>

        </div>
      </nav>

      {/* MAIN */}
      <div className="container">

        {/* HERO AREA */}
        <section className="hero-layout">

          {/* CATEGORY SIDEBAR */}
          <aside className="category-sidebar">

            <div className="sidebar-title">
              SHOP CATEGORIES
            </div>

            <div className="sidebar-all">
              <Grid3X3 size={15} />
              All Products
              <ChevronRight size={15} />
            </div>

            {categories.map((category) => (
              <button
                key={category.name}
                className={
                  slide === categories.indexOf(category)
                    ? "sidebar-category active"
                    : "sidebar-category"
                }
                onClick={() =>
                  setSlide(categories.indexOf(category))
                }
              >
                <span>
                  {category.icon} {category.name}
                </span>

                <ChevronRight size={14} />
              </button>
            ))}

            <div className="view-products">
              View all products →
            </div>

          </aside>

          {/* SLIDER */}
          <section className="category-slider">

            <div className="slider-inner">

              <div className="slider-info">

                <div className="slider-category">
                  {currentCategory.icon} {currentCategory.name}
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
                    rel="noopener noreferrer"
                    className="order-now-button"
                  >
                    <span className="amazon-icon">a</span>
                    <span>Order Now</span>
                    <ExternalLink size={15} />
                  </a>

                  <button className="explore-button">
                    Explore Deals
                  </button>

                </div>

              </div>

              {/* PRODUCT IMAGE */}
              <div className="slider-image-area">

                <img
                  key={`${currentProduct.id}-${slide}`}
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="slider-product-image"
                />

                <div className="sale-badge">
                  <small>SALE</small>
                  <strong>70%</strong>
                  <span>OFF</span>
                </div>

              </div>

              {/* ARROWS */}
              <button
                className="slider-arrow left"
                onClick={previousSlide}
                aria-label="Previous"
              >
                <ChevronLeft size={25} />
              </button>

              <button
                className="slider-arrow right"
                onClick={nextSlide}
                aria-label="Next"
              >
                <ChevronRight size={25} />
              </button>

              {/* DOTS */}
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
                    aria-label={category.name}
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

        {/* FLASH DEALS */}
        <section className="flash-deals">

          <div className="flash-heading">

            <div className="limited">
              🔥 LIMITED TIME
            </div>

            <h2>Flash Deals</h2>

            <p>
              Grab today&apos;s hottest deals before they&apos;re gone.
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
              <small>Safe & secure checkout</small>
            </div>

          </div>

          <a className="view-deals">
            View All Deals →
          </a>

        </section>

        {/* PRODUCTS */}
        <section className="products-section">

          <div className="section-heading">

            <div>
              <div className="trending">
                <Tag size={15} />
                TRENDING NOW
              </div>

              <h2>Popular Products</h2>

              <p>
                Popular picks our customers are loving right now.
              </p>
            </div>

            <strong>
              {filteredProducts.length} products
            </strong>

          </div>

          <div className="products-grid">

            {filteredProducts.map((product) => (

              <article
                className="product-card"
                key={product.id}
              >

                <div className="product-image-wrapper">

                  <span className="product-badge">
                    {product.badge}
                  </span>

                  <button className="heart-button">
                    <Heart size={17} />
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </div>

                <div className="product-content">

                  <div className="product-category">
                    {product.category}
                  </div>

                  <h3>{product.name}</h3>

                  <div className="product-rating">
                    <Star
                      size={14}
                      fill="currentColor"
                    />
                    <b>{product.rating}</b>
                    <span>({product.reviews})</span>
                  </div>

                  <div className="product-price">
                    {product.price}
                  </div>

                  <div className="shipping">
                    FREE SHIPPING
                  </div>

                  {/* AMAZON ORDER BUTTON */}
                  <a
                    href={product.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
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

            ))}

          </div>

        </section>

        {/* TRUST BAR */}
        <section className="trust-bar">

          <div>
            <ShieldCheck />
            <div>
              <strong>Secure Shopping</strong>
              <small>Your information is protected</small>
            </div>
          </div>

          <div>
            <Truck />
            <div>
              <strong>Fast Delivery</strong>
              <small>Reliable shipping options</small>
            </div>
          </div>

          <div>
            <Tag />
            <div>
              <strong>Great Prices</strong>
              <small>Deals you&apos;ll love</small>
            </div>
          </div>

          <div>
            <Headphones />
            <div>
              <strong>Customer Support</strong>
              <small>We&apos;re here when you need us</small>
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
            <span>Returns & Refunds</span>
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
            <span>Terms & Conditions</span>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 ZishiBuys. All rights reserved.
        </div>

      </footer>

      {/* MOBILE NAV */}
      <div className="mobile-bottom-nav">

        <div className="active">
          <Grid3X3 size={19} />
          <span>Home</span>
        </div>

        <div>
          <Menu size={19} />
          <span>Categories</span>
        </div>

        <div>
          <Heart size={19} />
          <span>Wishlist</span>
        </div>

        <div>
          <ShoppingCart size={19} />
          <span>Cart</span>
        </div>

        <div>
          <User size={19} />
          <span>Account</span>
        </div>

      </div>

    </main>
  );
}
