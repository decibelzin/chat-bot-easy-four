@echo off
REM Sobe app + ngrok no Windows. Uso: scripts\tunnel.bat
REM Precisa: Node, ngrok no PATH, e .env configurado.

cd /d "%~dp0\.."
echo >>> App + ngrok (porta 3000). Ctrl+C para parar.
call npm run tunnel
