# BodyAction - Startup Script para PowerShell
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BodyAction - SISTEMA COMPLETO" -ForegroundColor Green  
Write-Host "  Frontend + Backend + API + Database" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se já há processos rodando
$dotnetProcess = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue
$nodeProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($dotnetProcess -or $nodeProcess) {
    Write-Host "Parando processos anteriores..." -ForegroundColor Yellow
    Stop-Process -Name "dotnet" -Force -ErrorAction SilentlyContinue
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Verificar dependências
try {
    $dotnetVersion = & dotnet --version
    Write-Host "✓ .NET SDK encontrado: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ .NET SDK não encontrado!" -ForegroundColor Red
    Write-Host "Baixe em: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

try {
    $nodeVersion = & node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Baixe em: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Build React se necessário
if (!(Test-Path "build\index.html")) {
    Write-Host "[1/5] Fazendo build do React..." -ForegroundColor Yellow
    & npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Falha no build do React!" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
} else {
    Write-Host "[1/5] Build React já existe (pulando)" -ForegroundColor Green
}

# Iniciar Backend
Write-Host "[2/5] Iniciando Backend API (.NET)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]
    & dotnet run --urls http://localhost:5001
} -ArgumentList (Get-Location).Path

# Aguardar Backend inicializar
Write-Host "[3/5] Aguardando Backend inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Verificar se Backend está funcionando
Write-Host "[4/5] Verificando Backend..." -ForegroundColor Yellow
$maxTentativas = 15
for ($i = 1; $i -le $maxTentativas; $i++) {
    try {
        Write-Host "  Tentativa $i/$maxTentativas - Testando http://localhost:5001/health..."
        $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -TimeoutSec 3 -UseBasicParsing
        Write-Host "✓ Backend CONFIRMADO como funcional!" -ForegroundColor Green
        break
    } catch {
        if ($i -eq $maxTentativas) {
            Write-Host "✗ Backend não respondeu após $maxTentativas tentativas!" -ForegroundColor Red
            Write-Host "Verifique se o .NET SDK está funcionando corretamente." -ForegroundColor Yellow
            Read-Host "Pressione Enter para sair"
            exit 1
        }
        Write-Host "  Backend ainda não está pronto, aguardando..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

# Iniciar Frontend
Write-Host "[5/5] Iniciando Frontend Server (Node.js)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]
    & node server.js
} -ArgumentList (Get-Location).Path

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SISTEMA INICIADO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Frontend:       http://localhost:5000" -ForegroundColor White
Write-Host "  Backend API:    http://localhost:5001" -ForegroundColor White  
Write-Host "  API Proxy:      http://localhost:5000/api/*" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Abrir navegador
Write-Host "Abrindo navegador..." -ForegroundColor Yellow
Start-Process "http://localhost:5000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   IMPORTANTE - LEIA COM ATENÇÃO!" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Os serviços estão rodando em segundo plano." -ForegroundColor White
Write-Host "  MANTENHA ESTE TERMINAL ABERTO para que continuem funcionando." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Para PARAR os serviços: Pressione Ctrl+C ou feche este terminal" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Aguardar até o usuário pressionar Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Parando serviços..." -ForegroundColor Yellow
    
    # Parar jobs
    if ($backendJob) { Stop-Job $backendJob -ErrorAction SilentlyContinue; Remove-Job $backendJob -ErrorAction SilentlyContinue }
    if ($frontendJob) { Stop-Job $frontendJob -ErrorAction SilentlyContinue; Remove-Job $frontendJob -ErrorAction SilentlyContinue }
    
    # Parar processos
    Stop-Process -Name "dotnet" -Force -ErrorAction SilentlyContinue
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    
    Write-Host "✓ Serviços parados!" -ForegroundColor Green
}