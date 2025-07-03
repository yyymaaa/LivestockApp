//client/app/(tabs)/farmer/index.js
/*
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import FarmerListingCard from '../../../components/FarmerListingCard';

export default function FarmerHome() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    try {
      console.log(' Fetching listings from backend...');
      const response = await fetch('http://192.168.0.105:5000/api/farmer/services', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      console.log(` Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(' Received data:', data);
      
      setListings(data);
      setError(null);
    } catch (err) {
      console.error(' Fetch error:', err);
      setError(err.message);
      Alert.alert('Error', 'Failed to load listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading listings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {listings.length > 0 ? (
          listings.map((item, index) => (
            <FarmerListingCard 
              key={`${item.offering_id}-${index}`} 
              listing={item} 
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.noData}>No active listings available</Text>
            <Text style={styles.hint}>
              {listings === null ? 
                'Could not load listings' : 
                'Check back later or create a new listing'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noData: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  hint: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
*/

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import FarmerListingCard from '../../../components/FarmerListingCard';


export default function FarmerHome() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('http://192.168.0.100:5000/api/farmer/services')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data from backend', data);
        setListings(data);
      })
      .catch(err => {
        console.error('Failed to fetch listings:', err);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {listings.length > 0 ? (
          listings.map((item, index) => (
            <FarmerListingCard key={index} listing={item} />
          ))
        ) : (
          <Text style={styles.noData}>No active listings available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 10,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});
