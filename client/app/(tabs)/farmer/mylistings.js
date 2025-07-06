// client/app/(tabs)/farmer/mylistings.js
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyListings = () => {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [farmerId, setFarmerId] = useState(null);

  useEffect(() => {
    const loadUserAndFetchListings = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData);

        if (user && user.user_id) {
          setFarmerId(user.user_id);

          const res = await fetch(`http://192.168.0.100:5000/api/farmer/mylistings/${user.user_id}`);
          const data = await res.json();
          setListings(data);
        } else {
          console.warn('User data missing or invalid.');
        }
      } catch (error) {
        console.error('Failed to load user or fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndFetchListings();
  }, []);

  const handleAdd = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      router.push({
        pathname: '/farmer/listingform',
        params: {
          mode: 'create',
          farmer_id: user.user_id, // ✅ This will no longer be undefined
        },
      });
    } catch (error) {
      console.error('Failed to navigate to listing form:', error);
    }
  };

  const handlePressCard = (listing) => {
    router.push({
      pathname: '/farmer/listingdetails',
      params: { id: listing.listing_id || listing.offering_id },
    });
  };

  const handleGoBack = () => {
    router.back();
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
        <TouchableOpacity onPress={handleGoBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="green" />
        </TouchableOpacity>

        <Text style={styles.title}>My Listings</Text>

        <TouchableOpacity onPress={handleAdd} style={styles.iconButton}>
          <Ionicons name="add" size={28} color="green" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={listings}
        numColumns={3}
        keyExtractor={(item) =>
          (item.listing_id || item.offering_id || Math.random()).toString()
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePressCard(item)}
          >
            <Image
              source={{
                uri: item.media?.[0]?.url || 'https://via.placeholder.com/150',
              }}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />
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
});

export default MyListings;
