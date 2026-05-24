import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import apiClient from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [govId, setGovId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password || !phone || !govId) {
      setErrorMsg('All fields are required');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    try {
      // Backend expects role "client" by default for this app
      const response = await apiClient.post('/user/signup', {
        name,
        email,
        phone,
        govId,
        password,
        role: 'client' 
      });
      
      const { token, user } = response.data;
      await login(token, user);
      
      router.replace('/(tabs)/home'); // After signup, go to main tabs
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    alert('Google signup clicked');
    // router.replace('/(tabs)/home');
  };

  const handleAadhaarSignup = () => {
    alert('Aadhaar signup clicked');
    // router.replace('/(tabs)/home');
  };

  const handlePanSignup = () => {
    alert('PAN signup clicked');
    // router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <TextInput 
        placeholder="Full Name" 
        style={styles.input} 
        value={name}
        onChangeText={setName}
      />
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        keyboardType="email-address" 
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        placeholder="Phone Number" 
        style={styles.input} 
        keyboardType="phone-pad" 
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput 
        placeholder="Aadhar (12 digits) or PAN (10 chars)" 
        style={styles.input} 
        autoCapitalize="characters"
        value={govId}
        onChangeText={setGovId}
      />
      <TextInput 
        placeholder="Password" 
        style={styles.input} 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
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
  button: { width: '100%', backgroundColor: '#0077ff', paddingVertical: 14, borderRadius: 30, marginBottom: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  orText: { marginVertical: 10, color: '#444', fontWeight: '600' },
  errorText: { color: 'red', marginBottom: 10 },
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
