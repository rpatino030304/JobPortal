import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from './context/AppContext';
import * as ImagePicker from 'expo-image-picker';

export default function UserInfo() {
  const navigation = useNavigation();
  const { currentUser, logout, updateUser, deleteUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    experience: currentUser?.experience || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePicture: currentUser?.profilePicture || null,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Sorry, we need camera roll permissions to make this work!',
          [{ text: 'OK', style: 'cancel' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        handleChange('profilePicture', result.assets[0].uri);
        await updateUser(currentUser.id, { profilePicture: result.assets[0].uri });
        Alert.alert(
          'Success',
          'Profile picture updated successfully!',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update profile picture. Please try again.',
        [{ text: 'OK', style: 'destructive' }]
      );
    }
  };

  const handleSave = async () => {
    try {
      await updateUser(currentUser.id, {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        experience: formData.experience,
        profilePicture: formData.profilePicture,
      });
      setIsEditing(false);
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again.',
        [{ text: 'OK', style: 'destructive' }]
      );
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      Alert.alert(
        'Error',
        'Please fill in all password fields',
        [{ text: 'OK', style: 'destructive' }]
      );
      return;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert(
        'Error',
        'New password must be at least 6 characters long',
        [{ text: 'OK', style: 'destructive' }]
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert(
        'Error',
        'New passwords do not match',
        [{ text: 'OK', style: 'destructive' }]
      );
      return;
    }

    try {
      await updateUser(currentUser.id, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      Alert.alert(
        'Success',
        'Password changed successfully!',
        [{ text: 'OK', style: 'default' }]
      );
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to change password. Please try again.',
        [{ text: 'OK', style: 'destructive' }]
      );
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              'Confirm Password',
              'Please enter your password to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async (password) => {
                    try {
                      await deleteUser(currentUser.id, password);
                      Alert.alert(
                        'Success',
                        'Account deleted successfully!',
                        [{ text: 'OK', style: 'default' }]
                      );
                      navigation.navigate('Login');
                    } catch (error) {
                      Alert.alert(
                        'Error',
                        error.message || 'Failed to delete account. Please try again.',
                        [{ text: 'OK', style: 'destructive' }]
                      );
                    }
                  },
                },
              ],
              'secure-text'
            );
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert(
        'Success',
        'Logged out successfully!',
        [{ text: 'OK', style: 'default' }]
      );
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to logout. Please try again.',
        [{ text: 'OK', style: 'destructive' }]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header and Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>User Profile</Text>
      </View>

      {/* Profile Avatar */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity 
          onPress={isEditing ? pickImage : undefined} 
          style={styles.avatarWrapper}
        >
          {formData.profilePicture ? (
            <Image
              source={{ uri: formData.profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>
          )}
          {isEditing && (
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.username}>{currentUser?.username}</Text>
        <Text style={styles.userrole}>{currentUser?.role}</Text>
      </View>

      {/* Info Box */}
      <View style={styles.profileBox}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Username</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
            />
          ) : (
            <Text style={styles.value}>{currentUser?.username}</Text>
          )}
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.value}>{currentUser?.email}</Text>
          )}
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{currentUser?.phone || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Location</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(value) => handleChange('location', value)}
            />
          ) : (
            <Text style={styles.value}>{currentUser?.location || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Experience</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.experience}
              onChangeText={(value) => handleChange('experience', value)}
            />
          ) : (
            <Text style={styles.value}>{currentUser?.experience || 'Not set'}</Text>
          )}
        </View>
      </View>

      {isEditing ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <View style={styles.passwordBox}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={formData.currentPassword}
          onChangeText={(value) => handleChange('currentPassword', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={formData.newPassword}
          onChangeText={(value) => handleChange('newPassword', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange('confirmPassword', value)}
        />
        <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
          <Text style={styles.changePasswordText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5A31F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5A31F4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1c1c1c',
  },
  username: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userrole: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  profileBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#3a3a3a',
    marginVertical: 12,
  },
  editButton: {
    backgroundColor: '#5A31F4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#186915',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  changePasswordButton: {
    backgroundColor: '#5A31F4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  changePasswordText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerZone: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  dangerTitle: {
    color: '#ff4444',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#5A31F4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
