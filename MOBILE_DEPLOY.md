# DriveLegal Mobile — Build & Deploy Guide

## Prerequisites

- Free [Expo account](https://expo.dev/signup)
- EAS CLI: `npm i -g eas-cli`
- Backend already deployed (e.g. on Render). Copy the public URL.

---

## First-time setup (run once)

```bash
cd drivelegal-mobile
eas login          # authenticate with your Expo account
eas init           # creates/links the project and writes projectId into app.json
```

---

## Set the API base URL

The app reads `EXPO_PUBLIC_API_BASE` at build time. Two options:

**Option A — bake it into the build profile** (recommended for judges):

Add an `env` block to the `preview` profile in `eas.json`:

```json
"preview": {
  "distribution": "internal",
  "android": { "buildType": "apk" },
  "ios": { "simulator": true },
  "env": {
    "EXPO_PUBLIC_API_BASE": "https://your-backend.onrender.com"
  }
}
```

**Option B — pass it inline** (quick one-off):

```bash
EXPO_PUBLIC_API_BASE=https://your-backend.onrender.com eas build --profile preview --platform android
```

---

## Build APK for judges (Android sideload)

```bash
eas build --profile preview --platform android
```

- Wait ~10–15 minutes for the EAS cloud build to finish.
- EAS prints a QR code and a direct APK download URL when done.
- Judges can scan the QR or download the APK and install it via `adb install` or the Files app (with "Unknown sources" enabled).

---

## Build iOS Simulator build

```bash
eas build --profile preview --platform ios
```

- Downloads a `.app` bundle (not a signed IPA).
- Drag the `.app` file onto an open iOS Simulator window to install it.

---

## Faster fallback — Expo Go (no EAS build needed)

If the EAS queue is slow or you just need a quick demo:

```bash
cd drivelegal-mobile
EXPO_PUBLIC_API_BASE=https://your-backend.onrender.com npx expo start --tunnel
```

- Judges install **Expo Go** (free, on App Store / Play Store).
- They scan the QR code printed in the terminal.
- The JS bundle streams live from your machine — **your laptop must stay running** during the demo.

---

## Troubleshooting

| Error | Fix |
|---|---|
| "Project ID not configured" | Run `eas init` inside `drivelegal-mobile/` |
| "Missing bundleIdentifier" | Check `expo.ios.bundleIdentifier` in `app.json` |
| API calls fail on device | `EXPO_PUBLIC_API_BASE` not set in the build profile — add `env` block to `eas.json` or pass it inline |
| Build fails — wrong EAS CLI version | Run `npm i -g eas-cli@latest` and retry |
