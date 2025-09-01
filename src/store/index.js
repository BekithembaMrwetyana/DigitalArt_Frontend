import { createStore } from 'vuex'
import artworks from './modules/artworks'
import ui from './modules/ui'
// import cart from './modules/cart' 
import cart from './modules/Cart'

export default createStore({
  modules: {
    artworks,
    ui,
    // cart,
    cart,
    
  }
})
