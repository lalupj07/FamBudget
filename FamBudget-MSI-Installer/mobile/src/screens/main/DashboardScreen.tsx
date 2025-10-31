import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const DashboardScreen = () => {
  const theme = useTheme();
  const { household } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/household/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.householdName}>{household?.name}</Text>
        </View>

        {/* Total Balance Card */}
        <Card style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}>
          <Card.Content>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(dashboardData?.totalBalance || 0)}
            </Text>
          </Card.Content>
        </Card>

        {/* Budget Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.budgetRow}>
                <View style={styles.budgetItem}>
                  <Text style={styles.budgetLabel}>Budget</Text>
                  <Text style={styles.budgetValue}>
                    {formatCurrency(dashboardData?.totalBudget || 0)}
                  </Text>
                </View>
                <View style={styles.budgetItem}>
                  <Text style={styles.budgetLabel}>Spent</Text>
                  <Text style={[styles.budgetValue, { color: theme.colors.error }]}>
                    {formatCurrency(dashboardData?.totalSpent || 0)}
                  </Text>
                </View>
                <View style={styles.budgetItem}>
                  <Text style={styles.budgetLabel}>Remaining</Text>
                  <Text style={[styles.budgetValue, { color: theme.colors.secondary }]}>
                    {formatCurrency(dashboardData?.budgetRemaining || 0)}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Envelopes/Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Categories</Text>
          {dashboardData?.envelopes?.map((envelope: any) => (
            <Card key={envelope.id} style={styles.envelopeCard}>
              <Card.Content>
                <View style={styles.envelopeHeader}>
                  <View style={styles.envelopeTitleRow}>
                    <View
                      style={[
                        styles.categoryDot,
                        { backgroundColor: envelope.colorHex || theme.colors.primary },
                      ]}
                    />
                    <Text style={styles.envelopeName}>{envelope.name}</Text>
                  </View>
                  <Text style={styles.envelopeAmount}>
                    {formatCurrency(envelope.spentAmount)}/{formatCurrency(envelope.allocatedAmount)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          (envelope.spentAmount / envelope.allocatedAmount) * 100,
                          100
                        )}%`,
                        backgroundColor: envelope.colorHex || theme.colors.primary,
                      },
                    ]}
                  />
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Card style={styles.actionCard}>
              <Card.Content style={styles.actionContent}>
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.actionText}>Add Expense</Text>
              </Card.Content>
            </Card>
            <Card style={styles.actionCard}>
              <Card.Content style={styles.actionContent}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={32}
                  color={theme.colors.secondary}
                />
                <Text style={styles.actionText}>Invite Member</Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>
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
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.7,
  },
  householdName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  balanceCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
  },
  balanceLabel: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 14,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    elevation: 2,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetItem: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  envelopeCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  envelopeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  envelopeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  envelopeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  envelopeAmount: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 2,
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default DashboardScreen;

