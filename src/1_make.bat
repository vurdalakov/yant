@echo off

echo *** 1. Initializing

set addon=yant
set version=0.2.0

set zipper="C:\Program Files\WinRAR\WinRAR.exe" a -afzip -r 
set zipper=%USERPROFILE%\personal\utils\misc\7zip\7za.exe a -tzip -r 

set xpi=%addon%_%version%.xpi

echo *** 2. Cleaning

if exist %xpi% del %xpi%

echo *** 3. Creating [%xpi%]

cd source
%zipper% %xpi% *.*
move %xpi% ..
cd ..
