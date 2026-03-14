import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, clearSelectedProduct } from "../Redux/Reducers/productSlice";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductDetail from "../components/ProductDetail";
import ProductsCarousel from "../components/ProductsCarousel";
import Loader from "../components/Loader";

const ShopDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { selectedProduct: product, loading} = useSelector((state) => state.products);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
    
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}>
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Header />
      {product ? (
      <ProductDetail product={product} />
      ) : (
        <div style={{ minHeight: "60vh" }} />
      )}
      <ProductsCarousel type="related" productId={product?.id} />
      <Footer />
    </div>
  );
};

export default ShopDetailPage;