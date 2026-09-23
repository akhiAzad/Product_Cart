const productsPerPage = 10;
const pagesToShow = 5;
let currentPage = 1;
let totalPages = 1;
let searchText = "";
let cartItems = [];

// Fetch products
async function fetchData(page) {
    try {
        const response = await fetch("https://dummyjson.com/products?limit=194");
        const data = await response.json();
        let products = data.products;
        // Search by title 
        if (searchText !== "") {
            products = products.filter(function (product) {
                return product.title.toLowerCase().includes(searchText.toLowerCase());
            });
        }
        const total = products.length;
        const skip = (page - 1) * productsPerPage;
        const paginatedProducts = products.slice(skip, skip + productsPerPage);
        return {
            products: paginatedProducts,
            total: total
        };
    }
    catch (error) {
        console.error(error);
    }
}

// Display products
async function renderData(page) {
    const data = await fetchData(page);
    if (!data) {
        return;
    }
    const productList = document.querySelector(".cart");
    productList.innerHTML = "";
    data.products.forEach(product => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <img src="${product.thumbnail}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>`;
        // Open product details page
        div.addEventListener("click", function () {
            showProductDetails(product);
        });
        productList.appendChild(div);
    });
    // Calculate total pages
    totalPages = Math.ceil(data.total / productsPerPage);
    renderPagination();
}

// Show product details
function showProductDetails(product) {
    const productList = document.querySelector(".cart");
    const productDetails = document.querySelector("#productDetails");
    const cartSection = document.querySelector("#cartSection");

    // Hide other sections 
    productList.style.display = "none";
    cartSection.style.display = "none";

    // Show product details
    productDetails.style.display = "flex";
    productDetails.innerHTML = `
        <!-- Cart button -->
       
        <div class="product-details">
            <img
                src="${product.thumbnail}"
                alt="${product.title}">
            <div class="product-info">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p>
                    <strong>Price:</strong>
                    $${product.price}
                </p>
                <p>
                    <strong>Rating:</strong>
                    ${product.rating}
                </p>
                <p>
                    <strong>Stock:</strong>
                    ${product.stock}
                </p>
                <p>
                    <strong>Brand:</strong>
                    ${product.brand}
                </p>
                <p>
                    <strong>Category:</strong>
                    ${product.category}
                </p>
                <button id="addToCartButton">
                    Add to Cart
                </button>
                <button id="backButton">
                    Back
                </button>
            </div>
        </div>
    `;
    // Cart button
    // const cartButtonInDetails = document.querySelector("#CartBut");
    // cartButtonInDetails.addEventListener("click", function () {
    //     showCart();
    // });
    // Add to Cart
    const addToCartButton = document.querySelector("#addToCartButton");
    addToCartButton.addEventListener("click", function () {
        addToCart(product);
        document.querySelector("#detailsCartCount").innerText =
            getTotalCartItems();
    });
    // Back
    const backButton = document.querySelector("#backButton");
    backButton.addEventListener("click", function () {
        showProductList();
    });
}

// Add product to cart
function addToCart(product) {
    // Check whether product already exists
    const existingProduct = cartItems.find(function (item) {
        return item.id === product.id;
    });
    if (existingProduct) {
        existingProduct.quantity++;
    }
    else {
        cartItems.push({
            ...product,
            quantity: 1
        });
    }
    updateCartCount();
    renderCart();
}

