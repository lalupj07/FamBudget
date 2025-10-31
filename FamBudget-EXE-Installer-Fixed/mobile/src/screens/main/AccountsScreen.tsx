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
  SegmentedButtons,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../../services/api';

const AccountsScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Add account form
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('joint');
  const [initialBalance, setInitialBalance] = useState('');

  // Transfer form
  const [transferAmount, setTransferAmount] = useState('');
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error loading accounts:', error);
      // Fallback to empty array if API fails
      setAccounts([]);
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
      });
      setShowAddModal(false);
      setAccountName('');
      setInitialBalance('');
      loadAccounts();
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleTransfer = async () => {
    try {
      await api.post('/accounts/transfer', {
        fromAccountId,
        toAccountId,
        amount: parseFloat(transferAmount),
      });
      setShowTransferModal(false);
      setTransferAmount('');
      setFromAccountId('');
      setToAccountId('');
      loadAccounts();
    } catch (error) {
      console.error('Error transferring:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  };

  const getAccountIcon = (type: string) => {
    return type === 'joint' ? 'account-group' : 'account';
  };

  const getAccountColor = (type: string) => {
    return type === 'joint' ? theme.colors.primary : theme.colors.tertiary;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Balance Card */}
        <Card style={[styles.totalCard, { backgroundColor: theme.colors.primary }]}>
          <Card.Content>
            <Text style={styles.totalLabel}>Total Across All Accounts</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(getTotalBalance())}
            </Text>
            <View style={styles.accountCount}>
              <MaterialCommunityIcons name="wallet" size={16} color="#FFFFFF" />
              <Text style={styles.accountCountText}>
                {accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Account Type Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.sectionTitle}>My Accounts</Text>
        </View>

        {/* Account Cards */}
        {accounts.map((account) => (
          <Card key={account.id} style={styles.accountCard}>
            <Card.Content>
              <View style={styles.accountHeader}>
                <View style={styles.accountTitleRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: getAccountColor(account.type) },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={getAccountIcon(account.type)}
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Chip
                      mode="outlined"
                      compact
                      style={styles.typeChip}
                      textStyle={styles.typeChipText}
                    >
                      {account.type === 'joint' ? 'Joint Account' : 'Personal'}
                    </Chip>
                  </View>
                </View>
                <Text style={styles.accountBalance}>
                  {formatCurrency(account.balance)}
                </Text>
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <Button
                  mode="outlined"
                  compact
                  onPress={() => {}}
                  style={styles.actionButton}
                  icon="plus"
                >
                  Deposit
                </Button>
                <Button
                  mode="outlined"
                  compact
                  onPress={() => {}}
                  style={styles.actionButton}
                  icon="minus"
                >
                  Withdraw
                </Button>
                <Button
                  mode="outlined"
                  compact
                  onPress={() => setShowTransferModal(true)}
                  style={styles.actionButton}
                  icon="swap-horizontal"
                >
                  Transfer
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {accounts.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="wallet-outline"
              size={80}
              color={theme.colors.primary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No Accounts Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first account to start managing your money
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Account FAB */}
      <FAB
        icon="plus"
        label="New Account"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddModal(true)}
      />

      {/* Add Account Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text style={styles.modalTitle}>Add New Account</Text>

          <TextInput
            label="Account Name"
            value={accountName}
            onChangeText={setAccountName}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Joint Checking"
          />

          <Text style={styles.inputLabel}>Account Type</Text>
          <SegmentedButtons
            value={accountType}
            onValueChange={setAccountType}
            buttons={[
              { value: 'joint', label: 'Joint', icon: 'account-group' },
              { value: 'personal', label: 'Personal', icon: 'account' },
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Initial Balance (Optional)"
            value={initialBalance}
            onChangeText={setInitialBalance}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            placeholder="0.00"
            left={<TextInput.Affix text="$" />}
          />

          <View style={styles.modalButtons}>
            <Button mode="outlined" onPress={() => setShowAddModal(false)} style={styles.modalButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddAccount}
              style={styles.modalButton}
              disabled={!accountName}
            >
              Add Account
            </Button>
          </View>
        </Modal>

        {/* Transfer Modal */}
        <Modal
          visible={showTransferModal}
          onDismiss={() => setShowTransferModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text style={styles.modalTitle}>Transfer Money</Text>

          <TextInput
            label="Amount"
            value={transferAmount}
            onChangeText={setTransferAmount}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            left={<TextInput.Affix text="$" />}
          />

          <Text style={styles.inputLabel}>From Account</Text>
          <SegmentedButtons
            value={fromAccountId}
            onValueChange={setFromAccountId}
            buttons={accounts.slice(0, 2).map((acc) => ({
              value: acc.id,
              label: acc.name.substring(0, 12),
            }))}
            style={styles.segmentedButtons}
          />

          <Text style={styles.inputLabel}>To Account</Text>
          <SegmentedButtons
            value={toAccountId}
            onValueChange={setToAccountId}
            buttons={accounts.slice(0, 2).map((acc) => ({
              value: acc.id,
              label: acc.name.substring(0, 12),
            }))}
            style={styles.segmentedButtons}
          />

          <View style={styles.modalButtons}>
            <Button mode="outlined" onPress={() => setShowTransferModal(false)} style={styles.modalButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleTransfer}
              style={styles.modalButton}
              disabled={!transferAmount || !fromAccountId || !toAccountId || fromAccountId === toAccountId}
            >
              Transfer
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
    paddingBottom: 80,
  },
  totalCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
  },
  totalLabel: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 14,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  accountCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountCountText: {
    color: '#FFFFFF',
    opacity: 0.9,
    marginLeft: 6,
    fontSize: 14,
  },
  filterContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  accountTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  typeChip: {
    alignSelf: 'flex-start',
    height: 24,
  },
  typeChipText: {
    fontSize: 11,
    marginVertical: 0,
  },
  accountBalance: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  modal: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default AccountsScreen;

