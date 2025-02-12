import { exec } from 'child_process';

// Функция для открытия терминала и вывода "Hello, World!"
function openTerminalAndPrint() {
  // Команда для открытия терминала и вывода текста
  const command = 'start cmd.exe /k echo Hello, World!';

  // Дочерний процесс
  const child = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  // Обработка закрытия процесса
  child.on('close', (code) => {
    console.log(`Дочерний процесс завершён с кодом ${code}`);
  });
}

openTerminalAndPrint();
