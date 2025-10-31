import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Card,
  Text,
  useTheme,
  ActivityIndicator,
  Button,
  FAB,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { api } from '../../services/api';

const BudgetScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [envelopes, setEnvelopes] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadEnvelopes();
  }, []);

  const loadEnvelopes = async () => {
    try {
      const response = await api.get('/envelopes');
      setEnvelopes(response.data);
    } catch (error) {
      console.error('Error loading envelopes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultEnvelopes = async () => {
    try {
      await api.post('/envelopes/defaults');
      loadEnvelopes();
    } catch (error) {
      console.error('Error creating default envelopes:', error);
    }
  };

  const updatePercentage = (id: string, newPercentage: number) => {
    setEnvelopes((prev) =>
      prev.map((env) => (env.id === id ? { ...env, percentage: newPercentage } : env))
    );
  };

  const saveChanges = async () => {
    try {
      for (const envelope of envelopes) {
        await api.patch(`/envelopes/${envelope.id}`, {
          percentage: envelope.percentage,
        });
      }
      setEditMode(false);
      loadEnvelopes();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const totalPercentage = envelopes.reduce((sum, env) => sum + Number(env.percentage), 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {envelopes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Budget Categories Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first budget categories to start managing your money
            </Text>
            <Button mode="contained" onPress={createDefaultEnvelopes} style={styles.button}>
              Create Default Categories
            </Button>
          </View>
        ) : (
          <>
            {/* Total Allocation Indicator */}
            <Card style={[styles.totalCard, totalPercentage > 100 && styles.totalCardWarning]}>
              <Card.Content>
                <Text style={styles.totalLabel}>Total Allocation</Text>
                <Text style={[styles.totalValue, totalPercentage > 100 && styles.totalValueWarning]}>
                  {totalPercentage.toFixed(0)}%
                </Text>
                {totalPercentage > 100 && (
                  <Text style={styles.warningText}>
                    ⚠️ Total exceeds 100%. Adjust your allocations.
                  </Text>
                )}
              </Card.Content>
            </Card>

            {/* Envelope Cards */}
            {envelopes.map((envelope) => (
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
                    <Text style={styles.percentageText}>{envelope.percentage.toFixed(0)}%</Text>
                  </View>

                  {editMode && (
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={Number(envelope.percentage)}
                      onValueChange={(value) => updatePercentage(envelope.id, value)}
                      minimumTrackTintColor={envelope.colorHex || theme.colors.primary}
                      maximumTrackTintColor="#E0E0E0"
                    />
                  )}

                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Allocated:</Text>
                    <Text style={styles.amountValue}>
                      ${envelope.allocatedAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Spent:</Text>
                    <Text style={[styles.amountValue, { color: theme.colors.error }]}>
                      ${envelope.spentAmount.toFixed(2)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}

            {editMode && (
              <Button mode="contained" onPress={saveChanges} style={styles.saveButton}>
                Save Changes
              </Button>
            )}
          </>
        )}
      </ScrollView>

      {!editMode && envelopes.length > 0 && (
        <FAB
          icon="pencil"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => setEditMode(true)}
        />
      )}
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
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
  },
  totalCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 2,
  },
  totalCardWarning: {
    borderColor: '#D32F2F',
    borderWidth: 2,
  },
  totalLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 4,
  },
  totalValueWarning: {
    color: '#D32F2F',
  },
  warningText: {
    color: '#D32F2F',
    marginTop: 8,
    fontSize: 12,
  },
  envelopeCard: {
    marginBottom: 16,
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
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  envelopeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  amountLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default BudgetScreen;

