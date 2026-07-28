import { useRef, useState, useEffect } from 'react';

// Props: 'children' expects a function (Render Prop pattern), 'dependency' triggers state recalculation (e.g., when dynamic items load)
export default function CarouselWrapper({ children, dependency }) {
  
  // Reference to the underlying scrollable HTML container
  const carouselRef = useRef(null);
  
  // Navigation visibility states based on scroll position
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Computes whether the scroll arrows should be visible or hidden
  const updateArrowStates = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      
      // Show left arrow if scrolled more than 2px away from the start
      setCanScrollLeft(scrollLeft > 2);
      
      // Show right arrow if there is more content left to scroll (using 2px buffer for rounding issues)
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
    }
  };

  // Handles smooth horizontal scrolling animation (scrolls 75% of container width per click)
  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      if (direction === 'left') {
        carouselRef.current.scrollLeft -= scrollAmount;
      } else {
        carouselRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  // Binds event listeners for scroll/resize, re-runs when dependency updates
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateArrowStates);
      updateArrowStates(); // Run initial check
      window.addEventListener('resize', updateArrowStates);
    }
    
    // Cleanup listeners on component unmount
    return () => {
      if (carousel) carousel.removeEventListener('scroll', updateArrowStates);
      window.removeEventListener('resize', updateArrowStates);
    };
  }, [dependency]);

  // Uses Render Props pattern to pass state and handlers down to UI components
  return children({
    carouselRef,
    canScrollLeft,
    canScrollRight,
    scroll
  });
}