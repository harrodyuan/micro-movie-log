# Building Native iOS / Android Apps with Capacitor

The `capacitor.config.ts` is already set up. The app loads the live Vercel site inside
a native WebView — so every web update is instantly reflected in the native app without
needing a new App Store release.

## One-time setup (do this once)

```bash
# Generate native project folders
npx cap add ios      # requires macOS + Xcode
npx cap add android  # requires Android Studio
```

## Build iOS (requires Mac + Xcode)

```bash
npx cap sync
npx cap open ios
# Then in Xcode: select your device → Product → Archive → Distribute
```

## Build Android

```bash
npx cap sync
npx cap open android
# Then in Android Studio: Build → Generate Signed Bundle/APK
```

## App Store requirements

- **Apple**: $99/year developer account at https://developer.apple.com
  - Review time: 1-3 days
  - Need: app icon set, screenshots, privacy policy URL

- **Google Play**: $25 one-time at https://play.google.com/console
  - Review time: 1-7 days  
  - Need: app icon, feature graphic, screenshots, privacy policy URL

## Privacy Policy
Both stores require one. Minimum content: what data you collect (email, movie preferences),
that you don't sell it, and a contact email. Can be a simple `/privacy` page on your site.
