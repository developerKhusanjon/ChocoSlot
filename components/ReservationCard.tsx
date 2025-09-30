import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Clock, User, Phone } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { StatusBadge } from './StatusBadge';
import { Reservation, Cake } from '@/types/reservation';

interface ReservationCardProps {
    reservation: Reservation;
    cake?: Cake;
    onPress?: () => void;
}

export function ReservationCard({ reservation, cake, onPress }: ReservationCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.header}>
                <View style={styles.customerInfo}>
                    <View style={styles.nameRow}>
                        <User size={16} color={theme.colors.onSurfaceVariant} />
                        <Text style={styles.customerName}>{reservation.customerName}</Text>
                    </View>
                    <View style={styles.contactRow}>
                        <Phone size={14} color={theme.colors.onSurfaceVariant} />
                        <Text style={styles.contact}>{reservation.contact}</Text>
                    </View>
                </View>
                <StatusBadge status={reservation.status} />
            </View>

            <View style={styles.content}>
                <View style={styles.cakeInfo}>
                    {cake && (
                        <Image
                            source={cake.image}
                            style={styles.cakeImage}
                            contentFit="cover"
                        />
                    )}
                    <View style={styles.cakeDetails}>
                        <Text style={styles.cakeName}>{cake?.name || 'Unknown Cake'}</Text>
                        <Text style={styles.quantity}>Quantity {reservation.quantity}</Text>
                        {cake && (
                            <Text style={styles.price}>${(cake.price * reservation.quantity).toFixed(2)}</Text>
                        )}
                    </View>
                </View>

                <View style={styles.timeInfo}>
                    <Clock size={16} color={theme.colors.primary} />
                    <Text style={styles.pickupTime}>
                        {reservation.pickupDate} at {reservation.pickupTime}
                    </Text>
                </View>

                {reservation.notes && reservation.notes.trim() && (
                    <View style={styles.notesContainer}>
                        <Text style={styles.notesLabel}>Notes</Text>
                        <Text style={styles.notes}>{reservation.notes}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md
    },
    customerInfo: {
        flex: 1
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs
    },
    customerName: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.onSurface,
        marginLeft: theme.spacing.sm
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    contact: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.onSurfaceVariant,
        marginLeft: theme.spacing.sm
    },
    content: {
        gap: theme.spacing.md
    },
    cakeInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cakeImage: {
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.md,
        marginRight: theme.spacing.md
    },
    cakeDetails: {
        flex: 1
    },
    cakeName: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurface,
        marginBottom: theme.spacing.xs
    },
    quantity: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.onSurfaceVariant,
        marginBottom: theme.spacing.xs
    },
    price: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary
    },
    timeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.cardBlue,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm
    },
    pickupTime: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.primary,
        marginLeft: theme.spacing.sm
    },
    notesContainer: {
        backgroundColor: theme.colors.surfaceVariant,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm
    },
    notesLabel: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurfaceVariant,
        marginBottom: theme.spacing.xs
    },
    notes: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.onSurface,
        fontStyle: 'italic'
    }
});