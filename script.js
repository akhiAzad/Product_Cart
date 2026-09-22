const productsPerPage = 10;

const pagesToShow = 5;

let currentPage = 1;

let totalPages = 1;

let searchText = "";

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

    const cart = document.querySelector(".cart");

    cart.innerHTML = "";

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


        cart.appendChild(div);

    });


    // Calculate total pages
    totalPages = Math.ceil(data.total / productsPerPage);

    renderPagination();

}


// Show product details
function showProductDetails(product) {

    const search = document.querySelector(".search");

    const productList = document.querySelector(".cart");

    const productDetails = document.querySelector("#productDetails");

    const footer = document.querySelector(".footer");


    // Hide search bar
    search.style.display = "none";

    // Hide product list
    productList.style.display = "none";

    // Hide pagination
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


    // Add to cart
    const addToCartButton =
        document.querySelector("#addToCartButton");

    addToCartButton.addEventListener("click", function () {

        cartItems.push(product);

        console.log("Cart:", cartItems);

    });


    // Back button
    const backButton =
        document.querySelector("#backButton");

    backButton.addEventListener("click", function () {

        // Hide product details
        productDetails.style.display = "none";


        // Show search bar again
        search.style.display = "flex";


        // Show product list again
        productList.style.display = "grid";


        // Show pagination again
        footer.style.display = "flex";

    });

}


// Render pagination
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
    for (let page = startPage; page <= endPage; page++) {

        const button = document.createElement("button");

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


// Load first page
renderData(currentPage);