# Digital Art Gallery - Vue.js Application

A modern, responsive digital art gallery built with Vue.js 3, featuring artwork browsing, artist profiles, commission system, and more.

## 🚀 Features

- **Modern Vue.js 3** with Composition API
- **Responsive Design** - Works on all devices
- **Artwork Gallery** with filtering and search
- **Artist Profiles** and portfolios
- **Commission System** for custom artwork
- **Event Management** for exhibitions and workshops
- **Contact System** with inquiry forms
- **State Management** with Vuex
- **Routing** with Vue Router
- **API Integration** ready

## 📁 Project Structure

```
src/
├── views/          # Page components
├── components/     # Reusable components
├── composables/    # Vue 3 composition functions
├── store/          # Vuex store modules
├── services/       # API service layer
├── utils/          # Utility functions
├── assets/         # Static assets and styles
└── router/         # Router configuration
```

## 🛠 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-art-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Features Overview

### Pages
- **Home** - Hero slider with featured artworks
- **Gallery** - Browse all artworks with filters
- **Artists** - Featured artist profiles
- **Collections** - Curated artwork collections  
- **Exhibitions** - Current and upcoming exhibitions
- **Events** - Art events and workshops
- **Commission** - Custom artwork requests
- **Contact** - Contact form and information

### Components
- **ArtworkCard** - Individual artwork display
- **ArtworkGrid** - Grid layout for artworks
- **ArtworkFilter** - Search and filter controls
- **HeroSlider** - Rotating hero banners
- **Modal** - Popup for artwork details
- **Navigation** - Site navigation
- **Header** - Site header with search

### State Management
- **Artworks Module** - Artwork data and filters
- **UI Module** - UI state (modals, tabs, etc.)
- **Auth Module** - User authentication (ready for implementation)

## 🔧 Customization

### Adding New Artworks
Edit `store/modules/artworks.js` to add new artwork data:

```javascript
{
  id: 7,
  title: 'New Artwork',
  artist: 'Artist Name',
  category: 'digital',
  price: 299,
  type: 'featured',
  gradient: 'linear-gradient(45deg, #color1, #color2)',
  description: 'Artwork description...'
}
```

### Styling
- Main styles: `assets/styles/main.css`
- CSS variables for theming in `:root`
- Component-specific styles are scoped

### API Integration
- Service files in `services/` directory
- Configure API base URL in `services/api.js`
- Uncomment API calls in store actions

## 📱 Responsive Design

- **Mobile-first approach**
- **CSS Grid and Flexbox** layouts
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## 🎯 Next Steps

1. **Backend Integration** - Connect to your art gallery API
2. **User Authentication** - Implement login/register system
3. **Payment Processing** - Add payment gateway for purchases
4. **Admin Panel** - Content management system
5. **Search Enhancement** - Advanced search with filters
6. **Performance** - Image optimization and lazy loading

## 📄 License

This project is licensed under the MIT License.