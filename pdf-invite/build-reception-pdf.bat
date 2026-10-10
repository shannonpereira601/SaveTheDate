@echo off
cd /d "%~dp0"
python build_reception_pdf.py
if errorlevel 1 (
  echo.
  echo The PDF build failed.
  pause
  exit /b 1
)
echo.
echo Done.
echo Gloria-and-Shannon-Wedding-Invite.pdf
echo Shannon-and-Gloria-Wedding-Invite.pdf
pause
