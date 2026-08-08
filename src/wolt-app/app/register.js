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
import { useAppTheme } from '../constants/theme';
import { registerUser } from '../services/userService';
import { getStyles } from '../styles/register.styles';

/**
 * Mobile Registration Screen Component for Wolt App.
 * Enforces client-side validations, native image picking (camera & gallery),
 * and dispatches POST /api/users request matching backend Mongoose schema.
 */
export default function RegisterScreen() {
    const router = useRouter();
    const theme = useAppTheme();
    const styles = getStyles(theme);

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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [submittingRole, setSubmittingRole] = useState(null);
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const [showPickerModal, setShowPickerModal] = useState(false);

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
                setError('');
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
                setError('');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to take photo with camera.');
        }
    };

    /**
     * Handles registration form submission.
     */
    const handleRegister = async (role) => {
        setError('');
        setSuccess('');

        // 1. Mandatory input checks
        if (!username.trim()) {
            setError('Username is required.');
            return;
        }
        if (!password) {
            setError('Password is required.');
            return;
        }
        if (!verifyPassword) {
            setError('Please verify your password.');
            return;
        }
        if (!name.trim()) {
            setError('Full name is required.');
            return;
        }
        if (!phone.trim()) {
            setError('Phone number is required.');
            return;
        }
        if (!addressX.trim()) {
            setError('Latitude is required.');
            return;
        }
        if (!addressY.trim()) {
            setError('Longitude is required.');
            return;
        }

        // 2. Password complexity validation
        if (!isPasswordComplex(password)) {
            setError('Password must be at least 8 characters long and contain uppercase, lowercase letters, and numbers.');
            return;
        }

        // 3. Password match validation
        if (password !== verifyPassword) {
            setError('Passwords do not match.');
            return;
        }

        // 4. Phone digits validation
        if (!isPhoneValid(phone.trim())) {
            setError('Phone number must contain only digits.');
            return;
        }

        // 5. Latitude / Longitude validity
        if (isNaN(parseFloat(addressX)) || isNaN(parseFloat(addressY))) {
            setError('Latitude (X) and Longitude (Y) must be valid numbers.');
            return;
        }

        // 6. Profile picture validation
        if (!pictureBase64) {
            setError('Please select a profile picture.');
            return;
        }

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

                {/* Error Banner */}
                {error ? (
                    <View style={[styles.alertBanner, styles.errorBanner]}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Success Banner */}
                {success ? (
                    <View style={[styles.alertBanner, styles.successBanner]}>
                        <Text style={styles.successText}>{success}</Text>
                    </View>
                ) : null}

                {/* Profile Picture Upload Avatar */}
                <View style={styles.avatarSection}>
                    <Text style={styles.fieldLabel}>Profile Picture *</Text>
                    <TouchableOpacity
                        style={styles.avatarContainer}
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
                </View>

                {/* Form Fields */}
                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Username *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter username"
                        placeholderTextColor={theme.inputPlaceholder}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
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
                        style={styles.input}
                        placeholder="Enter password"
                        placeholderTextColor={theme.inputPlaceholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Verify Password *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Re-enter password"
                        placeholderTextColor={theme.inputPlaceholder}
                        value={verifyPassword}
                        onChangeText={setVerifyPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Full Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter full name"
                        placeholderTextColor={theme.inputPlaceholder}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Phone Number *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter phone number (digits only)"
                        placeholderTextColor={theme.inputPlaceholder}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Address Latitude (X) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 32.0853"
                        placeholderTextColor={theme.inputPlaceholder}
                        value={addressX}
                        onChangeText={setAddressX}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Address Longitude (Y) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 34.7818"
                        placeholderTextColor={theme.inputPlaceholder}
                        value={addressY}
                        onChangeText={setAddressY}
                        keyboardType="numeric"
                    />
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
                        <ActivityIndicator color={theme.primaryText} />
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
                        <ActivityIndicator color={theme.secondaryText} />
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
