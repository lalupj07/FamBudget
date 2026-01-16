/**
 * Copyright (c) 2025 GenXis Innovations
 * All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Card,
  Text,
  useTheme,
  ActivityIndicator,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';

const AccountsScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add account form
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [accountColor, setAccountColor] = useState('#1976d2');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
      // Mock data matching desktop
      setAccounts([
        {
          id: 1,
          name: 'Primary Checking',
          type: 'checking',
          balance: 12450.0,
        },
        {
          id: 2,
          name: 'Emergency Savings',
          type: 'savings',
          balance: 25000.0,
        },
        {
          id: 3,
          name: 'Chase Credit Card',
          type: 'credit',
          balance: -2845.0,
        },
        {
          id: 4,
          name: 'Retirement 401k',
          type: 'investment',
          balance: 125000.0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    try {
      await api.post('/accounts', {
        name: accountName,
        type: accountType,
        balance: parseFloat(initialBalance) || 0,
        color: accountColor,
      });
      setShowAddModal(false);
      setAccountName('');
      setAccountType('');
      setInitialBalance('');
      loadAccounts();
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/accounts/${id}`);
      loadAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const getAccountTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      checking: 'CHECKING',
      savings: 'SAVINGS',
      credit: 'CREDIT',
      investment: 'INVESTMENT',
    };
    return labels[type] || type.toUpperCase();
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Accounts Grid */}
        <View style={styles.accountsGrid}>
          {accounts.map((account) => {
            const isPositive = account.balance >= 0;

            return (
              <Card
                key={account.id}
                style={[styles.accountCard, { backgroundColor: theme.colors.surface }]}
              >
                <Card.Content>
                  <View style={styles.accountHeader}>
                    <Text style={[styles.accountName, { color: theme.colors.onSurface }]}>
                      {account.name}
                    </Text>
                    <Chip
                      style={[
                        styles.typeBadge,
                        {
                          backgroundColor: theme.colors.surfaceVariant,
                          borderColor: theme.colors.primary,
                        },
                      ]}
                      textStyle={{ color: theme.colors.onSurface, fontSize: 11 }}
                      compact
                    >
                      {getAccountTypeLabel(account.type)}
                    </Chip>
                  </View>

                  <Text
                    style={[
                      styles.accountBalance,
                      { color: isPositive ? theme.colors.success : theme.colors.error },
                    ]}
                  >
                    {formatCurrency(account.balance)}
                  </Text>

                  <View style={styles.actionButtons}>
                    <Button
                      mode="outlined"
                      compact
                      onPress={() => {}}
                      textColor={theme.colors.onSurface}
                      style={styles.actionButton}
                    >
                      Edit
                    </Button>
                    <Button
                      mode="outlined"
                      compact
                      onPress={() => handleDelete(account.id)}
                      textColor={theme.colors.error}
                      style={styles.actionButton}
                    >
                      Delete
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </View>

        {accounts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No accounts yet. Add your first account to get started.
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddModal(true)}
        label="Add Account"
      />

      {/* Add Account Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Add Account</Text>
            <Button icon="close" onPress={() => setShowAddModal(false)} />
          </View>

          <TextInput
            label="Account Name"
            value={accountName}
            onChangeText={setAccountName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Account Type"
            value={accountType}
            onChangeText={setAccountType}
            mode="outlined"
            style={styles.input}
            placeholder="Select Type"
          />

          <TextInput
            label="Initial Balance"
            value={initialBalance}
            onChangeText={setInitialBalance}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Color"
            value={accountColor}
            onChangeText={setAccountColor}
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowAddModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddAccount}
              style={styles.modalButton}
              buttonColor={theme.colors.primary}
            >
              Save Account
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  accountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  accountCard: {
    width: '47%',
    borderRadius: 12,
    marginBottom: 16,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    borderWidth: 1,
    height: 24,
  },
  accountBalance: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
  },
  modal: {
    margin: 20,
    padding: 24,
    borderRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    minWidth: 100,
  },
});

export default AccountsScreen;
