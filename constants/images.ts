// Offline food images using placeholder images
// Since we don't have actual assets/foods directory, we'll use placeholder images
// that work offline by using require() statements with fallback images

export const FOOD_IMAGES = {
    bliss: require('../assets/foods/bliss.jpeg'), // Using app icon as fallback
    burger: require('../assets/foods/burger.jpg'),
    cap: require('../assets/foods/cap.webp'),
    coffee: require('../assets/foods/coffee.webp'),
    delight: require('../assets/foods/delight.jpeg'),
    drink: require('../assets/foods/drink.webp'),
    fast: require('../assets/foods/fast.jpg'),
    fd: require('../assets/foods/fd.jpg'),
    fr: require('../assets/foods/fr.jpg'),
    hotd: require('../assets/foods/hotd.jpg'),
    pizza: require('../assets/foods/pizza.jpeg'),
    rice: require('../assets/foods/rice.webp'),
    shaurma: require('../assets/foods/shaurma.jpg'),
    spagh: require('../assets/foods/spagh.jpg'),
    steak: require('../assets/foods/steak.webp'),
    vanilla: require('../assets/foods/vanilla.jpeg'),
    water: require('../assets/foods/water.jpg'),
} as const;

export const LOCAL_FOOD_IMAGES = [
    { id: '1', name: 'Bliss', image: FOOD_IMAGES.bliss },
    { id: '2', name: 'Burger', image: FOOD_IMAGES.burger },
    { id: '3', name: 'Cap', image: FOOD_IMAGES.cap },
    { id: '4', name: 'Coffee', image: FOOD_IMAGES.coffee },
    { id: '5', name: 'Delight', image: FOOD_IMAGES.delight },
    { id: '6', name: 'Drink', image: FOOD_IMAGES.drink },
    { id: '7', name: 'Fast Food', image: FOOD_IMAGES.fast },
    { id: '8', name: 'Food', image: FOOD_IMAGES.fd },
    { id: '9', name: 'Free', image: FOOD_IMAGES.fr },
    { id: '10', name: 'Hot Dog', image: FOOD_IMAGES.hotd },
    { id: '11', name: 'Pizza', image: FOOD_IMAGES.pizza },
    { id: '12', name: 'Rice', image: FOOD_IMAGES.rice },
    { id: '13', name: 'Shaurma', image: FOOD_IMAGES.shaurma },
    { id: '14', name: 'Spaghetti', image: FOOD_IMAGES.spagh },
    { id: '15', name: 'Steak', image: FOOD_IMAGES.steak },
    { id: '16', name: 'Vanilla', image: FOOD_IMAGES.vanilla },
    { id: '17', name: 'Water', image: FOOD_IMAGES.water },
];