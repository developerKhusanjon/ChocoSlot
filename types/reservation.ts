import {ImageSourcePropType} from "react-native";

export interface Reservation {
    id: string;
    customerName: string;
    contact: string;
    cakeId: string;
    pickupDate: string;
    pickupTime: string;
    quantity: number;
    notes?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'canceled' | 'delivered';
    createdAt: string;
    updatedAt?: string;
}

export interface Cake {
    id: string;
    name: string;
    description: string;
    price: number;
    image: ImageSourcePropType;
    available: boolean;
    category: string;
    status?: 'available' | 'out-of-stock' | 'removing-from-stock';
    statusUpdatedAt?: string;
}