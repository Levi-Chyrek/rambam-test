<template>
    <div>
      <h1>Select a Chapter</h1>
      <ul>
        <li v-for="i in numberOfChapters" :key="i">
          <button @click="goToChapter(i)">Go to Chapter {{ i }}</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        numberOfChapters: 5, // Adjust this number based on your chapters
        shiurForToday: null,
      };
    },
    async created() {
      await this.getShiurForToday();
    },
    methods: {
      async getShiurForToday() {
        try {
          const response = await fetch('/src/assets/json/date_to_shiur.json');
          const data = await response.json();
  
          const today = new Date();
          const year = today.getFullYear().toString();
          const month = today.toLocaleString('en-US', { month: 'long' }).toLowerCase(); // e.g., "january"
          const day = today.getDate().toString(); // e.g., "1"
  
          if (data[year] && data[year][0]?.reader1[0][month] && data[year][0]?.reader1[0][month][0][day]) {
            this.shiurForToday = data[year][0].reader1[0][month][0][day];
            this.goToChapter(this.shiurForToday);
          } else {
            console.error("Shiur for today not found.");
          }
        } catch (error) {
          console.error("Error loading date-to-shiur JSON:", error);
        }
      },
      goToChapter(shiur) {
        this.$router.push({ name: 'chapter', params: { shiur } });
      },
    },
  };
  </script>
  