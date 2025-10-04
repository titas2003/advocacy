import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();

  const handleSignup = () => {
    router.replace('/(tabs)/home'); // After signup, go to main tabs
  };

  const handleGoogleSignup = () => {
    alert('Google signup clicked');
    router.replace('/(tabs)/home');
  };

  const handleAadhaarSignup = () => {
    alert('Aadhaar signup clicked');
    router.replace('/(tabs)/home');
  };

  const handlePanSignup = () => {
    alert('PAN signup clicked');
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput placeholder="Full Name" style={styles.input} />
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {/* Social / ID logins */}
      <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignup}>
        <Image source={require('../assets/logos/google.png')} style={styles.icon} />
        <Text style={styles.socialText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={handleAadhaarSignup}>
        <Image source={require('../assets/logos/identity.png')} style={styles.icon} />
        <Text style={styles.socialText}>Sign Up with Aadhaar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={handlePanSignup}>
        <Image source={require('../assets/logos/pan-id.png')} style={styles.icon} />
        <Text style={styles.socialText}>Sign Up with PAN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f0f4f8' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#0077ff', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30, marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  orText: { marginVertical: 10, color: '#444', fontWeight: '600' },
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
  icon: { width: 24, height: 24, marginRight: 12 },
  socialText: { fontSize: 16, color: '#444', fontWeight: '600' },
});
