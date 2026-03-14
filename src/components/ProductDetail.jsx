import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SizeChartModal from "../components/SizeChartModal";
import { getProductsService } from "../Redux/Services/productServices";
import { addToCart, getMeasurements, addToWishlist } from "../Redux/Reducers/productSlice";
import Swal from "sweetalert2";

const ProductDetail = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { measurements: savedMeasurements, wishlistLoading } = useSelector((state) => state.products || {});

  // UI State
  const [tabState, setTabState] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("/Images/suit1.png");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Product Selection State
  const [selectedPriceType, setSelectedPriceType] = useState("");
  const [coatSizeTypes, setCoatSizeTypes] = useState([]);
  const [pantSizeTypes, setPantSizeTypes] = useState([]);
  const [coatMeasurementData, setCoatMeasurementData] = useState([]);
  const [pantMeasurementData, setPantMeasurementData] = useState([]);
  const [selectedCoatType, setSelectedCoatType] = useState("");
  const [selectedCoatMeasurement, setSelectedCoatMeasurement] = useState("");
  const [selectedPantType, setSelectedPantType] = useState("");
  const [selectedPantMeasurement, setSelectedPantMeasurement] = useState("");
  const [isMeasurementLoading, setIsMeasurementLoading] = useState(false);

  // generic (non-suit) size state
  const [genericSizes, setGenericSizes] = useState([]);
  const [selectedGenericSize, setSelectedGenericSize] = useState("");

  // Addon Products State
  const [categoryIds, setCategoryIds] = useState({});
  const [shirtProducts, setShirtProducts] = useState([]);
  const [tieProducts, setTieProducts] = useState([]);
  const [bowProducts, setBowProducts] = useState([]);
  const [shoesProducts, setShoesProducts] = useState([]);

  const [selectedShirtProduct, setSelectedShirtProduct] = useState(null);
  const [selectedTieProduct, setSelectedTieProduct] = useState(null);
  const [selectedBowProduct, setSelectedBowProduct] = useState(null);
  const [selectedShoesProduct, setSelectedShoesProduct] = useState(null);

  const [selectedShirtSize, setSelectedShirtSize] = useState("");
  const [selectedTieSize, setSelectedTieSize] = useState("");
  const [selectedBowSize, setSelectedBowSize] = useState("");
  const [selectedShoesSize, setSelectedShoesSize] = useState("");

  // Available sizes for each product type
  const [shirtAvailableSizes, setShirtAvailableSizes] = useState([]);
  const [tieAvailableSizes, setTieAvailableSizes] = useState([]);
  const [bowAvailableSizes, setBowAvailableSizes] = useState([]);
  const [shoesAvailableSizes, setShoesAvailableSizes] = useState([]);

  // UI Dropdown State
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSizeDropdown, setActiveSizeDropdown] = useState(null);

  // Search Terms
  const [shirtSearchTerm, setShirtSearchTerm] = useState("");
  const [tieSearchTerm, setTieSearchTerm] = useState("");
  const [bowSearchTerm, setBowSearchTerm] = useState("");
  const [shoesSearchTerm, setShoesSearchTerm] = useState("");

  // Agreement State
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const standardSizeCategories = ["bow-ties", "pocket-square", "socks"];

  // Fetch category IDs on component mount
  useEffect(() => {
    const fetchCategoryIds = async () => {
      try {
        // Fetch first page of products to get categories filter
        const response = await getProductsService(1, 1, {});
        const categories = response?.data?.filters?.categories || [];
        
        // Create mapping of slug to id
        const ids = {};
        categories.forEach(cat => {
          ids[cat.slug] = cat.id;
        });
        
        setCategoryIds(ids);
        console.log("Category IDs fetched:", ids);
      } catch (error) {
        console.error("Failed to fetch category IDs:", error);
      }
    };

    fetchCategoryIds();
  }, []);
  // Check if current product is in standard size categories
  const isStandardSizeProduct = () => {
    const categorySlug = product?.category?.slug?.toLowerCase() || "";
    return standardSizeCategories.includes(categorySlug);
  };

  // Handle Save Look (Add to Wishlist)
  const handleSaveLook = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoginModalOpen(true);
      setShowLoginModal(true);
      document.body.style.overflow = "hidden";
      return;
    }

    if (!product?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Product information is missing',
        confirmButtonColor: '#000',
      });
      return;
    }

    try {
      const result = await dispatch(addToWishlist(product.id)).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product added to wishlist successfully',
        timer: 2000,
        showConfirmButton: true,
        confirmButtonColor: '#000',
      });
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error || 'Failed to add to wishlist',
        confirmButtonColor: '#000',
      });
    }
  };

  const generateGroupUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Helper function to trunctate long products names
  const truncateName = (name, maxLength = 30) => {
    if (!name) return "";
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  // Helper function to get product image
  const getProductImage = (product) => {
    if (!product) return "/Images/suit1.png";

    // Check if product has primary_image_url (from main product)
    if (product.primary_image_url) {
      return product.primary_image_url;
    }

    // Check if product has images array
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      // Find primary image
      const primaryImage = product.images.find(
        (img) => img.is_primary === true,
      );
      if (primaryImage && primaryImage.image_url) {
        return primaryImage.image_url;
      }
      // If no primary image, use first image
      if (product.images[0] && product.images[0].image_url) {
        return product.images[0].image_url;
      }
    }

    // Check if product has direct image field
    if (product.image) {
      if (product.image.startsWith("http")) {
        return product.image;
      }
      return product.image;
    }

    // Return default image if nothing found
    return "/Images/suit1.png";
  };

  // Helper function to extract sizes from product variants
  const getProductSizes = (product, productType) => {
    if (!product || !product.variants || !Array.isArray(product.variants)) {
      return [];
    }

    let sizes = [];

    if (productType === "shoes") {
      // For shoes, use size_measurement
      sizes = product.variants
        .map((variant) => variant.size_measurement)
        .filter((size) => size && size.trim() !== "")
        .filter((value, index, self) => self.indexOf(value) === index);
    } else {
      // For shirts, ties, bows - use size_type
      sizes = product.variants
        .map((variant) => variant.size_type)
        .filter((size) => size && size.trim() !== "")
        .filter((value, index, self) => self.indexOf(value) === index);
    }

    return sizes;
  };

  // Update available sizes when product is selected
  useEffect(() => {
    if (selectedShirtProduct) {
      const sizes = getProductSizes(selectedShirtProduct, "shirt");
      setShirtAvailableSizes(sizes);
      setSelectedShirtSize("");
    } else {
      setShirtAvailableSizes([]);
    }
  }, [selectedShirtProduct]);

  useEffect(() => {
    if (selectedTieProduct) {
      const sizes = getProductSizes(selectedTieProduct, "tie");
      setTieAvailableSizes(sizes);
      setSelectedTieSize("");
    } else {
      setTieAvailableSizes([]);
    }
  }, [selectedTieProduct]);

  useEffect(() => {
    if (selectedBowProduct) {
      const sizes = getProductSizes(selectedBowProduct, "bow");
      setBowAvailableSizes(sizes);
      setSelectedBowSize("");
    } else {
      setBowAvailableSizes([]);
    }
  }, [selectedBowProduct]);

  useEffect(() => {
    if (selectedShoesProduct) {
      const sizes = getProductSizes(selectedShoesProduct, "shoes");
      setShoesAvailableSizes(sizes);
      setSelectedShoesSize("");
    } else {
      setShoesAvailableSizes([]);
    }
  }, [selectedShoesProduct]);

  // Extract product data on load
  const extractGenericSizes = (prod) => {
    if (!prod) return [];
    const buyGroup =
      prod.buy_type_groups?.find((g) => g.type) || prod.buy_type_groups?.[0];
    const firstColor = buyGroup?.colors?.[0];
    if (!firstColor) return [];

    // measurement list directly on color
    if (firstColor.measurements && firstColor.measurements.length) {
      return firstColor.measurements.map((m) => ({
        value: String(m.measurement || m.size || m.label || m),
        stock: m.stock_quantity ?? 0,
      }));
    }

    // or nested under sizes
    if (firstColor.sizes && firstColor.sizes.length) {
      const results = [];
      firstColor.sizes.forEach((s) => {
        if (s.measurements && s.measurements.length) {
          s.measurements.forEach((m) => {
            results.push({
              value: String(m.measurement || m.size || m.label || m),
              stock: m.stock_quantity ?? 0,
            });
          });
        } else {
          results.push({
            value: String(s.size_type || s.label || s.name || s.id || s),
            stock: s.stock_quantity ?? 0,
          });
        }
      });
      return results;
    }
    return [];
  };

  useEffect(() => {
    if (!product?.buy_type_groups?.length) return;

    const buyGroup = product.buy_type_groups.find((group) => group.type);
    if (!buyGroup?.colors?.length) return;

    const firstColor = buyGroup.colors[0];
    // categories may be absent for generic products, so don't bail early
    const hasCategories = firstColor.categories && firstColor.categories.length;

    // Coat sizes
    const coatCategory = firstColor.categories?.find(
      (cat) => cat.category === "coat",
    );
    if (coatCategory?.sizes?.length) {
      const types = coatCategory.sizes.map((s) => s.size_type);
      setCoatSizeTypes(types);
    } else {
      setCoatSizeTypes([]);
    }

    // Pant sizes
    const pantCategory = firstColor.categories?.find(
      (cat) => cat.category === "pants",
    );
    if (pantCategory?.sizes?.length) {
      const types = pantCategory.sizes.map((s) => s.size_type);
      setPantSizeTypes(types);
    } else {
      setPantSizeTypes([]);
    }

    // Generic when no categories exist or this is not a suit
    if (!hasCategories || (!coatCategory && !pantCategory)) {
      const gen = extractGenericSizes(product);
      setGenericSizes(gen);
      setSelectedGenericSize("");
      setSelectedCoatType("");
      setSelectedCoatMeasurement("");
      setSelectedPantType("");
      setSelectedPantMeasurement("");
    } else {
      setGenericSizes([]);
      setSelectedGenericSize("");
    }
  }, [product]);

  // Update coat measurements
  useEffect(() => {
    if (!product || !selectedCoatType) {
      setCoatMeasurementData([]);
      setSelectedCoatMeasurement("");
      return;
    }

    const buyGroup = product.buy_type_groups.find((g) => g.type);
    const firstColor = buyGroup?.colors?.[0];
    const coatCategory = firstColor?.categories?.find(
      (cat) => cat.category === "coat",
    );
    const sizeType = coatCategory?.sizes?.find(
      (s) => s.size_type === selectedCoatType,
    );

    if (sizeType?.measurements?.length) {
      setCoatMeasurementData(sizeType.measurements);
    } else {
      setCoatMeasurementData([]);
    }
    setSelectedCoatMeasurement("");
  }, [selectedCoatType, product]);

  // Update pant measurements
  useEffect(() => {
    if (!product || !selectedPantType) {
      setPantMeasurementData([]);
      setSelectedPantMeasurement("");
      return;
    }

    const buyGroup = product.buy_type_groups.find((g) => g.type);
    const firstColor = buyGroup?.colors?.[0];
    const pantCategory = firstColor?.categories?.find(
      (cat) => cat.category === "pants",
    );
    const sizeType = pantCategory?.sizes?.find(
      (s) => s.size_type === selectedPantType,
    );

    if (sizeType?.measurements?.length) {
      setPantMeasurementData(sizeType.measurements);
    } else {
      setPantMeasurementData([]);
    }
    setSelectedPantMeasurement("");
  }, [selectedPantType, product]);

  // Image handling for main product - FIXED VERSION
  const getPrimaryImage = () => {
    if (!product) return "/Images/suit1.png";

    if (product.primary_image_url) {
      return product.primary_image_url;
    }

    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const primaryImg = product.images.find((img) => img.is_primary);
      if (primaryImg && primaryImg.image_url) {
        return primaryImg.image_url;
      }
      if (product.images[0] && product.images[0].image_url) {
        return product.images[0].image_url;
      }
    }

    return "/Images/suit1.png";
  };

  const galleryImages = product?.images?.map((img) => img.image_url) || [];

  useEffect(() => {
    if (product) setSelectedImage(getPrimaryImage());
  }, [product]);

  // Utility Functions
  const capitalizeFirst = (str) =>
    str?.charAt(0).toUpperCase() + str?.slice(1) || "";

  const handleAddToCart = async () => {
    const isSuit = coatSizeTypes.length || pantSizeTypes.length;

    if (isSuit) {
      if (
        !selectedPantType ||
        !selectedPantMeasurement ||
        !selectedCoatType ||
        !selectedCoatMeasurement
      ) {
        return;
      }

      const selectedCoatItem = coatMeasurementData.find(
        (item) => item.measurement.toString() === selectedCoatMeasurement,
      );
      const selectedPantItem = pantMeasurementData.find(
        (item) => item.measurement.toString() === selectedPantMeasurement,
      );

      if (
        selectedCoatItem?.stock_quantity === 0 ||
        selectedPantItem?.stock_quantity === 0
      ) {
        return;
      }

      if (!selectedPriceType) {
        return;
      }

      // Check login
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoginModalOpen(true);
        setShowLoginModal(true);
        document.body.style.overflow = "hidden";
        return;
      }

      if (selectedPriceType.toLowerCase() === "rent") {
        setIsRentModalOpen(true);
        setShowRentModal(true);
        document.body.style.overflow = "hidden";
        return;
      } 
      
      if (selectedPriceType.toLowerCase() === "buy") {
        const suitGroupUUID = generateGroupUUID();
        
        const cartData = {
          group_uuid: suitGroupUUID,
          product_id: product.id,
          size_category: "coat",
          size_type: selectedCoatType,
          size_measurement: selectedCoatMeasurement,
          color: product.color_name || product.color_code,
          buy_type: "buy",
          override_price: 0, 
          addOns: []
        };

        const pantsAddon = {
          group_uuid: suitGroupUUID,
          product_id: product.id,
          size_category: "pants",
          size_type: selectedPantType,
          size_measurement: selectedPantMeasurement,
          color: product.color_name || product.color_code,
          buy_type: "buy"
        };
        
        cartData.addOns.push(pantsAddon);

        try {
          setIsAddingToCart(true);
          const result = await dispatch(addToCart(cartData)).unwrap();
          
          setTimeout(() => {
            setIsAddingToCart(false);
            navigate("/cart");
          }, 1000);
        } catch (error) {
          setIsAddingToCart(false);
        }
        return;
      }
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoginModalOpen(true);
      setShowLoginModal(true);
      document.body.style.overflow = "hidden";
      return;
    }

    if (genericSizes.length) {
      if (!selectedGenericSize) {
        return;
      }
      const choice = genericSizes.find(
        (s) => s.value.toString() === selectedGenericSize.toString(),
      );
      if (choice?.stock === 0) {
        return;
      }
    }

    if (!selectedPriceType) {
      return;
    }

    const cartData = {
      product_id: product.id,
      color: product.color_name || product.color_code,
      buy_type: selectedPriceType.toLowerCase(),
    };

    if (product?.category?.id === 2 || product?.category_id === 2) {
      cartData.size_measurement = selectedGenericSize;
    } else {
      cartData.size_type = selectedGenericSize;
    }

    try {
      setIsAddingToCart(true);
      const result = await dispatch(addToCart(cartData)).unwrap();
      setTimeout(() => {
        setIsAddingToCart(false);
        navigate("/cart");
      }, 1000);
    } catch (error) {
      setIsAddingToCart(false);
    }
  };

  const isFormValid = () => {
    if (!selectedPriceType) {
      return false;
    }
    if (coatSizeTypes.length || pantSizeTypes.length) {
      return (
        selectedPantType &&
        selectedPantMeasurement &&
        selectedCoatType &&
        selectedCoatMeasurement
      );
    } else if (genericSizes.length) {
      return !!selectedGenericSize;
    }
    return false;
  };

  // Fetch products when dropdown is opened
  const fetchProductsByCategory = async (categoryId, type) => {
    setIsLoading(true);
    try {
      let allProducts = [];
      let currentPage = 1;
      let totalPages = 1;

      // First request to get total pages
      const firstResponse = await getProductsService(currentPage, 50, {
        category: [categoryId],
      });
      const firstData = firstResponse?.data || firstResponse;

      if (firstData?.products) {
        allProducts = [...firstData.products];
        totalPages = firstData.pagination?.total_pages || 1;
      }

      for (let page = 2; page <= totalPages; page++) {
        const response = await getProductsService(page, 50, {
          category: [categoryId],
        });
        const data = response?.data || response;

        if (data?.products && data.products.length > 0) {
          allProducts = [...allProducts, ...data.products];
        }
      }

      switch (type) {
        case "shirt":
          setShirtProducts(allProducts);
          break;
        case "tie":
          setTieProducts(allProducts);
          break;
        case "bow":
          setBowProducts(allProducts);
          break;
        case "shoes":
          const rentShoes = allProducts.filter(
            (p) => p?.rent_price && parseFloat(p.rent_price) > 0,
          );
          setShoesProducts(rentShoes);
          break;
        default:
          break;
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownClick = (dropdownType) => {
    if (activeDropdown === dropdownType) {
      setActiveDropdown(null);
      return;
    }

    setActiveDropdown(dropdownType);

    // Map dropdown type to category slug
    const slugMap = {
      shirt: "shirts",
      tie: "ties",
      bow: "bow-ties",
      shoes: "shoes"
    };

    const categorySlug = slugMap[dropdownType];
    const categoryId = categoryIds[categorySlug];

    if (!categoryId) {
      console.error(`Category ID not found for ${dropdownType} (slug: ${categorySlug})`);
      return;
    }

    // Fetch products based on dropdown type with dynamic IDs
    switch (dropdownType) {
      case "shirt":
        if (shirtProducts.length === 0) {
          fetchProductsByCategory(categoryId, "shirt");
        }
        break;
      case "tie":
        if (tieProducts.length === 0) {
          fetchProductsByCategory(categoryId, "tie");
        }
        break;
      case "bow":
        if (bowProducts.length === 0) {
          fetchProductsByCategory(categoryId, "bow");
        }
        break;
      case "shoes":
        if (shoesProducts.length === 0) {
          fetchProductsByCategory(categoryId, "shoes");
        }
        break;
      default:
        break;
    }
  };

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setSelectedTieProduct(null);
    setSelectedBowProduct(null);
    setSelectedTieSize("");
    setSelectedBowSize("");
    setTieAvailableSizes([]);
    setBowAvailableSizes([]);
  };

  const closeRentModal = () => {
    setShowRentModal(false);
    setAgreeToTerms(false);
    setTimeout(() => {
      setIsRentModalOpen(false);
      document.body.style.overflow = "auto";
      setActiveDropdown(null);
      setActiveSizeDropdown(null);
      setSelectedType(null);
      // Reset selections
      setSelectedShirtProduct(null);
      setSelectedTieProduct(null);
      setSelectedBowProduct(null);
      setSelectedShoesProduct(null);
      setSelectedShirtSize("");
      setSelectedTieSize("");
      setSelectedBowSize("");
      setSelectedShoesSize("");
      // Clear products
      setShirtProducts([]);
      setTieProducts([]);
      setBowProducts([]);
      setShoesProducts([]);
      // Clear available sizes
      setShirtAvailableSizes([]);
      setTieAvailableSizes([]);
      setBowAvailableSizes([]);
      setShoesAvailableSizes([]);
    }, 300);
  };

  const handleConfirmRent = async () => {
    const suitGroupUUID = generateGroupUUID();
    
    const cartData = {
      group_uuid: suitGroupUUID,
      product_id: product.id,
      size_category: "coat",
      size_type: selectedCoatType,
      size_measurement: selectedCoatMeasurement,
      color: product.color_name || product.color_code,
      buy_type: selectedPriceType.toLowerCase(),
      override_price: 0, 
      addOns: []
    };

    const pantsAddon = {
      group_uuid: suitGroupUUID,
      product_id: product.id,
      size_category: "pants",
      size_type: selectedPantType,
      size_measurement: selectedPantMeasurement,
      color: product.color_name || product.color_code,
      buy_type: selectedPriceType.toLowerCase()
    };
    
    cartData.addOns.push(pantsAddon);

    if (selectedShirtProduct && selectedShirtSize) {
      cartData.addOns.push({
        product_id: selectedShirtProduct.id,
        size_type: selectedShirtSize,
        color: selectedShirtProduct.color_name || selectedShirtProduct.color_code,
        buy_type: "rent",
        override_price: 0
      });
    }

    if (selectedType === "tie" && selectedTieProduct && selectedTieSize) {
      cartData.addOns.push({
        product_id: selectedTieProduct.id,
        size_type: selectedTieSize,
        color: selectedTieProduct.color_name || selectedTieProduct.color_code,
        buy_type: "rent",
        override_price: 0
      });
    }

    if (selectedType === "bow" && selectedBowProduct && selectedBowSize) {
      cartData.addOns.push({
        product_id: selectedBowProduct.id,
        size_type: selectedBowSize,
        color: selectedBowProduct.color_name || selectedBowProduct.color_code,
        buy_type: "rent",
        override_price: 0
      });
    }

    if (selectedShoesProduct && selectedShoesSize) {
      cartData.addOns.push({
        product_id: selectedShoesProduct.id,
        size_measurement: selectedShoesSize,
        color: selectedShoesProduct.color_name || selectedShoesProduct.color_code,
        buy_type: "rent",
        override_price: selectedShoesProduct.rent_price
      });
    }

    try {
      setIsAddingToCart(true);
      const result = await dispatch(addToCart(cartData)).unwrap();
      
      closeRentModal();
      
      setTimeout(() => {
        setIsAddingToCart(false);
        navigate("/cart");
      }, 1000);
      
    } catch (error) {
      setIsAddingToCart(false);
    }
  };

  const isRentFormValid = () => {
    if (!selectedShirtProduct || !selectedShirtSize) {
      return false;
    }

    if (selectedType === "tie") {
      if (!selectedTieProduct || !selectedTieSize) {
        return false;
      }
    }

    if (selectedType === "bow") {
      if (!selectedBowProduct || !selectedBowSize) {
        return false;
      }
    }

    if (selectedShoesProduct && !selectedShoesSize) {
      return false;
    }

    if (!agreeToTerms) {
      return false;
    }

    return true;
  };

  // Auto-select price based on available options
  useEffect(() => {
    if (!product) return;

    const hasBuyPrice = product?.buy_price && parseFloat(product.buy_price) > 0;
    const hasRentPrice =
      product?.rent_price && parseFloat(product.rent_price) > 0;

    if (hasBuyPrice && !hasRentPrice) {
      setSelectedPriceType("buy");
    } else if (!hasBuyPrice && hasRentPrice) {
      setSelectedPriceType("rent");
    } else {
      setSelectedPriceType("");
    }
  }, [product]);

  // Handle Use My Measurement click function
  const handleUseMyMeasurement = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoginModalOpen(true);
      setShowLoginModal(true);
      document.body.style.overflow = "hidden";
      return;
    }

    setIsMeasurementLoading(true);
    
    try {
      const result = await dispatch(getMeasurements()).unwrap();
      
      if (result?.data) {
        const measurements = result.data;
        
        if (coatSizeTypes.length || pantSizeTypes.length) {
          if (measurements.coat_fit) {
            setSelectedCoatType(measurements.coat_fit);
          }
          if (measurements.pant_fit) {
            setSelectedPantType(measurements.pant_fit);
          }
        
          setTimeout(() => {
            if (measurements.coat_size) {
              setSelectedCoatMeasurement(measurements.coat_size);
            }
            if (measurements.pant_size) {
              setSelectedPantMeasurement(measurements.pant_size);
            }
          }, 100);
        } else if (product?.category?.slug === "shoes") {
          if (measurements.shoe_size) setSelectedGenericSize(measurements.shoe_size.toString());
        } else if (product?.category?.slug === "ties") {
          if (measurements.tie_size) setSelectedGenericSize(measurements.tie_size);
        } else if (product?.category?.slug === "shirts") {
          if (measurements.shirt_size) setSelectedGenericSize(measurements.shirt_size);
        } else if (product?.category?.slug === "belts") {
          if (measurements.belt_size) setSelectedGenericSize(measurements.belt_size);
        } 
      }
    } catch (error) {
      console.error("Failed to load measurements:", error);
    } finally {
      setIsMeasurementLoading(false);
    }
  };

  // Filter functions
  const filteredShirtProducts = shirtProducts.filter((p) =>
    p?.name?.toLowerCase().includes(shirtSearchTerm.toLowerCase()),
  );
  const filteredTieProducts = tieProducts.filter((p) =>
    p?.name?.toLowerCase().includes(tieSearchTerm.toLowerCase()),
  );
  const filteredBowProducts = bowProducts.filter((p) =>
    p?.name?.toLowerCase().includes(bowSearchTerm.toLowerCase()),
  );
  const filteredShoesProducts = shoesProducts.filter(
    (p) =>
      p?.name?.toLowerCase().includes(shoesSearchTerm.toLowerCase()) &&
      p?.rent_price &&
      parseFloat(p.rent_price) > 0,
  );
  if (!product) return null;

  return (
    <>
      <section className="product-detail-container container">
        <div className="row">
          <div className="product-left-column col-md-6" data-aos="fade-right">
            <div className="main-image">
              <img
                src={selectedImage}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/Images/suit1.png";
                }}
              />
            </div>

            {galleryImages.length > 0 && (
              <div className="image-gallery swiper-container">
                <Swiper
                  spaceBetween={10}
                  slidesPerView={5}
                  modules={[Navigation]}
                  navigation
                >
                  {galleryImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img}
                        alt={`${product.name}-${index}`}
                        onClick={() => setSelectedImage(img)}
                        className={selectedImage === img ? "active" : ""}
                        onError={(e) => {
                          e.target.src = "/Images/suit1.png";
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
          <div className="product-right-column col-md-6" data-aos="fade-left">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-description">
              <h5>DESCRIPTION</h5>
              <p>{product.description}</p>
            </div>
            <div className="product-color">
              <h5>COLOR</h5>
              <div className="color-option active">
                <div
                  className="color-swatch"
                  title={product.color_name}
                  style={{ background: product.color_code }}
                />
                <span className="color-name">{product.color_name}</span>
              </div>
            </div>
            <div className="product-size">
              {isStandardSizeProduct() ? (
                <div className="sizes">
                  <h5>SIZE</h5>
                  <div className="standard-size-display">
                    <span className="standard-size-value">Standard</span>
                  </div>
                </div>
              ) : coatSizeTypes.length === 0 && pantSizeTypes.length === 0 ? (
                <div className="sizes">
                  <h5>SIZE</h5>
                  <div className="sizes-dropdown">
                    <div className="custom-select-wrapper">
                      <div
                        className="custom-select"
                        onClick={() =>
                          setActiveSizeDropdown(
                            activeSizeDropdown === "generic" ? null : "generic",
                          )
                        }
                      >
                        <span className="selected-value">
                          {selectedGenericSize || "Select Size"}
                        </span>
                        <i className="fa-solid fa-chevron-down"></i>
                      </div>

                      {activeSizeDropdown === "generic" && (
                        <ul className="custom-select-dropdown">
                          {genericSizes.length ? (
                            genericSizes.map((item, idx) => {
                              const isOut = item.stock === 0;
                              return (
                                <li
                                  key={idx}
                                  className={`${selectedGenericSize === item.value ? "active" : ""} ${
                                    isOut ? "out-of-stock" : ""
                                  }`}
                                  onClick={() => {
                                    if (!isOut) {
                                      setSelectedGenericSize(item.value);
                                      setActiveSizeDropdown(null);
                                    }
                                  }}
                                  style={
                                    isOut
                                      ? { opacity: 0.5, cursor: "not-allowed" }
                                      : {}
                                  }
                                >
                                  {item.value} {isOut && "(Out of Stock)"}
                                </li>
                              );
                            })
                          ) : (
                            <li className="disabled">No sizes available</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="sizes">
                    <h5>COAT SIZE</h5>
                    <div className="sizes-dropdown">
                      <div className="custom-select-wrapper">
                        <div
                          className="custom-select"
                          onClick={() =>
                            setActiveSizeDropdown(
                              activeSizeDropdown === "coat" ? null : "coat",
                            )
                          }
                        >
                          <span className="selected-value">
                            {selectedCoatType
                              ? capitalizeFirst(selectedCoatType)
                              : "Select Coat Size"}
                          </span>
                          <i className="fa-solid fa-chevron-down"></i>
                        </div>

                        {activeSizeDropdown === "coat" && (
                          <ul className="custom-select-dropdown">
                            {coatSizeTypes.map((type, idx) => (
                              <li
                                key={idx}
                                className={
                                  selectedCoatType === type ? "active" : ""
                                }
                                onClick={() => {
                                  setSelectedCoatType(type);
                                  setActiveSizeDropdown(null);
                                }}
                              >
                                {capitalizeFirst(type)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {selectedCoatType && coatMeasurementData.length > 0 && (
                        <div className="custom-select-wrapper">
                          <div
                            className="custom-select"
                            onClick={() =>
                              setActiveSizeDropdown(
                                activeSizeDropdown === "coatInner"
                                  ? null
                                  : "coatInner",
                              )
                            }
                          >
                            <span className="selected-value">
                              {selectedCoatMeasurement || "Select Length"}
                            </span>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>

                          {activeSizeDropdown === "coatInner" && (
                            <ul className="custom-select-dropdown">
                              {coatMeasurementData.map((item, idx) => {
                                const isOutOfStock = item.stock_quantity === 0;
                                return (
                                  <li
                                    key={idx}
                                    className={`
                                      ${selectedCoatMeasurement === item.measurement.toString() ? "active" : ""}
                                      ${isOutOfStock ? "out-of-stock" : ""}
                                    `}
                                    onClick={() => {
                                      if (!isOutOfStock) {
                                        setSelectedCoatMeasurement(
                                          item.measurement.toString(),
                                        );
                                        setActiveSizeDropdown(null);
                                      }
                                    }}
                                  >
                                    {item.measurement}{" "}
                                    {isOutOfStock && "(Out of Stock)"}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="sizes">
                    <h5>PANT SIZE</h5>
                    <div className="sizes-dropdown">
                      <div className="custom-select-wrapper">
                        <div
                          className="custom-select"
                          onClick={() =>
                            setActiveSizeDropdown(
                              activeSizeDropdown === "pant" ? null : "pant",
                            )
                          }
                        >
                          <span className="selected-value">
                            {selectedPantType
                              ? capitalizeFirst(selectedPantType)
                              : "Select Pant Size"}
                          </span>
                          <i className="fa-solid fa-chevron-down"></i>
                        </div>

                        {activeSizeDropdown === "pant" && (
                          <ul className="custom-select-dropdown">
                            {pantSizeTypes.map((type, idx) => (
                              <li
                                key={idx}
                                className={
                                  selectedPantType === type ? "active" : ""
                                }
                                onClick={() => {
                                  setSelectedPantType(type);
                                  setActiveSizeDropdown(null);
                                }}
                              >
                                {capitalizeFirst(type)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {selectedPantType && pantMeasurementData.length > 0 && (
                        <div className="custom-select-wrapper">
                          <div
                            className="custom-select"
                            onClick={() =>
                              setActiveSizeDropdown(
                                activeSizeDropdown === "pantInner"
                                  ? null
                                  : "pantInner",
                              )
                            }
                          >
                            <span className="selected-value">
                              {selectedPantMeasurement || "Select Length"}
                            </span>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>

                          {activeSizeDropdown === "pantInner" && (
                            <ul className="custom-select-dropdown">
                              {pantMeasurementData.map((item, idx) => {
                                const isOutOfStock = item.stock_quantity === 0;
                                return (
                                  <li
                                    key={idx}
                                    className={`
                                  ${selectedPantMeasurement === item.measurement.toString() ? "active" : ""}
                                  ${isOutOfStock ? "out-of-stock" : ""}
                                `}
                                    onClick={() => {
                                      if (!isOutOfStock) {
                                        setSelectedPantMeasurement(
                                          item.measurement.toString(),
                                        );
                                        setActiveSizeDropdown(null);
                                      }
                                    }}
                                  >
                                    {item.measurement}{" "}
                                    {isOutOfStock && "(Out of Stock)"}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="size-actions">
              <button
                className="size-chart-btn"
                onClick={() => setIsSizeModalOpen(true)}
              >
                VIEW SIZE CHART
              </button>
              {!isStandardSizeProduct() && (
                <button 
                  className="measurement-btn" 
                  onClick={handleUseMyMeasurement}
                  disabled={isMeasurementLoading}
                  style={{
                    opacity: isMeasurementLoading ? 0.7 : 1,
                    cursor: isMeasurementLoading ? "not-allowed" : "pointer"
                  }}
                >
                  {isMeasurementLoading ? "LOADING..." : "USE MY MEASUREMENT"}
                </button>
              )}
            </div>
            <div className="product-prices">
              <h5>Select Price</h5>
              <div className="prices">
                {product?.buy_price && parseFloat(product.buy_price) > 0 && (
                  <div
                    className={`price-option ${
                      selectedPriceType === "buy" ? "active" : ""
                    }`}
                    onClick={() => setSelectedPriceType("buy")}
                  >
                    <span className="price-label">BUY:</span>
                    <span className="price-value">${product.buy_price}</span>
                  </div>
                )}
                {product?.rent_price && parseFloat(product.rent_price) > 0 && (
                  <div
                    className={`price-option ${
                      selectedPriceType === "rent" ? "active" : ""
                    }`}
                    onClick={() => setSelectedPriceType("rent")}
                  >
                    <span className="price-label">RENT:</span>
                    <span className="price-value">${product.rent_price}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="product-actions">
              <button 
                className="save-look-btn" 
                onClick={handleSaveLook}
                disabled={wishlistLoading}
                style={{
                  opacity: wishlistLoading ? 0.7 : 1,
                  cursor: wishlistLoading ? "not-allowed" : "pointer"
                }}
              >
                {wishlistLoading ? "SAVING..." : "SAVE LOOK"}
              </button>
              <button
                className={`add-to-cart-btn ${!isFormValid() || isAddingToCart ? "disabled" : ""}`}
                onClick={handleAddToCart}
                disabled={!isFormValid() || isAddingToCart}
                style={{
                  opacity: !isFormValid() || isAddingToCart ? 0.5 : 1,
                  cursor:
                    !isFormValid() || isAddingToCart
                      ? "not-allowed"
                      : "pointer",
                  backgroundColor: !isFormValid()
                    ? "#000"
                    : isAddingToCart
                      ? "#000"
                      : "#000",
                  transition: "all 0.3s ease",
                }}
              >
                {isAddingToCart ? "ADDING..." : "ADD TO CART"}
              </button>
            </div>
            <div className="product-description-tab">
              <div
                className="tab-header"
                onClick={() => setTabState(!tabState)}
              >
                <h4>PRODUCT DETAILS</h4>
                <i
                  className={`fa-solid fa-angle-down arrow-icon ${tabState ? "rotate" : ""}`}
                />
              </div>
              <div className={`tab-content ${tabState ? "open" : ""}`}>
                <p>{product.description}</p>
                {product.sku && <p>SKU: {product.sku}</p>}
                {product.stock_quantity && (
                  <p>Stock: {product.stock_quantity}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <SizeChartModal
          isOpen={isSizeModalOpen}
          onClose={() => setIsSizeModalOpen(false)}
        />

        {isRentModalOpen && (
          <div
            className={`rent-modal-overlay ${
              showRentModal ? "fade-in" : "fade-out"
            }`}
          >
            <div
              className={`rent-modal ${showRentModal ? "modal-in" : "modal-out"}`}
            >
              <h2>ADDONS</h2>
              <h3 className="addon-section-heading">SHIRTS</h3>
              <div className="product-with-size">
                <div className="custom-select-wrapper product-select-wrapper">
                  <div
                    className="custom-select"
                    onClick={() => handleDropdownClick("shirt")}
                  >
                    {selectedShirtProduct ? (
                      <div className="selected-product-display">
                        <img
                          src={getProductImage(selectedShirtProduct)}
                          alt={selectedShirtProduct.name}
                          className="selected-product-image"
                          onError={(e) => {
                            e.target.src = "/Images/suit1.png";
                          }}
                        />
                        <span className="selected-product-title">
                          {truncateName(selectedShirtProduct.name)}
                        </span>
                      </div>
                    ) : (
                      <span className="selected-value">Select Shirt</span>
                    )}
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>

                  {activeDropdown === "shirt" && (
                    <div className="custom-select-dropdown searchable-dropdown">
                      <div className="search-box">
                        <i className="fa-solid fa-search search-icon"></i>
                        <input
                          type="text"
                          placeholder="Search shirts..."
                          value={shirtSearchTerm}
                          onChange={(e) => setShirtSearchTerm(e.target.value)}
                          className="dropdown-search-input"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      </div>
                      <ul className="dropdown-items-list">
                        {isLoading ? (
                          <li className="dropdown-item loading">Loading...</li>
                        ) : filteredShirtProducts.length > 0 ? (
                          filteredShirtProducts.map((product, index) => (
                            <li
                              key={index}
                              className={`dropdown-item ${
                                selectedShirtProduct?.id === product.id
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedShirtProduct(product);
                                setActiveDropdown(null);
                                setSelectedShirtSize("");
                              }}
                            >
                              <img
                                src={getProductImage(product)}
                                alt={product.name}
                                className="dropdown-item-image"
                                onError={(e) => {
                                  e.target.src = "/Images/suit1.png";
                                }}
                              />
                              <span className="dropdown-item-title">
                                {truncateName(product.name, 25)}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="dropdown-item no-results">
                            No shirts found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                {selectedShirtProduct && (
                  <div className="custom-select-wrapper size-select-wrapper">
                    <div
                      className="custom-select size-select"
                      onClick={() =>
                        setActiveSizeDropdown(
                          activeSizeDropdown === "shirt-size"
                            ? null
                            : "shirt-size",
                        )
                      }
                    >
                      <span className="selected-value">
                        {selectedShirtSize || "Select Size"}
                      </span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {activeSizeDropdown === "shirt-size" && (
                      <ul className="custom-select-dropdown size-dropdown">
                        {shirtAvailableSizes.length > 0 ? (
                          shirtAvailableSizes.map((size, index) => (
                            <li
                              key={index}
                              className={
                                selectedShirtSize === size ? "active" : ""
                              }
                              onClick={() => {
                                setSelectedShirtSize(size);
                                setActiveSizeDropdown(null);
                              }}
                            >
                              {size}
                            </li>
                          ))
                        ) : (
                          <li className="dropdown-item no-results">
                            No sizes available
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <h3 className="addon-section-heading">TIES & BOWS</h3>
              <div className="type-selection-tabs">
                <button
                  className={`type-tab ${selectedType === "tie" ? "active" : ""}`}
                  onClick={() => handleTypeSelection("tie")}
                >
                  Tie
                </button>
                <button
                  className={`type-tab ${selectedType === "bow" ? "active" : ""}`}
                  onClick={() => handleTypeSelection("bow")}
                >
                  Bow
                </button>
              </div>
              {selectedType === "tie" && (
                <div className="product-with-size">
                  <div className="custom-select-wrapper product-select-wrapper">
                    <div
                      className="custom-select"
                      onClick={() => handleDropdownClick("tie")}
                    >
                      {selectedTieProduct ? (
                        <div className="selected-product-display">
                          <img
                            src={getProductImage(selectedTieProduct)}
                            alt={selectedTieProduct.name}
                            className="selected-product-image"
                            onError={(e) => {
                              e.target.src = "/Images/suit1.png";
                            }}
                          />
                          <span className="selected-product-title">
                            {truncateName(selectedTieProduct.name)}
                          </span>
                        </div>
                      ) : (
                        <span className="selected-value">Select Tie</span>
                      )}
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {activeDropdown === "tie" && (
                      <div className="custom-select-dropdown searchable-dropdown">
                        <div className="search-box">
                          <i className="fa-solid fa-search search-icon"></i>
                          <input
                            type="text"
                            placeholder="Search ties..."
                            value={tieSearchTerm}
                            onChange={(e) => setTieSearchTerm(e.target.value)}
                            className="dropdown-search-input"
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        </div>
                        <ul className="dropdown-items-list">
                          {isLoading ? (
                            <li className="dropdown-item loading">
                              Loading...
                            </li>
                          ) : filteredTieProducts.length > 0 ? (
                            filteredTieProducts.map((product, index) => (
                              <li
                                key={index}
                                className={`dropdown-item ${
                                  selectedTieProduct?.id === product.id
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => {
                                  setSelectedTieProduct(product);
                                  setActiveDropdown(null);
                                  setSelectedTieSize("");
                                }}
                              >
                                <img
                                  src={getProductImage(product)}
                                  alt={product.name}
                                  className="dropdown-item-image"
                                  onError={(e) => {
                                    e.target.src = "/Images/suit1.png";
                                  }}
                                />
                                <span className="dropdown-item-title">
                                  {truncateName(product.name, 25)}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="dropdown-item no-results">
                              No ties found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {selectedTieProduct && (
                    <div className="custom-select-wrapper size-select-wrapper">
                      <div
                        className="custom-select size-select"
                        onClick={() =>
                          setActiveSizeDropdown(
                            activeSizeDropdown === "tie-size"
                              ? null
                              : "tie-size",
                          )
                        }
                      >
                        <span className="selected-value">
                          {selectedTieSize || "Select Size"}
                        </span>
                        <i className="fa-solid fa-chevron-down"></i>
                      </div>

                      {activeSizeDropdown === "tie-size" && (
                        <ul className="custom-select-dropdown size-dropdown">
                          {tieAvailableSizes.length > 0 ? (
                            tieAvailableSizes.map((size, index) => (
                              <li
                                key={index}
                                className={
                                  selectedTieSize === size ? "active" : ""
                                }
                                onClick={() => {
                                  setSelectedTieSize(size);
                                  setActiveSizeDropdown(null);
                                }}
                              >
                                {size}
                              </li>
                            ))
                          ) : (
                            <li className="dropdown-item no-results">
                              No sizes available
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  )}
              </div>
              )}
              
              {selectedType === "bow" && (
                <div className="product-with-size">
                  <div className="custom-select-wrapper product-select-wrapper">
                    <div
                      className="custom-select"
                      onClick={() => handleDropdownClick("bow")}
                    >
                      {selectedBowProduct ? (
                        <div className="selected-product-display">
                          <img
                            src={getProductImage(selectedBowProduct)}
                            alt={selectedBowProduct.name}
                            className="selected-product-image"
                            onError={(e) => {
                              e.target.src = "/Images/suit1.png";
                            }}
                          />
                          <span className="selected-product-title">
                            {truncateName(selectedBowProduct.name)}
                          </span>
                        </div>
                      ) : (
                        <span className="selected-value">Select Bow</span>
                      )}
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {activeDropdown === "bow" && (
                      <div className="custom-select-dropdown searchable-dropdown">
                        <div className="search-box">
                          <i className="fa-solid fa-search search-icon"></i>
                          <input
                            type="text"
                            placeholder="Search bows..."
                            value={bowSearchTerm}
                            onChange={(e) => setBowSearchTerm(e.target.value)}
                            className="dropdown-search-input"
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        </div>
                        <ul className="dropdown-items-list">
                          {isLoading ? (
                            <li className="dropdown-item loading">
                              Loading...
                            </li>
                          ) : filteredBowProducts.length > 0 ? (
                            filteredBowProducts.map((product, index) => (
                              <li
                                key={index}
                                className={`dropdown-item ${
                                  selectedBowProduct?.id === product.id
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => {
                                  setSelectedBowProduct(product);
                                  setActiveDropdown(null);
                                  setSelectedBowSize("");
                                }}
                              >
                                <img
                                  src={getProductImage(product)}
                                  alt={product.name}
                                  className="dropdown-item-image"
                                  onError={(e) => {
                                    e.target.src = "/Images/suit1.png";
                                  }}
                                />
                                <span className="dropdown-item-title">
                                  {truncateName(product.name, 25)}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="dropdown-item no-results">
                              No bows found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {selectedBowProduct && (
                    <div className="custom-select-wrapper size-select-wrapper">
                      <div
                        className="custom-select size-select"
                        onClick={() =>
                          setActiveSizeDropdown(
                            activeSizeDropdown === "bow-size"
                              ? null
                              : "bow-size",
                          )
                        }
                      >
                        <span className="selected-value">
                          {selectedBowSize || "Select Size"}
                        </span>
                        <i className="fa-solid fa-chevron-down"></i>
                      </div>

                      {activeSizeDropdown === "bow-size" && (
                        <ul className="custom-select-dropdown size-dropdown">
                          {bowAvailableSizes.length > 0 ? (
                            bowAvailableSizes.map((size, index) => (
                              <li
                                key={index}
                                className={
                                  selectedBowSize === size ? "active" : ""
                                }
                                onClick={() => {
                                  setSelectedBowSize(size);
                                  setActiveSizeDropdown(null);
                                }}
                              >
                                {size}
                              </li>
                            ))
                          ) : (
                            <li className="dropdown-item no-results">
                              No sizes available
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
              <h3 className="addon-section-heading">SHOES</h3>
              <div className="product-with-size">
                <div className="custom-select-wrapper product-select-wrapper">
                  <div
                    className="custom-select"
                    onClick={() => handleDropdownClick("shoes")}
                  >
                    {selectedShoesProduct ? (
                      <div className="selected-product-display">
                        <img
                          src={getProductImage(selectedShoesProduct)}
                          alt={selectedShoesProduct.name}
                          className="selected-product-image"
                          onError={(e) => {
                            e.target.src = "/Images/suit1.png";
                          }}
                        />
                        <span className="selected-product-title">
                          {truncateName(selectedShoesProduct.name)}
                        </span>
                      </div>
                    ) : (
                      <span className="selected-value">Select Shoes</span>
                    )}
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>

                  {activeDropdown === "shoes" && (
                    <div className="custom-select-dropdown searchable-dropdown">
                      <div className="search-box">
                        <i className="fa-solid fa-search search-icon"></i>
                        <input
                          type="text"
                          placeholder="Search shoes..."
                          value={shoesSearchTerm}
                          onChange={(e) => setShoesSearchTerm(e.target.value)}
                          className="dropdown-search-input"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      </div>
                      <ul className="dropdown-items-list">
                        {isLoading ? (
                          <li className="dropdown-item loading">Loading...</li>
                        ) : filteredShoesProducts.length > 0 ? (
                          filteredShoesProducts.map((product, index) => (
                            <li
                              key={index}
                              className={`dropdown-item ${
                                selectedShoesProduct?.id === product.id
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedShoesProduct(product);
                                setActiveDropdown(null);
                                setSelectedShoesSize("");
                              }}
                            >
                              <img
                                src={getProductImage(product)}
                                alt={product.name}
                                className="dropdown-item-image"
                                onError={(e) => {
                                  e.target.src = "/Images/suit1.png";
                                }}
                              />
                              <div className="dropdown-item-content">
                                <span className="dropdown-item-title">
                                  {truncateName(product.name, 25)}
                                </span>
                                <p className="dropdown-item-price">
                                  ${product.rent_price}
                                </p>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="dropdown-item no-results">
                            No shoes found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                {selectedShoesProduct && (
                  <div className="custom-select-wrapper size-select-wrapper">
                    <div
                      className="custom-select size-select"
                      onClick={() =>
                        setActiveSizeDropdown(
                          activeSizeDropdown === "shoes-size"
                            ? null
                            : "shoes-size",
                        )
                      }
                    >
                      <span className="selected-value">
                        {selectedShoesSize || "Select Size"}
                      </span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {activeSizeDropdown === "shoes-size" && (
                      <ul className="custom-select-dropdown size-dropdown">
                        {shoesAvailableSizes.length > 0 ? (
                          shoesAvailableSizes.map((size, index) => (
                            <li
                              key={index}
                              className={
                                selectedShoesSize?.toString() ===
                                size.toString()
                                  ? "active"
                                  : ""
                              }
                              onClick={() => {
                                setSelectedShoesSize(size);
                                setActiveSizeDropdown(null);
                              }}
                            >
                              {size}
                            </li>
                          ))
                        ) : (
                          <li className="dropdown-item no-results">
                            No sizes available
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div className="agreement-checkbox">
                <input
                  type="checkbox"
                  id="rentalAgreement"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);}}
                />
                <label htmlFor="rentalAgreement">
                  I agree to the terms, and I understand I need to return my
                  suit within X days.
                </label>
              </div>

              <div className="button-row">
                <button className="designBtn2" onClick={closeRentModal}>
                  Close
                </button>
                <button
                  className={`designBtn2 ${!isRentFormValid() ? "disabled" : ""}`}
                  onClick={handleConfirmRent}
                  disabled={!isRentFormValid() || isAddingToCart}
                  style={{
                    opacity: !isRentFormValid() ? 0.5 : 1,
                    cursor: !isRentFormValid() ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isAddingToCart ? "Adding..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoginModalOpen && (
          <div
            className={`rent-modal-overlay login-modal ${
              showLoginModal ? "fade-in" : "fade-out"
            }`}
            onClick={() => {
              setShowLoginModal(false);
              setTimeout(() => setIsLoginModalOpen(false), 300);
              document.body.style.overflow = "auto";
            }}
          >
            <div
              className={`rent-modal ${showLoginModal ? "modal-in" : "modal-out"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Login Required</h2>
              <p>Please login or register to continue with your purchase.</p>

              <div className="button-row">
                <button
                  className="designBtn2"
                  onClick={() => {
                    setShowLoginModal(false);
                    setTimeout(() => {
                      setIsLoginModalOpen(false);
                      document.body.style.overflow = "auto";
                    }, 300);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="designBtn2"
                  onClick={() => {
                    document.body.style.overflow = "auto";
                    localStorage.setItem(
                      "redirectAfterLogin",
                      window.location.pathname,
                    );
                    navigate("/login");
                  }}
                >
                  Login / Register
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
export default ProductDetail;