<template>
  <div class="contact">
    <div class="contact-header">
      <h1>Contact Us</h1>
      <p>Get in touch with our team for any questions or support</p>
    </div>
    
    <div class="contact-container">
      <div class="contact-form-section">
        <div class="form-card">
          <h2>Send us a Message</h2>
          <form @submit.prevent="submitContact">
            <div class="form-group">
              <label>Name</label>
              <input type="text" v-model="contact.name" required>
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="contact.email" required>
            </div>
            
            <div class="form-group">
              <label>Subject</label>
              <select v-model="contact.subject" required>
                <option value="">Select Subject</option>
                <option value="general">General Inquiry</option>
                <option value="artwork">Artwork Question</option>
                <option value="commission">Commission Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="artist">Artist Application</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Message</label>
              <textarea 
                v-model="contact.message" 
                placeholder="Tell us how we can help you..."
                required>
              </textarea>
            </div>
            
            <button type="submit" class="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
      
      <div class="contact-info-section">
        <div class="info-card">
          <h3>Get in Touch</h3>
          <div class="contact-item">
            <div class="contact-icon">📧</div>
            <div class="contact-details">
              <h4>Email</h4>
              <p>hello@artspace.com</p>
              <p>support@artspace.com</p>
            </div>
          </div>
          
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div class="contact-details">
              <h4>Phone</h4>
              <p>+22 (555) 123-4567</p>
              <p>Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>
          
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div class="contact-details">
              <h4>Address</h4>
              <p>123 Art Street</p>
              <p>Creative District, NY 10001</p>
            </div>
          </div>
        </div>
        
        <div class="social-card">
          <h3>Follow Us</h3>
          <div class="social-links">
            <a href="#" class="social-link">
              <div class="social-icon">📘</div>
              <span>Facebook</span>
            </a>
            <a href="#" class="social-link">
              <div class="social-icon">📸</div>
              <span>Instagram</span>
            </a>
            <a href="#" class="social-link">
              <div class="social-icon">🐦</div>
              <span>Twitter</span>
            </a>
            <a href="#" class="social-link">
              <div class="social-icon">💼</div>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
        
        <div class="faq-card">
          <h3>Quick Answers</h3>
          <div class="faq-item">
            <h4>How do I purchase artwork?</h4>
            <p>Browse our gallery, select an artwork, and click "Add to Cart" to purchase.</p>
          </div>
          <div class="faq-item">
            <h4>Can I commission custom art?</h4>
            <p>Yes! Visit our Commission page to request custom artwork from our artists.</p>
          </div>
          <div class="faq-item">
            <h4>What file formats do you provide?</h4>
            <p>We provide high-resolution files in PNG, JPG, and PDF formats.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Contact',
  setup() {
    const contact = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    
    const submitContact = () => {
      console.log('Contact form submitted:', contact.value)
      alert('Message sent successfully! We\'ll get back to you within 24 hours.')
      
      // Reset form
      contact.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
    
    return {
      contact,
      submitContact
    }
  }
}
</script>

<style scoped>
.contact {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.contact-header {
  text-align: center;
  color: white;
  padding: 2rem 0;
}

.contact-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.form-card, .info-card, .social-card, .faq-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.form-card h2 {
  color: #333;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2196F3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-group textarea {
  height: 120px;
  resize: vertical;
}

.submit-btn {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
}

.info-card h3, .social-card h3, .faq-card h3 {
  color: #333;
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.contact-icon {
  font-size: 1.5rem;
  background: #f5f5f5;
  padding: 0.8rem;
  border-radius: 10px;
}

.contact-details h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.contact-details p {
  color: #666;
  margin-bottom: 0.3rem;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: #333;
  padding: 0.8rem;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #f5f5f5;
  transform: translateX(5px);
}

.social-icon {
  font-size: 1.2rem;
}

.faq-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-item h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.faq-item p {
  color: #666;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
}
</style>