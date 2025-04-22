import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from './context/AppContext';

export default function JobDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser, saveJob, applyForJob } = useApp();
  const { job } = route.params;
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleSave = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Please login to save jobs');
      return;
    }

    setIsSaving(true);
    try {
      await saveJob(currentUser.id, job.id);
      Alert.alert('Success', 'Job saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save job');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Please login to apply for jobs');
      return;
    }

    setIsApplying(true);
    try {
      await applyForJob(currentUser.id, job.id);
      Alert.alert('Success', 'Application submitted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Arrow and Header */}
      <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>Job Details</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>{job.location}</Text>
            <Text style={styles.tag}>{job.experience}</Text>
            <Text style={styles.tag}>{job.type}</Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.posted}>Posted 2 days ago</Text>
            <Text style={styles.salary}>{job.salary}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📄 Job Description</Text>
        <Text style={styles.sectionText}>
          {job.description}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛠️ Skills & Requirements</Text>
        <Text style={styles.sectionText}>• {job.experience} experience</Text>
        <Text style={styles.sectionText}>• Degree in Computer Science, Psychology, Design or other related fields.</Text>
        <Text style={styles.sectionText}>• Proficiency in User Personas, Competitive Analysis, Empathy Maps and Information Architecture.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Your Role</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.applyButton, isApplying && styles.buttonDisabled]}
            onPress={handleApply}
            disabled={isApplying}
          >
            <Text style={styles.applyButtonText}>
              {isApplying ? 'Applying...' : 'Apply Now ➡️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Benefits</Text>
        <Text style={styles.sectionText}>
          • Competitive salary and benefits package
        </Text>
        <Text style={styles.sectionText}>
          • Flexible work arrangements
        </Text>
        <Text style={styles.sectionText}>
          • Professional development opportunities
        </Text>
        <Text style={styles.sectionText}>
          • Health and wellness programs
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1c',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align the back arrow and the header vertically
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10, // Space between back arrow and the header text
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  jobHeader: {
    backgroundColor: '#3b18ff',
    borderRadius: 10,
    padding: 15,
  },
  jobTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  company: {
    color: '#d0d0d0',
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginRight: 5,
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posted: {
    color: '#d0d0d0',
    fontSize: 12,
  },
  salary: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  sectionText: {
    color: '#ccc',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#3b18ff',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
