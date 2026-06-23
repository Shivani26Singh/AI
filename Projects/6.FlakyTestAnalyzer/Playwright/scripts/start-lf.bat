@echo off
cd /d C:\SHIVANI\VSCode\AI\AILearning\chapter_05_AI_Agents_LangFlow
set LANGFLOW_SKIP_AUTH_AUTO_LOGIN=true
start /B /MIN "Langflow" .venv\Scripts\langflow.exe run --host 127.0.0.1 --port 7861
exit /b 0
