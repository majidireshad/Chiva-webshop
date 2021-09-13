//variables are made from selection of ids from the document
let cartBtn = document.querySelector("#btnCart");
const productContainer = document.querySelector("#product-container");
const categories = document.querySelector("#categories");
const cartSide = document.querySelector("#CartSide");
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
let products = [];
let sortStrategy = sortOptions[0];
// coffeeTable is one of the product category links located on section class categories on the document

//select a product category:
const createCategories = async () => {
  (await getCategories()).forEach((category) => {
    console.log(category);
    const categoryButton = document.createElement("a");
    categoryButton.textContent = category;

    categories.appendChild(categoryButton);
    categoryButton.addEventListener("click", eventListenerCategory);
  });
};

function sortProducts(event) {
  if (event) {
    sortStrategy = event.target.value;
  }
  if (sortStrategy === sortOptions[1]) {
    products.sort((product1, product2) => {
      return product1.price - product2.price;
    });
  } else if (sortStrategy === sortOptions[2]) {
    products.sort((product1, product2) => {
      return product2.price - product1.price;
    });
  } else if (sortStrategy === sortOptions[3]) {
    products.sort((product1, product2) => {
      return product1.rating.rate - product2.rating.rate;
    });
  } else if (sortStrategy === sortOptions[4]) {
    products.sort((product1, product2) => {
      return product2.rating.rate - product1.rating.rate;
    });
  } else {
    products = [];
    defaultSortedProducts.forEach((product) => {
      products.push({ ...product });
    });
  }
}

const showProducts = (productsToDisplay) => {
  productContainer.style.display = "flex";
  productContainer.innerHTML = "";

  //Upon looping each element of the object, The components of a product selection gets
  productsToDisplay.forEach(function (product) {
    const image = document.createElement("img");
    image.src = `${product.image}`;
    image.setAttribute("class", "card-img-top");
    const addToCardBtn = document.createElement("a");
    addToCardBtn.innerText = "";
    addToCardBtn.setAttribute("class", "btn btn-primary");
    const showDescription = document.createElement("a");
    showDescription.textContent = "Show More";
    showDescription.setAttribute("class", "btn btn-primary");
    const productDescription = document.createElement("p");

    productDescription.setAttribute("id", product.id);
    productDescription.setAttribute("class", "card-text");

    showDescription.addEventListener("click", function () {
      const descriptionElement = document.getElementById(`${product.id}`);
      if (!product.isShowingDescription) {
        descriptionElement.style.display = "none";
        descriptionElement.textContent = product.description;
        product.isShowingDescription = true;
      } else {
        descriptionElement.style.display = "flex";
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
      refereshcart();
    });

    const productTitle = document.createElement("h5");
    productTitle.setAttribute("class", "card-title");

    const productPrice = document.createElement("h5");
    productPrice.setAttribute("class", "card-title");

    productTitle.textContent = product.title;

    productDescription.textContent = product.description;
    productPrice.textContent = `$ ${product.price}`;

    const productCard = document.createElement("div");
    const productBody = document.createElement("div");

    productCard.setAttribute("id", "item");
    productCard.setAttribute("class", "card col-3 product-card");
    productBody.setAttribute("class", "card-body");
    productCard.appendChild(image);
    productBody.appendChild(productTitle);
    productBody.appendChild(addToCardBtn);
    productBody.appendChild(productPrice);
    productBody.appendChild(addToCardBtn);
    productBody.appendChild(showDescription);
    productBody.appendChild(productDescription);
    productCard.appendChild(productBody);
    productContainer.appendChild(productCard);
  });
};

const eventListenerCategory = async (event) => {
  defaultSortedProducts = [];
  products = [];
  defaultSortedProducts = await getProductsInCategory(event.target.innerText);
  defaultSortedProducts.forEach((product) => {
    products.push({ ...product });
  });
  sortProducts();
  //changed
  showProducts(products);
};

closeCart = () => {
  if (cartOpen) {
    console.log("cartOpen");
    cartOpen = false;
    cartSide.style.display = "none";
  } else {
    cartOpen = true;
    cartSide.style.display = "flex";
  }
};

//the cart icon can show/hide the cart side bar
function refereshcart() {
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
        refereshcart();
      });
      const image = document.createElement("img");
      image.src = `${element.img}`;
      let table = document.createElement("table");
      table.id = "cart-table";
      let tableStructure = "<tr><td>";

      tableStructure += "<span>" + element.title + "</span>" + "<br>";
      tableStructure += "<span>" + "€" + element.price + "</span>" + "<br>";

      const productCount = document.createElement("div");
      productCount.innerText = count;

      tableStructure += "</td></tr>";
      table.innerHTML = tableStructure;
      cartSide.appendChild(table);
      cartSide.appendChild(image);
      cartSide.appendChild(clear);
      cartSide.appendChild(productCount);
    });
  }
}

//the cart icon can show/hide the cart side bar
cartBtn.addEventListener("click", closeCart);

//the white arrow beneath the product categories can show/hide products
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
  });

  // Changed
  sortSelect.addEventListener("change", (event) => {
    sortProducts(event);
    showProducts(products);
  });

  sortOptionsContainer.appendChild(sortSelect);
}

function addSearchFunctionality() {
  searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    let searchedProducts = [];
    let searchedValue = searchInput.value;
    if (searchedValue.trim() === "") {
      searchedProducts = [...defaultSortedProducts];
    } else {
      searchedProducts = defaultSortedProducts.filter((product) => {
        searchedValue = searchedValue.toLowerCase().trim();
        let title = product.title.toLowerCase();
        return title.includes(searchedValue);
      });
    }
    sortProducts();
    showProducts(searchedProducts);
  });
}

const main = () => {
  createCategories();
  addSortFunctionality();
  addSearchFunctionality();
};

window.addEventListener("load", main);
