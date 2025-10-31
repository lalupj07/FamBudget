import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, useTheme, ActivityIndicator, FAB, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../../services/api';

const GoalsScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await api.get('/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error loading goals:', error);
      // Fallback to empty array if API fails
      setGoals([]);
    } finally {
      setLoading(false);
    }
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

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="flag-checkered"
              size={80}
              color={theme.colors.primary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No Goals Yet</Text>
            <Text style={styles.emptySubtitle}>
              Set your first financial goal and start saving together
            </Text>
          </View>
        ) : (
          goals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <Card key={goal.id} style={styles.goalCard}>
                <Card.Content>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleContainer}>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      {goal.description && (
                        <Text style={styles.goalDescription}>{goal.description}</Text>
                      )}
                    </View>
                    <MaterialCommunityIcons
                      name="flag"
                      size={32}
                      color={theme.colors.primary}
                    />
                  </View>

                  <View style={styles.amountContainer}>
                    <View>
                      <Text style={styles.amountLabel}>Current</Text>
                      <Text style={[styles.amountValue, { color: theme.colors.secondary }]}>
                        {formatCurrency(goal.currentAmount)}
                      </Text>
                    </View>
                    <View style={styles.amountDivider} />
                    <View>
                      <Text style={styles.amountLabel}>Target</Text>
                      <Text style={styles.amountValue}>
                        {formatCurrency(goal.targetAmount)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.progressContainer}>
                    <ProgressBar
                      progress={progress / 100}
                      color={theme.colors.primary}
                      style={styles.progressBar}
                    />
                    <Text style={styles.progressText}>{progress.toFixed(0)}% complete</Text>
                  </View>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons
                        name="cash-multiple"
                        size={20}
                        color={theme.colors.outline}
                      />
                      <Text style={styles.detailText}>
                        {formatCurrency(remaining)} to go
                      </Text>
                    </View>
                    {goal.deadline && (
                      <View style={styles.detailItem}>
                        <MaterialCommunityIcons
                          name="calendar"
                          size={20}
                          color={theme.colors.outline}
                        />
                        <Text style={styles.detailText}>
                          {new Date(goal.deadline).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>

      <FAB
        icon="plus"
        label="New Goal"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          // TODO: Navigate to add goal screen
          console.log('Add new goal - implement navigation');
        }}
      />
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 100,
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
  goalCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  goalName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  amountDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  amountLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
    textAlign: 'center',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default GoalsScreen;

