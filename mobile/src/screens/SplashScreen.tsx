import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after animation
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialCommunityIcons
            name="wallet"
            size={80}
            color={theme.colors.onPrimary}
          />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text
          style={[
            styles.appName,
            { color: theme.colors.onPrimary },
          ]}
        >
          FamBudget
        </Text>
        <Text
          style={[
            styles.tagline,
            { color: theme.colors.onPrimary },
          ]}
        >
          Take Control of Your Family's Finances
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.loaderContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <ActivityIndicator size="small" color={theme.colors.onPrimary} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
  },
});

export default SplashScreen;
