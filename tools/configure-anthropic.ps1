param(
    [Parameter(Mandatory = $true)]
    [string]$EnvPath,

    [string]$SharedEnvPath = ''
)

$ErrorActionPreference = 'Stop'

try {
    $fullEnvPath = [System.IO.Path]::GetFullPath($EnvPath)
    $envDirectory = [System.IO.Path]::GetDirectoryName($fullEnvPath)
    if (-not [System.IO.Directory]::Exists($envDirectory)) {
        throw "The settings directory was not found."
    }

    [string[]]$lines = if ([System.IO.File]::Exists($fullEnvPath)) {
        [System.IO.File]::ReadAllLines($fullEnvPath, [System.Text.Encoding]::UTF8)
    } else {
        @()
    }

    $keyLineIndex = -1
    $hasConfiguredKey = $false

    for ($index = 0; $index -lt $lines.Count; $index++) {
        if ($lines[$index] -match '^\s*ANTHROPIC_API_KEY\s*=\s*(.*)$') {
            $keyLineIndex = $index
            $existingValue = $Matches[1].Trim().Trim('"').Trim("'")
            if ($existingValue -and $existingValue -notmatch '^(your_|replace_|change_me|example)') {
                $hasConfiguredKey = $true
            }
            break
        }
    }

    if ($hasConfiguredKey) {
        Write-Host "Anthropic API key is already configured."
        exit 0
    }

    if ($SharedEnvPath) {
        $fullSharedEnvPath = [System.IO.Path]::GetFullPath($SharedEnvPath)
        if ([System.IO.File]::Exists($fullSharedEnvPath)) {
            foreach ($sharedLine in [System.IO.File]::ReadAllLines($fullSharedEnvPath, [System.Text.Encoding]::UTF8)) {
                if ($sharedLine -match '^\s*ANTHROPIC_API_KEY\s*=\s*(.*)$') {
                    $sharedValue = $Matches[1].Trim().Trim('"').Trim("'")
                    if ($sharedValue -and $sharedValue -notmatch '^(your_|replace_|change_me|example)') {
                        Write-Host "Using the Anthropic API key from the shared AI Video Studio settings."
                        exit 0
                    }
                }
            }
        }
    }

    Write-Host ""
    Write-Host "V3 prompt expansion requires an Anthropic API key." -ForegroundColor Cyan
    Write-Host "No key was found in TVC Studio or AI Video Studio settings."
    Write-Host "The key will stay hidden and will only be saved in this project's local .env file."
    $secureKey = Read-Host "Enter your Anthropic API key" -AsSecureString

    $keyPointer = [IntPtr]::Zero
    $plainKey = $null
    try {
        $keyPointer = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
        $plainKey = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer).Trim()

        if ([string]::IsNullOrWhiteSpace($plainKey)) {
            throw "No Anthropic API key was entered."
        }
        if ($plainKey.Contains("`r") -or $plainKey.Contains("`n")) {
            throw "The API key cannot contain a line break."
        }

        $newLine = "ANTHROPIC_API_KEY=$plainKey"
        if ($keyLineIndex -ge 0) {
            $lines[$keyLineIndex] = $newLine
        } else {
            $lines += $newLine
        }

        [System.IO.File]::WriteAllLines(
            $fullEnvPath,
            [string[]]$lines,
            [System.Text.UTF8Encoding]::new($false)
        )
    } finally {
        $plainKey = $null
        if ($keyPointer -ne [IntPtr]::Zero) {
            [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
        }
    }

    Write-Host "Anthropic API key saved to .env." -ForegroundColor Green
    exit 0
} catch {
    Write-Host "Anthropic setup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 2
}
