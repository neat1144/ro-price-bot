# BACKEND
# Navigate to the directory of your Node.js backend
Set-Location -Path "C:\ro-price-bot-main\backend"

# Check if node_modules directory exists for the backend
if (-Not (Test-Path "node_modules")) {
    # Install Node.js dependencies for the backend
    npm install
}

# Start the Node.js server (backend)
Start-Process node app.js

# FRONTEND
# Open a new PowerShell session for the React app (frontend)
Start-Process powershell

# Navigate to the directory of your React app
Set-Location -Path "C:\ro-price-bot-main\client"

# Check if node_modules directory exists for the frontend
if (-Not (Test-Path "node_modules")) {
    # Install React dependencies for the frontend
    npm install
}

# Start the React app
npm start

