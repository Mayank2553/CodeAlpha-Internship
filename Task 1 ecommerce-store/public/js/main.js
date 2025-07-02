// Initialize cart
let cart = [];

// DOM Elements
const cartModal = document.getElementById('cart-modal');
const cartLink = document.getElementById('cart-link');
const closeBtn = document.querySelector('.close');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Event Listeners
cartLink.addEventListener('click', toggleCart);
closeBtn.addEventListener('click', toggleCart);
checkoutBtn.addEventListener('click', handleCheckout);

// Fetch products when page loads
window.addEventListener('load', fetchProducts);

// Functions
function toggleCart() {
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

function fetchProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => displayProducts(products))
        .catch(error => console.error('Error fetching products:', error));
}

function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price}</p>
            <button onclick="addToCart(${product._id})">Add to Cart</button>
        `;
        productsGrid.appendChild(productCard);
    });
}

async function addToCart(productId) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });
        const data = await response.json();
        if (response.ok) {
            cart.push(productId);
            updateCartDisplay();
        } else {
            throw new Error(data.message || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
    }
}

function updateCartDisplay() {
    // Update cart items display
    cartItems.innerHTML = cart.map(id => `
        <div class="cart-item">
            <span>Product ${id}</span>
            <button onclick="removeFromCart(${id})">Remove</button>
        </div>
    `).join('');

    // Update total (this would be calculated based on actual product prices)
    cartTotal.textContent = cart.length * 10; // Placeholder price
}

async function removeFromCart(productId) {
    try {
        const response = await fetch(`/api/cart/${productId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
            const index = cart.indexOf(productId);
            if (index > -1) {
                cart.splice(index, 1);
                updateCartDisplay();
            }
        } else {
            throw new Error(data.message || 'Failed to remove from cart');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        alert('Failed to remove item from cart. Please try again.');
    }
}

async function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cart })
        });
        const data = await response.json();
        
        if (response.ok) {
            alert('Thank you for your purchase!');
            cart = [];
            updateCartDisplay();
        } else {
            throw new Error(data.message || 'Checkout failed');
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Checkout failed. Please try again.');
    }
}
