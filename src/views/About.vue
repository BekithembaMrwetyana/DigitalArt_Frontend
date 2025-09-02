<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
    <!-- Card -->
    <div class="bg-white shadow-2xl rounded-2xl max-w-5xl w-full p-10">
      <!-- Hero Section -->
      <section class="about-hero text-center">
        <h1 class="text-5xl font-extrabold mb-6 text-gray-800 tracking-wide relative inline-block">
          About Us
          <span class="block w-20 h-1 bg-indigo-500 mx-auto mt-3 rounded"></span>
        </h1>
        <p class="text-lg max-w-2xl mx-auto text-gray-600 leading-relaxed">
          Welcome to our platform! We are dedicated to providing a smooth and enjoyable
          experience for our users. Our goal is to make browsing, shopping, and connecting
          with us simple and engaging.
        </p>
      </section>

      <!-- Content Section -->
      <section class="about-content mt-16 grid md:grid-cols-2 gap-10 text-left">
        <div class="p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
          <h2 class="text-2xl font-semibold mb-3 text-gray-800 relative">
            Our Mission
            <span class="absolute left-0 -bottom-1 w-12 h-1 bg-indigo-400 rounded"></span>
          </h2>
          <p class="text-gray-700 leading-relaxed mt-4">
            Our mission is to deliver high-quality services and create value for our
            customers. We aim to build long-lasting relationships through trust,
            transparency, and innovation.
          </p>
        </div>

        <div class="p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
          <h2 class="text-2xl font-semibold mb-3 text-gray-800 relative">
            Our Vision
            <span class="absolute left-0 -bottom-1 w-12 h-1 bg-pink-400 rounded"></span>
          </h2>
          <p class="text-gray-700 leading-relaxed mt-4">
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
