import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, setCurrentPage } from "../Redux/Reducers/productSlice";
import Pagination from "../components/Pagination";
import Loader from "./Loader";

const ShopProducts = ({ selectedFilters }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [isFilterChanging, setIsFilterChanging] = useState(false);

  const { products, pagination, loading, filters } = useSelector(
    (state) => state.products,
  );

  const buildApiParams = () => {
    const params = {};

    if (selectedFilters.category && selectedFilters.category.length > 0) {
      const categoryId = selectedFilters.category[0];
      if (/^\d+$/.test(String(categoryId))) {
        params.category = [String(categoryId)];
      } else {
        const matched = filters?.categories?.find(
          (cat) =>
            (cat.name || "").toLowerCase() === String(categoryId).toLowerCase(),
        );
        if (matched) {
          params.category = [String(matched.id)];
        }
      }
    }

    const rentBuySelection = selectedFilters["rent-buy"] || selectedFilters.buy_type;
    if (Array.isArray(rentBuySelection) && rentBuySelection.length > 0) {
      params.buy_type = rentBuySelection.map((type) => String(type).toLowerCase());
    }

    return params;
  };

  useEffect(() => {
    if (!loading && products.length > 0) {
      setIsFilterChanging(true);
    }
  }, [selectedFilters]);

  useEffect(() => {
    if (!loading) {
      setIsFilterChanging(false);
    }
  }, [loading]);

  useEffect(() => {
    dispatch(setCurrentPage(1));

    const normalizedFilters = { ...selectedFilters };
    if (
      Array.isArray(normalizedFilters.category) &&
      normalizedFilters.category.length > 0
    ) {
      normalizedFilters.category = normalizedFilters.category.map((c) => {
        if (/^\d+$/.test(String(c))) return String(c);
        const matched = filters?.categories?.find(
          (cat) =>
            String(cat.id) === String(c) ||
            (cat.name || "").toLowerCase() === String(c).toLowerCase(),
        );
        return matched ? String(matched.id) : String(c);
      });
    }
    if (
      Array.isArray(normalizedFilters["rent-buy"]) &&
      normalizedFilters["rent-buy"].length > 0
    ) {
      normalizedFilters.buy_type = normalizedFilters["rent-buy"].map((type) =>
        type.toLowerCase(),
      );
    }

    dispatch(
      getProducts({
        page: 1,
        perPage: pagination.per_page,
        filters: normalizedFilters,
      }),
    );
  }, [dispatch, selectedFilters]);

  useEffect(() => {
    if (isPageChanging) {
      const apiParams = buildApiParams();

      dispatch(
        getProducts({
          page: pagination.current_page,
          perPage: pagination.per_page,
          filters: apiParams,
        }),
      ).finally(() => {
        setIsPageChanging(false);
      });
    }
  }, [dispatch, pagination.current_page, selectedFilters, isPageChanging]);

  const formatPrice = (price) => {
    return `$${price}`;
  };

  const formatRentPrice = (price) => {
    if (!price || price === 0) {
      return "N/A";
    }
    return formatPrice(price);
  };

  const getPrimaryImageUrl = (product) => {
    if (!product.images || product.images.length === 0) {
      return "/Images/suit1.png";
    }
    const primaryImage = product.images.find((img) => img.is_primary === true);
    if (primaryImage) {
      return primaryImage.image_url;
    } else {
      return product.images[0].image_url;
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  const handlePageChange = (newPage) => {
    setIsPageChanging(true);
    dispatch(setCurrentPage(newPage));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isPageChanging || isFilterChanging) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          width: "100%",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="products-grid">
        {products.length === 0 && !loading ? (
          <p className="no-products">No products found.</p>
        ) : (
          products.map((product) => (
            <div
              className="product-card"
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: "pointer" }}
            >
              <img src={getPrimaryImageUrl(product)} alt={product.name} />
              <div className="product-content">
                <h5>{product.name}</h5>
                <div className="product-price">
                  <p className="text">Starting At</p>
                  <div className="price">
                    <span>Buy: {formatRentPrice(product.buy_price)}</span>{" "}
                    <span>Rent: {formatRentPrice(product.rent_price)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && pagination.total_pages > 1 && (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default ShopProducts;
