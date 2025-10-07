import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface StatusBadgeProps {
    status: 'pending' | 'confirmed' | 'completed' | 'canceled' | 'delivered';
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'pending':
                return {
                    color: theme.colors.pending,
                    backgroundColor: '#FEF3C7',
                    text: 'Pending'
                };
            case 'confirmed':
                return {
                    color: theme.colors.confirmed,
                    backgroundColor: '#D1FAE5',
                    text: 'Confirmed'
                };
            case 'completed':
                return {
                    color: theme.colors.completed,
                    backgroundColor: '#E0E7FF',
                    text: 'Completed'
                };
            case 'canceled':
                return {
                    color: '#DC2626',
                    backgroundColor: '#FEE2E2',
                    text: 'Canceled'
                };
            case 'delivered':
                return {
                    color: '#059669',
                    backgroundColor: '#D1FAE5',
                    text: 'Delivered'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
            <Text style={[styles.text, { color: config.color }]}>
                {config.text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
        alignSelf: 'flex-start'
    },
    text: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium
    }
});