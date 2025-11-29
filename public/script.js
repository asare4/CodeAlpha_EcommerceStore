let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load products
fetch('/api/products')
  .then(res => res.json())
  .then(products => {
    const grid = document.getElementById('products');
    grid.innerHTML = '<h2>Products</h2>' + products.map(p => `
      <div class="product">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <p>${p.desc}</p>
        <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Add to Cart</button>
      </div>
    `).join('');
    updateCartCount();
  });

// Add to cart
function addToCart(id, name, price) {
  cart.push({ id, name, price });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(name + " added to cart!");
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}

// Login / Register Forms
function showLogin() {
  document.getElementById('auth').innerHTML = `
    <form onsubmit="login(event)">
      <h3>Login</h3>
      <input type="email" id="email" placeholder="Email" required>
      <input type="password" id="pass" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `;
}

function showRegister() {
  document.getElementById('auth').innerHTML = `
    <form onsubmit="register(event)">
      <h3>Register</h3>
      <input type="text" id="name" placeholder="Name" required>
      <input type="email" id="email" placeholder="Email" required>
      <input type="password" id="pass" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
  `;
}

async function register(e) {
  e.preventDefault();
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('pass').value
    })
  });
  const data = await res.json();
  alert("Registered! Now login");
}

async function login(e) {
  e.preventDefault();
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('pass').value
    })
  });
  const data = await res.json();
  if (data.success) {
    document.getElementById('user').textContent = data.user.name;
    document.getElementById('auth').innerHTML = '<h3>Login successful!</h3>';
  } else {
    alert("Wrong email/password");
  }
}

function logout() {
  document.getElementById('user').textContent = "Guest";
  document.getElementById('auth').innerHTML = '';
}