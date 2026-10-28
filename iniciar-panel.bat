@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo =========================================================
echo   Panel de Administracion - Web Josep Mira Lozano
echo =========================================================
echo.
echo Iniciando servidor del panel en http://localhost:3000/admin ...
start http://localhost:3000/admin
call npm run dev
if errorlevel 1 (
  echo.
  echo [ERROR] No se pudo arrancar el servidor.
  pause
)
