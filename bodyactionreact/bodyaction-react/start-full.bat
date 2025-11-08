@echo off
echo ========================================
echo  BodyAction - Host Unico (localhost:5000)
echo ========================================
echo.

REM Verificar se .NET está instalado
dotnet --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] .NET SDK nao encontrado!
    echo Baixe em: https://dotnet.microsoft.com/download/dotnet/8.0
    pause
    exit /b 1
)
echo [OK] .NET SDK encontrado
echo.

REM Instalar dependencias do Node se necessario
echo [1/4] Verificando dependencias...
call npm install >nul 2>&1

REM Iniciar API C# na porta 5001 (janela separada)
echo [2/4] Iniciando API C# na porta 5001...
start "BodyAction API" cmd /k "dotnet run --urls http://localhost:5001"

REM Aguardar alguns segundos para API subir
timeout /t 5 /nobreak >nul

REM Fazer build do React
echo [3/4] Fazendo build do React...
call npm run build

REM Iniciar servidor unificado Node.js
echo [4/4] Iniciando servidor unificado na porta 5000...
start "BodyAction Servidor" cmd /k "node server.js"

REM Abrir navegador na porta correta
start http://localhost:5000

echo.
echo ========================================
echo  BodyAction iniciado com sucesso!
echo  Frontend:      http://localhost:5000
echo  API via proxy: http://localhost:5000/api/*
echo ========================================
pause
