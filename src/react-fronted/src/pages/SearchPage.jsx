import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import ProductCard from '../components/ProductCard';

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameter from the URL (?query=...)
  const query = new URLSearchParams(location.search).get('query') || '';
  const [searchResults, setSearchResults] = useState({ restaurants: [], products: [] });
  const [loading, setLoading] = useState(true);

  // Runs every time the user updates the search query parameter in the URL
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const savedLocation = localStorage.getItem('current_location');
        let backendUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/search/${encodeURIComponent(query)}`;
        if (savedLocation) {
          try {
            const { addressX, addressY } = JSON.parse(savedLocation);
            backendUrl += `?lat=${addressX}&lng=${addressY}`;
          } catch (e) {
            console.error("Failed to parse current_location:", e);
          }
        }

        const response = await fetch(backendUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        setSearchResults(data); // Expects payload object layout: { restaurants: [...], products: [...] }
        setLoading(false);
      } catch (error) {
        console.error("Search API failed:", error);
        setSearchResults({ restaurants: [], products: [] });
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setSearchResults({ restaurants: [], products: [] });
      setLoading(false);
    }
  }, [query]);

  // UI Component Mapping: Renders 4 columns per row on large desktop displays (col-lg-3)
  const restaurantGridItems = searchResults.restaurants.map((restaurant, index) => {
    const { distance, ...restaurantWithoutDistance } = restaurant;
    return (
      <div className="col-12 col-md-6 col-lg-3" key={`res-${index}`}>
        <RestaurantCard {...restaurantWithoutDistance} />
      </div>
    );
  });

  // UI Component Mapping: Renders 2 columns per row for specialized product cards (col-md-6)
  const productGridItems = searchResults.products.map((product, index) => (
    <div className="col-12 col-md-6" key={`prod-${index}`}>
      <div className="search-product-wrapper mb-3">
        {product.restaurantName && (
          <div className="search-product-restaurant-label mb-2 px-1">
            <span className="small" style={{ color: 'var(--text-secondary)' }}>Offered by: </span>
            <Link 
              to={`/restaurant/${product.restaurantId}`} 
              className="text-info fw-bold text-decoration-none small"
            >
              {product.restaurantName}
            </Link>
          </div>
        )}
        <ProductCard 
          product={product} 
          onClick={() => navigate(`/restaurant/${product.restaurantId}`)} 
        />
      </div>
    </div>
  ));

  return (
    <div className="container mt-5 pt-5 text-start" style={{ direction: 'ltr' }}>
      <h2 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>Search results for: "{query}"</h2>

      {loading ? (
        <div className="text-center py-5" style={{ color: 'var(--text-primary)' }}>Searching Wolt...</div>
      ) : (
        <div>
          {/* --- RESTAURANTS RESULTS DISPLAY --- */}
          <h3 className="fw-bold fs-4 mb-3 mt-4" style={{ color: 'var(--text-primary)' }}>Restaurants</h3>
          {searchResults.restaurants.length > 0 ? (
            <div className="row g-4">{restaurantGridItems}</div>
          ) : (
            <p className="small" style={{ color: 'var(--text-secondary)' }}>No restaurants found matching your search.</p>
          )}

          {/* Section Divider Line */}
          <hr className="border-secondary my-5" style={{ opacity: 0.2 }} />

          {/* --- DISHES & PRODUCTS RESULTS DISPLAY --- */}
          <h3 className="fw-bold fs-4 mb-3" style={{ color: 'var(--text-primary)' }}>Dishes & Products</h3>
          {searchResults.products.length > 0 ? (
            <div className="row g-3">{productGridItems}</div>
          ) : (
            <p className="small" style={{ color: 'var(--text-secondary)' }}>No dishes found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;