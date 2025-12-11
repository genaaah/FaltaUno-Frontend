import api from "./api";


export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
};

export const getCartByUserId = async (userId) => {
  try {
    const response = await api.get(`/products/${userId}/cart`);
    return response.data;
  } catch (error) {
    console.error('Error in getCartByUserId:', error);
    throw error;
  }
};

export const saveCartToServer = async (userId, cart) => {
  try {
    const response = await api.put(`/products/${userId}/cart`, cart);
    return response.data;
  } catch (error) {
    console.error('Error in saveCartToServer:', error);
    throw error;
  }
};
