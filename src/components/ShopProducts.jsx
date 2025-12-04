import React from "react";

const ShopProducts = ({ selectedFilters }) => {
  const products = [
    { id: 1, name: "Blue Tuxedo Suit", buyPrice: "$300", rentPrice: "$50", img: "/Images/suit1.png", color: "Blue", category: "Suits", build: "Slim" },
    { id: 2, name: "Black Tuxedo Suit", buyPrice: "$250", rentPrice: "$45", img: "/Images/suit2.png", color: "Black", category: "Tuxedos", build: "Athletic" },
    { id: 3, name: "Blue Tuxedo Suit", buyPrice: "$320", rentPrice: "$55", img: "/Images/suit3.png", color: "Blue", category: "Jackets", build: "Regular" },
    { id: 4, name: "Black Tuxedo Suit", buyPrice: "$280", rentPrice: "$50", img: "/Images/suit4.png", color: "Black", category: "Suits", build: "Skinny" },
  ];

  // FILTERING LOGIC
  const filteredProducts = products.filter((product) => {
    const matchBuild =
      selectedFilters["build-type"].length === 0 ||
      selectedFilters["build-type"].includes(product.build);

    const matchCategory =
      selectedFilters.category.length === 0 ||
      selectedFilters.category.includes(product.category);

    const matchColor =
      selectedFilters.color.length === 0 ||
      selectedFilters.color.includes(product.color);

    const matchRentBuy = true; // Optional price filter you will add later

    return matchBuild && matchCategory && matchColor && matchRentBuy;
  });

  return (
    <div className="products-grid">
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.img} alt={product.name} />
            <div className="product-content">
              <h5>{product.name}</h5>
              <div className="product-price">
                <p className="text">Starting At</p>
                <div className="price">
                  <span>Buy: {product.buyPrice}</span>{" "}
                  <span>Rent: {product.rentPrice}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ShopProducts;