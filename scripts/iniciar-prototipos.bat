@echo off
REM Arranca la web nueva en http://localhost:3000 sin usar Claude.
REM Uso: doble clic en este archivo, o desde la carpeta del proyecto: scripts\iniciar-prototipos.bat

cd /d "%~dp0.."
title Web Josep Mira - localhost:3000

where node >nul 2>nul
if errorlevel 1 (
  echo No encuentro Node.js. Instalalo desde https://nodejs.org ^(versión LTS^) y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

REM Si ya habia un servidor anterior escuchando en el puerto 3000, se cierra para que no sirva archivos antiguos.
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do (
  echo Cerrando servidor anterior en el puerto 3000 ^(PID %%a^)...
  taskkill /F /PID %%a >nul 2>nul
)

where git >nul 2>nul
if not errorlevel 1 (
  echo Actualizando la rama de trabajo...
  git pull --ff-only origin claude/project-thread-9vb26d
  if errorlevel 1 echo Aviso: no se pudo actualizar desde GitHub. Se arranca con la versión que tienes.
)

if not exist "node_modules" (
  echo Instalando dependencias ^(solo la primera vez^)...
  call npm.cmd install
  if errorlevel 1 (
    echo Error instalando dependencias.
    pause
    exit /b 1
  )
)

REM Version de produccion: va mucho mas fluida que el modo desarrollo. Compilar tarda un minuto.
echo Preparando la web ^(tarda un minuto^)...
call npm.cmd run build
if errorlevel 1 (
  echo.
  echo Aviso: no se pudo preparar la version final. Se arranca en modo desarrollo ^(mas lento^).
  echo.
  echo Web en marcha: http://localhost:3000  ^(prototipos: http://localhost:3000/prototipos^)
  echo Para parar el servidor, pulsa Ctrl+C en esta ventana.
  call npm.cmd run dev
  pause
  exit /b 0
)

echo.
echo Web en marcha: http://localhost:3000  ^(prototipos: http://localhost:3000/prototipos^)
echo Para parar el servidor, pulsa Ctrl+C en esta ventana.
echo.
call npm.cmd run start
pause
