// ================= CART INIT =================
let cart = JSON.parse(localStorage.getItem('NOWNEXT_CART')) || [];

// ================= ADD TO CART =================
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    updateFloatingCart();
}

// ================= SAVE CART =================
function saveCart() {
    localStorage.setItem('NOWNEXT_CART', JSON.stringify(cart));
}

// ================= FLOATING CART =================
function updateFloatingCart() {
    const cartBar = document.getElementById('floating-cart');
    const cartCount = document.getElementById('cart-count');

    if (!cartBar || !cartCount) return;

    if (cart.length > 0) {
        cartBar.style.display = 'flex';
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems + (totalItems === 1 ? ' Item' : ' Items');
    } else {
        cartBar.style.display = 'none';
    }
}

updateFloatingCart();

// ================= CART PAGE DISPLAY =================
function displayCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        container.innerHTML += `
            <div class="cart-item">
                <span>${item.name} (x${item.quantity})</span>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `;
    });
}

// ================= BILL =================
function updateBill() {
    const subtotalEl = document.getElementById('subtotal');
    if (!subtotalEl) return;

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryType = document.getElementById('deliveryType').value;
    const deliveryFee = deliveryType === 'instant' ? 30 : 20;

    const tax = 7;
    const platform = 3;
    const grandTotal = subtotal + deliveryFee + tax + platform;

    subtotalEl.innerText = '₹' + subtotal;
    document.getElementById('delivery-fee').innerText = '₹' + deliveryFee;
    document.getElementById('grand-total').innerText = '₹' + grandTotal;

    const minMsg = document.getElementById('min-order-msg');
    const confirmBtn = document.querySelector('.confirm-btn');

    if (subtotal < 100) {
        minMsg.style.display = 'block';
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.6';
    } else {
        minMsg.style.display = 'none';
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
    }
}

// ================= WHATSAPP =================
function sendToWhatsApp() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const college = document.getElementById('userCollege').value;
    const delType = document.getElementById('deliveryType').value;
    const slot = document.getElementById('deliverySlot').value;
    const payMethod = document.getElementById('paymentMethod').value;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const grandTotalText = document.getElementById('grand-total').innerText;
    const grandTotalValue = grandTotalText.replace('₹', '');

    // Validation
    if (subtotal < 100) {
        alert("Minimum order is ₹100!");
        return;
    }
    if (!name || !phone || !college) {
        alert("Please fill all details!");
        return;
    }

    // 1. FORMAT WHATSAPP MESSAGE
    let itemsList = cart.map(item => `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`).join('\n');
    let message = `🚀 *NEW NOWNEXT ORDER* 🚀\n\n`;
    message += `*Name:* ${name}\n*Phone:* ${phone}\n*College:* ${college}\n\n`;
    message += `*Items:*\n${itemsList}\n\n`;
    message += `*Delivery:* ${delType === 'instant' ? 'Instant (₹30)' : 'Slot: ' + slot + ' (₹20)'}\n`;
    message += `*Payment:* ${payMethod}\n`;
    message += `*Total Bill:* ${grandTotalText}\n\n`;
    message += `_Sent via NOWNEXT App_`;

    const whatsappNumber = "919889797536"; // Ensure your number is here
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // 2. UPI PAYMENT LOGIC
    if (payMethod === "Online Payment") {
        const upiId = "nonxt@ptyes";
        const payeeName = "NOWNEXT Delivery";
        const note = encodeURIComponent(`Order for ${name}`);
        
        // UPI Deep Link Format
        const upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${grandTotalValue}&cu=INR&tn=${note}`;

        // Strategy: Open UPI first, then redirect to WhatsApp
        window.location.href = upiUrl;
        
        // Short delay to allow the UPI app to trigger before shifting to WhatsApp
        setTimeout(() => {
            localStorage.removeItem('NOWNEXT_CART');
            window.location.href = whatsappUrl;
        }, 2000);
    } else {
        // COD Logic: Just open WhatsApp
        localStorage.removeItem('NOWNEXT_CART');
        window.location.href = whatsappUrl;
    }
}
function filterCategory(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        // Get the category from the 'data-category' attribute
        const productCat = product.getAttribute('data-category');
        
        // Use lowercase 'all' to match the function call
        if (category === 'all' || productCat === category) {
            product.style.display = 'flex'; // Shows the product
        } else {
            product.style.display = 'none'; // Hides the product
        }
    });
}

// Search Functionality
function searchProducts() {
    // 1. Get the text typed by the user and convert to lowercase
    let input = document.getElementById('searchInput').value.toLowerCase();
    
    // 2. Get all the product cards on the page
    let cards = document.getElementsByClassName('product-card');

    // 3. Loop through every card
    for (let i = 0; i < cards.length; i++) {
        let name = cards[i].querySelector('.product-name').innerText.toLowerCase();
        
        // 4. If the name matches the search, show it; otherwise, hide it
        if (name.includes(input)) {
            cards[i].style.display = "flex";
        } else {
            cards[i].style.display = "none";
        }
    }
}