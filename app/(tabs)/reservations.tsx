import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Filter, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { ReservationCard } from '@/components/ReservationCard';
import { useAppStore } from '@/stores/app-store';

export default function ReservationsScreen() {
    const insets = useSafeAreaInsets();
    const { reservations, getReservationWithCake } = useAppStore();
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'canceled'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const filteredReservations = reservations
        .filter(reservation => {
            // Filter by status
            if (filter !== 'all' && reservation.status !== filter) return false;

            // Filter by search query
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const { cake } = getReservationWithCake(reservation);
                return (
                    reservation.customerName.toLowerCase().includes(query) ||
                    reservation.contact.toLowerCase().includes(query) ||
                    (cake?.name.toLowerCase().includes(query)) ||
                    (reservation.notes?.toLowerCase().includes(query))
                );
            }

            return true;
        })
        .sort((a, b) => {
            // Sort by pickup date and time (earlier first)
            const dateTimeA = new Date(`${a.pickupDate}T${a.pickupTime}`);
            const dateTimeB = new Date(`${b.pickupDate}T${b.pickupTime}`);
            return dateTimeA.getTime() - dateTimeB.getTime();
        });

    const handleReservationPress = (reservationId: string) => {
        if (reservationId && reservationId.trim()) {
            router.push(`/add-reservation?id=${reservationId}`);
        }
    };

    const filterButtons = [
        { key: 'all' as const, label: 'All', count: reservations.length },
        { key: 'pending' as const, label: 'Pending', count: reservations.filter(r => r.status === 'pending').length },
        { key: 'confirmed' as const, label: 'Confirmed', count: reservations.filter(r => r.status === 'confirmed').length },
        { key: 'completed' as const, label: 'Completed', count: reservations.filter(r => r.status === 'completed').length },
        { key: 'canceled' as const, label: 'Canceled', count: reservations.filter(r => r.status === 'canceled').length }
    ];

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}>
                <Text style={styles.title}>Reservations</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setShowSearch(!showSearch)}
                    >
                        <Search size={20} color={theme.colors.onSurface} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Filter size={20} color={theme.colors.onSurface} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                {filterButtons.map((button) => (
                    <TouchableOpacity
                        key={button.key}
                        style={[
                            styles.filterButton,
                            filter === button.key && styles.filterButtonActive
                        ]}
                        onPress={() => setFilter(button.key)}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            filter === button.key && styles.filterButtonTextActive
                        ]}>
                            {button.label} ({button.count})
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {showSearch && (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by customer name, contact, cake, or notes..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                    />
                </View>
            )}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => {
                        const { cake } = getReservationWithCake(reservation);
                        return (
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                cake={cake}
                                onPress={() => handleReservationPress(reservation.id)}
                            />
                        );
                    })
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>No reservations found</Text>
                        <Text style={styles.emptyDescription}>
                            {searchQuery.trim()
                                ? "No reservations match your search criteria. Try adjusting your search terms."
                                : filter === 'all'
                                    ? "You don't have any reservations yet."
                                    : `No ${filter} reservations at the moment.`
                            }
                        </Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push('/add-reservation')}
                        >
                            <Text style={styles.addButtonText}>Add New Reservation</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border
    },
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.onSurface
    },
    headerActions: {
        flexDirection: 'row',
        gap: theme.spacing.sm
    },
    iconButton: {
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.surfaceVariant
    },
    filterContainer: {
        maxHeight: 60
    },
    filterContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        gap: theme.spacing.sm
    },
    filterButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surfaceVariant,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    filterButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary
    },
    filterButtonText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurfaceVariant
    },
    filterButtonTextActive: {
        color: 'white'
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg
    },
    emptyState: {
        alignItems: 'center',
        padding: theme.spacing.xxl,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        gap: theme.spacing.md,
        marginTop: theme.spacing.xl
    },
    emptyTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.onSurface
    },
    emptyDescription: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 20
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginTop: theme.spacing.md
    },
    addButtonText: {
        color: 'white',
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border
    },
    searchInput: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        fontSize: theme.fontSize.md,
        color: theme.colors.onSurface,
        borderWidth: 1,
        borderColor: theme.colors.border
    }
});