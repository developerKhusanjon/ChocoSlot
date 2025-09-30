import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ImageIcon, DollarSign, FileText, Tag, X, Grid, Clock } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/stores/app-store';

export default function AddCakeScreen() {
    const { cakes, addCake, updateCake, reservations } = useAppStore();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEditing = !!id;
    const existingCake = isEditing ? cakes.find(c => c.id === id) : null;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        available: true,
        status: 'available' as 'available' | 'out-of-stock' | 'removing-from-stock'
    });
    const [showImageSelector, setShowImageSelector] = useState(false);

    // Local cake images
    const localCakeImages = [
        { id: '1', name: 'Bliss', url: require('@/assets/foods/bliss.jpeg') },
        { id: '2', name: 'Burger', url: require('@/assets/foods/burger.jpg') },
        { id: '3', name: 'Cap', url: require('@/assets/foods/cap.webp') },
        { id: '4', name: 'Coffee', url: require('@/assets/foods/coffee.webp') },
        { id: '5', name: 'Delight', url: require('@/assets/foods/delight.jpeg') },
        { id: '6', name: 'Drink', url: require('@/assets/foods/drink.webp') },
        { id: '7', name: 'Fast Food', url: require('@/assets/foods/fast.jpg') },
        { id: '8', name: 'Food', url: require('@/assets/foods/fd.jpg') },
        { id: '9', name: 'Free', url: require('@/assets/foods/fr.jpg') },
        { id: '10', name: 'Hot Dog', url: require('@/assets/foods/hotd.jpg') },
        { id: '11', name: 'Pizza', url: require('@/assets/foods/pizza.jpeg') },
        { id: '12', name: 'Rice', url: require('@/assets/foods/rice.webp') },
        { id: '13', name: 'Shaurma', url: require('@/assets/foods/shaurma.jpg') },
        { id: '14', name: 'Spaghetti', url: require('@/assets/foods/spagh.jpg') },
        { id: '15', name: 'Steak', url: require('@/assets/foods/steak.webp') },
        { id: '16', name: 'Vanilla', url: require('@/assets/foods/vanilla.jpeg') },
        { id: '17', name: 'Water', url: require('@/assets/foods/water.jpg') },
    ];

    useEffect(() => {
        if (existingCake) {
            // Determine the correct status based on cake properties
            let cakeStatus: 'available' | 'out-of-stock' | 'removing-from-stock' = 'available';
            if (existingCake.status) {
                cakeStatus = existingCake.status;
            } else if (!existingCake.available) {
                cakeStatus = 'out-of-stock';
            }

            setFormData({
                name: existingCake.name,
                description: existingCake.description,
                price: existingCake.price.toString(),
                image: existingCake.image,
                category: existingCake.category,
                available: existingCake.available,
                status: cakeStatus
            });
        }
    }, [existingCake]);

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Please enter food name');
            return;
        }
        if (!formData.description.trim()) {
            Alert.alert('Error', 'Please enter food description');
            return;
        }
        if (!formData.price.trim() || isNaN(parseFloat(formData.price))) {
            Alert.alert('Error', 'Please enter a valid price');
            return;
        }
        if (!formData.image) {
            Alert.alert('Error', 'Please enter image URL');
            return;
        }
        if (!formData.category.trim()) {
            Alert.alert('Error', 'Please enter food category');
            return;
        }

        const cakeData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: parseFloat(formData.price),
            image: formData.image,
            category: formData.category.trim(),
            available: formData.status === 'available',
            status: formData.status,
            statusUpdatedAt: formData.status === 'removing-from-stock' ? new Date().toISOString() : undefined
        };

        if (isEditing && existingCake) {
            updateCake(existingCake.id, cakeData);
            Alert.alert('Success', 'Food updated successfully!');
        } else {
            addCake(cakeData);
            Alert.alert('Success', 'Food added successfully!');
        }

        router.back();
    };

    const canSetRemovingStatus = () => {
        if (!existingCake) return false;
        const cakeReservations = reservations.filter(r => r.cakeId === existingCake.id && r.status !== 'canceled');
        return cakeReservations.length === 0;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: isEditing ? 'Edit Food' : 'Add New Food',
                    headerStyle: { backgroundColor: theme.colors.surface },
                    headerTintColor: theme.colors.onSurface
                }}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputContainer}>
                            <Tag size={20} color={theme.colors.onSurfaceVariant} />
                            <TextInput
                                style={styles.input}
                                placeholder="Food Name"
                                value={formData.name}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <FileText size={20} color={theme.colors.onSurfaceVariant} />
                            <TextInput
                                style={styles.input}
                                placeholder="Description"
                                value={formData.description}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                multiline
                                numberOfLines={2}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <DollarSign size={20} color={theme.colors.onSurfaceVariant} />
                            <TextInput
                                style={styles.input}
                                placeholder="Price"
                                value={formData.price}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Tag size={20} color={theme.colors.onSurfaceVariant} />
                            <TextInput
                                style={styles.input}
                                placeholder="Category (e.g., Fast Food, Cake, Drink)"
                                value={formData.category}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Image</Text>

                    <TouchableOpacity
                        style={styles.imageSelector}
                        onPress={() => setShowImageSelector(true)}
                    >
                        <Grid size={20} color="white" />
                        <Text style={styles.imageSelectorText}>Choose from Gallery</Text>
                    </TouchableOpacity>

                    {formData.image && (
                        <View style={styles.imagePreview}>
                            <Text style={styles.previewLabel}>Preview:</Text>
                            <Image
                                source={formData.image}
                                style={styles.previewImage}
                                contentFit="cover"
                            />
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Status</Text>

                    <View style={styles.statusContainer}>
                        <TouchableOpacity
                            style={[
                                styles.statusButton,
                                formData.status === 'available' && styles.statusButtonActive
                            ]}
                            onPress={() => setFormData(prev => ({ ...prev, status: 'available' }))}
                        >
                            <Text style={[
                                styles.statusButtonText,
                                formData.status === 'available' && styles.statusButtonTextActive
                            ]}>
                                Available
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.statusButton,
                                styles.outOfStockButton,
                                formData.status === 'out-of-stock' && styles.statusButtonActive
                            ]}
                            onPress={() => setFormData(prev => ({ ...prev, status: 'out-of-stock' }))}
                        >
                            <Text style={[
                                styles.statusButtonText,
                                styles.outOfStockButtonText,
                                formData.status === 'out-of-stock' && styles.statusButtonTextActive
                            ]}>
                                Out of Stock
                            </Text>
                        </TouchableOpacity>

                        {isEditing && existingCake && canSetRemovingStatus() && (
                            <TouchableOpacity
                                style={[
                                    styles.statusButton,
                                    styles.removeFromStockButton,
                                    formData.status === 'removing-from-stock' && styles.statusButtonActive
                                ]}
                                onPress={() => setFormData(prev => ({ ...prev, status: 'removing-from-stock' }))}
                            >
                                <Clock size={16} color={formData.status === 'removing-from-stock' ? 'white' : '#DC2626'} />
                                <Text style={[
                                    styles.statusButtonText,
                                    styles.removeFromStockButtonText,
                                    formData.status === 'removing-from-stock' && styles.statusButtonTextActive
                                ]}>
                                    Removing from Stock
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={showImageSelector}
                transparent
                animationType="slide"
                onRequestClose={() => setShowImageSelector(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choose Cake Image</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowImageSelector(false)}
                            >
                                <X size={20} color={theme.colors.onSurface} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.imageGrid} showsVerticalScrollIndicator={false}>
                            <View style={styles.imageGridContainer}>
                                {localCakeImages.map((image) => (
                                    <TouchableOpacity
                                        key={image.id}
                                        style={styles.imageOption}
                                        onPress={() => {
                                            setFormData(prev => ({ ...prev, image: image.url }));
                                            setShowImageSelector(false);
                                        }}
                                    >
                                        <Image
                                            source={image.url}
                                            style={styles.imageOptionImage}
                                            contentFit="cover"
                                        />
                                        <Text style={styles.imageOptionName}>{image.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>
                        {isEditing ? 'Update Food' : 'Add Food'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg
    },
    section: {
        marginBottom: theme.spacing.xl
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.onSurface,
        marginBottom: theme.spacing.md
    },
    inputGroup: {
        gap: theme.spacing.md
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    input: {
        flex: 1,
        fontSize: theme.fontSize.md,
        color: theme.colors.onSurface,
        marginLeft: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        minHeight: 20
    },
    imagePreview: {
        marginTop: theme.spacing.md,
        alignItems: 'center'
    },
    previewLabel: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurfaceVariant,
        marginBottom: theme.spacing.sm
    },
    previewImage: {
        width: 200,
        height: 150,
        borderRadius: theme.borderRadius.md
    },
    availabilityContainer: {
        flexDirection: 'row',
        gap: theme.spacing.md
    },
    availabilityButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        alignItems: 'center'
    },
    availabilityButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary
    },
    availabilityButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurfaceVariant
    },
    availabilityButtonTextActive: {
        color: 'white'
    },
    statusContainer: {
        gap: theme.spacing.md
    },
    statusButton: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.xs
    },
    statusButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary
    },
    statusButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurfaceVariant
    },
    statusButtonTextActive: {
        color: 'white'
    },
    footer: {
        flexDirection: 'row',
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.surface
    },
    removeFromStockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DC2626',
        borderColor: '#DC2626',
        gap: theme.spacing.xs
    },
    removeFromStockButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: 'white'
    },
    outOfStockButton: {
        backgroundColor: '#FEF3C7',
        borderColor: '#D97706'
    },
    outOfStockButtonText: {
        color: '#D97706'
    },
    cancelButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center'
    },
    cancelButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.onSurfaceVariant
    },
    submitButton: {
        flex: 2,
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center'
    },
    submitButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: 'white'
    },
    imageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm
    },
    imageSelectorText: {
        color: 'white',
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        maxHeight: '80%',
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
    imageGrid: {
        flex: 1
    },
    imageGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md
    },
    imageOption: {
        width: '48%',
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden'
    },
    imageOptionImage: {
        width: '100%',
        height: 120
    },
    imageOptionName: {
        padding: theme.spacing.sm,
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurface,
        textAlign: 'center'
    }
});