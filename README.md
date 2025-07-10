# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
    npx expo run:android
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.



# 🚀 CI/CD Deployment Guide – WorthyApp (Expo + GitHub Actions)

This guide explains how we build and deploy the **WorthyApp** iOS app using **Expo EAS**, **GitHub Actions**, and **App Store Connect**.

---

## 📁 Project Structure Overview

```
WORTEFY-MAIN/
├── .github/workflows/
│   ├── eas-ios-build.yml         # CI build for iOS
│   └── eas-ios-submit.yml        # Optional auto-submit (manager only)
├── app.json                      # Expo config
├── eas.json                      # EAS build + submit config

```

---

## ✅ CI Build Process (iOS)

> Triggered automatically on tag push (e.g., `v1.0.0`)  
> or manually via GitHub → Actions → `EAS Build for iOS`

### 🔧 Requirements

- Expo account + Expo token (`EXPO_TOKEN`)
- `eas.json` with proper iOS build profile
- GitHub Actions set up with `.yml` workflows

### 🔐 Required GitHub Secret

| Secret Name  | Description           |
|--------------|------------------------|
| `EXPO_TOKEN` | Expo access token (run `eas token:create`) |

---

### 🛠️ Build iOS

```bash
eas build --platform ios --profile production
```

### 🎯 Build Trigger

- Manual: GitHub > Actions > `EAS Build for iOS` → Run workflow
- Auto: Push tag like `v1.0.0`

---

## 🍏 Submitting to App Store (Manager only)

> Requires Apple Developer access + macOS OR App Store Connect API key

### Option 1: Manual (Manager)

1. Download `.ipa` from Expo dashboard
2. Open **Transporter** (macOS app)
3. Upload `.ipa` to App Store Connect

### Option 2: Auto Submit (via `eas submit`)

> Run from GitHub Actions or locally (macOS only)

```bash
eas submit --platform ios --profile production
```

#### 🔐 Additional Secrets for Auto-Submit

| Secret Name             | Description                    |
|--------------------------|--------------------------------|
| `EAS_APPLE_SUBMIT_KEY`   | Base64 of `.p8` API key        |
| `APPLE_KEY_ID`           | Key ID from App Store Connect  |
| `APPLE_ISSUER_ID`        | Issuer ID from App Store Connect |

---

## 🔄 EAS Config: `eas.json`

```json
{
  "cli": {
    "version": ">= 14.2.0",
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "ios": {
        "workflow": "managed",
        "distribution": "app-store"
      },
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com"
      }
    }
  }
}
```

---

## 🧪 Testing on Devices

To test builds on your device:

```bash
eas build --platform ios --profile development
```

Install the `.ipa` using TestFlight or Expo Go.

---

## 🙋‍♂️ Questions?

> Contact: `@sardardev`  
> Last updated: **July 2025**


  "eas": {
        "projectId": "49b188c5-ffa1-4b68-b449-a01bf4cb4d19"
      }