@echo off
echo ========================================
echo  BodyAction - Host Unico (localhost:5000)
echo ========================================
echo.

REM Verificar se .NET esta instalado
dotnet --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] .NET SDK nao encontrado!
    echo Baixe em: https://dotnet.microsoft.com/download/dotnet/8.0
    pause
    exit /b 1
)

echo [OK] .NET SDK encontrado
echo.

REM Instalar dependencia de proxy se necessario
echo [1/4] Verificando dependencias...
call npm install http-proxy-middleware --save >nul 2>&1

echo [2/4] Iniciando API C# na porta 5001 (interna)...
start "BodyAction API" cmd /k "dotnet run --urls http://localhost:5001"

timeout /t 5 /nobreak >nul

echo [3/4] Fazendo build do React...
call npm run build

echo [4/4] Iniciando servidor unificado na porta 5000...
echo.
echo ========================================
echo  TUDO EM UM HOST:
echo  http://localhost:5000
echo ========================================
echo  Frontend:         http://localhost:5000
echo  API via proxy:    http://localhost:5000/api/*
echo ========================================
echo.
timeout /t 2 /nobreak >nul

start http://localhost:5000

node server.js
