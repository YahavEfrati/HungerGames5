import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../constants/theme';
import { getToken, removeToken, getUser, saveUser } from '../../services/authService';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import { getStyles } from '../../styles/profile.styles';
import ImagePickerModal from '../../components/ImagePickerModal';

/**
 * Profile Screen Component for Wolt App Mobile Repository.
 * 
 * Requirements implemented:
 * 1. Auth Guard: Checks for valid JWT token and cached user info in AsyncStorage. Renders Auth Gateway if not authenticated, else ProfilePage.
 * 2. Navigation Routes: Uses clean Expo Router paths ('/login', '/register') omitting route group syntax.
 * 3. Theme & Styling: Uses useTheme() with useMemo to memoize dynamic styles and prevent re-render loops.
 * 4. User Details & Editing: Fetches profile data using userId directly, enables field editing (name, phone, addressX, addressY).
 * 5. Custom Image Selection Modal: Identical to RegisterScreen modal (Camera OR Gallery option via Expo ImagePicker).
 * 6. Top-Right Theme Toggle: Shown ONLY when logged in.
 * 7. Logout Button: Prominently located at bottom, clears token from AsyncStorage and redirects to login/gateway.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDarkMode, toggleTheme } = useTheme();

  // Memoize dynamic styles based on theme colors to prevent re-render loops on theme toggle
  const styles = useMemo(() => getStyles(colors), [colors]);

  // Authentication & Loading States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Profile Form States
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressX, setAddressX] = useState('');
  const [addressY, setAddressY] = useState('');

  // Picture & Picker Modal States
  const [picturePreview, setPicturePreview] = useState('');
  const [pictureBase64, setPictureBase64] = useState('');
  const [showPickerModal, setShowPickerModal] = useState(false);

  // UI Flags & Validation
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  /**
   * Checks token validity and fetches user profile details from backend using stored userId.
   */
  const checkAuthAndFetchProfile = async () => {
    setIsCheckingAuth(true);
    setError('');
    try {
      const token = await getToken();
      const storedUser = await getUser();

      if (!token || !storedUser) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }

      const uid = storedUser._id || storedUser.id;
      if (!uid) {
        await removeToken();
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }

      setUserId(uid);
      setIsAuthenticated(true);
      setLoading(true);

      try {
        const userData = await getUserProfile(token, uid);
        setUsername(userData.username || storedUser.username || '');
        setName(userData.name || '');
        setPhone(userData.phone || '');
        setAddressX(userData.addressX !== undefined && userData.addressX !== null ? String(userData.addressX) : '');
        setAddressY(userData.addressY !== undefined && userData.addressY !== null ? String(userData.addressY) : '');
        setPicturePreview(userData.picture || '');
        setPictureBase64('');
        await saveUser({ ...storedUser, ...userData });
      } catch (err) {
        if (err.status === 401 || err.status === 404) {
          await removeToken();
          setIsAuthenticated(false);
        } else {
          setError(err.message || 'Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  /**
   * Re-check authentication and reload profile data whenever the tab comes into focus.
   */
  useFocusEffect(
    useCallback(() => {
      checkAuthAndFetchProfile();
    }, [])
  );

  /**
   * Pick an image from the device's photo library / gallery.
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
        setPicturePreview(asset.uri);

        const mimeType = asset.mimeType || 'image/jpeg';
        const formattedBase64 = `data:${mimeType};base64,${asset.base64}`;
        setPictureBase64(formattedBase64);

        if (fieldErrors.picture) {
          setFieldErrors((prev) => ({ ...prev, picture: null }));
        }
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
        setPicturePreview(asset.uri);

        const mimeType = asset.mimeType || 'image/jpeg';
        const formattedBase64 = `data:${mimeType};base64,${asset.base64}`;
        setPictureBase64(formattedBase64);

        if (fieldErrors.picture) {
          setFieldErrors((prev) => ({ ...prev, picture: null }));
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to take photo with camera.');
    }
  };

  /**
   * Handles switching to Edit Mode or submitting updated profile details.
   */
  const handleActionClick = async () => {
    if (!isEditMode) {
      setIsEditMode(true);
      setSuccess('');
      setError('');
      setFieldErrors({});
      return;
    }

    // Client-side validations
    const errorsObj = {};
    if (!name.trim()) {
      errorsObj.name = 'Full Name is required';
    }

    const phoneRegex = /^[0-9]+$/;
    if (!phone.trim()) {
      errorsObj.phone = 'Phone is required';
    } else if (!phoneRegex.test(phone.trim())) {
      errorsObj.phone = 'Phone number must contain only digits';
    }

    if (addressX.trim() === '' || isNaN(parseFloat(addressX))) {
      errorsObj.addressX = 'Address X must be a valid number';
    }

    if (addressY.trim() === '' || isNaN(parseFloat(addressY))) {
      errorsObj.addressY = 'Address Y must be a valid number';
    }

    if (Object.keys(errorsObj).length > 0) {
      setFieldErrors(errorsObj);
      setError('Please correct the validation errors below.');
      return;
    }

    setFieldErrors({});
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const token = await getToken();
      const storedUser = await getUser();
      const uid = userId || storedUser?._id || storedUser?.id;

      if (!token || !uid) {
        setIsAuthenticated(false);
        return;
      }

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        addressX: parseFloat(addressX),
        addressY: parseFloat(addressY),
        picture: pictureBase64 || picturePreview,
      };

      const updatedUser = await updateUserProfile(token, uid, payload);

      setName(updatedUser.name || name.trim());
      setPhone(updatedUser.phone || phone.trim());
      setAddressX(updatedUser.addressX !== undefined ? String(updatedUser.addressX) : addressX);
      setAddressY(updatedUser.addressY !== undefined ? String(updatedUser.addressY) : addressY);
      setPicturePreview(updatedUser.picture || picturePreview);
      setPictureBase64('');

      if (storedUser) {
        await saveUser({ ...storedUser, ...updatedUser });
      }

      setIsEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      if (err.status === 401 || err.status === 404) {
        await removeToken();
        setIsAuthenticated(false);
        router.push('/login');
      } else {
        setError(err.message || 'Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handles user logout: clears AsyncStorage token and redirects to Auth/Login screen.
   */
  const handleLogout = async () => {
    try {
      await removeToken();
      setIsAuthenticated(false);
      setUserId('');
      setUsername('');
      setName('');
      setPhone('');
      setAddressX('');
      setAddressY('');
      setPicturePreview('');
      setPictureBase64('');
      setIsEditMode(false);
      setError('');
      setSuccess('');
      router.push('/login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  // 1. Render Loading State while checking Auth status
  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Checking session...</Text>
      </View>
    );
  }

  // 2. Render Auth Gateway Page if NOT Logged In (No Theme Toggle as per Requirement 3)
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.authGatewayContent}>
          <Text style={styles.authGatewayTitle}>HungerGames</Text>
          <Text style={styles.authGatewaySubtitle}>Login to your HungerGames account!</Text>

          <TouchableOpacity
            style={styles.gatewayLoginBtn}
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.gatewayLoginBtnText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.gatewayRegisterText}>Not registered yet?</Text>

          <TouchableOpacity
            style={styles.gatewayRegisterBtn}
            onPress={() => router.push('/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.gatewayRegisterBtnText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3. Render Full ProfilePage View if Logged In
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
        {/* Top Header with Theme Toggle in TOP-RIGHT corner (Only shown when logged in) */}
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.themeToggleContainer}>
            <Text style={styles.themeToggleText}>
              {isDarkMode ? 'Dark' : 'Light'}
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Profile Card Container */}
        <View style={styles.card}>
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

          {/* Profile Picture / Avatar */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarTouchable}
              onPress={() => {
                if (isEditMode) setShowPickerModal(true);
              }}
              disabled={!isEditMode}
              activeOpacity={isEditMode ? 0.7 : 1}
            >
              {picturePreview ? (
                <Image source={{ uri: picturePreview }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>
                    {name ? name.charAt(0).toUpperCase() : username ? username.charAt(0).toUpperCase() : '?'}
                  </Text>
                </View>
              )}
              {isEditMode && (
                <View style={styles.uploadBadge}>
                  <Text style={styles.uploadBadgeText}>+</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Username Field (Permanently Disabled) */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Username</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={username}
              editable={false}
            />
          </View>

          {/* Full Name Field */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                !isEditMode && styles.disabledInput,
                fieldErrors.name ? styles.inputError : null,
              ]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: null }));
              }}
              editable={isEditMode}
              placeholder="Enter full name"
              placeholderTextColor={colors.inputPlaceholder}
            />
            {fieldErrors.name ? (
              <Text style={styles.fieldErrorText}>{fieldErrors.name}</Text>
            ) : null}
          </View>

          {/* Phone Field */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <TextInput
              style={[
                styles.input,
                !isEditMode && styles.disabledInput,
                fieldErrors.phone ? styles.inputError : null,
              ]}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: null }));
              }}
              editable={isEditMode}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor={colors.inputPlaceholder}
            />
            {fieldErrors.phone ? (
              <Text style={styles.fieldErrorText}>{fieldErrors.phone}</Text>
            ) : null}
          </View>

          {/* Address X and Address Y Fields */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.fieldLabel}>Address X</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditMode && styles.disabledInput,
                  fieldErrors.addressX ? styles.inputError : null,
                ]}
                value={addressX}
                onChangeText={(text) => {
                  setAddressX(text);
                  if (fieldErrors.addressX) setFieldErrors((prev) => ({ ...prev, addressX: null }));
                }}
                editable={isEditMode}
                keyboardType="numeric"
                placeholder="X coordinate"
                placeholderTextColor={colors.inputPlaceholder}
              />
              {fieldErrors.addressX ? (
                <Text style={styles.fieldErrorText}>{fieldErrors.addressX}</Text>
              ) : null}
            </View>

            <View style={styles.col}>
              <Text style={styles.fieldLabel}>Address Y</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditMode && styles.disabledInput,
                  fieldErrors.addressY ? styles.inputError : null,
                ]}
                value={addressY}
                onChangeText={(text) => {
                  setAddressY(text);
                  if (fieldErrors.addressY) setFieldErrors((prev) => ({ ...prev, addressY: null }));
                }}
                editable={isEditMode}
                keyboardType="numeric"
                placeholder="Y coordinate"
                placeholderTextColor={colors.inputPlaceholder}
              />
              {fieldErrors.addressY ? (
                <Text style={styles.fieldErrorText}>{fieldErrors.addressY}</Text>
              ) : null}
            </View>
          </View>

          {/* Action Button: Edit / Save */}
          <TouchableOpacity
            style={[styles.primaryButton, saving ? styles.disabledButton : null]}
            onPress={handleActionClick}
            disabled={saving || loading}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color={colors.primaryText} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isEditMode ? 'Save' : 'Edit'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Prominent Logout Button at the Bottom */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Reusable Custom Modal for Image Selection Choice */}
      <ImagePickerModal
        visible={showPickerModal}
        onClose={() => setShowPickerModal(false)}
        onTakePhoto={takePhotoWithCamera}
        onChooseGallery={pickImageFromGallery}
      />
    </KeyboardAvoidingView>
  );
}
