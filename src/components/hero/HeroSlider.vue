<template>
  <div class="hero-slider" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
    <div class="slider-container">
      <div 
        class="slider-wrapper" 
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div
          v-for="(slide, index) in slides"
          :key="slide.id || index"
          class="slide"
          :class="{ active: index === currentSlide }"
        >
          <div class="slide-background">
            <img
              :src="slide.image"
              :alt="slide.title"
              class="slide-image"
              @load="onImageLoad"
            />
            <div class="slide-overlay"></div>
          </div>
          
          <div class="slide-content">
            <div class="content-wrapper">
              <h1 class="slide-title" v-if="slide.title">{{ slide.title }}</h1>
              <p class="slide-subtitle" v-if="slide.subtitle">{{ slide.subtitle }}</p>
              <p class="slide-description" v-if="slide.description">{{ slide.description }}</p>
              
              <div class="slide-actions" v-if="slide.buttons">
                <button
                  v-for="(button, btnIndex) in slide.buttons"
                  :key="btnIndex"
                  @click="handleButtonClick(button)"
                  :class="['btn', `btn-${button.type || 'primary'}`]"
                >
                  {{ button.text }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Navigation Arrows -->
      <button
        v-if="showArrows && slides.length > 1"
        @click="prevSlide"
        class="nav-arrow nav-arrow-prev"
        :disabled="currentSlide === 0 && !infinite"
      >
        ‹
      </button>
      
      <button
        v-if="showArrows && slides.length > 1"
        @click="nextSlide"
        class="nav-arrow nav-arrow-next"
        :disabled="currentSlide === slides.length - 1 && !infinite"
      >
        ›
      </button>
      
      <!-- Slide Indicators -->
      <div v-if="showDots && slides.length > 1" class="slide-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="`dot-${index}`"
          @click="goToSlide(index)"
          :class="['indicator', { active: index === currentSlide }]"
        >
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'

export default {
  name: 'HeroSlider',
  props: {
    slides: {
      type: Array,
      required: true,
      default: () => []
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    autoplayDelay: {
      type: Number,
      default: 5000
    },
    infinite: {
      type: Boolean,
      default: true
    },
    showArrows: {
      type: Boolean,
      default: true
    },
    showDots: {
      type: Boolean,
      default: true
    },
    transitionDuration: {
      type: Number,
      default: 500
    }
  },
  emits: ['slide-change', 'button-click'],
  setup(props, { emit }) {
    const currentSlide = ref(0)
    const autoplayTimer = ref(null)
    const isPaused = ref(false)
    
    const nextSlide = () => {
      if (currentSlide.value < props.slides.length - 1) {
        currentSlide.value++
      } else if (props.infinite) {
        currentSlide.value = 0
      }
      emit('slide-change', currentSlide.value)
    }
    
    const prevSlide = () => {
      if (currentSlide.value > 0) {
        currentSlide.value--
      } else if (props.infinite) {
        currentSlide.value = props.slides.length - 1
      }
      emit('slide-change', currentSlide.value)
    }
    
    const goToSlide = (index) => {
      currentSlide.value = index
      emit('slide-change', currentSlide.value)
    }
    
    const startAutoplay = () => {
      if (props.autoplay && props.slides.length > 1) {
        autoplayTimer.value = setInterval(() => {
          if (!isPaused.value) {
            nextSlide()
          }
        }, props.autoplayDelay)
      }
    }
    
    const stopAutoplay = () => {
      if (autoplayTimer.value) {
        clearInterval(autoplayTimer.value)
        autoplayTimer.value = null
      }
    }
    
    const pauseAutoplay = () => {
      isPaused.value = true
    }
    
    const resumeAutoplay = () => {
      isPaused.value = false
    }
    
    const handleButtonClick = (button) => {
      emit('button-click', {
        button,
        slideIndex: currentSlide.value,
        slide: props.slides[currentSlide.value]
      })
      
      // Handle built-in button actions
      if (button.action) {
        switch (button.action) {
          case 'next-slide':
            nextSlide()
            break
          case 'prev-slide':
            prevSlide()
            break
          case 'goto-slide':
            if (typeof button.target === 'number') {
              goToSlide(button.target)
            }
            break
        }
      }
    }
    
    const onImageLoad = (event) => {
      event.target.classList.add('loaded')
    }
    
    // Keyboard navigation
    const handleKeydown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          prevSlide()
          break
        case 'ArrowRight':
          nextSlide()
          break
        case ' ':
        case 'Spacebar':
          event.preventDefault()
          if (isPaused.value) {
            resumeAutoplay()
          } else {
            pauseAutoplay()
          }
          break
      }
    }
    
    // Watch for slides changes
    watch(() => props.slides, () => {
      if (currentSlide.value >= props.slides.length) {
        currentSlide.value = 0
      }
    })
    
    // Lifecycle hooks
    onMounted(() => {
      startAutoplay()
      document.addEventListener('keydown', handleKeydown)
    })
    
    onUnmounted(() => {
      stopAutoplay()
      document.removeEventListener('keydown', handleKeydown)
    })
    
    return {
      currentSlide,
      nextSlide,
      prevSlide,
      goToSlide,
      pauseAutoplay,
      resumeAutoplay,
      handleButtonClick,
      onImageLoad
    }
  }
}
</script>

<style scoped>
.hero-slider {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slider-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide {
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.slide-image.loaded {
  opacity: 1;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 2;
}

.slide-content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 2rem;
}

.content-wrapper {
  animation: slideInUp 0.8s ease-out;
}

.slide:not(.active) .content-wrapper {
  animation: none;
  opacity: 0;
  transform: translateY(30px);
}

.slide.active .content-wrapper {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.6s ease-out 0.3s;
}

.slide-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.slide-subtitle {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-weight: 300;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.slide-description {
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.slide-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #333;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 4;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-arrow:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-arrow-prev {
  left: 2rem;
}

.nav-arrow-next {
  right: 2rem;
}

.slide-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 4;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
}

.indicator:hover {
  transform: scale(1.2);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-slider {
    height: 70vh;
    min-height: 500px;
  }
  
  .slide-content {
    padding: 0 1rem;
  }
  
  .slide-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
  
  .nav-arrow {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .nav-arrow-prev {
    left: 1rem;
  }
  
  .nav-arrow-next {
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-slider {
    height: 60vh;
    min-height: 400px;
  }
  
  .nav-arrow {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .slide-indicators {
    bottom: 1rem;
  }
  
  .indicator {
    width: 10px;
    height: 10px;
  }
}
</style>