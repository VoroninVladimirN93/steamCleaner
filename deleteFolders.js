const fs = require('fs');
const path = require('path');

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
];

directories.forEach(dir => {
    if (fs.existsSync(dir)) {
        try {
            fs.rmSync(dir, { recursive: true, force: true });
            console.log(`Папка "${dir}" успешно удалена.`);
        } catch (err) {
            console.error(`Ошибка при удалении папки "${dir}":`, err);
        }
    } else {
        console.log(`Папка "${dir}" не найдена.`);
    }
});