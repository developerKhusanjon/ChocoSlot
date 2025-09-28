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
import { ImageIcon, DollarSign, FileText, Tag, Trash2, X, Grid } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/stores/app-store';

export default function AddCakeScreen() {
    const { cakes, addCake, updateCake, deleteCake, reservations } = useAppStore();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEditing = !!id;
    const existingCake = isEditing ? cakes.find(c => c.id === id) : null;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        available: true
    });
    const [showImageSelector, setShowImageSelector] = useState(false);

    // Local cake images
    const localCakeImages = [
        { id: '1', name: 'Chocolate Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
        { id: '2', name: 'Vanilla Cake', url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400' },
        { id: '3', name: 'Strawberry Cake', url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400' },
        { id: '4', name: 'Red Velvet', url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400' },
        { id: '5', name: 'Carrot Cake', url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400' },
        { id: '6', name: 'Lemon Cake', url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400' },
        { id: '7', name: 'Cheesecake', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400' },
        { id: '8', name: 'Black Forest', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400' },
        { id: '9', name: 'Tiramisu', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
        { id: '10', name: 'Fruit Tart', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' }
    ];

    useEffect(() => {
        if (existingCake) {
            setFormData({
                name: existingCake.name,
                description: existingCake.description,
                price: existingCake.price.toString(),
                image: existingCake.image,
                category: existingCake.category,
                available: existingCake.available
            });
        }
    }, [existingCake]);

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Please enter cake name');
            return;
        }
        if (!formData.description.trim()) {
            Alert.alert('Error', 'Please enter cake description');
            return;
        }
        if (!formData.price.trim() || isNaN(parseFloat(formData.price))) {
            Alert.alert('Error', 'Please enter a valid price');
            return;
        }
        if (!formData.image.trim()) {
            Alert.alert('Error', 'Please enter image URL');
            return;
        }
        if (!formData.category.trim()) {
            Alert.alert('Error', 'Please enter cake category');
            return;
        }

        const cakeData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: parseFloat(formData.price),
            image: formData.image.trim(),
            category: formData.category.trim(),
            available: formData.available
        };

        if (isEditing && existingCake) {
            updateCake(existingCake.id, cakeData);
            Alert.alert('Success', 'Cake updated successfully!');
        } else {
            addCake(cakeData);
            Alert.alert('Success', 'Cake added successfully!');
        }

        router.back();
    };

    const handleDelete = () => {
        if (!existingCake) return;

        // Check if cake has any reservations
        const cakeReservations = reservations.filter(r => r.cakeId === existingCake.id);
        if (cakeReservations.length > 0) {
            Alert.alert(
                'Cannot Delete Cake',
                `This cake has ${cakeReservations.length} reservation(s) and cannot be deleted. Please complete or cancel all reservations first.`,
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
                        console.log('Deleting cake with ID:', existingCake.id);
                        deleteCake(existingCake.id);
                        router.back();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: isEditing ? 'Edit Cake' : 'Add New Cake',
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
                                placeholder="Cake Name"
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
                                placeholder="Category (e.g., Chocolate, Vanilla, Fruit)"
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

                    <View style={styles.inputContainer}>
                        <ImageIcon size={20} color={theme.colors.onSurfaceVariant} />
                        <TextInput
                            style={styles.input}
                            placeholder="Or enter custom image URL"
                            value={formData.image}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, image: text }))}
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            multiline
                            numberOfLines={2}
                        />
                    </View>

                    {formData.image.trim() && (
                        <View style={styles.imagePreview}>
                            <Text style={styles.previewLabel}>Preview:</Text>
                            <Image
                                source={{ uri: formData.image }}
                                style={styles.previewImage}
                                contentFit="cover"
                            />
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Availability</Text>

                    <View style={styles.availabilityContainer}>
                        <TouchableOpacity
                            style={[
                                styles.availabilityButton,
                                formData.available && styles.availabilityButtonActive
                            ]}
                            onPress={() => setFormData(prev => ({ ...prev, available: true }))}
                        >
                            <Text style={[
                                styles.availabilityButtonText,
                                formData.available && styles.availabilityButtonTextActive
                            ]}>
                                Available
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.availabilityButton,
                                !formData.available && styles.availabilityButtonActive
                            ]}
                            onPress={() => setFormData(prev => ({ ...prev, available: false }))}
                        >
                            <Text style={[
                                styles.availabilityButtonText,
                                !formData.available && styles.availabilityButtonTextActive
                            ]}>
                                Out of Stock
                            </Text>
                        </TouchableOpacity>
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
                                            source={{ uri: image.url }}
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
                {isEditing && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Trash2 size={16} color="white" />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                )}

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
                        {isEditing ? 'Update Cake' : 'Add Cake'}
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
    footer: {
        flexDirection: 'row',
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.surface
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.error || '#dc3545',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        gap: theme.spacing.xs
    },
    deleteButtonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: 'white'
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