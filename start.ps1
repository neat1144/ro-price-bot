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

# PPPOE
# Open a new PowerShell session for the pppoe
Start-Process powershell

# PowerShell script to simulate connecting and disconnecting using rasdial
while ($true) {
    # For exiting the script
    if ($Host.UI.RawUI.KeyAvailable) {
        $key = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown").Character
        if ($key -eq "q") {
            Write-Host "Exiting the script and closing PowerShell."
            exit
        }
    }

    # Connect
    Write-Output "連線中"
    
    $username = ""
    $password = ""

    rasdial "用這個" $username $password

    # Wait for 20 minutes
    Start-Sleep -Seconds 1200

    # Disconnect
    Write-Output "斷連中"
    rasdial "用這個" /DISCONNECT
    Start-Sleep -Seconds 3

    # Print a msg
    Write-Output "Press 'q' to exit the script."
}

