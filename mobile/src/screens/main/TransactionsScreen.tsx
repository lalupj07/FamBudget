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
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
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
  Menu,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { api } from '../../services/api';

const TransactionsScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Filters
  const [filterAccount, setFilterAccount] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // Add transaction form
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, [filterAccount, filterCategory]);

  const loadData = async () => {
    try {
      const [transactionsRes, accountsRes] = await Promise.all([
        api.get('/transactions', {
          params: {
            ...(filterAccount && { accountId: filterAccount }),
            ...(filterCategory && { category }),
          },
        }),
        api.get('/accounts'),
      ]);
      
      setTransactions(transactionsRes.data || []);
      setAccounts(accountsRes.data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(transactionsRes.data?.map((t: any) => t.category) || [])
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading data:', error);
      // Mock data for development
      setTransactions([
        {
          id: 1,
          date: '2025-01-15',
          description: 'Monthly Salary - John',
          category: 'Income',
          account: 'Primary Checking',
          amount: 4500,
        },
        {
          id: 2,
          date: '2025-01-14',
          description: 'Freelance Web Design',
          category: 'Income',
          account: 'Primary Checking',
          amount: 1200,
        },
        {
          id: 3,
          date: '2025-01-14',
          description: 'Whole Foods Grocery',
          category: 'Food & Dining',
          account: 'Primary Checking',
          amount: -185,
        },
        {
          id: 4,
          date: '2025-01-13',
          description: 'Electric Bill',
          category: 'Utilities',
          account: 'Primary Checking',
          amount: -145,
        },
        {
          id: 5,
          date: '2025-01-12',
          description: 'Netflix Subscription',
          category: 'Entertainment',
          account: 'Primary Checking',
          amount: -15,
        },
      ]);
      setAccounts([
        { id: 1, name: 'Primary Checking' },
        { id: 2, name: 'Savings Account' },
      ]);
      setCategories(['Income', 'Food & Dining', 'Utilities', 'Entertainment', 'Transportation']);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    try {
      await api.post('/transactions', {
        amount: parseFloat(amount),
        description,
        category,
        accountId: account,
        date: date.toISOString(),
      });
      setShowAddModal(false);
      setAmount('');
      setDescription('');
      setCategory('');
      setAccount('');
      loadData();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      loadData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const renderTransaction = ({ item }: { item: any }) => {
    const isIncome = item.amount >= 0;

    return (
      <View style={[styles.transactionRow, { borderBottomColor: theme.colors.surfaceVariant }]}>
        <View style={styles.transactionCell}>
          <Text style={[styles.transactionText, { color: theme.colors.onSurface }]}>
            {format(new Date(item.date), 'M/d/yyyy')}
          </Text>
        </View>
        <View style={[styles.transactionCell, { flex: 2 }]}>
          <Text style={[styles.transactionText, { color: theme.colors.onSurface }]}>
            {item.description}
          </Text>
        </View>
        <View style={styles.transactionCell}>
          <Text style={[styles.transactionText, { color: theme.colors.onSurfaceVariant }]}>
            {item.category}
          </Text>
        </View>
        <View style={styles.transactionCell}>
          <Text style={[styles.transactionText, { color: theme.colors.onSurfaceVariant }]}>
            {item.account}
          </Text>
        </View>
        <View style={styles.transactionCell}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isIncome ? theme.colors.success : theme.colors.onSurface },
            ]}
          >
            {isIncome ? '+' : ''}
            {formatCurrency(item.amount)}
          </Text>
        </View>
        <View style={styles.transactionCell}>
          <View style={styles.actionButtons}>
            <Button
              mode="text"
              compact
              onPress={() => {}}
              textColor={theme.colors.onSurfaceVariant}
              style={styles.actionButton}
            >
              Edit
            </Button>
            <Button
              mode="text"
              compact
              onPress={() => handleDelete(item.id)}
              textColor={theme.colors.error}
              style={styles.actionButton}
            >
              Delete
            </Button>
          </View>
        </View>
      </View>
    );
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
      {/* Filter Bar */}
      <Card style={[styles.filterCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.filterContent}>
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>
              Account:
            </Text>
            <Menu
              visible={false}
              onDismiss={() => {}}
              anchor={
                <Button
                  mode="outlined"
                  compact
                  onPress={() => {}}
                  style={styles.filterButton}
                  contentStyle={styles.filterButtonContent}
                >
                  {filterAccount || 'All Accounts'}
                </Button>
              }
            >
              <Menu.Item onPress={() => setFilterAccount('')} title="All Accounts" />
              {accounts.map((acc) => (
                <Menu.Item
                  key={acc.id}
                  onPress={() => setFilterAccount(acc.id)}
                  title={acc.name}
                />
              ))}
            </Menu>
          </View>

          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>
              Category:
            </Text>
            <Menu
              visible={false}
              onDismiss={() => {}}
              anchor={
                <Button
                  mode="outlined"
                  compact
                  onPress={() => {}}
                  style={styles.filterButton}
                  contentStyle={styles.filterButtonContent}
                >
                  {filterCategory || 'All Categories'}
                </Button>
              }
            >
              <Menu.Item onPress={() => setFilterCategory('')} title="All Categories" />
              {categories.map((cat) => (
                <Menu.Item key={cat} onPress={() => setFilterCategory(cat)} title={cat} />
              ))}
            </Menu>
          </View>

          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>
              Date Range:
            </Text>
            <View style={styles.dateInputs}>
              <TextInput
                mode="outlined"
                placeholder="mm/dd/yyyy"
                value={startDate ? format(startDate, 'MM/dd/yyyy') : ''}
                style={styles.dateInput}
                dense
                right={<TextInput.Icon icon="calendar" />}
              />
              <TextInput
                mode="outlined"
                placeholder="mm/dd/yyyy"
                value={endDate ? format(endDate, 'MM/dd/yyyy') : ''}
                style={styles.dateInput}
                dense
                right={<TextInput.Icon icon="calendar" />}
              />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Transactions Table */}
      <Card style={[styles.tableCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          {/* Table Header */}
          <View style={[styles.tableHeader, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.headerText, { color: theme.colors.onSurface }]}>Date</Text>
            <Text style={[styles.headerText, { color: theme.colors.onSurface }]}>Description</Text>
            <Text style={[styles.headerText, { color: theme.colors.onSurface }]}>Category</Text>
            <Text style={[styles.headerText, { color: theme.colors.onSurface }]}>Account</Text>
            <Text style={[styles.headerText, { color: theme.colors.onSurface }]}>Amount</Text>
            <Text style={[styles.headerText, { color: theme.colors.onSurface }]}>Actions</Text>
          </View>

          {/* Transactions List */}
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No transactions found
                </Text>
              </View>
            }
          />
        </Card.Content>
      </Card>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddModal(true)}
        label="Add Transaction"
      />

      {/* Add Transaction Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              Add Transaction
            </Text>
            <Button icon="close" onPress={() => setShowAddModal(false)} />
          </View>

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Category"
            value={category}
            onChangeText={setCategory}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Account"
            value={account}
            onChangeText={setAccount}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Date"
            value={format(date, 'MM/dd/yyyy')}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Icon icon="calendar" />}
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
              onPress={handleAddTransaction}
              style={styles.modalButton}
              buttonColor={theme.colors.primary}
            >
              Save Transaction
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
  filterCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  filterContent: {
    gap: 16,
  },
  filterGroup: {
    gap: 4,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  filterButton: {
    marginTop: 4,
  },
  filterButtonContent: {
    height: 36,
  },
  dateInputs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  dateInput: {
    flex: 1,
  },
  tableCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 8,
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 8,
    alignItems: 'center',
  },
  transactionCell: {
    flex: 1,
  },
  transactionText: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    minWidth: 50,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
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

export default TransactionsScreen;
