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
    price: '',
    quantity: '',
    status: 'available',
  });

  const [loading, setLoading] = useState(false);
  const listingId = params.id;
  const userId = params.farmer_id;

  useEffect(() => {
    if (isEdit && params.listing) {
      try {
        const parsedListing = JSON.parse(params.listing);
        setForm({
          title: parsedListing.title || '',
          image: parsedListing.media?.[0]?.url || '',
          description: parsedListing.description || '',
          price: parsedListing.price_per_unit || '',
          quantity: parsedListing.quantity_available || '',
          status: parsedListing.status?.toLowerCase() || 'available',
        });
      } catch (error) {
        console.error('Error parsing listing:', error);
      }
    }
  }, [isEdit, params.listing]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const clearField = (key) => {
    setForm(prev => ({ ...prev, [key]: key === 'status' ? 'available' : '' }));
  };

  const pickImage = async () => {
    if (loading) return;
    
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera roll permissions needed.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const fileName = uri.split('/').pop();
      const fileType = fileName.split('.').pop();

      formData.append('image', {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      });

      const res = await fetch('http://192.168.0.100:5000/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
      } else {
        Alert.alert('Upload failed', data.error || 'Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Upload failed', 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    // Validate required fields
    if (!form.title || !form.description || !form.price || !form.quantity) {
      Alert.alert('Missing fields', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isEdit
        ? `http://192.168.0.100:5000/api/farmer/mylistings/${listingId}`
        : 'http://192.168.0.100:5000/api/farmer/mylistings';

      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        ...form,
        user_id: userId,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save listing');
      }

      Alert.alert(
        'Success',
        isEdit ? 'Listing updated!' : 'Listing created!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || 'Failed to save listing');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    if (loading) return;
    setForm({
      title: '',
      image: '',
      description: '',
      price: '',
      quantity: '',
      status: 'available',
    });
  };

  const handleBack = () => {
    if (loading) return;
    router.back();
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} disabled={loading}>
          <Ionicons name="arrow-back" size={24} color="green" />
        </TouchableOpacity>
        <Text style={styles.title}>{isEdit ? 'Edit Listing' : 'New Listing'}</Text>
        <TouchableOpacity onPress={handleClearAll} disabled={loading}>
          <Text style={styles.clear}>Clear</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={pickImage} 
        style={styles.imageUpload}
        disabled={loading}
      >
        {form.image ? (
          <Image source={{ uri: form.image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image" size={40} color="gray" />
            <Text style={styles.uploadText}>Tap to upload image</Text>
          </View>
        )}
      </TouchableOpacity>

      {['title', 'description', 'price', 'quantity'].map((field) => (
        <View key={field} style={styles.inputContainer}>
          <TextInput
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChangeText={(text) => handleChange(field, text)}
            style={styles.input}
            multiline={field === 'description'}
            numberOfLines={field === 'description' ? 4 : 1}
            editable={!loading}
          />
          {form[field] ? (
            <TouchableOpacity 
              onPress={() => clearField(field)} 
              disabled={loading}
            >
              <Ionicons name="close" size={20} color="gray" />
            </TouchableOpacity>
          ) : null}
        </View>
      ))}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Status (available/out of stock/limited)"
          value={form.status}
          onChangeText={(text) => handleChange('status', text.toLowerCase())}
          style={styles.input}
          editable={!loading}
        />
        {form.status !== 'available' ? (
          <TouchableOpacity 
            onPress={() => clearField('status')} 
            disabled={loading}
          >
            <Ionicons name="close" size={20} color="gray" />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : isEdit ? 'Update Listing' : 'Post Listing'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  clear: {
    color: 'green',
    fontSize: 16,
  },
  imageUpload: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: 'gray',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#333',
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ListingForm;