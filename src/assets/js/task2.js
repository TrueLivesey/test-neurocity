export default class ImageRotation {
  constructor(container) {
    this.container = container;
    this.btn90 = container.querySelector('#btn-90');
    this.btn180 = container.querySelector('#btn-180');
    this.btn270 = container.querySelector('#btn-270');
    this.btnSave = container.querySelector('#btn-save');
    this.fileInput = container.querySelector('#fileInput');
    this.img = new Image();
    this.rotation = 0;
    this.maxWidth = 500;
    this.maxHeight = 400;

    this.init();
  }

  // Метод для инициализации
  init() {
    this.fileInput.addEventListener('change', (event) => this.change(event));
    this.btn90.addEventListener('click', () => this.rotateImage(90));
    this.btn180.addEventListener('click', () => this.rotateImage(180));
    this.btn270.addEventListener('click', () => this.rotateImage(270));
    this.btnSave.addEventListener('click', () => this.saveImage());

    this.img.onload = () => {
      this.rotation = 0;
      this.drawImage();
    };
  }

  // Метод для обработки изменения файла
  change(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener('load', (e) => {
      this.img.src = e.target.result;
    });
    reader.readAsDataURL(file);
  }

  // Метод для отрисовки изображения
  drawImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let width = this.img.width;
    let height = this.img.height;

    if (this.rotation % 180 !== 0) [w, h] = [h, w];

    // Масштабирование изображения, чтобы сохранить пропорции
    const scale = Math.min(this.maxWidth / width, this.maxHeight / height, 1);
    width *= scale;
    height *= scale;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    ctx.translate(width / 2, height / 2);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.drawImage(
      this.img,
      (-this.img.width * scale) / 2,
      (-this.img.height * scale) / 2,
      this.img.width * scale,
      this.img.height * scale,
    );

    ctx.restore();
  }

  // Метод для поворота изображения
  rotateImage(deg) {
    this.rotation = (this.rotation + deg) % 360;
    this.drawImage();
  }

  // Метод для сохранения изображения
  saveImage() {
    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.download = 'rotated-image.png';
    canvas.toBlob((blob) => {
      link.href = URL.createObjectURL(blob);
      link.click();
    }, 'image/png');
  }
}
