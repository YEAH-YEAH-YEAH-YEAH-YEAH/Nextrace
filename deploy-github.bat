@echo off
echo ========================================
echo    DEPLOIEMENT GITHUB - RESEAU SOCIAL
echo ========================================
echo.

REM Initialiser Git si ce n'est pas fait
if not exist .git (
    echo [1/5] Initialisation de Git...
    git init
    echo.
)

REM Ajouter tous les fichiers
echo [2/5] Ajout des fichiers...
git add .
echo.

REM Commit
echo [3/5] Creation du commit...
set /p commit_msg="Message du commit (ou appuyez sur Entree pour message par defaut): "
if "%commit_msg%"=="" set commit_msg=Update - Reseau social complet
git commit -m "%commit_msg%"
echo.

REM Demander l'URL du repository
echo [4/5] Configuration du repository GitHub...
echo.
echo Allez sur https://github.com et creez un nouveau repository
echo Puis copiez l'URL (ex: https://github.com/username/social-network.git)
echo.
set /p repo_url="Collez l'URL du repository GitHub: "

REM Ajouter l'origine si elle n'existe pas
git remote remove origin 2>nul
git remote add origin %repo_url%
echo.

REM Pousser vers GitHub
echo [5/5] Push vers GitHub...
git branch -M main
git push -u origin main
echo.

echo ========================================
echo    DEPLOIEMENT TERMINE !
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Allez sur https://render.com
echo 2. Cliquez sur "New +" ^> "Web Service"
echo 3. Selectionnez votre repository GitHub
echo 4. Suivez les instructions dans DEPLOY.md
echo.
pause
