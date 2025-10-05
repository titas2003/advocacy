import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // ------------------------
        // 1️⃣ Location Permission
        // ------------------------
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Location permission is needed for better service.'
          );
        }

        // ------------------------
        // 2️⃣ Contacts Permission
        // ------------------------
        const { status: contactsStatus } = await Contacts.requestPermissionsAsync();
        if (contactsStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Contacts permission is needed to connect with others.'
          );
        }

        // ------------------------
        // 3️⃣ Phone Permission (Android only)
        // ------------------------
        // iOS: phone permissions are handled by default (no extra API needed)
        if (Platform.OS === 'android') {
          // Phone permission is declared in app.json:
          // "android": { "permissions": ["READ_PHONE_STATE", "CALL_PHONE"] }
          console.log('Phone permissions declared in app.json for Android');
        }
      } catch (err) {
        console.warn('Permission request error:', err);
      }
    };

    requestPermissions();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Splash / onboarding / index screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* About screen if needed */}
      <Stack.Screen name="about" options={{ title: 'About' }} />

      {/* Main app tabs (bottom navigation) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Modal screens */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
