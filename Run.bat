@echo off
chcp 65001 >nul
title 0NOXTACKORE - Servidor de desarrollo
cd /d "%~dp0"

echo.
echo  ==================================================
echo    0NOXTACKORE - BUILT FOR IMPACT
echo  ==================================================
echo.

if not exist "node_modules" (
  echo Instalando dependencias. Espera un momento...
  call npm install
  echo.
)

echo  URL para copiar y pegar en cualquier navegador:
echo.
echo         http://localhost:3000
echo.

echo http://localhost:3000|clip
echo  (El link ya quedo copiado en tu portapapeles)
echo.
echo  Presiona Ctrl+C para detener el servidor.
echo.

call npm run dev
