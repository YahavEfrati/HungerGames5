/**
 * User Registration Service.
 * Handles the creation of a new user, including file uploads for the profile picture.
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Helper function to convert a physical File object into a Base64 encoded string.
 * @param {File} file - The image file selected by the user.
 * @returns {Promise<string>} A promise that resolves with the Base64 string.
 */
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // Start reading the file as a Data URL (Base64)
        reader.readAsDataURL(file);
        // When the reading is complete, resolve the promise with the result
        reader.onload = () => resolve(reader.result);
        // If there's an error during reading, reject the promise with the error
        reader.onerror = (error) => reject(error);
    });
};


/**
 * Sends user registration data to the server using a standard JSON payload.
 * @param {Object} userData - An object containing user details.
 * @param {File} imageFile - The profile picture file selected by the user.
 * @returns {Promise<Object>} The server response.
 * @throws {Error} If registration fails.
 */
export const registerUser = async (userData, imageFile) => {
    let base64Picture = null;

    // Convert the image file to Base64.
    base64Picture = await convertFileToBase64(imageFile);

    // Build a standard JavaScript object
    const payload = {
        username: userData.username,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
        addressX: parseFloat(userData.addressX),
        addressY: parseFloat(userData.addressY),
        role: userData.role || 'user', // Use the provided role or default to 'user'
        picture: base64Picture
    };

    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
    }

    return await response.json();
};