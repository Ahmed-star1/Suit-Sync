import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, setCurrentPage } from "../Redux/Reducers/productSlice";
import Pagination from "../components/Pagination";
import Loader from "./Loader";

const SHOP_STATE_KEY = "shop_navigation_state";

const ShopProducts = ({
  selectedFilters,
  initialPage = 1,
  isRestoringShopState = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialLoading, setIsInitialLoading] = useState(
    !isRestoringShopState,
  );
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const lastRequestRef = useRef("");
  const isInitialRequestRef = useRef(true);
  const initialPageRef = useRef(initialPage);

  const { products, pagination, loading, filters } = useSelector(
    (state) => state.products,
  );

  const apiFilters = useMemo(() => {
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
  }, [selectedFilters, filters?.categories]);

  const apiFiltersKey = JSON.stringify(apiFilters);

  const selectedCategoryClass = useMemo(() => {
    const selectedCategory = selectedFilters.category?.[0];
    if (!selectedCategory) return "";

    const matchedCategory = filters?.categories?.find(
      (category) =>
        String(category.id) === String(selectedCategory) ||
        (category.name || "").toLowerCase() ===
          String(selectedCategory).toLowerCase(),
    );

    const categoryName = matchedCategory?.name || selectedCategory;
    return categoryName
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [selectedFilters.category, filters?.categories]);

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
    const page = isInitialRequestRef.current ? initialPageRef.current : 1;
    const requestFilters = JSON.parse(apiFiltersKey);
    isInitialRequestRef.current = false;

    const requestKey = JSON.stringify({
      page,
      perPage: pagination.per_page,
      filters: requestFilters,
    });

    if (lastRequestRef.current === requestKey) return;
    lastRequestRef.current = requestKey;
    dispatch(setCurrentPage(page));

    dispatch(
      getProducts({
        page,
        perPage: pagination.per_page,
        filters: requestFilters,
      }),
    ).finally(() => {
      setIsInitialLoading(false);
    });
  }, [dispatch, apiFiltersKey, pagination.per_page]);

  useEffect(() => {
    if (isPageChanging) {
      const requestKey = JSON.stringify({
        page: pagination.current_page,
        perPage: pagination.per_page,
        filters: apiFilters,
      });

      if (lastRequestRef.current === requestKey) {
        setTimeout(() => setIsPageChanging(false), 0);
        return;
      }
      lastRequestRef.current = requestKey;

      dispatch(
        getProducts({
          page: pagination.current_page,
          perPage: pagination.per_page,
          filters: apiFilters,
        }),
      ).finally(() => {
        setIsPageChanging(false);
      });
    }
  }, [dispatch, pagination.current_page, pagination.per_page, apiFilters, isPageChanging]);

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
    sessionStorage.setItem(
      SHOP_STATE_KEY,
      JSON.stringify({
        selectedFilters,
        page: pagination.current_page,
      }),
    );
    navigate(`/shop/product/${productId}`);
  };

  const handlePageChange = (newPage) => {
    setIsPageChanging(true);
    dispatch(setCurrentPage(newPage));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isInitialLoading || isPageChanging || isFilterChanging) {
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
      <div className={`products-grid ${selectedCategoryClass}`.trim()}>
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
