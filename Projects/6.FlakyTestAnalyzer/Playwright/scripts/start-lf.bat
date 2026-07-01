@echo off
REM Start LangFlow using the project-local venv (portable across machines)
cd /d "%~dp0..\.."
set LANGFLOW_SKIP_AUTH_AUTO_LOGIN=true
start /B /MIN "Langflow" .venv\Scripts\langflow.exe run --host 127.0.0.1 --port 7861
exit /b 0
