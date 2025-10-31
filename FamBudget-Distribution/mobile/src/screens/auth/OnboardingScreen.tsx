import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardingScreen = ({ navigation }: any) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>💰</Text>
          <Text style={styles.appName}>FamBudget</Text>
          <Text style={styles.tagline}>
            Collaborative family budgeting made simple
          </Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.featureText}>✓ Track shared & personal expenses</Text>
          <Text style={styles.featureText}>✓ Automatic income splitting</Text>
          <Text style={styles.featureText}>✓ Set & achieve goals together</Text>
          <Text style={styles.featureText}>✓ Beautiful visual reports</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Register')}
            style={styles.button}
            buttonColor="#FFFFFF"
            textColor={theme.colors.primary}
          >
            Get Started
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
            textColor="#FFFFFF"
          >
            I already have an account
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoText: {
    fontSize: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  features: {
    marginVertical: 40,
  },
  featureText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
    opacity: 0.95,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 12,
    borderRadius: 12,
  },
});

export default OnboardingScreen;

