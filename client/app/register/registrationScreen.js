import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import InputField from '../../components/InputField';
import AuthPasswordTextField from '../../components/AuthPasswordTextField';
import AuthenticationButton from '../../components/AuthenticationButton';
import { AuthenticationContext } from '../../contexts/authenticationContext';

import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RegistrationScreen = () => {
  const router = useRouter();
  const { role = 'guest' } = useLocalSearchParams(); 
  const { register, isLoading } = useContext(AuthenticationContext);

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role,
  });

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const passwordChecks = {
    minLength: form.password.length >= 8,
    hasUppercase: /[A-Z]/.test(form.password),
    hasLowercase: /[a-z]/.test(form.password),
    hasDigit: /[0-9]/.test(form.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
    noSpaces: !/\s/.test(form.password),
  };

  const isPasswordStrong = Object.values(passwordChecks).every(Boolean);
  const validDomains = ['gmail.com', 'outlook.com', 'yahoo.com'];
  const emailParts = form.email.split('@');
  const emailDomain = emailParts.length === 2 ? emailParts[1].toLowerCase() : '';

  const isValidEmail =
  /\S+@\S+\.\S+/.test(form.email) && validDomains.includes(emailDomain);


  const handleRegister = async () => {
    if (!form.email && !form.password && !form.confirmPassword) {
    Alert.alert('Missing Fields', 'Please fill in all the fields.');
    return;
    }

    if (!form.email) {
      Alert.alert('Missing Email', 'Please enter your email.');
      return;
    }
    if (!form.password) {
      Alert.alert('Missing Password', 'Please enter your password.');
      return;
    }
    if (!form.confirmPassword) {
      Alert.alert('Missing Confirmation', 'Please confirm your password.');
      return;
    }


    if (!isValidEmail) {
    Alert.alert(
    'Invalid Email',
    'Please use a valid email from: gmail.com, outlook.com, or yahoo.com.'
    );
    return;
    }


    if (form.password !== form.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    if (!isPasswordStrong) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters long and include:\n- Uppercase letter\n- Lowercase letter\n- Number\n- Special character\n- No spaces'
      );
      return;
    }

    try {
      const success = await register(form.email, form.password, form.role);
      if (success) {
        router.push('../register/UserNameScreen'); 
      } else {
        Alert.alert('Registration Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const RequirementRow = ({ valid, text }) => (
    <View style={styles.requirementRow}>
      <Ionicons
        name={valid ? 'checkmark-circle' : 'close-circle'}
        size={18}
        color={valid ? 'green' : 'red'}
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.requirementText, { color: valid ? 'green' : 'red' }]}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Register as a {form.role}</Text>

        <InputField
          label="Email"
          placeholder="Enter your email"
          value={form.email}
          onChangeText={text => handleChange('email', text)}
          keyboardType="email-address"
        />

        <AuthPasswordTextField
          label="Password"
          placeholder="Enter a password"
          value={form.password}
          onChangeText={text => handleChange('password', text)}
        />

        <AuthPasswordTextField
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChangeText={text => handleChange('confirmPassword', text)}
        />

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.requirementsTitle}>Password must contain:</Text>
          <RequirementRow valid={passwordChecks.minLength} text="At least 8 characters" />
          <RequirementRow valid={passwordChecks.hasUppercase} text="Uppercase letter" />
          <RequirementRow valid={passwordChecks.hasLowercase} text="Lowercase letter" />
          <RequirementRow valid={passwordChecks.hasDigit} text="A number" />
          <RequirementRow valid={passwordChecks.hasSpecialChar} text="Special character" />
          <RequirementRow valid={passwordChecks.noSpaces} text="No spaces" />
        </View>

        <AuthenticationButton
          label={isLoading ? 'Registering...' : 'Register'}
          onPress={handleRegister}
          disabled={isLoading}
        />

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
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
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  requirementText: {
    fontSize: 13,
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

export default RegistrationScreen;
