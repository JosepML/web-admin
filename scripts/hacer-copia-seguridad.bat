@echo off
chcp 65001 >nul
cd /d "%~dp0.."
echo =========================================================
echo   Copia de seguridad · Web Josep Mira Lozano
echo =========================================================
echo.
node scripts/copia-seguridad.mjs --con-archivos
echo.
pause
