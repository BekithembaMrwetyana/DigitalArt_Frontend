 import axios from "axios";
 
// Base URL for your API

axios.defaults.baseURL = "http://localhost:8080"; // Adjust if needed
 
export const saveCategory = async (formData) => {

  try {
        const response = await axios
            .post("/digital_artDB/category/save", formData);
        return response.data;
    } catch (error) {
        console.error("Error saving category:", error);

        throw error;
    }

};
 
export const getCategoryById = async (id) => {

  try {
        const response = await axios

            .get(`/digital_artDB/category/read/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching category:", error);

        throw error;
    }

};
 
export const updateCategory = async (category) => {
  try {
        const response = await axios
            .put("/digital_artDB/category/update", category);
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);

        throw error;
    }

};
 
export const deleteCategory = async (id) => {

  try {
        const response = await axios

            .delete(`/digital_artDB/category/delete/${id}`);
        return response.status === 200;
    } catch (error) {
        console.error("Error deleting category:", error);

        throw error;
    }

};
 
export const getAllCategories = async () => {

  try {
        const response = await axios

            .get("/digital_artDB/category/getAll");
        return response.data;
    } catch (error) {
        console.error("Error fetching all categories:", error);

        throw error;
    }

};
 