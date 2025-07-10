# 📖 README for Manager – iOS Deployment Setup

This guide explains what YOU (the iOS manager with Apple Developer access) need to do in order to enable automatic deployment of the iOS app through GitHub Actions and Expo.

---

## ✅ What You Need to Do (One-Time Setup)

### 1. 🔐 Set Up iOS Credentials with Expo

Open Terminal (macOS) and run:

```bash
eas login
eas credentials
```

Follow the prompts to:
- Select the iOS app bundle ID (e.g. com.yourcompany.app)
- Allow EAS to generate/upload distribution certificate & provisioning profile

---

### 2. 🧾 Create App Store Connect API Key

1. Go to: https://appstoreconnect.apple.com/access/api
2. Click **Generate API Key**
3. Note down:
   - ✅ **Key ID**
   - ✅ **Issuer ID**
   - ✅ Download the `.p8` file

---

### 3. 🔁 Base64 Encode the `.p8` Key

```bash
base64 AuthKey_XXXXXXXXXX.p8 > apple_key_base64.txt
```

Copy the contents of `apple_key_base64.txt`.

---

### 4. 🔐 Add the Following GitHub Secrets

Go to GitHub → Repo → Settings → Secrets → Actions → **New Repository Secret**

| Secret Name             | Value you provide                       |
|--------------------------|------------------------------------------|
| `EXPO_TOKEN`            | Expo access token (`eas token:create`)   |
| `EAS_APPLE_SUBMIT_KEY` | Base64 content of `.p8` file              |
| `APPLE_KEY_ID`         | From App Store Connect API key           |
| `APPLE_ISSUER_ID`      | From App Store Connect API key           |

---

## 🏁 Running the Workflow

After secrets are added:

- Go to **GitHub → Actions tab**
- Click **📤 EAS Submit iOS Build**
- Click **"Run workflow"**

🎉 The `.ipa` will be submitted to App Store Connect!

---

## 📌 Notes

- You only need to do this once per app (unless certs expire)
- The developer on Windows can now trigger builds any time
- You still have manual control via Transporter if needed

---

_Last updated: July 2025_



# 📖 README for Manager – Android Deployment Setup

This guide explains what YOU (the Play Store account manager) need to do to enable automatic deployment of the Android app using GitHub Actions and Expo EAS.

---

## ✅ What You Need to Do (One-Time Setup)

### 1. 🔐 Link Your Google Play Developer Account to Expo

Open terminal and run:

```bash
eas login
eas credentials
```

Follow the prompts to:
- Set up or upload an Android keystore (Expo can generate one for you)
- Ensure the package name in `app.json` matches the app in the Play Store
  - Example: `"android": { "package": "com.yourcompany.app" }`

---

### 2. 🧾 Create a Google Play Service Account

This allows Expo to upload builds directly to Google Play.

#### Steps:

1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. Create a **Service Account**
3. Grant it access to **Google Play Android Developer API**
4. Generate a `.json` key file

📘 Detailed guide: https://docs.expo.dev/submit/android/#google-service-account

---

### 3. 🔐 Add GitHub Secret (optional for auto-submit)

If you plan to submit via GitHub Actions:

| GitHub Secret Name | Value                                 |
|---------------------|----------------------------------------|
| `EXPO_TOKEN`        | Expo token (`eas token:create`)        |

📌 Expo will securely store your `.json` key in their submit pipeline during `eas submit`.

---

## 🏁 Running the Workflow

Once set up:

- Go to **GitHub → Actions**
- Run:
  - ✅ **🚀 EAS Build for Android** to generate the `.aab` or `.apk`
  - ✅ **📤 EAS Submit Android Build** to publish to Play Store

---

## 💡 Tips

- You only need to set this up once per app
- Expo securely manages keystore and credentials
- If you ever lose the keystore, it **cannot be recovered** — back it up!

---

# 📖 README for Manager – Android Deployment Setup

This guide explains what YOU (the Play Store manager) need to do to enable automatic Android deployment using GitHub Actions and Expo EAS.

---

## ✅ What You Need to Do (One-Time Setup)

---

### 1. 🔐 Android Keystore (Already Done ✅)

This is already created and linked via:
```bash
eas credentials -p android
```

You're using:
- **Package Name:** `com.basel_07.worthfey`
- **Profile:** `production`

You do not need to change anything about the keystore unless migrating or resetting it.

---

### 2. 🧾 Create a Google Play Service Account

This enables `eas submit` to upload your app directly to Google Play.

#### Steps:

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Create a new **Service Account**
   - Project must be the one linked to your Google Play account
3. Assign **"Editor"** or **"Release Manager"** role
4. Enable the **Google Play Android Developer API**
   - API Library: https://console.cloud.google.com/apis/library
5. Create and download the `.json` key file

📘 Reference: https://docs.expo.dev/submit/android/#create-a-google-service-account

---

### 3. 🔑 Upload the Service Account Key to EAS

Use the following CLI command:

```bash
eas submit --platform android --profile production --key /path/to/your-service-account.json
```

This securely uploads the key to Expo, so future CI/CD workflows will work automatically.

---

### 4. 🔐 GitHub Secrets (Optional)

| Secret Name   | Description                          |
|---------------|--------------------------------------|
| `EXPO_TOKEN`  | Your Expo token (`eas token:create`) |

> No need to store the `.json` in GitHub — EAS securely manages it.

---

## 🏁 Run the GitHub Workflows

Once set up:

- Go to **GitHub → Actions**
- Run:
  - ✅ `🚀 EAS Build for Android` – to build your `.aab`
  - ✅ `📤 EAS Submit Android Build` – to upload to Google Play

---

## 🔄 Updating the Service Account

If the key ever expires or you rotate it:
- Generate a new `.json`
- Run the upload command again

```bash
eas submit --platform android --profile production --key ./new-key.json
```

---

## ℹ️ Note on EAS Auto-Submit & Workflows

You may see Expo docs mentioning:

```bash
eas build --platform android --auto-submit
```

Or using `.eas/workflows/submit-android.yml`.

✅ You do **NOT** need those because you're using the **recommended GitHub Actions CI/CD** method:
- Full control over build and deploy
- Clean separation of build and submit
- Greater visibility and easier debugging

🎯 This is the officially supported method and you're doing it the right way.

---

_Last updated: July 2025_

