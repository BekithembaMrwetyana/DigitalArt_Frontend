import axios from "axios";

const BASE_URL = "http://localhost:8080/ADP_Capstone_Project";

export const getAllCartItems = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${BASE_URL}/cartItem/getAll`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching cart items:", error);
        throw error;
    }
};

export const getCartItemById = async (id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${BASE_URL}/cartItem/read/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching cart item with ID ${id}:`, error);
        throw error;
    }
};

export const saveCartItem = async (cartItem) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(`${BASE_URL}/cartItem/save`, cartItem, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error saving cartItem:", error);
        throw error;
    }
};

export const updateCartItem = async (cartItem) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.put(`${BASE_URL}/cartItem/update`, cartItem, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating cart item:", error);
        throw error;
    }
};

export const deleteCartItem = async (id) => {
    const token = localStorage.getItem('token');

    try {
        await axios.delete(`${BASE_URL}/cartItem/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error(`Error deleting cart item with ID ${id}:`, error);
        throw error;
    }
};

export const getCartItemsByUserId = async (userId) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${BASE_URL}/cartItem/findByUser/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user's cart items:", error);
        throw error;
    }
};
