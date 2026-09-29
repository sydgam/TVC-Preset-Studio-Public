@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "TVC_STUDIO_PORT=8066"
if exist "..\..\.env" for /f "usebackq eol=# tokens=1,* delims==" %%A in ("..\..\.env") do set "%%A=%%B"

start "TVC Preset Studio V2 Server" /min cmd /c "python server.py"
timeout /t 1 /nobreak >nul
start "TVC Preset Studio V2" "http://127.0.0.1:8066/"
exit /b
