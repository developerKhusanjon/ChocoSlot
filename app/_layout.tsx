import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { theme } from "@/constants/theme";
import { AppProvider } from "@/stores/app-store";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
    return (
        <Stack screenOptions={{
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: theme.colors.surface },
            headerTintColor: theme.colors.onSurface
        }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="add-reservation"
                options={{
                    presentation: "modal",
                    title: "New Reservation"
                }}
            />
            <Stack.Screen
                name="add-cake"
                options={{
                    presentation: "modal",
                    title: "Add Food"
                }}
            />
            <Stack.Screen
                name="reservation/[id]"
                options={{
                    title: "Reservation Details"
                }}
            />
            <Stack.Screen
                name="cake/[id]"
                options={{
                    title: "Food Details"
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default function RootLayout() {
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <GestureHandlerRootView style={styles.container}>
                    <RootLayoutNav />
                </GestureHandlerRootView>
            </AppProvider>
        </QueryClientProvider>
    );
}