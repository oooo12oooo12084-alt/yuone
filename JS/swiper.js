document.addEventListener('DOMContentLoaded', function() {
  // Hero Slider
  const heroSwiper = new Swiper('.swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    speed: 1000,
    effect: 'slide',
  });

  // Product Slider
  const productSwiper = new Swiper('.slide_product', {
    slidesPerView: 4,
    slidesPerGroup: 1,
    loop: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
    speed: 1000,
    effect: 'slide',
    centeredSlides: false,
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
});
