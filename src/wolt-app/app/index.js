import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../constants/theme';

export default function HomeScreen() {
	const router = useRouter();
	const theme = useAppTheme();

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<Text style={[styles.title, { color: theme.primary }]}>HungerGames Mobile</Text>
			<Text style={[styles.subtitle, { color: theme.textSecondary }]}>
				Welcome to Wolt HungerGames
			</Text>

			<TouchableOpacity
				style={[styles.button, { backgroundColor: theme.primary, marginBottom: 12 }]}
				onPress={() => router.push('/login')}
				activeOpacity={0.8}
			>
				<Text style={[styles.buttonText, { color: theme.primaryText }]}>
					Go to Login
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.secondaryButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}
				onPress={() => router.push('/register')}
				activeOpacity={0.8}
			>
				<Text style={[styles.buttonText, { color: theme.secondaryText }]}>
					Go to Registration
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	title: {
		fontSize: 32,
		fontWeight: '900',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 32,
	},
	button: {
		height: 50,
		width: '100%',
		maxWidth: 280,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
	},
	secondaryButton: {
		height: 50,
		width: '100%',
		maxWidth: 280,
		borderRadius: 25,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '700',
	},
});
