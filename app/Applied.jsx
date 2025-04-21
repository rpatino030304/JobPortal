import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ... same imports

export default function Applied() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.userIconContainer}
        onPress={() => navigation.navigate('UserInfo')}
      >
        <Text style={styles.userIcon}>👤</Text>
      </TouchableOpacity>
      <Text style={styles.greeting}>Hello John Doe 👋</Text>
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
        <TextInput placeholder="Search for Jobs..." placeholderTextColor="#999" style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={{ color: '#fff' }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Pending Card */}
      <View style={[styles.jobCard, { backgroundColor: '#F4B400' }]}>
  <Text style={styles.jobTitle}>Frontend Developer</Text>
  <Text style={styles.company}>Amazon</Text>
  <View style={styles.tags}>
    <Text style={styles.tag}>Remote</Text>
    <Text style={styles.tag}>1-2 years</Text>
    <Text style={styles.tag}>Fulltime</Text>
  </View>
  <Text style={styles.description}>
    Your application is under review. The employer will get back to you shortly.
  </Text>
  <Text style={styles.salary}>$40K/mo</Text>
  <Text style={styles.statusLabel}>Pending</Text>
</View>


      {/* Approved Card */}
      <View style={[styles.jobCard, { backgroundColor: '#186915' }]}>
  <Text style={styles.jobTitle}>Backend Engineer</Text>
  <Text style={styles.company}>Meta</Text>
  <View style={styles.tags}>
    <Text style={styles.tag}>New York</Text>
    <Text style={styles.tag}>3-5 years</Text>
    <Text style={styles.tag}>Contract</Text>
  </View>
  <Text style={styles.description}>
    Congratulations! Your application has been approved. Check your email for next steps.
  </Text>
  <Text style={styles.salary}>$55K/mo</Text>
  <Text style={styles.statusLabel}>Approved</Text>
</View>


      {/* Rejected Card */}
      <View style={[styles.jobCard, { backgroundColor: '#D92626' }]}>
  <Text style={styles.jobTitle}>UI Engineer</Text>
  <Text style={styles.company}>Netflix</Text>
  <View style={styles.tags}>
    <Text style={styles.tag}>San Francisco</Text>
    <Text style={styles.tag}>2-4 years</Text>
    <Text style={styles.tag}>Contract</Text>
  </View>
  <Text style={styles.description}>
    Unfortunately, this position is no longer available or your application was not selected.
  </Text>
  <Text style={styles.salary}>$60K/mo</Text>
  <Text style={styles.statusLabel}>Rejected</Text>
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
});
