import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Card,
  Text,
  useTheme,
  ActivityIndicator,
  SegmentedButtons,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { api } from '../../services/api';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    loadReportData();
  }, [timeframe]);

  const loadReportData = async () => {
    try {
      const response = await api.get('/reports/dashboard', {
        params: { timeframe },
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error loading report data:', error);
      // Fallback to empty data if API fails
      setReportData({
        summary: {
          totalIncome: 0,
          totalExpense: 0,
          netChange: 0,
          savingsRate: 0,
        },
        byCategory: {},
        monthlyTrend: [],
        insights: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      household: theme.colors.household,
      bills: theme.colors.bills,
      groceries: theme.colors.groceries,
      personal: theme.colors.personal,
      savings: theme.colors.savings,
      travel: theme.colors.travel,
      emergency: theme.colors.emergency,
      investments: theme.colors.investments,
    };
    return colors[category] || theme.colors.primary;
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.colors.chartPrimary + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
    labelColor: (opacity = 1) => theme.colors.onSurface + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.chartPrimary,
    },
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Prepare pie chart data
  const pieData = Object.entries(reportData.byCategory || {}).map(([key, value]: [string, any]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    amount: value,
    color: getCategoryColor(key),
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  // Prepare line chart data
  const lineData = {
    labels: (reportData.monthlyTrend || []).map((item: any) => item.month),
    datasets: [
      {
        data: (reportData.monthlyTrend || []).map((item: any) => item.income),
        color: (opacity = 1) => theme.colors.chartSecondary + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
        strokeWidth: 2,
      },
      {
        data: (reportData.monthlyTrend || []).map((item: any) => item.expense),
        color: (opacity = 1) => theme.colors.error + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Expenses'],
  };

  // Prepare bar chart data
  const barData = {
    labels: Object.keys(reportData.byCategory || {}).map(
      (key) => key.substring(0, 3).toUpperCase()
    ),
    datasets: [
      {
        data: Object.values(reportData.byCategory || {}) as number[],
      },
    ],
  };

  const savingsRate = reportData.summary?.savingsRate?.toFixed(1) || '0.0';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Timeframe Selector */}
        <SegmentedButtons
          value={timeframe}
          onValueChange={setTimeframe}
          buttons={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          style={styles.segmentedButtons}
        />

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <Card style={[styles.summaryCard, styles.incomeCard]}>
            <Card.Content>
              <MaterialCommunityIcons name="arrow-down" size={24} color="#2E7D32" />
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, { color: '#2E7D32' }]}>
                {formatCurrency(reportData.summary?.totalIncome || 0)}
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, styles.expenseCard]}>
            <Card.Content>
              <MaterialCommunityIcons name="arrow-up" size={24} color="#D32F2F" />
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryValue, { color: '#D32F2F' }]}>
                {formatCurrency(reportData.summary?.totalExpense || 0)}
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.netCard}>
          <Card.Content>
            <View style={styles.netRow}>
              <View>
                <Text style={styles.netLabel}>Net Change</Text>
                <Text style={[styles.netValue, { color: theme.colors.secondary }]}>
                  {formatCurrency(reportData.summary?.netChange || 0)}
                </Text>
              </View>
              <View style={styles.savingsRateContainer}>
                <Text style={styles.savingsRateLabel}>Savings Rate</Text>
                <Text style={[styles.savingsRateValue, { color: theme.colors.secondary }]}>
                  {savingsRate}%
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Spending by Category - Pie Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Spending by Category</Text>
            <PieChart
              data={pieData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>

        {/* Monthly Trend - Line Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>5-Month Trend</Text>
            <LineChart
              data={lineData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.chartSecondary }]} />
                <Text style={styles.legendText}>Income</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.colors.error }]} />
                <Text style={styles.legendText}>Expenses</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Category Breakdown - Bar Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Category Breakdown</Text>
            <BarChart
              data={barData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              style={styles.chart}
              showValuesOnTopOfBars
              fromZero
            />
          </Card.Content>
        </Card>

        {/* Top Spending Categories */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Top Spending Categories</Text>
            {Object.entries(reportData.byCategory || {})
              .sort(([, a]: any, [, b]: any) => b - a)
              .map(([category, amount]: [string, any], index) => (
                <View key={category} style={styles.categoryRow}>
                  <View style={styles.categoryLeft}>
                    <Text style={styles.categoryRank}>#{index + 1}</Text>
                    <View
                      style={[
                        styles.categoryDot,
                        { backgroundColor: getCategoryColor(category) },
                      ]}
                    />
                    <Text style={styles.categoryName}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryAmount}>{formatCurrency(amount)}</Text>
                    <Text style={styles.categoryPercent}>
                      {reportData.summary?.totalExpense ? ((amount / reportData.summary.totalExpense) * 100).toFixed(1) : '0.0'}%
                    </Text>
                  </View>
                </View>
              ))}
          </Card.Content>
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <Card.Content>
            <View style={styles.insightHeader}>
              <MaterialCommunityIcons
                name="lightbulb-on"
                size={24}
                color={theme.colors.warning}
              />
              <Text style={styles.insightTitle}>Insights</Text>
            </View>
            {(reportData.insights || []).map((insight: string, index: number) => (
              <View key={index} style={styles.insightItem}>
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
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
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    elevation: 2,
  },
  incomeCard: {},
  expenseCard: {},
  summaryLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  netCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  netValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  savingsRateContainer: {
    alignItems: 'flex-end',
  },
  savingsRateLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  savingsRateValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
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
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryRank: {
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.5,
    marginRight: 12,
    width: 24,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryPercent: {
    fontSize: 12,
    opacity: 0.7,
  },
  insightsCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  insightItem: {
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ReportsScreen;

