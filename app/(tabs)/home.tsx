import { useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const tileWidth = (width - 60) / 2; // two tiles per row with padding
const numRows = 3;
const tileHeight = (height - 140) / numRows; // subtract header & padding

export default function HomeScreen() {
  const router = useRouter();

  const tiles = [
    { title: 'Upcoming Appointments', icon: require('../../assets/logos/schedule.png'), action: () => router.push('/appointments') },
    { title: 'Book an Appointment', icon: require('../../assets/logos/appointment.png'), action: () => router.push('/book-appointment') },
    { title: 'Get Legal Advice', icon: require('../../assets/logos/attorney.png'), action: () => router.push('/legal-advice') },
    { title: 'Post Your Query', icon: require('../../assets/logos/history.png'), action: () => router.push('/post-query') },
    { title: 'Profile', icon: require('../../assets/logos/profile-candidate.png'), action: () => router.push('/profile') },
    { title: 'Settings', icon: require('../../assets/logos/customer-support.png'), action: () => router.push('/settings') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Welcome to Advocacy</Text>

      <View style={styles.grid}>
        {tiles.map((tile, index) => (
          <TouchableOpacity key={index} style={[styles.tile, { height: tileHeight }]} onPress={tile.action}>
            <Image source={tile.icon} style={styles.icon} />
            <Text style={styles.tileText}>{tile.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 20 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#1a1a1a' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: tileWidth,
    backgroundColor: '#f0f4f8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  icon: { width: 50, height: 50, marginBottom: 12 },
  tileText: { fontSize: 16, fontWeight: '600', color: '#0077ff', textAlign: 'center' },
});
