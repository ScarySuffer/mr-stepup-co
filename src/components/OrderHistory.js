import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./OrderHistory.css";

export default function OrderHistory() {
  const { currentUser, loading: authLoading } = useAuth();
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists() && docSnap.data().pastOrders) {
            setPastOrders(docSnap.data().pastOrders);
          }
        } catch (err) { console.error("Error fetching past orders:", err); }
      }
      setLoading(false);
    };
    if (!authLoading) loadOrders();
  }, [currentUser, authLoading]);

  if (loading || authLoading) return <p>Loading your past orders...</p>;

  return (
    <section className="order-history-section">
      <h2>Your Order History</h2>
      {pastOrders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="start-shopping-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {[...pastOrders].reverse().map((order, idx) => {
            const total = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
            return (
              <div key={idx} className="order-card">
                <div className="order-header">
                  <h3>Order ID: #{order.id?.substring(order.id.lastIndexOf("-")+1).toUpperCase()}</h3>
                  <p>Date: {order.date || "N/A"}</p>
                  <p>Total: R{total.toFixed(2)}</p>
                </div>

                {order.customerInfo && (
                  <div className="customer-info">
                    <h4>Customer Details:</h4>
                    <p><strong>Name:</strong> {order.customerInfo.name}</p>
                    <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                    {order.customerInfo.email && <p><strong>Email:</strong> {order.customerInfo.email}</p>}
                    <p><strong>Address:</strong> {order.customerInfo.address}, {order.customerInfo.city}, {order.customerInfo.province}, {order.customerInfo.zip || "N/A"}</p>
                    {order.customerInfo.notes && <p><strong>Notes:</strong> {order.customerInfo.notes}</p>}
                  </div>
                )}

                {order.items && (
                  <div className="order-items">
                    <h4>Items Ordered:</h4>
                    {order.items.map((item, i) => (
                      <div key={i} className="order-item-detail">
                        <img src={item.image} alt={item.name} className="order-item-image" />
                        <div className="item-text">
                          <p><strong>{item.name}</strong> (Size: {item.selectedSize})</p>
                          <p>Qty: {item.quantity} | R{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
