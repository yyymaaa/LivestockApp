import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { AuthenticationContext } from '../../contexts/authenticationContext';

const LocationPermissionScreen = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const router = useRouter();
  const { saveLocationToBackend } = useContext(AuthenticationContext);

const handleLocationPermission = async () => {
  console.log('Asking for location permission...');
  setIsRequesting(true);
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('Permission status:', status);

    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Location access is required to show services near you.'
      );
      setIsRequesting(false);
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    console.log('Location obtained:', latitude, longitude);

    try {
      await saveLocationToBackend(latitude, longitude);
      console.log('Location saved to backend');
    } catch (backendError) {
      console.error('Backend saving failed:', backendError);
      Alert.alert('Warning', 'Location not saved, but you can continue.');
    }

    console.log('Redirecting...');
    router.replace('/');
  } catch (err) {
    console.error('Location Error:', err);
    Alert.alert('Error', 'Failed to retrieve or save location.');
  } finally {
    setIsRequesting(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable Location</Text>
      <Text style={styles.subtitle}>
        We use your location to show nearby services tailored for you.
      </Text>

      <TouchableOpacity
        style={[styles.button, isRequesting && styles.disabledButton]}
        onPress={handleLocationPermission}
        disabled={isRequesting}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.buttonText}>
            {isRequesting ? 'Please wait...' : 'Allow Location Access'}
          </Text>
          {isRequesting && <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />}
        </View>
      </TouchableOpacity>
    </View>
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
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#29AB87',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationPermissionScreen;
