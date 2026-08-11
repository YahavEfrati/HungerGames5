import { Redirect } from 'expo-router';

export default function Index() {
  // Automatically redirect to the tabs layout when the app opens
  return <Redirect href="/(tabs)" />;
}
