import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RootLayout() {
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGrantPermissions = async () => {
    try {
      // 1️⃣ Request Location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        console.warn('Location permission denied');
      }

      // 2️⃣ Request Contacts permission
      const { status: contactsStatus } = await Contacts.requestPermissionsAsync();
      if (contactsStatus !== 'granted') {
        console.warn('Contacts permission denied');
      }

      // 3️⃣ Android phone permission
      if (Platform.OS === 'android') {
        // Declared in app.json: ["READ_PHONE_STATE", "CALL_PHONE"]
        console.log('Phone permissions handled via app.json for Android');
      }

      setShowPermissionModal(false);
    } catch (error) {
      console.warn('Permission error:', error);
    }
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ title: 'About' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>

      {/* 🌟 Permission Modal */}
      <Modal visible={showPermissionModal} animationType="fade" transparent>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>📌 Permissions Required</Text>
            <Text style={styles.subtitle}>
              To give you the best experience, we need access to:
            </Text>

            <View style={styles.list}>
              <Text style={styles.listItem}>📍 Location — to show nearby advocates</Text>
              <Text style={styles.listItem}>👥 Contacts — to help connect easily</Text>
              <Text style={styles.listItem}>📞 Phone (Android) — for appointment calls</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleGrantPermissions}>
              <Text style={styles.buttonText}>Grant Permissions</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15,
    color: '#555',
  },
  list: {
    marginBottom: 20,
  },
  listItem: {
    fontSize: 14,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#0077ff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
