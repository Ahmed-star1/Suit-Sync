import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const data = [
        {
          id: 1,
          name: "Surfboards",
          price: 875,
          quantity: 1,
          image: "/Images/suit1.png",
          details: ["This is dummy ....."],
        },
      ];

      setCartItems(data);
    };

    fetchCart();
  }, []);

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <Header />

      <div className="container">
        <div className="cart-row row">
          <div className="cart-left col-md-8">
            <div className="cart-header">
              <h4>PRODUCT</h4>
              <h4>TOTAL</h4>
            </div>

            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-left">
                  <img src={item.image} alt="Product" className="item-img" />

                  <div className="item-info">
                    <h3 className="item-title">{item.name}</h3>

                    <p className="item-price">${item.price.toFixed(2)}</p>

                    {item.details.map((d, i) => (
                      <p key={i} className="item-desc">
                        {d}
                      </p>
                    ))}

                    <div className="qty-box">
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>

                    <button
                      className="remove-item"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove item
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-right col-md-4">
            <h4 className="cart-total-title">CART TOTALS</h4>

            <div className="cart-total-row">
              <span>Estimated total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="designBtn2">Proceed to Checkout</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;