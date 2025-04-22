import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from './context/AppContext';

export default function Saved() {
  const navigation = useNavigation();
  const { currentUser, jobs, savedJobs, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSavedJobs, setFilteredSavedJobs] = useState([]);

  useEffect(() => {
    if (savedJobs && jobs) {
      const savedJobIds = savedJobs.map(saved => saved.jobId);
      const savedJobDetails = jobs.filter(job => savedJobIds.includes(job.id));
      setFilteredSavedJobs(savedJobDetails);
    }
  }, [savedJobs, jobs]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = filteredSavedJobs.filter(job =>
        job.title.toLowerCase().includes(text.toLowerCase()) ||
        job.company.toLowerCase().includes(text.toLowerCase()) ||
        job.location.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSavedJobs(filtered);
    } else {
      const savedJobIds = savedJobs.map(saved => saved.jobId);
      const savedJobDetails = jobs.filter(job => savedJobIds.includes(job.id));
      setFilteredSavedJobs(savedJobDetails);
    }
  };

  const handleCardClick = (job) => {
    navigation.navigate('JobDetails', { job });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A31F4" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.userIconContainer}
        onPress={() => navigation.navigate('UserInfo')}
      >
        <Text style={styles.userIcon}>👤</Text>
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
              style={[styles.tab, tab === 'Saved' && styles.activeTab]}
              onPress={() => {
                if (tab === 'Matched Job') navigation.navigate('Home');
                else if (tab === 'Applied') navigation.navigate('Applied');
                else if (tab === 'News') navigation.navigate('News');
                else if (tab === 'Closed') navigation.navigate('Closed');
              }}
            >
              <Text style={[styles.tabText, tab === 'Saved' && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          placeholder="Search for Jobs..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={{ color: '#fff' }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {filteredSavedJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No saved jobs found</Text>
        </View>
      ) : (
        filteredSavedJobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            onPress={() => handleCardClick(job)}
          >
            <View style={[styles.jobCard, { backgroundColor: '#5A31F4' }]}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.company}>{job.company}</Text>
              <View style={styles.tags}>
                <Text style={styles.tag}>{job.location}</Text>
                <Text style={styles.tag}>{job.experience}</Text>
                <Text style={styles.tag}>{job.type}</Text>
              </View>
              <Text style={styles.description}>
                {job.description}
              </Text>
              <Text style={styles.salary}>{job.salary}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
  },
  userIcon: {
    fontSize: 20,
    color: '#fff',
  },
  userIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 30,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
