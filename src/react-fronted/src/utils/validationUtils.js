/**
 * Centralized utility functions for validation across forms.
 */

/**
 * Checks if a value is strictly empty, undefined, null, or a blank string.
 * @param {any} val - The value to check.
 * @returns {boolean} - True if the value is empty.
 */
export const isEmpty = (val) => val === undefined || val === null || String(val).trim() === '';

/**
 * Checks if a string contains only numeric digits.
 * @param {string} phone - The phone string to check.
 * @returns {boolean} - True if it contains only digits.
 */
export const isPhoneValid = (phone) => {
    const phoneRegex = /^[0-9]+$/;
    return phoneRegex.test(phone);
};

/**
 * Validates if the password meets complexity requirements (min 8 chars, 1 letter, 1 number).
 * @param {string} pass - The password string.
 * @returns {boolean} - True if password is valid.
 */
export const isPasswordComplex = (pass) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(pass);
};
