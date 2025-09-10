import { createStore } from 'vuex'
import products from './modules/products'
import ui from './modules/ui'
// import cart from './modules/cart'
import cart from './modules/Cart'
import wishlist from './modules/wishlist'
import auth from './modules/Auth'


export default createStore({
  modules: {
    products,
    ui,
    auth,
    cart,
    wishlist
  }
})
