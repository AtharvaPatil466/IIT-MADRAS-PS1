import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { verifyFine, VerifyResult } from '../src/lib/api';

const COLORS = {
  background: '#0b1326',
  surface: 'rgba(23, 31, 51, 0.7)',
  primary: '#2563eb',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  neutral: '#94a3b8',
  text: '#dae2fd',
  textVariant: '#c3c6d7',
  border: 'rgba(255, 255, 255, 0.1)',
  cardBg: 'rgba(45, 52, 73, 0.4)',
};

const VEHICLE_TYPES = ['two_wheeler', 'car', 'commercial', 'all'];

const VERDICT_COLORS: Record<VerifyResult['verdict'], string> = {
  correct: COLORS.success,
  overcharged: COLORS.error,
  undercharged: COLORS.warning,
  unknown_violation: COLORS.neutral,
};

const VERDICT_LABELS: Record<VerifyResult['verdict'], string> = {
  correct: 'Amount is Correct',
  overcharged: 'You Are Being Overcharged',
  undercharged: 'Amount is Below Official Fine',
  unknown_violation: 'Violation Not Recognised',
};

export default function VerifyScreen() {
  const [location, setLocation] = useState('');
  const [violation, setViolation] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [amountTold, setAmountTold] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    const loc = location.trim();
    const viol = violation.trim();
    const amount = parseFloat(amountTold);
    if (!loc || !viol || isNaN(amount) || amount <= 0) {
      setError('Please fill in all fields with valid values.');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await verifyFine(loc, viol, vehicleType, amount, currency);
      setResult(data);
    } catch (e) {
      setError('Verification failed. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fine Scam Checker</Text>
        <Text style={styles.headerSubtitle}>Verify if you are being overcharged</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Bengaluru, Chennai"
          placeholderTextColor={COLORS.textVariant}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Violation</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. red_light, no_helmet"
          placeholderTextColor={COLORS.textVariant}
          value={violation}
          onChangeText={setViolation}
        />

        <Text style={styles.label}>Vehicle Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
          {VEHICLE_TYPES.map(vt => (
            <TouchableOpacity
              key={vt}
              style={[
                styles.chip,
                vehicleType === vt && styles.chipActive
              ]}
              onPress={() => setVehicleType(vt)}
            >
              <Text style={[
                styles.chipText,
                vehicleType === vt && styles.chipTextActive
              ]}>
                {vt.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Amount You Were Told</Text>
        <View style={styles.amountRow}>
          <TextInput
            style={[styles.input, styles.currencyInput]}
            value={currency}
            onChangeText={setCurrency}
            maxLength={3}
            autoCapitalize="characters"
            placeholderTextColor={COLORS.textVariant}
          />
          <TextInput
            style={[styles.input, styles.amountInput]}
            placeholder="e.g. 2500"
            value={amountTold}
            onChangeText={setAmountTold}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textVariant}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleVerify} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Verify Fine</Text>
              <Ionicons name="shield-checkmark" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {result && (
        <View style={[
          styles.statusCard,
          { borderColor: VERDICT_COLORS[result.verdict] }
        ]}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={result.verdict === 'correct' ? "checkmark-circle" : "alert-circle"} 
              size={32} 
              color={VERDICT_COLORS[result.verdict]} 
            />
            <Text style={[
              styles.statusText,
              { color: VERDICT_COLORS[result.verdict] }
            ]}>
              {VERDICT_LABELS[result.verdict]}
            </Text>
          </View>
          
          <View style={styles.amountsRow}>
            <View style={styles.amountBox}>
              <Text style={styles.amountBoxLabel}>Official Fine</Text>
              <Text style={styles.amountBoxValue}>
                {result.currency} {result.actual_amount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountBoxLabel}>You Were Told</Text>
              <Text style={[
                styles.amountBoxValue,
                !result.is_correct && styles.wrongAmount
              ]}>
                {result.currency} {result.amount_told.toLocaleString()}
              </Text>
            </View>
          </View>

          {result.difference > 0 && (
            <Text style={styles.differenceText}>
              Overcharged by: {result.currency} {result.difference.toLocaleString()}
            </Text>
          )}
          
          {result.explanation ? (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>Legal Explanation</Text>
              <Text style={styles.explanationContent}>{result.explanation}</Text>
            </View>
          ) : null}
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
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  chipActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textVariant,
  },
  chipTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  currencyInput: {
    width: 80,
  },
  amountInput: {
    flex: 1,
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
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  amountsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  amountBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  amountBoxLabel: {
    fontSize: 11,
    color: COLORS.textVariant,
    marginBottom: 4,
  },
  amountBoxValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  wrongAmount: {
    color: COLORS.error,
  },
  differenceText: {
    textAlign: 'center',
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 16,
  },
  explanationContainer: {
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 16,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  explanationContent: {
    fontSize: 13,
    color: COLORS.textVariant,
    lineHeight: 20,
  },
});
