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
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://192.168.0.100:5000/api/farmer/profile/3`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data.user);
        setEditedUser(data.user);
      } catch (err) {
        console.error('Profile fetch failed:', err);
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.0.100:5000/api/farmer/profile/3`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedUser.name,
          email: editedUser.email,
          contact: editedUser.contact
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      Alert.alert('Success', 'Profile updated successfully');
      setUser(data.user);
      setIsEditing(false);
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => router.back()}>
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
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={editedUser.name || ''}
                onChangeText={text => setEditedUser({ ...editedUser, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={editedUser.email || ''}
                onChangeText={text => setEditedUser({ ...editedUser, email: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={editedUser.contact || ''}
                onChangeText={text => setEditedUser({ ...editedUser, contact: text })}
              />
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(true)}
            >
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
  error: { textAlign: 'center', marginTop: 50, color: 'red' },
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#666' },
  phone: { fontSize: 16, color: '#666' },
  bioContainer: { marginTop: 20 },
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
    opacity: 1,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  backButtonContainer: {
    paddingTop: 50,
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
});