import { useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Reservation, Cake } from '@/types/reservation';

const mockCakes: Cake[] = [
    {
        id: '1',
        name: 'Chocolate Delight',
        description: 'Rich chocolate cake with ganache',
        price: 25.99,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
        available: true,
        category: 'Chocolate'
    },
    {
        id: '2',
        name: 'Vanilla Dream',
        description: 'Classic vanilla sponge with buttercream',
        price: 22.99,
        image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400',
        available: true,
        category: 'Vanilla'
    },
    {
        id: '3',
        name: 'Strawberry Bliss',
        description: 'Fresh strawberry cake with cream',
        price: 28.99,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
        available: true,
        category: 'Fruit'
    },
    {
        id: '4',
        name: 'Red Velvet',
        description: 'Classic red velvet with cream cheese frosting',
        price: 26.99,
        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400',
        available: false,
        category: 'Special'
    }
];

const mockReservations: Reservation[] = [
    {
        id: '1',
        customerName: 'Sarah Johnson',
        contact: '+1 234 567 8901',
        cakeId: '1',
        pickupDate: new Date().toISOString().split('T')[0],
        pickupTime: '14:30',
        quantity: 1,
        notes: 'Happy Birthday Sarah!',
        status: 'confirmed',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        customerName: 'Mike Chen',
        contact: 'mike@email.com',
        cakeId: '2',
        pickupDate: new Date().toISOString().split('T')[0],
        pickupTime: '16:00',
        quantity: 2,
        notes: '',
        status: 'pending',
        createdAt: new Date().toISOString()
    }
];

export const [AppProvider, useAppStore] = createContextHook(() => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [cakes, setCakes] = useState<Cake[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [dailyStats, setDailyStats] = useState<{ date: string; canceled: number; today: number; pending: number; confirmed: number }>({ date: '', canceled: 0, today: 0, pending: 0, confirmed: 0 });

    // Load data from AsyncStorage on initialization
    useEffect(() => {
        const loadData = async () => {
            try {
                const [storedReservations, storedCakes, storedDailyStats] = await Promise.all([
                    AsyncStorage.getItem('reservations'),
                    AsyncStorage.getItem('cakes'),
                    AsyncStorage.getItem('dailyStats')
                ]);

                if (storedReservations) {
                    setReservations(JSON.parse(storedReservations));
                } else {
                    setReservations(mockReservations);
                }

                if (storedCakes) {
                    setCakes(JSON.parse(storedCakes));
                } else {
                    setCakes(mockCakes);
                }

                // Load or initialize daily stats
                const today = new Date().toISOString().split('T')[0];
                if (storedDailyStats) {
                    const stats = JSON.parse(storedDailyStats);
                    if (stats.date === today) {
                        setDailyStats(stats);
                    } else {
                        // Reset stats for new day
                        const newStats = { date: today, canceled: 0, today: 0, pending: 0, confirmed: 0 };
                        setDailyStats(newStats);
                        AsyncStorage.setItem('dailyStats', JSON.stringify(newStats));
                    }
                } else {
                    const newStats = { date: today, canceled: 0, today: 0, pending: 0, confirmed: 0 };
                    setDailyStats(newStats);
                    AsyncStorage.setItem('dailyStats', JSON.stringify(newStats));
                }
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
                setReservations(mockReservations);
                setCakes(mockCakes);
                const today = new Date().toISOString().split('T')[0];
                setDailyStats({ date: today, canceled: 0, today: 0, pending: 0, confirmed: 0 });
            } finally {
                setIsLoaded(true);
            }
        };

        loadData();
    }, []);

    // Save reservations to AsyncStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem('reservations', JSON.stringify(reservations)).catch(error => {
                console.error('Error saving reservations to AsyncStorage:', error);
            });
        }
    }, [reservations, isLoaded]);

    // Save cakes to AsyncStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem('cakes', JSON.stringify(cakes)).catch(error => {
                console.error('Error saving cakes to AsyncStorage:', error);
            });
        }
    }, [cakes, isLoaded]);

    // Save daily stats to AsyncStorage whenever they change
    useEffect(() => {
        if (isLoaded && dailyStats.date) {
            AsyncStorage.setItem('dailyStats', JSON.stringify(dailyStats)).catch(error => {
                console.error('Error saving daily stats to AsyncStorage:', error);
            });
        }
    }, [dailyStats, isLoaded]);

    // Auto-remove canceled reservations after 3 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setReservations(prev => {
                const filtered = prev.filter(reservation => {
                    if (reservation.status === 'canceled') {
                        const canceledTime = new Date(reservation.updatedAt || reservation.createdAt);
                        const timeDiff = now.getTime() - canceledTime.getTime();
                        const minutesDiff = timeDiff / (1000 * 60);
                        return minutesDiff < 3; // Keep if less than 3 minutes
                    }
                    return true;
                });
                return filtered;
            });
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Update daily stats when reservations change
    useEffect(() => {
        if (isLoaded) {
            const today = new Date().toISOString().split('T')[0];
            const todayReservations = reservations.filter(r => r.pickupDate === today);

            const newStats = {
                date: today,
                canceled: reservations.filter(r => r.status === 'canceled').length,
                today: todayReservations.length,
                pending: reservations.filter(r => r.status === 'pending').length,
                confirmed: reservations.filter(r => r.status === 'confirmed').length
            };

            setDailyStats(newStats);
        }
    }, [reservations, isLoaded]);

    const addReservation = useCallback((reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
        const newReservation: Reservation = {
            ...reservation,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        setReservations(prev => [...prev, newReservation]);
    }, []);

    const updateReservation = useCallback((id: string, updates: Partial<Reservation>) => {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));
    }, []);

    const deleteReservation = useCallback((id: string) => {
        setReservations(prev => prev.filter(r => r.id !== id));
    }, []);

    const addCake = useCallback((cake: Omit<Cake, 'id'>) => {
        const newCake: Cake = {
            ...cake,
            id: Date.now().toString()
        };
        setCakes(prev => [...prev, newCake]);
    }, []);

    const updateCake = useCallback((id: string, updates: Partial<Cake>) => {
        setCakes(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }, []);

    const deleteCake = useCallback((id: string) => {
        setCakes(prev => prev.filter(c => c.id !== id));
    }, []);

    const getTodayReservations = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        return reservations
            .filter(r => r.pickupDate === today)
            .sort((a, b) => {
                // Sort by pickup date and time (earlier first)
                const dateTimeA = new Date(`${a.pickupDate}T${a.pickupTime}`);
                const dateTimeB = new Date(`${b.pickupDate}T${b.pickupTime}`);
                return dateTimeA.getTime() - dateTimeB.getTime();
            });
    }, [reservations]);

    const getReservationWithCake = useCallback((reservation: Reservation) => {
        const cake = cakes.find(c => c.id === reservation.cakeId);
        return { reservation, cake };
    }, [cakes]);

    return useMemo(() => ({
        reservations,
        cakes,
        dailyStats,
        addReservation,
        updateReservation,
        deleteReservation,
        addCake,
        updateCake,
        deleteCake,
        getTodayReservations,
        getReservationWithCake,
        isLoaded
    }), [reservations, cakes, dailyStats, addReservation, updateReservation, deleteReservation, addCake, updateCake, deleteCake, getTodayReservations, getReservationWithCake, isLoaded]);
});