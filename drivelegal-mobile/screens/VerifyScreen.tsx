import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#0b1326',
  surface: 'rgba(23, 31, 51, 0.7)',
  primary: '#2563eb',
  success: '#10b981',
  error: '#ef4444',
  text: '#dae2fd',
  textVariant: '#c3c6d7',
  border: 'rgba(255, 255, 255, 0.1)',
  cardBg: 'rgba(45, 52, 73, 0.4)',
};

export default function VerifyScreen() {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'FAIR' | 'OVERCHARGED' | null>(null);

  const checkStatus = () => {
    const val = parseInt(amount);
    if (isNaN(val)) return;
    setStatus(val > 1000 ? 'OVERCHARGED' : 'FAIR');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fine Scam Checker</Text>
        <Text style={styles.headerSubtitle}>Verify if you are being overcharged</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={16} color={COLORS.primary} />
          <Text style={styles.locationText}>Chennai, Tamil Nadu</Text>
        </View>

        <Text style={styles.label}>Fine Amount Asked</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount in ₹"
          placeholderTextColor={COLORS.textVariant}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={checkStatus}>
          <Text style={styles.primaryButtonText}>Verify Now</Text>
          <Ionicons name="shield-checkmark" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {status && (
        <View style={[
          styles.statusCard,
          status === 'FAIR' ? styles.statusFair : styles.statusOver
        ]}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={status === 'FAIR' ? "checkmark-circle" : "alert-circle"} 
              size={32} 
              color={status === 'FAIR' ? COLORS.success : COLORS.error} 
            />
            <Text style={[
              styles.statusText,
              { color: status === 'FAIR' ? COLORS.success : COLORS.error }
            ]}>{status}</Text>
          </View>
          
          <Text style={styles.adviceTitle}>Legal Advice</Text>
          <Text style={styles.adviceContent}>
            {status === 'FAIR' 
              ? 'The amount requested aligns with standard MV Act penalties for this offense. You can proceed to pay via official channels.'
              : 'Warning: This amount exceeds the legal limit defined in the MV Act 2019. You have the right to request a formal court summons.'}
          </Text>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Legal Provisions</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textVariant} />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textVariant,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 24,
  },
  locationText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  statusCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  statusFair: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusOver: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 12,
    letterSpacing: 1,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  adviceContent: {
    fontSize: 14,
    color: COLORS.textVariant,
    lineHeight: 22,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: COLORS.textVariant,
    fontSize: 14,
    fontWeight: '600',
  },
});
