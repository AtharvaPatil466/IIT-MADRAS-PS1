import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRights, RightsResult } from '../src/lib/api';

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

export default function RightsScreen() {
  const [location, setLocation] = useState('');
  const [result, setResult] = useState<RightsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRights = async () => {
    const loc = location.trim();
    if (!loc) {
      setError('Please enter a location.');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await getRights(loc);
      setResult(data);
    } catch (e) {
      setError('Could not fetch rights info. Check connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Know Your Rights</Text>
        <Text style={styles.headerSubtitle}>Legal Protection Guide</Text>
      </View>

      <View style={styles.searchCard}>
        <Text style={styles.label}>Your Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mumbai, Delhi, Bangalore"
          placeholderTextColor={COLORS.textVariant}
          value={location}
          onChangeText={setLocation}
          onSubmitEditing={fetchRights}
          returnKeyType="search"
        />

        <TouchableOpacity style={styles.primaryButton} onPress={fetchRights} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Look Up Rights</Text>
              <Ionicons name="search" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.locationTitle}>
            <Ionicons name="location" size={18} color={COLORS.primary} /> {result.location.city}, {result.location.state}
          </Text>

          {/* Card: Documents Required */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="document-text" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.cardTitle}>Documents Required</Text>
            </View>
            <View style={styles.divider} />
            {result.documents_required.map((doc, i) => (
              <View key={i} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                <Text style={styles.listText}>{doc}</Text>
              </View>
            ))}
          </View>

          {/* Card: Cop Can Demand */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.cardTitle}>What Police CAN Do</Text>
            </View>
            <View style={styles.divider} />
            {result.cop_can_demand.map((item, i) => (
              <View key={i} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Card: Cop Cannot Demand */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={24} color={COLORS.error} />
              </View>
              <Text style={styles.cardTitle}>What Police CANNOT Do</Text>
            </View>
            <View style={styles.divider} />
            {result.cop_cannot_demand.map((item, i) => (
              <View key={i} style={styles.listItem}>
                <Ionicons name="close-circle" size={18} color={COLORS.error} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Card: Dispute Process */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="help-buoy" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.cardTitle}>Dispute Process</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.disputeText}>{result.dispute_process}</Text>
          </View>

          {result.payment_portal_url ? (
            <TouchableOpacity
              style={styles.portalButton}
              onPress={() => Linking.openURL(result.payment_portal_url)}
            >
              <Text style={styles.portalButtonText}>Open Official Payment Portal</Text>
              <Ionicons name="open-outline" size={20} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      <TouchableOpacity style={styles.helpButton}>
        <Text style={styles.helpButtonText}>Need Urgent Help?</Text>
        <Ionicons name="call" size={20} color="#fff" />
      </TouchableOpacity>
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
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif-medium',
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textVariant,
    marginTop: 4,
  },
  searchCard: {
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
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 20,
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
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultContainer: {
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listText: {
    fontSize: 15,
    color: COLORS.textVariant,
    marginLeft: 10,
    lineHeight: 22,
    flex: 1,
  },
  disputeText: {
    fontSize: 14,
    color: COLORS.textVariant,
    lineHeight: 22,
  },
  portalButton: {
    backgroundColor: '#0ea5e9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  portalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  helpButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
});
