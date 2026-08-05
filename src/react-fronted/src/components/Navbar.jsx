import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Form, Button, Dropdown } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import GlobalCartDrawer from './GlobalCartDrawer';
import { getEntityId } from '../utils/idUtils';
import './Navbar.css';

/**
 * Navbar Component.
 * Implements a split Left, Center, and Right layout using Flexbox and React-Bootstrap.
 */
function Navbar() {
  const { currentUser, logout, currentLocation, setCurrentLocation } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Local state holding the live input value from the search bar
  const [typedQuery, setTypedQuery] = useState('');

  // Live search result states
  const [searchResults, setSearchResults] = useState({ restaurants: [], products: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [isGlobalCartOpen, setIsGlobalCartOpen] = useState(false);

  // Modal states for updating location coordinates
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempLat, setTempLat] = useState('');
  const [tempLng, setTempLng] = useState('');

  // Dynamically determine login status
  const isLoggedIn = !!currentUser;

  // Live search API call with 300ms debounce
  useEffect(() => {
    if (!typedQuery.trim()) {
      setSearchResults({ restaurants: [], products: [] });
      setLoadingResults(false);
      return;
    }

    setLoadingResults(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/search/${encodeURIComponent(typedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          setSearchResults({ restaurants: [], products: [] });
        }
      } catch (err) {
        console.error("Live search fetch error:", err);
        setSearchResults({ restaurants: [], products: [] });
      } finally {
        setLoadingResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [typedQuery]);

  // Intercepts search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typedQuery.trim()) {
      setShowDropdown(false);
      navigate(`/search?query=${encodeURIComponent(typedQuery)}`);
    }
  };

  // Handles Enter key press directly on the input field
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (typedQuery.trim()) {
        setShowDropdown(false);
        navigate(`/search?query=${encodeURIComponent(typedQuery)}`);
      }
    }
  };

  // Closes the search dropdown and backdrop overlay
  const handleCloseSearch = () => {
    setShowDropdown(false);
  };

  // Handles live result click navigation
  const handleItemClick = (targetUrl) => {
    setShowDropdown(false);
    navigate(targetUrl);
  };

  // Handles user logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Safe display formatter for current delivery location coordinates
  const getDisplayLocation = () => {
    if (!currentLocation) return 'Set Location';
    const x = currentLocation.addressX ?? currentLocation.lat;
    const y = currentLocation.addressY ?? currentLocation.lng;
    if (x === undefined || y === undefined || x === null || y === null) return 'Set Location';
    return `${Number(x).toFixed(2)}, ${Number(y).toFixed(2)}`;
  };

  // Opens location modification modal pre-filled with current location values
  const handleOpenModal = () => {
    const x = currentLocation ? (currentLocation.addressX ?? currentLocation.lat ?? '') : '';
    const y = currentLocation ? (currentLocation.addressY ?? currentLocation.lng ?? '') : '';
    setTempLat(String(x));
    setTempLng(String(y));
    setIsLocationModalOpen(true);
  };

  // Handles updating the location coordinates
  const handleSaveLocation = (e) => {
    e.preventDefault();
    if (tempLat && tempLng) {
      const newLocation = { 
        addressX: parseFloat(tempLat), 
        addressY: parseFloat(tempLng) 
      };
      setCurrentLocation(newLocation);
      setIsLocationModalOpen(false);
      
      // Dispatch a custom event to notify other components of the location change
      window.dispatchEvent(new Event('locationChanged'));
    }
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark bg-wolt-secondary shadow-sm py-2 fixed-top"
      style={{ zIndex: showDropdown && typedQuery.trim() !== '' ? 1060 : 1030 }}
    >
      {showDropdown && typedQuery.trim() !== '' && (
        <div className="search-backdrop" onClick={handleCloseSearch} />
      )}

      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* --- LEFT SIDE: Brand Logo, Cart Button, Set Location Button --- */}
        <div className="d-flex align-items-center gap-3">
          {/* Logo redirecting to the Home page and resetting filters */}
          <a 
            className="navbar-brand fw-bold fs-4 mb-0 wolt-navbar-brand" 
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/', { state: { resetTrigger: Date.now() } });
            }}
            style={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            HungerGames
          </a>
          
          {/* Visual Shopping Cart Button - Hidden for Restaurant Owners */}
          {(!currentUser || currentUser.role !== 'restaurant_owner') && (
            <>
              <button 
                type="button" 
                className="btn d-flex align-items-center justify-content-center"
                onClick={() => setIsGlobalCartOpen(true)}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-input)',
                  border: 'none',
                  fontSize: '1.2rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1
                }}
                title="Shopping Cart"
              >
                🛍️
              </button>
              
              <GlobalCartDrawer show={isGlobalCartOpen} onHide={() => setIsGlobalCartOpen(false)} />
            </>
          )}

          {/* Set Location / Display Location */}
          <button 
            type="button"
            className="btn btn-link text-decoration-none small p-0 d-flex align-items-center gap-1 wolt-navbar-link"
            onClick={handleOpenModal}
            style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}
          >
            📍 {getDisplayLocation()}
          </button>
        </div>
        
        {/* --- CENTER SIDE: Central Search Bar --- */}
        <div className="d-flex justify-content-center flex-grow-1 mx-4 custom-search-container" style={{ maxWidth: '450px' }}>
          <form onSubmit={handleSubmit} className="w-100" role="search">
            <div className="input-group custom-search-group">
              <span 
                className="input-group-text border-0 pe-0 shadow-none wolt-navbar-link" 
                style={{ 
                  borderRadius: '20px 0 0 20px', 
                  backgroundColor: 'var(--bg-input)',
                  fontSize: '1.1rem'
                }}
              >
                🔍︎
              </span>
              <input 
                className="form-control border-0 ps-2"
                type="search" 
                placeholder="Search in HungerGames..." 
                aria-label="Search"
                style={{ 
                  borderRadius: '0 20px 20px 0',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)'
                }}
                value={typedQuery}
                onChange={(e) => {
                  setTypedQuery(e.target.value);
                  if (e.target.value.trim() !== '') {
                    setShowDropdown(true);
                  } else {
                    setShowDropdown(false);
                  }
                }}
                onFocus={() => {
                  if (typedQuery.trim() !== '') {
                    setShowDropdown(true);
                  }
                }}
                onKeyDown={handleKeyDown}
              />
            </div>
          </form>

          {/* Search Dropdown */}
          {showDropdown && typedQuery.trim() !== '' && (
            <div className="search-dropdown-menu" style={{ backgroundColor: 'var(--bg-dropdown)' }}>
              {loadingResults ? (
                <div className="search-dropdown-loading">
                  <span className="spinner-border spinner-border-sm text-light me-2" role="status" />
                  Searching...
                </div>
              ) : (
                <>
                  {/* Restaurants Section */}
                  <div className="search-dropdown-section">
                    <div className="search-dropdown-section-title" style={{ color: 'var(--text-secondary)' }}>Restaurants</div>
                    {searchResults.restaurants.length > 0 ? (
                      searchResults.restaurants.slice(0, 5).map((restaurant) => {
                        const restaurantId = getEntityId(restaurant);
                        return (
                        <div 
                          key={restaurantId} 
                          className="search-dropdown-item"
                          onClick={() => handleItemClick(`/restaurant/${restaurantId}`)}
                        >
                          <div className="search-item-info">
                            <div className="search-item-name" style={{ color: 'var(--text-primary)' }}>{restaurant.name}</div>
                            <div className="search-item-desc" style={{ color: 'var(--text-secondary)' }}>{restaurant.description}</div>
                          </div>
                        </div>
                        );
                      })
                    ) : (
                      <div className="search-dropdown-empty" style={{ color: 'var(--text-secondary)' }}>No matching restaurants</div>
                    )}
                  </div>
                  
                  {/* Products Section */}
                  <div className="search-dropdown-section">
                    <div className="search-dropdown-section-title" style={{ color: 'var(--text-secondary)' }}>Dishes & Products</div>
                    {searchResults.products.length > 0 ? (
                      searchResults.products.slice(0, 5).map((product) => {
                        const productId = getEntityId(product);
                        return (
                        <div 
                          key={productId} 
                          className="search-dropdown-item"
                          onClick={() => handleItemClick(`/restaurant/${product.restaurantId}`)}
                        >
                          <div className="search-item-info">
                            <div className="search-item-name" style={{ color: 'var(--text-primary)' }}>{product.name}</div>
                            <div className="search-item-desc" style={{ color: 'var(--text-secondary)' }}>
                              In {product.restaurantName} • ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
                            </div>
                          </div>
                        </div>
                        );
                      })
                    ) : (
                      <div className="search-dropdown-empty" style={{ color: 'var(--text-secondary)' }}>No matching products</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* --- RIGHT SIDE: Theme Toggle, Auth Actions, and User Info --- */}
        <div className="d-flex align-items-center gap-3">
          
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="btn d-flex align-items-center justify-content-center"
            onClick={toggleTheme}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-input)',
              border: 'none',
              fontSize: '1.2rem',
              color: 'var(--text-primary)',
              lineHeight: 1,
              transition: 'background-color 0.2s'
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isLoggedIn ? (
            <Dropdown align="end">
              <Dropdown.Toggle 
                as="div"
                className = "d-flex align-items-center gap-2 border-0 bg-transparent"
                style={{ cursor: 'pointer' }}
              > 
                  {/* Circular profile picture */}
                  <img 
                    src={currentUser.picture || 'default.png'} 
                    alt="Profile" 
                    className="rounded-circle"
                    style={{ width: '36px', height: '36px', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                  />
                  <span className="fw-semibold wolt-navbar-text">
                    Welcome {currentUser.name}
                  </span>
              </Dropdown.Toggle>

              {/* Dropdown menu for user actions */}
              <Dropdown.Menu 
                  className="shadow border-0 mt-2"
                  style={{ backgroundColor: 'var(--bg-dropdown)', color: 'var(--text-primary)' }}
                  >
                <Dropdown.Item 
                  onClick={() => navigate('/profile')} 
                  style={{ color: 'var(--text-primary)' }}
                >
                  👤 My Profile
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => navigate('/past-orders')} 
                  style={{ color: 'var(--text-primary)' }}
                >
                  🛍️ Order History
                </Dropdown.Item>
                <Dropdown.Divider style={{ borderColor: 'var(--border-color)' }} />
                <Dropdown.Item 
                  onClick={handleLogout} 
                  className="text-danger fw-semibold"
                >
                  🚪 Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <Link 
                className="btn bg-wolt-secondary fw-semibold px-3 border-0" 
                style={{ borderRadius: '20px', color: 'var(--text-primary)' }} 
                to="/login"
              >
                Login
              </Link>
              <Link 
                className="btn fw-semibold px-3" 
                style={{ borderRadius: '20px', backgroundColor: 'var(--bg-input)', borderColor: 'transparent', color: 'var(--text-primary)' }} 
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>

      {/* --- REACT-BOOTSTRAP LOCATION SELECTION MODAL --- */}
      <Modal 
        show={isLocationModalOpen} 
        onHide={() => setIsLocationModalOpen(false)} 
        centered
        contentClassName="bg-wolt-secondary border-0 shadow-lg"
        style={{ color: 'var(--text-primary)' }}
      >
        <Modal.Header closeButton closeVariant={theme === 'dark' ? 'white' : undefined} className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-5">Change Delivery Location</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form onSubmit={handleSaveLocation}>
            <Form.Group className="mb-3" controlId="modalAddressX">
              <Form.Label className="small wolt-form-label">Latitude (X)</Form.Label>
              <Form.Control 
                type="number" 
                step="any"
                className="login-dark-input"
                style={{ backgroundColor: 'var(--bg-input)', border: 'none', color: 'var(--text-primary)' }}
                value={tempLat} 
                onChange={(e) => setTempLat(e.target.value)} 
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="modalAddressY">
              <Form.Label className="small wolt-form-label">Longitude (Y)</Form.Label>
              <Form.Control 
                type="number" 
                step="any"
                className="login-dark-input"
                style={{ backgroundColor: 'var(--bg-input)', border: 'none', color: 'var(--text-primary)' }}
                value={tempLng} 
                onChange={(e) => setTempLng(e.target.value)} 
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                variant="link" 
                className="text-decoration-none p-0 me-3" 
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setIsLocationModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn btn-light fw-bold px-4" 
                style={{ borderRadius: '20px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-main)', border: 'none' }}
              >
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </nav>
  );
}

export default Navbar;