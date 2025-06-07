import React, { useState, useContext } from 'react';
import {
         SafeAreaView,
         View,
         Text,
         TouchableOpacity, 
         StyleSheet
       } from 'react-native'
      
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AntDesign, Zocial, FontAwesome6 } from '@expo/vector-icons';

import AuthenticationButton from '../components/AuthenticationButton';
import AuthPasswordTextField from '../components/AuthPasswordTextField';
import InputField from '../components/InputField';


const LoginScreen = () => {
  const [phoneOrEmail,setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style = {styles.container}>

      <Text style = {styles.title}>Welcome Back</Text>
      <Text style = {styles.subtitle}>Login to continue</Text>

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
        onPress={() => {
          
        }}
        style={styles.forgotPasswordContainer}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <AuthenticationButton
        label="Log In"
        onPress={() => {
        }}
      />

      <View style={styles.orContainer}>
        <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialButtonsContainer}>

        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="google" size={20} color="#EA4335" />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="apple1" size={20} color="#000" />
          < Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>New to the app? </Text>
        <TouchableOpacity onPress={() => { 

         }}>
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>

    </View>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', 
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center', 
    marginTop: 5,
    marginBottom: 25,
  },
  forgotPasswordContainer: {
  alignSelf: 'flex-end',
  marginBottom: 20,
  },
  forgotPasswordText: {
  color: '#1E90FF',
  fontSize: 14,
  fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  socialButtonsContainer: {
    gap: 15,
    marginBottom: 25,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#1E90FF',
    fontWeight: '600',
  },

});

export default LoginScreen;