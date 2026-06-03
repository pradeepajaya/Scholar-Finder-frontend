# Scholar-Finder Auth Service Test Script
# Tests login, token refresh, and user profile endpoints

param(
    [string]$BaseUrl = "http://localhost:8081",
    [switch]$Verbose = $false
)

# Test user credentials
$testUsers = @(
    @{ email = "alice@scholarfinder.lk"; password = "alice123"; role = "STUDENT" },
    @{ email = "bob@scholarfinder.lk"; password = "bob123"; role = "STUDENT" },
    @{ email = "charlie@scholarfinder.lk"; password = "charlie123"; role = "STUDENT" },
    @{ email = "dana@scholarfinder.lk"; password = "dana123"; role = "STUDENT" },
    @{ email = "eric@scholarfinder.lk"; password = "eric123"; role = "STUDENT" }
)

function Test-Login {
    param(
        [string]$Email,
        [string]$Password,
        [string]$Role
    )
    
    try {
        $body = @{
            email = $Email
            password = $Password
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Method Post `
            -Uri "$BaseUrl/api/auth/login" `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        if ($response.success) {
            $user = $response.data.user
            Write-Host "[OK] LOGIN SUCCESS: $Email ($Role)" -ForegroundColor Green
            Write-Host "  ID: $($user.id), Verified: $($user.isVerified)" -ForegroundColor Gray
            Write-Host "  Access Token: $($response.data.accessToken.Substring(0, 20))..." -ForegroundColor Gray
            Write-Host "  Expires In: $($response.data.expiresIn) ms" -ForegroundColor Gray
            return $response.data
        } else {
            Write-Host "[FAIL] LOGIN FAILED: $Email - $($response.message)" -ForegroundColor Red
            return $null
        }
    } catch {
        Write-Host "[ERROR] LOGIN ERROR: $Email - $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Test-GetCurrentUser {
    param(
        [string]$AccessToken,
        [string]$Email
    )
    
    try {
        $headers = @{
            "Authorization" = "Bearer $AccessToken"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Method Get `
            -Uri "$BaseUrl/api/auth/me" `
            -Headers $headers `
            -ErrorAction Stop
        
        if ($response.success) {
            $user = $response.data
            Write-Host "  [OK] /me endpoint: Retrieved user $($user.email)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "  [FAIL] /me endpoint failed: $($response.message)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  [ERROR] /me endpoint error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-RefreshToken {
    param(
        [string]$RefreshToken,
        [string]$Email
    )
    
    try {
        $body = @{
            refreshToken = $RefreshToken
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Method Post `
            -Uri "$BaseUrl/api/auth/refresh-token" `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        
        if ($response.success) {
            Write-Host "  [OK] Token refreshed for $Email" -ForegroundColor Green
            return $response.data.accessToken
        } else {
            Write-Host "  [FAIL] Token refresh failed: $($response.message)" -ForegroundColor Red
            return $null
        }
    } catch {
        Write-Host "  [ERROR] Token refresh error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Test-Health {
    try {
        $response = Invoke-RestMethod -Method Get `
            -Uri "$BaseUrl/api/auth/health" `
            -ContentType "application/json" `
            -ErrorAction Stop
        
        if ($response.success -and $response.data -eq "OK") {
            Write-Host "[OK] Auth Service is healthy" -ForegroundColor Green
            return $true
        } else {
            Write-Host "[FAIL] Auth Service health check failed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "[ERROR] Auth Service is unreachable: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main execution
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Scholar-Finder Auth Service Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host ""

# Check service health
Write-Host "[1] Checking service health..." -ForegroundColor Yellow
if (-not (Test-Health)) {
    Write-Host "Service is unavailable. Exiting." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test login for each user
Write-Host "[2] Testing login for all users..." -ForegroundColor Yellow
$results = @()
foreach ($user in $testUsers) {
    $authData = Test-Login -Email $user.email -Password $user.password -Role $user.role
    
    if ($authData) {
        # Test /me endpoint
        Test-GetCurrentUser -AccessToken $authData.accessToken -Email $user.email
        
        # Test token refresh
        $newToken = Test-RefreshToken -RefreshToken $authData.refreshToken -Email $user.email
        
        $results += @{
            email = $user.email
            role = $user.role
            success = $true
            accessToken = $authData.accessToken
            newAccessToken = $newToken
        }
    } else {
        $results += @{
            email = $user.email
            role = $user.role
            success = $false
        }
    }
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$successCount = ($results | Where-Object { $_.success }).Count
$totalCount = $results.Count
Write-Host "Passed: $successCount / $totalCount" -ForegroundColor Green
Write-Host ""

# Display results as list (cleaner format)
foreach ($result in $results) {
    $status = if ($result.success) { "[PASS]" } else { "[FAIL]" }
    Write-Host "$($result.email) ($($result.role)) $status" -ForegroundColor $(if ($result.success) { "Green" } else { "Red" })
}

Write-Host ""
Write-Host "Note: Default users (admin/student/institution) use bcrypt hashes that may not" -ForegroundColor Gray
Write-Host "be compatible with the auth service's password encoder. Seed users (alice, bob, etc.)" -ForegroundColor Gray
Write-Host "are seeded with pgcrypto bcrypt and work correctly." -ForegroundColor Gray
Write-Host ""
Write-Host "Test completed at $(Get-Date)" -ForegroundColor Gray
