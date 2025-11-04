@echo off
cls
cd /d "%~dp0"
echo ========================================
echo  BodyAction - Inicializacao Rapida
echo ========================================
echo  Pasta: %CD%
echo ========================================
echo.

REM Verificar Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado!
    pause
    exit /b 1
)

REM Verificar .NET
where dotnet >nul 2>&1
if errorlevel 1 (
    echo [AVISO] .NET SDK nao encontrado. API nao sera iniciada.
    echo Baixe em: https://dotnet.microsoft.com/download/dotnet/8.0
    echo.
    set SKIP_API=1
) else (
    echo [OK] .NET SDK encontrado
    set SKIP_API=0
)

echo.
echo [1/3] Instalando dependencias...
call npm install >nul 2>&1

echo [2/3] Fazendo build do React...
call npm run build

if errorlevel 1 (
    echo [ERRO] Falha no build!
    pause
    exit /b 1
)

if "%SKIP_API%"=="0" (
    echo [3/3] Iniciando API + Frontend...
    echo.
    echo Para iniciar a API, abra outro terminal e execute:
    echo    dotnet run --urls http://localhost:5001
    echo.
) else (
    echo [3/3] Iniciando apenas Frontend sem API...
    echo.
)

echo.
echo ========================================
echo  Servidor Rodando!
echo ========================================
echo  Frontend: http://localhost:5000
if "%SKIP_API%"=="0" (
    echo  API: Inicie manualmente com: dotnet run --urls http://localhost:5001
)
echo ========================================
echo.
start http://localhost:5000
echo.
echo Pressione Ctrl+C para parar o servidor
node server.js