// Get total number of cart items
function getTotalCartItems() {
    let totalItems = 0;
    cartItems.forEach(function (item) {
        totalItems += item.quantity;
    });
    return totalItems;
}
// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector("#cartCount");
    cartCount.innerText = getTotalCartItems();
}
// Show cart
function showCart() {
    const productList = document.querySelector(".cart");
    const productDetails = document.querySelector("#productDetails");
    const cartSection = document.querySelector("#cartSection");

    // Hide other sections 
    productList.style.display = "none";
    productDetails.style.display = "none";

    // Show cart
    cartSection.style.display = "block";
    document.querySelector("#cartTitle").innerText = "Shopping Cart";
    renderCart();
}
// Display cart items
function renderCart() {
    const cartItemsContainer = document.querySelector("#cartItems");
    const summarySection = document.querySelector("#summarySection");
    const summaryBody = document.querySelector("#summaryBody");
    const summaryTotal = document.querySelector("#summaryTotal");
    const buyButton = document.querySelector("#buyButton");
    cartItemsContainer.innerHTML = "";
    summaryBody.innerHTML = "";
    // Empty cart
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;
        summarySection.style.display = "none";
        buyButton.style.display = "none";
        return;
    }
    // Show Buy button
    buyButton.style.display = "inline-block";
    let totalPrice = 0;
    // Display cart products
    cartItems.forEach(function (item, index) {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}">
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>
                    Price: $${item.price}
                </p>
            </div>
            <div class="quantity">
                <button class="minus-button">
                    -
                </button>
                <span>
                    ${item.quantity}
                </span>
                <button class="plus-button">
                    +
                </button>
            </div>
            <p class="item-total">
                $${itemTotal.toFixed(2)}
            </p>
            <button class="remove-button">
                Remove
            </button>
        `;
        // Minus button
        const minusButton = cartItem.querySelector(".minus-button");
        minusButton.addEventListener("click", function () {
                decreaseQuantity(index);
            }
        );
        // Plus button
        const plusButton = cartItem.querySelector(".plus-button");
        plusButton.addEventListener("click",function () {
                increaseQuantity(index);
            }
        );
        // Remove button
        const removeButton = cartItem.querySelector(".remove-button");
        removeButton.addEventListener(
            "click",
            function () {
                removeFromCart(index);
            }
        );
        cartItemsContainer.appendChild(cartItem);
        // Add item to summary table
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;
        summaryBody.appendChild(row);
    });
    // Show summary
    summarySection.style.display = "block";
    summaryTotal.innerText = totalPrice.toFixed(2);
}
// Increase quantity
function increaseQuantity(index) {
    cartItems[index].quantity++;
    updateCartCount();
    renderCart();
}
// Decrease quantity
function decreaseQuantity(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
    }
    updateCartCount();
    renderCart();
}
// Remove product from cart
function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartCount();
    renderCart();
}
// Show product list
function showProductList() {
    const productList = document.querySelector(".cart");
    const productDetails = document.querySelector("#productDetails");
    const cartSection = document.querySelector("#cartSection");

    // Hide other sections
    productDetails.style.display = "none";
    cartSection.style.display = "none";

    // Show product list 
    productList.style.display = "grid";
}
// Pagination
function renderPagination() {
    const pageNumbers = document.querySelector(".page-numbers");
    pageNumbers.innerHTML = "";
    let startPage;
    let endPage;
    if (totalPages <= pagesToShow) {
        startPage = 1;
        endPage = totalPages;
    }
    else if (currentPage <= 3) {
        startPage = 1;
        endPage = pagesToShow;
    }
    else if (currentPage >= totalPages - 2) {
        startPage = totalPages - pagesToShow + 1;
        endPage = totalPages;
    }
    else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
    }
    // Create page buttons
    for (let page = startPage;page <= endPage;page++) {
        const button = document.createElement("button");
        button.innerText = page;
        if (page === currentPage) {
            button.classList.add("active");
        }
        button.addEventListener("click",function () {
                currentPage = page;
                renderData(currentPage);
            }
        );
        pageNumbers.appendChild(button);
    }
    updateArrowButtons();
}
// Enable / Disable arrows
function updateArrowButtons() {
    const leftButton = document.querySelector(".left-button");
    const rightButton = document.querySelector(".right-button");
    if (currentPage === 1) {
        leftButton.disabled = true;
    }
    else {
        leftButton.disabled = false;
    }
    if (currentPage === totalPages) {
        rightButton.disabled = true;
    }
    else {
        rightButton.disabled = false;
    }
}
// Previous page
const leftButton = document.querySelector(".left-button");
leftButton.addEventListener("click",function () {
        if (currentPage > 1) {
            currentPage--;
            renderData(currentPage);
        }
    }
);
// Next page
const rightButton = document.querySelector(".right-button");
rightButton.addEventListener("click",function () {
        if (currentPage < totalPages) {
            currentPage++;
            renderData(currentPage);
        }
    }
);
// Search
const searchButton = document.querySelector("#searchButton");
searchButton.addEventListener("click",function () {
        searchText = document.querySelector("#searchInput").value.trim();
        currentPage = 1;
        showProductList();
        renderData(currentPage);
    }
);
// Home button
const homeButton = document.querySelector("#homeButton");
homeButton.addEventListener("click", function () {
        searchText = "";
        document.querySelector("#searchInput").value = "";
        currentPage = 1;
        showProductList();
        renderData(currentPage);
    }
);
// Cart button
const cartButton = document.querySelector("#cartButton");
cartButton.addEventListener("click",function () {
        showCart();
    }
);
// Continue Shopping
const continueShoppingButton =
    document.querySelector("#continueShoppingButton");
continueShoppingButton.addEventListener("click", function () {
        showProductList();
    }
);
// Buy button
const buyButton = document.querySelector("#buyButton");
buyButton.addEventListener(
    "click",
    function () {
        if (cartItems.length === 0) {
            return;
        }
        document.querySelector("#cartTitle").innerText = "Order Placed";
        buyButton.style.display = "none";
        document.querySelector( "#continueShoppingButton"
        ).innerText = "Continue Shopping";
        renderOrderSummary();
    }
);
// Order summary after purchase
function renderOrderSummary() {
    const cartItemsContainer = document.querySelector("#cartItems");
    const summaryBody = document.querySelector("#summaryBody");
    const summaryTotal = document.querySelector("#summaryTotal");
    cartItemsContainer.innerHTML = `
        <div class="purchase-message">
            <h3>
                Order placed successfully!
            </h3>
            <p>
                Thank you for your purchase.
            </p>
        </div>
    `;
    summaryBody.innerHTML = "";
    let totalPrice = 0;
    cartItems.forEach(function (item) {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;
        summaryBody.appendChild(row);
    });
    summaryTotal.innerText = totalPrice.toFixed(2);
    document.querySelector("#summarySection").style.display = "block";
}
// Load first page
renderData(currentPage);