<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="isVisible"
        class="modal-overlay"
        @click="handleOverlayClick"
        @keydown.esc="closeModal"
        tabindex="0"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div
          class="modal-container"
          :class="[
            `modal-${size}`,
            { 'modal-fullscreen': fullscreen }
          ]"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="modal-header" v-if="showHeader">
            <h2 :id="titleId" class="modal-title" v-if="title">
              {{ title }}
            </h2>
            <slot name="header" v-else-if="$slots.header"></slot>
            <button
              v-if="showCloseButton"
              @click="closeModal"
              class="modal-close"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="modal-body" :class="{ 'no-padding': noPadding }">
            <slot></slot>
          </div>
          
          <!-- Modal Footer -->
          <div class="modal-footer" v-if="$slots.footer || showDefaultFooter">
            <slot name="footer">
              <div v-if="showDefaultFooter" class="default-footer">
                <button @click="closeModal" class="btn btn-secondary">
                  {{ cancelText }}
                </button>
                <button 
                  @click="confirmAction" 
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  {{ loading ? loadingText : confirmText }}
                </button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Modal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large', 'extra-large'].includes(value)
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    persistent: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    showDefaultFooter: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    loadingText: {
      type: String,
      default: 'Loading...'
    },
    loading: {
      type: Boolean,
      default: false
    },
    noPadding: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'close', 'confirm', 'opened', 'closed'],
  setup(props, { emit }) {
    const store = useStore()
    
    const isVisible = computed({
      get: () => props.modelValue || store.getters['ui/isModalOpen'],
      set: (value) => emit('update:modelValue', value)
    })
    
    const titleId = ref(`modal-title-${Date.now()}`)
    
    const closeModal = () => {
      if (!props.persistent) {
        isVisible.value = false
        store.dispatch('ui/closeModal')
        emit('close')
        emit('update:modelValue', false)
      }
    }
    
    const handleOverlayClick = () => {
      if (!props.persistent) {
        closeModal()
      }
    }
    
    const confirmAction = () => {
      emit('confirm')
    }
    
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isVisible.value && !props.persistent) {
        closeModal()
      }
    }
    
    const focusModal = async () => {
      await nextTick()
      const modalElement = document.querySelector('.modal-overlay')
      if (modalElement) {
        modalElement.focus()
      }
    }
    
    // Watch for visibility changes
    watch(isVisible, async (newValue) => {
      if (newValue) {
        document.body.style.overflow = 'hidden'
        await focusModal()
        emit('opened')
      } else {
        document.body.style.overflow = ''
        emit('closed')
      }
    })
    
    // Cleanup on unmount
    onUnmounted(() => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscapeKey)
    })
    
    onMounted(() => {
      document.addEventListener('keydown', handleEscapeKey)
    })
    
    return {
      isVisible,
      titleId,
      closeModal,
      handleOverlayClick,
      confirmAction
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  outline: none;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 2rem;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-small {
  width: 100%;
  max-width: 400px;
}

.modal-medium {
  width: 100%;
  max-width: 600px;
}

.modal-large {
  width: 100%;
  max-width: 800px;
}

.modal-extra-large {
  width: 100%;
  max-width: 1200px;
}

.modal-fullscreen {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  border-radius: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e5e5;
  background: #f8f9fa;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.modal-body.no-padding {
  padding: 0;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e5e5;
  background: #f8f9fa;
}

.default-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-50px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Transition Classes */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-50px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    margin: 1rem;
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem 1.5rem;
  }
  
  .modal-small,
  .modal-medium,
  .modal-large,
  .modal-extra-large {
    max-width: none;
    width: 100%;
  }
  
  .default-footer {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-container {
    margin: 0.5rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
}
</style>