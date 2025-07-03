// client/app/(tabs)/productbuyer/index.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import FarmerListingCard from '../../../components/FarmerListingCard';

export default function ProductBuyerHome() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('http://192.168.0.100:5000/api/productbuyer/products')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched product listings:', data);
        setListings(data);
      })
      .catch(err => {
        console.error('Error fetching product listings:', err);
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
          <Text style={styles.noData}>No product listings available.</Text>
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
