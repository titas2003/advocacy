import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Footer() {
  const router = useRouter();

  const navItems = [
    { label: 'Home', route: '/home' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' },
    { label: 'Settings', route: '/settings' },
    { label: 'FAQ', route: '/faq' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => router.push(item.route)} style={styles.button}>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#0077ff',
    fontWeight: '600',
  },
  version: {
    fontSize: 10,
    color: '#888',
    position: 'absolute',
    right: 10,
    bottom: 4,
  },
});
