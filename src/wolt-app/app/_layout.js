import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../constants/theme';

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
		</Stack>
	);
}

export default function RootLayout() {
	return (
		<ThemeProvider>
			<RootLayoutNav />
		</ThemeProvider>
	);
}
