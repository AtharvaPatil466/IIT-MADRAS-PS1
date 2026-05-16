import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

const RIGHTS_DATA = [
  {
    title: 'Documents Required',
    icon: 'document-text',
    items: [
      'Driving License (Physical or Digital)',
      'Registration Certificate (RC)',
      'Insurance Policy',
      'Pollution Under Control (PUC) Certificate',
    ],
  },
  {
    title: 'What Police CAN Do',
    icon: 'shield-checkmark',
    items: [
      'Ask for your documents for verification',
      'Seize your vehicle if you are unlicensed',
      'Fine you for jumping signals or overspeeding',
      'Conduct a breathalyzer test for alcohol',
    ],
  },
  {
    title: 'What Police CANNOT Do',
    icon: 'alert-circle',
    items: [
      'Physically harass or abuse you',
      'Forcefully take your car keys without reason',
      'Fine you without a valid challan receipt',
      'Detain you without telling you the offense',
    ],
  },
];

export default function RightsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Know Your Rights</Text>
        <Text style={styles.headerSubtitle}>Legal Protection Guide</Text>
      </View>

      {RIGHTS_DATA.map((section, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name={section.icon as any} size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.cardTitle}>{section.title}</Text>
          </View>
          <View style={styles.divider} />
          {section.items.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      ))}

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
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
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
  helpButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    marginTop: 10,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
});
