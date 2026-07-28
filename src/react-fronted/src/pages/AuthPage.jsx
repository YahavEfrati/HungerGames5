import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import './AuthPage.css';

/**
 * AuthPage Component.
 * Acts as a single container for both Login and Register views.
 * Facilitates smooth sliding and fading transitions between forms.
 * Dynamically measures and transitions its own height and width to prevent layout jumps.
 */
const AuthPage = () => {
    const location = useLocation();
    const isRegister = location.pathname === '/register';

    const [height, setHeight] = useState(0);
    const loginRef = useRef(null);
    const registerRef = useRef(null);

    // Synchronously measure the initial height before browser paints to prevent flash
    useLayoutEffect(() => {
        const activeElement = isRegister ? registerRef.current : loginRef.current;
        if (activeElement) {
            setHeight(activeElement.offsetHeight);
        }
    }, [isRegister]);

    // Asynchronously monitor height changes (e.g. error alerts, preview uploads, screen size changes)
    useEffect(() => {
        const activeElement = isRegister ? registerRef.current : loginRef.current;
        if (!activeElement) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setHeight(entry.target.offsetHeight);
            }
        });

        resizeObserver.observe(activeElement);
        return () => resizeObserver.disconnect();
    }, [isRegister]);

    return (
        <div className="page-wrapper-loginAndRegister">
            <div 
                className={`auth-container ${isRegister ? 'show-register' : 'show-login'}`}
                style={{ height: height ? `${height}px` : 'auto' }}
            >
                {/* Login Form Wrapper */}
                <div ref={loginRef} className={`auth-form-box ${isRegister ? 'inactive' : 'active'}`}>
                    <LoginPage />
                </div>

                {/* Register Form Wrapper */}
                <div ref={registerRef} className={`auth-form-box ${isRegister ? 'active' : 'inactive'}`}>
                    <RegisterPage />
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
