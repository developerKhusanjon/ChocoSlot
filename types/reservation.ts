export interface Reservation {
    id: string;
    customerName: string;
    contact: string;
    cakeId: string;
    pickupDate: string;
    pickupTime: string;
    quantity: number;
    notes?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'canceled';
    createdAt: string;
    updatedAt?: string;
}

export interface Cake {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    available: boolean;
    category: string;
}