//variables are made from selection of ids from the document
let cartBtn = document.querySelector("#cart-icon");
const productContainer = document.querySelector("#product-container");
const categories = document.querySelector("#categories");
const cartSide = document.querySelector("#cart-side");
const closeCategory = document.querySelector("#close-category");
const sortOptionsContainer = document.querySelector("#sort-options-container");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

sortOptions = [
  "Sort by: Default",
  "Sort by: Price Low to High",
  "Sort by: Price High To Low",
  "Sort by: Rating Low to High",
  "Sort by: Rating High to Low",
];

const cart = new Map();
let cartOpen = false;
let categoryOpen = false;
let defaultSortedProducts = [];
let productsToDisplay = [];
let sortStrategy = sortOptions[0];

// create show-all button and attach event listener to it
const createShowAllButton = async () => {
  const allButton = document.createElement("button");
  allButton.textContent = "Show All";
  allButton.classList.add("category-button");
  allButton.addEventListener("click", fetchAndShowAllProducts);
  categories.appendChild(allButton);
};

const fetchAndShowAllProducts = async () => {
  defaultSortedProducts = await getAllProducts();
  productsToDisplay = defaultSortedProducts;
  sortProducts();
  showProducts();
};

//select a product category:
const createCategoryButtons = async () => {
  (await getCategories()).forEach((category) => {
    const categoryButton = document.createElement("a");
    categoryButton.textContent = category;
    categoryButton.classList.add("category-button");
    categories.appendChild(categoryButton);
    categoryButton.addEventListener("click", fetchAndShowProductsInCategory);
  });
};

const fetchAndShowProductsInCategory = async (event) => {
  defaultSortedProducts = await getProductsInCategory(event.target.innerText);
  productsToDisplay = defaultSortedProducts;
  sortProducts();
  showProducts();
};

function sortProducts(event) {
  if (event) {
    sortStrategy = event.target.value;
  }
  if (sortStrategy === sortOptions[1]) {
    productsToDisplay.sort((product1, product2) => {
      return product1.price - product2.price;
    });
  } else if (sortStrategy === sortOptions[2]) {
    productsToDisplay.sort((product1, product2) => {
      return product2.price - product1.price;
    });
  } else if (sortStrategy === sortOptions[3]) {
    productsToDisplay.sort((product1, product2) => {
      return product1.rating.rate - product2.rating.rate;
    });
  } else if (sortStrategy === sortOptions[4]) {
    productsToDisplay.sort((product1, product2) => {
      return product2.rating.rate - product1.rating.rate;
    });
  } else {
    productsToDisplay = defaultSortedProducts;
  }
}

const showProducts = () => {
  productContainer.style.display = "flex";
  productContainer.innerHTML = "";

  // Looping through products and displaying them to user
  productsToDisplay.forEach(function (product) {
    const image = document.createElement("img");
    image.src = `${product.image}`;
    image.setAttribute("class", "card-img-top");
    const addToCardBtn = document.createElement("a");
    addToCardBtn.innerHTML =
      "<i class='fa fa-cart-arrow-down' aria-hidden='true'></i> Add to Cart";
    addToCardBtn.setAttribute("class", "btn btn-primary");
    addToCardBtn.setAttribute("id", "add-to-Cart-btn");
    const showDescription = document.createElement("a");
    showDescription.textContent = "Show More";
    showDescription.setAttribute("class", "show-more-link");
    showDescription.setAttribute("id", "show-info-btn");

    const productDescription = document.createElement("p");

    productDescription.setAttribute("id", product.id);
    productDescription.setAttribute("class", "card-text");

    showDescription.addEventListener("click", function () {
      const descriptionElement = document.getElementById(`${product.id}`);
      if (!product.isShowingDescription) {
        descriptionElement.style.display = "flex";
        descriptionElement.textContent = product.description;
        product.isShowingDescription = true;
      } else {
        descriptionElement.style.display = "none";
        product.isShowingDescription = false;
      }
    });

    addToCardBtn.addEventListener("click", function () {
      //a new object is created to contain a map of the required information
      let cartElements = {};
      cartElements.title = product.title;
      cartElements.price = product.price;
      cartElements.id = product.id;
      cartElements.img = product.image;
      cartElements.rate = product.rating.rate;

      if (cart.has(cartElements.id)) {
        cart.set(cartElements.id, [
          cartElements,
          cart.get(cartElements.id)[1] + 1,
        ]);
      } else {
        cart.set(cartElements.id, [cartElements, 1]);
      }
      refreshCart();
    });

    const productTitle = document.createElement("h5");
    productTitle.setAttribute("class", "card-title");

    const productPrice = document.createElement("h4");
    productPrice.setAttribute("class", "card-title");

    const productRating = document.createElement("h5");
    productRating.setAttribute("class", "card-title");

    productTitle.textContent = product.title;
    productPrice.innerHTML = "<small>$</small>" + product.price;
    productRating.innerHTML =
      "<i class='fa fa-star' aria-hidden='true' </i>" + product.rating.rate;

    const productCard = document.createElement("div");
    const productBody = document.createElement("div");
    const productLinks = document.createElement("div");

    productCard.setAttribute("id", "product-card-main");
    productCard.setAttribute("class", "card col-3 product-card");
    productBody.setAttribute("class", "card-body");
    productLinks.setAttribute("class", "card-body");
    productLinks.setAttribute("id", "product-links-card");
    productCard.appendChild(image);
    productBody.appendChild(productPrice);
    productBody.appendChild(productTitle);
    productBody.appendChild(productRating);
    productBody.appendChild(productDescription);
    productBody.appendChild(showDescription);
    productLinks.appendChild(addToCardBtn);
    productCard.appendChild(productBody);
    productCard.appendChild(productLinks);
    productContainer.appendChild(productCard);
  });
};

