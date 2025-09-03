import { createStore } from 'vuex'
import products from './modules/products'
import ui from './modules/ui'
// import cart from './modules/cart'
import cart from './modules/Cart'
import wishlist from './modules/wishlist'

export default createStore({
  modules: {
    products,
    ui,
    
    cart,
    wishlist
  }
})
