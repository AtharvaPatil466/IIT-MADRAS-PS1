import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ChatScreen from './screens/ChatScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import RightsScreen from './screens/RightsScreen';
import VerifyScreen from './screens/VerifyScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'help';

            if (route.name === 'Chat') {
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
            } else if (route.name === 'Calculator') {
              iconName = focused ? 'calculator' : 'calculator-outline';
            } else if (route.name === 'Rights') {
              iconName = focused ? 'shield' : 'shield-outline';
            } else if (route.name === 'Verify') {
              iconName = focused ? 'warning' : 'warning-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
            backgroundColor: '#0b1326',
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerTitle: 'DriveLegal',
          headerStyle: {
            backgroundColor: '#0b1326',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#dae2fd',
          },
        })}
      >
        <Tab.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Calculator" component={CalculatorScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Rights" component={RightsScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Verify" component={VerifyScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
