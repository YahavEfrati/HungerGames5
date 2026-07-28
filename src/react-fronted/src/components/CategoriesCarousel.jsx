import React from 'react';
import CarouselWrapper from './CarouselWrapper';
import './CategoriesCarousel.css';

// Props: 'categories' is an array of objects ({ name, icon }), 'onCategorySelect' is a callback function to handle clicks
export default function CategoriesCarousel({ categories, onCategorySelect }) {
  return (
    <div className="categories-carousel-container">
      
      {/* Wraps the UI with scrolling logic; passes the categories array as a layout recalculation trigger */}
      <CarouselWrapper dependency={categories}>
        {({ carouselRef, canScrollLeft, canScrollRight, scroll }) => (
          <>
            <div className="categories-header-row">
              <h2>Browse by category</h2>
              
              {/* --- NAVIGATION ARROWS --- */}
              <div className="carousel-arrows-container">
                {/* Left Arrow Button: Disabled if canScrollLeft is false */}
                <button 
                  className={`wolt-arrow-btn ${!canScrollLeft ? 'wolt-btn-disabled' : ''}`} 
                  onClick={() => canScrollLeft && scroll('left')} 
                  disabled={!canScrollLeft}
                >
                  <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24" style={{ transform: 'rotate(180deg)' }}>
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>

                {/* Right Arrow Button: Disabled if canScrollRight is false */}
                <button 
                  className={`wolt-arrow-btn ${!canScrollRight ? 'wolt-btn-disabled' : ''}`} 
                  onClick={() => canScrollRight && scroll('right')} 
                  disabled={!canScrollRight}
                >
                  <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* --- SCROLLABLE TRACK CONTAINER --- */}
            <div 
              ref={carouselRef} // Binds this DOM node to the wrapper's useRef
              className="carousel-scroller-track"
              style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', scrollBehavior: 'smooth' }}
            >
              {/* Loops through categories to render individual actionable cards */}
              {categories.map((cat, index) => (
                <div 
                  key={index}
                  className="category-card-wrapper"
                  onClick={() => onCategorySelect(cat.name)} // Triggers navigation/filtering callback
                >

                  {/* 'index % 5' automatically cycles through CSS color classes (0 to 4) for visual variety */}
                  <div className={`category-square-box box-color-${index % 5}`}>
                    <span className="category-box-icon">{cat.icon}</span>
                  </div>
                  
                  {/* Category label displayed directly beneath the square icon box */}
                  <span className="category-card-name">{cat.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CarouselWrapper>

    </div>
  );
}