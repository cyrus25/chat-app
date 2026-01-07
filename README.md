# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Build the native app

   ```bash
   npx expo run:ios
   ```

3. Start the app

   ```bash
   npx expo start
   ```

- Used react-native-gesture-handler is used to handle horizontal swipe and long-press interactions on each chat bubble.

- Used LongPress gesture to open the emoji reaction UI by measuring the bubble’s screen position.

- Used react-native-reanimated for smooth UI updates on native side instead of JS using useSharedValue.

- Used local state management for now instead of some state management,but will use when project scales.
