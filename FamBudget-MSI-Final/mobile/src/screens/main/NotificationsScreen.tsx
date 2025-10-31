import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Card,
  Text,
  useTheme,
  ActivityIndicator,
  Chip,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { api } from '../../services/api';

interface Notification {
  id: string;
  type: 'low_balance' | 'budget_exceeded' | 'bill_due' | 'goal_milestone' | 'approval_needed';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  read: boolean;
}

const NotificationsScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const getIcon = (type: Notification['type']) => {
    const icons: Record<string, string> = {
      low_balance: 'alert-circle',
      budget_exceeded: 'chart-line-variant',
      bill_due: 'calendar-alert',
      goal_milestone: 'trophy',
      approval_needed: 'account-check',
    };
    return icons[type] || 'bell';
  };

  const getColor = (severity: Notification['severity']) => {
    const colors: Record<string, string> = {
      info: theme.colors.primary,
      warning: '#FFB300',
      error: theme.colors.error,
      success: theme.colors.secondary,
    };
    return colors[severity];
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={80}
              color={theme.colors.primary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>
              You have no new notifications
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Notifications</Text>
              <Chip compact>{notifications.length} new</Chip>
            </View>

            {notifications.map((notification) => (
              <Card
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadCard,
                ]}
              >
                <Card.Content>
                  <View style={styles.notificationRow}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: getColor(notification.severity) + '20' },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={getIcon(notification.type)}
                        size={24}
                        color={getColor(notification.severity)}
                      />
                    </View>

                    <View style={styles.notificationContent}>
                      <View style={styles.titleRow}>
                        <Text style={styles.notificationTitle}>
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <View style={styles.unreadDot} />
                        )}
                      </View>
                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                      </Text>
                    </View>

                    <IconButton
                      icon="close"
                      size={20}
                      onPress={() => {
                        // Dismiss notification
                        setNotifications((prev) =>
                          prev.filter((n) => n.id !== notification.id)
                        );
                      }}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1565C0',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
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
});

export default NotificationsScreen;

