// 📝 أمثلة على كيفية تخصيص منطق الضغط على اسم المنتج

// ===================================
// المثال 1: عرض رسالة تنبيه
// ===================================
/*
onProductNameClick(product) {
    alert(`تم اختيار: ${product.name}\nالسعر: $${product.price}`);
}
*/

// ===================================
// المثال 2: الانتقال لصفحة التفاصيل
// ===================================
/*
onProductNameClick(product) {
    window.location.href = `/product-details.html?id=${product.id}`;
}
*/

// ===================================
// المثال 3: فتح نموذج (Modal)
// ===================================
/*
onProductNameClick(product) {
    // افترض أن لديك دالة showModal
    showProductModal(product);
}

function showProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${product.name}</h2>
            <img src="${product.img}" alt="${product.name}">
            <p>السعر: $${product.price}</p>
            <button class="add-to-cart">إضافة للسلة</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.close').onclick = () => modal.remove();
}
*/

// ===================================
// المثال 4: إضافة إلى السلة
// ===================================
/*
onProductNameClick(product) {
    const cart = getCart(); // دالة للحصول على السلة
    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
    });
    saveCart(cart);
    showNotification('تم إضافة المنتج إلى السلة');
}
*/

// ===================================
// المثال 5: عرض معلومات المنتج في الشريط الجانبي
// ===================================
/*
onProductNameClick(product) {
    const sidebar = document.getElementById('product-sidebar');
    sidebar.innerHTML = `
        <div class="sidebar-product">
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>السعر: $${product.price}</p>
            <p>الفئة: ${product.catetory}</p>
            <button onclick="addToCart(${product.id})">إضافة للسلة</button>
        </div>
    `;
}
*/

// ===================================
// المثال 6: تتبع المنتجات المشاهدة
// ===================================
/*
onProductNameClick(product) {
    // حفظ المنتج في localStorage
    let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
    
    // إزالة المنتج إذا كان موجوداً
    viewedProducts = viewedProducts.filter(p => p.id !== product.id);
    
    // إضافة المنتج إلى البداية
    viewedProducts.unshift(product);
    
    // الاحتفاظ بآخر 10 منتجات مشاهدة
    viewedProducts = viewedProducts.slice(0, 10);
    
    localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
    console.log('تم حفظ المنتج في السجل');
}
*/

// ===================================
// المثال 7: مشاركة المنتج
// ===================================
/*
onProductNameClick(product) {
    const message = `تحقق من هذا المنتج: ${product.name} - $${product.price}`;
    
    if (navigator.share) {
        navigator.share({
            title: product.name,
            text: message,
            url: window.location.href
        });
    } else {
        // نسخ الرابط للحافظة
        navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ الرابط');
    }
}
*/

// ===================================
// المثال 8: تحديث معلومات المنتج المختارة
// ===================================
/*
onProductNameClick(product) {
    // حفظ المنتج المختار حالياً
    window.currentProduct = product;
    
    // تحديث الواجهة
    updateProductDisplay(product);
    
    // تحديث الشرائط
    updateRelatedProducts(product.catetory);
}

function updateProductDisplay(product) {
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price}`;
    document.getElementById('product-image').src = product.img;
}
*/

// ===================================
// المثال 9: تقييم وتصويت
// ===================================
/*
onProductNameClick(product) {
    const rating = prompt('قيّم هذا المنتج من 1 إلى 5:');
    if (rating && rating >= 1 && rating <= 5) {
        sendRating(product.id, rating);
        alert('شكراً لتقييمك!');
    }
}

function sendRating(productId, rating) {
    // إرسال التقييم للخادم
    fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating })
    });
}
*/

// ===================================
// المثال 10: تسجيل الحدث التحليلي
// ===================================
/*
onProductNameClick(product) {
    // تسجيل للـ Google Analytics أو أي نظام تحليلي آخر
    if (window.gtag) {
        gtag('event', 'product_click', {
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            product_category: product.catetory
        });
    }
    
    // أو استخدام أي نظام آخر
    trackEvent('product_view', product);
}
*/

// ===================================
// المثال 11: دمج عدة وظائف معاً
// ===================================
/*
onProductNameClick(product) {
    // 1. تسجيل في السجل
    logProductView(product);
    
    // 2. إضافة إلى المقارنة
    addToComparison(product);
    
    // 3. تحديث الواجهة
    updateSidebar(product);
    
    // 4. إرسال إحصائيات
    trackEvent('product_name_clicked', product);
}
*/

// ===================================
// المثال 12: البحث عن منتجات مشابهة
// ===================================
/*
onProductNameClick(product) {
    // البحث عن منتجات من نفس الفئة
    const similarProducts = allProducts.filter(p => 
        p.catetory === product.catetory && p.id !== product.id
    );
    
    // عرض المنتجات المشابهة
    displaySimilarProducts(similarProducts);
}
*/

console.log('📝 أمثلة على التخصيص - قم بنسخ أي مثال واستخدمه في onProductNameClick');
