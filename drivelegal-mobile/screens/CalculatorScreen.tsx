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
  text: '#dae2fd',
  textVariant: '#c3c6d7',
  border: 'rgba(255, 255, 255, 0.1)',
  cardBg: 'rgba(45, 52, 73, 0.4)',
};

export default function CalculatorScreen() {
  const [vehicleType, setVehicleType] = useState('2-Wheeler');
  const [offense, setOffense] = useState('');
  const [fine, setFine] = useState<number | null>(null);

  const calculate = () => {
    // Mock logic
    setFine(vehicleType === '2-Wheeler' ? 1000 : 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challan Calculator</Text>
        <Text style={styles.headerSubtitle}>Estimate your traffic fines instantly</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Vehicle Type</Text>
        <View style={styles.selectorRow}>
          {['2-Wheeler', '4-Wheeler'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.selector,
                vehicleType === type && styles.selectorActive
              ]}
              onPress={() => setVehicleType(type)}
            >
              <Text style={[
                styles.selectorText,
                vehicleType === type && styles.selectorTextActive
              ]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Select Offense</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Jumping Red Light"
          placeholderTextColor={COLORS.textVariant}
          value={offense}
          onChangeText={setOffense}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={calculate}>
          <Text style={styles.primaryButtonText}>Calculate Fine</Text>
          <Ionicons name="calculator" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {fine !== null && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Estimated Fine Amount</Text>
          <Text style={styles.resultValue}>₹{fine}</Text>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>This is an estimate based on the MV Act 2019. Actual fines may vary by state.</Text>
          </View>
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
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  selectorRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  selector: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectorActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  selectorText: {
    color: COLORS.textVariant,
    fontWeight: '600',
  },
  selectorTextActive: {
    color: COLORS.primary,
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
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  resultLabel: {
    fontSize: 16,
    color: COLORS.textVariant,
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
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
