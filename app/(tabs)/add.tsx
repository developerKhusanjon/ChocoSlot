import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Info, Plus, Calendar, ChefHat, Clock, AlertCircle, FileX2 } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export default function InfoScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                style={[styles.header, { paddingTop: insets.top + theme.spacing.lg }]}
            >
                <View style={styles.headerContent}>
                    <Info size={32} color="white" />
                    <Text style={styles.title}>Information</Text>
                    <Text style={styles.subtitle}>Learn how to use Dishly</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Plus size={20} color={theme.colors.primary} />
                        <Text style={styles.sectionTitle}>Adding New Reservations</Text>
                    </View>
                    <Text style={styles.sectionText}>
                        Tap the + button in the Dashboard header to create new reservations. Fill in customer details, select a food, and set pickup date and time. Reservation details can only be updated while the status is Pending. To make changes to an existing reservation, first set its status to Pending.
                    </Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ChefHat size={20} color={theme.colors.primary} />
                        <Text style={styles.sectionTitle}>Adding New Foods to Menu</Text>
                    </View>
                    <Text style={styles.sectionText}>
                        Go to Menu tab and tap the + button to add new foods. Set name, price, description, and availability status.
                    </Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <AlertCircle size={20} color={theme.colors.accent} />
                        <Text style={styles.sectionTitle}>Canceling Reservations</Text>
                    </View>
                    <Text style={styles.sectionText}>
                        Tap on any reservation in Dashboard or Reservations tab to change its status to &quot;Canceled&quot;.
                    </Text>
                    <View style={styles.importantNote}>
                        <Clock size={16} color={theme.colors.warning} />
                        <Text style={styles.noteText}>
                            Important: Cancellation applies after 3 minutes. You can revert by changing the status back before the time expires.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ChefHat size={20} color={theme.colors.accent} />
                        <Text style={styles.sectionTitle}>Removing Food from Menu</Text>
                    </View>
                    <Text style={styles.sectionText}>
                        In the Menu tab, tap on any food and set its status to &quot;Removing from Stock&quot; (only available for foods with no active reservations).
                    </Text>
                    <View style={styles.importantNote}>
                        <Clock size={16} color={theme.colors.warning} />
                        <Text style={styles.noteText}>
                            Important: Removal applies after 3 minutes. You can revert by changing the status back before the time expires.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Calendar size={20} color={theme.colors.primary} />
                        <Text style={styles.sectionTitle}>Dashboard & Reservations</Text>
                    </View>
                    <Text style={styles.sectionText}>
                        • Dashboard shows today&apos;s reservations only with daily statistics
                    </Text>
                    <Text style={styles.sectionText}>
                        • All reservations can be found in the Reservations tab
                    </Text>
                    <Text style={styles.sectionText}>
                        • Reservations are sorted by closest due date and time
                    </Text>
                    <Text style={styles.sectionText}>
                        • Canceled reservations are automatically removed after 3 minutes
                    </Text>
                    <View style={styles.importantNote}>
                        <FileX2 size={16} color={theme.colors.error} />
                        <Text style={styles.noteText}>
                            Important: All data is stored locally on your device. Deleting the app will also remove the local storage, which may result in the loss of all reservations and menu data
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
        borderBottomLeftRadius: theme.borderRadius.xl,
        borderBottomRightRadius: theme.borderRadius.xl
    },
    headerContent: {
        alignItems: 'center',
        gap: theme.spacing.sm
    },
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: 'white',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center'
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg
    },
    section: {
        marginBottom: theme.spacing.xl,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.onSurface
    },
    sectionText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.onSurfaceVariant,
        lineHeight: 22,
        marginBottom: theme.spacing.sm
    },
    importantNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.cardPeach,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginTop: theme.spacing.sm
    },
    noteText: {
        flex: 1,
        fontSize: theme.fontSize.sm,
        color: theme.colors.onSurface,
        lineHeight: 20,
        fontWeight: theme.fontWeight.medium
    }
});