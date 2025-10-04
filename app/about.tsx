import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Find Legal Experts',
    text: 'Search and connect with advocates in your area with just a few taps.',
    animation: require('../assets/lottie/Success_law.json'),
  },
  {
    key: '2',
    title: 'Ask Your Questions',
    text: 'Post your legal queries and get responses from verified professionals.',
    animation: require('../assets/lottie/SearchAsk_loop.json'),
  },
  {
    key: '3',
    title: 'Empower Women',
    text: 'Promoting legal rights and justice for women everywhere.',
    animation: require('../assets/lottie/women_justice.json'),
  },
];

export default function AboutScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const handleLaunch = () => {
    // Navigate to login page
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            <LottieView
              source={slide.animation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      {activeIndex === slides.length - 1 && (
        <TouchableOpacity style={styles.launchButton} onPress={handleLaunch}>
          <Text style={styles.launchButtonText}>Get Started 🚀</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  slide: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  animation: { width: 250, height: 250, marginBottom: 25 },
  title: { fontSize: 24, fontWeight: '800', color: '#1a1a1a', textAlign: 'center', marginBottom: 10 },
  text: { fontSize: 16, color: '#444', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ccc', marginHorizontal: 6 },
  activeDot: { backgroundColor: '#0077ff', width: 12, height: 12 },
  launchButton: {
    backgroundColor: '#0077ff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 30,
    shadowColor: '#0077ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  launchButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
