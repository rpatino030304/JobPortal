// app/Personal_Info.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function PersonalInfo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/ph_flag_triangle.png')}
        style={styles.flag}
        resizeMode="contain"
      />

      <Text style={styles.header}>
        <Text style={styles.welcome}>Welcome </Text>
        <Text style={styles.to}>to </Text>
        <Text style={styles.dole}>Dole </Text>
        <Text style={styles.portal}>Job Portal</Text>
      </Text>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Personal Information</Text>

        <TextInput style={styles.input} placeholder="Full Name:" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Date Of Birth:" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Gender:" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Email Address:" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Phone Number:" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Address:" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Work Experience:" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Years of Experience:" placeholderTextColor="#888" />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Searching →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c1c1c', alignItems: 'center', paddingTop: 60 },
  flag: { width: 100, height: 100, marginBottom: 10 },
  header: { fontSize: 22, textAlign: 'center', marginBottom: 10 },
  welcome: { color: '#4169e1', fontWeight: 'bold' },
  to: { color: '#fff' },
  dole: { color: '#ffd700', fontWeight: 'bold' },
  portal: { color: '#ff0000', fontWeight: 'bold' },
  formContainer: { backgroundColor: '#d3d3d3', padding: 20, borderRadius: 20, width: '90%', marginTop: 10 },
  title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 20, marginBottom: 10 },
  button: { backgroundColor: '#6a0dad', padding: 12, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
