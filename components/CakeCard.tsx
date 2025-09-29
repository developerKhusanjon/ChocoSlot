import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MoreVertical } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Cake } from '@/types/reservation';

interface CakeCardProps {
    cake: Cake;
    onPress?: () => void;
    onMenuPress?: () => void;
}

export function CakeCard({ cake, onPress, onMenuPress }: CakeCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: cake.image }}
                    style={styles.image}
                    contentFit="cover"
                />
                <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
                    <MoreVertical size={20} color={theme.colors.onSurface} />
                </TouchableOpacity>
                {(!cake.available || cake.status === 'out-of-stock' || cake.status === 'removing-from-stock') && (
                    <View style={styles.unavailableOverlay}>
                        <Text style={styles.unavailableText}>
                            {cake.status === 'removing-from-stock' ? 'Removing...' : 'Out of Stock'}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={2}>{cake.name}</Text>
                <Text style={styles.description} numberOfLines={2}>{cake.description}</Text>
                <View style={styles.footer}>
                    <Text style={styles.price}>${cake.price.toFixed(2)}</Text>
                    <View style={[
                        styles.availabilityBadge,
                        {
                            backgroundColor: cake.status === 'removing-from-stock' ? '#FEE2E2' :
                                (cake.status === 'out-of-stock' || !cake.available) ? '#FEF3C7' :
                                    theme.colors.cardGreen
                        }
                    ]}>
                        <Text style={[
                            styles.availabilityText,
                            {
                                color: cake.status === 'removing-from-stock' ? '#DC2626' :
                                    (cake.status === 'out-of-stock' || !cake.available) ? '#D97706' :
                                        theme.colors.success
                            }
                        ]}>
                            {cake.status === 'removing-from-stock' ? 'Removing...' :
                                (cake.status === 'out-of-stock' || !cake.available) ? 'Out of Stock' :
                                    'Available'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: theme.spacing.md
    },
    imageContainer: {
        position: 'relative',
        height: 160
    },
    image: {
        width: '100%',
        height: '100%'
    },
    menuButton: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: theme.borderRadius.full,
        padding: theme.spacing.xs,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    unavailableOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: theme.spacing.sm,
        alignItems: 'center'
    },
    unavailableText: {
        color: 'white',
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium
    },
    content: {
        padding: theme.spacing.md
    },
    name: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.onSurface,
        marginBottom: theme.spacing.xs
    },
    description: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.onSurfaceVariant,
        marginBottom: theme.spacing.md,
        lineHeight: 20
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    price: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary
    },
    availabilityBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full
    },
    availabilityText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium
    }
});