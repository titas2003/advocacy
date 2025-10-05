import { useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const tileWidth = (width - 60) / 2; // two tiles per row with padding
const numRows = 3;
const tileHeight = (height - 140) / numRows; // subtract header & padding

export default function home() {
  const router = useRouter();

  const tiles = [
    { title: 'Upcoming Appointments', icon: require('../../assets/logos/schedule.png'), action: () => router.push('/appointments') },
    { title: 'Book an Appointment', icon: require('../../assets/logos/appointment.png'), action: () => router.push('/book-appointment') },
    { title: 'Get Legal Advice', icon: require('../../assets/logos/attorney.png'), action: () => router.push('/legal-advice') },
    { title: 'Post Your Query', icon: require('../../assets/logos/history.png'), action: () => router.push('/post-query') },
    { title: 'Profile', icon: require('../../assets/logos/profile-candidate.png'), action: () => router.push('/profile') },
    { title: 'SOS', icon: require('../../assets/logos/alarm.png'), action: () => router.push('/SOS') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Animated.Text entering={FadeInUp.duration(600)} style={styles.header}>
        Welcome to Advocacy
      </Animated.Text>

      <View style={styles.grid}>
        {tiles.map((tile, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(index * 100).springify()}
            style={[styles.tileWrapper, { height: tileHeight }]}
          >
            <TouchableOpacity style={styles.tile} onPress={tile.action} activeOpacity={0.8}>
              <Image source={tile.icon} style={styles.icon} />
              <Text style={styles.tileText}>{tile.title}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 20 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#1a1a1a', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tileWrapper: {
    width: tileWidth,
    marginBottom: 20,
  },
  tile: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',

    // ✨ iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    // ✨ Android Elevation
    elevation: 6,

    // border to make the edges pop slightly
    borderWidth: 1,
    borderColor: '#455981ff',
  },
  icon: { width: 50, height: 50, marginBottom: 12, resizeMode: 'contain' },
  tileText: { fontSize: 15, fontWeight: '600', color: '#0077ff', textAlign: 'center' },
});

