import axios from "axios";

const BASE_URL = "http://localhost:8080/digital_artDB/inventory";


export default {
  /**
   * GET all inventory items
   */
  getAll() {
    return axios.get(`${BASE_URL}/getAll`)
      .then(res => res.data)
      .catch(err => {
        console.error("Error fetching inventories:", err);
        throw err;
      });
  },

  /**
   * CREATE a new inventory item
   * inventory format: { productID: 1, quantity: 10 } OR { product: { productID: 1 }, quantity: 10 }
   */
  create(inventory) {
    const payload = {
      product: { productID: inventory.productID || inventory.product?.productID },
      quantity: inventory.quantity
    };

    return axios.post(`${BASE_URL}/create`, payload)
      .then(res => res.data)
      .catch(err => {
        console.error("Error creating inventory:", err);
        throw err;
      });
  },

  /**
   * UPDATE an existing inventory item
   * id = inventoryID of the item to update
   * inventory format: same as create
   */
  update(id, inventory) {
    const payload = {
      product: { productID: inventory.productID || inventory.product?.productID },
      quantity: inventory.quantity
    };

    return axios.put(`${BASE_URL}/update/${id}`, payload)
      .then(res => res.data)
      .catch(err => {
        console.error(`Error updating inventory ID ${id}:`, err);
        throw err;
      });
  },

  /**
   * DELETE an inventory item by ID
   */
  delete(id) {
    return axios.delete(`${BASE_URL}/delete/${id}`)
      .catch(err => {
        console.error(`Error deleting inventory ID ${id}:`, err);
        throw err;
      });
  }
};
