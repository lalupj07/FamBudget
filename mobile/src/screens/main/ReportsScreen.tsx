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
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Card,
  Text,
  useTheme,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { api } from '../../services/api';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      const response = await api.get('/reports/dashboard');
      setReportData(response.data);
    } catch (error) {
      console.error('Error loading report data:', error);
      // Mock data matching desktop
      setReportData({
        monthlyTrend: [
          { month: 'Aug 2025', income: 8500, expense: 3200 },
          { month: 'Sep 2025', income: 9200, expense: 3800 },
          { month: 'Oct 2025', income: 8800, expense: 3500 },
          { month: 'Nov 2025', income: 9500, expense: 4000 },
          { month: 'Dec 2025', income: 10000, expense: 4200 },
          { month: 'Jan 2026', income: 9745, expense: 1239 },
        ],
        categoryBreakdown: {
          'Food & Dining': 185,
          'Utilities': 145,
          'Entertainment': 15,
          'Transportation': 65,
          'Shopping': 120,
          'Health & Fitness': 85,
          'Education': 200,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export reports');
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Prepare line chart data
  const lineData = {
    labels: reportData?.monthlyTrend?.map((item: any) => item.month.substring(0, 3)) || [],
    datasets: [
      {
        data: reportData?.monthlyTrend?.map((item: any) => item.income) || [],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green for income
        strokeWidth: 2,
      },
      {
        data: reportData?.monthlyTrend?.map((item: any) => item.expense) || [],
        color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // Red for expenses
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Expenses'],
  };

  // Prepare bar chart data
  const categoryNames = Object.keys(reportData?.categoryBreakdown || {});
  const categoryColors = [
    '#f44336', // Food & Dining - Red/Pink
    '#2196f3', // Utilities - Blue
    '#ffc107', // Entertainment - Yellow/Gold
    '#00bcd4', // Transportation - Teal
    '#9c27b0', // Shopping - Purple
    '#ff9800', // Health & Fitness - Orange
    '#00bcd4', // Education - Teal
  ];

  const barData = {
    labels: categoryNames.map((name) => name.substring(0, 3).toUpperCase()),
    datasets: [
      {
        data: Object.values(reportData?.categoryBreakdown || {}) as number[],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    },
    barPercentage: 0.7,
    categoryPercentage: 0.8,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Monthly Trends Chart */}
        <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
              Monthly Trends
            </Text>
            {reportData?.monthlyTrend && reportData.monthlyTrend.length > 0 ? (
              <>
                <LineChart
                  data={lineData}
                  width={screenWidth - 80}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  withDots={true}
                  withShadow={false}
                />
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.colors.success }]} />
                    <Text style={[styles.legendText, { color: theme.colors.onSurface }]}>
                      Income
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.colors.error }]} />
                    <Text style={[styles.legendText, { color: theme.colors.onSurface }]}>
                      Expenses
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.emptyChart}>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No trend data available
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Category Breakdown Chart */}
        <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.chartTitle, { color: theme.colors.onSurface }]}>
              Category Breakdown
            </Text>
            {reportData?.categoryBreakdown &&
            Object.keys(reportData.categoryBreakdown).length > 0 ? (
              <>
                <BarChart
                  data={barData}
                  width={screenWidth - 80}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1, index: number) => {
                      const color = categoryColors[index % categoryColors.length];
                      const rgb = color.match(/\d+/g);
                      if (rgb) {
                        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
                      }
                      return `rgba(33, 150, 243, ${opacity})`;
                    },
                  }}
                  verticalLabelRotation={0}
                  style={styles.chart}
                  showValuesOnTopOfBars
                  fromZero
                />
                <View style={styles.categoryLegend}>
                  {categoryNames.map((name, index) => (
                    <View key={name} style={styles.categoryLegendItem}>
                      <View
                        style={[
                          styles.categoryLegendDot,
                          { backgroundColor: categoryColors[index % categoryColors.length] },
                        ]}
                      />
                      <Text style={[styles.categoryLegendText, { color: theme.colors.onSurface }]}>
                        {name}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.emptyChart}>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No category data available
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Export Button */}
      <Button
        mode="outlined"
        icon="download"
        onPress={handleExport}
        style={[styles.exportButton, { borderColor: theme.colors.surfaceVariant }]}
        textColor={theme.colors.onSurface}
      >
        Export
      </Button>
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
  chartCard: {
    borderRadius: 12,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  categoryLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    gap: 12,
  },
  categoryLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  categoryLegendText: {
    fontSize: 12,
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    borderWidth: 1,
  },
});

export default ReportsScreen;
