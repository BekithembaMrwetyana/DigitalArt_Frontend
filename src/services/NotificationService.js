import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8080/digital_artDB";

export const getAllNotifications = async (userId) => {
  const response = await axios.get(/notifications/getAll/${userId});
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  await axios.put(/notifications/${notificationId}/mark-as-read);
};