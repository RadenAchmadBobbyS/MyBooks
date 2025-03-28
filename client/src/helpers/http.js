import axios from "axios";

const http = axios.create({
  baseURL: 'https://mybooks.radendev.my.id/'
});

export default http

export const updatePaymentStatus = async (transactionId, status) => {
  try {
    const response = await http.patch(`/transactions/${transactionId}`, { paymentStatus: status });
    return response.data;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};
