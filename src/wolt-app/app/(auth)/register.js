import React, { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Modal,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/theme';
import { registerUser } from '../../services/userService';
import { getStyles } from '../../styles/register.styles';

/**
 * Mobile Registration Screen Component for Wolt App.
 * Enforces client-side validations simultaneously across all fields,
 * displays inline field errors, handles native image picking (camera & gallery),
 * and dispatches POST /api/users request matching backend Mongoose schema.
 */
export default function RegisterScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const styles = getStyles(colors);

    // Form Field States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [addressX, setAddressX] = useState('');
    const [addressY, setAddressY] = useState('');
    const [pictureBase64, setPictureBase64] = useState(null);
    const [pictureUri, setPictureUri] = useState(null);

    // UI & Validation States
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [submittingRole, setSubmittingRole] = useState(null);
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const [showPickerModal, setShowPickerModal] = useState(false);

    /**
     * Clears validation error for a specific field as soon as user types or modifies it.
     */
    const clearFieldError = (field) => {
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
        if (error) setError('');
    };

    /**
     * Validates if the password meets complexity criteria:
     * At least 8 characters long, containing uppercase, lowercase, and digits.
     */
    const isPasswordComplex = (pass) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(pass);
    };

    /**
     * Validates if phone contains only digits.
     */
    const isPhoneValid = (phoneNum) => {
        const phoneRegex = /^[0-9]+$/;
        return phoneRegex.test(phoneNum);
    };

    /**
     * Pick an image from the user's photo library.
     */
    const pickImageFromGallery = async () => {
        setShowPickerModal(false);
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Sorry, we need camera roll permissions to upload a profile picture.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setPictureUri(asset.uri);

                // Format Base64 string with Data URI scheme
                const mimeType = asset.mimeType || 'image/jpeg';
                const formattedBase64 = `data:${mimeType};base64,${asset.base64}`;
                setPictureBase64(formattedBase64);
                clearFieldError('picture');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to select image from gallery.');
        }
    };

    /**
     * Take a photo using the device camera.
     */
    const takePhotoWithCamera = async () => {
        setShowPickerModal(false);
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Sorry, we need camera permissions to take a profile picture.'
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setPictureUri(asset.uri);

                const mimeType = asset.mimeType || 'image/jpeg';
                const formattedBase64 = `data:${mimeType};base64,${asset.base64}`;
                setPictureBase64(formattedBase64);
                clearFieldError('picture');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to take photo with camera.');
        }
    };

    /**
     * Validates all form fields simultaneously and returns an errors object.
     */
    const validateForm = () => {
        const newErrors = {};

        if (!pictureBase64) {
            newErrors.picture = 'Profile picture is required.';
        }

        if (!username.trim()) {
            newErrors.username = 'Username is required.';
        }

        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (!isPasswordComplex(password)) {
            newErrors.password =
                'Password must be at least 8 characters long and contain uppercase, lowercase letters, and numbers.';
        }

        if (!verifyPassword) {
            newErrors.verifyPassword = 'Please verify your password.';
        } else if (password && verifyPassword !== password) {
            newErrors.verifyPassword = 'Passwords do not match.';
        }

        if (!name.trim()) {
            newErrors.name = 'Full name is required.';
        }

        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!isPhoneValid(phone.trim())) {
            newErrors.phone = 'Phone number must contain only digits.';
        }

        if (!addressX.trim()) {
            newErrors.addressX = 'Latitude is required.';
        } else if (isNaN(parseFloat(addressX))) {
            newErrors.addressX = 'Latitude (X) must be a valid number.';
        }

        if (!addressY.trim()) {
            newErrors.addressY = 'Longitude is required.';
        } else if (isNaN(parseFloat(addressY))) {
            newErrors.addressY = 'Longitude (Y) must be a valid number.';
        }

        return newErrors;
    };

    /**
     * Handles registration form submission.
     */
    const handleRegister = async (role) => {
        setError('');
        setSuccess('');

        // Perform simultaneous validation across all fields
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        setSubmittingRole(role);

        try {
            const userData = {
                username: username.trim(),
                password,
                name: name.trim(),
                phone: phone.trim(),
                addressX,
                addressY,
                role,
                picture: pictureBase64,
            };

            await registerUser(userData);

            setSuccess('Registration successful!');
            setLoading(false);
            setSubmittingRole(null);

            // Clear form
            setUsername('');
            setPassword('');
            setVerifyPassword('');
            setName('');
            setPhone('');
            setAddressX('');
            setAddressY('');
            setPictureUri(null);
            setPictureBase64(null);
            setErrors({});

            // Alert user and navigate
            Alert.alert(
                'Registration Successful',
                'Your account has been created. You can now log in.',
                [{ text: 'OK', onPress: () => router.replace('/') }]
            );
        } catch (err) {
            setLoading(false);
            setSubmittingRole(null);
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backButtonText}>‹ Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.appTitle}>HungerGames</Text>
                    <Text style={styles.screenTitle}>Register To HungerGames!</Text>
                </View>

                {/* Top Error Banner (for server/network errors) */}
                {error ? (
                    <View style={[styles.alertBanner, styles.errorBanner]}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Top Success Banner */}
                {success ? (
                    <View style={[styles.alertBanner, styles.successBanner]}>
                        <Text style={styles.successText}>{success}</Text>
                    </View>
                ) : null}

                {/* Profile Picture Upload Avatar */}
                <View style={styles.avatarSection}>
                    <Text style={styles.fieldLabel}>Profile Picture *</Text>
                    <TouchableOpacity
                        style={[
                            styles.avatarContainer,
                            errors.picture ? styles.inputError : null,
                        ]}
                        onPress={() => setShowPickerModal(true)}
                        activeOpacity={0.8}
                    >
                        {pictureUri ? (
                            <Image source={{ uri: pictureUri }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarIconText}>👤</Text>
                                <View style={styles.uploadBadge}>
                                    <Text style={styles.uploadBadgeText}>+</Text>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.avatarHint}>
                        {pictureUri ? 'Tap to change picture' : 'Tap to select picture'}
                    </Text>
                    {errors.picture ? (
                        <Text style={styles.fieldErrorText}>{errors.picture}</Text>
                    ) : null}
                </View>

                {/* Form Fields */}
                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Username *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            errors.username ? styles.inputError : null,
                        ]}
                        placeholder="Enter username"
                        placeholderTextColor={colors.inputPlaceholder}
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            clearFieldError('username');
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {errors.username ? (
                        <Text style={styles.fieldErrorText}>{errors.username}</Text>
                    ) : null}
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.labelRow}>
                        <Text style={styles.fieldLabel}>Password *</Text>
                        <TouchableOpacity
                            onPress={() => setShowPasswordRules(!showPasswordRules)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.infoIcon}>ⓘ Requirements</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Password rules box */}
                    {showPasswordRules && (
                        <View style={styles.popover}>
                            <Text style={styles.popoverHeader}>Password must include:</Text>
                            <Text style={styles.popoverItem}>• At least 8 characters</Text>
                            <Text style={styles.popoverItem}>• One uppercase letter</Text>
                            <Text style={styles.popoverItem}>• One lowercase letter</Text>
                            <Text style={styles.popoverItem}>• One number</Text>
                        </View>
                    )}

                    <TextInput
                        style={[
                            styles.input,
                            errors.password ? styles.inputError : null,
                        ]}
                        placeholder="Enter password"
                        placeholderTextColor={colors.inputPlaceholder}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            clearFieldError('password');
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    {errors.password ? (
                        <Text style={styles.fieldErrorText}>{errors.password}</Text>
                    ) : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Verify Password *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            errors.verifyPassword ? styles.inputError : null,
                        ]}
                        placeholder="Re-enter password"
                        placeholderTextColor={colors.inputPlaceholder}
                        value={verifyPassword}
                        onChangeText={(text) => {
                            setVerifyPassword(text);
                            clearFieldError('verifyPassword');
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    {errors.verifyPassword ? (
                        <Text style={styles.fieldErrorText}>{errors.verifyPassword}</Text>
                    ) : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Full Name *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            errors.name ? styles.inputError : null,
                        ]}
                        placeholder="Enter full name"
                        placeholderTextColor={colors.inputPlaceholder}
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            clearFieldError('name');
                        }}
                    />
                    {errors.name ? (
                        <Text style={styles.fieldErrorText}>{errors.name}</Text>
                    ) : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Phone Number *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            errors.phone ? styles.inputError : null,
                        ]}
                        placeholder="Enter phone number (digits only)"
                        placeholderTextColor={colors.inputPlaceholder}
                        value={phone}
                        onChangeText={(text) => {
                            setPhone(text);
                            clearFieldError('phone');
                        }}
                        keyboardType="phone-pad"
                    />
                    {errors.phone ? (
                        <Text style={styles.fieldErrorText}>{errors.phone}</Text>
                    ) : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Address Latitude (X) *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            errors.addressX ? styles.inputError : null,
                        ]}
                        placeholder="e.g. 32.0853"
                        placeholderTextColor={colors.inputPlaceholder}
                        value={addressX}
                        onChangeText={(text) => {
                            setAddressX(text);
                            clearFieldError('addressX');
                        }}
                        keyboardType="numeric"
                    />
                    {errors.addressX ? (
                        <Text style={styles.fieldErrorText}>{errors.addressX}</Text>
                    ) : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Address Longitude (Y) *</Text>
                    <TextInput
                        style={[
                            styles.input,
                            errors.addressY ? styles.inputError : null,
                        ]}
                        placeholder="e.g. 34.7818"
                        placeholderTextColor={colors.inputPlaceholder}
                        value={addressY}
                        onChangeText={(text) => {
                            setAddressY(text);
                            clearFieldError('addressY');
                        }}
                        keyboardType="numeric"
                    />
                    {errors.addressY ? (
                        <Text style={styles.fieldErrorText}>{errors.addressY}</Text>
                    ) : null}
                </View>

                {/* Submit Buttons */}
                <TouchableOpacity
                    style={[
                        styles.primaryButton,
                        loading && styles.disabledButton,
                    ]}
                    onPress={() => handleRegister('customer')}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading && submittingRole === 'customer' ? (
                        <ActivityIndicator color={colors.primaryText} />
                    ) : (
                        <Text style={styles.primaryButtonText}>
                            Register as Customer
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.secondaryButton,
                        loading && styles.disabledButton,
                    ]}
                    onPress={() => handleRegister('restaurant_owner')}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading && submittingRole === 'restaurant_owner' ? (
                        <ActivityIndicator color={colors.secondaryText} />
                    ) : (
                        <Text style={styles.secondaryButtonText}>
                            Register as Restaurant Owner
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            {/* Modal for Image Selection Choice */}
            <Modal
                visible={showPickerModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPickerModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowPickerModal(false)}
                >
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Select Profile Picture</Text>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={takePhotoWithCamera}
                        >
                            <Text style={styles.modalOptionText}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={pickImageFromGallery}
                        >
                            <Text style={styles.modalOptionText}>Choose from Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalCancelOption}
                            onPress={() => setShowPickerModal(false)}
                        >
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </KeyboardAvoidingView>
    );
}
