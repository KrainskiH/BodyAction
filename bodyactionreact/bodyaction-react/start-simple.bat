./@echo off
echo ========================================
echo  BodyAction - Modo Faculdade (Simples)
echo ========================================
echo.
echo Este script roda apenas o frontend (sem API C#)
echo Ideal para PCs sem .NET instalado
echo.

echo [1/2] Fazendo build do React...
call npm run build

if errorlevel 1 (
    echo [ERRO] Falha no build!
    pause
    exit /b 1
)

echo [2/2] Iniciando servidor frontend...
echo.
echo ========================================
echo  Servidor rodando em:
echo  http://localhost:5000
echo ========================================
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

node server.js
