const productsPerPage = 10;
let currentPage = 1;

// Fetch products
async function fetchData(page) {
    try {
        const skip = (page - 1) * productsPerPage;
        const response = await fetch( `https://dummyjson.com/products?limit=${productsPerPage}&skip=${skip}`  );
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
            <p>${product.description}</p>  `;

        cart.appendChild(div);

    });
}

// Page buttons
const buttons = document.querySelectorAll(".footer button");
buttons.forEach(button => {
    button.addEventListener("click", function () {
        currentPage = Number(button.innerText);
        renderData(currentPage);
    });
});

// Previous button
const previousButton = document.querySelector(".left").parentElement;
previousButton.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        renderData(currentPage);
    }
});

// Next button
const nextButton = document.querySelector(".right").parentElement;
nextButton.addEventListener("click", function () {
    currentPage++;
    renderData(currentPage);
});

// Load first page
renderData(currentPage);