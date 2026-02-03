import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  List,
  Text,
  useTheme,
  Divider,
  Switch,
  Avatar,
  TextInput,
  Button,
  Portal,
  Dialog,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useAppTheme } from '../../contexts/ThemeContext';
import { api } from '../../services/api';

const SettingsScreen = () => {
  const theme = useTheme();
  const { user, household, logout, updateUser } = useAuth();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingName, setEditingName] = useState(user?.name || '');
  const [editingEmail, setEditingEmail] = useState(user?.email || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'This feature will be available soon!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditingName(user?.name || '');
    setEditingEmail(user?.email || '');
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!editingName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setUpdatingProfile(true);
    try {
      const response = await api.patch('/members/profile', {
        name: editingName.trim(),
        email: editingEmail.trim(),
      });
      
      if (updateUser) {
        updateUser(response.data);
      }
      
      setShowEditProfile(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Avatar.Text
            size={80}
            label={user?.name?.substring(0, 2).toUpperCase() || 'U'}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.householdName}>{household?.name}</Text>
          <Button
            mode="outlined"
            onPress={handleEditProfile}
            style={styles.editButton}
            icon="pencil"
            compact
          >
            Edit Profile
          </Button>
        </View>

        <Divider />

        {/* Household Settings */}
        <List.Section>
          <List.Subheader>Household</List.Subheader>
          <List.Item
            title="Members"
            description="Manage household members"
            left={(props) => <List.Icon {...props} icon="account-group" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Invite Member"
            description="Add a new member to your household"
            left={(props) => <List.Icon {...props} icon="account-plus" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Household Settings"
            description="Currency, timezone, and more"
            left={(props) => <List.Icon {...props} icon="home-cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>

        <Divider />

        {/* Appearance */}
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark themes"
            left={(props) => <List.Icon {...props} icon={isDarkMode ? "weather-night" : "weather-sunny"} />}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
              />
            )}
          />
        </List.Section>

        <Divider />

        {/* Security */}
        <List.Section>
          <List.Subheader>Security & Privacy</List.Subheader>
          <List.Item
            title="Biometric Lock"
            description="Use fingerprint or face ID"
            left={(props) => <List.Icon {...props} icon="fingerprint" />}
            right={() => (
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
              />
            )}
          />
          <List.Item
            title="Change Password"
            description="Update your password"
            left={(props) => <List.Icon {...props} icon="lock-reset" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Two-Factor Authentication"
            description="Add an extra layer of security"
            left={(props) => <List.Icon {...props} icon="shield-lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>

        <Divider />

        {/* Notifications */}
        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Push Notifications"
            description="Receive alerts and reminders"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />
          <List.Item
            title="Notification Settings"
            description="Customize your notifications"
            left={(props) => <List.Icon {...props} icon="bell-cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>

        <Divider />

        {/* Data & Storage */}
        <List.Section>
          <List.Subheader>Data & Storage</List.Subheader>
          <List.Item
            title="Export Data"
            description="Download your data as CSV/PDF"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleExportData}
          />
          <List.Item
            title="Cloud Backup"
            description="Backup your data securely"
            left={(props) => <List.Icon {...props} icon="cloud-upload" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </List.Section>

        <Divider />

        {/* About */}
        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Help & Support"
            description="Get help with FamBudget"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
        </List.Section>

        <Divider />

        {/* Danger Zone */}
        <List.Section>
          <List.Subheader style={{ color: theme.colors.error }}>Danger Zone</List.Subheader>
          <List.Item
            title="Logout"
            titleStyle={{ color: theme.colors.error }}
            left={(props) => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
            onPress={handleLogout}
          />
          <List.Item
            title="Delete Account"
            description="Permanently delete your account and all data"
            titleStyle={{ color: theme.colors.error }}
            left={(props) => <List.Icon {...props} icon="delete-forever" color={theme.colors.error} />}
            onPress={handleDeleteAccount}
          />
        </List.Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for families</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Dialog */}
      <Portal>
        <Dialog
          visible={showEditProfile}
          onDismiss={() => setShowEditProfile(false)}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={editingName}
              onChangeText={setEditingName}
              mode="outlined"
              style={styles.dialogInput}
              autoCapitalize="words"
            />
            <TextInput
              label="Email"
              value={editingEmail}
              onChangeText={setEditingEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditProfile(false)}>Cancel</Button>
            <Button
              onPress={handleSaveProfile}
              mode="contained"
              loading={updatingProfile}
              disabled={updatingProfile}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  householdName: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '600',
  },
  editButton: {
    marginTop: 16,
  },
  dialogInput: {
    marginBottom: 12,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
  },
});

export default SettingsScreen;

