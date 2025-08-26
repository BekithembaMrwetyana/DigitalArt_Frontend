<template>
  <div class="admin-dashboard">
    <div class="welcome-section">
      <h2>Welcome to Admin Dashboard</h2>
      <p>Manage your digital art gallery from here.</p>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fa fa-images"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.artworks }}</h3>
          <p>Total Artworks</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fa fa-users"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.artists }}</h3>
          <p>Artists</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fa fa-list"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.categories }}</h3>
          <p>Categories</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fa fa-calendar"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.exhibitions }}</h3>
          <p>Active Exhibitions</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="actions-grid">
        <router-link to="/admin/categories" class="action-card">
          <i class="fa fa-list"></i>
          <span>Manage Categories</span>
        </router-link>

        <div class="action-card" @click="placeholder('Add Artwork')">
          <i class="fa fa-plus"></i>
          <span>Add New Artwork</span>
        </div>

        <div class="action-card" @click="placeholder('Manage Artists')">
          <i class="fa fa-user-plus"></i>
          <span>Manage Artists</span>
        </div>

        <div class="action-card" @click="placeholder('View Reports')">
          <i class="fa fa-chart-bar"></i>
          <span>View Reports</span>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity">
      <h3>Recent Activity</h3>
      <div class="activity-list">
        <div class="activity-item" v-for="activity in recentActivity" :key="activity.id">
          <div class="activity-icon">
            <i :class="activity.icon"></i>
          </div>
          <div class="activity-details">
            <p class="activity-text">{{ activity.text }}</p>
            <small class="activity-time">{{ activity.time }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {
        artworks: 156,
        artists: 23,
        categories: 8,
        exhibitions: 3
      },
      recentActivity: [
        {
          id: 1,
          text: 'New artwork "Digital Dreams" added to gallery',
          time: '2 hours ago',
          icon: 'fa fa-plus text-green'
        },
        {
          id: 2,
          text: 'Artist profile "John Doe" updated',
          time: '4 hours ago',
          icon: 'fa fa-user text-blue'
        },
        {
          id: 3,
          text: 'Exhibition "Modern Visions" published',
          time: '1 day ago',
          icon: 'fa fa-calendar text-purple'
        },
        {
          id: 4,
          text: 'New category "Abstract Art" created',
          time: '2 days ago',
          icon: 'fa fa-list text-orange'
        }
      ]
    }
  },
  methods: {
    placeholder(action) {
      alert(`${action} functionality coming soon!`)
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  background: white;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.welcome-section {
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  text-align: center;
}

.welcome-section h2 {
  margin: 0 0 10px 0;
  font-size: 2rem;
}

.welcome-section p {
  margin: 0;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
}

.stat-info p {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.quick-actions, .recent-activity {
  padding: 0 30px 30px 30px;
}

.quick-actions h3, .recent-activity h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
}

.action-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #667eea;
}

.action-card i {
  font-size: 1.5rem;
  color: #667eea;
}

.activity-list {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-details {
  flex-grow: 1;
}

.activity-text {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.activity-time {
  color: #666;
  font-size: 0.85rem;
}

.text-green { color: #28a745; }
.text-blue { color: #007bff; }
.text-purple { color: #6f42c1; }
.text-orange { color: #fd7e14; }

/* Responsive Design */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-section {
    padding: 20px;
  }
  
  .welcome-section h2 {
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .quick-actions, .recent-activity {
    padding: 0 20px 20px 20px;
  }
}
</style>