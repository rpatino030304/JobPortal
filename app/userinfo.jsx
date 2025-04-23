import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from './context/AppContext';
import * as ImagePicker from 'expo-image-picker';

// Constants
const ALERTS = {
  PERMISSION_DENIED: {
    title: 'Permission Denied',
    message: 'Sorry, we need camera roll permissions to make this work!',
    button: { text: 'OK', style: 'cancel' }
  },
  PROFILE_PICTURE_SUCCESS: {
    title: 'Success',
    message: 'Profile picture updated successfully!',
    button: { text: 'OK', style: 'default' }
  },
  PROFILE_PICTURE_ERROR: {
    title: 'Error',
    message: 'Failed to update profile picture. Please try again.',
    button: { text: 'OK', style: 'destructive' }
  },
  PROFILE_UPDATE_SUCCESS: {
    title: 'Success',
    message: 'Profile updated successfully!',
    button: { text: 'OK', style: 'default' }
  },
  PROFILE_UPDATE_ERROR: {
    title: 'Error',
    message: 'Failed to update profile. Please try again.',
    button: { text: 'OK', style: 'destructive' }
  },
  PASSWORD_ERROR: {
    EMPTY_FIELDS: {
      title: 'Error',
      message: 'Please fill in all password fields',
      button: { text: 'OK', style: 'destructive' }
    },
    LENGTH: {
      title: 'Error',
      message: 'New password must be at least 6 characters long',
      button: { text: 'OK', style: 'destructive' }
    },
    MISMATCH: {
      title: 'Error',
      message: 'New passwords do not match',
      button: { text: 'OK', style: 'destructive' }
    }
  },
  PASSWORD_SUCCESS: {
    title: 'Success',
    message: 'Password changed successfully!',
    button: { text: 'OK', style: 'default' }
  },
  PASSWORD_ERROR_GENERAL: {
    title: 'Error',
    message: 'Failed to change password. Please try again.',
    button: { text: 'OK', style: 'destructive' }
  },
  DELETE_ACCOUNT: {
    title: 'Delete Account',
    message: 'Are you sure you want to delete your account? This action cannot be undone.',
    buttons: [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive' }
    ]
  },
  DELETE_CONFIRM: {
    title: 'Confirm Password',
    message: 'Please enter your password to confirm account deletion',
    buttons: [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive' }
    ]
  },
  DELETE_SUCCESS: {
    title: 'Success',
    message: 'Account deleted successfully!',
    button: { text: 'OK', style: 'default' }
  },
  DELETE_ERROR: {
    title: 'Error',
    message: 'Failed to delete account. Please try again.',
    button: { text: 'OK', style: 'destructive' }
  },
  LOGOUT_SUCCESS: {
    title: 'Success',
    message: 'Logged out successfully!',
    button: { text: 'OK', style: 'default' }
  },
  LOGOUT_ERROR: {
    title: 'Error',
    message: 'Failed to logout. Please try again.',
    button: { text: 'OK', style: 'destructive' }
  },
  VALIDATION_ERROR: {
    title: 'Validation Error',
    message: 'Please fix the errors in the form',
    button: { text: 'OK', style: 'destructive' }
  },
  error: {
    validation: {
      required: 'This field is required',
      minLength: 'Must be at least {min} characters',
      maxLength: 'Must be at most {max} characters',
      email: 'Invalid email format',
      phone: 'Invalid phone number format',
      password: 'Password must contain at least one letter and one number'
    }
  }
};

