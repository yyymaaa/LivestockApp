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

  // Mock farmer ID (replace with actual user ID from auth context)
  const farmerId = 1;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`http://192.168.56.1:5000/api/farmer/mylistings/${farmerId}`);
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleAdd = () => {
    router.push('/farmer/listingform');
  };

  const handlePressCard = (listing) => {
    router.push({ pathname: '/farmer/listingdetails', params: { id: listing.offering_id } });
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="green" />
        </TouchableOpacity>
        <Text style={styles.title}>My Listings</Text>
        <TouchableOpacity onPress={handleAdd}>
          <Ionicons name="add" size={28} color="green" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={listings}
        numColumns={3}
        keyExtractor={(item) => item.offering_id.toString()}
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
