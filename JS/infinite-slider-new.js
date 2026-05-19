// منزلق المنتجات - نسخة حلقة مستمرة
class InfiniteSlider {
    constructor(options = {}) {
        this.slider = document.getElementById(options.sliderId);
        this.prevBtn = document.getElementById(options.prevBtnId);
        this.nextBtn = document.getElementById(options.nextBtnId);
        this.indicatorsContainer = document.getElementById(options.indicatorsId);
        this.productsUrl = options.productsUrl || 'products.json';
        this.categoryFilter = options.categoryFilter || null;
        this.productsCount = options.productsCount || 10;

        this.itemsPerView = options.itemsPerView || 4;
        this.itemsToScroll = options.itemsToScroll || 1;
        this.animationDuration = options.animationDuration || 500;
        this.autoPlay = options.autoPlay !== false;
        this.autoPlayInterval = options.autoPlayInterval || 7000;

        this.currentIndex = 0;
        this.products = [];
        this.originalProducts = []; // حفظ المنتجات الأصلية
        this.autoPlayTimer = null;
        this.isTransitioning = false;

        this.init();
    }

    async init() {
        try {
            const response = await fetch(this.productsUrl);
            let allProducts = await response.json();

            if (this.categoryFilter) {
                this.originalProducts = allProducts.filter(p => p.catetory === this.categoryFilter).slice(0, this.productsCount);
            } else {
                this.originalProducts = allProducts.slice(0, this.productsCount);
            }

            if (this.originalProducts.length === 0) {
                console.warn('لم يتم العثور على منتجات');
                return;
            }

            // تكرار المنتجات لإنشاء حلقة سلسة
            this.repeatProducts();

            // بدء الحلقة من المنتج الأول
            this.currentIndex = this.originalProducts.length;

            this.render();
            this.attachEventListeners();

            if (this.autoPlay) {
                this.startAutoPlay();
            }
        } catch (error) {
            console.error('خطأ في تحميل المنتجات:', error);
        }
    }

    repeatProducts() {
        // تكرار المنتجات 3 مرات (الأصلي + نسختين إضافيتين)
        this.products = [
            ...this.originalProducts,
            ...this.originalProducts,
            ...this.originalProducts
        ];
    }

    render() {
        this.slider.innerHTML = '';

        this.products.forEach((product) => {
            const productItem = this.createProductElement(product);
            this.slider.appendChild(productItem);
        });

        this.renderIndicators();
        this.updateSliderPosition();
    }

    createProductElement(product) {
        const div = document.createElement('div');
        div.className = 'product-item';

        const discount = product.old_price ? Math.round(((product.old_price - product.price) / product.old_price) * 100) : 0;

        div.innerHTML = `
            <div class="product-image">
                <img src="${product.img}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo Image%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="product-info">
                <h3 class="product-name" style="cursor: pointer; user-select: none;">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${product.price} DA</span>
                    ${product.old_price ? `<span class="old-price">${product.old_price} DA</span>` : ''}
                    ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                </div>
            </div>
        `;

        div.addEventListener('click', () => this.onProductClick(product));

        const productName = div.querySelector('.product-name');
        productName.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onProductNameClick(product);
        });

        return div;
    }

    renderIndicators() {
        // تم إزالة النقاط المؤشرات
        return;
    }

    updateSliderPosition() {
        const itemWidth = 100 / this.itemsPerView;
        const offset = -(this.currentIndex * itemWidth);
        this.slider.style.transform = `translateX(${offset}%)`;
        this.slider.style.transition = `transform ${this.animationDuration}ms ease-in-out`;
    }

    attachEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.stopAutoPlay();
                this.slide('prev');
                // إعادة تشغيل التشغيل التلقائي بعد 7 ثوانٍ
                setTimeout(() => {
                    if (this.autoPlay) this.startAutoPlay();
                }, this.autoPlayInterval);
            });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.stopAutoPlay();
                this.slide('next');
                // إعادة تشغيل التشغيل التلقائي بعد 7 ثوانٍ
                setTimeout(() => {
                    if (this.autoPlay) this.startAutoPlay();
                }, this.autoPlayInterval);
            });
        }

        if (this.slider) {
            this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.slider.addEventListener('mouseleave', () => {
                if (this.autoPlay) this.startAutoPlay();
            });
        }

        // إضافة حدث لإنهاء الانتقال
        this.slider.addEventListener('transitionend', () => {
            this.isTransitioning = false;
        });
    }

    slide(direction) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const originalCount = this.originalProducts.length;
        const startIndex = originalCount;
        const endIndex = originalCount * 2;

        if (direction === 'next') {
            this.currentIndex++;
            // عند الوصول للنهاية، عد للبداية بشكل سلس
            if (this.currentIndex >= endIndex) {
                setTimeout(() => {
                    this.slider.style.transition = 'none';
                    this.currentIndex = startIndex;
                    this.updateSliderPosition();
                    setTimeout(() => {
                        this.slider.style.transition = `transform ${this.animationDuration}ms ease-in-out`;
                        this.isTransitioning = false;
                    }, 50);
                }, this.animationDuration);
            } else {
                setTimeout(() => {
                    this.isTransitioning = false;
                }, this.animationDuration);
            }
        } else if (direction === 'prev') {
            this.currentIndex--;
            // عند الوصول للبداية، عد للنهاية بشكل سلس
            if (this.currentIndex < startIndex) {
                setTimeout(() => {
                    this.slider.style.transition = 'none';
                    this.currentIndex = endIndex - 1;
                    this.updateSliderPosition();
                    setTimeout(() => {
                        this.slider.style.transition = `transform ${this.animationDuration}ms ease-in-out`;
                        this.isTransitioning = false;
                    }, 50);
                }, this.animationDuration);
            } else {
                setTimeout(() => {
                    this.isTransitioning = false;
                }, this.animationDuration);
            }
        }

        this.updateSliderPosition();

        // إيقاف التشغيل التلقائي عند التفاعل اليدوي
        if (this.autoPlay) {
            this.stopAutoPlay();
            // إعادة تشغيل التشغيل التلقائي بعد 7 ثوانٍ
            setTimeout(() => {
                if (this.autoPlay) this.startAutoPlay();
            }, this.autoPlayInterval);
        }
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.slide('next');
        }, this.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    onProductClick(product) {
        // يمكن إضافة منطق هنا للتعامل مع النقر على المنتج
        console.log('تم النقر على المنتج:', product.name);
    }

    onProductNameClick(product) {
        // يمكن إضافة منطق هنا للتعامل مع النقر على اسم المنتج
        console.log('تم النقر على اسم المنتج:', product.name);
    }
}
