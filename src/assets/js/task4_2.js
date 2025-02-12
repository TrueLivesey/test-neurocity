import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Путь к текущему файлу
const __dirname = path.dirname(__filename); // Путь к директории, содержащей
// текущий файл
const url = 'https://store.neuro-city.ru/downloads/for-test-tasks/files-list/';

async function downloadFiles() {
  try {
    // Список всех файлов
    const response = await axios.get(url);
    const files = response.data;
    console.log('Файлы на удалённом хранилище:');
    files.forEach((file) => console.log(file.name));

    // Последовательная загрузка файлов
    for (const file of files) {
      // Проверка типа файла
      if (file.type === 'file') {
        const fileUrl = `${url}${file.name}`;
        const filePath = path.join(__dirname, file.name);

        // Загрузка файла
        try {
          const fileResponse = await axios({
            url: fileUrl,
            responseType: 'stream',
          });

          // Сохранение файла на диск
          const writer = fs.createWriteStream(filePath);
          fileResponse.data.pipe(writer);

          // Ожидание завершения загрузки
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          console.log(`Файл ${file.name} загружен.`);
        } catch (error) {
          console.error(`Ошибка при загрузке файла ${file.name}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('Ошибка при получении списка файлов:', error.message);
  }
}

downloadFiles();
