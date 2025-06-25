import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  const serviceProviderId = 1; // Temporary user_id for service provider
  const router = useRouter();

  const handleGoBack = () => router.back();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://192.168.0.100:5000/api/serviceprovider/profile/${serviceProviderId}`);
        const data = await response.json();
        console.log('✅ Service Provider Profile fetched:', data);
        setUser(data.user);
        setEditedUser(data.user);
      } catch (err) {
        console.error('❌ Fetch error:', err);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch(`http://192.168.0.100:5000/api/serviceprovider/profile/${serviceProviderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Update failed');
      }

      Alert.alert('Success', 'Profile updated successfully');
      setUser(data.user);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setIsEditing(false);
    } catch (err) {
      Alert.alert('Error', err.message);
      console.error('❌ Save error:', err);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="green" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../../assets/icon.png')} style={styles.avatar} />
          <Text style={styles.name}>{user.name || 'Name not available'}</Text>
          <Text style={styles.email}>{user.email || 'Email not available'}</Text>
          <Text style={styles.phone}>
            {user.contact ? user.contact.toString() : 'No phone number available'}
          </Text>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.sectionTitle}>Bio</Text>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={editedUser.name}
                onChangeText={text => setEditedUser({ ...editedUser, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={editedUser.email}
                onChangeText={text => setEditedUser({ ...editedUser, email: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={editedUser.contact}
                onChangeText={text => setEditedUser({ ...editedUser, contact: text })}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loading: { textAlign: 'center', marginTop: 50 },
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#666' },
  phone: { fontSize: 16, color: '#666' },
  bioContainer: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  backButtonContainer: {
    paddingTop: 50,
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
});
