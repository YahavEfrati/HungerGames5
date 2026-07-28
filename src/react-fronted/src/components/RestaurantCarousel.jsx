import React from 'react';
import CarouselWrapper from './CarouselWrapper';
import './RestaurantCarousel.css';

// Component receives a title and generic "children" (the array of cards from parent)
function RestaurantCarousel({ title, children, onSeeAllClick }) {
  return (
    <div style={{ direction: 'ltr', textAlign: 'left' }} className="mb-5">
      <CarouselWrapper dependency={children}>
        {({ carouselRef, canScrollLeft, canScrollRight, scroll }) => (
          <>
            {/* --- HEADER CONTROLS (Title, See All & Wolt Arrows) --- */}
            <div className="d-flex justify-content-between align-items-center mb-4 w-100">
              <h1 className="fw-bold fs-3 m-0 text-white">{title}</h1>
              
              <div className="d-flex align-items-center gap-3">
                <button className="btn btn-link text-decoration-none fw-semibold p-0" style={{ color: '#009de0', fontSize: '15px' }} onClick={onSeeAllClick}>
                  See all
                </button>

                <div className="d-flex gap-2 position-relative" style={{ minHeight: '40px', minWidth: '90px' }}>
                  {/* Left Button */}
                  <button 
                    className={`wolt-btn-container ${!canScrollLeft ? 'wolt-btn-disabled' : ''}`} 
                    onClick={() => canScrollLeft && scroll('left')} 
                    disabled={!canScrollLeft}
                  >
                    <div className="cbc_IconButton_iconContainer_f04">
                      <svg fill="currentColor" role="presentation" width="16" height="16" viewBox="0 0 24 24" style={{ scale: '1.15', transform: 'rotate(180deg)' }}>
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                  </button>

                  {/* Right Button */}
                  <button 
                    className={`wolt-btn-container ${!canScrollRight ? 'wolt-btn-disabled' : ''}`} 
                    onClick={() => canScrollRight && scroll('right')} 
                    disabled={!canScrollRight}
                  >
                    <div className="cbc_IconButton_iconContainer_f04">
                      <svg fill="currentColor" role="presentation" width="16" height="16" viewBox="0 0 24 24" style={{ scale: '1.15' }}>
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* --- CAROUSEL TRACK TRACK --- */}
            <div 
              ref={carouselRef}
              className="d-flex flex-nowrap custom-carousel" 
              style={{ gap: '1rem', scrollBehavior: 'smooth', overflowX: 'auto', overflowY: 'visible', padding: '16px' }} 
            >
              {/* Renders the dynamic array of components passed from the parent view */}
              {children} 
            </div>
          </>
        )}
      </CarouselWrapper>
    </div>
  );
}

export default RestaurantCarousel;