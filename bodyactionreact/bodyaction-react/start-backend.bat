@echo off
cd /d "%~dp0"

REM Adicionar .NET ao PATH se necessario
set PATH=C:\Program Files\dotnet;%PATH%

REM Tentar primeiro com o caminho completo
echo [Backend] Iniciando com caminho completo...
"C:\Program Files\dotnet\dotnet.exe" --version >nul 2>&1
if errorlevel 1 (
    echo [Backend] Caminho completo falhou, tentando PATH...
    dotnet --version >nul 2>&1
    if errorlevel 1 (
        echo [ERRO] .NET nao encontrado! Verifique a instalacao.
        pause
        exit /b 1
    )
    echo [Backend] Usando dotnet via PATH...
    dotnet run --urls http://localhost:5001
) else (
    echo [Backend] Usando caminho completo...
    "C:\Program Files\dotnet\dotnet.exe" run --urls http://localhost:5001
)