<template>
  <div class="notifications-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <button @click="goBack" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back
        </button>
        <h1 class="page-title">Notifications</h1>
        <button v-if="hasNotifications" @click="showNewNoticeModal = true" class="new-notice-button">
          New notice
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Loading -->
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>

      <!-- Empty State (like first image) -->
      <div v-else-if="notifications.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <p class="empty-state-text">No notifications available</p>
      </div>

      <!-- Notifications Interface (like second image) -->
      <div v-else class="notifications-interface">
        <!-- Left Sidebar -->
        <div class="sidebar">
          <div class="sidebar-categories">
            <div 
              class="category-item" 
              :class="{ active: activeCategory === 'all' }"
              @click="activeCategory = 'all'"
            >
              <span>All</span>
              <span class="badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
            </div>
            <div 
              class="category-item"
              :class="{ active: activeCategory === 'notices' }"
              @click="activeCategory = 'notices'"
            >
              <span>Notices</span>
            </div>
            <div 
              class="category-item"
              :class="{ active: activeCategory === 'system' }"
              @click="activeCategory = 'system'"
            >
              <span>System messages</span>
              <span class="badge system-badge" v-if="systemMessagesCount > 0">{{ systemMessagesCount }}</span>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="content-area">
          <!-- Tab Headers -->
          <div class="tab-headers">
            <div 
              class="tab-header"
              :class="{ active: activeTab === 'unread' }"
              @click="activeTab = 'unread'"
            >
              Unread
            </div>
            <div 
              class="tab-header"
              :class="{ active: activeTab === 'read' }"
              @click="activeTab = 'read'"
            >
              Read
            </div>
            <div 
              class="tab-header"
              :class="{ active: activeTab === 'sent' }"
              @click="activeTab = 'sent'"
            >
              Messages sent
            </div>
          </div>

          <!-- Notifications List -->
          <div class="notifications-table">
            <!-- Table Headers -->
            <div class="table-header">
              <div class="col-sender">Sender</div>
              <div class="col-message">Message</div>
              <div class="col-date">Date</div>
            </div>

            <!-- Table Rows -->
            <div v-for="notification in filteredNotifications" :key="notification.notificationId" 
                 class="notification-row"
                 :class="{ 'unread-row': !notification.readStatus }"
                 @click="handleNotificationClick(notification)">
              
              <div class="col-sender">
                <div class="sender-info">
                  <div class="avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div class="sender-details">
                    <div class="sender-name">{{ notification.sender || 'Agent' }}</div>
                    <div class="sender-action">{{ notification.action || 'assigned a role to you' }}</div>
                  </div>
                </div>
              </div>

              <div class="col-message">
                <div class="message-content">
                  {{ notification.message || notification.subject }}
                </div>
              </div>

              <div class="col-date">
                {{ formatDate(notification.timestamp) }}
              </div>
            </div>

            <!-- Empty filtered results -->
            <div v-if="filteredNotifications.length === 0" class="empty-filtered">
              <p>No {{ activeTab }} notifications in {{ activeCategory === 'all' ? 'any category' : activeCategory }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New Notice Modal -->
    <transition name="modal">
      <div v-if="showNewNoticeModal" class="modal-container" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>Create New Notice</h2>
          <form @submit.prevent="createNotice">
            <div class="form-group">
              <label>Subject:</label>
              <input v-model="newNotice.subject" type="text" required>
            </div>
            <div class="form-group">
              <label>Message:</label>
              <textarea v-model="newNotice.message" rows="4" required></textarea>
            </div>
            <div class="form-actions">
              <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
              <button type="submit" class="submit-btn">Send Notice</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
//import { getAllNotifications, markNotificationAsRead } from '@/services/NotificationService';

export default {
  name: 'NotificationsList',
  data() {
    return {
      notifications: [],
      loading: true,
      activeCategory: 'all',
      activeTab: 'unread',
      showNewNoticeModal: false,
      newNotice: {
        subject: '',
        message: ''
      }
    }
  },
  computed: {
    hasNotifications() {
      return this.notifications.length > 0;
    },
    unreadCount() {
      return this.notifications.filter(n => !n.readStatus).length;
    },
    systemMessagesCount() {
      return this.notifications.filter(n => n.type === 'system' && !n.readStatus).length;
    },
    filteredNotifications() {
      let filtered = [...this.notifications];
      
      // Filter by category
      if (this.activeCategory === 'notices') {
        filtered = filtered.filter(n => n.type === 'notice' || !n.type);
      } else if (this.activeCategory === 'system') {
        filtered = filtered.filter(n => n.type === 'system');
      }
      
      // Filter by read status
      if (this.activeTab === 'unread') {
        filtered = filtered.filter(n => !n.readStatus);
      } else if (this.activeTab === 'read') {
        filtered = filtered.filter(n => n.readStatus);
      } else if (this.activeTab === 'sent') {
        filtered = filtered.filter(n => n.sent);
      }
      
      return filtered;
    }
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
    async fetchNotifications() {
      try {
        this.loading = true;
        
        // Try to fetch from API first
        try {
          const data = await getAllNotifications();
          
          // Process API data
          this.notifications = data.map(notification => ({
            ...notification,
            sender: notification.sender || 'Agent',
            action: notification.action || 'changed your role status',
            type: notification.type || 'notice',
            sent: notification.sent || false
          }));
          
          console.log('Successfully fetched notifications from API:', this.notifications.length);
        } catch (apiError) {
          console.warn('API unavailable, using fallback data:', apiError.message);
          
          // Fallback to mock data when API is unavailable
          this.notifications = [
            {
              notificationId: 1,
              sender: 'Agent',
              action: 'changed your role status',
              subject: 'Role Updated',
              message: 'Your role has been updated to Administrator (No.2198895)',
              timestamp: new Date().toISOString(),
              readStatus: false,
              type: 'notice'
            },
            {
              notificationId: 2,
              sender: 'Agent',
              action: 'assigned a role to you',
              subject: 'New Role Assignment',
              message: 'You have been assigned as Project Manager (No.2198895)',
              timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              readStatus: false,
              type: 'notice'
            },
            {
              notificationId: 3,
              sender: 'Agent',
              action: 'assigned a role to you',
              subject: 'Role Assignment',
              message: 'You have been assigned to the Development team (No.1713650)',
              timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
              readStatus: false,
              type: 'notice'
            },
            {
              notificationId: 4,
              sender: 'System',
              action: 'system notification',
              subject: 'System Maintenance',
              message: 'Scheduled maintenance completed successfully',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              readStatus: true,
              type: 'system'
            },
            {
              notificationId: 5,
              sender: 'Agent',
              action: 'sent you a message',
              subject: 'Welcome Message',
              message: 'Welcome to the platform! Please review your assigned tasks.',
              timestamp: new Date(Date.now() - 172800000).toISOString(),
              readStatus: true,
              type: 'notice',
              sent: true
            }
          ];
        }
        
        // If still no notifications, keep empty array for empty state
        if (!this.notifications || this.notifications.length === 0) {
          this.notifications = [];
        }
        
      } catch (error) {
        console.error('Error in fetchNotifications:', error);
        this.notifications = [];
      } finally {
        this.loading = false;
      }
    },
    
    async handleNotificationClick(notification) {
      if (!notification.readStatus) {
        await this.markAsRead(notification.notificationId);
      }
    },
    
    async markAsRead(notificationId) {
      try {
        // Try API call first
        try {
          await markNotificationAsRead(notificationId);
          console.log('Successfully marked notification as read via API');
        } catch (apiError) {
          console.warn('API unavailable, marking as read locally:', apiError.message);
          // Continue with local update even if API fails
        }
        
        // Always update local state
        const notification = this.notifications.find(n => n.notificationId === notificationId);
        if (notification) {
          notification.readStatus = true;
          console.log(`Notification ${notificationId} marked as read locally`);
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(',', '');
    },
    
    goBack() {
      window.history.back();
    },
    
    closeModal() {
      this.showNewNoticeModal = false;
      this.newNotice = { subject: '', message: '' };
    },
    
    createNotice() {
      // Handle creating new notice
      console.log('Creating notice:', this.newNotice);
      this.closeModal();
    }
  }
}
</script>

<style scoped>
.notifications-container {
  min-height: 100vh;
  background-color: #1e293b;
  color: #e2e8f0;
}

.header {
  background-color: #334155;
  border-bottom: 1px solid #475569;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  display: flex;
  align-items: center;
  color: #e2e8f0;
  padding: 8px 12px;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.back-button:hover {
  color: #60a5fa;
  background-color: #475569;
}
.back-button svg { 
  width: 20px; 
  height: 20px; 
  margin-right: 8px; 
}

.page-title { 
  font-size: 24px; 
  font-weight: 600; 
  color: #f8fafc; 
}

.new-notice-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}
.new-notice-button:hover {
  background-color: #2563eb;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Loading & Empty States */
.loading-spinner { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  padding: 48px 0; 
}
.spinner {
  width: 48px; 
  height: 48px;
  border: 3px solid #475569;
  border-bottom-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-state {
  background: #334155; 
  border-radius: 8px; 
  padding: 48px;
  text-align: center;
  margin-top: 40px;
}
.empty-state svg { 
  width: 64px; 
  height: 64px; 
  margin: 0 auto 16px; 
  color: #64748b; 
}
.empty-state-text { 
  color: #94a3b8; 
  font-size: 18px; 
}

/* Notifications Interface */
.notifications-interface {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  min-height: 600px;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #334155;
  border-radius: 8px;
  padding: 20px 0;
}

.sidebar-categories {
  display: flex;
  flex-direction: column;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: #cbd5e1;
}
.category-item:hover {
  background-color: #475569;
  color: #e2e8f0;
}
.category-item.active {
  background-color: #3b82f6;
  color: white;
}

.badge {
  background-color: #3b82f6;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}
.system-badge {
  background-color: #f59e0b;
}

/* Content Area */
.content-area {
  flex: 1;
  background-color: #334155;
  border-radius: 8px;
  overflow: hidden;
}

/* Tab Headers */
.tab-headers {
  display: flex;
  background-color: #475569;
  border-bottom: 1px solid #64748b;
}

.tab-header {
  flex: 1;
  padding: 16px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #cbd5e1;
  border-bottom: 3px solid transparent;
}
.tab-header:hover {
  background-color: #52525b;
  color: #e2e8f0;
}
.tab-header.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background-color: #334155;
}

/* Notifications Table */
.notifications-table {
  background-color: #334155;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 3fr 1.5fr;
  gap: 20px;
  padding: 16px 20px;
  background-color: #475569;
  color: #94a3b8;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.notification-row {
  display: grid;
  grid-template-columns: 2fr 3fr 1.5fr;
  gap: 20px;
  padding: 16px 20px;
  border-bottom: 1px solid #475569;
  cursor: pointer;
  transition: all 0.2s;
}
.notification-row:hover {
  background-color: #3f4f5f;
}
.notification-row.unread-row {
  background-color: #1e3a5f;
  border-left: 4px solid #3b82f6;
}

/* Sender Column */
.sender-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: #64748b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar svg {
  width: 18px;
  height: 18px;
  color: #e2e8f0;
}

.sender-details {
  flex: 1;
}
.sender-name {
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 2px;
}
.sender-action {
  font-size: 13px;
  color: #94a3b8;
}

/* Message Column */
.message-content {
  color: #e2e8f0;
  line-height: 1.4;
}

/* Date Column */
.col-date {
  color: #94a3b8;
  font-size: 14px;
  text-align: right;
}

.empty-filtered {
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
}

/* Modal */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: #334155;
  border-radius: 8px;
  padding: 32px;
  width: 500px;
  max-width: 90vw;
}

.modal-content h2 {
  color: #f8fafc;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #e2e8f0;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  background-color: #475569;
  border: 1px solid #64748b;
  border-radius: 6px;
  color: #f8fafc;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #64748b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #2563eb;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-interface {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .sidebar-categories {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .category-item {
    white-space: nowrap;
    min-width: 120px;
  }
  
  .table-header,
  .notification-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .col-date {
    text-align: left;
  }
}
</style>