import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  const handleCardClick = () => {
    navigation.navigate('JobDetails');
  };

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
              style={[styles.tab, tab === 'Matched Job' && styles.activeTab]}
              onPress={() => {
                if (tab === 'Saved') navigation.navigate('Save');
                else if (tab === 'Applied') navigation.navigate('Applied');
                else if (tab === 'News') navigation.navigate('News');
                else if (tab === 'Closed') navigation.navigate('Closed');
              }}
            >
              <Text style={[styles.tabText, tab === 'Matched Job' && styles.activeTabText]}>
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
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={{ color: '#fff' }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Job Card 1 */}
      <TouchableOpacity onPress={handleCardClick}>
        <View style={[styles.jobCard, { backgroundColor: '#5A31F4' }]}>
          <Text style={styles.jobTitle}>UX Designer</Text>
          <Text style={styles.company}>Google</Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>New York</Text>
            <Text style={styles.tag}>3 years exp.</Text>
            <Text style={styles.tag}>Fulltime</Text>
          </View>
          <Text style={styles.description}>
            UX Designers are the synthesis of design and development. They take Google’s most innovative product concepts...Read More
          </Text>
          <Text style={styles.salary}>$50K/mo</Text>
        </View>
      </TouchableOpacity>

      {/* Job Card 2 */}
      <TouchableOpacity onPress={handleCardClick}>
        <View style={[styles.jobCard, { backgroundColor: '#D92626' }]}>
          <Text style={styles.jobTitle}>Project Manager</Text>
          <Text style={styles.company}>Airbnb</Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>Sydney</Text>
            <Text style={styles.tag}>1-5 years exp.</Text>
            <Text style={styles.tag}>Part-time</Text>
          </View>
          <Text style={styles.description}>
            Airbnb was born in 2007 when two Hosts welcomed three guests to their San Francisco home...Read More
          </Text>
          <Text style={styles.salary}>$25K/mo</Text>
        </View>
      </TouchableOpacity>

      {/* Job Card 3 */}
      <TouchableOpacity onPress={handleCardClick}>
        <View style={[styles.jobCard, { backgroundColor: '#F4B400' }]}>
          <Text style={styles.jobTitle}>Graphic Designer</Text>
          <Text style={styles.company}>Spotify</Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>Remote</Text>
            <Text style={styles.tag}>Freshers</Text>
            <Text style={styles.tag}>Fulltime</Text>
          </View>
          <Text style={styles.description}>
            UX Designers are the synthesis of design and development. They take Google’s most innovative product concepts...Read More
          </Text>
          <Text style={styles.salary}>$500K/mo</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabScroll: {
    marginBottom: 20
  },
  container: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    flexGrow: 1
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 8,
    marginBottom: 8
  },
  activeTab: {
    backgroundColor: '#5A31F4'
  },
  tabText: {
    color: '#bbb',
    fontSize: 13
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#fff',
    height: 40
  },
  filterButton: {
    backgroundColor: '#5A31F4',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10
  },
  jobCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 15
  },
  jobTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  company: {
    color: '#eee',
    marginBottom: 8
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    color: '#fff',
    fontSize: 12
  },
  description: {
    color: '#ddd',
    marginBottom: 10
  },
  salary: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right'
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
  userIcon: {
    fontSize: 20,
    color: '#fff',
  },
  
});
