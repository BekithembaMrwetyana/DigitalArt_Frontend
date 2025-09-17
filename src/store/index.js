import { createStore } from 'vuex'
import products from './modules/products'
import ui from './modules/ui'
//import cart from './modules/cart'
import Cart from './modules/Cart'
import wishlist from './modules/wishlist'
import Auth from './modules/Auth'
import Orders from "./modules/Orders";

export default createStore({
  modules: {
    products,
    ui,
    Auth,
    Cart,
    wishlist,
    Orders
  }
})
