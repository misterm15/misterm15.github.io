# server_control.ps1
# Script to easily start and stop the Python HTTP server
# Usage:
#   .\server_control.ps1 -Action start     # Starts the server on port 8000
#   .\server_control.ps1 -Action stop      # Stops the server running on port 8000

param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop")]
    [string]$Action
)

$pythonPath = "C:/Gitlab/misterm15.github.io/.venv/Scripts/python.exe"
$port = 8000

if ($Action -eq "start") {
    Write-Host "Starting server on port $port..."
    
    # Check if port is already in use
    $inUse = netstat -ano | Select-String ":$port.*LISTENING"
    if ($inUse) {
        $processId = ($inUse -split ' ')[-1]
        Write-Host "Port $port is already in use by process ID $processId"
        Write-Host "Please stop the server first with: .\server_control.ps1 -Action stop"
        exit 1
    }
    
    # Start the server using the Python from virtual environment
    if (Test-Path $pythonPath) {
        Start-Process -NoNewWindow $pythonPath -ArgumentList "-m", "http.server", "$port"
    } else {
        # Fallback to system Python
        Start-Process -NoNewWindow python -ArgumentList "-m", "http.server", "$port"
    }
    
    Write-Host "Server started! Go to http://localhost:$port"
    Write-Host "To stop the server, run: .\server_control.ps1 -Action stop"
}
else {
    Write-Host "Stopping server on port $port..."
    
    # Find the process using the port
    $inUse = netstat -ano | Select-String ":$port.*LISTENING"
    
    if ($inUse) {
        $processId = ($inUse -split ' ')[-1]
        
        # Double-check it's a Python process to be safe
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        
        if ($process -and ($process.Name -like "python*")) {
            Stop-Process -Id $processId -Force
            Write-Host "Server (PID: $processId) stopped successfully!"
        } else {
            Write-Host "Found process $pid using port $port, but it doesn't appear to be a Python process."
            Write-Host "Please verify and stop it manually if needed."
        }
    } else {
        Write-Host "No server found running on port $port"
    }
}
