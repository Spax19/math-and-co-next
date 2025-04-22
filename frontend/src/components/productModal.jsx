import { useState } from 'react';

const ProductModal = ({ product, onClose, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState('bottle'); // 'bottle' or 'case'

  // Default to 6 bottles per case if not specified
  const caseSize = product.case_size || 6;

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const calculateTotalPrice = () => {
    if (viewMode === 'case') {
      return (product.case_price * quantity).toFixed(2);
    }
    return (product.price * quantity).toFixed(2);
  };

  const handleAddToCart = () => {
    addToCart({ 
      ...product, 
      quantity: viewMode === 'case' ? quantity * caseSize : quantity,
      isCase: viewMode === 'case',
      unitPrice: viewMode === 'case' ? product.case_price : product.price,
      totalPrice: calculateTotalPrice()
    });
    onClose();
  };

  const currentImage = viewMode === 'case' ? product.case_image : product.image_url;
  const perBottlePrice = viewMode === 'case' ? (product.case_price / caseSize).toFixed(2) : product.price.toFixed(2);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
          
          <div className="flex flex-col md:flex-row">
            {/* Product Image - Stack on top on mobile */}
            <div className="w-full md:w-1/2 p-4 sm:p-6">
              <div className="overflow-hidden rounded-lg h-48 sm:h-64 md:h-96">
                <img
                  src={currentImage}
                  alt={`${viewMode === 'case' ? 'Case of' : 'Bottle of'} ${product.name}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-crimson-text mb-2">{product.name}</h2>
              
              {/* View Mode Toggle - Responsive sizing */}
              {product.case_price && product.case_image && (
                <div className="flex mb-3 sm:mb-4 border rounded-full overflow-hidden text-xs sm:text-sm">
                  <button
                    onClick={() => setViewMode('bottle')}
                    className={`py-1 sm:py-2 px-3 sm:px-4 flex-1 ${viewMode === 'bottle' ? 'bg-[#d4b26a] text-white' : 'bg-gray-100'}`}
                  >
                    Per Bottle
                  </button>
                  <button
                    onClick={() => setViewMode('case')}
                    className={`py-1 sm:py-2 px-3 sm:px-4 flex-1 ${viewMode === 'case' ? 'bg-[#d4b26a] text-white' : 'bg-gray-100'}`}
                  >
                    Per Case ({caseSize})
                  </button>
                </div>
              )}

              {/* Star Rating */}
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`${star <= product.rating ? 'fas fa-star' : 'far fa-star'} text-[#d4b26a] text-xs sm:text-sm`}
                  ></i>
                ))}
                <span className="ml-1 text-gray-600 text-xs">({product.rating})</span>
              </div>
              <p className="text-gray-500 text-xs mb-3 sm:mb-4">({product.reviews} reviews)</p>

              {/* Price Display - Responsive */}
              <div className="mb-4 sm:mb-6">
                <div className="text-lg sm:text-xl font-medium">
                  Total: R {calculateTotalPrice()}
                </div>
                <div className="text-sm text-gray-600">
                  {viewMode === 'case' ? (
                    <>
                      {quantity} case{quantity > 1 ? 's' : ''} × R {product.case_price.toFixed(2)}
                      <span className="block text-xs text-gray-500">
                        (R {perBottlePrice} per bottle)
                      </span>
                    </>
                  ) : (
                    <>
                      {quantity} bottle{quantity > 1 ? 's' : ''} × R {product.price.toFixed(2)}
                    </>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="mb-3 sm:mb-4">
                <h3 className="font-semibold text-sm sm:text-base mb-1">Origins:</h3>
                <p className="text-gray-600 text-sm sm:text-base">{product.origin || 'Western Cape, South Africa'}</p>
              </div>

              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold text-sm sm:text-base mb-1">Taste Profile:</h3>
                <p className="text-gray-600 text-sm sm:text-base">{product.description}</p>
              </div>

              {/* Quantity Selector - Responsive */}
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm sm:text-base">Quantity:</span>
                  <div className="flex items-center">
                    <button 
                      onClick={handleDecrement}
                      className="border px-2 sm:px-3 py-1 rounded-l hover:bg-gray-100 text-sm sm:text-base"
                    >
                      -
                    </button>
                    <span className="border-t border-b px-3 sm:px-4 py-1 text-sm sm:text-base">{quantity}</span>
                    <button 
                      onClick={handleIncrement}
                      className="border px-2 sm:px-3 py-1 rounded-r hover:bg-gray-100 text-sm sm:text-base"
                    >
                      +
                    </button>
                  </div>
                </div>
                {viewMode === 'case' && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Total bottles: {quantity * caseSize}
                  </p>
                )}
              </div>

              {/* Action Buttons - Stack vertically on small screens */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-[#d4b26a] text-white px-4 py-2 sm:py-3 rounded-full hover:bg-[#c4a25a] transition-colors duration-300 text-sm sm:text-base"
                >
                  ADD TO CART
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white px-4 py-2 sm:py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm sm:text-base"
                >
                  BUY IT NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;