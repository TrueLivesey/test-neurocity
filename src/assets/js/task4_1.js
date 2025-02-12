import fs from 'fs';
import os from 'os';

// Получение домашней директории
const homeDir = os.homedir();

// Чтение директории
fs.readdir(homeDir, (err, files) => {
  if (err) {
    console.error('Ошибка при чтении директории:', err);
    return;
  }
  console.log('Файлы в домашней директории:');
  files.forEach((file) => {
    console.log(file);
  });
});
