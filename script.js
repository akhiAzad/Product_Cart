const productsPerPage = 10;
const pagesToShow = 5;
let currentPage = 1;
let totalPages = 1;
let searchText = "";

// FETCH PRODUCTS

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

// DISPLAY PRODUCTS

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
        div.innerHTML = ` <img src="${product.thumbnail}">
            <h3>${product.title}</h3>
            <p>${product.description}</p> `;
        cart.appendChild(div);
    });

    // Calculate total pages

    totalPages = Math.ceil(data.total / productsPerPage);
    renderPagination();
}
// CREATE PAGE NUMBERS

function renderPagination() {
    const pageNumbers = document.querySelector(".page-numbers");
    pageNumbers.innerHTML = "";
    let startPage;
    let endPage;

    // If total pages are less than pagesToShow

    if (totalPages <= pagesToShow) {
        startPage = 1;
        endPage = totalPages;
    }

    // If current page is near the beginning

    else if (currentPage <= 3) {
        startPage = 1;
        endPage = pagesToShow;
    }

    // If current page is near the end

    else if (currentPage >= totalPages - 2) {
        startPage = totalPages - pagesToShow + 1;
        endPage = totalPages;
    }

    // Current page is somewhere in the middle

    else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
    }

    // Create page buttons

    for (let page = startPage; page <= endPage; page++) {
        const button = document.createElement("button");
        button.innerText = page;

        // Highlight current page

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

// ENABLE / DISABLE ARROWS

function updateArrowButtons() {
    const leftButton = document.querySelector(".left-button");
    const rightButton = document.querySelector(".right-button");

    // First page

    if (currentPage === 1) {
        leftButton.disabled = true;
    } 
    else {
        leftButton.disabled = false;
    }

    // Last page

    if (currentPage === totalPages) {
        rightButton.disabled = true;
    } 
    else {
    rightButton.disabled = false;
    }
}

// PREVIOUS PAGE

const leftButton = document.querySelector(".left-button");
leftButton.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        renderData(currentPage);
    }
});

// NEXT PAGE

const rightButton = document.querySelector(".right-button");
rightButton.addEventListener("click", function () {
    if (currentPage < totalPages) {
        currentPage++;
        renderData(currentPage);
    }
});

// SEARCH

const searchButton = document.querySelector("#searchButton");
searchButton.addEventListener("click", function () {
    searchText = document.querySelector("#searchInput").value;
    currentPage = 1;
    renderData(currentPage);

});

// LOAD FIRST PAGE
renderData(currentPage);