const FORM_FIELDS = {
  username: { label: 'Username', min: 3, max: 20, required: true },
  fullName: { label: 'Full Name', min: 2, max: 50, required: true },
  email: { label: 'Email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, required: true },
  phone: { label: 'Phone', pattern: /^\+?[\d\s-]{10,}$/ },
  location: { label: 'Location', min: 2, max: 50 },
  experience: { label: 'Experience', min: 1, max: 50 },
  currentPassword: { label: 'Current Password', min: 6, required: true },
  newPassword: { label: 'New Password', min: 6, required: true },
  confirmPassword: { label: 'Confirm Password', min: 6, required: true }
};

export default function UserInfo() {
  const navigation = useNavigation();
  const { currentUser, logout, updateUser, deleteUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const formData = useRef({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      formData.current = {
        username: currentUser.username || '',
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        location: currentUser.location || '',
        experience: currentUser.experience || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  }, [currentUser]);

  // Memoized values
  const userInitials = useMemo(() => {
    return currentUser?.username?.charAt(0)?.toUpperCase() || '👤';
  }, [currentUser?.username]);

  const isFormValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Validation functions
  const validateField = useCallback((field, value) => {
    const rules = FORM_FIELDS[field];
    if (!rules) return null;

    if (rules.required && !value?.trim()) {
      return ALERTS.error.validation.required;
    }

    if (rules.min && value?.length < rules.min) {
      return ALERTS.error.validation.minLength.replace('{min}', rules.min);
    }

    if (rules.max && value?.length > rules.max) {
      return ALERTS.error.validation.maxLength.replace('{max}', rules.max);
    }

    if (rules.pattern && !rules.pattern.test(value?.trim())) {
      if (field === 'email') return ALERTS.error.validation.email;
      if (field === 'phone') return ALERTS.error.validation.phone;
      if (field.includes('Password')) return ALERTS.error.validation.password;
    }

    return null;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.entries(formData.current).forEach(([field, value]) => {
      // Skip password fields during general form validation
      if (field === 'currentPassword' || field === 'newPassword' || field === 'confirmPassword') {
        return;
      }

      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField]);

  const validatePasswordChange = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    const passwordFields = ['currentPassword', 'newPassword', 'confirmPassword'];
    passwordFields.forEach(field => {
      const error = validateField(field, formData.current[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    if (isValid && formData.current.newPassword !== formData.current.confirmPassword) {
      newErrors.confirmPassword = ALERTS.PASSWORD_ERROR.MISMATCH.message;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [validateField]);

  // Optimized handlers
  const handleChange = useCallback((field, value) => {
    formData.current[field] = value;
    if (errors[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  }, [errors, validateField]);

  const showAlert = useCallback((alert) => {
    Alert.alert(alert.title, alert.message, Array.isArray(alert.buttons) ? alert.buttons : [alert.button]);
  }, []);

  const pickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert(ALERTS.PERMISSION_DENIED);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setIsLoading(true);
        await updateUser(currentUser.id, { profilePicture: result.assets[0].uri });
        showAlert(ALERTS.PROFILE_PICTURE_SUCCESS);
      }
    } catch (error) {
      showAlert(ALERTS.PROFILE_PICTURE_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, updateUser, showAlert]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      showAlert(ALERTS.VALIDATION_ERROR);
      return;
    }

    try {
      setIsLoading(true);
      const updatedData = {
        username: formData.current.username,
        fullName: formData.current.fullName,
        email: formData.current.email,
        phone: formData.current.phone,
        location: formData.current.location,
        experience: formData.current.experience
      };

      // Only include profilePicture if it has been changed
      if (formData.current.profilePicture !== currentUser.profilePicture) {
        updatedData.profilePicture = formData.current.profilePicture;
      }

      await updateUser(currentUser.id, updatedData);
      setIsEditing(false);
      showAlert(ALERTS.PROFILE_UPDATE_SUCCESS);
    } catch (error) {
      const errorMessage = error.message || ALERTS.PROFILE_UPDATE_ERROR.message;
      showAlert({
        title: ALERTS.PROFILE_UPDATE_ERROR.title,
        message: errorMessage,
        button: { text: 'OK', style: 'destructive' }
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, formData, showAlert, updateUser, validateForm]);

  const handleChangePassword = useCallback(async () => {
    if (!validatePasswordChange()) return;

    try {
      setIsLoading(true);
      await updateUser(currentUser.id, {
        currentPassword: formData.current.currentPassword,
        newPassword: formData.current.newPassword,
      });
      showAlert(ALERTS.PASSWORD_SUCCESS);
      setIsChangingPassword(false);
      formData.current.currentPassword = '';
      formData.current.newPassword = '';
      formData.current.confirmPassword = '';
    } catch (error) {
      showAlert(ALERTS.PASSWORD_ERROR_GENERAL);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, formData, showAlert, updateUser, validatePasswordChange]);

  const handleDeleteAccount = useCallback(() => {
    const confirmDeletion = () => {
      Alert.prompt(
        ALERTS.DELETE_CONFIRM.title,
        ALERTS.DELETE_CONFIRM.message,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async (password) => {
              if (!password) {
                showAlert({
                  title: 'Error',
                  message: 'Password is required to delete your account',
                  button: { text: 'OK', style: 'destructive' }
                });
                return;
              }

              try {
                setIsLoading(true);
                await deleteUser(currentUser.id, password);
                showAlert(ALERTS.DELETE_SUCCESS);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }]
                });
              } catch (error) {
                const errorMessage = error.message || ALERTS.DELETE_ERROR.message;
                showAlert({
                  title: ALERTS.DELETE_ERROR.title,
                  message: errorMessage,
                  button: { text: 'OK', style: 'destructive' }
                });
              } finally {
                setIsLoading(false);
              }
            }
          }
        ],
        'secure-text'
      );
    };

    Alert.alert(
      ALERTS.DELETE_ACCOUNT.title,
      ALERTS.DELETE_ACCOUNT.message,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDeletion
        }
      ]
    );
  }, [currentUser, deleteUser, navigation, showAlert]);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await logout();
      showAlert(ALERTS.LOGOUT_SUCCESS);
      navigation.navigate('Login');
    } catch (error) {
      showAlert(ALERTS.LOGOUT_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [logout, navigation, showAlert]);

  // Optimized UI components
  const renderField = useCallback((field) => {
    const { label } = FORM_FIELDS[field];
    
    // Skip password fields in profile edit section
    if (field === 'currentPassword' || field === 'newPassword' || field === 'confirmPassword') {
      return null;
    }

    return (
      <View style={styles.infoRow} key={field}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <>
            <TextInput
              style={[styles.input, errors[field] && styles.inputError]}
              value={formData.current[field]}
              onChangeText={(value) => handleChange(field, value)}
              keyboardType={field === 'email' ? 'email-address' : field === 'phone' ? 'phone-pad' : 'default'}
              autoCapitalize={field === 'email' ? 'none' : 'words'}
            />
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
          </>
        ) : (
          <Text style={styles.value}>{formData.current[field] || 'Not set'}</Text>
        )}
        <View style={styles.separator} />
      </View>
    );
  }, [isEditing, formData, errors, handleChange]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A31F4" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            {currentUser?.profilePicture ? (
              <Image
                source={{ uri: currentUser.profilePicture }}
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
          {Object.keys(FORM_FIELDS).map(renderField)}
        </View>

        {isEditing ? (
          <TouchableOpacity 
            style={[styles.saveButton, !isFormValid && styles.buttonDisabled]} 
            onPress={handleSave}
            disabled={!isFormValid}
          >
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
            value={formData.current.currentPassword}
            onChangeText={(value) => handleChange('currentPassword', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={formData.current.newPassword}
            onChangeText={(value) => handleChange('newPassword', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={formData.current.confirmPassword}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
