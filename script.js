document.addEventListener('DOMContentLoaded', function() {
  // حركة ظهور المنتجات بانسيابية
  const cards = document.querySelectorAll('.product-card, .related-product-card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.animationDelay = (i * 0.12) + 's';
      card.classList.add('visible');
    }, 100);
  });

  // سلة التسوق الجانبية
  const cartIcon = document.getElementById('cartIcon');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartSidebarOverlay = document.getElementById('cartSidebarOverlay');
  const closeCart = document.getElementById('closeCart');

  function openCartSidebar() {
    cartSidebar.classList.add('open');
    cartSidebarOverlay.classList.add('open');
  }
  function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    cartSidebarOverlay.classList.remove('open');
  }
  cartIcon.addEventListener('click', openCartSidebar);
  closeCart.addEventListener('click', closeCartSidebar);
  cartSidebarOverlay.addEventListener('click', closeCartSidebar);

  // منطق السلة
  let cart = [];
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  function updateCartUI() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <div class="cart-item-info">
          <img src="${item.img}" alt="${item.title}" class="cart-item-img">
          <div>
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">$${item.price} × </div>
            <input type="number" min="1" value="${item.qty}" class="cart-item-qty" data-id="${item.id}">
          </div>
        </div>
        <button class="remove-cart-item" data-id="${item.id}">&times;</button>
      `;
      cartItems.appendChild(itemDiv);
      total += item.price * item.qty;
    });
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    if (cart.length === 0) {
      cartItems.innerHTML = '<div style="text-align:center;color:#888;">سلة التسوق فارغة</div>';
      cartTotal.textContent = '$0.00';
    }
  }

  // إضافة منتج للسلة
  function addToCart(product) {
    const found = cart.find(item => item.id === product.id);
    if (found) {
      found.qty += product.qty;
    } else {
      cart.push(product);
    }
    updateCartUI();
  }

  // تفعيل زر "أضف إلى السلة" لأي منتج أو ملحق باستخدام التفويض

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      let card = e.target.closest('.product-card, .related-product-card, .offer-card');
      if (!card) return;
      const name = e.target.getAttribute('data-name');
      const price = parseFloat(e.target.getAttribute('data-price'));
      const img = e.target.getAttribute('data-img');
      let id = name;
      let qty = 1;
      addToCart({ id, title: name, price, img, qty });
      showCartSuccessAlert();
    }
  });

  // تعديل الكمية من السلة
  cartItems.addEventListener('input', function(e) {
    if (e.target.classList.contains('cart-item-qty')) {
      const id = e.target.getAttribute('data-id');
      const qty = parseInt(e.target.value) || 1;
      const item = cart.find(i => i.id === id);
      if (item) {
        item.qty = qty;
        updateCartUI();
      }
    }
  });
  // حذف منتج من السلة
  cartItems.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-cart-item')) {
      const id = e.target.getAttribute('data-id');
      cart = cart.filter(i => i.id !== id);
      updateCartUI();
    }
  });

  // تنبيه عند إضافة منتج للسلة
  function showCartSuccessAlert() {
    const alert = document.getElementById('cartSuccessAlert');
    alert.style.display = 'block';
    setTimeout(() => { alert.style.display = 'none'; }, 1800);
  }
  // نافذة الدفع الوهمية
  const paymentModal = document.getElementById('paymentModal');
  const paymentModalOverlay = document.getElementById('paymentModalOverlay');
  const closePaymentModal = document.getElementById('closePaymentModal');
  const checkoutBtn = document.querySelector('.checkout-btn');
  const paymentForm = document.getElementById('paymentForm');
  const paymentSuccess = document.getElementById('paymentSuccess');
  const cardFields = document.getElementById('cardFields');
  const paymentMethod = document.getElementById('paymentMethod');
  function openPaymentModal() {
    paymentModal.classList.add('open');
    paymentModalOverlay.classList.add('open');
  }
  function closePaymentModalFn() {
    paymentModal.classList.remove('open');
    paymentModalOverlay.classList.remove('open');
    paymentSuccess.style.display = 'none';
    paymentForm.style.display = 'block';
  }
  if (checkoutBtn) checkoutBtn.addEventListener('click', openPaymentModal);
  if (closePaymentModal) closePaymentModal.addEventListener('click', closePaymentModalFn);
  paymentModalOverlay.addEventListener('click', closePaymentModalFn);
  paymentMethod.addEventListener('change', function() {
    if (paymentMethod.value === 'paypal' || paymentMethod.value === 'applepay') {
      cardFields.style.display = 'none';
    } else {
      cardFields.style.display = 'block';
    }
  });
  paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    paymentForm.style.display = 'none';
    paymentSuccess.style.display = 'block';
    setTimeout(closePaymentModalFn, 2000);
  });
}); 