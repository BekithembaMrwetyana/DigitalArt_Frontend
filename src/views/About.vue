<template>
  <div class="about-page">
    <div class="about-card">
      <section class="about-hero">
        <h1>
          About Us
          <span class="underline"></span>
        </h1>
        <p>
          Welcome to our platform! We are dedicated to providing a smooth and enjoyable
          experience for our users. Our goal is to make browsing, shopping, and connecting
          with us simple and engaging.
        </p>
      </section>

      <section class="about-content">
        <div class="about-box">
          <h2>
            Our Mission
            <span class="underline mission"></span>
          </h2>
          <p>
            Our mission is to deliver high-quality services and create value for our
            customers. We aim to build long-lasting relationships through trust,
            transparency, and innovation.
          </p>
        </div>

        <div class="about-box">
          <h2>
            Our Vision
            <span class="underline vision"></span>
          </h2>
          <p>
            We envision a platform where technology meets creativity, making it easy
            for everyone to find exactly what they need and enjoy the journey.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
};
</script>

<style scoped>
.about-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
}

.about-card {
  background: #fff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  max-width: 1000px;
  width: 100%;
  padding: 40px;
}

.about-hero {
  text-align: center;
}

.about-hero h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: #1f2937;
  position: relative;
  display: inline-block;
}

.about-hero .underline {
  display: block;
  width: 80px;
  height: 4px;
  background: #6366f1;
  margin: 10px auto 0;
  border-radius: 2px;
}

.about-hero p {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  color: #4b5563;
  line-height: 1.6;
}

.about-content {
  margin-top: 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.about-box {
  padding: 30px;
  background: #f9fafb;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.about-box:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

.about-box h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
  position: relative;
  display: inline-block;
}

.about-box .underline {
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 50px;
  height: 3px;
  border-radius: 2px;
}

.about-box .mission {
  background: #6366f1;
}

.about-box .vision {
  background: #ec4899;
}

.about-box p {
  margin-top: 16px;
  color: #374151;
  line-height: 1.6;
}
</style>
