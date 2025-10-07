import { Tabs } from "expo-router";
import { Home, Calendar, Info, ChefHat } from "lucide-react-native";
import React from "react";
import { theme } from "@/constants/theme";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    // paddingTop: 8
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '500' as const,
                    marginTop: -2
                }
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
                }}
            />
            <Tabs.Screen
                name="reservations"
                options={{
                    title: "Reservations",
                    tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: "Info",
                    tabBarIcon: ({ color, size }) => <Info color={color} size={size} />
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: "Menu",
                    tabBarIcon: ({ color, size }) => <ChefHat color={color} size={size} />
                }}
            />
        </Tabs>
    );
}