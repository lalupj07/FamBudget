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
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Card, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { api } from '../../services/api';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Fetch dashboard data - adjust endpoint as needed
      const response = await api.get('/household/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Set mock data for development
      setDashboardData({
        totalIncome: 5000,
        totalExpenses: 3200,
        netChange: 1800,
        savingsRate: 36,
        categorySpending: [
          { name: 'Food & Dining', amount: 800, color: '#4caf50' },
          { name: 'Transportation', amount: 600, color: '#2196f3' },
          { name: 'Utilities', amount: 400, color: '#ff9800' },
          { name: 'Entertainment', amount: 300, color: '#9c27b0' },
          { name: 'Shopping', amount: 500, color: '#f44336' },
          { name: 'Other', amount: 600, color: '#757575' },
        ],
        recentTransactions: [
          { id: 1, description: 'Grocery Store', category: 'Food & Dining', amount: -85.50, date: '2025-01-15' },
          { id: 2, description: 'Salary', category: 'Income', amount: 2500, date: '2025-01-10' },
          { id: 3, description: 'Gas Station', category: 'Transportation', amount: -45.00, date: '2025-01-12' },
        ],
        budgetCategories: [
          { name: 'Food & Dining', spent: 800, allocated: 1000 },
          { name: 'Transportation', spent: 600, allocated: 800 },
          { name: 'Utilities', spent: 400, allocated: 500 },
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Prepare chart data
  const chartData = dashboardData?.categorySpending?.map((cat: any, index: number) => ({
    name: cat.name,
    amount: cat.amount,
    color: cat.color,
    legendFontColor: theme.colors.onSurface,
    legendFontSize: 12,
  })) || [];

  const chartColors = chartData.map((item: any) => item.color);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Summary Cards - Matching Desktop */}
        <View style={styles.summaryCards}>
          {/* Total Income Card */}
          <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: theme.colors.success }]}>
                <MaterialCommunityIcons name="trending-up" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.cardTextContent}>
                <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Total Income
                </Text>
                <Text style={[styles.cardAmount, { color: theme.colors.onSurface }]}>
                  {formatCurrency(dashboardData?.totalIncome || 0)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Total Expenses Card */}
          <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: theme.colors.error }]}>
                <MaterialCommunityIcons name="trending-down" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.cardTextContent}>
                <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Total Expenses
                </Text>
                <Text style={[styles.cardAmount, { color: theme.colors.onSurface }]}>
                  {formatCurrency(dashboardData?.totalExpenses || 0)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Net Change Card */}
          <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: theme.colors.chartPrimary }]}>
                <MaterialCommunityIcons name="savings" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.cardTextContent}>
                <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Net Change
                </Text>
                <Text
                  style={[
                    styles.cardAmount,
                    {
                      color:
                        (dashboardData?.netChange || 0) >= 0
                          ? theme.colors.success
                          : theme.colors.error,
                    },
                  ]}
                >
                  {formatCurrency(dashboardData?.netChange || 0)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Savings Rate Card */}
          <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: theme.colors.chartTertiary }]}>
                <MaterialCommunityIcons name="percent" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.cardTextContent}>
                <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Savings Rate
                </Text>
                <Text style={[styles.cardAmount, { color: theme.colors.onSurface }]}>
                  {dashboardData?.savingsRate || 0}%
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Dashboard Grid - Chart and Recent Transactions */}
        <View style={styles.dashboardGrid}>
          {/* Spending by Category Chart */}
          <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
                Spending by Category
              </Text>
              {chartData.length > 0 ? (
                <View style={styles.chartContainer}>
                  <PieChart
                    data={chartData}
                    width={width - 80}
                    height={220}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                </View>
              ) : (
                <View style={styles.emptyChart}>
                  <Text style={{ color: theme.colors.onSurfaceVariant }}>
                    No spending data available
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Recent Transactions */}
          <Card style={[styles.recentCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
                Recent Transactions
              </Text>
              <View style={styles.transactionList}>
                {dashboardData?.recentTransactions?.slice(0, 5).map((transaction: any) => (
                  <View
                    key={transaction.id}
                    style={[
                      styles.transactionItem,
                      { borderBottomColor: theme.colors.surfaceVariant },
                    ]}
                  >
                    <View style={styles.transactionInfo}>
                      <Text style={[styles.transactionDesc, { color: theme.colors.onSurface }]}>
                        {transaction.description}
                      </Text>
                      <Text
                        style={[styles.transactionCategory, { color: theme.colors.onSurfaceVariant }]}
                      >
                        {transaction.category}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.transactionAmount,
                        {
                          color:
                            transaction.amount >= 0 ? theme.colors.success : theme.colors.error,
                        },
                      ]}
                    >
                      {transaction.amount >= 0 ? '+' : ''}
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                ))}
                {(!dashboardData?.recentTransactions ||
                  dashboardData.recentTransactions.length === 0) && (
                  <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                    No recent transactions
                  </Text>
                )}
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Budget Overview */}
        <Card style={[styles.budgetCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
              Budget Overview
            </Text>
            <View style={styles.budgetCategories}>
              {dashboardData?.budgetCategories?.map((category: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.budgetCategory,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <View style={styles.budgetCategoryInfo}>
                    <Text style={[styles.budgetCategoryName, { color: theme.colors.onSurface }]}>
                      {category.name}
                    </Text>
                    <Text
                      style={[
                        styles.budgetCategoryAmounts,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                    </Text>
                  </View>
                  <View style={styles.budgetProgress}>
                    <View
                      style={[
                        styles.budgetProgressBar,
                        {
                          width: `${Math.min(
                            (category.spent / category.allocated) * 100,
                            100
                          )}%`,
                          backgroundColor: theme.colors.success,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
              {(!dashboardData?.budgetCategories ||
                dashboardData.budgetCategories.length === 0) && (
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No budget categories set
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>
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
    paddingBottom: 32,
  },
  summaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 12,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  dashboardGrid: {
    gap: 16,
    marginBottom: 24,
  },
  chartCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentCard: {
    borderRadius: 12,
  },
  transactionList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetCard: {
    borderRadius: 12,
  },
  budgetCategories: {
    gap: 12,
  },
  budgetCategory: {
    padding: 12,
    borderRadius: 8,
  },
  budgetCategoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetCategoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  budgetCategoryAmounts: {
    fontSize: 12,
  },
  budgetProgress: {
    height: 8,
    backgroundColor: '#555',
    borderRadius: 4,
    overflow: 'hidden',
  },
  budgetProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 16,
    fontSize: 14,
  },
});

export default DashboardScreen;
