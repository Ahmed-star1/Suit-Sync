import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsService } from "../Redux/Services/productServices";

const SearchModal = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onSearch,
}) => {
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { products, loading: productsLoading } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      fetchAllProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (allProducts.length > 0) {
      filterProducts(debouncedQuery);
    }
  }, [debouncedQuery, allProducts]);

  const fetchAllProducts = async () => {
    setIsFetchingProducts(true);
    try {
      let allFetchedProducts = [];
      let currentPage = 1;
      let totalPages = 1;

      const firstResponse = await getProductsService(currentPage, 50, {});
      const firstData = firstResponse?.data || firstResponse;

      if (firstData?.products) {
        allFetchedProducts = [...firstData.products];
        totalPages = firstData.pagination?.total_pages || 1;
      }

      for (let page = 2; page <= totalPages; page++) {
        const response = await getProductsService(page, 50, {});
        const data = response?.data || response;

        if (data?.products && data.products.length > 0) {
          allFetchedProducts = [...allFetchedProducts, ...data.products];
        }
      }

      setAllProducts(allFetchedProducts);
      console.log(`Total products fetched: ${allFetchedProducts.length}`);
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
      setIsFetchingProducts(false);
    }
  };

  // Filter products based on search query
  const filterProducts = (query) => {
    if (!query || query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = allProducts.filter((product) => {
      const searchTerm = query.toLowerCase().trim();

      const nameMatch = product.name?.toLowerCase().includes(searchTerm);

      const descriptionMatch = product.description
        ?.toLowerCase()
        .includes(searchTerm);

      const categoryMatch = product.category?.name
        ?.toLowerCase()
        .includes(searchTerm);

      const skuMatch = product.sku?.toLowerCase().includes(searchTerm);

      return nameMatch || descriptionMatch || categoryMatch || skuMatch;
    });

    setSearchResults(filtered);
  };

  const getProductImage = (product) => {
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const featuredImage = product.images.find(
        (img) => img.is_featured === true,
      );
      if (featuredImage && featuredImage.image_url) {
        return featuredImage.image_url;
      }
      return product.images[0].image_url || "/Images/suit1.png";
    }

    if (product.primary_image_url) {
      return product.primary_image_url;
    }

    return "/Images/suit1.png";
  };

  const shouldShowLoading = () => {
    return (
      debouncedQuery &&
      debouncedQuery.trim() !== "" &&
      allProducts.length === 0 &&
      isFetchingProducts
    );
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal">
      <div className="search-modal-content">
        <button className="close-modal" onClick={onClose}>
          <i className="fa-solid fa-times"></i>
        </button>

        <h2>Search Products</h2>

        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
          />
        </div>

        <div className="search-results">
          {shouldShowLoading() ? (
            <div className="search-loading-state">
              <p>Loading products...</p>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div
                key={product.id}
                className="search-result-item"
                onClick={() => {
                  window.location.href = `/shop/product/${product.id}`;
                  onClose();
                }}
              >
                <div className="result-image">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = "/Images/suit1.png";
                    }}
                  />
                </div>
                <div className="result-info">
                  <h4>{product.name}</h4>
                  <div className="product-prices">
                    {product.buy_price > 0 && (
                      <span className="buy-price">
                        Buy: ${product.buy_price}
                      </span>
                    )}
                    {product.rent_price > 0 && (
                      <span className="rent-price">
                        Rent: ${product.rent_price}/day
                      </span>
                    )}
                  </div>
                  {product.category && (
                    <span className="product-category">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : debouncedQuery &&
            debouncedQuery.trim() !== "" &&
            allProducts.length > 0 &&
            !isFetchingProducts ? (
            <div className="no-results">
              <p>No products found</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
