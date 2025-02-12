export default class FileDownloader {
  constructor(container, url, mode) {
    this.url = url;
    this.container = container;
    this.mode = mode;
    this.downloadsContainer = container.querySelector('#downloads');
    this.startBtn = container.querySelector('#start');

    this.init();
  }

  // Метод для инициализации
  init() {
    this.startBtn.addEventListener('click', () => this.startDownload());
  }

  // Метод для получения списка файлов
  async fetchFileList(url) {
    try {
      const response = await fetch(url);
      const fileList = await response.json();
      const folderList = await fileList.map((file) => `${url}/${file.name}`);
      const downloadList = [];

      // Перебор папок с файлами
      for (let newFileItem of folderList) {
        const response = await fetch(newFileItem);
        const fileList = await response.json();

        // Перебор файлов во всех папках
        for (let file of fileList) {
          downloadList.push(`${newFileItem}/${file.name}`);
        }
      }

      // Возвращается массив всех файлов
      return downloadList;
    } catch (error) {
      console.error('Ошибка при получении списка файлов:', error);
      return [];
    }
  }

  // Метод для загрузки файлов
  async downloadFile(url, progressCallback) {
    try {
      const response = await fetch(url);
      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');
      let receivedLength = 0;
      let chunks = [];

      // Если размер файла равен 0, то давльнейшее поведение зависит от мода
      if (contentLength === 0) {
        // Мод "загрузка всех файлов"
        if (this.mode === 'all') {
          progressCallback(100);
          // Мод "загрузка только тех файлов, чьи размеры больше нуля"
        } else if (this.mode === 'sizeOnly') {
          progressCallback(100);
          return;
        }
      }

      // Заполнение прогресс бара
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        progressCallback((receivedLength / contentLength) * 100);
      }

      // Создание ссылки на загруженный файл
      const blob = new Blob(chunks);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = url.split('/').pop();

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Ошибка при загрузке файла ${url}:`, error);
    }
  }

  // Метод для запуска загрузки файлов
  async startDownload() {
    const fileList = await this.fetchFileList(this.url);

    if (fileList.length === 0) {
      alert('Файлы для загрузки не найдены.');
      return;
    }

    // Очистка контейнера загрузок
    this.downloadsContainer.innerHTML = '';

    // Загрузка файлов
    const downloadPromises = fileList.map((url) => {
      const fileName = url.split('/').pop();
      const fileItem = document.createElement('div');
      fileItem.classList.add('task3__download-item');
      fileItem.innerHTML = `<span class="task3__download-name">${fileName}</span>`;

      const progressBar = document.createElement('progress');
      progressBar.value = 0;
      progressBar.max = 100;

      const statusIcon = document.createElement('span');
      statusIcon.textContent = '⏳';

      fileItem.appendChild(progressBar);
      fileItem.appendChild(statusIcon);
      this.downloadsContainer.appendChild(fileItem);

      return this.downloadFile(url, (progress) => {
        progressBar.value = progress;
        if (progress >= 100) {
          statusIcon.textContent = '✅';
        }
      });
    });

    await Promise.all(downloadPromises);
  }
}
