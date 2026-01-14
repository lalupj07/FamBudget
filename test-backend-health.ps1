# Backend Health Check Test Script
# Run this after starting the backend server

Write-Host "🧪 Testing Backend Health Endpoint..." -ForegroundColor Cyan
Write-Host ""

# Wait a moment
Start-Sleep -Seconds 2

try {
    $response = Invoke-WebRequest -Uri http://localhost:3000/health -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    
    Write-Host "✅✅✅ SUCCESS! Backend is running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Gray
    
    $json = $response.Content | ConvertFrom-Json
    $json | ConvertTo-Json -Depth 10
    
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host ""
    Write-Host "✅ Health Check: PASSED" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Backend health endpoint is working!" -ForegroundColor White
    Write-Host "2. Ready for full backend test (requires database)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Health Check Failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "- Server not started yet (wait a bit longer)" -ForegroundColor White
    Write-Host "- Server crashed (check backend terminal)" -ForegroundColor White
    Write-Host "- Port 3000 in use (check with: netstat -ano | findstr :3000)" -ForegroundColor White
    Write-Host "- Firewall blocking connection" -ForegroundColor White
}

Write-Host ""
