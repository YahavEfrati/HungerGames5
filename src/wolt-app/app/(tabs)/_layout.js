import React from 'react';
import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import { useTheme } from '../../constants/theme';

export default function TabLayout() {
  const { colors } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        // TODO: Style this Tab Bar exactly like Wolt later
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/icons/home-icon-silhouette.png')} 
              style={{ 
                width: 24, 
                height: 24, 
                // Tint the icon color dynamically based on its active state
                tintColor: focused ? colors.primary : colors.textSecondary 
              }} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/icons/search.png')} 
              style={{ 
                width: 24, 
                height: 24, 
                // Tint the icon color dynamically based on its active state
                tintColor: focused ? colors.primary : colors.textSecondary 
              }} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/icons/shopping-cart.png')} 
              style={{ 
                width: 24, 
                height: 24, 
                // Tint the icon color dynamically based on its active state
                tintColor: focused ? colors.primary : colors.textSecondary 
              }} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/icons/account.png')} 
              style={{ 
                width: 24, 
                height: 24, 
                // Tint the icon color dynamically based on its active state
                tintColor: focused ? colors.primary : colors.textSecondary 
              }} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="restaurant/[id]"
        options={{
          href: null, // Hide internal stack from tab bar
        }}
      />
    </Tabs>
  );
}
