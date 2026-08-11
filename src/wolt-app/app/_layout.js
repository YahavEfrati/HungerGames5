import { Stack } from 'expo-router';

export default function RootLayout() {
	// TODO: Implement authentication routing logic (check token and redirect to (auth) or (tabs))
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: '#141414' },
			}}
		>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen name="(auth)" options={{ headerShown: false }} />
		</Stack>
	);
}
