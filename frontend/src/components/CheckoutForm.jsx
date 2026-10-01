import { useState } from "react";
import "./CheckoutForm.css";

function CheckoutForm({ cart, cartTotal, onSuccess, onCancel }) {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const placeOrder = async (e) => {
    e.preventDefault();

    setLoading(true);
    const token = localStorage.getItem("token");

    const orderData = {
      customerName,
      email,
      products: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: cartTotal,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order failed");
      }

      alert("Order placed successfully!");
      console.log("Created Order:", data.order);

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="checkout-container">
    <div className="checkout-header">
      <h2>Checkout</h2>
      <p>Enter your details to place your order.</p>
    </div>

    <form className="checkout-form" onSubmit={placeOrder}>
      <div>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="checkout-total">
        <span>Total Amount</span>
        <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
      </div>

      <div className="checkout-actions">
        <button
          type="button"
          className="cancel-order-btn"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="place-order-btn"
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </form>
  </div>
);
}

export default CheckoutForm;