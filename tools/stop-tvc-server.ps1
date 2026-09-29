param(
    [Parameter(Mandatory = $true)]
    [int]$Port,

    [Parameter(Mandatory = $true)]
    [string]$ServerPath
)

$ErrorActionPreference = 'Stop'

try {
    $resolvedServerPath = [System.IO.Path]::GetFullPath($ServerPath)
    if (-not [System.IO.File]::Exists($resolvedServerPath)) {
        throw "The TVC server file was not found."
    }

    $connections = @(
        Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
            Where-Object { $_.LocalAddress -in @('127.0.0.1', '0.0.0.0', '::', '::1') }
    )

    if ($connections.Count -eq 0) {
        exit 0
    }

    $processIds = @($connections | Select-Object -ExpandProperty OwningProcess -Unique)
    foreach ($processId in $processIds) {
        $serverProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $processId" -ErrorAction Stop
        $processName = [string]$serverProcess.Name
        $commandLine = [string]$serverProcess.CommandLine
        $isPython = $processName -match '^pythonw?(\.exe)?$'
        $isStudioServer = $commandLine -match '(?i)(^|[\\/\s\"])server\.py(?=$|[\s\"])'

        if (-not ($isPython -and $isStudioServer)) {
            throw "Port $Port is used by another program. Close it and run V3 again."
        }

        Stop-Process -Id $processId -Force -ErrorAction Stop
    }

    Start-Sleep -Milliseconds 350
    $remaining = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($remaining) {
        throw "The previous TVC server could not be stopped. Try again shortly."
    }

    Write-Host "Previous V3 server stopped. Applying the new settings."
    exit 0
} catch {
    Write-Host "V3 server restart preparation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 3
}
