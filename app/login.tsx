import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useGoogleAuth } from '../utils/googleAuth';

const BACKEND_URL = 'http://192.168.0.178:3000';

export default function LoginScreen() {
  const router = useRouter();

  /* ---------- Google Auth Hook ---------- */
  const { request, response, promptAsync } = useGoogleAuth();

  /* ---------- Handle Google Response ---------- */
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication ?? {};

      if (!id_token) {
        Alert.alert('Login failed', 'No ID token received');
        return;
      }

      googleLoginToBackend(id_token);
    }
  }, [response]);

  /* ---------- Send token to backend ---------- */
  const googleLoginToBackend = async (idToken: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      // TODO: store JWT securely (SecureStore)
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Alert.alert('Authentication Error', err.message);
    }
  };

  /* ---------- Button Handlers ---------- */
  const handleGoogleLogin = async () => {
    if (!request) return;
    await promptAsync({ useProxy: true });
  };

  const handleLogin = () => {
    router.replace('/(tabs)/home');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleAadhaarLogin = () => {
    Alert.alert('Coming soon', 'Aadhaar login will be added later');
  };

  const handlePanLogin = () => {
    Alert.alert('Coming soon', 'PAN login will be added later');
  };

  /* ---------- UI ---------- */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {/* Google Login */}
      <TouchableOpacity
        style={styles.socialButton}
        disabled={!request}
        onPress={handleGoogleLogin}
      >
        <Image
          source={require('../assets/logos/google.png')}
          style={styles.icon}
        />
        <Text style={styles.socialText}>Login with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={handleAadhaarLogin}>
        <Image
          source={require('../assets/logos/identity.png')}
          style={styles.icon}
        />
        <Text style={styles.socialText}>Login with Aadhaar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={handlePanLogin}>
        <Image
          source={require('../assets/logos/pan-id.png')}
          style={styles.icon}
        />
        <Text style={styles.socialText}>Login with PAN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignup}>
        <Text style={styles.signupText}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#0077ff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    marginVertical: 10,
    color: '#444',
    fontWeight: '600',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
  },
  signupText: {
    color: '#0077ff',
    marginTop: 15,
    fontSize: 14,
  },
});
