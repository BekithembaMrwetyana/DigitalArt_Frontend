import axios from "axios";

const BASE_URL = "http://localhost:8080/ADP_Capstone_Project/payment";

export const createPayment = async (paymentData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${BASE_URL}/save`, paymentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const getPaymentsByUserId = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};
