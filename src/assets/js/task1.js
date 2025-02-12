export default class Slider {
  constructor(container, options = {}) {
    this.container = container;
    this.padding = options.padding || 10;
    this.offsetIndex = this.padding / 2;
    this.slidesContainer = container.querySelector('.slides');
    this.slides = [];
    this.currentIndex = 0;
    this.cardsPerView = options.cardsPerView || 1;
    this.animationDuration = options.animationDuration || 500;
    this.isInfinite = options.isInfinite || false;

    this.fetchData();
    this.initControls();
  }

  // Метод для получения данных
  async fetchData() {
    try {
      const response = await fetch('https://reqres.in/api/users');
      const data = await response.json();
      this.slides = data.data;
      this.renderSlides();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Метод для рендеринга слайдов
  renderSlides() {
    this.slidesContainer.style.gap = `${this.padding}px`;
    this.slidesContainer.innerHTML = this.slides
      .map(
        (user, index) => `
      <div class="slide" style="width: calc(${100 / this.cardsPerView}% - ${(this.padding * (this.cardsPerView - 1)) / this.cardsPerView}px)" data-index="${index}">
        <div class="slide__content">
          <img src="${user.avatar}" alt="${user.first_name}" class="slide__img">
          <h3 class=slide__title>${user.first_name} ${user.last_name}</h3>
          <p class="slide__text">${user.email}</p>
          <button data-id="${user.id}" class="remove-btn slide__btn">Удалить</button>
        </div>
      </div>
    `,
      )
      .join('');

    // Обработчик клика на кнопку удаления
    this.slidesContainer.querySelectorAll('.remove-btn').forEach((button) => {
      button.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        this.removeSlide(id);
      });
    });
  }

  // Метод для инициализации контроллеров
  initControls() {
    const prevBtn = this.container.querySelector('.slider-prev');
    const nextBtn = this.container.querySelector('.slider-next');

    prevBtn.addEventListener('click', () => this.prev());
    nextBtn.addEventListener('click', () => this.next());
  }

  // Методы для перемещения слайдов назад
  prev() {
    if (this.isInfinite) {
      this.currentIndex--;

      if (this.currentIndex < 0) {
        this.currentIndex = this.slides.length - this.cardsPerView;
        this.moveSlides(true);
      }

      this.moveSlides();
    } else {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.moveSlides();
      }
    }
  }

  // Методы для перемещения слайдов вперед
  next() {
    if (this.isInfinite) {
      this.currentIndex++;

      if (this.currentIndex > this.slides.length - this.cardsPerView) {
        this.currentIndex = 0;
        this.moveSlides(true);
      }

      this.moveSlides();
    } else {
      if (this.currentIndex < this.slides.length - this.cardsPerView) {
        this.currentIndex++;
        this.moveSlides();
      }
    }

    this.offsetIndex = this.offsetIndex * 2;
  }

  // Метод для перемещения слайдов
  moveSlides(instant = false) {
    // Ширина одного слайда в процентах, включая отступы
    const slideWidthPercent = 100 / this.cardsPerView;
    // Переводим отступ (padding) в проценты относительно ширины контейнера
    const gapPercent = (this.padding / this.slidesContainer.offsetWidth) * 100;
    // Общее смещение с учетом отступов
    const offset = -this.currentIndex * (slideWidthPercent + gapPercent / this.cardsPerView);

    this.slidesContainer.style.transition = 'transform ${this.animationDuration}ms ease-in-out';
    this.slidesContainer.style.transform = `translateX(${offset}%)`;

    // Проверка на бесконечность
    if (this.isInfinite && !instant) {
      setTimeout(() => {
        if (this.currentIndex < 0) {
          this.currentIndex = this.slides.length - this.cardsPerView;
          this.moveSlides(true);
        } else if (this.currentIndex > this.slides.length - this.cardsPerView) {
          this.currentIndex = 0;
          this.moveSlides(true);
        }
      }, this.animationDuration);
    }

    console.log({
      slideWidthPercent,
      gapPercent,
      offset,
      currentIndex: this.currentIndex,
      containerWidth: this.slidesContainer.offsetWidth,
    });
  }

  // Метод для удаления слайда. Если слайд единственный, то он не удаляется
  removeSlide(id) {
    if (this.slides.length > 1) {
      this.slides = this.slides.filter((user) => user.id !== id);
      this.renderSlides();
      if (this.currentIndex > this.slides.length - this.cardsPerView) {
        this.currentIndex = Math.max(0, this.slides.length - this.cardsPerView);
      }
      this.moveSlides();
    }
  }
}
