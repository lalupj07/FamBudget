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
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Card,
  Text,
  useTheme,
  ActivityIndicator,
  Button,
  FAB,
  Chip,
  DataTable,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';

const IncomeScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [incomeSources, setIncomeSources] = useState<any[]>([]);
  const [incomeHistory, setIncomeHistory] = useState<any[]>([]);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sourcesResponse, historyResponse] = await Promise.all([
        api.get('/income/sources'),
        api.get('/income/history'),
      ]);
      setIncomeSources(sourcesResponse.data || []);
      setIncomeHistory(historyResponse.data || []);
    } catch (error) {
      console.error('Error loading income data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getSourceTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      salary: theme.colors.success,
      freelance: theme.colors.chartTertiary,
      investment: theme.colors.chartPrimary,
      business: theme.colors.chartQuaternary,
      rental: theme.colors.chartSecondary,
      other: theme.colors.outline,
    };
    return colors[type] || theme.colors.outline;
  };

  const getSourceTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Income Sources Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Income Sources
            </Text>
            <Button
              mode="outlined"
              compact
              onPress={() => setShowAddSourceModal(true)}
              icon="plus"
            >
              Add Source
            </Button>
          </View>

          {incomeSources.length === 0 ? (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content style={styles.emptyContent}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={48}
                  color={theme.colors.outline}
                />
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No income sources yet
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
                  Add your first income source to start tracking
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <View style={styles.sourcesGrid}>
              {incomeSources.map((source, index) => {
                const stripColors = [
                  theme.colors.success, // Green
                  theme.colors.chartPrimary, // Blue
                  theme.colors.chartTertiary, // Orange
                  theme.colors.chartQuaternary, // Purple
                  '#00bcd4', // Light Blue/Cyan
                  '#ff7043', // Brownish Orange
                  '#00acc1', // Cyan
                  '#e91e63', // Pink
                ];
                const stripColor = stripColors[index % stripColors.length];

                return (
                  <Card
                    key={source.id}
                    style={[styles.sourceCard, { backgroundColor: theme.colors.surface }]}
                  >
                    <View style={[styles.colorStrip, { backgroundColor: stripColor }]} />
                    <Card.Content>
                      <View style={styles.sourceHeader}>
                        <Text style={[styles.sourceName, { color: theme.colors.onSurface }]}>
                          {source.name}
                        </Text>
                        <Chip
                          style={[
                            styles.typeBadge,
                            { backgroundColor: theme.colors.chartPrimary + '20' },
                          ]}
                          textStyle={{
                            color: theme.colors.chartPrimary,
                            fontSize: 11,
                            fontWeight: '600',
                          }}
                          compact
                        >
                          {getSourceTypeLabel(source.type)}
                        </Chip>
                      </View>
                      <Text style={[styles.currentAmount, { color: theme.colors.success }]}>
                        {formatCurrency(source.currentAmount || 0)}
                      </Text>
                      <Text style={[styles.expectedAmount, { color: theme.colors.onSurfaceVariant }]}>
                        Expected: {formatCurrency(source.expectedMonthlyAmount || 0)}/month
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
                          onPress={() => {}}
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
          )}
        </View>

        {/* Income History Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Income History
          </Text>

          {incomeHistory.length === 0 ? (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content style={styles.emptyContent}>
                <MaterialCommunityIcons
                  name="receipt"
                  size={48}
                  color={theme.colors.outline}
                />
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No income recorded yet
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Date</DataTable.Title>
                  <DataTable.Title>Source</DataTable.Title>
                  <DataTable.Title>Description</DataTable.Title>
                  <DataTable.Title numeric>Amount</DataTable.Title>
                </DataTable.Header>

                {incomeHistory.map((income) => (
                  <DataTable.Row key={income.id}>
                    <DataTable.Cell>
                      {new Date(income.date).toLocaleDateString()}
                    </DataTable.Cell>
                    <DataTable.Cell>{income.sourceName || 'N/A'}</DataTable.Cell>
                    <DataTable.Cell>{income.description}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Text style={{ color: theme.colors.success }}>
                        {formatCurrency(income.amount)}
                      </Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </Card>
          )}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowAddIncomeModal(true)}
        label="Add Income"
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
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  sourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  sourceCard: {
    width: '47%',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  colorStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginLeft: 8,
  },
  sourceName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    height: 24,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    marginLeft: 8,
  },
  expectedAmount: {
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
  },
});

export default IncomeScreen;
