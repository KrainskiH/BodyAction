@echo off
cd /d "%~dp0"
cls
echo ========================================
echo  BodyAction - Servidor
echo ========================================
echo.
echo  Acesse: http://localhost:5000
echo.
echo  Pressione Ctrl+C para parar
echo.
node server.js
