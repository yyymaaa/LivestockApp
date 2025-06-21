//client/app/(tabs)/farmer/index.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import FarmerListingCard from '../../../components/FarmerListingCard';


export default function FarmerHome() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('http:// 192.168.56.1:5000/api/farmer/services')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data from backend'), data;
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
