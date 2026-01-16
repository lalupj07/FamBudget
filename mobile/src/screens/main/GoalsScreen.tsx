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
import { Card, Text, useTheme, ActivityIndicator, FAB, Portal, Modal, TextInput, Button, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { differenceInDays } from 'date-fns';

const GoalsScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add goal form
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState('high');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await api.get('/goals');
      setGoals(response.data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
      // Mock data matching desktop
      setGoals([
        {
          id: 1,
          name: 'Emergency Fund (6 months)',
          currentAmount: 25000,
          targetAmount: 30000,
          targetDate: '2026-12-31',
          priority: 'high',
        },
        {
          id: 2,
          name: 'European Vacation',
          currentAmount: 3500,
          targetAmount: 8000,
          targetDate: '2025-06-15',
          priority: 'high',
        },
        {
          id: 3,
          name: 'New Car Fund',
          currentAmount: 8500,
          targetAmount: 25000,
          targetDate: '2026-03-01',
          priority: 'medium',
        },
        {
          id: 4,
          name: 'Wedding Fund',
          currentAmount: 12000,
          targetAmount: 20000,
          targetDate: '2025-09-01',
          priority: 'high',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    try {
      await api.post('/goals', {
        name: goalName,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        targetDate,
        priority,
      });
      setShowAddModal(false);
      setGoalName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setTargetDate('');
      setPriority('high');
      loadGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/goals/${id}`);
      loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysLeft = (targetDate: string) => {
    const days = differenceInDays(new Date(targetDate), new Date());
    return days;
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      high: theme.colors.error,
      medium: theme.colors.chartTertiary,
      low: theme.colors.chartPrimary,
    };
    return colors[priority] || theme.colors.outline;
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
        {/* Goals Grid */}
        <View style={styles.goalsGrid}>
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const daysLeft = getDaysLeft(goal.targetDate);
            const priorityColor = getPriorityColor(goal.priority);

            return (
              <Card
                key={goal.id}
                style={[styles.goalCard, { backgroundColor: theme.colors.surface }]}
              >
                <Card.Content>
                  <View style={styles.goalHeader}>
                    <Text style={[styles.goalName, { color: theme.colors.onSurface }]}>
                      {goal.name}
                    </Text>
                    <Chip
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: priorityColor + '20' },
                      ]}
                      textStyle={{ color: priorityColor, fontSize: 11, fontWeight: '600' }}
                      compact
                    >
                      {goal.priority.toUpperCase()}
                    </Chip>
                  </View>

                  <Text style={[styles.amountText, { color: theme.colors.onSurface }]}>
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </Text>

                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          backgroundColor: theme.colors.surfaceVariant,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${progress}%`,
                            backgroundColor: theme.colors.success,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.progressDetails}>
                    <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                      {progress.toFixed(1)}% complete
                    </Text>
                    <Text style={[styles.daysText, { color: theme.colors.onSurfaceVariant }]}>
                      {daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                    </Text>
                  </View>

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
                      onPress={() => handleDelete(goal.id)}
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

        {goals.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No savings goals yet. Add your first goal to start tracking.
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddModal(true)}
        label="Add Goal"
      />

      {/* Add Goal Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              Add Savings Goal
            </Text>
            <Button icon="close" onPress={() => setShowAddModal(false)} />
          </View>

          <TextInput
            label="Goal Name"
            value={goalName}
            onChangeText={setGoalName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Target Amount"
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Current Amount"
            value={currentAmount}
            onChangeText={setCurrentAmount}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Target Date"
            value={targetDate}
            onChangeText={setTargetDate}
            mode="outlined"
            style={styles.input}
            placeholder="mm/dd/yyyy"
            right={<TextInput.Icon icon="calendar" />}
          />

          <TextInput
            label="Priority"
            value={priority}
            onChangeText={setPriority}
            mode="outlined"
            style={styles.input}
            placeholder="Select Priority"
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
              onPress={handleAddGoal}
              style={styles.modalButton}
              buttonColor={theme.colors.primary}
            >
              Save Goal
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
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  goalCard: {
    width: '47%',
    borderRadius: 12,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    height: 24,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 12,
  },
  daysText: {
    fontSize: 12,
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

export default GoalsScreen;
