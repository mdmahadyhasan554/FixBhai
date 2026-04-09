# ============================================================
# FixBhai Backend Setup Script
# ============================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  FixBhai Backend Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if XAMPP services are running
Write-Host "[1/4] Checking XAMPP services..." -ForegroundColor Yellow
$apacheRunning = Test-NetConnection -ComputerName localhost -Port 80 -WarningAction SilentlyContinue -InformationLevel Quiet
$mysqlRunning = Test-NetConnection -ComputerName localhost -Port 3306 -WarningAction SilentlyContinue -InformationLevel Quiet

if (-not $apacheRunning.TcpTestSucceeded) {
    Write-Host "  ❌ Apache is not running" -ForegroundColor Red
    Write-Host "  → Start Apache in XAMPP Control Panel`n" -ForegroundColor Yellow
    exit 1
}
Write-Host "  ✓ Apache is running" -ForegroundColor Green

if (-not $mysqlRunning.TcpTestSucceeded) {
    Write-Host "  ❌ MySQL is not running" -ForegroundColor Red
    Write-Host "  → Start MySQL in XAMPP Control Panel`n" -ForegroundColor Yellow
    exit 1
}
Write-Host "  ✓ MySQL is running`n" -ForegroundColor Green

# Check backend API accessibility
Write-Host "[2/4] Testing backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/reactJS/FixBhai/backend/api/services/index.php" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Backend API is accessible`n" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠ Backend API not accessible" -ForegroundColor Yellow
    Write-Host "  → Check if project is in correct XAMPP htdocs path`n" -ForegroundColor Yellow
}

# Database setup instructions
Write-Host "[3/4] Database Setup:" -ForegroundColor Yellow
Write-Host "  1. Open phpMyAdmin: http://localhost/phpmyadmin" -ForegroundColor White
Write-Host "  2. Create database: fixbhai" -ForegroundColor White
Write-Host "  3. Import file: database/fixbhai.sql`n" -ForegroundColor White

# Frontend configuration
Write-Host "[4/4] Frontend Configuration:" -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "  ✓ .env.local exists" -ForegroundColor Green
    $envContent = Get-Content .env.local -Raw
    if ($envContent -match "VITE_USE_MOCK=false") {
        Write-Host "  ✓ Mock mode is disabled`n" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Mock mode is enabled" -ForegroundColor Yellow
        Write-Host "  → Set VITE_USE_MOCK=false in .env.local`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ .env.local not found" -ForegroundColor Yellow
    Write-Host "  → Copy .env.example to .env.local`n" -ForegroundColor Yellow
}

# Next steps
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "1. Import database (see instructions above)" -ForegroundColor White
Write-Host "2. Start frontend: npm run dev" -ForegroundColor White
Write-Host "3. Login with:" -ForegroundColor White
Write-Host "   Admin:      admin@fixbhai.com / Admin@123" -ForegroundColor Cyan
Write-Host "   Customer:   rahim@gmail.com / Demo@1234" -ForegroundColor Cyan
Write-Host "   Technician: karim@fixbhai.com / Tech@1234`n" -ForegroundColor Cyan

Write-Host "For more details, see README.md`n" -ForegroundColor Gray
