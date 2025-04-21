import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation hook
import { Ionicons } from '@expo/vector-icons'; // <-- Make sure this is installed

export default function JobDetails() {
  const navigation = useNavigation(); // Create a navigation instance

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
          <Text style={styles.jobTitle}>Sr. UX Designer</Text>
          <Text style={styles.company}>Google</Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>Remote</Text>
            <Text style={styles.tag}>Freshers</Text>
            <Text style={styles.tag}>Fulltime</Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.posted}>Posted 2 days ago</Text>
            <Text style={styles.salary}>$50K/mo</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📄 Job Description</Text>
        <Text style={styles.sectionText}>
          In a UX Designer job, you’ll need both types of skills to develop the next generation of products.
          You’ll partner with Researchers and Designers to define and deliver new features.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛠️ Skills & Requirements</Text>
        <Text style={styles.sectionText}>• 3 years experience</Text>
        <Text style={styles.sectionText}>• Degree in Computer Science, Psychology, Design or other related fields.</Text>
        <Text style={styles.sectionText}>• Proficiency in User Personas, Competitive Analysis, Empathy Maps and Information Architecture.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Your Role</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply Now ➡️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Benefits</Text>
        <Text style={styles.sectionText}>
          Lorem ipsum dolor sit amet consectetur. Ut sit tincidunt nec quis vel quisque nunc egestas.
        </Text>
        <Text style={styles.sectionText}>
          Lorem ipsum dolor sit amet consectetur. Ut sit tincidunt nec quis vel quisque nunc egestas.
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
  backArrow: {
    marginRight: 10, // Space between back arrow and the header text
  },
  backArrowText: {
    fontSize: 30,
    color: '#fff',
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
});
