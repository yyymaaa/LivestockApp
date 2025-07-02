import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import { AuthenticationContext } from '../contexts/authenticationContext';

const LocationPermissionScreen = ({ navigation }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const { saveLocationToBackend } = useContext(AuthenticationContext);

  const handleLocationPermission = async () => {
    setIsRequesting(true);
    try {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Location permission is required to proceed.');
    setIsRequesting(false);
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

    try {
      await saveLocationToBackend(latitude, longitude);
    } catch (backendError) {
      console.error('Backend saving failed:', backendError);
      Alert.alert('Warning', 'Location not saved, but you can continue.');
    }

    navigation.replace('Home'); 

  } catch (err) {
    console.error('Location Error:', err);
    Alert.alert('Error', 'Failed to get location.');
  } finally {
    setIsRequesting(false);
  }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable Location</Text>
      <Text style={styles.subtitle}>We use your location to show relevant services nearby.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLocationPermission}
        disabled={isRequesting}
      >
        <Text style={styles.buttonText}>
          {isRequesting ? 'Please wait...' : 'Allow Location Access'}
        </Text>
        {isRequesting && <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />}
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
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#29AB87',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationPermissionScreen;
