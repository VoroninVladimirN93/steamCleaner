# steamCleaner
Скрипт, который позволяет очищать папки /downloads, /temp, /workshop во всех библиотеках Steam
Для компиляции с помощью NODE.JS можно использовать команду
pkg deleteFolders.js --targets node18-win-x64 --output deleteFolders.exe
Последняя версия скрипта (v2) автоматически закрывает Steam, удаляет указанные папки, снова запускает Steam и ждет нажатия любой клавиши перед закрытием.
Папки можно добавить в массив directories =[]
В версии для сборки на Electron добавлен автоматический поиск всех файлов указанных в файле libraryfolders.vdf

Для установки Electron 
npm install --save-dev electron
