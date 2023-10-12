@echo off

REM Backend
cd C:\ro-price-bot-main

REM Check if node_modules directory exists, and if not, install dependencies
IF NOT EXIST node_modules (
  echo Install Backend dependencies
  npm install
) ELSE (
  echo Backend project dependencies are already installed.
)

REM Start the Node.js server (backend)
node app.js


REM Open a new command prompt window for the React app (frontend)
start cmd /k

REM Frontend
cd C:\ro-price-bot-main\client

REM Check if node_modules directory exists, and if not, install dependencies
IF NOT EXIST node_modules (
  echo Installing Frontend dependencies...
  npm install
) ELSE (
  echo Frontend dependencies are already installed.
)

REM Start the React app
npm start
