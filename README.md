
# Installation

> npm install

# Project interface

Reset cache and run Metro
> npm run start

Reset cache and run Metro + ADB
> npm run android

Run on IOS
> npm run ios

Reset android cache && node_modules
>npm run reset-android

Reset android cache && node_modules
>npm run reset-all

Compile .APK ready for deployment
>npm run compile-release

Compile .APK ready for debug
>npm run compile-debug

Compile .AAP ready for google deploy
>npm run compile-aab

Lint the project
>npm run lint

Test the whole project
>npm run test


# Helpers 

## Windows

Set script-shell to git :
> npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"

revert :
> npm config delete script-shell

## All

**#Commons**

ADB Warning view :
> adb logcat *:W 

**#Regex**

Find all console.log
> console\.log\(([^^)]+.*)\)