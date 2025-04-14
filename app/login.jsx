// app/login.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { router } from 'expo-router';

export default function Login() {
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/ph_flag_triangle.png')}
        style={styles.flag}
        resizeMode="contain"
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>

        <TextInput style={styles.input} placeholder="Email:" placeholderTextColor="#888" />
        <TextInput style={styles.input} placeholder="Password:" placeholderTextColor="#888" secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={() => router.push('/Personal_Info')}>
  <Text style={styles.buttonText}>Sign In</Text>
</TouchableOpacity>


        <Text style={styles.bottomText}>
          Don't Have an Account?{' '}
          <Link href="/register" style={styles.link}>Sign Up</Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c1c1c', alignItems: 'center', justifyContent: 'center', padding: 20 },
  flag: { width: 150, height: 150, marginBottom: 30 },
  formContainer: { backgroundColor: '#d3d3d3', padding: 20, borderRadius: 20, width: '100%' },
  title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 20, marginBottom: 15 },
  button: { backgroundColor: '#2c2c2c', padding: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  bottomText: { marginTop: 10, textAlign: 'center' },
  link: { color: 'blue' },
});
