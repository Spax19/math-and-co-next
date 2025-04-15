import { useState, useRef, useEffect } from 'react';

export const WineScroller = ({ featuredWines, setCart }) => {
  const [selectedWine, setSelectedWine] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const scrollerRef = useRef(null);

  const handleWineClick = (wine) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSelectedWine(wine);
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleCloseDetails = () => {
    setIsAnimating(true);
    setSelectedWine(null);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="mb-18 relative">
      <h2 className="text-3xl font-crimson-text mb-8">Featured Wines</h2>
      
      <div className="relative h-96 overflow-hidden">
        {/* Wine Cards Scroller */}
        <div 
          ref={scrollerRef}
          className="flex gap-8 absolute left-0 right-0 h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: selectedWine ? 'translateX(-33%)' : 'translateX(0)'
          }}
        >
          {featuredWines.map((wine) => (
            <div 
              key={wine.id}
              className={`w-64 h-80 flex-shrink-0 cursor-pointer transition-all duration-300 ${
                selectedWine ? (selectedWine.id === wine.id ? 'scale-110' : 'scale-90 opacity-70') : 'hover:scale-105'
              }`}
              onClick={() => handleWineClick(wine)}
            >
              <div className="h-full bg-[#f9f9f9] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={wine.image_url}
                  alt={`Bottle of ${wine.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      {selectedWine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button 
              onClick={handleCloseDetails}
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedWine.image_url}
                  alt={`Bottle of ${selectedWine.name}`}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-3xl font-crimson-text mb-4">{selectedWine.name}</h3>
                <p className="text-gray-600 mb-6">{selectedWine.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl">R{selectedWine.price}</span>
                  <button
                    className="bg-[#d4b26a] text-white px-6 py-3 rounded hover:bg-[#c4a25a]"
                    onClick={() => {
                      setCart([...cart, selectedWine]);
                      handleCloseDetails();
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Usage in your component:
// <WineScroller featuredWines={featuredWines} setCart={setCart} /><WineScroller featuredWines={featuredWines} setCart={setCart} />