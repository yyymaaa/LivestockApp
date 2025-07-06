import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import AuthenticationButton from '../../components/AuthenticationButton';
import AuthPasswordTextField from '../../components/AuthPasswordTextField';
import InputField from '../../components/InputField';

import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from '../../config';
import { AuthenticationContext } from '../../contexts/authenticationContext';

const LoginScreen = () => {
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!Email || !password) {
    return Alert.alert('Missing Fields', 'Please enter both email and password.');
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: Email,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }

      const user = data.user;

      // AsyncStorage saves to a local storage
      await AsyncStorage.setItem('user', JSON.stringify(user));

      const role = user.role;
      if (role === 'Farmer') {
        router.replace('/(tabs)/farmer');
      } else if (role === 'ivestock Service Provider') {
        router.replace('/(tabs)/serviceprovider');
      } else if (role === 'Livestock Product Buyer' || role === 'productbuyer') {
        router.replace('/(tabs)/productbuyer');
      } else {
        Alert.alert('Unknown Role', 'Cannot determine where to redirect.');
      }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <InputField
          label="Email"
          placeholder="Enter your email address"
          value={Email}
          onChangeText={setEmail}
        />

        <AuthPasswordTextField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />

        <AuthenticationButton
          label="Log In"
          onPress={handleLogin}
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>New to the app? </Text>
          <TouchableOpacity onPress={() => router.push('../register/RegistrationScreen')}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#29AB87',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  registerText: {
    color: '#555',
    fontSize: 14,
  },
  registerLink: {
    color: '#29AB87',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default LoginScreen;
