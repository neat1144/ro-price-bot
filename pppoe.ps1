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
    Write-Output "Connecting..."
    
    $username = ""
    $password = ""

    rasdial $username $password

    Write-Output "Connected."

    # Wait for 20 minutes
    Write-Output "Waiting for 20 minutes..."
    Start-Sleep -Seconds 1200

    # Disconnect
    Write-Output "Disconnecting..."
    rasdial /DISCONNECT
    Start-Sleep -Seconds 3
    Write-Output "Disconnected."

    # Print a msg
    Write-Output "Press 'q' to exit the script."
}

