@echo off
rem Node a Java nie su v PATH. Spustenie: zdroj\spusti.cmd test, test:rules, build, emulator, deploy
set "JAVA_HOME=%LOCALAPPDATA%\Programs\jdk-21.0.12.1+1"
set "PATH=%JAVA_HOME%\bin;%LOCALAPPDATA%\Programs\node-v24.20.0-win-x64;%PATH%"
cd /d "%~dp0.."
call npm run %*
