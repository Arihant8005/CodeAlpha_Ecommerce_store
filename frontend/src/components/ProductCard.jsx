function ProductCard({ product, onAddToCart }) {
    return (
        <div className="product-card">

            <div className="product-image-container">

                <span className="product-badge">
                    NEW
                </span>

                <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                        e.target.style.display = "none";

                        e.target.parentElement.classList.add(
                            "image-fallback"
                        );

                        e.target.parentElement.innerHTML =
                            "🛍️";
                    }}
                />
            </div>

            <div className="product-info">

                <span className="product-category">
                    ELECTRONICS
                </span>

                <h3>{product.name}</h3>

                <p className="product-description">
                    {product.description}
                </p>

                <div className="product-bottom">

                    <div className="product-price">
                        ₹
                        {product.price.toLocaleString(
                            "en-IN"
                        )}
                    </div>

                    <button
                        className="add-button"
                        onClick={() =>
                            onAddToCart(product)
                        }
                    >
                        + Add
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ProductCard;