# Deployment Instructions

## Prerequisites

1. **Node.js and npm**: Make sure Node.js (version 14 or higher) is installed.
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Firebase CLI**: Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

## Deployment Steps

### Option 1: Use the PowerShell Script (Windows)

1. Open PowerShell in the project directory
2. Run: `.\deploy.ps1`

### Option 2: Manual Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the app:**
   ```bash
   npm run build
   ```

3. **Login to Firebase** (if not already logged in):
   ```bash
   firebase login
   ```

4. **Deploy to Firebase:**
   ```bash
   firebase deploy --only hosting
   ```

## Important Notes

- The Firebase project is already configured: `auchessclub-f3cd9`
- The build output goes to the `build` folder
- Make sure you have write permissions to Firebase
- The secret code for admin access is: `worshipjam2024` (change it in `src/pages/AdminPage.js` if needed)

## After Deployment

Your app will be live at:
- https://auchessclub-f3cd9.web.app
- https://auchessclub-f3cd9.firebaseapp.com

## Troubleshooting

- If `npm` is not recognized, restart your terminal/IDE after installing Node.js
- If Firebase CLI is not found, ensure it's installed globally: `npm install -g firebase-tools`
- If build fails, check for any errors in the console output

