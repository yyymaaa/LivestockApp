// client/components/FarmerListingCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FarmerListingCard({ listing }) {
  const router = useRouter();

  const handlePress = () => {
    if (listing.service_provider_id) {
      router.push(`/farmer/ViewServiceProviderProfile?id=${listing.service_provider_id}`);
    } else if (listing.farmer_id) {
      router.push(`/productbuyer/ViewFarmerProfile?id=${listing.farmer_id}`);
    }
  };

  const handleContactPress = () => {
    if (listing.contact) {
      Linking.openURL(`tel:${listing.contact}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {/* Provider Header */}
      <View style={styles.header}>
        <Text style={styles.providerName}>{listing.provider_name}</Text>
        
        {/* Contact Information */}
        {listing.contact ? (
          <TouchableOpacity 
            style={styles.contactContainer}
            onPress={handleContactPress}
          >
            <Ionicons name="call" size={16} color="green" />
            <Text style={styles.contactText}>{listing.contact}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noContact}>No contact provided</Text>
        )}
      </View>

      {/* Listing Image */}
      <Image
        source={{ uri: listing.media?.[0] || 'https://via.placeholder.com/300x200?text=No+Image' }}
        style={styles.image}
      />

      {/* Listing Details */}
      <View style={styles.details}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.description}>{listing.description}</Text>
        
        <View style={styles.footer}>
          <Text style={styles.price}>{listing.price}</Text>
          <Text style={styles.slots}>{listing.available_slots}</Text>
        </View>
        
        <Text style={styles.date}>
          Posted: {new Date(listing.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  providerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
  },
  contactText: {
    marginLeft: 6,
    color: 'green',
    fontSize: 14,
  },
  noContact: {
    color: '#6c757d',
    fontSize: 14,
    fontStyle: 'italic',
  },
  image: {
    width: '100%',
    height: 200,
  },
  details: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#495057',
    marginBottom: 12,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  price: {
    fontWeight: 'bold',
    color: '#28a745',
    fontSize: 16,
  },
  slots: {
    color: '#6c757d',
    fontSize: 14,
  },
  date: {
    color: '#6c757d',
    fontSize: 12,
    textAlign: 'right',
  },
});