import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Calendar, Clock, User, Phone, MessageSquare, ChevronDown } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppStore } from '@/stores/app-store';

export default function AddReservationScreen() {
    const { cakes, addReservation, updateReservation, reservations } = useAppStore();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEditing = !!id;
    const existingReservation = isEditing ? reservations.find(r => r.id === id) : null;
    const [formData, setFormData] = useState({
        customerName: '',
        contact: '',
        cakeId: '',
        pickupDate: new Date().toISOString().split('T')[0],
        pickupTime: '14:00',
        quantity: 1,
        notes: ''
    });

    useEffect(() => {
        if (existingReservation) {
            setFormData({
                customerName: existingReservation.customerName,
                contact: existingReservation.contact,
                cakeId: existingReservation.cakeId,
                pickupDate: existingReservation.pickupDate,
                pickupTime: existingReservation.pickupTime,
                quantity: existingReservation.quantity,
                notes: existingReservation.notes || ''
            });
        }
    }, [existingReservation]);

    const [showCakeSelector, setShowCakeSelector] = useState(false);
    const selectedCake = cakes.find(cake => cake.id === formData.cakeId);

    const handleSubmit = () => {
        if (!formData.customerName.trim()) {
            Alert.alert('Error', 'Please enter customer name');
            return;
        }
        if (!formData.contact.trim()) {
            Alert.alert('Error', 'Please enter contact information');
            return;
        }
        if (!formData.cakeId) {
            Alert.alert('Error', 'Please select a cake');
            return;
        }

        if (isEditing && existingReservation) {
            if (existingReservation.status === 'confirmed') {
                Alert.alert(
                    'Cannot Edit Confirmed Reservation',
                    'This reservation has been confirmed and cannot be modified.',
                    [{ text: 'OK' }]
                );
                return;
            }
            updateReservation(existingReservation.id, formData);
            Alert.alert('Success', 'Reservation updated successfully!');
        } else {
            addReservation({
                ...formData,
                status: 'pending'
            });
            Alert.alert('Success', 'Reservation added successfully!');
        }

        router.back();
    };

    const canEdit = !isEditing || (existingReservation?.status === 'pending');

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: isEditing ? 'Edit Reservation' : 'New Reservation',
                    headerStyle: { backgroundColor: theme.colors.surface },
                    headerTintColor: theme.colors.onSurface
                }}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer Information</Text>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputContainer}>
                            <User size={20} color={theme.colors.onSurfaceVariant} />
                            <TextInput
                                style={[styles.input, !canEdit && styles.inputDisabled]}
                                placeholder="Customer Name"
                                value={formData.customerName}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, customerName: text }))}
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                editable={canEdit}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Phone size={20} color={theme.colors.onSurfaceVariant} />
                            <TextInput
                                style={[styles.input, !canEdit && styles.inputDisabled]}
                                placeholder="Phone or Email"
                                value={formData.contact}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, contact: text }))}
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                editable={canEdit}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cake Selection</Text>

                    <TouchableOpacity
                        style={[styles.cakeSelector, !canEdit && styles.selectorDisabled]}
                        onPress={() => canEdit && setShowCakeSelector(!showCakeSelector)}
                        disabled={!canEdit}
                    >
                        {selectedCake ? (
                            <View style={styles.selectedCake}>
                                <Image
                                    source={{ uri: selectedCake.image }}
                                    style={styles.cakeImage}
                                    contentFit="cover"
                                />
                                <View style={styles.cakeInfo}>
                                    <Text style={styles.cakeName}>{selectedCake.name}</Text>
                                    <Text style={styles.cakePrice}>${selectedCake.price.toFixed(2)}</Text>
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.placeholderText}>Select a cake</Text>
                        )}
                        <ChevronDown size={20} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>

                    {showCakeSelector && (
                        <View style={styles.cakeList}>
                            {cakes.filter(cake => cake.available).map((cake) => (
                                <TouchableOpacity
                                    key={cake.id}
                                    style={styles.cakeOption}
                                    onPress={() => {
                                        setFormData(prev => ({ ...prev, cakeId: cake.id }));
                                        setShowCakeSelector(false);
                                    }}
                                >
                                    <Image
                                        source={{ uri: cake.image }}
                                        style={styles.cakeOptionImage}
                                        contentFit="cover"
                                    />
                                    <View style={styles.cakeOptionInfo}>
                                        <Text style={styles.cakeOptionName}>{cake.name}</Text>
                                        <Text style={styles.cakeOptionPrice}>${cake.price.toFixed(2)}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pickup Details</Text>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputContainer}>
                            <Calendar size={20} color={theme.colors.onSurfaceVariant} />
                            <TextInput
                                style={[styles.input, !canEdit && styles.inputDisabled]}
                                placeholder="Pickup Date"
                                value={formData.pickupDate}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, pickupDate: text }))}
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                editable={canEdit}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Clock size={20} color={theme.colors.onSurfaceVariant} />
                            <TextInput
                                style={[styles.input, !canEdit && styles.inputDisabled]}
                                placeholder="Pickup Time"
                                value={formData.pickupTime}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, pickupTime: text }))}
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                editable={canEdit}
                            />
                        </View>
                    </View>

                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>Quantity</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={[styles.quantityButton, !canEdit && styles.quantityButtonDisabled]}
                                onPress={() => canEdit && setFormData(prev => ({
                                    ...prev,
                                    quantity: Math.max(1, prev.quantity - 1)
                                }))}
                                disabled={!canEdit}
                            >
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityValue}>{formData.quantity}</Text>
                            <TouchableOpacity
                                style={[styles.quantityButton, !canEdit && styles.quantityButtonDisabled]}
                                onPress={() => canEdit && setFormData(prev => ({
                                    ...prev,
                                    quantity: prev.quantity + 1
                                }))}
                                disabled={!canEdit}
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Additional Notes</Text>

                    <View style={styles.notesContainer}>
                        <MessageSquare size={20} color={theme.colors.onSurfaceVariant} />
                        <TextInput
                            style={[styles.notesInput, !canEdit && styles.inputDisabled]}
                            placeholder="Special instructions, birthday message, etc."
                            value={formData.notes}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                            editable={canEdit}
                        />
                    </View>
                </View>

                {isEditing && existingReservation && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Status</Text>

                        <View style={styles.statusContainer}>
                            {(['pending', 'confirmed', 'completed', 'canceled'] as const).map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    style={[
                                        styles.statusButton,
                                        existingReservation.status === status && styles.statusButtonActive
                                    ]}
                                    onPress={() => {
                                        updateReservation(existingReservation.id, { status });
                                        Alert.alert('Success', `Status updated to ${status}!`);
                                    }}
                                >
                                    <Text style={[
                                        styles.statusButtonText,
                                        existingReservation.status === status && styles.statusButtonTextActive
                                    ]}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {selectedCake && (
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalAmount}>
                            ${(selectedCake.price * formData.quantity).toFixed(2)}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelButtonText}>Back</Text>
                </TouchableOpacity>

                {canEdit && (
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>
                            {isEditing ? 'Update Reservation' : 'Create Reservation'}
                        </Text>
                    </TouchableOpacity>
                )}
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
        alignItems: 'center',
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
        paddingVertical: theme.spacing.sm
    },
    cakeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    selectedCake: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    cakeImage: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.md
    },
    cakeInfo: {
        flex: 1
    },
    cakeName: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurface
    },
    cakePrice: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.semibold
    },
    placeholderText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.onSurfaceVariant
    },
    cakeList: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        marginTop: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    cakeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border
    },
    cakeOptionImage: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.md
    },
    cakeOptionInfo: {
        flex: 1
    },
    cakeOptionName: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurface
    },
    cakeOptionPrice: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.semibold
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginTop: theme.spacing.md
    },
    quantityLabel: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurface
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md
    },
    quantityButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.full,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    quantityButtonText: {
        color: 'white',
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold
    },
    quantityValue: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.onSurface,
        minWidth: 30,
        textAlign: 'center'
    },
    notesContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'flex-start'
    },
    notesInput: {
        flex: 1,
        fontSize: theme.fontSize.md,
        color: theme.colors.onSurface,
        marginLeft: theme.spacing.sm,
        minHeight: 60
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.cardBlue,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg
    },
    totalLabel: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.onSurface
    },
    totalAmount: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary
    },
    footer: {
        flexDirection: 'row',
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.surface
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
    inputDisabled: {
        backgroundColor: theme.colors.surfaceVariant,
        color: theme.colors.onSurfaceVariant
    },
    selectorDisabled: {
        backgroundColor: theme.colors.surfaceVariant,
        opacity: 0.6
    },
    quantityButtonDisabled: {
        backgroundColor: theme.colors.surfaceVariant,
        opacity: 0.6
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
    statusContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm
    },
    statusButton: {
        width: '48%',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        alignItems: 'center'
    },
    statusButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary
    },
    statusButtonText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.onSurfaceVariant
    },
    statusButtonTextActive: {
        color: 'white'
    }
});