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
