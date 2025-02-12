import './style.scss';
import Slider from './assets/js/task1';
import ImageRotation from './assets/js/task2';
import FileDownloader from './assets/js/task3';

document.addEventListener('DOMContentLoaded', () => {
  const task1Container = document.querySelector('#slider');
  const task2Container = document.querySelector('.task2');
  const task3Container = document.querySelector('.task3');

  // Задание 1. Инициализация слайдера
  const slider = new Slider(task1Container, { cardsPerView: 2, isInfinite: true, padding: 32 });

  // Задание 2. Инициализация поворота картинки
  const imageRotation = new ImageRotation(task2Container);

  // Задание 3
  const downloader = new FileDownloader(
    task3Container,
    'https://store.neuro-city.ru/downloads/for-test-tasks',
    'sizeOnly',
  );
});
