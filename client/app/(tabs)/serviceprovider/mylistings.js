//client/app/(tabs)/serviceprovider/mylistings.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MyListings = () => {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const serviceProviderId = 1; // Temporary: hardcoded, will use login later

  useEffect(() => {
    const fetchListings = async () => {
     const url = `http://192.168.0.100:5000/api/serviceprovider/mylistings/${serviceProviderId}`;
      console.log('🔍 Fetching listings for user ID:', serviceProviderId);
      console.log('🌐 API URL:', url);

      try {
        const res = await fetch(url);
        console.log('📡 Response status:', res.status);
        
        const data = await res.json();
        console.log('📦 Fetched data:', JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
          setListings(data);
        } else {
          console.warn('API did not return an array:', data);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleAdd = () => {
    router.push('/serviceprovider/listingform');
  };

  const handlePressCard = (listing) => {
    router.push({
      pathname: '/serviceprovider/listingdetails',
      params: { id: listing.offering_id },
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.title}>My Listings</Text>
        <TouchableOpacity onPress={handleAdd} style={styles.iconButton}>
          <Ionicons name="add" size={28} color="green" />
        </TouchableOpacity>
      </View>

      {listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No listings found.</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          numColumns={3}
          keyExtractor={(item) =>
            item.offering_id?.toString() || Math.random().toString()
          }
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            console.log('Rendering item:', item);
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handlePressCard(item)}
              >
                <Image
                  source={{
                    uri:
                      item.media?.[0]?.url || 'https://via.placeholder.com/150',
                  }}
                  style={styles.image}
                />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  iconButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  list: {
    paddingHorizontal: 5,
  },
  card: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default MyListings;