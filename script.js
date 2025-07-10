// متغيرات عامة
let cart = [];
let cartTotal = 0;
let currentView = 'grid';

// تهيئة الموقع
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    loadCartFromStorage();
    updateCartDisplay();
    animateStats();
    setupSearch();
    setupFilters();
    setupScrollEffects();
});

// تهيئة الموقع
function initializeWebsite() {
    console.log('GamerZone متجر إلكتروني عالمي - تم التحميل بنجاح');
    
    // إضافة تأثيرات التحميل
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('visible');
    });
}

// إعداد البحث
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// تنفيذ البحث
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    
    if (searchTerm === '') {
        productCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
        });
        return;
    }
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productFeatures = card.querySelector('.features').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productFeatures.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
    
    // إظهار رسالة إذا لم يتم العثور على نتائج
    showSearchResults(searchTerm);
}

// إظهار نتائج البحث
function showSearchResults(searchTerm) {
    const visibleProducts = document.querySelectorAll('.product-card[style*="display: block"]');
    
    if (visibleProducts.length === 0) {
        showNotification(`لم يتم العثور على منتجات تحتوي على "${searchTerm}"`, 'warning');
    } else {
        showNotification(`تم العثور على ${visibleProducts.length} منتج`, 'success');
    }
}

// إعداد الفلاتر
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
}

// فلترة المنتجات
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        let showCard = true;
        
        // فلترة حسب الفئة
        if (categoryFilter) {
            const cardCategory = getProductCategory(card);
            if (cardCategory !== categoryFilter) {
                showCard = false;
            }
        }
        
        // فلترة حسب السعر
        if (showCard && priceFilter) {
            const price = getProductPrice(card);
            if (!isPriceInRange(price, priceFilter)) {
                showCard = false;
            }
        }
        
        card.style.display = showCard ? 'block' : 'none';
    });
}

// الحصول على فئة المنتج
function getProductCategory(card) {
    const section = card.closest('section');
    if (section.id === 'phones') return 'phones';
    if (section.id === 'laptops') return 'laptops';
    if (section.id === 'headphones') return 'headphones';
    if (section.id === 'watches') return 'watches';
    if (section.id === 'accessories-global') return 'accessories';
    if (section.id === 'gaming') return 'gaming';
    if (section.id === 'monitors') return 'monitors';
    if (section.id === 'cameras') return 'cameras';
    return '';
}

// الحصول على سعر المنتج
function getProductPrice(card) {
    const priceElement = card.querySelector('.price');
    if (priceElement) {
        return parseInt(priceElement.textContent.replace('$', ''));
    }
    return 0;
}

// التحقق من نطاق السعر
function isPriceInRange(price, range) {
    switch (range) {
        case '0-100': return price <= 100;
        case '100-500': return price > 100 && price <= 500;
        case '500-1000': return price > 500 && price <= 1000;
        case '1000+': return price > 1000;
        default: return true;
    }
}

// ترتيب المنتجات
function sortProducts() {
    const sortType = document.getElementById('sortFilter').value;
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    
    productCards.sort((a, b) => {
        switch (sortType) {
            case 'price-low':
                return getProductPrice(a) - getProductPrice(b);
            case 'price-high':
                return getProductPrice(b) - getProductPrice(a);
            case 'name':
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent, 'ar');
            case 'popularity':
                return Math.random() - 0.5; // ترتيب عشوائي للشعبية
            default:
                return 0;
        }
    });
    
    // إعادة ترتيب العناصر في DOM
    const container = productCards[0].parentElement;
    productCards.forEach(card => container.appendChild(card));
}

// تغيير طريقة العرض
function changeView(viewType) {
    currentView = viewType;
    const productGrids = document.querySelectorAll('.products-grid');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.view-btn').classList.add('active');
    
    productGrids.forEach(grid => {
        if (viewType === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }
    });
}

// تحريك الإحصائيات
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseFloat(target.getAttribute('data-target'));
                animateNumber(target, targetValue);
                observer.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// تحريك الأرقام
function animateNumber(element, targetValue) {
    let currentValue = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = currentValue.toFixed(1);
    }, 50);
}

// إعداد تأثيرات التمرير
function setupScrollEffects() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => observer.observe(section));
}

// التمرير إلى قسم معين
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// إظهار إشعار
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار تلقائياً بعد 5 ثوان
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// الحصول على أيقونة الإشعار
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// تحسين سلة التسوق
function addToCart(name, price, img) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            img: img,
            quantity: 1
        });
    }
    
    cartTotal += price;
    updateCartDisplay();
    saveCartToStorage();
    
    // إظهار رسالة نجاح
    showNotification(`تم إضافة ${name} إلى السلة`, 'success');
    
    // تأثير بصري على السلة
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

