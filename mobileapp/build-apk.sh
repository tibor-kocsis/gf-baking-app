#!/bin/bash

# Pizza Calc APK Build Script
# This script builds an APK file for the Pizza Calc app

set -e  # Exit on error

echo "🍕 Pizza Calc APK Build Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the mobileapp directory."
    exit 1
fi

# Install EAS CLI if not present
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

# Check if eas.json exists, if not create it
if [ ! -f "eas.json" ]; then
    echo "⚙️  Creating EAS configuration..."
    cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 13.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOF
    echo "✅ Created eas.json"
fi

# Update app.json with necessary fields
echo "📝 Updating app.json..."
node -e "
const fs = require('fs');
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
if (!appJson.expo.android) {
  appJson.expo.android = {};
}
if (!appJson.expo.android.package) {
  appJson.expo.android.package = 'com.pizzacalc.app';
}
if (!appJson.expo.android.versionCode) {
  appJson.expo.android.versionCode = 1;
}
if (!appJson.expo.version) {
  appJson.expo.version = '1.0.0';
}
fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));
console.log('✅ Updated app.json with Android configuration');
"

echo ""
echo "🚀 Starting APK build..."
echo "Note: You'll need to log in to your Expo account if not already logged in."
echo ""

# Build the APK
eas build --platform android --profile preview

echo ""
echo "✅ Build complete!"
echo "📱 Your APK will be available for download from the link provided above."
echo "💡 You can also check build status at: https://expo.dev"
