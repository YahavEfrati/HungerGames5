import React from 'react';

/**
 * OrderTabControls Sub-component
 * Renders segmented tab buttons to toggle between Active and Past Orders with counters.
 */
function OrderTabControls({ activeTab, setActiveTab, activeCount, pastCount }) {
    return (
        <div className="orders-tabs">
            <button 
                className={`orders-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveTab('active')}
            >
                Active Orders ({activeCount})
            </button>
            <button 
                className={`orders-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveTab('past')}
            >
                Past Orders ({pastCount})
            </button>
        </div>
    );
}

export default OrderTabControls;
