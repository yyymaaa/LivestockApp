// client/app/serviceprovider/listingform.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const ListingForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEdit = params.mode === 'edit';
  const listingId = params.id;
  const userId = params.user_id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    available_slots: '',
    status: 'available',
    image: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && listingId) {
      setLoading(true);
      fetch(`http://192.168.0.100:5000/api/serviceprovider/listing/${encodeURIComponent(listingId)}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            title: data.title || '',
            description: data.description || '',
            price: data.price?.toString() || '',
            available_slots: data.available_slots?.toString() || '',
            status: data.status || 'available',
            image: data.media?.[0]?.url || '',
          });
        })
        .catch((err) => {
          console.error('Fetch error:', err);
          Alert.alert('Error', 'Failed to load listing.');
        })
        .finally(() => setLoading(false));
    }
  }, [isEdit, listingId]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const clearField = (key) => {
    setForm((prev) => ({ ...prev, [key]: '' }));
  };

  const handleClearAll = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      available_slots: '',
      status: 'available',
      image: '',
    });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera roll permission is needed.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const ext = filename.split('.').pop();

    formData.append('image', {
      uri,
      name: filename,
      type: `image/${ext}`,
    });

    try {
      const res = await fetch('http://192.168.0.100:5000/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, image: data.url }));
      } else {
        Alert.alert('Upload failed', 'Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', 'Image upload failed.');
    }
  };

  const handleSubmit = async () => {
    const endpoint = isEdit
      ? `http://192.168.0.100:5000/api/serviceprovider/mylistings/${listingId}`
      : `http://192.168.0.100:5000/api/serviceprovider/mylistings`;

    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      ...form,
      ...(isEdit ? {} : { user_id: userId }),
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert(isEdit ? 'Listing updated!' : 'Listing created!');
        router.back();
      } else {
        Alert.alert('Error', data.error || 'An error occurred.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="green" />
        <Text>Loading listing...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="green" />
        </TouchableOpacity>
        <Text style={styles.title}>{isEdit ? 'Edit Listing' : 'Post New Listing'}</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.clear}>Clear</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={pickImage} style={styles.imageUpload}>
        {form.image ? (
          <Image source={{ uri: form.image }} style={styles.imagePreview} />
        ) : (
          <Text style={{ color: 'gray' }}>Tap to upload image</Text>
        )}
      </TouchableOpacity>

      {[
        { key: 'title', placeholder: 'Title' },
        { key: 'description', placeholder: 'Description' },
        { key: 'price', placeholder: 'Price' },
        { key: 'available_slots', placeholder: 'Available Slots' },
        { key: 'status', placeholder: 'Status (available / full / unavailable)' },
      ].map(({ key, placeholder }) => (
        <View key={key} style={styles.inputContainer}>
          <TextInput
            placeholder={placeholder}
            value={form[key]}
            onChangeText={(text) => handleChange(key, text)}
            style={styles.input}
            multiline={key === 'description'}
          />
          <TouchableOpacity onPress={() => clearField(key)}>
            <Ionicons name="close" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isEdit ? 'Update Listing' : 'Post Listing'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
  clear: {
    color: 'gray',
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: '#000',
  },
  button: {
    backgroundColor: 'green',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListingForm;
