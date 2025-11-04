@echo off
chcp 65001 >nul
title BodyAction - Iniciar Sistema Completo
color 0A

echo ========================================
echo    BODYACTION - Sistema Completo
echo ========================================
echo.

cd /d "%~dp0"

REM [1] Verificar .NET SDK
echo [1/4] Verificando .NET SDK...
where dotnet >nul 2>&1
if errorlevel 1 (
    echo [ERRO] .NET SDK nao encontrado!
    echo Baixe em: https://dotnet.microsoft.com/download
    pause
    exit /b 1
)
echo [OK] .NET SDK encontrado
echo.

REM [2] Fazer build sempre
echo [2/4] Criando build do React...
call npm run build
if errorlevel 1 (
    echo [ERRO] Falha no build!
    pause
    exit /b 1
)
echo [OK] Build criado com sucesso
echo.

REM [3] Iniciar API C#
echo [3/4] Iniciando API C# (porta 5001)...
start "BodyAction API" cmd /c "cd /d %~dp0 && dotnet run --urls http://localhost:5001"
timeout /t 5 /nobreak >nul
echo [OK] API iniciada
echo.

REM [4] Iniciar Frontend
echo [4/4] Iniciando servidor frontend (porta 5000)...
echo.
echo ========================================
echo   Sistema iniciado com sucesso!
echo ========================================
echo   Frontend: http://localhost:5000
echo   API:      http://localhost:5001
echo ========================================
echo.
echo Pressione Ctrl+C para encerrar
echo.

node server.js
