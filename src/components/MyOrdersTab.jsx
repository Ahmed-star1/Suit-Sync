import React, { useState } from "react";
import AssignLookModal from "../components/AssignLookModal";

const MyOrdersTab = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: 1,
      title: "Black Suit",
      date: "03 December, 2025 — 10:00 PM",
      status: "Paid",
      price: "$500.00",
      image: "/Images/suit1.png",
    },
    {
      id: 2,
      title: "Blue Suit",
      date: "03 December, 2025 — 10:00 PM",
      status: "Paid",
      price: "$900.00",
      image: "/Images/suit2.png",
    },
  ];

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  return (
    <div className="col-md-9 right-column my-orders">
      <div className="right-column-content">
        <h2>My Orders</h2>

        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              
              <div className="order-image">
                <img src={order.image} alt={order.title} className="order-img" />
              </div>

              <div className="order-info">
                <h4>{order.title}</h4>
                <p>{order.date}</p>
              </div>

              <div className="order-status">
                <p className="status paid">{order.status}</p>
                <span>Payment Status</span>
              </div>

              <div className="order-price">
                <p>{order.price}</p>
                <span>Paypal</span>
              </div>

              <div className="order-button">
                <button className="designBtn2" onClick={() => openModal(order)}>
                  Assign Look
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="designBtn2">Back</button>
      </div>

      <AssignLookModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default MyOrdersTab;