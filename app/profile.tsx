import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: clear authentication/token if implemented
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#0077ff', '#00c6ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBg}
      >
        <Animated.View style={[styles.avatarContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/200' }}
            style={styles.avatar}
          />
        </Animated.View>
        <Text style={styles.name}>Titas Majumder</Text>
        <Text style={styles.email}>titas@example.com</Text>
      </LinearGradient>

      {/* Profile Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Profile Details</Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📞 Phone</Text>
          <Text style={styles.infoValue}>+91 98765 43210</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>🏠 Address</Text>
          <Text style={styles.infoValue}>Kolkata, West Bengal, India</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>💼 Profession</Text>
          <Text style={styles.infoValue}>Legal Consultant</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity activeOpacity={0.8} style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f5f9',
    paddingBottom: 40,
  },
  headerBg: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 70,
    padding: 3,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    fontSize: 15,
    color: '#e0e0e0',
    marginTop: 4,
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0077ff',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#555',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#0077ff',
    marginHorizontal: 60,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#0077ff',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    marginHorizontal: 60,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#ff4d4d',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
