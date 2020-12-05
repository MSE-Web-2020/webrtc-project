@echo off
if not exist "node_modules" cmd /c npm i & call public/cert/cert.bat
::if not exist "node_modules" cmd /c cnpm i & call public/cert/cert.bat
start npm run start
start https://localhost