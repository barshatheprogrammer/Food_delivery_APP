document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Toggle Cart Sidebar
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Add to cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const img = btn.getAttribute('data-img');

            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }

            saveAndRenderCart();
            if (typeof showToast === 'function') {
                showToast(`${name} added to cart!`, 'success');
            }
        });
    });

    // Update Cart UI
    function saveAndRenderCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update Count
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        if (cartCount) cartCount.textContent = totalItems;

        // Update Total
        const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        if (cartTotalPrice) cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;

        // Render Items
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty</div>';
            } else {
                let html = '';
                cart.forEach(item => {
                    html += `
                        <div class="cart-item" style="display: flex; gap: 10px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                            <img src="${item.img}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                            <div class="cart-item-info" style="flex: 1;">
                                <h4 style="margin: 0 0 5px 0; font-size: 14px;">${item.name}</h4>
                                <span class="price" style="color: var(--primary-color); font-weight: 600;">$${item.price.toFixed(2)}</span>
                                <div class="quantity-controls" style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                                    <button class="qty-btn minus" data-id="${item.id}" style="width: 25px; height: 25px; border: 1px solid #ddd; background: #fff; cursor: pointer;">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="qty-btn plus" data-id="${item.id}" style="width: 25px; height: 25px; border: 1px solid #ddd; background: #fff; cursor: pointer;">+</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                cartItemsContainer.innerHTML = html;
            }
        }
        
        attachQuantityListeners();
    }

    function attachQuantityListeners() {
        const minusBtns = document.querySelectorAll('.qty-btn.minus');
        const plusBtns = document.querySelectorAll('.qty-btn.plus');

        minusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                    saveAndRenderCart();
                }
            });
        });

        plusBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity += 1;
                    saveAndRenderCart();
                }
            });
        });
    }

    // Checkout Logic
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if (cart.length === 0) {
                if (typeof showToast === 'function') showToast('Cart is empty', 'error');
                return;
            }

            const activeUser = JSON.parse(localStorage.getItem('activeUser'));
            if (!activeUser) {
                if (typeof showToast === 'function') showToast('Please login to checkout', 'error');
                const authOverlay = document.getElementById('auth-overlay');
                if (authOverlay) authOverlay.classList.add('active');
                cartSidebar.classList.remove('active');
                return;
            }

            const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const orderData = {
                email: activeUser.email,
                items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
                total: totalPrice,
                date: new Date().toLocaleString()
            };

            try {
                const response = await fetch('http://127.0.0.1:5000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                const data = await response.json();
                
                if (data.success) {
                    cart = [];
                    saveAndRenderCart();
                    cartSidebar.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    if (typeof showToast === 'function') showToast('Order placed successfully!', 'success');
                } else {
                    if (typeof showToast === 'function') showToast(data.message, 'error');
                }
            } catch (err) {
                if (typeof showToast === 'function') showToast('Server connection failed', 'error');
            }
        });
    }

    // Initial render
    saveAndRenderCart();
});
