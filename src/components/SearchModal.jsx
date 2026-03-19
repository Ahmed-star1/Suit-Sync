import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../Redux/Reducers/productSlice";
import { getProductsService } from "../Redux/Services/productServices"; // ✅ Direct service import for all products

const SearchModal = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onSearch,
}) => {
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // ✅ Store all products
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { products, loading: productsLoading } = useSelector(
    (state) => state.products,
  );

  // ✅ Debounce search query (0.5 sec delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ✅ Fetch ALL products when modal opens (once)
  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      fetchAllProducts();
    }
  }, [isOpen]);

  // ✅ Filter products locally based on search query
  useEffect(() => {
    if (allProducts.length > 0) {
      filterProducts(debouncedQuery);
    }
  }, [debouncedQuery, allProducts]);

  // ✅ Function to fetch ALL products (handle pagination)
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      let allFetchedProducts = [];
      let currentPage = 1;
      let totalPages = 1;

      // First request to get total pages
      const firstResponse = await getProductsService(currentPage, 50, {}); // Per page 100
      const firstData = firstResponse?.data || firstResponse;

      if (firstData?.products) {
        allFetchedProducts = [...firstData.products];
        totalPages = firstData.pagination?.total_pages || 1;
      }

      // Fetch remaining pages
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
      setLoading(false);
    }
  };

  // ✅ Filter products based on search query
  const filterProducts = (query) => {
    if (!query || query.trim() === "") {
      setSearchResults([]); // ✅ Empty search shows no results (as per your requirement)
      return;
    }

    const filtered = allProducts.filter((product) => {
      const searchTerm = query.toLowerCase().trim();

      // Search in product name
      const nameMatch = product.name?.toLowerCase().includes(searchTerm);

      // Search in product description
      const descriptionMatch = product.description
        ?.toLowerCase()
        .includes(searchTerm);

      // Search in category name
      const categoryMatch = product.category?.name
        ?.toLowerCase()
        .includes(searchTerm);

      // Search in SKU
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

  if (!isOpen) return null;

  return (
    <div className="search-modal">
      <div className="search-modal-content">
        <button className="close-modal" onClick={onClose}>
          <i className="fa-solid fa-times"></i>
        </button>

        <h2>Search Products</h2>

        {/* Search Input */}
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
          />
        </div>

        {/* Search Results */}
        <div className="search-results">
          {loading ? (
            <div className="search-loading-state">
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div
                key={product.id}
                className="search-result-item"
                onClick={() => {
                  window.location.href = `/product/${product.id}`;
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
          ) : (
            <div className="no-results"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
