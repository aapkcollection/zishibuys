"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  ChevronDown,
  ChevronRight,
  Menu,
  Truck,
  ShieldCheck,
  Headphones,
  Flame,
  Tag,
  Star,
  Grid3X3,
  X,
} from "lucide-react";

import { categories, products } from "@/data/products";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [cart, setCart] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = search.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(text) ||
        product.category.toLowerCase().includes(text);

      const matchesCategory =
        selectedCategory === "All Products" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <main className="site">

      {/* TOP BAR */}
      <div className="topbar">
        <div>Welcome to ZishiBuys</div>

        <div className="top-links">
          <span>📱 Download App</span>
          <span>🏪 Sell on ZishiBuys</span>
          <span>❓ Help Center</span>
        </div>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="logo">
            <div className="logo-box">Z</div>
            <div>
              <div className="logo-text">
                Zishi<span>Buys</span>
              </div>
              <small>Better products. Better prices.</small>
            </div>
          </div>

          {/* SEARCH */}
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

            <button className="search-btn">
              <Search size={19} />
              <span>Search</span>
            </button>
          </div>

          <div className="header-actions">
            <div className="account">
              <User size={22} />
              <div>
                <small>Hello,</small>
                <b>Account</b>
              </div>
            </div>

            <div className="icon-action">
              <Heart size={22} />
              <small>Wishlist</small>
            </div>

            <button className="cart-btn">
              <ShoppingCart size={23} />
              {cart > 0 && <span className="cart-count">{cart}</span>}
              <small>Cart</small>
            </button>
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <button
            className="all-categories"
            onClick={() => setSelectedCategory("All Products")}
          >
            <Grid3X3 size={18} />
            All Categories
          </button>

          <button>Electronics</button>
          <button>Fashion</button>
          <button>Home & Living</button>
          <button>Beauty & Health</button>
          <button>Sports</button>
          <button>Toys</button>
          <button>Automotive</button>

          <button className="flash-nav">
            <Flame size={17} />
            Flash Deals
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="mobile-menu">
          <h3>Categories</h3>

          <button
            onClick={() => {
              setSelectedCategory("All Products");
              setMobileMenu(false);
            }}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setSelectedCategory(category.name);
                setMobileMenu(false);
              }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      )}

      {/* MAIN */}
      <div className="container">

        {/* HERO AREA */}
        <section className="hero-area">

          {/* SIDEBAR */}
          <aside className="category-sidebar">
            <div className="sidebar-title">
              SHOP CATEGORIES
            </div>

            <button
              className="category-item active"
              onClick={() => setSelectedCategory("All Products")}
            >
              <span>▦</span>
              All Products
              <ChevronRight size={15} />
            </button>

            {categories.map((category) => (
              <button
                key={category.name}
                className={`category-item ${
                  selectedCategory === category.name ? "selected" : ""
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span>{category.icon}</span>
                {category.name}
                <ChevronRight size={15} />
              </button>
            ))}

            <button
              className="view-all"
              onClick={() => setSelectedCategory("All Products")}
            >
              View all products →
            </button>
          </aside>

          {/* HERO */}
          <div className="hero">

            <div className="hero-content">
              <div className="saving-badge">
                ⚡ BIG SAVINGS EVERY DAY
              </div>

              <h1>
                Shop smarter.
                <br />
                <span>Save bigger.</span>
              </h1>

              <p>
                Discover thousands of useful products, trending gadgets
                and everyday essentials at amazing prices.
              </p>

              <div className="hero-buttons">
                <button
                  className="yellow-btn"
                  onClick={() => setSelectedCategory("All Products")}
                >
                  Shop Now
                </button>

                <button
                  className="outline-btn"
                  onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}
                >
                  Explore Deals
                </button>
              </div>
            </div>

            <div className="hero-products">
              <div className="hero-circle">
                SALE
                <strong>70%</strong>
                OFF
              </div>

              <div className="hero-items">
                <span>🎧</span>
                <span>⌚</span>
                <span>📱</span>
              </div>
            </div>

            <div className="slider-dots">
              <i className="active" />
              <i />
              <i />
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="benefits">
          <div>
            <Truck />
            <div>
              <b>Free Shipping</b>
              <small>Selected products</small>
            </div>
          </div>

          <div>
            <ShieldCheck />
            <div>
              <b>Buyer Protection</b>
              <small>Shop with confidence</small>
            </div>
          </div>

          <div>
            <Headphones />
            <div>
              <b>24/7 Support</b>
              <small>We're here to help</small>
            </div>
          </div>
        </section>

        {/* FLASH DEALS */}
        <section className="flash-section">
          <div className="section-label">
            <Flame size={18} />
            LIMITED TIME
          </div>

          <div className="section-heading-row">
            <div>
              <h2>Flash Deals</h2>
              <p>Grab today's hottest deals before they're gone.</p>
            </div>

            <button>View All Deals →</button>
          </div>

          <div className="deal-features">
            <div>
              🔥
              <b>HOT DEALS</b>
              <small>Up to 70% OFF</small>
            </div>

            <div>
              🚚
              <b>FAST SHIPPING</b>
              <small>On selected items</small>
            </div>

            <div>
              💳
              <b>EASY PAYMENT</b>
              <small>Safe & secure checkout</small>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="products-section">

          <div className="section-label">
            <Tag size={18} />
            TRENDING NOW
          </div>

          <div className="section-heading-row">
            <div>
              <h2>Popular Products</h2>
              <p>
                Popular picks our customers are loving right now.
              </p>
            </div>

            <span>{filteredProducts.length} products</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <Search size={40} />
              <h3>No products found</h3>
              <p>Try another search or category.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>

                  <div className="product-image">
                    <img src={product.image} alt={product.name} />

                    <span className="product-badge">
                      {product.badge}
                    </span>

                    <button className="heart">
                      <Heart size={18} />
                    </button>
                  </div>

                  <div className="product-info">

                    <small className="product-category">
                      {product.category}
                    </small>

                    <h3>{product.name}</h3>

                    <div className="rating">
                      <Star size={14} fill="currentColor" />
                      <b>{product.rating}</b>
                      <span>({product.reviews})</span>
                    </div>

                    <div className="price-row">
                      <strong>{product.price}</strong>
                    </div>

                    <div className="shipping">
                      FREE SHIPPING
                    </div>

                    <button
                      className="add-cart"
                      onClick={() => setCart((value) => value + 1)}
                    >
                      <ShoppingCart size={17} />
                      Add to Cart
                    </button>

                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div>
          <ShieldCheck />
          <b>Secure Shopping</b>
          <small>Your information is protected</small>
        </div>

        <div>
          <Truck />
          <b>Fast Delivery</b>
          <small>Reliable shipping options</small>
        </div>

        <div>
          <Tag />
          <b>Great Prices</b>
          <small>Deals you'll love</small>
        </div>

        <div>
          <Headphones />
          <b>Customer Support</b>
          <small>We're here when you need us</small>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">

          <div className="footer-brand">
            <div className="logo">
              <div className="logo-box">Z</div>
              <div>
                <div className="logo-text">
                  Zishi<span>Buys</span>
                </div>
                <small>Better products. Better prices.</small>
              </div>
            </div>

            <p>
              Discover useful products, trending gadgets and
              everyday essentials at great prices.
            </p>
          </div>

          <div>
            <h4>Customer Service</h4>
            <a>Help Center</a>
            <a>Shipping Information</a>
            <a>Returns & Refunds</a>
            <a>Contact Us</a>
          </div>

          <div>
            <h4>Shop</h4>
            <a>All Products</a>
            <a>Flash Deals</a>
            <a>New Arrivals</a>
            <a>Best Sellers</a>
          </div>

          <div>
            <h4>About ZishiBuys</h4>
            <a>About Us</a>
            <a>Privacy Policy</a>
            <a>Terms & Conditions</a>
          </div>

        </div>

        <div className="copyright">
          © 2026 ZishiBuys. All rights reserved.
        </div>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-bottom-nav">
        <button>
          🏠
          <span>Home</span>
        </button>

        <button>
          ▦
          <span>Categories</span>
        </button>

        <button>
          ♡
          <span>Wishlist</span>
        </button>

        <button>
          🛒
          <span>Cart</span>
        </button>

        <button>
          👤
          <span>Account</span>
        </button>
      </div>

    </main>
  );
}
