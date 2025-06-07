import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import AuthenticationButton from '../components/AuthenticationButton';
import AuthPasswordTextField from '../components/AuthPasswordTextField';
import InputField from '../components/InputField';

export default function Admin() {
  const [formData, setFormData] = useState({
    phoneOrEmail: '',
    password: '',
  });

  const { phoneOrEmail, password } = formData;

  const onChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const onSubmit = () => {
    console.log('Submitted:', formData);
    // Add backend logic here
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        <Text style={styles.title}>Admin Portal</Text>
        <Text style={styles.subtitle}>Log in as Admin</Text>

        <InputField
          label="Phone or Email"
          placeholder="Enter phone number or email"
          value={phoneOrEmail}
          onChangeText={(value) => onChange('phoneOrEmail', value)}
        />

        <AuthPasswordTextField
          label="Password"
          value={password}
          onChangeText={(value) => onChange('password', value)}
        />

        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <AuthenticationButton
          label="Log In"
          onPress={onSubmit}
        />

      </View>
    </SafeAreaView>
  );
}

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
});
