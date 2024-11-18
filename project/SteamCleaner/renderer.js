document.getElementById('clean-btn').addEventListener('click', async () => {
    const output = document.getElementById('output');
    output.textContent = 'Очистка началась...';

    try {
        const result = await window.api.startCleaning();
        output.textContent = result;
    } catch (error) {
        output.textContent = `Ошибка: ${error.message}`;
    }
});