// تحديث عرض السلة
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total span');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    if (cartItems) {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div>
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price}</div>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="updateItemQuantity('${item.name}', this.value)" 
                           class="cart-item-qty">
                    <button onclick="removeFromCart('${item.name}')" class="remove-cart-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${cartTotal}`;
    }
}

// تحديث كمية المنتج
function updateItemQuantity(name, newQuantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        const oldQuantity = item.quantity;
        item.quantity = parseInt(newQuantity);
        cartTotal += (item.quantity - oldQuantity) * item.price;
        updateCartDisplay();
        saveCartToStorage();
    }
}

// إزالة من السلة
function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        cartTotal -= item.price * item.quantity;
        cart.splice(itemIndex, 1);
        updateCartDisplay();
        saveCartToStorage();
        showNotification(`تم إزالة ${name} من السلة`, 'info');
    }
}

// حفظ السلة في التخزين المحلي
function saveCartToStorage() {
    localStorage.setItem('gamerzone-cart', JSON.stringify(cart));
    localStorage.setItem('gamerzone-total', cartTotal.toString());
}

// تحميل السلة من التخزين المحلي
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('gamerzone-cart');
    const savedTotal = localStorage.getItem('gamerzone-total');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (savedTotal) {
        cartTotal = parseFloat(savedTotal);
    }
}

// تبديل عرض السلة
function toggleCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-sidebar-overlay');
    
    if (cartSidebar && overlay) {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('open');
        
        if (cartSidebar.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
}

// إغلاق السلة
function closeCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-sidebar-overlay');
    
    if (cartSidebar && overlay) {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// إتمام الشراء
function checkout() {
    if (cart.length === 0) {
        showNotification('السلة فارغة! أضف منتجات أولاً', 'warning');
        return;
    }
    
    // هنا يمكن إضافة منطق إتمام الشراء
    showPaymentModal();
}

// إظهار نافذة الدفع
function showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const overlay = document.querySelector('.payment-modal-overlay');
    
    if (modal && overlay) {
        modal.classList.add('open');
        overlay.classList.add('open');
    }
}

// إغلاق نافذة الدفع
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    const overlay = document.querySelector('.payment-modal-overlay');
    
    if (modal && overlay) {
        modal.classList.remove('open');
        overlay.classList.remove('open');
    }
}

// معالجة الدفع
function processPayment() {
    const form = document.getElementById('paymentForm');
    const formData = new FormData(form);
    
    // محاكاة معالجة الدفع
    showNotification('جاري معالجة الدفع...', 'info');
    
    setTimeout(() => {
        showNotification('تم الدفع بنجاح! شكراً لك', 'success');
        closePaymentModal();
        
        // تفريغ السلة
        cart = [];
        cartTotal = 0;
        updateCartDisplay();
        saveCartToStorage();
        
        // إظهار رسالة نجاح
        showSuccessMessage();
    }, 2000);
}

// إظهار رسالة النجاح
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>تم الطلب بنجاح!</h3>
            <p>سيتم التواصل معك قريباً لتأكيد الطلب</p>
            <button onclick="this.parentElement.parentElement.remove()">حسناً</button>
        </div>
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        if (successMessage.parentElement) {
            successMessage.remove();
        }
    }, 5000);
}

// إضافة مستمعي الأحداث للمنتجات
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const name = e.target.getAttribute('data-name');
        const price = parseInt(e.target.getAttribute('data-price'));
        const img = e.target.getAttribute('data-img');
        addToCart(name, price, img);
    }
});

// إغلاق النوافذ عند النقر خارجها
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cart-sidebar-overlay')) {
        closeCart();
    }
    if (e.target.classList.contains('payment-modal-overlay')) {
        closePaymentModal();
    }
});

// تحسين الأداء - إضافة lazy loading للصور
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// تحسين SEO - إضافة structured data
function addStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": "GamerZone",
        "description": "متجر إلكتروني عالمي للأجهزة الإلكترونية والألعاب",
        "url": window.location.href,
        "telephone": "+966-50-123-4567",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "SA"
        },
        "priceRange": "$$",
        "paymentAccepted": ["Cash", "Credit Card", "PayPal"],
        "currenciesAccepted": "USD"
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// تهيئة الميزات الإضافية
document.addEventListener('DOMContentLoaded', function() {
    setupLazyLoading();
    addStructuredData();
}); 