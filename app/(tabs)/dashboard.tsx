import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Calendar, TrendingUp, Clock, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { ReservationCard } from '@/components/ReservationCard';
import { useAppStore } from '@/stores/app-store';
import { Reservation } from '@/types/reservation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
    const insets = useSafeAreaInsets();
    const { getTodayReservations, getReservationWithCake, reservations, updateReservation, dailyStats } = useAppStore();
    const todayReservations = getTodayReservations();
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const stats = dailyStats;

    const handleReservationPress = (reservationId: string) => {
        const reservation = reservations.find(r => r.id === reservationId);
        if (reservation) {
            setSelectedReservation(reservation);
            setShowStatusModal(true);
        }
    };

    const handleStatusChange = (newStatus: 'pending' | 'confirmed' | 'completed' | 'canceled' | 'delivered') => {
        if (selectedReservation) {
            updateReservation(selectedReservation.id, { status: newStatus });
            setShowStatusModal(false);
            setSelectedReservation(null);
        }
    };

    const handleEditReservation = () => {
        if (selectedReservation) {
            setShowStatusModal(false);
            setSelectedReservation(null);
            router.push(`/add-reservation?id=${selectedReservation.id}`);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>Good day!</Text>
                        <Text style={styles.title}>Dishly Dashboard</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/add-reservation')}
                    >
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { backgroundColor: theme.colors.cardBlue }]}>
                            <Calendar size={24} color={theme.colors.primary} />
                            <Text style={styles.statNumber}>{stats.today}</Text>
                            <Text style={styles.statLabel}>Today</Text>
                        </View>

                        <View style={[styles.statCard, { backgroundColor: theme.colors.cardPeach }]}>
                            <Clock size={24} color={theme.colors.warning} />
                            <Text style={styles.statNumber}>{stats.pending}</Text>
                            <Text style={styles.statLabel}>Pending</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, { backgroundColor: theme.colors.cardGreen }]}>
                            <TrendingUp size={24} color={theme.colors.success} />
                            <Text style={styles.statNumber}>{stats.confirmed}</Text>
                            <Text style={styles.statLabel}>Confirmed</Text>
                        </View>

                        <View style={[styles.statCard, { backgroundColor: theme.colors.cardPink }]}>
                            <Calendar size={24} color={theme.colors.accent} />
                            <Text style={styles.statNumber}>{stats.canceled}</Text>
                            <Text style={styles.statLabel}>Canceled</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Today&apos;s Reservations</Text>
                        <TouchableOpacity onPress={() => router.push('/reservations')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {todayReservations.length > 0 ? (
                        todayReservations.map((reservation) => {
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
                            <Calendar size={48} color={theme.colors.onSurfaceVariant} />
                            <Text style={styles.emptyTitle}>No reservations today</Text>
                            <Text style={styles.emptyDescription}>
                                All caught up! No food pickups scheduled for today.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <Modal
                visible={showStatusModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowStatusModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Reservation</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowStatusModal(false)}
                            >
                                <X size={20} color={theme.colors.onSurface} />
                            </TouchableOpacity>
                        </View>

                        {selectedReservation && (
                            <View style={styles.modalBody}>
                                <Text style={styles.customerName}>{selectedReservation.customerName}</Text>
                                <Text style={styles.currentStatus}>Current Status: {selectedReservation.status.charAt(0).toUpperCase() + selectedReservation.status.slice(1)}</Text>

                                <View style={styles.statusButtons}>
                                    <TouchableOpacity
                                        style={[styles.statusButton, { backgroundColor: theme.colors.warning }]}
                                        onPress={() => handleStatusChange('pending')}
                                    >
                                        <Text style={styles.statusButtonText}>Pending</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.statusButton, { backgroundColor: theme.colors.success }]}
                                        onPress={() => handleStatusChange('confirmed')}
                                    >
                                        <Text style={styles.statusButtonText}>Confirmed</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.statusButton, { backgroundColor: theme.colors.primary }]}
                                        onPress={() => handleStatusChange('completed')}
                                    >
                                        <Text style={styles.statusButtonText}>Completed</Text>
                                    </TouchableOpacity>

                                    {selectedReservation.status === 'completed' && (
                                        <TouchableOpacity
                                            style={[styles.statusButton, { backgroundColor: '#0ab3ad' }]}
                                            onPress={() => handleStatusChange('delivered')}
                                        >
                                            <Text style={styles.statusButtonText}>Delivered</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        style={[styles.statusButton, { backgroundColor: '#dc3545' }]}
                                        onPress={() => handleStatusChange('canceled')}
                                    >
                                        <Text style={styles.statusButtonText}>Canceled</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={handleEditReservation}
                                    >
                                        <Text style={styles.editButtonText}>Edit Details</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
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
        paddingVertical: theme.spacing.xl,
        borderBottomLeftRadius: theme.borderRadius.xl,
        borderBottomRightRadius: theme.borderRadius.xl
    },
    headerContent: {
        paddingTop: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    greeting: {
        fontSize: theme.fontSize.md,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: theme.spacing.xs
    },
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: 'white'
    },
    addButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: theme.borderRadius.full,
        padding: theme.spacing.md,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg
    },
    statsContainer: {
        marginBottom: theme.spacing.xl
    },
    statsRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md
    },
    statCard: {
        flex: 1,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        gap: theme.spacing.sm
    },
    statNumber: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.onSurface
    },
    statLabel: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.onSurfaceVariant,
        fontWeight: theme.fontWeight.medium
    },
    section: {
        marginBottom: theme.spacing.xl
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg
    },
    sectionTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.onSurface
    },
    viewAllText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.medium
    },
    emptyState: {
        alignItems: 'center',
        padding: theme.spacing.xxl,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        gap: theme.spacing.md
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        width: '100%',
        maxWidth: 400,
        padding: theme.spacing.lg
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg
    },
    modalTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.onSurface
    },
    closeButton: {
        padding: theme.spacing.xs
    },
    modalBody: {
        gap: theme.spacing.md
    },
    customerName: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurface,
        textAlign: 'center'
    },
    currentStatus: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        textTransform: 'capitalize'
    },
    statusButtons: {
        gap: theme.spacing.sm
    },
    statusButton: {
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center'
    },
    statusButtonText: {
        color: 'white',
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold
    },
    actionButtons: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.md
    },
    editButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        alignItems: 'center'
    },
    editButtonText: {
        color: theme.colors.primary,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold
    },
    cancelButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.error || '#dc3545',
        alignItems: 'center'
    },
    cancelButtonText: {
        color: 'white',
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold
    }
});