import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../constants/theme';
import { CartProvider } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';

function RootLayoutNav() {
	const { colors } = useTheme();

	// TODO: Implement authentication routing logic (check token and redirect to (auth) or (tabs))
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: colors.background },
			}}
		>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen name="(auth)" options={{ headerShown: false }} />
			<Stack.Screen name="checkout" options={{ headerShown: false }} />
		</Stack>
	);
}

export default function RootLayout() {
	return (
		<ThemeProvider>
			<CartProvider>
				<RootLayoutNav />
				<CartDrawer />
			</CartProvider>
		</ThemeProvider>
	);
}


