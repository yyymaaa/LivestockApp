import React, { useState, useContext } from 'react';
import {
        SafeAreaView,
        View,
        Text,
        TouchableOpacity,
        StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { AuthenticationContext } from '../contexts/authenticationContext';
import InputField from '../components/InputField';
import AuthPasswordTextField from '../components/AuthPasswordTextField';
import AuthenticationButton from '../components/AuthenticationButton';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthenticationContext);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    setErrorMessage(null);

      if (!phoneOrEmail.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
      }

      const success = await login(phoneOrEmail, password);
      console.log("Login success:", success);
        if (!success) {
          setErrorMessage('Invalid email or password. Please try again.');
          return;
        } 
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <InputField
          label="Email"
          placeholder="Enter your email"
          value={phoneOrEmail}
          onChangeText={setPhoneOrEmail}
        />

        <AuthPasswordTextField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <AuthenticationButton label="Log In" onPress={handleLogin} />

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>New to the app? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
            <Text style={styles.loginLink}>Register</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#29AB87',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
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
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#29AB87',
    fontWeight: '600',
  },
});

export default LoginScreen;
