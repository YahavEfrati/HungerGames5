import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * RestaurantCard Component
 * Displays individual restaurant overview with image, info text, distance and rating.
 * Includes a smooth hover scaling animation that pops above adjacent container layers.
 */
function RestaurantCard({ id, name, description, distance, rating, image }) {
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        navigate(`/restaurant/${id}`);
    };

    return (
        /* Card Root - Dynamic layering using zIndex on hover to prevent clipping 
           by sibling layout containers or scroll tracks.
        */
        <div 
            className="pe-auto"
            style={{ 
                width: '280px', 
                flexShrink: 0, 
                cursor: 'pointer',
                position: 'relative', // Mandatory for zIndex to take effect
                zIndex: 1,            // Base layer elevation
                transition: 'transform 0.2s ease-in-out, z-index 0.2s ease-in-out'
            }} 
            onClick={handleCardClick}
            // Elevates both the scale and the layer depth on mouse enter
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.zIndex = '10'; // Pops it to the top layer
            }}
            // Restores original scale and grid depth on mouse leave
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.zIndex = '1';  // Drops it back down
            }}
        >
            
            {/* Main Framework Wrapper */}
            <div className="card h-100 shadow-sm custom-card rounded-4 overflow-hidden border-0 bg-transparent">
                
                {/* Cover Imagery */}
                <div className="position-relative">
                    <img 
                        src={image}
                        className="card-img-top" 
                        alt={name}  
                        style={{ height: '140px', objectFit: 'cover'}}
                    />
                </div>

                {/* Content Frame (Wolt dark tint) */}
                <div className="card-body p-3 d-flex flex-column justify-content-between text-white bg-wolt-secondary">
                    
                    {/* Top Row: Info vs Badge */}
                    <div className="d-flex justify-content-between align-items-start mb-2 w-100">
                        
                        {/* Texts - minWidth: 0 is mandatory to allow text-truncate to work inside flex */}
                        <div className="flex-grow-1 pe-2" style={{ textAlign: 'left', minWidth: 0 }}>
                            <h6 className="card-title fw-bold text-white mb-1 text-truncate" title={name}>{name}</h6>
                            <p className="card-text small mb-0 text-truncate" title={name} style={{ opacity: 0.8 }}>{description}</p>
                        </div>
                        
                        {/* Distance Metric Badge */}
                        {distance && (
                            <div className="d-flex flex-column align-items-center justify-content-center rounded-3 fw-bold p-2 text-center" 
                                style={{ 
                                    backgroundColor: '#293166',
                                    minWidth: '55px', 
                                    height: '55px',
                                    fontSize: '11px',
                                    flexShrink: 0
                                }}>
                                <span style={{ fontSize: '14px' }}>{distance}</span>
                                <span>km</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RestaurantCard;