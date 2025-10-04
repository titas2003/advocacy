import { StyleSheet, View } from 'react-native';

export default function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea', // Light greenish
  },
});
