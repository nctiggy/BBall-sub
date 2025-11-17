# Quick Start Guide

Get your Basketball Sub Manager running on iOS in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- [ ] Node.js installed (check with: `node --version`)
- [ ] iPhone or iPad with iOS 13+

## Step 1: Install Dependencies

```bash
cd mobile
npm install
```

This will take 2-3 minutes.

## Step 2: Install Expo Go on Your iPhone/iPad

1. Open App Store on your iPhone/iPad
2. Search for "Expo Go"
3. Install the Expo Go app (it's free)

## Step 3: Start the Development Server

```bash
npm start
```

You'll see a QR code in your terminal.

## Step 4: Open on Your Device

**On iPhone/iPad:**
1. Open the Camera app
2. Point it at the QR code in your terminal
3. Tap the notification that appears
4. Expo Go will open with your app

**That's it!** Your app is now running.

## First Time Using the App?

### Add Your First Player
1. Tap the menu icon (☰) in top left
2. Tap "Add Player"
3. Type a player name
4. Tap "Add Player"

### Add 5 Players
Repeat the above to add at least 5 players for a full team.

### Create a Substitution
1. On any court position with a player, tap "Sub"
2. Select a bench player
3. Substitution appears in right panel
4. Tap ⚡ button to execute

### Start Game Clock
1. Tap menu (☰)
2. Tap "Game Control"
3. Tap "Start Game"

Player times will now count up!

## Tips

- **Play/Pause**: Use ▶/⏸ button in top right
- **Execute Subs**: Tap ⚡ badge in header
- **Delete Player**: Tap ✕ on bench player
- **Remove from Court**: Tap ✕ on court player

## Common Issues

### QR Code won't scan
- Make sure Camera app can access camera
- Try scanning from different angle
- Ensure phone and computer on same WiFi

### App won't load
```bash
# Clear cache and restart
npm start -- --clear
```

### Can't install dependencies
```bash
# Try clearing npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read full README.md for advanced features
- Try the game control modal
- Experiment with substitutions
- Check player time tracking

## Need Help?

- Full docs: See README.md
- Expo docs: https://docs.expo.dev
- React Native docs: https://reactnative.dev

Enjoy managing your team! 🏀
