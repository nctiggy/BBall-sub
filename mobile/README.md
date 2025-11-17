# Basketball Substitution Manager - iOS App

React Native version of the Basketball Substitution Manager, built with Expo for iPhone and iPad.

## Features

✅ **Offline Support** - App works completely offline, no internet required
✅ **Data Persistence** - All data saved locally using AsyncStorage
✅ **Time Tracking** - Track player time on court with stint/total time display
✅ **Game Control** - Play/pause game clock
✅ **Substitution Management** - Queue and batch execute substitutions
✅ **iPad Support** - Optimized for both iPhone and iPad
✅ **Haptic Feedback** - Touch feedback for better user experience

## Prerequisites

- Node.js 16+ installed
- iOS device or simulator (for testing)
- [Expo Go app](https://expo.dev/client) on your iOS device (for quick testing)
- OR Xcode (for building standalone app)

## Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Option 1: Test on Physical Device with Expo Go (Easiest)

1. Install Expo Go from the App Store on your iPhone/iPad

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with your iPhone camera
   - On iOS 16+: Just point camera at QR code
   - Opens Expo Go automatically

4. App will load and run on your device

### Option 2: Test on iOS Simulator (Mac Only)

1. Make sure Xcode is installed

2. Run:
```bash
npm run ios
```

3. App will open in iOS Simulator

### Option 3: Build Standalone iOS App (Requires Apple Developer Account)

For a production app you can install directly:

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure the build:
```bash
eas build:configure
```

4. Build for iOS:
```bash
eas build --platform ios
```

5. Follow prompts to create build
   - You'll need an Apple Developer account ($99/year)
   - Can create builds for TestFlight or App Store

## Offline Functionality

The app works **100% offline**:

- All game data stored locally using AsyncStorage
- No network requests required
- Data persists across app restarts
- Player stats, game state, and substitutions all saved locally

## Data Storage

React Native uses **AsyncStorage** instead of localStorage:

- **Storage Location**: Device's secure local storage
- **Persistence**: Data survives app restarts
- **Storage Key**: `basketball-sub-data`
- **Data Includes**:
  - Players list with names and stats
  - Court positions
  - Pending substitutions
  - Game active status

## Differences from Web Version

### Added Features
- ✅ Native iOS app (can be installed on home screen)
- ✅ Haptic feedback for actions
- ✅ Native alerts and modals
- ✅ Better touch interactions
- ✅ Works offline by default

### Temporarily Removed (V1.4.0)
- ⚠️ Drag-and-drop (complex in React Native, will add in future update)
  - **Workaround**: Use the "Sub" button to create substitutions
  - Can still tap to add players to empty positions

### Changed
- AsyncStorage instead of localStorage
- Native iOS UI components
- Touch-optimized buttons and interactions

## Project Structure

```
mobile/
├── App.js                          # Main app component
├── components/
│   ├── Court.js                    # Court display with 5 positions
│   ├── Bench.js                    # Bench players list
│   ├── SubstitutionManager.js      # Pending subs queue
│   ├── PlayerModal.js              # Add player modal
│   ├── GameControlModal.js         # Game controls
│   └── Menu.js                     # Menu dropdown
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── babel.config.js                 # Babel config
```

## How to Use

### Adding Players
1. Tap the menu (☰) in top left
2. Select "Add Player"
3. Enter player name
4. Tap "Add Player"

### Starting a Game
1. Add 5 players to bench
2. Use "Sub" button to assign to positions
3. Tap menu → "Game Control"
4. Tap "Start Game"

### Managing Substitutions
1. On court player, tap "Sub" button
2. Select replacement from list
3. Sub appears in right panel
4. Tap ⚡ button to execute all subs

### Play/Pause Game
- Tap ▶/⏸ button in top right
- Active: time counts up
- Paused: time stops

## iOS-Specific Features

### iPad Support
- App works in portrait and landscape
- Larger touch targets on iPad
- Side-by-side panels utilize space

### iOS Permissions
No special permissions required - app is completely self-contained

### iOS Gestures
- Swipe gestures work in scroll views
- Native iOS modal animations
- Standard iOS alerts

## Troubleshooting

### "Cannot find module" errors
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install
```

### App won't start
```bash
npm start -- --clear
```

### iOS Simulator issues
```bash
# Reset Expo cache
npx expo start -c

# Or rebuild iOS
npx expo run:ios --clean
```

### Data not persisting
- Check AsyncStorage is installed: `npm list @react-native-async-storage/async-storage`
- Reinstall if needed: `npm install @react-native-async-storage/async-storage`

## Building for Production

### Requirements
- Apple Developer Account ($99/year)
- Xcode installed
- Valid signing certificates

### Steps
1. Update version in `app.json`
2. Update bundle identifier in `app.json` → `ios.bundleIdentifier`
3. Build with EAS: `eas build --platform ios --profile production`
4. Download IPA file
5. Upload to App Store Connect via Xcode or Transporter
6. Submit for review

## Version

**Current Version**: 1.4.0

Matches web app version with React Native conversion.

## License

Same as web version - part of Basketball Substitution Manager project.

## Support

For issues or questions:
- Check web version's README for feature documentation
- React Native specific issues: Check Expo docs
- iOS build issues: Check EAS Build docs

## Future Enhancements

Planned for future versions:
- [ ] Drag-and-drop using react-native-gesture-handler
- [ ] Charts and statistics visualization
- [ ] Export game reports
- [ ] Multiple game sessions
- [ ] Team roster management
- [ ] Dark mode support
