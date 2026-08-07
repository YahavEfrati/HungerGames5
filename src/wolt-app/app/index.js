import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>HELLO WORLD</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ffffff',
	},
	text: {
		fontSize: 28,
		fontWeight: '700',
		color: '#111111',
	},
});
