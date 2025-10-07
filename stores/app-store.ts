import { useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Reservation, Cake } from '@/types/reservation';

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
                }

                if (storedCakes) {
                    setCakes(JSON.parse(storedCakes));
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

    // Auto-remove canceled reservations after 3 minutes and delivered reservations after 30 seconds
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
                    if (reservation.status === 'delivered') {
                        const deliveredTime = new Date(reservation.updatedAt || reservation.createdAt);
                        const timeDiff = now.getTime() - deliveredTime.getTime();
                        const secondsDiff = timeDiff / 1000;
                        return secondsDiff < 30; // Keep if less than 30 seconds
                    }
                    return true;
                });
                return filtered;
            });
        }, 5000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Auto-remove cakes with 'remove-from-stock' status after 3 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCakes(prev => {
                const filtered = prev.filter(cake => {
                    if (cake.status === 'removing-from-stock' && cake.statusUpdatedAt) {
                        const statusTime = new Date(cake.statusUpdatedAt);
                        const timeDiff = now.getTime() - statusTime.getTime();
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