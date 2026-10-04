import {
  Search,
  ShoppingBag,
  UserRound,
  ChevronRight,
  Star,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { categories, products } from "../data/products";

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <span className="brandMark">Z</span>
          <span>
            Zishi<span>Buys</span>
          </span>
        </div>

        <div className="search">
          <Search size={19} />
          <input placeholder="Search thousands of home & household products..." />
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

      <section className="heroWrap">
        <aside className="categoryPanel">
          <div className="panelTitle">SHOP CATEGORIES</div>

          {categories.map((category) => (
            <div className="categoryRow" key={category.name}>
              <span>
                {category.icon} {category.name}
              </span>
              <ChevronRight size={16} />
            </div>
          ))}

          <a className="allCats" href="#products">
            View all categories →
          </a>
        </aside>

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
              Discover useful household essentials, clever gadgets and
              products worth knowing about.
            </p>

            <div className="heroButtons">
              <a href="#products" className="primaryBtn">
                Explore Products
              </a>

              <a href="#special" className="ghostBtn">
                Custom Order
              </a>
            </div>
          </div>

          <div className="heroOrb">ZB</div>
        </div>
      </section>

      <section className="section" id="products">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">POPULAR RIGHT NOW</div>
            <h2>Trending Home Products</h2>
          </div>

          <button className="sortBtn">Sort: Popular ▾</button>
        </div>

        <div className="productGrid">
          {products.map((product) => (
            <article className="productCard" key={product.id}>
              <div className="productImageWrap">
                <img src={product.image} alt={product.name} />

                {product.badge && (
                  <span className="badge">{product.badge}</span>
                )}
              </div>

              <div className="productBody">
                <div className="miniCat">{product.category}</div>

                <h3>{product.name}</h3>

                <div className="rating">
                  <Star size={14} fill="currentColor" />
                  {product.rating}
                  <span>({product.reviews})</span>
                </div>

                <div className="price">{product.price}</div>

                <div className="orderLabel">Order Now</div>

                <a
                  className="amazonBtn"
                  href={product.amazonUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                >
                  🛒 Amazon
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="special" id="special">
        <div>
          <div className="eyebrow">SPECIAL / CUSTOM PRODUCTS</div>

          <h2>Looking for something specific?</h2>

          <p>
            Tell ZishiBuys what you need and contact us directly on WhatsApp.
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

      <footer>
        <div className="brand footerBrand">
          <span className="brandMark">Z</span>

          <span>
            Zishi<span>Buys</span>
          </span>
        </div>

        <p>Smart finds for modern homes.</p>
      </footer>
    </main>
  );
}
