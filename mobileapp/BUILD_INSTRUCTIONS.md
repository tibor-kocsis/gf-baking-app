# Building Pizza Calc APK

## Quick Start

To build an APK file for your Pizza Calc app, run:

```bash
./build-apk.sh
```

## Prerequisites

1. **Expo Account**: You'll need a free Expo account
   - Sign up at: https://expo.dev/signup
   - Or login during the build process

2. **Internet Connection**: Required for EAS Build service

## What the Script Does

1. Installs EAS CLI (Expo Application Services Command Line Interface)
2. Creates `eas.json` configuration file
3. Updates `app.json` with Android build settings
4. Triggers a cloud build on Expo's servers
5. Provides a download link for your APK

## First Time Setup

When you run the script for the first time:

1. You'll be prompted to log in to Expo:
   ```bash
   eas login
   ```

2. Enter your Expo credentials

3. The build will start automatically

## Build Process

- Builds are done in the cloud (no Android SDK required locally!)
- Build time: ~5-10 minutes
- You'll get a download link when complete
- APK can be installed directly on Android devices

## After Building

Once the build completes:

1. Download the APK from the provided link
2. Transfer it to your Android device
3. Enable "Install from Unknown Sources" in Android settings
4. Install and enjoy!

## Alternative: Local Testing

For development, you don't need to build an APK. Just use:

```bash
npx expo start --tunnel
```

Then scan the QR code with Expo Go app on your phone.

## Troubleshooting

**Error: Not logged in**
```bash
eas login
```

**Error: Project not configured**
- The script will auto-configure on first run
- If issues persist, run: `eas build:configure`

**Build fails**
- Check the build logs at https://expo.dev
- Ensure app.json is valid JSON
- Contact Expo support if needed

## Building for Production

To build a production app bundle (for Google Play Store):

```bash
eas build --platform android --profile production
```

This creates an AAB file instead of APK, required for Play Store submission.
