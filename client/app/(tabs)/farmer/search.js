import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['tractor', 'pesticide', 'vet service']);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(`http://192.168.56.1:5000/api/farmer/searchlistings?query=${encodeURIComponent(query)}`);

      const data = await response.json();
      console.log('Search results:', data);  // Debugging
      setResults(data);

      // Add to recent searches if not already there
      setRecentSearches(prev => {
        const updated = [query, ...prev.filter(q => q !== query)];
        return updated.slice(0, 5); // Keep only last 5 searches
      });
      
      setSearchSubmitted(true);
    } catch (error) {
      console.error('Search fetch error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Row: Back + Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" style={styles.backIcon} />
        </TouchableOpacity>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search services..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          onSubmitEditing={handleSearch}
        />

        <TouchableOpacity 
          onPress={() => {
            setQuery('');
            setSearchSubmitted(false);
            setResults([]);
          }}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Show search results */}
      {searchSubmitted && query ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          
          {results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => item.offering_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultCard}
                  onPress={() => router.push({
                    pathname: '/farmer/listingdetails',
                    params: { id: item.offering_id },
                  })}
                >
                  {/* Listing image */}
                  {item.image_url ? (
                    <Image 
                      source={{ uri: item.image_url }}
                      style={styles.resultImage}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image-outline" size={30} color="#ccc" />
                    </View>
                  )}
                  
                  {/* Listing details */}
                  <View style={styles.resultDetails}>
                    <Text style={styles.resultTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    
                    <Text style={styles.resultDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    
                    <View style={styles.metaContainer}>
                      <Text style={styles.resultPrice}>${item.price}</Text>
                      <Text style={styles.resultProvider}>{item.provider_name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={styles.noResultsText}>No matching listings found</Text>
            </View>
          )}
        </View>
      ) : (
        // Recent searches section
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          
          {recentSearches.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.recentItem}
              onPress={() => {
                setQuery(item);
                handleSearch();
              }}
            >
              <Ionicons name="time-outline" size={20} color="#888" style={styles.recentIcon} />
              <Text style={styles.recentText}>{item}</Text>
            </TouchableOpacity>
          ))}
          
          {recentSearches.length === 0 && (
            <Text style={styles.noRecent}>No recent searches</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    fontSize: 16,
  },
  cancelButton: {
    marginLeft: 10,
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  resultsContainer: {
    flex: 1,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  resultDetails: {
    flex: 1,
  },
  resultTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  resultDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultPrice: {
    fontWeight: '700',
    color: '#2e7d32',
    fontSize: 16,
  },
  resultProvider: {
    color: '#555',
    fontSize: 13,
    fontStyle: 'italic',
  },
  separator: {
    height: 15,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noResultsText: {
    marginTop: 15,
    fontSize: 16,
    color: '#888',
  },
  recentContainer: {
    flex: 1,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentIcon: {
    marginRight: 12,
  },
  recentText: {
    fontSize: 16,
    color: '#555',
  },
  noRecent: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 16,
  },
});