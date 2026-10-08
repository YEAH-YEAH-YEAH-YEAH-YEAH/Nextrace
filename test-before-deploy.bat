@echo off
echo ========================================
echo    TEST AVANT DEPLOIEMENT
echo ========================================
echo.

REM Vérifier la version de Node
echo [1/5] Verification de Node.js...
node -v > temp_node_version.txt
set /p NODE_VER=<temp_node_version.txt
del temp_node_version.txt

echo Version detectee: %NODE_VER%

REM Vérifier si c'est Node 20.x
echo %NODE_VER% | findstr /C:"v20." >nul
if %errorlevel%==0 (
    echo [OK] Node.js 20.x detecte !
) else (
    echo [ATTENTION] Vous utilisez %NODE_VER%
    echo Il est recommande d'utiliser Node.js 20.x pour Render
    echo Telechargement: https://nodejs.org/dist/v20.11.1/
    echo.
    pause
)
echo.

REM Installer les dépendances
echo [2/5] Installation des dependances...
call npm install
if %errorlevel% neq 0 (
    echo [ERREUR] Installation echouee
    pause
    exit /b 1
)
echo [OK] Dependances installees !
echo.

REM Vérifier que better-sqlite3 fonctionne
echo [3/5] Test de better-sqlite3...
node -e "require('better-sqlite3')" 2>nul
if %errorlevel%==0 (
    echo [OK] better-sqlite3 fonctionne !
) else (
    echo [ERREUR] better-sqlite3 ne fonctionne pas
    echo Essayez: npm rebuild better-sqlite3
    pause
    exit /b 1
)
echo.

REM Démarrer le serveur en background
echo [4/5] Demarrage du serveur...
start /B node server.js
timeout /t 3 /nobreak >nul

REM Tester si le serveur répond
echo [5/5] Test de connexion...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Serveur demarre avec succes !
    echo.
    echo ========================================
    echo    TOUS LES TESTS PASSES ! ✓
    echo ========================================
    echo.
    echo Le serveur tourne sur http://localhost:3000
    echo Ouvrez votre navigateur pour tester !
    echo.
    echo Appuyez sur une touche pour arreter le serveur...
    pause >nul
    
    REM Arrêter le serveur
    taskkill /F /IM node.exe /FI "WINDOWTITLE eq *" >nul 2>&1
    echo Serveur arrete.
) else (
    echo [ERREUR] Le serveur ne repond pas
    echo Verifiez les logs ci-dessus
    taskkill /F /IM node.exe /FI "WINDOWTITLE eq *" >nul 2>&1
    pause
    exit /b 1
)

echo.
echo ========================================
echo Vous pouvez maintenant deployer !
echo Double-cliquez sur deploy-github.bat
echo ========================================
pause
