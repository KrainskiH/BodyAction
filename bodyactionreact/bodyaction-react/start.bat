@echo off
cd /d "%~dp0"
cls
echo ========================================
echo  BodyAction - COMPLETO
echo  HTML + React + API C# + Banco
echo ========================================
echo.

REM Verificar .NET
where dotnet >nul 2>&1
if errorlevel 1 (
    echo [ERRO] .NET SDK nao encontrado!
    echo Baixe em: https://dotnet.microsoft.com/download/dotnet/8.0
    pause
    exit /b 1
)

echo [OK] .NET SDK encontrado
echo [OK] Node.js encontrado
echo.

REM Verificar se build existe
if not exist "build\index.html" (
    echo [1/4] Fazendo build do React...
    call npm run build
    if errorlevel 1 (
        echo [ERRO] Falha no build!
        pause
        exit /b 1
    )
) else (
    echo [1/4] Build ja existe (pulando)
)

echo [2/4] Iniciando API C# na porta 5001...
start "API C# - localhost:5001" cmd /c "cd /d %~dp0 && dotnet run --urls http://localhost:5001"

echo [3/4] Aguardando API inicializar (5 segundos)...
timeout /t 5 /nobreak >nul

echo [4/4] Iniciando Frontend na porta 5000...
set HOST=0.0.0.0
echo.
echo ========================================
echo  TUDO RODANDO!
echo ========================================
echo  Frontend:     http://localhost:5000
echo  LAN (rede):   http://SEU-IP:5000
echo  API C#:       http://localhost:5001
echo  API via proxy: http://localhost:5000/api/*
echo ========================================
echo.
echo Abrindo navegador...
start http://localhost:5000
echo.
echo Mantenha este terminal aberto!
echo Pressione Ctrl+C para parar o frontend
echo.
node server.js
