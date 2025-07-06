// client/components/FarmerListingCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function FarmerListingCard({ listing }) {
  const router = useRouter();

  const handlePress = () => {
    if (listing.service_provider_id) {
      router.push(`/farmer/ViewServiceProviderProfile?id=${listing.service_provider_id}`);
    } else if (listing.farmer_id) {
      router.push(`/productbuyer/ViewFarmerProfile?id=${listing.farmer_id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {/* Provider Name */}
      <Text style={styles.name}>{listing.provider_name}</Text>

      {/* First image or placeholder */}
      {listing.media && listing.media.length > 0 ? (
        <Image source={{ uri: listing.media[0] }} style={styles.image} />
      ) : (
        <Image
          source={{ uri: 'https://via.placeholder.com/300x200?text=No+Image' }}
          style={styles.image}
        />
      )}

      {/* Listing Details */}
      <View style={styles.info}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.description}>{listing.description}</Text>
        <Text style={styles.price}>Price: {listing.price}</Text>
        <Text style={styles.slots}>Available: {listing.available_slots}</Text>
        <Text style={styles.date}>Posted: {new Date(listing.created_at).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: 200,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
    color: '#555',
  },
  price: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  slots: {
    marginTop: 3,
    color: '#666',
  },
  date: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
});
