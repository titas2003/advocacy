import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../utils/apiClient';

const { width, height } = Dimensions.get('window');
const tileWidth = (width - 60) / 2; // two tiles per row with padding
const numRows = 3;
const tileHeight = (height - 200) / numRows; // subtract header & padding

export default function home() {
  const router = useRouter();

  const tiles = [
    { title: 'Upcoming Appointments', icon: require('../../assets/logos/schedule.png'), action: () => router.push('/appointments') },
    { title: 'Book an Appointment', icon: require('../../assets/logos/appointment.png'), action: () => router.push('/book-appointment') },
    { title: 'Get Legal Advice', icon: require('../../assets/logos/attorney.png'), action: () => router.push('/get-legal-advice') },
    { title: 'Post Your Query', icon: require('../../assets/logos/history.png'), action: () => router.push('/post-query') },
    { title: 'Profile', icon: require('../../assets/logos/profile-candidate.png'), action: () => router.push('/profile') },
    { title: 'SOS', icon: require('../../assets/logos/alarm.png'), action: () => router.push('/SOS') },
  ];

  // Fetch advocates from backend
  const { data: advocates, isLoading: advocatesLoading } = useQuery({
    queryKey: ['advocates-top'],
    queryFn: async () => {
      const response = await apiClient.get('/user/advocates/search');
      return response.data.data; // API returns { success, data: [...] }
    },
  });

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

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>Top Advocates</Text>
        {advocatesLoading ? (
          <ActivityIndicator size="small" color="#0077ff" />
        ) : (
          <View style={styles.advocateList}>
            {advocates?.slice(0, 3).map((adv: any) => (
              <View key={adv._id} style={styles.advocateCard}>
                <Image source={{ uri: adv.avatar || 'https://i.pravatar.cc/100' }} style={styles.advAvatar} />
                <View style={styles.advInfo}>
                  <Text style={styles.advName}>{adv.name}</Text>
                  <Text style={styles.advSpecialization}>{adv.specialization?.name || 'General Practice'}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#455981ff',
  },
  icon: { width: 50, height: 50, marginBottom: 12, resizeMode: 'contain' },
  tileText: { fontSize: 15, fontWeight: '600', color: '#0077ff', textAlign: 'center' },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  advocateList: {
    flexDirection: 'column',
    gap: 12,
  },
  advocateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  advAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  advInfo: {
    flex: 1,
  },
  advName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  advSpecialization: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});

