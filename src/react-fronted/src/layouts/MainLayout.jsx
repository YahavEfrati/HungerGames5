import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * MainLayout serves as the global structural wrapper for the application.
 * It ensures shared components (like the Navbar) persist across different pages
 * without being re-rendered or duplicated.
 */
function MainLayout() {
  return (
    <>
      {/* Global Navbar element loaded exactly once for all sub-routed pages */}
      <Navbar />
      
      {/* The <Outlet /> acts as a dynamic placeholder/pipe. 
        React Router will inject the current matching child page component 
        (e.g., HomePage, SearchPage, SeeAllPage) right here.
      */}
      <Outlet />
    </>
  );
}

export default MainLayout;