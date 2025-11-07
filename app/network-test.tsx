import { Colors } from '@/constants/theme';
import luminaApi from '@/core/auth/api/luminaApi';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { ThemedView } from '@/presentation/theme/components/themed-view';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function NetworkTestScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string>('No tests run yet');

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Intenta hacer una petición simple al servidor
      const response = await luminaApi.get('/health-check');
      setLastResult('✅ Connection successful!');
      Alert.alert('Success', 'Server connection is working!');
    } catch (error: any) {
      let errorMessage = '';
      
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        errorMessage = '🔴 Cannot connect to server. Make sure:\n\n' +
          '• Backend server is running on port 3000\n' +
          '• For Android Emulator: Server accessible at 10.0.2.2:3000\n' +
          '• For iOS Simulator: Server accessible at localhost:3000';
      } else if (error.response) {
        errorMessage = `🔴 Server responded with status: ${error.response.status}`;
      } else {
        errorMessage = `🔴 Unknown error: ${error.message}`;
      }
      
      setLastResult(errorMessage);
      Alert.alert('Connection Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const testDummyLogin = async () => {
    setIsLoading(true);
    try {
      // Intenta hacer login con credenciales de prueba
      const response = await luminaApi.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      setLastResult('✅ Login endpoint working!');
      Alert.alert('Success', 'Login endpoint is accessible!');
    } catch (error: any) {
      if (error.response?.status === 401) {
        setLastResult('✅ Login endpoint working (invalid credentials expected)');
        Alert.alert('Success', 'Login endpoint is working (invalid credentials is normal for this test)');
      } else {
        let errorMessage = `🔴 Login endpoint error: ${error.message}`;
        setLastResult(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="h2" style={styles.title}>
          Network Connectivity Test
        </ThemedText>

        <ThemedText type="body1" style={styles.description}>
          Use these tests to debug network connectivity issues with your backend server.
        </ThemedText>

        <View style={styles.testSection}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={testConnection}
            disabled={isLoading}
          >
            <ThemedText type="button" style={styles.buttonText}>
              {isLoading ? 'Testing...' : 'Test Server Connection'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secondary }]}
            onPress={testDummyLogin}
            disabled={isLoading}
          >
            <ThemedText type="button" style={styles.buttonText}>
              {isLoading ? 'Testing...' : 'Test Login Endpoint'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.resultSection}>
          <ThemedText type="h4" style={styles.resultTitle}>
            Last Test Result:
          </ThemedText>
          <ThemedText type="body2" style={styles.resultText}>
            {lastResult}
          </ThemedText>
        </View>

        <View style={styles.infoSection}>
          <ThemedText type="h4" style={styles.infoTitle}>
            Configuration Info:
          </ThemedText>
          <ThemedText type="body2" style={styles.infoText}>
            • Android Emulator: http://10.0.2.2:3000/api{'\n'}
            • iOS Simulator: http://localhost:3000/api{'\n'}
            • Web: http://localhost:3000/api
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  testSection: {
    marginBottom: 32,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  resultSection: {
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  resultTitle: {
    marginBottom: 8,
  },
  resultText: {
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
  },
  infoTitle: {
    marginBottom: 8,
  },
  infoText: {
    lineHeight: 20,
    fontFamily: 'monospace',
  },
});