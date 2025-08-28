<template>
  <div class="artwork-card" @click="$emit('click', artwork)">
    <!-- Artwork Image -->
    <div class="artwork-image">
      <img :src="artwork.image || placeholder" :alt="artwork.title" />
    </div>

    <!-- Artwork Info -->
    <div class="artwork-info">
      <h3>{{ artwork.title }}</h3>
      <p class="artist">by {{ artwork.artist }}</p>
      <p class="price">R{{ artwork.price }}</p>
      <p class="category">{{ artwork.category }}</p>
    </div>

    <!-- Wishlist Button -->
    <button
      class="wishlist-btn"
      :class="{ active: isWishlisted }"
      @click.stop="toggleWishlist"
    >
      <span class="heart">&#10084;</span>
    </button>

    <!-- Add to Cart Button -->
    <button class="cart-btn" @click.stop="addToCart">
      🛒 Add to Cart
    </button>

    <!-- Notification -->
    <div v-if="showNotification" class="notification">
      Added to wishlist!
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArtworkCard',
  props: {
    artwork: {
      type: Object,
      required: true
    }
  }, emits: ['click', 'add-to-cart'],
   data() {
     return { isWishlisted: false, showNotification: false };
   },
   methods: {
     toggleWishlist() {
       this.isWishlisted = !this.isWishlisted;
       // Show notification only when added to wishlist
       if (this.isWishlisted) {
         this.showNotification = true;
         setTimeout(() => {
           this.showNotification = false;
         }, 1500);
       }
     },
     addToCart() {
      this.$emit('add-to-cart', this.artwork); // parent handles Vuex/cart
    }
   }
}
</script>

<style scoped>
.artwork-card {
position: relative;
 background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  padding-bottom: 3rem; /* give space for bottom button */
}

.artwork-card:hover {
  transform: translateY(-5px);
}

.artwork-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.artwork-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artwork-info {
  padding: 1rem;
}

.artwork-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.artist {
  color: #666;
  margin: 0 0 0.5rem 0;
  font-style: italic;
}

.price {
  font-weight: bold;
  color: #2c5aa0;
  margin: 0 0 0.5rem 0;
}

.category {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
  text-transform: capitalize;
}

.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.wishlist-btn .heart {
  font-size: 24px;
  color: gray;
  transition: color 0.2s ease, transform 0.2s ease;
}

.wishlist-btn.active .heart {
  color: red;
}

.wishlist-btn:hover .heart {
  transform: scale(1.2);
}
/* Add to Cart Button */
.cart-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #2c5aa0;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background 0.2s ease;
}

.cart-btn:hover {
  background: #1f447a;
}


.notification {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: #2c5aa0;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  animation: fadeInOut 1.5s forwards;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  10% { opacity: 1; transform: translateX(-50%) translateY(0); }
  90% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
}
</style>
