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
          tabBarActiveTintColor: '#2563eb', // blue-600
          tabBarInactiveTintColor: '#9ca3af', // gray-400
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopColor: '#e5e7eb', // gray-200
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerTitle: 'DriveLegal',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#111827', // gray-900
          },
        })}
      >
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Calculator" component={CalculatorScreen} />
        <Tab.Screen name="Rights" component={RightsScreen} />
        <Tab.Screen name="Verify" component={VerifyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
