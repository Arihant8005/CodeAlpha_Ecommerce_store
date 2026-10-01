import { useEffect, useState } from "react";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/orders",
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Order status updated!");
        fetchOrders();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
  <main className="admin-orders-page">
    <div className="admin-orders-header">
      <h1>Admin Orders</h1>
      <p>Manage customer orders and update their delivery status.</p>
    </div>

    {orders.length === 0 ? (
      <div className="admin-empty">
        <h2>No orders found</h2>
        <p>Orders placed by customers will appear here.</p>
      </div>
    ) : (
      <div className="admin-orders-list">
        {orders.map((order) => (
          <div className="admin-order-card" key={order._id}>
            <div className="admin-order-top">
              <div>
                <h3 className="admin-order-id">
                  Order #{order._id.slice(-6)}
                </h3>

                <p className="admin-order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="admin-customer">
              <p>
                <strong>Customer:</strong>{" "}
                {order.userId?.name || order.customerName}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {order.userId?.email || order.email}
              </p>
            </div>

            <div className="admin-order-total">
              Total: ₹{order.totalAmount.toLocaleString("en-IN")}
            </div>

            <div className="admin-status-section">
              <label>Status:</label>

              <select
                className="admin-status-select"
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    )}
  </main>
);
}

export default AdminOrders;