closeCart = () => {
  if (cartOpen) {
    cartOpen = false;
    cartSide.style.display = "none";
  } else {
    cartOpen = true;
    cartSide.style.display = "flex";
  }
};

//the cart icon can show/hide the cart side bar
function refreshCart() {
  cartSide.innerHTML = "";
  cartSide.style.display = "flex";
  if (cart.size === 0) {
    closeCart();
  } else {
    cartOpen = true;
    cart.forEach(function ([element, count], _) {
      //every added product is accompanied by a bin option to remove them from the cart
      const clear = document.createElement("a");
      clear.innerText = "";
      clear.addEventListener("click", function () {
        if (cart.get(element.id)[1] > 1) {
          cart.set(element.id, [element, cart.get(element.id)[1] - 1]);
        } else {
          cart.delete(element.id);
        }
        refreshCart();
      });
      clear.setAttribute;
      const image = document.createElement("img");
      image.src = `${element.img}`;
      image.setAttribute("class", "card-img-top");
      const productPrice = document.createElement("h5");
      productPrice.setAttribute("class", "card-title");
      productPrice.innerHTML = "<small>$</small>" + element.price;
      const productTitle = document.createElement("h5");
      productTitle.setAttribute("class", "card-title");
      productTitle.textContent = element.title;

      const productCount = document.createElement("div");
      productCount.innerText = `Quantity: ${count}`;

      const productCard = document.createElement("div");
      const productBody = document.createElement("div");

      productCard.setAttribute("id", "product-card-cart");
      productCard.setAttribute("class", "card col-3 product-card");
      productBody.setAttribute("class", "card-body");
      productCard.appendChild(image);
      productBody.appendChild(productPrice);
      productBody.appendChild(productTitle);
      productCard.appendChild(productBody);
      cartSide.appendChild(productCard);
      productCard.appendChild(clear);
      productCard.appendChild(productCount);
    });
  }
}

//the cart icon can show/hide the cart side bar
cartBtn.addEventListener("click", closeCart);

//the white arrow beneath the product categories can show/hide productsToDisplay
closeCategory.addEventListener("click", function () {
  if (categoryOpen) {
    categoryOpen = false;
    productContainer.style.display = "none";
  } else {
    categoryOpen = true;
    productContainer.style.display = "flex";
  }
});

function addSortFunctionality() {
  const sortSelect = document.createElement("select");
  sortOptions.forEach((option) => {
    const sortOptionElement = document.createElement("option");
    sortOptionElement.text = option;
    sortOptionElement.value = option;
    sortSelect.appendChild(sortOptionElement);
    sortSelect.setAttribute("class", "form-select form-select-lg mb-1");
  });

  sortSelect.addEventListener("change", (event) => {
    sortProducts(event);
    showProducts();
  });

  sortOptionsContainer.appendChild(sortSelect);
}

async function addSearchFunctionality() {
  const productsToSearchFrom = await getAllProducts();
  searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    let searchedValue = searchInput.value;
    if (searchedValue.trim() === "") {
      productsToDisplay = productsToSearchFrom;
    } else {
      productsToDisplay = productsToSearchFrom.filter((product) => {
        searchedValue = searchedValue.toLowerCase().trim();
        let title = product.title.toLowerCase();
        return title.includes(searchedValue);
      });
    }
    defaultSortedProducts = productsToDisplay;
    sortProducts();
    showProducts();
  });
}

const main = async () => {
  createShowAllButton();
  createCategoryButtons();
  addSortFunctionality();
  addSearchFunctionality();
};

window.addEventListener("load", main);
