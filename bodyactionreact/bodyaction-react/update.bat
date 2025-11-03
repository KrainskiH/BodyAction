@echo off
cd /d "%~dp0"
echo ========================================
echo  BodyAction - Atualizador Rapido
echo ========================================
echo.
echo [1/2] Fazendo build do projeto...
node ./node_modules/react-scripts/scripts/build.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Build falhou!
    pause
    exit /b 1
)

echo.
echo [2/2] Reiniciando servidor PM2...
node "C:\Users\Pichau\AppData\Roaming\npm\node_modules\pm2\bin\pm2" restart bodyaction

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha ao reiniciar PM2!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Sucesso! Servidor atualizado
echo  Acesse: http://localhost:5000
echo ========================================
echo.
pause
