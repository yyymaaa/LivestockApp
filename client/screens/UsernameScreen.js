import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthenticationContext } from '../contexts/authenticationContext';

import { Ionicons } from '@expo/vector-icons';

const UsernameScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);

  const {
    checkUsernameAvailability,
    saveUsernameToBackend,
  } = useContext(AuthenticationContext);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (validateUsername(username)) {
        checkAvailability(username);
      } else {
        setIsAvailable(null);
      }
    }, 600); 

    return () => clearTimeout(delayDebounce);
  }, [username]);

  const validateUsername = (name) => {
    const noSpaces = /^\S+$/;
    const minLength = name.length >= 3;
    return noSpaces.test(name) && minLength;
  };

  const checkAvailability = async (name) => {
    setIsChecking(true);
    try {
      const available = await checkUsernameAvailability(name);
      setIsAvailable(available);
    } catch (error) {
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

const handleSave = async () => {
  if (!validateUsername(username) || !isAvailable || usernameSaved) return;

  try {
    setIsSubmitting(true);
    await AsyncStorage.setItem('username', username);

    const success = await saveUsernameToBackend(username);

    if (success) {
      setUsernameSaved(true); 
      navigation.navigate('LocationPermission');
    } else {
      alert('Could not save username, but you can proceed.');
      navigation.navigate('LocationPermission'); 
    }

  } catch (err) {
    alert('Error saving username');
    console.log('Save error:', err);

    navigation.navigate('LocationPermission'); 
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create a Username</Text>
      <Text style={styles.subtitle}>This will be your public identity.</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a unique username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {username.length > 0 && (
        <View style={styles.feedbackContainer}>
          {isChecking ? (
          <ActivityIndicator size="small" color="#29AB87" />
           ) 
           : isAvailable === true ? 
           (
           <View style={styles.feedbackRow}>
             <Ionicons name="checkmark-circle" size={20} color="green" style={styles.icon} />
             <Text style={styles.available}>Username is available</Text>
            </View>
            ) 
            : isAvailable === false ? 
            (
            <View style={styles.feedbackRow}>
             <Ionicons name="close-circle" size={20} color="red" style={styles.icon} />
             <Text style={styles.unavailable}>Username is taken</Text>
            </View>
            ) : null}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          (!validateUsername(username) || !isAvailable) && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={!validateUsername(username) || !isAvailable || isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Text>
      </TouchableOpacity>
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
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  feedbackContainer: {
    marginBottom: 16,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 6,
  },
  available: {
    color: 'green',
    fontSize: 14,
  },
  unavailable: {
    color: 'red',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#a0cfc0',
  },
  button: {
  backgroundColor: '#29AB87',
  padding: 16,
  borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UsernameScreen;
