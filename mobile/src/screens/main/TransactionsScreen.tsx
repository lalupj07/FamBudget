import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import {
  Card,
  Text,
  useTheme,
  ActivityIndicator,
  FAB,
  Chip,
  Portal,
  Modal,
  TextInput,
  Button,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { api } from '../../services/api';
import { ReceiptCapture } from '../../components/ReceiptCapture';

const TransactionsScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceiptCapture, setShowReceiptCapture] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // New transaction form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('household');

  useEffect(() => {
    loadTransactions();
  }, [filterCategory]);

  const loadTransactions = async () => {
    try {
      const params = filterCategory ? { category: filterCategory } : {};
      const response = await api.get('/transactions', { params });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    try {
      await api.post('/transactions', {
        amount: parseFloat(amount),
        description,
        type,
        category,
        date: new Date().toISOString(),
      });
      setShowAddModal(false);
      setAmount('');
      setDescription('');
      loadTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleReceiptCaptured = (imageUri: string) => {
    // TODO: Process receipt with OCR and auto-fill transaction form
    console.log('Receipt captured:', imageUri);
    // For now, just show the add transaction modal
    setShowAddModal(true);
  };

  const renderTransaction = ({ item }: { item: any }) => {
    const isExpense = item.type === 'expense';
    const categoryColor = getCategoryColor(item.category);

    return (
      <Card style={styles.transactionCard}>
        <Card.Content>
          <View style={styles.transactionRow}>
            <View style={styles.transactionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: categoryColor }]}>
                <MaterialCommunityIcons
                  name={getCategoryIcon(item.category)}
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDesc}>
                  {item.description || item.category}
                </Text>
                <Text style={styles.transactionDate}>
                  {format(new Date(item.date), 'MMM d, yyyy')}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: isExpense ? theme.colors.error : theme.colors.secondary },
              ]}
            >
              {isExpense ? '-' : '+'}${item.amount.toFixed(2)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      household: 'home',
      bills: 'receipt',
      groceries: 'cart',
      personal: 'account',
      savings: 'piggy-bank',
      travel: 'airplane',
      entertainment: 'movie',
      healthcare: 'medical-bag',
    };
    return icons[category] || 'cash';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      household: '#1565C0',
      bills: '#FF9800',
      groceries: '#8BC34A',
      personal: '#9C27B0',
      savings: '#00ACC1',
      travel: '#FF7043',
    };
    return colors[category] || theme.colors.primary;
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
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={!filterCategory}
            onPress={() => setFilterCategory(null)}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip
            selected={filterCategory === 'household'}
            onPress={() => setFilterCategory('household')}
            style={styles.filterChip}
          >
            Household
          </Chip>
          <Chip
            selected={filterCategory === 'bills'}
            onPress={() => setFilterCategory('bills')}
            style={styles.filterChip}
          >
            Bills
          </Chip>
          <Chip
            selected={filterCategory === 'groceries'}
            onPress={() => setFilterCategory('groceries')}
            style={styles.filterChip}
          >
            Groceries
          </Chip>
          <Chip
            selected={filterCategory === 'personal'}
            onPress={() => setFilterCategory('personal')}
            style={styles.filterChip}
          >
            Personal
          </Chip>
        </ScrollView>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add your first transaction</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddModal(true)}
      />

      {/* Receipt Capture FAB */}
      <FAB
        icon="camera"
        style={[styles.receiptFab, { backgroundColor: theme.colors.secondary }]}
        onPress={() => setShowReceiptCapture(true)}
      />

      {/* Add Transaction Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text style={styles.modalTitle}>Add Transaction</Text>

          <SegmentedButtons
            value={type}
            onValueChange={setType}
            buttons={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' },
            ]}
            style={styles.segmentedButtons}
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
            label="Description"
            value={description}
            onChangeText={setDescription}
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

          <View style={styles.modalButtons}>
            <Button mode="outlined" onPress={() => setShowAddModal(false)} style={styles.modalButton}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleAddTransaction} style={styles.modalButton}>
              Add
            </Button>
          </View>
        </Modal>

        {/* Receipt Capture Modal */}
        <ReceiptCapture
          visible={showReceiptCapture}
          onClose={() => setShowReceiptCapture(false)}
          onReceiptCaptured={handleReceiptCaptured}
        />
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
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  filterChip: {
    marginHorizontal: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  transactionCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
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
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  receiptFab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
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
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
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

export default TransactionsScreen;

