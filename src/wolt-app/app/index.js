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
				style={[styles.button, { backgroundColor: theme.primary }]}
				onPress={() => router.push('/register')}
				activeOpacity={0.8}
			>
				<Text style={[styles.buttonText, { color: theme.primaryText }]}>
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
		paddingHorizontal: 32,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '700',
	},
});
