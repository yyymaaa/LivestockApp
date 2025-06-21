//client/app/farmer/listingdetails.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ListingDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://192.168.56.1:5000/api/farmer/mylistings/${id}`);
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    fetchListing();
  }, [id]);

  const handleEdit = () => {
    router.push({
      pathname: '/farmer/listingform',
      params: {
        mode: 'edit',
        listing: JSON.stringify(listing),
      },
    });
  };

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this listing?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`http://192.168.56.1:5000/api/farmer/mylistings/${id}`, {
            method: 'DELETE',
            });
            router.back();
          } catch (err) {
            console.error('Delete failed:', err);
          }
        },
      },
    ]);
  };

  if (!listing) {
    return (
      <View style={styles.centered}>
        <Text>Loading listing...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: listing.image_url || 'https://via.placeholder.com/300' }}
        style={styles.image}
      />
      <Text style={styles.title}>{listing.title}</Text>
      <Text style={styles.text}>Description: {listing.description}</Text>
      <Text style={styles.text}>Price: {listing.price}</Text>
      <Text style={styles.text}>Quantity: {listing.quantity}</Text>
      <Text style={styles.text}>Status: {listing.status}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create" size={20} color="white" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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

export default ListingDetails;
