import axios from "axios";

// Base URL for your API
axios.defaults.baseURL = "http://localhost:8080/digital_artDB"; 

export const saveCategory = (category) => {
  return axios
    .post("/api/categories/create", category)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error saving category:", error);
      throw error;
    });
};

export const getCategoryById = (id) => {
  return axios
    .get(`/api/categories/read/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching category:", error);
      throw error;
    });
};


export const updateCategory = (category) => {
  return axios
    .put("/api/categories/update", category)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating category:", error);
      throw error;
    });
};

export const deleteCategory = (id) => {
  return axios
    .delete(`/api/categories/delete/${id}`)
    .then((response) => response.status === 200)
    .catch((error) => {
      console.error("Error deleting category:", error);
      throw error;
    });
};


export const getAllCategories = () => {
  return axios
    .get("/api/categories/getAll")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching all categories:", error);
      throw error;
    });
};