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

import { useRouter } from 'expo-router'; //for navigation
import AsyncStorage from '@react-native-async-storage/async-storage'; //to store user (this is optional

const LoginScreen = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

 
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

      //Store user in local storag, this  too is optional
      await AsyncStorage.setItem('user', JSON.stringify(user));

      //Redirecting based on role
      if (user.role === 'Farmer' || user.group_id === 3) {
        router.replace('/(tabs)/farmer');
      } else {
        router.replace('/(tabs)/serviceProvider'); 
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

        {/*login function goes here */}
        <AuthenticationButton
          label="Log In"
          onPress={handleLogin} // calling handleLogin
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
