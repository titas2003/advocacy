import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // 📍 Location permission
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
          Alert.alert('Permission Required', 'Location permission is needed for better service.');
        }

        // 📇 Contacts permission
        const { status: contactsStatus } = await Contacts.requestPermissionsAsync();
        if (contactsStatus !== 'granted') {
          Alert.alert('Permission Required', 'Contacts permission is needed to connect with others.');
        }

        // 📞 Phone permission (Android only)
        if (Platform.OS === 'android') {
          const { status: phoneStatus } = await Permissions.askAsync(Permissions.PHONE);
          if (phoneStatus !== 'granted') {
            Alert.alert('Permission Required', 'Phone permission is needed for calling features.');
          }
        }
      } catch (err) {
        console.warn('Permission request error:', err);
      }
    };

    requestPermissions();
  }, []);

  return (
    <Stack>
      {/* This controls which screens are part of your navigation stack */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
