<template>
  <div class="notifications-container">
    <header class="header">
      <div class="header-content">
        <button @click="goBack" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 class="page-title">Notifications</h1>
        <div style="width: 88px"></div>
      </div>
    </header>

    <main class="main-content">
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>

      <div v-else-if="notifications.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p class="empty-state-text">No notifications available</p>
      </div>

      <div v-else class="notifications-list">
        <div v-for="notification in notifications" :key="notification.notificationId" class="notification-card">
          <div class="notification-content">
            <div class="notification-header">
              <div>
                <h3 class="notification-title">{{ notification.title }}</h3>
                <p class="notification-message">{{ notification.message }}</p>
                <div class="notification-meta">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ formatTimestamp(notification.createdAt) }}</span>
                </div>
              </div>
              <button @click="markAsRead(notification.notificationId)" 
                      :disabled="notification.status"
                      class="read-button">
                {{ notification.status ? 'Read' : 'Mark as Read' }}
              </button>
            </div>
            <div class="notification-status" :class="{ 'unread': !notification.status }">
              <div v-if="!notification.status" class="unread-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { markNotificationAsRead } from '@/services/NotificationService';
import axios from 'axios';

export default {
  name: 'NotificationsList',
  data() {
    return {
      notifications: [],
      loading: true,
      showPopup: false
    }
  },
  created() {
    console.log('Full Auth state:', this.$store.state.Auth);
    console.log('User object:', this.$store.state.Auth?.user);

    this.fetchNotifications();
    this.showPopup = true;
  },
  methods: {
    async fetchNotifications() {
      try {
        // Fetch ALL notifications for admin panel
        const response = await axios.get("http://localhost:8080/digital_artDB/notifications/getAll");
        this.notifications = response.data;
        console.log("All notifications:", this.notifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(notificationId) {
      try {
        await markNotificationAsRead(notificationId);
        const notification = this.notifications.find(n => n.notificationId === notificationId);
        if (notification) {
          notification.status = true;
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },

    formatTimestamp(timestamp) {
      if (!timestamp) return 'Unknown time';
      
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = Math.abs(now - date) / 36e5;

      if (diffInHours < 24) {
        return date.toLocaleTimeString();
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString();
      }
    },

    goBack() {
      window.history.back();
    },

    closePopup() {
      this.showPopup = false;
    }
  }
}
</script>

<style scoped>
.notifications-container {
  min-height: 100vh;
  background-color: #f1f5f9;
  padding: 20px;
}

.header {
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  display: flex;
  align-items: center;
  color: #4b5563;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  border: none;
  background: none;
  cursor: pointer;
}

.back-button:hover {
  color: #0d8822;
  background-color: #f3f4f6;
}

.back-button svg {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
}

.main-content {
  max-width: 1280px;
  margin: 24px auto;
  padding: 0 20px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #4B5563;
  border-bottom-color: #08c217;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-state {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 32px;
  text-align: center;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #9ca3af;
}

.empty-state-text {
  color: #6b7280;
  font-size: 18px;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-card {
  background-color: #aaf5ba;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  overflow: hidden;
}

.notification-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.notification-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-grow: 1;
  gap: 20px;
}

.notification-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.notification-message {
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 12px;
}

.notification-meta {
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 14px;
}

.notification-meta svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.read-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.read-button:not(:disabled) {
  background-color: #ec2727;
  color: #f7f8ef;
}

.read-button:not(:disabled):hover {
  background-color: #54da75;
}

.read-button:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.notification-status {
  width: 8px;
  height: 100%;
  background-color: transparent;
  border-radius: 0 8px 8px 0;
  margin-left: 12px;
}

.notification-status.unread {
  background-color: #3B82F6;
}

.unread-indicator {
  width: 100%;
  height: 100%;
  border-radius: 0 8px 8px 0;
  background-color: #3B82F6;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .header-content {
    padding: 0 16px;
  }

  .main-content {
    padding: 0 16px;
  }

  .notification-content {
    padding: 16px;
  }

  .notification-header {
    flex-direction: column;
    gap: 12px;
  }

  .notification-title {
    font-size: 16px;
  }

  .notification-message {
    font-size: 14px;
  }

  .read-button {
    align-self: flex-start;
  }
}
</style>