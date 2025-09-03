import axios from "axios";

const BASE_URL = "http://localhost:8080/payment";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/create`, paymentData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const getPaymentById = async (paymentID) => {
  try {
    const response = await axios.get(`${BASE_URL}/read/${paymentID}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }
};

export const updatePayment = async (paymentID, paymentData) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${paymentID}`, paymentData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

export const deletePayment = async (paymentID) => {
  try {
    await axios.delete(`${BASE_URL}/delete/${paymentID}`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};

export const getAllPayments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAll`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all payments:", error);
    throw error;
  }
};
