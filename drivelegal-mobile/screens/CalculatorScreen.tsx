import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  calculateChallan,
  getViolations,
  ChallanResult,
  ViolationItem,
} from '../src/lib/api';

const COLORS = {
  background: '#0b1326',
  surface: 'rgba(23, 31, 51, 0.7)',
  primary: '#2563eb',
  text: '#dae2fd',
  textVariant: '#c3c6d7',
  border: 'rgba(255, 255, 255, 0.1)',
  cardBg: 'rgba(45, 52, 73, 0.4)',
};

const VEHICLE_TYPES = ['two_wheeler', 'car', 'commercial', 'all'];

export default function CalculatorScreen() {
  const [location, setLocation] = useState('');
  const [violation, setViolation] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [isRepeat, setIsRepeat] = useState(false);
  const [violations, setViolations] = useState<ViolationItem[]>([]);
  const [result, setResult] = useState<ChallanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load a default violation list on mount (for India/Maharashtra as fallback)
  useEffect(() => {
    getViolations('IN', 'Maharashtra')
      .then(r => setViolations(r.violations))
      .catch(() => {});
  }, []);

  const calculate = async () => {
    const loc = location.trim();
    const viol = violation.trim();
    if (!loc || !viol) {
      setError('Please enter both location and violation.');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await calculateChallan(loc, viol, vehicleType, isRepeat);
      setResult(data);
    } catch (e) {
      setError('Could not fetch challan info. Check connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challan Calculator</Text>
        <Text style={styles.headerSubtitle}>Estimate your traffic fines instantly</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Pune, Mumbai, Delhi"
          placeholderTextColor={COLORS.textVariant}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Violation</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. no_helmet, overspeeding"
          placeholderTextColor={COLORS.textVariant}
          value={violation}
          onChangeText={setViolation}
        />

        {violations.length > 0 && (
          <View style={styles.chipWrapper}>
            <Text style={styles.subLabel}>Quick Select Violation:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
              {violations.map(v => (
                <TouchableOpacity
                  key={v.violation_code}
                  style={[
                    styles.chip,
                    violation === v.violation_code && styles.chipActive
                  ]}
                  onPress={() => setViolation(v.violation_code)}
                >
                  <Text style={[
                    styles.chipText,
                    violation === v.violation_code && styles.chipTextActive
                  ]}>
                    {v.violation_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Repeat Offence?</Text>
          <Switch
            value={isRepeat}
            onValueChange={setIsRepeat}
            trackColor={{ false: '#767577', true: COLORS.primary }}
            thumbColor={isRepeat ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={calculate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Calculate Fine</Text>
              <Ionicons name="calculator" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{result.violation_name}</Text>
          <Text style={styles.resultSub}>
            {result.location.city}, {result.location.state}
          </Text>

          <View style={styles.fineRow}>
            <View style={styles.fineBox}>
              <Text style={styles.fineBoxLabel}>First Offence</Text>
              <Text style={styles.fineAmount}>
                {result.currency} {result.fine_first.toLocaleString()}
              </Text>
            </View>
            <View style={styles.fineBox}>
              <Text style={styles.fineBoxLabel}>Repeat Offence</Text>
              <Text style={styles.fineAmount}>
                {result.currency} {result.fine_repeat.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <InfoRow label="Section Reference" value={result.section_reference} />
            <InfoRow label="Severity" value={result.severity} />
            <InfoRow label="Compoundable" value={result.compoundable ? 'Yes' : 'No'} />
            {result.suspension_days != null && (
              <InfoRow label="License Suspension" value={`${result.suspension_days} days`} />
            )}
            <InfoRow label="How to Pay" value={result.how_to_pay} />
          </View>

          {result.summary ? (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>{result.summary}</Text>
            </View>
          ) : null}

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>Estimates are based on official legislation. Actual fines may vary depending on local jurisdiction guidelines.</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  subLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textVariant,
    marginBottom: 6,
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
  chipWrapper: {
    marginBottom: 16,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
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
    marginTop: 12,
    textAlign: 'center',
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  resultSub: {
    fontSize: 14,
    color: COLORS.textVariant,
    marginBottom: 16,
  },
  fineRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  fineBox: {
    flex: 1,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  fineBoxLabel: {
    fontSize: 11,
    color: COLORS.textVariant,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  fineAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textVariant,
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 13,
    color: COLORS.textVariant,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textVariant,
    marginLeft: 8,
    lineHeight: 18,
  },
});
