import { useEffect, useState } from "react";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return <p>You have not placed any orders yet.</p>;
  }

  return (
  <main className="my-orders-page">
    <div className="my-orders-header">
      <h1>My Orders</h1>
      <p>View your recent orders and their details.</p>
    </div>

    {orders.length === 0 ? (
      <div className="empty-orders">
        <h2>No orders yet</h2>
        <p>Once you place an order, it will appear here.</p>
      </div>
    ) : (
      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-top">
              <div>
                <h3>Order #{order._id.slice(-6)}</h3>
                <p>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span className="order-status">
                {order.status}
              </span>
            </div>

            <div className="order-products">
              {order.products.map((product) => (
                <div className="order-product" key={product.productId}>
                  <span>
                    {product.name} × {product.quantity}
                  </span>

                  <strong>
                    ₹{(product.price * product.quantity).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="order-total">
              Total: ₹{order.totalAmount.toLocaleString("en-IN")}
            </div>
          </div>
        ))}
      </div>
    )}
  </main>
);
}

export default MyOrders;