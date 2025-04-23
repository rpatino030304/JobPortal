import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from './context/AppContext';

export default function Closed() {
  const navigation = useNavigation();
  const { currentUser } = useApp();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.userIconContainer}
        onPress={() => navigation.navigate('UserInfo')}
      >
        {currentUser?.profilePicture ? (
          <Image
            source={{ uri: currentUser.profilePicture }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.defaultAvatar}>
            <Text style={styles.userIcon}>
              {currentUser?.username?.charAt(0)?.toUpperCase() || '👤'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.greeting}>
        Hello {currentUser?.username || 'Guest'} 👋
      </Text>
      <Text style={styles.header}>Find Jobs</Text>

      <View style={styles.tabScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Matched Job', 'Saved', 'Applied', 'News', 'Closed'].map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, tab === 'Closed' && styles.activeTab]}
              onPress={() => {
                if (tab === 'Matched Job') navigation.navigate('Home');
                else if (tab === 'Saved') navigation.navigate('Save');
                else if (tab === 'Applied') navigation.navigate('Applied');
                else if (tab === 'News') navigation.navigate('News');
              }}
            >
              <Text style={[styles.tabText, tab === 'Closed' && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchSection}>
        <TextInput placeholder="Search for Jobs..." placeholderTextColor="#999" style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={{ color: '#fff' }}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No closed jobs</Text>
        <Text style={styles.emptyStateSubText}>Closed job positions will appear here</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    flexGrow: 1,
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabScroll: {
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 8,
    marginBottom: 8,
  },
  activeTab: {
    backgroundColor: '#5A31F4',
  },
  tabText: {
    color: '#bbb',
    fontSize: 13,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#fff',
    height: 40,
  },
  filterButton: {
    backgroundColor: '#5A31F4',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  jobCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
  },
  jobTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  company: {
    color: '#eee',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    color: '#fff',
    fontSize: 12,
  },
  description: {
    color: '#ddd',
    marginBottom: 10,
  },
  salary: {
    color: '#f44336',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
  },
  userIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  defaultAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5A31F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIcon: {
    fontSize: 16,
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateSubText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
});
