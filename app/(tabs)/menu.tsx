import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Search, Grid, List } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { CakeCard } from '@/components/CakeCard';
import { useAppStore } from '@/stores/app-store';

export default function MenuScreen() {
    const insets = useSafeAreaInsets();
    const { cakes, deleteCake, reservations } = useAppStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const filteredCakes = cakes.filter(cake => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            cake.name.toLowerCase().includes(query) ||
            cake.description.toLowerCase().includes(query) ||
            cake.category.toLowerCase().includes(query)
        );
    });

    const handleCakeMenu = (cakeId: string) => {
        const cake = cakes.find(c => c.id === cakeId);
        if (!cake) return;

        const cakeReservations = reservations.filter(r => r.cakeId === cakeId);
        const canDelete = cakeReservations.length === 0;

        Alert.alert(
            cake.name,
            'Choose an action:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Edit',
                    onPress: () => router.push(`/add-cake?id=${cakeId}`)
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => handleDeleteCake(cakeId, canDelete, cakeReservations.length)
                }
            ]
        );
    };

    const handleDeleteCake = (cakeId: string, canDelete: boolean, reservationCount: number) => {
        if (!canDelete) {
            Alert.alert(
                'Cannot Delete Cake',
                `This cake has ${reservationCount} reservation(s) and cannot be deleted. Please complete or cancel all reservations first.`,
                [{ text: 'OK' }]
            );
            return;
        }

        Alert.alert(
            'Delete Cake',
            'Are you sure you want to delete this cake? This action cannot be undone.',
            [
                { text: 'Keep Cake', style: 'cancel' },
                {
                    text: 'Delete Cake',
                    style: 'destructive',
                    onPress: () => {
                        deleteCake(cakeId);
                        Alert.alert('Success', 'Cake deleted successfully!');
                    }
                }
            ]
        );
    };

    const handleCakePress = (cakeId: string) => {
        router.push(`/add-cake?id=${cakeId}`);
    };

    const handleAddCake = () => {
        router.push('/add-cake');
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}>
                <Text style={styles.title}>Cake Menu</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setShowSearch(!showSearch)}
                    >
                        <Search size={20} color={theme.colors.onSurface} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                        {viewMode === 'grid' ? (
                            <List size={20} color={theme.colors.onSurface} />
                        ) : (
                            <Grid size={20} color={theme.colors.onSurface} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {showSearch && (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search cakes by name, description, or category..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                    />
                </View>
            )}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.cakeGrid}>
                    {filteredCakes.map((cake) => (
                        <View key={cake.id} style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
                            <CakeCard
                                cake={cake}
                                onPress={() => handleCakePress(cake.id)}
                                onMenuPress={() => handleCakeMenu(cake.id)}
                            />
                        </View>
                    ))}
                </View>

                {filteredCakes.length === 0 && cakes.length > 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>No cakes found</Text>
                        <Text style={styles.emptyDescription}>
                            No cakes match your search criteria. Try adjusting your search terms.
                        </Text>
                    </View>
                )}

                {cakes.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>No cakes in menu</Text>
                        <Text style={styles.emptyDescription}>
                            Start building your cake menu by adding your first cake.
                        </Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddCake}
                        >
                            <Text style={styles.addButtonText}>Add First Cake</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={handleAddCake}
            >
                <Plus size={24} color="white" />
            </TouchableOpacity>
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
    content: {
        flex: 1,
        padding: theme.spacing.lg
    },
    cakeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md
    },
    gridItem: {
        width: '48%'
    },
    listItem: {
        width: '100%'
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
    fab: {
        position: 'absolute',
        bottom: theme.spacing.lg,
        right: theme.spacing.lg,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.full,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
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