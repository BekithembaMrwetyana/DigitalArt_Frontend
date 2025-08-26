<template>
  <div class="commission">
    <div class="commission-header">
      <h1>Commission Custom Art</h1>
      <p>Work directly with our talented artists to create your perfect digital artwork</p>
    </div>
    
    <div class="commission-container">
      <div class="commission-form-section">
        <div class="form-card">
          <h2>Request a Commission</h2>
          <form @submit.prevent="submitCommission">
            <div class="form-group">
              <label>Project Type</label>
              <select v-model="commission.type" required>
                <option value="">Select Type</option>
                <option value="portrait">Digital Portrait</option>
                <option value="landscape">Digital Landscape</option>
                <option value="abstract">Abstract Art</option>
                <option value="illustration">Custom Illustration</option>
                <option value="logo">Logo Design</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Preferred Artist</label>
              <select v-model="commission.artist">
                <option value="">Any Artist</option>
                <option value="alex">Alex Chen</option>
                <option value="maria">Maria Rodriguez</option>
                <option value="david">David Kim</option>
                <option value="sarah">Sarah Johnson</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Dimensions</label>
              <div class="dimension-inputs">
                <input type="number" v-model="commission.width" placeholder="Width" required>
                <span>x</span>
                <input type="number" v-model="commission.height" placeholder="Height" required>
                <select v-model="commission.unit">
                  <option value="px">Pixels</option>
                  <option value="in">Inches</option>
                  <option value="cm">Centimeters</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>Budget Range</label>
              <select v-model="commission.budget" required>
                <option value="">Select Budget</option>
                <option value="5 000-100">R5 000 - R10 000</option>
                <option value="100-250">R1 000 - R20 050</option>
                <option value="250-500">R2 500 - R5 000</option>
                <option value="500-1000">R50 000 - R100 000</option>
                <option value="1000+">R10 000+</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Timeline</label>
              <select v-model="commission.timeline" required>
                <option value="">Select Timeline</option>
                <option value="1-week">1 Week</option>
                <option value="2-weeks">2 Weeks</option>
                <option value="1-month">1 Month</option>
                <option value="2-months">2 Months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Project Description</label>
              <textarea 
                v-model="commission.description" 
                placeholder="Describe your vision, style preferences, colors, mood, and any specific requirements..."
                required>
              </textarea>
            </div>
            
            <div class="form-group">
              <label>Reference Images (Optional)</label>
              <input type="file" multiple accept="image/*" @change="handleFileUpload">
              <small>Upload any reference images that might help the artist understand your vision</small>
            </div>
            
            <div class="form-group">
              <label>Contact Information</label>
              <input type="text" v-model="commission.name" placeholder="Your Name" required>
              <input type="email" v-model="commission.email" placeholder="Your Email" required>
              <input type="tel" v-model="commission.phone" placeholder="Phone Number (Optional)">
            </div>
            
            <button type="submit" class="submit-btn">Submit Commission Request</button>
          </form>
        </div>
      </div>
      
      <div class="commission-info-section">
        <div class="info-card">
          <h3>How It Works</h3>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Submit Request</h4>
                <p>Fill out the commission form with your project details and requirements.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Artist Match</h4>
                <p>We'll match you with the perfect artist based on your project and preferences.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Collaboration</h4>
                <p>Work directly with the artist through our platform with regular updates.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h4>Final Delivery</h4>
                <p>Receive your custom artwork in high resolution with commercial rights.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pricing-card">
          <h3>Commission Pricing</h3>
          <div class="pricing-tiers">
            <div class="tier">
              <h4>Basic</h4>
              <div class="price">R50-R100</div>
              <ul>
                <li>Simple digital illustration</li>
                <li>Basic color palette</li>
                <li>2 revision rounds</li>
                <li>High-res delivery</li>
              </ul>
            </div>
            <div class="tier featured">
              <h4>Standard</h4>
              <div class="price">R100-R250</div>
              <ul>
                <li>Detailed digital artwork</li>
                <li>Custom color scheme</li>
                <li>4 revision rounds</li>
                <li>Multiple format delivery</li>
              </ul>
            </div>
            <div class="tier">
              <h4>Premium</h4>
              <div class="price">$250+</div>
              <ul>
                <li>Complex digital masterpiece</li>
                <li>Unlimited revisions</li>
                <li>Commercial license</li>
                <li>Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Commission',
  setup() {
    const commission = ref({
      type: '',
      artist: '',
      width: '',
      height: '',
      unit: 'px',
      budget: '',
      timeline: '',
      description: '',
      name: '',
      email: '',
      phone: '',
      files: []
    })
    
    const handleFileUpload = (event) => {
      commission.value.files = Array.from(event.target.files)
    }
    
    const submitCommission = () => {
      console.log('Commission submitted:', commission.value)
      // Here you would typically send the data to your backend
      alert('Commission request submitted successfully! We\'ll be in touch within 24 hours.')
      
      // Reset form
      commission.value = {
        type: '',
        artist: '',
        width: '',
        height: '',
        unit: 'px',
        budget: '',
        timeline: '',
        description: '',
        name: '',
        email: '',
        phone: '',
        files: []
      }
    }
    
    return {
      commission,
      handleFileUpload,
      submitCommission
    }
  }
}
</script>

<style scoped>
.commission {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.commission-header {
  text-align: center;
  color: white;
  padding: 2rem 0;
}

.commission-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.commission-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.form-card, .info-card, .pricing-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.form-card h2 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.5rem;
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

.dimension-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dimension-inputs input {
  flex: 1;
}

.dimension-inputs span {
  color: #666;
  font-weight: bold;
}

.form-group small {
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: block;
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

.info-card h3, .pricing-card h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-number {
  background: #2196F3;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.pricing-tiers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tier {
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
}

.tier.featured {
  border-color: #2196F3;
  background: rgba(33, 150, 243, 0.05);
}

.tier h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2196F3;
  margin-bottom: 1rem;
}

.tier ul {
  list-style: none;
  padding: 0;
}

.tier li {
  color: #666;
  font-size: 0.9rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.tier li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .commission-container {
    grid-template-columns: 1fr;
  }
}
</style>
