// منزلق المنتجات - النسخة الجديدة
class ProductSlider {
    constructor(options = {}) {
        this.slider = document.getElementById(options.sliderId || 'productSlider');
        this.prevBtn = document.getElementById(options.prevBtnId || 'prevBtn');
        this.nextBtn = document.getElementById(options.nextBtnId || 'nextBtn');
        this.indicatorsContainer = document.getElementById(options.indicatorsId || 'indicators');
        this.productsUrl = options.productsUrl || 'products.json';
        
        this.itemsPerView = options.itemsPerView || 10;
        this.itemsToScroll = options.itemsToScroll || 1;  // تحريك منتج واحد فقط
        this.animationDuration = options.animationDuration || 500;
        this.autoPlay = options.autoPlay || true;
        this.autoPlayInterval = options.autoPlayInterval || 10000;  // 10 ثوانٍ
        
        this.currentIndex = 0;
        this.products = [];
        this.autoPlayTimer = null;
        
        this.init();
    }

    async init() {
        try {
            // تحميل المنتجات
            const response = await fetch(this.productsUrl);
            const allProducts = await response.json();
            
            // أخذ أول 10 منتجات
            this.products = allProducts.slice(0, 10);
            
            this.render();
            this.attachEventListeners();
            
            if (this.autoPlay) {
                this.startAutoPlay();
            }
        } catch (error) {
            console.error('خطأ في تحميل المنتجات:', error);
        }
    }

    render() {
        // مسح المنزلق
        this.slider.innerHTML = '';
        
        // إضافة المنتجات
        this.products.forEach((product, index) => {
            const productItem = this.createProductElement(product);
            this.slider.appendChild(productItem);
        });
        
        // إضافة المؤشرات
        this.renderIndicators();
        
        // تحديث موضع المنزلق
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
                    <span class="current-price">$${product.price}</span>
                    ${product.old_price ? `<span class="old-price">$${product.old_price}</span>` : ''}
                    ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                </div>
            </div>
        `;
        
        // إضافة حدث الضغط على المنتج
        div.addEventListener('click', () => this.onProductClick(product));
        
        // إضافة حدث خاص للضغط على اسم المنتج
        const productName = div.querySelector('.product-name');
        productName.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onProductNameClick(product);
        });
        
        return div;
    }

    renderIndicators() {
        this.indicatorsContainer.innerHTML = '';
        const totalSlides = Math.ceil(this.products.length / this.itemsPerView);
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator' + (i === this.currentIndex ? ' active' : '');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    updateSliderPosition() {
        const itemWidth = 100 / this.itemsPerView;
        const offset = -(this.currentIndex * itemWidth * this.itemsPerView);
        this.slider.style.transform = `translateX(${offset}%)`;
        
        // تحديث المؤشرات
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === this.currentIndex);
        });
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.slide('prev'));
        this.nextBtn.addEventListener('click', () => this.slide('next'));
        
        // إيقاف التشغيل التلقائي عند التفاعل اليدوي
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => {
            if (this.autoPlay) this.startAutoPlay();
        });
    }

    slide(direction) {
        const totalSlides = Math.ceil(this.products.length / this.itemsPerView);
        
        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + this.itemsToScroll) % totalSlides;
        } else if (direction === 'prev') {
            this.currentIndex = (this.currentIndex - this.itemsToScroll + totalSlides) % totalSlides;
        }
        
        this.updateSliderPosition();
        
        // إعادة تشغيل التشغيل التلقائي
        if (this.autoPlay) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSliderPosition();
        
        if (this.autoPlay) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    startAutoPlay() {
        if (this.autoPlayTimer) return;
        
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
        console.log('تم الضغط على المنتج:', product);
    }

    onProductNameClick(product) {
        console.log('تم الضغط على اسم المنتج:', product.name);
    }
}

// تشغيل المنزلق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new ProductSlider({
        sliderId: 'productSlider',
        prevBtnId: 'prevBtn',
        nextBtnId: 'nextBtn',
        indicatorsId: 'indicators',
        productsUrl: 'products.json',
        itemsPerView: 10,
        itemsToScroll: 1,  // تحريك منتج واحد فقط
        autoPlay: true,
        autoPlayInterval: 10000  // 10 ثوانٍ
    });
});
