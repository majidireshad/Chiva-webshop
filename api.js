//**fetch base:
const fetchData = async (path) => {
  const baseURL = "https://fakestoreapi.com/";
  try {
    const response = await fetch(baseURL + path);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      throw new Error("Cannot connect to server!");
    }
  } catch (error) {
    console.log(error);
  }
};

const getProductsInCategory = (categoryName) => {
  return fetchData(`products/category/${categoryName}`);
};

const getCategories = () => {
  return fetchData("products/categories");
};

const getAllProducts = () => {
  return fetchData("products");
};
