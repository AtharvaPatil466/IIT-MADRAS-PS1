import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RightsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rights Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
