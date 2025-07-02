import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import InputField from '../components/InputField';
import AuthPasswordTextField from '../components/AuthPasswordTextField';
import AuthenticationButton from '../components/AuthenticationButton';
import { AuthenticationContext } from '../contexts/authenticationContext';

import Ionicons from 'react-native-vector-icons/Ionicons';

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { register, isLoading } = useContext(AuthenticationContext);
  const selectedRole = route.params?.role || 'guest';

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: selectedRole,
  });

  useEffect(() => {
    setForm(prev => ({ ...prev, role: selectedRole }));
  }, [selectedRole]);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const passwordChecks = {
    minLength : form.password.length >= 8,
    hasUppercase : /[A-Z]/.test(form.password),
    hasLowercase : /[a-z]/.test(form.password),
    hasDigit : /[0-9]/.test(form.password),
    hasSpecialChar : /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
    noSpaces : !/\s/.test(form.password),

  };

  const isPasswordStrong = Object.values(passwordChecks).every(Boolean);

  const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  if (!isPasswordStrong) {
    alert(
      'Password must be at least 8 characters long and include:\n- uppercase letter\n- lowercase letter\n- number\n- special character\n- no spaces'
    );
    return;
  }

    console.log('Form state before register:', form);
    
  try {
    const success = await register(form.email, form.password, form.role);
    
    if (success) {
      navigation.navigate('Username');
    } else {
      alert('Registration failed. Please try again.');
    }
  } catch (error) {
    console.log('Registration error:', error);
    alert('An unexpected error occurred.');
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
        <Text style={styles.subtitle}>Register to continue</Text>


        <InputField
          label="Email"
          placeholder="Enter your email address"
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
          <RequirementRow valid={passwordChecks.hasUppercase} text="At least one uppercase letter" />
          <RequirementRow valid={passwordChecks.hasLowercase} text="At least one lowercase letter" />
          <RequirementRow valid={passwordChecks.hasDigit} text="At least one number" />
          <RequirementRow valid={passwordChecks.hasSpecialChar} text="At least one special character" />
          <RequirementRow valid={passwordChecks.noSpaces} text="No spaces" />
        </View>

        <AuthenticationButton
          label={isLoading ? 'Registering...' : 'Register'}
          onPress={handleRegister}
          disabled={isLoading}
        />

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
