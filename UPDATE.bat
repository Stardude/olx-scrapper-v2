@echo off
IF NOT EXIST "node_modules" (
    npm install simple-git@1.130.0
    echo Installed!
) ELSE (
    echo Continuing...
)

node.exe index-git.js
timeout 20 > NUL
