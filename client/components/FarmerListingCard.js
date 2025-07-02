import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function FarmerListingCard({ listing }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{listing.provider_name}</Text>

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
    </View>
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