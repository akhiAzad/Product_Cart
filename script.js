
const productsPerPage = 10;

const pagesToShow = 5;

let currentPage = 1;

let totalPages = 1;

let searchText = "";


// Cart
let cartItems = [];


// Fetch products
async function fetchData(page) {

    try {

        const skip = (page - 1) * productsPerPage;

        let url;

        if (searchText === "") {

            url = `https://dummyjson.com/products?limit=${productsPerPage}&skip=${skip}`;

        }
        else {

            url = `https://dummyjson.com/products/search?q=${searchText}&limit=${productsPerPage}&skip=${skip}`;

        }

        const response = await fetch(url);

        const data = await response.json();

        return data;

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
            <p>${product.description}</p>
        `;


        // Open product details
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

    const search = document.querySelector(".search");

    const productList = document.querySelector(".cart");

    const productDetails =
        document.querySelector("#productDetails");

    const cartSection =
        document.querySelector("#cartSection");

    const footer =
        document.querySelector(".footer");


    // Hide other sections
    search.style.display = "none";

    productList.style.display = "none";

    cartSection.style.display = "none";

    footer.style.display = "none";


    // Show product details
    productDetails.style.display = "flex";


    productDetails.innerHTML = `

        <div class="product-details">

            <img src="${product.thumbnail}">

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


    // Add to Cart
    const addToCartButton =
        document.querySelector("#addToCartButton");

    addToCartButton.addEventListener("click", function () {

        addToCart(product);

    });


    // Back
    const backButton =
        document.querySelector("#backButton");

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


// Update cart count
function updateCartCount() {

    const cartCount =
        document.querySelector("#cartCount");

    let totalItems = 0;


    cartItems.forEach(function (item) {

        totalItems += item.quantity;

    });


    cartCount.innerText = totalItems;

}


// Show cart
function showCart() {

    const search = document.querySelector(".search");

    const productList = document.querySelector(".cart");

    const productDetails =
        document.querySelector("#productDetails");

    const cartSection =
        document.querySelector("#cartSection");

    const footer =
        document.querySelector(".footer");


    // Hide other sections
    search.style.display = "none";

    productList.style.display = "none";

    productDetails.style.display = "none";

    footer.style.display = "none";


    // Show cart
    cartSection.style.display = "block";


    renderCart();

}


// Display cart items
function renderCart() {

    const cartItemsContainer =
        document.querySelector("#cartItems");

    const totalItemsElement =
        document.querySelector("#totalItems");

    const totalPriceElement =
        document.querySelector("#totalPrice");


    cartItemsContainer.innerHTML = "";


    // Empty cart

if (cartItems.length === 0) {

    const summaryBox =
        document.querySelector(".cart-summary");

    const continueShoppingButton =
        document.querySelector("#continueShoppingButton");


    cartItemsContainer.innerHTML = `

        <p class="empty-cart">
            Your cart is empty.
        </p>
        <div id="emptybackDiv">
        <button id="emptybackButton">
            Continue shopping!
        </button>
        </div>

    `;


    // Hide summary
    summaryBox.style.display = "none";

    // Back button
    const emptyCartBackButton =
        document.querySelector("#emptybackButton");

    emptyCartBackButton.addEventListener("click", function () {

        showProductList();

    });


    return;

}



    let totalItems = 0;

    let totalPrice = 0;


    cartItems.forEach(function (item, index) {

        const itemTotal =
            item.price * item.quantity;


        totalItems += item.quantity;

        totalPrice += itemTotal;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <img
                src="${item.thumbnail}"
                alt="${item.title}"
            >

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
        const minusButton =
            cartItem.querySelector(".minus-button");

        minusButton.addEventListener("click", function () {

            decreaseQuantity(index);

        });


        // Plus button
        const plusButton =
            cartItem.querySelector(".plus-button");

        plusButton.addEventListener("click", function () {

            increaseQuantity(index);

        });


        // Remove button
        const removeButton =
            cartItem.querySelector(".remove-button");

        removeButton.addEventListener("click", function () {

            removeFromCart(index);

        });


        cartItemsContainer.appendChild(cartItem);

    });


    // Update total
    totalItemsElement.innerText = totalItems;

    totalPriceElement.innerText =
        totalPrice.toFixed(2);

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

    const search = document.querySelector(".search");

    const productList = document.querySelector(".cart");

    const productDetails =
        document.querySelector("#productDetails");

    const cartSection =
        document.querySelector("#cartSection");

    const footer =
        document.querySelector(".footer");


    // Hide other sections
    productDetails.style.display = "none";

    cartSection.style.display = "none";


    // Show product list
    search.style.display = "flex";

    productList.style.display = "grid";

    footer.style.display = "flex";

}


// Pagination
function renderPagination() {

    const pageNumbers =
        document.querySelector(".page-numbers");

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
    for (
        let page = startPage;
        page <= endPage;
        page++
    ) {

        const button =
            document.createElement("button");

        button.innerText = page;


        if (page === currentPage) {

            button.classList.add("active");

        }


        button.addEventListener("click", function () {

            currentPage = page;

            renderData(currentPage);

        });


        pageNumbers.appendChild(button);

    }


    updateArrowButtons();

}


// Enable / Disable arrows
function updateArrowButtons() {

    const leftButton =
        document.querySelector(".left-button");

    const rightButton =
        document.querySelector(".right-button");


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
const leftButton =
    document.querySelector(".left-button");

leftButton.addEventListener("click", function () {

    if (currentPage > 1) {

        currentPage--;

        renderData(currentPage);

    }

});


// Next page
const rightButton =
    document.querySelector(".right-button");

rightButton.addEventListener("click", function () {

    if (currentPage < totalPages) {

        currentPage++;

        renderData(currentPage);

    }

});


// Search
const searchButton =
    document.querySelector("#searchButton");

searchButton.addEventListener("click", function () {

    searchText =
        document.querySelector("#searchInput").value;

    currentPage = 1;

    renderData(currentPage);

});


// Cart button
const cartButton =
    document.querySelector("#cartButton");

cartButton.addEventListener("click", function () {

    showCart();

});


// Continue Shopping
const continueShoppingButton =
    document.querySelector("#continueShoppingButton");

continueShoppingButton.addEventListener(
    "click",
    function () {

        showProductList();

    }
);


// Buy button
const buyButton =
    document.querySelector("#buyButton");

buyButton.addEventListener("click", function () {

    if (cartItems.length === 0) {

        return;

    }


    const cartItemsContainer =
        document.querySelector("#cartItems");

    cartItemsContainer.innerHTML = `

        <div class="purchase-message">

            <h3>Order placed successfully!</h3>

            <p>
                Thank you for your purchase.
            </p>

        </div>

    `;

});


// Load first page
renderData(currentPage);

