# TODO: Connect Frontend to Backend

## Step 1: Update src/store/modules/products.js ✅
- Change BACKEND_URL to 'http://localhost:8080/digital_artDB/api' ✅
- Change API endpoint from /getAll to /products ✅
- Fix image URL construction to 'http://localhost:8080/digital_artDB${product.imageUrl}' ✅
- Add fallback to use base64 "image" if imageUrl is not available ✅

## Step 2: Update src/views/Gallery.vue ✅
- Add onMounted to dispatch fetchProducts when the component mounts ✅

## Step 3: Update src/views/Home.vue
- Pass products from store to ProductGrid as artworks prop (temporary)
- Add onMounted to dispatch fetchProducts

## Step 4: Update src/components/product/ProductGrid.vue
- Rename artworks prop to products for consistency
- Update all references from artworks to products
- Update src/views/Home.vue to pass products instead of artworks

## Step 5: Update src/components/product/ProductCard.vue
- Add fallback for base64 image if regular image fails to load
