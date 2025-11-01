# Worship Jam Song Library Deployment Script
# Run this script after npm is available in your PATH

Write-Host "Starting deployment process..." -ForegroundColor Green

# Step 1: Install dependencies
Write-Host "`n[1/4] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 2: Build the app
Write-Host "`n[2/4] Building the app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Build failed" -ForegroundColor Red
    exit 1
}

# Step 3: Check Firebase login
Write-Host "`n[3/4] Checking Firebase authentication..." -ForegroundColor Yellow
firebase login --no-localhost
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Firebase login failed" -ForegroundColor Red
    exit 1
}

# Step 4: Deploy to Firebase
Write-Host "`n[4/4] Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "Your app should now be live on Firebase Hosting!" -ForegroundColor Green

