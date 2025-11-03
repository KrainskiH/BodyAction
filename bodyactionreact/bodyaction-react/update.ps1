# BodyAction - Atualizador Rápido (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " BodyAction - Atualizador Rapido" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Fazendo build do projeto..." -ForegroundColor Yellow
node ./node_modules/react-scripts/scripts/build.js

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERRO] Build falhou!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "[2/2] Reiniciando servidor PM2..." -ForegroundColor Yellow
node "C:\Users\Pichau\AppData\Roaming\npm\node_modules\pm2\bin\pm2" restart bodyaction

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERRO] Falha ao reiniciar PM2!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Sucesso! Servidor atualizado" -ForegroundColor Green
Write-Host " Acesse: http://localhost:5000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
