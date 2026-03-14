import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AssignLookModal from "../components/AssignLookModal";
import Loader from "../components/Loader";
import { 
  getOrderSummary, 
  clearOrderSummary,
  setSelectedProductForLook,
  clearSelectedProductForLook 
} from "../Redux/Reducers/productSlice";

const MyOrdersTab = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { orderSummary, orderSummaryLoading, error } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    dispatch(getOrderSummary());

    return () => {
      dispatch(clearOrderSummary());
      dispatch(clearSelectedProductForLook()); // Cleanup on unmount
    };
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProductImage = (item) => {
    if (item.image) {
      return item.image;
    }
    
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      const featuredImage = item.images.find(img => img.is_featured === true);
      if (featuredImage?.image_url) {
        return featuredImage.image_url;
      }
      return item.images[0].image_url;
    }
    
    if (item.product?.images && Array.isArray(item.product.images)) {
      const featuredImage = item.product.images.find(img => img.is_featured === true);
      if (featuredImage?.image_url) {
        return featuredImage.image_url;
      }
      return item.product.images[0]?.image_url;
    }
    
    return "/Images/suit1.png";
  };

  const getBuyType = (item) => {
    return item.buy_type || (item.type === 'rent' ? 'rent' : 'buy') || 'rent';
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Flatten all items from all orders
  const getAllItems = () => {
    if (!orderSummary) return [];

    const data = orderSummary.data || orderSummary;
    
    if (data.orders && Array.isArray(data.orders)) {
      const allItems = data.orders.flatMap(order => 
        (order.items || []).map(item => ({
          ...item,
          order_number: order.order_number,
          order_date: order.created_at,
          order_id: order.order_id,
          product_id: item.product_id || "null",
        }))
      );
      return allItems;
    }

    return [];
  };

  const items = getAllItems();

  const openModal = (item) => {
    setSelectedOrder(item);
    
    const productData = {
      product_id: item.product_id,
      product_name: item.product_name,
      image: getProductImage(item),
      unit_price: item.unit_price,
      quantity: item.quantity,
      order_number: item.order_number,
      size: item.size,
      buy_type: getBuyType(item)
    };
    
    dispatch(setSelectedProductForLook(productData));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (orderSummaryLoading) {
    return (
      <div className="col-md-9 right-column my-orders">
        <div className="right-column-content">
          <h2>My Orders</h2>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px' 
          }}>
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-md-9 right-column my-orders">
        <div className="right-column-content">
          <h2>My Orders</h2>
          <div className="empty-orders error-state">
            <div className="empty-icon">
              <i className="fa-solid fa-exclamation-triangle"></i>
            </div>
            <h3>Something Went Wrong</h3>
            <p>{typeof error === 'string' ? error : "Failed to load your orders."}</p>
            <button 
              className="designBtn2 shop-now-btn" 
              onClick={() => {
                dispatch(clearOrderSummary());
                dispatch(getOrderSummary());
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-9 right-column my-orders">
      <div className="right-column-content">
        <h2>My Orders</h2>

        {items.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">
              <i className="fa-solid fa-box-open"></i>
            </div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <button 
              className="designBtn2 shop-now-btn" 
              onClick={() => navigate("/shop")}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {items.map((item) => (
                <div className="order-card" key={item.id}>
                  
                  <div className="order-image">
                    <img 
                      src={getProductImage(item)} 
                      alt={item.product_name} 
                      className="order-img"
                      onError={(e) => {
                        e.target.src = "/Images/suit1.png";
                      }}
                    />
                  </div>

                  <div className="order-info">
                    <h4 className="product-title-ellipsis" title={item.product_name}>
                      {item.product_name}
                    </h4>
                    <p>{formatDate(item.order_date)}</p>
                  </div>

                  <div className="order-status">
                    <p className="status paid">Paid</p>
                    <span>Payment Status</span>
                  </div>

                  <div className="order-price">
                    <p>{formatPrice(item.unit_price)}</p>
                    <span>Unit Price</span>
                  </div>

                  <div className="order-button">
                    <button className="designBtn2" onClick={() => openModal(item)}>
                      Assign Look
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="designBtn2 back-btn" onClick={() => navigate(-1)}>
              Back
            </button>
          </>
        )}
      </div>

      <AssignLookModal
        isOpen={modalOpen}
        onClose={closeModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default MyOrdersTab;