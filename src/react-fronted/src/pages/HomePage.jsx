import React, { useState, useEffect, useContext } from 'react';
import RestaurantCarousel from '../components/RestaurantCarousel';
import RestaurantCard from '../components/RestaurantCard';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoriesCarousel from '../components/CategoriesCarousel';
import { AuthContext } from '../context/AuthContext';
import AddRestaurantModal from '../components/AddRestaurantModal';
import './HomePage.css';



function HomePage() {
  const [nearYouRestaurants, setNearYouRestaurants] = useState([]);
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  const [ownerRestaurants, setOwnerRestaurants] = useState([]);
  const [hasLocation, setHasLocation] = useState(false);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Manage separate loading states for each section to ensure a smooth experience
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const [loadingNearYou, setLoadingNearYou] = useState(true);
  const [loadingOwner, setLoadingOwner] = useState(true);
  
  const navigate = useNavigate(); 
  const location = useLocation();
  const { currentLocation, currentUser } = useContext(AuthContext);

  const isOwner = currentUser?.role === 'restaurant_owner';

  // Listen for reset trigger from Navbar logo clicks
  useEffect(() => {
    if (location.state?.resetTrigger) {
      setSelectedCategory(null);
    }
  }, [location.state?.resetTrigger]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setLoadingTopRated(true);
        const urlTopRated = `${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/restaurants?sort=topRated`;
        const resTopRated = await fetch(urlTopRated, { 
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        const dataTopRated = await resTopRated.json();
        setTopRatedRestaurants(dataTopRated);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTopRated(false);
      }
    };

    const fetchOwnerRestaurants = async () => {
      if (!isOwner) {
          setLoadingOwner(false);
          return;
      }
      try {
        setLoadingOwner(true);
        // Fetch ALL restaurants without sort limit, then filter by owner
        const urlAll = `http://localhost:3000/api/restaurants`;
        const resAll = await fetch(urlAll, { 
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        const dataAll = await resAll.json();
        const myRestaurants = dataAll.filter(r => r.ownerId === currentUser.id);
        setOwnerRestaurants(myRestaurants);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOwner(false);
      }
    };

    fetchTopRated();
    fetchOwnerRestaurants();
  }, [isOwner, currentUser?.id]);

  // Effect that fetches nearby restaurants - runs and reacts exclusively to location changes
  useEffect(() => {
    const fetchNearYou = async () => {
      const lat = currentLocation?.addressX ?? currentLocation?.lat;
      const lng = currentLocation?.addressY ?? currentLocation?.lng;

      // If there is no location in the context, reset and stop immediately
      if (lat === undefined || lng === undefined || lat === null || lng === null) {
        setHasLocation(false);
        setNearYouRestaurants([]);
        setLoadingNearYou(false);
        return;
      }

      try {
        setLoadingNearYou(true);
        setHasLocation(true);
        const urlNear = `${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/restaurants?sort=nearby&lat=${lat}&lng=${lng}`;
        
        const resNear = await fetch(urlNear, { 
          method: 'GET', 
          headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
          } 
        });

        const dataNear = await resNear.json();
        setNearYouRestaurants(dataNear);
      } catch (error) {
        console.error("Failed to fetch near you restaurants:", error);
      } finally {
        setLoadingNearYou(false);
      }
    };

    fetchNearYou();
  }, [currentLocation]); // Runs only when currentLocation changes

  const handleCategoryClick = (categoryName) => {
    if (categoryName) {
      setSelectedCategory(prev => prev === categoryName ? null : categoryName);
    }
  };

  // The page is considered in initial loading only if both sections are still loading
  const isInitialLoading = loadingTopRated && loadingNearYou;

  // Determine the base array to filter from.
  // If location is provided and nearby restaurants exist, use them. Otherwise, fall back to top rated restaurants.
  const baseRestaurants = (hasLocation && nearYouRestaurants.length > 0) ? nearYouRestaurants : topRatedRestaurants;
  
  // Safely filter the base array handling both arrays of strings and legacy comma-separated strings
  const filteredRestaurants = selectedCategory 
    ? baseRestaurants.filter(r => {
        if (!r.categories) return false;
        
        if (Array.isArray(r.categories)) {
            return r.categories.some(c => 
                (typeof c === 'string' ? c : (c.name || '')).toLowerCase() === selectedCategory.toLowerCase()
            );
        }
        
        if (typeof r.categories === 'string') {
            return r.categories.toLowerCase().includes(selectedCategory.toLowerCase());
        }
        
        return false;
      })
    : [];

  if (isOwner) {
    return (
      <>
        <div className="container mt-5 pt-5">
            <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4" style={{ backgroundColor: 'var(--wolt-disabled-bg)' }}>
                <div>
                    <h3 className="fw-bold mb-1">My Restaurants</h3>
                    <p className="--wolt-text-secondary">Manage your restaurant locations</p>
                </div>
                <button 
                    className="wolt-btn-primary rounded-pill px-4 py-2 fw-bold"
                    onClick={() => setShowAddRestaurant(true)}
                >
                    + Add Restaurant
                </button>
            </div>
            
            <AddRestaurantModal 
                show={showAddRestaurant}
                onHide={() => setShowAddRestaurant(false)}
                onRestaurantAdded={(newRest) => {
                    setOwnerRestaurants(prev => [newRest, ...prev]);
                }}
            />

            {loadingOwner ? (
                <div className="text-center mt-5 opacity-75">Loading your restaurants...</div>
            ) : ownerRestaurants.length > 0 ? (
                <div className="row g-4">
                    {ownerRestaurants.map((restaurant) => (
                        <div className="col-12 col-md-6 col-lg-4" key={`owner-${restaurant.id}`}>
                            <RestaurantCard {...restaurant} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-5 py-5 rounded-4" style={{ backgroundColor: 'var(--wolt-disabled-bg)' }}>
                    <h4 className="--wolt-text-primary">No restaurants yet!</h4>
                    <p className="--wolt-text-secondary">Click the button above to add your first restaurant.</p>
                </div>
            )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mt-5 pt-5">
        
        <CategoriesCarousel 
          categories={categories}
          onCategorySelect={handleCategoryClick} 
        />
        
        {isInitialLoading ? (
          <div className="text-center mt-5 opacity-75">Loading restaurants...</div>
        ) : selectedCategory ? (
            <div className="mt-4">
                <h3 className="fw-bold mb-4">Restaurants for "{selectedCategory}"</h3>
                <div className="row g-4">
                    {filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map(restaurant => (
                            <div className="col-12 col-md-6 col-lg-4" key={`filtered-${restaurant.id}`}>
                                <RestaurantCard {...restaurant} />
                            </div>
                        ))
                    ) : (
                        <div className="--wolt-text-secondary">No restaurants found in this category.</div>
                    )}
                </div>
            </div>
        ) : (
          <div className="d-flex flex-column gap-5 mt-4">
            
            {/* Nearby restaurants carousel - affected by its loading state and location existence */}
            {loadingNearYou ? (
              <div className="small opacity-75">Updating nearby restaurants...</div>
            ) : (
              hasLocation && nearYouRestaurants.length > 0 && (
                <RestaurantCarousel 
                  title="Dinner near you"
                  onSeeAllClick={() => navigate('/see-all/near-you')}
                >
                  {nearYouRestaurants.map((restaurant) => (
                    <RestaurantCard key={`near-${restaurant.id}`} {...restaurant} />
                  ))}
                </RestaurantCarousel>
              )
            )}

            {/* Top rated carousel - stable and won't refresh unnecessarily */}
            {topRatedRestaurants.length > 0 && (
              <RestaurantCarousel 
                title="Top Rated Restaurants ⭐"  
                onSeeAllClick={() => navigate('/see-all/top-rated')}
              >
                {topRatedRestaurants.map((restaurant) => (
                  <RestaurantCard key={`top-${restaurant.id}`} {...restaurant} />
                ))}
              </RestaurantCarousel>
            )}

            {/* All Restaurants */}
            {topRatedRestaurants.length > 0 && (
              <RestaurantCarousel 
                title="All Restaurants 🍔"  
                onSeeAllClick={() => navigate('/see-all/all')}
              >
                {/* Randomize or just show all in reverse order so new ones appear first */}
                {[...topRatedRestaurants].reverse().map((restaurant) => (
                  <RestaurantCard key={`all-${restaurant.id}`} {...restaurant} />
                ))}
              </RestaurantCarousel>
            )}
            
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
