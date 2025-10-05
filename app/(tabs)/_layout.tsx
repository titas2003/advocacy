import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen 
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" color={color} size={size} />,
        }}
      />
      <Tabs.Screen 
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ color, size }) => <Ionicons name="call" color={color} size={size} />,
        }}
      />
      <Tabs.Screen 
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
        }}
      />
      <Tabs.Screen 
        name="faq"
        options={{
          title: 'FAQ',
          tabBarIcon: ({ color, size }) => <Ionicons name="help-circle" color={color} size={size} />,
        }}
      />
      <Tabs.Screen 
        name="version"
        options={{
          title: 'Version',
          tabBarIcon: ({ color, size }) => <Ionicons name="information-circle-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
