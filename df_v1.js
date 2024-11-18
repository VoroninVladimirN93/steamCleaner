const fs = require('fs');
const path = require('path');
const readline = require('readline');

const directories = [
    "C:\\Program Files (x86)\\Steam\\steamapps\\downloading",
    "C:\\Program Files (x86)\\Steam\\steamapps\\temp",
    "C:\\Program Files (x86)\\Steam\\steamapps\\workshop",
    "D:\\SteamLibrary\\steamapps\\downloading",
    "D:\\SteamLibrary\\steamapps\\temp",
    "D:\\SteamLibrary\\steamapps\\workshop",
    "E:\\SteamLibrary\\steamapps\\downloading",
    "E:\\SteamLibrary\\steamapps\\temp",
    "E:\\SteamLibrary\\steamapps\\workshop",
    "F:\\SteamLibrary\\steamapps\\downloading",
    "F:\\SteamLibrary\\steamapps\\temp",
    "F:\\SteamLibrary\\steamapps\\workshop",
    "G:\\SteamLibrary\\steamapps\\downloading",
    "G:\\SteamLibrary\\steamapps\\temp",
    "G:\\SteamLibrary\\steamapps\\workshop",
    "I:\\SteamLibrary\\steamapps\\downloading",
    "I:\\SteamLibrary\\steamapps\\temp",
    "I:\\SteamLibrary\\steamapps\\workshop",
    "Q:\\SteamLibrary\\steamapps\\downloading",
    "Q:\\SteamLibrary\\steamapps\\temp",
    "Q:\\SteamLibrary\\steamapps\\workshop",
    "C:\\Steam\\steamapps\\downloading",
    "C:\\Steam\\steamapps\\temp",
    "C:\\Steam\\steamapps\\workshop"
];

let totalDeletedSize = 0;

function getFolderSize(directory) {
    let size = 0;
    try {
        const files = fs.readdirSync(directory, { withFileTypes: true });
        files.forEach(file => {
            const filePath = path.join(directory, file.name);
            if (file.isDirectory()) {
                size += getFolderSize(filePath);
            } else {
                size += fs.statSync(filePath).size;
            }
        });
    } catch (err) {
        console.error(`Ошибка при подсчете размера папки "${directory}":`, err);
    }
    return size;
}

directories.forEach(dir => {
    if (fs.existsSync(dir)) {
        const size = getFolderSize(dir);
        totalDeletedSize += size;

        try {
            fs.rmSync(dir, { recursive: true, force: true });
            console.log(`Папка "${dir}" успешно удалена. Удалено: ${(size / 1024 / 1024).toFixed(2)} МБ.`);
        } catch (err) {
            console.error(`Ошибка при удалении папки "${dir}":`, err);
        }
    } else {
        console.log(`Папка "${dir}" не найдена.`);
    }
});

console.log(`Суммарно удалено: ${(totalDeletedSize / 1024 / 1024).toFixed(2)} МБ.`);

// Ждем нажатия любой клавиши перед закрытием
console.log("Для закрытия окна нажмите любую клавишу...");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', () => {
    process.stdin.setRawMode(false);
    process.stdin.pause();
});
