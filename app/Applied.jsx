import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from './context/AppContext';

export default function Applied() {
  const navigation = useNavigation();
  const { currentUser, jobs, appliedJobs, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppliedJobs, setFilteredAppliedJobs] = useState([]);

  useEffect(() => {
    if (appliedJobs && jobs) {
      const appliedJobIds = appliedJobs.map(applied => applied.jobId);
      const appliedJobDetails = jobs.filter(job => appliedJobIds.includes(job.id));
      setFilteredAppliedJobs(appliedJobDetails);
    }
  }, [appliedJobs, jobs]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const appliedJobIds = appliedJobs.map(applied => applied.jobId);
      const appliedJobDetails = jobs.filter(job => appliedJobIds.includes(job.id));
      const filtered = appliedJobDetails.filter(job =>
        job.title.toLowerCase().includes(text.toLowerCase()) ||
        job.company.toLowerCase().includes(text.toLowerCase()) ||
        job.location.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAppliedJobs(filtered);
    } else {
      const appliedJobIds = appliedJobs.map(applied => applied.jobId);
      const appliedJobDetails = jobs.filter(job => appliedJobIds.includes(job.id));
      setFilteredAppliedJobs(appliedJobDetails);
    }
  };

  const handleCardClick = (job) => {
    navigation.navigate('JobDetails', { job });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#F4B400';
      case 'approved':
        return '#186915';
      case 'rejected':
        return '#D92626';
      default:
        return '#5A31F4';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
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
              style={[styles.tab, tab === 'Applied' && styles.activeTab]}
              onPress={() => {
                if (tab === 'Matched Job') navigation.navigate('Home');
                else if (tab === 'Saved') navigation.navigate('Save');
                else if (tab === 'News') navigation.navigate('News');
                else if (tab === 'Closed') navigation.navigate('Closed');
              }}
            >
              <Text style={[styles.tabText, tab === 'Applied' && styles.activeTabText]}>
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

      {filteredAppliedJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No applied jobs found</Text>
        </View>
      ) : (
        filteredAppliedJobs.map((job) => {
          const application = appliedJobs.find(app => app.jobId === job.id);
          return (
            <TouchableOpacity
              key={job.id}
              onPress={() => handleCardClick(job)}
            >
              <View style={[styles.jobCard, { backgroundColor: getStatusColor(application.status) }]}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.company}>{job.company}</Text>
                <View style={styles.tags}>
                  <Text style={styles.tag}>{job.location}</Text>
                  <Text style={styles.tag}>{job.experience}</Text>
                  <Text style={styles.tag}>{job.type}</Text>
                </View>
                <Text style={styles.description}>
                  {application.status === 'pending' && 'Your application is under review. The employer will get back to you shortly.'}
                  {application.status === 'approved' && 'Congratulations! Your application has been approved. Check your email for next steps.'}
                  {application.status === 'rejected' && 'Unfortunately, this position is no longer available or your application was not selected.'}
                </Text>
                <Text style={styles.salary}>{job.salary}</Text>
                <Text style={styles.statusLabel}>{getStatusText(application.status)}</Text>
              </View>
            </TouchableOpacity>
          );
        })
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
  statusLabel: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
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
