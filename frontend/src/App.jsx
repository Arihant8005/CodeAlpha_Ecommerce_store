import { useEffect, useState } from "react";
import "./App.css";

import CheckoutForm from "./components/CheckoutForm";
import Auth from "./components/Auth";
import MyOrders from "./components/MyOrders";
import AdminOrders from "./components/AdminOrders";
import AdminProducts from "./components/AdminProducts";

const API_URL = "http://localhost:5000/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
  });
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setLoggedInUser(null);
  };

  // Fetch products from backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load products.");
        setLoading(false);
      });
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove product
  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== id)
    );
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="app">

      {/* ================= HEADER ================= */}
      <header className="navbar">
        <div
          className="logo"
          onClick={() => setPage("home")}
        >
          Shop<span>Easy</span>
        </div>

        <nav className="nav-links">
          <button
            className={page === "home" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("home")}
          >
            Home
          </button>

          <button
            className={page === "cart" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("cart")}
          >
            Cart
          </button>
          <button
            className={page === "orders" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("orders")}
          >
            My Orders
          </button>
          {loggedInUser?.role === "admin" && (
            <>
              <button
                className={page === "admin-orders" ? "nav-link active" : "nav-link"}
                onClick={() => setPage("admin-orders")}
              >
                Admin Orders
              </button>
              <button
                className={page === "admin-products" ? "nav-link active" : "nav-link"}
                onClick={() => setPage("admin-products")}
              >
                Admin Products
              </button>
            </>
          )}
        </nav>
        {loggedInUser ? (
  <button
    className="cart-button"
    onClick={handleLogout}
  >
    Logout
  </button>
) : (
  <button
    className="cart-button"
    onClick={() => setShowAuth(true)}
  >
    Login
  </button>
)}


        <button
          className="cart-button"
          onClick={() => setPage("cart")}
        >
          🛒
          <span>Cart</span>
          <b>{cartCount}</b>
        </button>
      </header>

      {/* ================= HOME ================= */}
      {page === "home" && (
        <main>

          {/* HERO */}
          <section className="hero">
            <div className="hero-content">
              <p className="hero-label">✦ NEW COLLECTION</p>

              <h1>
                Shop smarter.
                <br />
                <span>Live better.</span>
              </h1>

              <p className="hero-description">
                Discover quality products at prices you'll love.
                Simple shopping, fast delivery.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Shop Now →
              </button>
            </div>

            <div className="hero-visual">
              <div className="floating-card card-one">
                🎧
              </div>

              <div className="floating-card card-two">
                📦
              </div>

              <div className="hero-circle"></div>
            </div>
          </section>

          {/* PRODUCTS SECTION */}
          <section className="products-section" id="products">

            <div className="section-heading">
              <div>
                <p className="section-label">OUR COLLECTION</p>

                <h2>Featured Products</h2>
              </div>

              <p className="section-description">
                Carefully selected products
                <br />
                for your everyday needs.
              </p>
            </div>

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            )}

            {error && (
              <div className="error-box">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="product-grid">

                {products.map((product) => (
                  <article
                    className="product-card"
                    key={product._id}
                  >

                    <div
                      className="product-image"
                      onClick={() =>
                        setSelectedProduct(product)
                      }
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">
                          🛍️
                        </div>
                      )}

                      <span className="product-badge">
                        NEW
                      </span>
                    </div>

                    <div className="product-info">

                      <p className="product-category">
                        {product.category || "GENERAL"}
                      </p>

                      <h3>{product.name}</h3>

                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-bottom">

                        <strong>
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </strong>

                        <button
                          className="add-button"
                          onClick={() => addToCart(product)}
                        >
                          + Add
                        </button>

                      </div>

                    </div>
                  </article>
                ))}

              </div>
            )}

          </section>

        </main>
      )}

      {/* ================= CART ================= */}
      {page === "cart" && (
        <main className="cart-page">

          <div className="cart-header">
            <div>
              <p className="section-label">YOUR BAG</p>
              <h1>Shopping Cart</h1>
            </div>

            <button
              className="continue-button"
              onClick={() => setPage("home")}
            >
              ← Continue Shopping
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                🛒
              </div>

              <h2>Your cart is empty</h2>

              <p>
                Looks like you haven't added anything yet.
              </p>

              <button
                className="primary-button"
                onClick={() => setPage("home")}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-layout">

              <div className="cart-items">

                {cart.map((item) => (
                  <div
                    className="cart-item"
                    key={item._id}
                  >

                    <div className="cart-item-image">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>

                    <div className="cart-item-info">
                      <p>{item.category || "GENERAL"}</p>
                      <h3>{item.name}</h3>

                      <strong>
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div className="quantity-control">

                      <button
                        onClick={() =>
                          decreaseQuantity(item._id)
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          increaseQuantity(item._id)
                        }
                      >
                        +
                      </button>

                    </div>

                    <div className="item-total">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </div>

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(item._id)
                      }
                    >
                      ×
                    </button>

                  </div>
                ))}

              </div>

              {/* SUMMARY */}
              <aside className="cart-summary">

                <h2>Order Summary</h2>

                <div className="summary-row">
                  <span>Items</span>
                  <span>{cartCount}</span>
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="free">
                    FREE
                  </span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>Total</span>
                  <strong>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <button
                  className="checkout-button"
                  onClick={() => setShowCheckout(true)
                }
                >
                  Proceed to Checkout →
                </button>

                <p className="secure-text">
                  🔒 Secure checkout
                </p>

              </aside>

            </div>
          )}

        </main>
      )}
      {/* ================= MY ORDERS ================= */}
      {page === "orders" && (
       <main>
         <MyOrders />
       </main>
     )}
     {/* ================= ADMIN ORDERS ================= */}
      {page === "admin-orders" && (
        <AdminOrders />
    )}
      {page === "admin-products" && (
        <AdminProducts />
    )}

      {showCheckout && (
  <div className="modal-overlay">
    <div className="product-modal">
      <CheckoutForm
        cart={cart}
        cartTotal={cartTotal}
        onSuccess={() => {
          setCart([]);
          setShowCheckout(false);
          setPage("home");
        }}
        onCancel={() => setShowCheckout(false)}
      />
    </div>
  </div>
)}

{showAuth && (
  <div
    className="modal-overlay"
    onClick={() => setShowAuth(false)}
  >
    <div
      className="product-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={() => setShowAuth(false)}
      >
        ×
      </button>

      <Auth
        onLogin={(user) => {
          setLoggedInUser(user);
          setShowAuth(false);
        }}
        onClose={() => setShowAuth(false)}
      />
    </div>
  </div>
)}
      {/* ================= PRODUCT MODAL ================= */}
      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            <div className="modal-image">
              {selectedProduct.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                />
              ) : (
                <span>🛍️</span>
              )}
            </div>

            <div className="modal-info">

              <p className="product-category">
                {selectedProduct.category || "GENERAL"}
              </p>

              <h2>{selectedProduct.name}</h2>

              <p className="modal-description">
                {selectedProduct.description}
              </p>

              <h3>
                ₹
                {Number(
                  selectedProduct.price
                ).toLocaleString("en-IN")}
              </h3>

              <button
                className="primary-button full-width"
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                Add to Cart
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div>
          <div className="footer-logo">
            Shop<span>Easy</span>
          </div>

          <p>
            Simple shopping. Better experience.
          </p>
        </div>

        <p>
          © 2026 ShopEasy. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;