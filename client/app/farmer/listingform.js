//client/app/farmer/listingform.js
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ListingForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEdit = params.mode === 'edit';

  const [form, setForm] = useState({
    title: '',
    image: '',
    description: '',
    price_per_unit: '',
    quantity_available: '',
    status: 'available',
  });

  const listingId = params.id;
  const userId = params.user_id;

  useEffect(() => {
    if (isEdit && params.listing) {
      const parsed = JSON.parse(params.listing);
      setForm(parsed);
    }
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const clearField = (key) => {
    setForm({ ...form, [key]: '' });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera roll permissions needed.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    const fileName = uri.split('/').pop();
    const fileType = fileName.split('.').pop();

    formData.append('image', {
      uri,
      name: fileName,
      type: `image/${fileType}`,
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
        setForm({ ...form, image: data.url });
      } else {
        Alert.alert('Upload failed', 'Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Upload failed', 'Server error.');
    }
  };

  const handleSubmit = async () => {
    const endpoint = isEdit
      ? `http://192.168.0.100:5000/api/farmer/mylistings/${listingId}`
      : 'http://192.168.0.100:5000/api/farmer/mylistings';

    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      ...form,
      status: form.status.toLowerCase(),
      ...(isEdit ? {} : { user_id: userId }),
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
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
      Alert.alert('Error', 'Server connection error.');
    }
  };

  const handleClearAll = () => {
    setForm({
      title: '',
      image: '',
      description: '',
      price_per_unit: '',
      quantity_available: '',
      status: 'available',
    });
  };

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
        { key: 'price_per_unit', placeholder: 'Price per unit' },
        { key: 'quantity_available', placeholder: 'Quantity available' },
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

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Status (available / limited stock / unavailable)"
          value={form.status}
          onChangeText={(text) => handleChange('status', text)}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => clearField('status')}>
          <Ionicons name="close" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isEdit ? 'Update Listing' : 'Post Listing'}</Text>
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
});

export default ListingForm;
