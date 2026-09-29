@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "TVC_STUDIO_PORT=8065"

cls
echo ========================================
echo        START TVC STUDIO 실행 선택
echo ========================================
echo.
echo   [1] V1 기존 버전
echo   [2] V2 백업 버전
echo   [3] V3 테스트 버전
echo.
choice /c 123 /n /m "실행할 버전을 선택하세요 [1/2/3]: "

if errorlevel 3 goto v3
if errorlevel 2 goto v2
goto v1

:v1
start "TVC Preset Studio Server" /min cmd /c "python server.py"
timeout /t 1 /nobreak >nul
start "TVC Preset Studio V1" "http://127.0.0.1:8065/index-v1.html"
exit /b

:v2
if exist ".env" for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do set "%%A=%%B"
start "TVC Preset Studio V2 Server" /min cmd /c "set TVC_STUDIO_PORT=8066&& python versions\v2\server.py"
timeout /t 1 /nobreak >nul
start "TVC Preset Studio V2" "http://127.0.0.1:8066/"
exit /b

:v3
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\configure-anthropic.ps1" -EnvPath "%~dp0.env" -SharedEnvPath "%~dp0..\AI-Video-Studio\.env"
if errorlevel 1 (
  echo.
  echo Anthropic API 키 설정을 완료해야 V3를 실행할 수 있습니다.
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\stop-tvc-server.ps1" -Port 8065 -ServerPath "%~dp0server.py"
if errorlevel 1 (
  echo.
  pause
  exit /b 1
)
start "TVC Preset Studio V3 Server" /min cmd /c "python server.py"
timeout /t 2 /nobreak >nul
start "TVC Preset Studio V3" "http://127.0.0.1:8065/"
exit /b
