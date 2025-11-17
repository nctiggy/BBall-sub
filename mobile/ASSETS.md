# App Assets Guide

The app requires icon and splash screen images for iOS deployment.

## Required Assets

### App Icon
- **File**: `assets/icon.png`
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Purpose**: App icon on home screen

### Splash Screen
- **File**: `assets/splash.png`
- **Size**: 1284x2778 pixels (or similar)
- **Format**: PNG
- **Purpose**: Loading screen when app starts

### Adaptive Icon (Android, optional)
- **File**: `assets/adaptive-icon.png`
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency

### Favicon (Web, optional)
- **File**: `assets/favicon.png`
- **Size**: 48x48 pixels
- **Format**: PNG

## Quick Setup - Using Defaults

For testing, Expo will use default icons if files don't exist. The app will work fine without custom icons during development.

## Creating Custom Icons

### Option 1: Basketball Icon (Recommended)

Create a simple basketball icon:
1. Use a design tool (Figma, Canva, etc.)
2. Create 1024x1024px canvas
3. Add basketball emoji 🏀 or draw simple basketball
4. Add text "Sub Manager" below
5. Export as PNG

### Option 2: Use Icon Generator

Online tools to generate icons:
- https://www.appicon.co
- https://makeappicon.com
- https://icon.kitchen

Upload a source image and they'll generate all sizes.

### Option 3: Hire Designer

Fiverr, Upwork, or similar for professional icons.

## Installing Assets

1. Create the assets directory:
```bash
mkdir -p mobile/assets
```

2. Add your icon files:
```
mobile/assets/
  ├── icon.png           (1024x1024)
  ├── splash.png         (1284x2778)
  ├── adaptive-icon.png  (1024x1024)
  └── favicon.png        (48x48)
```

3. Assets automatically included in builds via `app.json`

## Testing Icons

### On Expo Go
Icons won't show in Expo Go - only when you build standalone app.

### On Standalone Build
```bash
eas build --platform ios --profile preview
```

Download and install the build to see real icons.

## Icon Guidelines

### iOS Requirements
- 1024x1024px minimum
- No transparency for main icon (splash can have transparency)
- No rounded corners (iOS adds them automatically)
- Avoid text smaller than 6pt

### Design Tips
- Keep it simple and recognizable
- Use brand colors
- High contrast for visibility
- Looks good small (home screen) and large (App Store)

## App Store Assets (When Publishing)

Additional assets needed for App Store:
- Screenshots (various device sizes)
- App preview video (optional)
- App icon (already have)
- Feature graphic

See Apple's guidelines: https://developer.apple.com/app-store/

## Current Status

**Default Expo assets** are currently configured in `app.json`.

Replace with custom assets before:
- Submitting to App Store
- Sharing with users
- Production deployment

For development and testing, default assets work fine!
