const navbar = document.querySelector('.navbar');
const searchForm = document.querySelector('.search-form');
const cartItem = document.querySelector('.cart-items-container');
const menuBtn = document.querySelector('#menu-btn');
const searchBtn = document.querySelector('#search-btn');
const cartBtn = document.querySelector('#cart-btn');
const cartKey = 'coffeeShopCart';

const getCart = () => JSON.parse(localStorage.getItem(cartKey)) || [];
const saveCart = (cart) => localStorage.setItem(cartKey, JSON.stringify(cart));

const formatPrice = (price) => `$${price.toFixed(2)}`;

const closePanels = () => {
    navbar?.classList.remove('active');
    searchForm?.classList.remove('active');
    cartItem?.classList.remove('active');
};

menuBtn?.addEventListener('click', () => {
    navbar?.classList.toggle('active');
    searchForm?.classList.remove('active');
    cartItem?.classList.remove('active');
});

searchBtn?.addEventListener('click', () => {
    searchForm?.classList.toggle('active');
    navbar?.classList.remove('active');
    cartItem?.classList.remove('active');
});

cartBtn?.addEventListener('click', () => {
    cartItem?.classList.toggle('active');
    navbar?.classList.remove('active');
    searchForm?.classList.remove('active');
});

window.addEventListener('scroll', closePanels);

document.addEventListener('click', (event) => {
    const isClickInsideNavbar = navbar?.contains(event.target) || event.target.id === 'menu-btn';
    const isClickInsideSearch = searchForm?.contains(event.target) || event.target.id === 'search-btn';
    const isClickInsideCart = cartItem?.contains(event.target) || event.target.id === 'cart-btn';

    if (!isClickInsideNavbar && !isClickInsideSearch && !isClickInsideCart) {
        closePanels();
    }
});

const renderCartPreview = () => {
    if (!cartItem) return;

    const cart = getCart();

    if (!cart.length) {
        cartItem.innerHTML = `
            <p class="empty-cart">your cart is empty</p>
            <a href="menu.html" class="btn">shop now</a>
        `;
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartItem.innerHTML = cart.map((item) => `
        <div class="cart-item">
            <button class="fas fa-times remove-cart-item" data-id="${item.id}" aria-label="remove item"></button>
            <img src="${item.image}" alt="">
            <div class="content">
                <h3>${item.name}</h3>
                <div class="price">${formatPrice(item.price)} x ${item.quantity}</div>
            </div>
        </div>
    `).join('') + `
        <div class="cart-total">total: <span>${formatPrice(total)}</span></div>
        <a href="checkout.html" class="btn">checkout now</a>
    `;
};

const addToCart = (card) => {
    const image = card.querySelector('img')?.getAttribute('src') || 'imges/logo.png';
    const name = card.querySelector('h3')?.textContent.trim() || 'coffee item';
    const priceText = card.querySelector('.price')?.childNodes[0]?.textContent || '$15.99';
    const price = Number(priceText.replace(/[^0-9.]/g, '')) || 15.99;
    const id = `${name}-${image}`.toLowerCase().replace(/\s+/g, '-');
    const cart = getCart();
    const existing = cart.find((item) => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, image, price, quantity: 1 });
    }

    saveCart(cart);
    renderCartPreview();
    cartItem?.classList.add('active');
};

document.querySelectorAll('.menu .box .btn, .products .box .fa-shopping-cart').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const card = button.closest('.box');
        if (card) addToCart(card);
    });
});

document.addEventListener('click', (event) => {
    const removeButton = event.target.closest('.remove-cart-item');
    if (!removeButton) return;

    const cart = getCart().filter((item) => item.id !== removeButton.dataset.id);
    saveCart(cart);
    renderCartPreview();
    renderCheckout();
});

const renderCheckout = () => {
    const checkoutItems = document.querySelector('#checkout-items');
    const checkoutSummary = document.querySelector('#checkout-summary');
    if (!checkoutItems || !checkoutSummary) return;

    const cart = getCart();

    if (!cart.length) {
        checkoutItems.innerHTML = '<p class="empty-order">no orders yet. add your favorite coffee first.</p>';
        checkoutSummary.innerHTML = `
            <h3>order summary</h3>
            <p>subtotal <span>$0.00</span></p>
            <p>delivery <span>$0.00</span></p>
            <div class="summary-total">total <span>$0.00</span></div>
            <a href="menu.html" class="btn">back to menu</a>
        `;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = 2.50;
    const total = subtotal + delivery;

    checkoutItems.innerHTML = cart.map((item) => `
        <div class="order-item">
            <img src="${item.image}" alt="">
            <div>
                <h3>${item.name}</h3>
                <p>${formatPrice(item.price)} x ${item.quantity}</p>
            </div>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
    `).join('');

    checkoutSummary.innerHTML = `
        <h3>order summary</h3>
        <p>subtotal <span>${formatPrice(subtotal)}</span></p>
        <p>delivery <span>${formatPrice(delivery)}</span></p>
        <div class="summary-total">total <span>${formatPrice(total)}</span></div>
        <button class="btn place-order" type="button">place order</button>
    `;
};

document.addEventListener('click', (event) => {
    if (!event.target.matches('.place-order')) return;

    localStorage.removeItem(cartKey);
    renderCartPreview();
    renderCheckout();
    alert('your order has been placed successfully');
});

renderCartPreview();
renderCheckout();
