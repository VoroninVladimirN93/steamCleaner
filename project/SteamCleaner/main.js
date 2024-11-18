const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec, execSync } = require('child_process');
const fs = require('fs');

// Создание окна
let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 640,
        height: 480,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    mainWindow.loadFile('index.html');
});

// IPC: Закрытие Steam, очистка папок и запуск Steam
ipcMain.handle('start-cleaning', async () => {
    try {
        // Получаем путь к Steam из реестра
        const steamPath = getSteamPath();
        if (!steamPath) {
            return 'Не удалось найти Steam на этом компьютере.';
        }

        // Проверяем, запущен ли Steam
        const steamRunning = isSteamRunning();
        let steamWasRunning = false;
        
        if (steamRunning) {
            // Завершаем Steam
            execSync('taskkill /IM steam.exe /F', { stdio: 'ignore' });
            steamWasRunning = true; // Отметим, что Steam был запущен
        }

        // Ждем, пока процесс Steam полностью завершится
        if (steamWasRunning) {
            await new Promise(resolve => setTimeout(resolve, 3000));  // Ожидаем 3 секунды
        }

        // Поиск всех библиотек Steam
        const libraryPaths = findSteamLibraries(steamPath);

        // Если библиотека не найдена
        if (libraryPaths.length === 0) {
            return 'Не найдено ни одной библиотеки Steam.';
        }

        // Удаление папок
        let totalSize = 0;
        const foldersToDelete = ['steamapps\\downloading', 'steamapps\\temp', 'steamapps\\workshop'];
        libraryPaths.forEach(libraryPath => {
            foldersToDelete.forEach(folder => {
                const fullPath = path.join(libraryPath, folder);
                if (fs.existsSync(fullPath)) {
                    totalSize += getFolderSize(fullPath);
                    fs.rmSync(fullPath, { recursive: true, force: true });
                }
            });
        });

        // Запуск Steam обратно (асинхронно)
        exec(`start "" "${path.join(steamPath, 'steam.exe')}"`);

        return `Удалено ${(totalSize / 1024 / 1024).toFixed(2)} МБ из ${libraryPaths.length-1} библиотеки.`;
    } catch (error) {
        console.error(error);
        return `Ошибка: ${error.message}`;
    }
});

// Проверка, запущен ли Steam
function isSteamRunning() {
    try {
        execSync('tasklist | findstr /I "steam.exe"', { stdio: 'ignore' });
        return true;
    } catch {
        return false; // Если команды вернула ошибку — процесс не найден
    }
}

// Получение пути к Steam из реестра
function getSteamPath() {
    try {
        const output = execSync(
            'reg query "HKCU\\Software\\Valve\\Steam" /v SteamPath',
            { encoding: 'utf8' }
        );
        const match = output.match(/SteamPath\s+REG_SZ\s+(.+)/);
        return match ? match[1].trim() : null;
    } catch (error) {
        console.error('Ошибка при поиске пути Steam:', error);
        return null;
    }
}

// Поиск всех библиотек Steam
function findSteamLibraries(steamPath) {
    const libraryPaths = new Set();  // Используем Set для уникальных путей
    libraryPaths.add(steamPath);  // Добавляем основной путь Steam

    const libraryFile = path.join(steamPath, 'steamapps', 'libraryfolders.vdf');
    if (fs.existsSync(libraryFile)) {
        const fileContent = fs.readFileSync(libraryFile, 'utf8');
        const matches = fileContent.match(/"(\d+)"\s*\{\s*"path"\s+"([^"]+)"/g);
        if (matches) {
            matches.forEach(match => {
                const libraryPath = match.match(/"path"\s+"([^"]+)"/);
                if (libraryPath && libraryPath[1]) {
                    const sanitizedPath = libraryPath[1].replace(/\\\\/g, '\\');
                    libraryPaths.add(sanitizedPath);  // Добавляем путь только если уникальный
                }
            });
        }
    }

    // Преобразуем Set в массив для возврата уникальных путей
    return Array.from(libraryPaths);
}

// Подсчёт размера папки
function getFolderSize(directory) {
    let size = 0;
    try {
        const files = fs.readdirSync(directory, { withFileTypes: true });
        files.forEach(file => {
            const filePath = path.join(directory, file.name);
            size += file.isDirectory() ? getFolderSize(filePath) : fs.statSync(filePath).size;
        });
    } catch (error) {
        // Игнорируем ошибки, если папки нет
        console.error(`Ошибка при расчете размера папки ${directory}: ${error.message}`);
    }
    return size;
}
