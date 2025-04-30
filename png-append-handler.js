export class PngAppendHandler {
    /**
     * Читает данные, добавленные в конец PNG-файла
     * @param {Blob} pngBlob - Входной PNG-файл
     * @returns {Promise<object|null>} Распарсенные JSON-данные или null
     */
    static async get(pngBlob) {
        const buffer = await pngBlob.arrayBuffer();
        const view = new Uint8Array(buffer);
        
        // IEND чанк всегда заканчивается этими байтами
        const iendSignature = [0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82];
        let iendPos = -1;

        // Ищем позицию конца IEND чанка
        for (let i = view.length - 8; i >= 0; i--) {
            let match = true;
            for (let j = 0; j < 8; j++) {
                if (view[i + j] !== iendSignature[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                iendPos = i + 8; // Позиция после IEND
                break;
            }
        }

        if (iendPos === -1 || iendPos >= view.length) {
            return null; // Невалидный PNG или нет дополнительных данных
        }

        const appendedData = new Uint8Array(buffer, iendPos);
        if (appendedData.length === 0) return null;

        try {
            const text = new TextDecoder().decode(appendedData);
            return JSON.parse(text);
        } catch (e) {
            console.error('Error parsing appended data:', e);
            return null;
        }
    }

    /**
     * Добавляет JSON-данные в конец PNG-файла
     * @param {Blob} pngBlob - Исходный PNG-файл
     * @param {object} jsonData - Данные для добавления
     * @returns {Promise<Blob>} Новый Blob с данными
     */
    static async set(pngBlob, jsonData) {
        const jsonStr = JSON.stringify(jsonData);
        const jsonBytes = new TextEncoder().encode(jsonStr);
        
        const pngBuffer = await pngBlob.arrayBuffer();
        const newBlob = new Blob(
            [pngBuffer, jsonBytes], 
            { type: 'image/png' }
        );
        
        return newBlob;
    }
}