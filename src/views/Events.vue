<template>
  <div class="events">
    <div class="events-header">
      <h1>Events & Sales</h1>
      <p>Join our art events and discover exclusive sales and promotions</p>
    </div>
    
    <div class="events-container">
      <div class="events-tabs">
        <button :class="{active: activeTab === 'events'}" @click="activeTab = 'events'">Upcoming Events</button>
        <button :class="{active: activeTab === 'sales'}" @click="activeTab = 'sales'">Current Sales</button>
        <button :class="{active: activeTab === 'workshops'}" @click="activeTab = 'workshops'">Workshops</button>
      </div>
      
      <div v-if="activeTab === 'events'" class="events-content">
        <div v-for="event in events" :key="event.id" class="event-card">
          <div class="event-date">
            <span class="month">{{ event.month }}</span>
            <span class="day">{{ event.day }}</span>
          </div>
          <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p class="event-time">{{ event.time }} | {{ event.location }}</p>
            <p>{{ event.description }}</p>
            <button class="register-btn">Register Now</button>
          </div>
        </div>
      </div>
      
      <div v-if="activeTab === 'sales'" class="sales-content">
        <div v-for="sale in sales" :key="sale.id" class="sale-card">
          <div class="sale-badge">{{ sale.discount }}% OFF</div>
          <h3>{{ sale.title }}</h3>
          <p>{{ sale.description }}</p>
          <div class="sale-timer">
            <span>Ends in: {{ sale.timeLeft }}</span>
          </div>
          <button class="shop-btn">Shop Now</button>
        </div>
      </div>
      
      <div v-if="activeTab === 'workshops'" class="workshops-content">
        <div v-for="workshop in workshops" :key="workshop.id" class="workshop-card">
          <h3>{{ workshop.title }}</h3>
          <div class="workshop-meta">
            <span>{{ workshop.date }}</span>
            <span>{{ workshop.duration }}</span>
            <span>R{{ workshop.price }}</span>
          </div>
          <p>{{ workshop.description }}</p>
          <div class="workshop-instructor">
            <strong>Instructor:</strong> {{ workshop.instructor }}
          </div>
          <button class="enroll-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Events',
  setup() {
    const activeTab = ref('events')
    
    const events = ref([
      {
        id: 1,
        title: 'Digital Art Showcase 2025',
        month: 'AUG',
        day: '25',
        time: '7:00 PM',
        location: 'Virtual Gallery',
        description: 'Join us for an exclusive showcase of the latest digital artworks from our featured artists.'
      },
      {
        id: 2,
        title: 'Artist Meet & Greet',
        month: 'SEP',
        day: '05',
        time: '3:00 PM',
        location: 'ArtSpace Studio',
        description: 'Meet your favorite digital artists and learn about their creative process.'
      }
    ])
    
    const sales = ref([
      {
        id: 1,
        title: 'Summer Digital Art Sale',
        discount: 30,
        description: 'Get 30% off on all digital artworks. Limited time offer!',
        timeLeft: '5 days 12 hours'
      },
      {
        id: 2,
        title: 'New Artist Collection',
        discount: 20,
        description: 'Discover new artists with 20% off their debut collections.',
        timeLeft: '2 days 8 hours'
      }
    ])
    
    const workshops = ref([
      {
        id: 1,
        title: 'Digital Art Fundamentals',
        date: 'Sep 10, 2025',
        duration: '4 hours',
        price: 10000,
        instructor: 'Alex Chen',
        description: 'Learn the basics of digital art creation using professional software and techniques.'
      },
      {
        id: 2,
        title: 'Advanced Color Theory',
        date: 'Sep 17, 2025',
        duration: '3 hours',
        price: 70000,
        instructor: 'Maria Rodriguez',
        description: 'Master color theory and its application in digital art composition.'
      }
    ])
    
    return {
      activeTab,
      events,
      sales,
      workshops
    }
  }
}
</script>

<style scoped>
.events {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.events-header {
  text-align: center;
  color: white;
  padding: 2rem 0;
}

.events-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.events-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.events-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.events-tabs button {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid white;
  padding: 1rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.events-tabs button.active,
.events-tabs button:hover {
  background: white;
  color: #2196F3;
}

.events-content, .sales-content, .workshops-content {
  display: grid;
  gap: 2rem;
}

.event-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 2rem;
}

.event-date {
  text-align: center;
  background: #2196F3;
  color: white;
  border-radius: 10px;
  padding: 1rem;
  min-width: 80px;
}

.event-date .month {
  display: block;
  font-size: 0.8rem;
  font-weight: bold;
}

.event-date .day {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
}

.event-info h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.event-time {
  color: #2196F3;
  font-weight: bold;
  margin-bottom: 1rem;
}

.event-info p {
  color: #666;
  margin-bottom: 1rem;
}

.register-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.register-btn:hover {
  background: #1976D2;
}

.sales-content {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.sale-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  position: relative;
  text-align: center;
}

.sale-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: #FF6B6B;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.sale-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.sale-timer {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
  color: #FF6B6B;
  font-weight: bold;
}

.shop-btn {
  background: #FF6B6B;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: all 0.3s ease;
}

.shop-btn:hover {
  background: #FF5252;
}

.workshops-content {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.workshop-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.workshop-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.workshop-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.workshop-meta span {
  background: #f5f5f5;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
}

.workshop-card p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.workshop-instructor {
  margin-bottom: 1.5rem;
  color: #333;
}

.enroll-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: all 0.3s ease;
}

.enroll-btn:hover {
  background: #45a049;
}
</style>
