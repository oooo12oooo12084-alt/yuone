// منزلق المنتجات - النسخة الجديدة مع دعم الحلقة والفئات
class ProductSlider {
    constructor(options = {}) {
        this.slider = document.getElementById(options.sliderId);
        this.prevBtn = document.getElementById(options.prevBtnId);
        this.nextBtn = document.getElementById(options.nextBtnId);
        this.indicatorsContainer = document.getElementById(options.indicatorsId);
        this.productsUrl = options.productsUrl || 'products.json';
        this.categoryFilter = options.categoryFilter || null;
        this.productsCount = options.productsCount || 10;
        
        this.itemsPerView = options.itemsPerView || 10;
        this.itemsToScroll = options.itemsToScroll || 1;
        this.animationDuration = options.animationDuration || 500;
        this.autoPlay = options.autoPlay !== false;
        this.autoPlayInterval = options.autoPlayInterval || 10000;
        
        this.currentIndex = 0;
        this.products = [];
        this.autoPlayTimer = null;
        
        this.init();
    }

    async init() {
        try {
            const response = await fetch(this.productsUrl);
            let allProducts = await response.json();
            
            if (this.categoryFilter) {
                this.products = allProducts.filter(p => p.catetory === this.categoryFilter).slice(0, this.productsCount);
            } else {
                this.products = allProducts.slice(0, this.productsCount);
            }
            
            if (this.products.length === 0) {
                console.warn('لم يتم العثور على منتجات');
                return;
            }
            
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
                    <span class="current-price">$${product.price}</span>
                    ${product.old_price ? `<span class="old-price">$${product.old_price}</span>` : ''}
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
        this.indicatorsContainer.innerHTML = '';
        const totalSlides = this.products.length;
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator' + (i === this.currentIndex ? ' active' : '');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    updateSliderPosition() {
        const itemWidth = 100 / this.products.length;
        const offset = -(this.currentIndex * itemWidth);
        this.slider.style.transform = `translateX(${offset}%)`;
        this.slider.style.transition = `transform ${this.animationDuration}ms ease-in-out`;
        
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === this.currentIndex);
        });
    }

    attachEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.slide('prev'));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.slide('next'));
        }
        
        if (this.slider) {
            this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.slider.addEventListener('mouseleave', () => {
                if (this.autoPlay) this.startAutoPlay();
            });
        }
    }

    slide(direction) {
        const totalSlides = this.products.length;
        
        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % totalSlides;
        } else if (direction === 'prev') {
            this.currentIndex = (this.currentIndex - 1 + totalSlides) % totalSlides;
        }
        
        this.updateSliderPosition();
        
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

// تشغيل جميع المنزلقات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // أفضل المنتجات (مختلطة)
    new ProductSlider({
        sliderId: 'bestProductsSlider',
        prevBtnId: 'bestProductsPrevBtn',
        nextBtnId: 'bestProductsNextBtn',
        indicatorsId: 'bestProductsIndicators',
        productsUrl: 'products.json',
        categoryFilter: null,
        productsCount: 10,
        itemsPerView: 4,
        itemsToScroll: 1,
        autoPlay: true,
        autoPlayInterval: 10000
    });
    
    // GPU
    new ProductSlider({
        sliderId: 'gpuSlider',
        prevBtnId: 'gpuPrevBtn',
        nextBtnId: 'gpuNextBtn',
        indicatorsId: 'gpuIndicators',
        productsUrl: 'products.json',
        categoryFilter: 'gpu',
        productsCount: 10,
        itemsPerView: 4,
        itemsToScroll: 1,
        autoPlay: true,
        autoPlayInterval: 10000
    });
    
    // CPU
    new ProductSlider({
        sliderId: 'cpuSlider',
        prevBtnId: 'cpuPrevBtn',
        nextBtnId: 'cpuNextBtn',
        indicatorsId: 'cpuIndicators',
        productsUrl: 'products.json',
        categoryFilter: 'cpu',
        productsCount: 10,
        itemsPerView: 4,
        itemsToScroll: 1,
        autoPlay: true,
        autoPlayInterval: 10000
    });
    
    // MOUSE
    new ProductSlider({
        sliderId: 'mouseSlider',
        prevBtnId: 'mousePrevBtn',
        nextBtnId: 'mouseNextBtn',
        indicatorsId: 'mouseIndicators',
        productsUrl: 'products.json',
        categoryFilter: 'mouse',
        productsCount: 10,
        itemsPerView: 4,
        itemsToScroll: 1,
        autoPlay: true,
        autoPlayInterval: 10000
    });
    
    // RAM
    new ProductSlider({
        sliderId: 'ramSlider',
        prevBtnId: 'ramPrevBtn',
        nextBtnId: 'ramNextBtn',
        indicatorsId: 'ramIndicators',
        productsUrl: 'products.json',
        categoryFilter: 'ram',
        productsCount: 10,
        itemsPerView: 4,
        itemsToScroll: 1,
        autoPlay: true,
        autoPlayInterval: 10000
    });
});
