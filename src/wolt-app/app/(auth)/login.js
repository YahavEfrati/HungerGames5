import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '../../constants/theme';
import { login as loginApi, saveToken } from '../../services/authService';
import { getStyles } from '../../styles/login.styles';

/**
 * Mobile Login Screen Component for Wolt App (HG-224).
 * Replicates the React Web LoginPage layout, visual styling, validation,
 * API integration (POST /api/tokens), and secure token storage in AsyncStorage.
 */
export default function LoginScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const theme = useAppTheme();
    const styles = getStyles(theme);

    // Form Input States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Feedback & UI States
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [relayMessage, setRelayMessage] = useState('');
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

    /**
     * Effect to extract success messages or relay messages from navigation search params.
     */
    useEffect(() => {
        if (params?.successMessage) {
            setSuccess(params.successMessage);
            setError('');
        }
        if (params?.relayMessage) {
            setRelayMessage(params.relayMessage);
        }
    }, [params]);

    /**
     * Display error banner and clear success message.
     */
    const displayError = (msg) => {
        setError(msg);
        setSuccess('');
    };

    /**
     * Display success banner and clear error message.
     */
    const displaySuccess = (msg) => {
        setSuccess(msg);
        setError('');
    };

    /**
     * Handles login form submission.
     */
    const handleLogin = async () => {
        setValidated(true);

        const cleanUsername = username.trim();
        const cleanPassword = password.trim();

        // Check required fields
        if (!cleanUsername || !cleanPassword) {
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const data = await loginApi(cleanUsername, cleanPassword);

            // Store received JWT token in AsyncStorage under key 'userToken'
            if (data && data.token) {
                await saveToken(data.token);
            }

            console.log('Login successful!');

            // Clear inputs upon successful login
            setUsername('');
            setPassword('');
            setValidated(false);

            // Navigate to home screen or target path
            const targetPath = params?.from || '/';
            router.replace(targetPath);
        } catch (err) {
            displayError(err.message || 'password or username is incorrect, please try again.');
        } finally {
            setLoading(false);
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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.appTitle}>HungerGames</Text>
                    <Text style={styles.subtitle}>Login to your Hunger Games account</Text>
                </View>

                {/* Relay Info Banner */}
                {relayMessage ? (
                    <View style={[styles.alertBanner, styles.infoBanner]}>
                        <Text style={styles.infoText}>{relayMessage}</Text>
                    </View>
                ) : null}

                {/* Success Banner */}
                {success ? (
                    <View style={[styles.alertBanner, styles.successBanner]}>
                        <Text style={styles.successText}>{success}</Text>
                    </View>
                ) : null}

                {/* Error Banner */}
                {error ? (
                    <View style={[styles.alertBanner, styles.errorBanner]}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Username Input */}
                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Username</Text>
                    <TextInput
                        style={[
                            styles.input,
                            validated && !username.trim() ? styles.inputError : null,
                        ]}
                        placeholder="Enter username"
                        placeholderTextColor={theme.inputPlaceholder}
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            if (error) setError('');
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {validated && !username.trim() ? (
                        <Text style={styles.fieldErrorText}>please enter a user name</Text>
                    ) : null}
                </View>

                {/* Password Input */}
                <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Password</Text>
                    <TextInput
                        style={[
                            styles.input,
                            validated && !password.trim() ? styles.inputError : null,
                        ]}
                        placeholder="Password"
                        placeholderTextColor={theme.inputPlaceholder}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (error) setError('');
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    {validated && !password.trim() ? (
                        <Text style={styles.fieldErrorText}>please enter a password</Text>
                    ) : null}
                </View>

                {/* Submit / Login Button */}
                <TouchableOpacity
                    style={[styles.primaryButton, loading ? styles.disabledButton : null]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.primaryText} />
                    ) : (
                        <Text style={styles.primaryButtonText}>Login</Text>
                    )}
                </TouchableOpacity>

                {/* Create Account Button */}
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push('/register')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.secondaryButtonText}>Create Account</Text>
                </TouchableOpacity>

                {/* Continue as Guest Button */}
                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.replace('/')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.linkButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
