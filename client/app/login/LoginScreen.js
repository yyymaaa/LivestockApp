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

import { useRouter } from 'expo-router'; // ✅ ADDED for navigation
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Optional: to store user

const LoginScreen = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // ✅ ADDED

  // ✅ ADDED: Login function
  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.56.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: phoneOrEmail,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }

      const user = data.user;

      // ✅ OPTIONAL: Store user in local storage
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // ✅ Redirect based on role/group_id
      if (user.role === 'Farmer' || user.group_id === 3) {
        router.replace('/(tabs)/farmer');
      } else {
        router.replace('/(tabs)/serviceProvider'); // Change this path to your client tab if available
      }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={StyleSheet.container}>

        <Text style={StyleSheet.title}>Welcome Back</Text>
        <Text style={StyleSheet.subtitle}>Login to continue</Text>

        <InputField
          label="Phone or Email"
          placeholder="Enter phone number or email"
          value={phoneOrEmail}
          onChangeText={setPhoneOrEmail}
        />

        <AuthPasswordTextField
          label="Password"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => { }}
          style={StyleSheet.forgotPasswordContainer}
        >
          <Text style={StyleSheet.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* ✅ CHANGED: Hook up the login function here */}
        <AuthenticationButton
          label="Log In"
          onPress={handleLogin} // ✅ CALL handleLogin
        />

        <View style={StyleSheet.orContainer}>
          <View style={StyleSheet.line} />
          <Text style={StyleSheet.orText}>OR</Text>
          <View style={StyleSheet.line} />
        </View>

        <View style={StyleSheet.socialButtonsContainer}>

          <TouchableOpacity style={StyleSheet.socialButton}>
            <AntDesign name="google" size={20} color="#EA4335" />
            <Text style={StyleSheet.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={StyleSheet.socialButton}>
            <AntDesign name="apple1" size={20} color="#000" />
            <Text style={StyleSheet.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={StyleSheet.registerContainer}>
          <Text style={StyleSheet.registerText}>New to the app? </Text>
          <TouchableOpacity onPress={() => { }}>
            <Text style={StyleSheet.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
