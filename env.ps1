# Use GUI popup for token input (works on all Windows PowerShell)
Add-Type -AssemblyName Microsoft.VisualBasic
$Token = [Microsoft.VisualBasic.Interaction]::InputBox("Paste your GitHub token here", "GitHub Token")

# Stop script on any error
$ErrorActionPreference = "Stop"

# Utility functions for colored messages
function Write-Info($msg) {
    Write-Host "🔷 $msg" -ForegroundColor Cyan
}
function Write-Success($msg) {
    Write-Host "✅ $msg" -ForegroundColor Green
}
function Write-WarningMsg($msg) {
    Write-Host "⚠️ $msg" -ForegroundColor Yellow
}
function Write-ErrorMsg($msg) {
    Write-Host "❌ $msg" -ForegroundColor Red
}

# Temporary directory and GitHub repo URL
$TempDir = "temp_secrets_$([System.Diagnostics.Process]::GetCurrentProcess().Id)"
$RepoUrl = "https://$Token@github.com/nhattVim/.env"

# Clone the private secrets repository
Write-Info "Cloning secrets repository..."
git clone $RepoUrl $TempDir

if ($LASTEXITCODE -ne 0) {
    Write-ErrorMsg "Clone failed. Kiểm tra GitHub token hoặc repo có tồn tại không."
    exit 1
} else {
    Write-Success "Repository cloned successfully!"
}

# Copy configuration files from temp directory to project
Write-Info "Copying environment configuration files..."

if (Test-Path "$TempDir/Jobiverse/backend/.env") {
    Copy-Item "$TempDir/Jobiverse/backend/.env" -Destination "backend/.env" -Force
    Write-Success "Copied backend/.env"
} else {
    Write-WarningMsg "backend/.env not found in repository."
}

if (Test-Path "$TempDir/Jobiverse/backend.NET/appsettings.json") {
    Copy-Item "$TempDir/Jobiverse/backend.NET/appsettings.json" -Destination "backend.NET/appsettings.json" -Force
    Write-Success "Copied backend.NET/appsettings.json"
} else {
    Write-WarningMsg "backend.NET/appsettings.json not found in repository."
}

if (Test-Path "$TempDir/Jobiverse/frontend/.env") {
    Copy-Item "$TempDir/Jobiverse/frontend/.env" -Destination "frontend/.env" -Force
    Write-Success "Copied frontend/.env"
} else {
    Write-WarningMsg "frontend/.env not found in repository."
}

# Remove temporary directory after copying
Remove-Item -Recurse -Force $TempDir
Write-Info "Temporary folder removed."

# Final success message
Write-Success "Secrets have been successfully imported!"
