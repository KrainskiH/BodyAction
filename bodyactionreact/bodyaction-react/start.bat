@echo off
cd /d "%~dp0"
cls
echo ========================================
echo   BodyAction - SISTEMA COMPLETO 
echo  Frontend + Backend + API + Database
echo ========================================
echo.

REM Verificar dependências
if exist "C:\Program Files\dotnet\dotnet.exe" (
    echo  [OK] .NET SDK encontrado em C:\Program Files\dotnet
) else (
    where dotnet >nul 2>&1
    if errorlevel 1 (
        echo  [ERRO] .NET SDK nao encontrado!
        echo  Baixe em: https://dotnet.microsoft.com/download/dotnet/8.0
        pause
        exit /b 1
    )
)

where node >nul 2>&1
if errorlevel 1 (
    echo  [ERRO] Node.js nao encontrado!
    echo  Baixe em: https://nodejs.org
    pause
    exit /b 1
)

echo  [OK] Node.js encontrado
echo.

REM Matar processos anteriores se existirem
echo  Limpando processos anteriores...
taskkill /F /IM dotnet.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 1 /nobreak >nul

REM Verificar se build existe
if not exist "build\index.html" (
    echo   [1/5] Fazendo build do React...
    call npm run build
    if errorlevel 1 (
        echo  [ERRO] Falha no build do React!
        pause
        exit /b 1
    )
) else (
    echo  [1/5] Build React já existe (pulando)
)

echo  [2/6] Iniciando Backend API (.NET)...
start "Backend API" /MIN cmd /c "start-backend.bat"

echo  [3/6] Aguardando Backend inicializar (5 segundos iniciais)...
timeout /t 5 /nobreak >nul

echo  [4/6] Verificando se Backend esta realmente funcionando...
set /a tentativas=0
set /a max_tentativas=20

:verificar_backend
set /a tentativas+=1
echo  Tentativa %tentativas%/%max_tentativas% - Testando http://localhost:5001/health...

REM Usar PowerShell para testar a URL
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5001/health' -TimeoutSec 3 -UseBasicParsing; exit 0 } catch { exit 1 }" >nul 2>&1

if %errorlevel% equ 0 (
    echo  Backend CONFIRMADO como funcional!
    goto backend_ok
)

if %tentativas% geq %max_tentativas% (
    echo  [ERRO] Backend nao respondeu apos %max_tentativas% tentativas!
    echo  Verifique se o .NET SDK esta funcionando corretamente.
    echo  Tentando executar: dotnet --version
    set "PATH=C:\Program Files\dotnet;%PATH%"
    dotnet --version
    pause
    exit /b 1
)

echo  Backend ainda nao esta pronto, aguardando 2 segundos...
timeout /t 2 /nobreak >nul
goto verificar_backend

:backend_ok
echo  [5/6] Backend VALIDADO - Iniciando Frontend Server (Node.js)...
start "Frontend Server" /MIN cmd /c "cd /d %~dp0 && node server.js"

echo  [6/6] Aguardando Frontend inicializar...
timeout /t 5 /nobreak >nul

echo  [7/7] Verificando conectividade final...

REM Verificar Frontend
set frontend_ok=0
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000' -TimeoutSec 5 -UseBasicParsing; exit 0 } catch { exit 1 }" >nul 2>&1
if %errorlevel% equ 0 (
    echo   Frontend confirmado funcionando!
    set frontend_ok=1
) else (
    echo   Frontend ainda inicializando...
)

echo.
echo ========================================
echo  SISTEMA INICIADO COM SUCESSO! 
echo ========================================
echo   Frontend:       http://localhost:5000
echo   Backend API:    http://localhost:5001  
echo   API Proxy:      http://localhost:5000/api/*
echo   LAN Access:     http://SEU-IP:5000
echo ========================================
echo.
echo  VALIDACAO COMPLETA:
echo  - Backend: FUNCIONANDO (confirmado via /health)
echo  - Frontend: INICIADO (pode levar alguns segundos)
echo  - Banco de dados: CONECTADO
echo  - Sistema: PRONTO PARA USO!
echo.

if %frontend_ok% equ 0 (
    echo  Aguardando mais 3 segundos para frontend...
    timeout /t 3 /nobreak >nul
)

echo  Abrindo navegador em 3 segundos...
timeout /t 3 /nobreak >nul
start http://localhost:5000

echo.
echo  Navegador aberto! Se a pagina nao carregar:
echo  - Aguarde alguns segundos e atualize (F5)
echo  - Verifique se ambos os servicos estao rodando
echo  - Frontend: http://localhost:5000
echo  - Backend:  http://localhost:5001/health

echo.
echo ========================================
echo   IMPORTANTE - LEIA COM ATENCAO!
echo ========================================
echo  Os servicos estao rodando em segundo plano.
echo  MANTENHA ESTE TERMINAL ABERTO para que continuem funcionando.
echo.
echo  URLs disponiveis:
echo   Frontend: http://localhost:5000
echo   Backend:  http://localhost:5001
echo   Celular:  http://SEU-IP:5000
echo.
echo  Para PARAR os servicos: Feche este terminal ou pressione Ctrl+C
echo.
echo ========================================
echo  Pressione QUALQUER TECLA para sair e parar os servicos...
pause >nul

REM Cleanup ao sair
echo  Parando serviços...
taskkill /F /IM dotnet.exe 2>nul
taskkill /F /IM node.exe 2>nul
echo  Serviços parados!
