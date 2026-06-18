<template>
    <div>
      <h1>Table of Contents</h1>
      <div class="accordion">
        <div v-for="(book, bookIndex) in tocData" :key="bookIndex" class="accordion-item">
          <button class="accordion-header" @click="toggleAccordion(bookIndex)">
            {{ book.title }}
          </button>
          <div v-show="expandedBook === bookIndex" class="accordion-body">
            <div v-for="(halacha, halachaIndex) in book.halachos" :key="halachaIndex" class="accordion-item">
              <button class="accordion-header" @click="toggleSubAccordion(halachaIndex)">
                {{ halacha.title }}
              </button>
              <div v-show="expandedHalacha === halachaIndex" class="accordion-body">
                <ul>
                  <li v-for="perek in halacha.pereks" :key="perek.id">
                    <button @click="goToShiur(perek.id)">{{ perek.title }}</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tocData: [],
        expandedBook: null,
        expandedHalacha: null,
      };
    },
    created() {
      this.loadTocData();
    },
    methods: {
      async loadTocData() {
      try {
        this.tocData = await fetch('/src/assets/json/toc.json').then(res => res.json());
        console.log('TOC Data Loaded:', this.tocData); // Debugging
      } catch (error) {
        console.error('Error loading TOC:', error);
      }
    },
      toggleAccordion(index) {
        this.expandedBook = this.expandedBook === index ? null : index;
      },
      toggleSubAccordion(index) {
        this.expandedHalacha = this.expandedHalacha === index ? null : index;
      },
      goToShiur(newShiur) {
        this.$router.push({ name: 'chapter', params: { shiur: Number(newShiur) } });
      },
    }
  };
  </script>
  
  <style>
  .accordion-item {
    margin-bottom: 10px;
    width:100%;
    max-width: 550px;
    box-sizing: border-box;
  }
  .accordion-header {
    background: #ddd;
    padding: 10px;
    width: 100%;
    text-align: left;
    border: none;
    cursor: pointer;
  }
  .accordion-body {
    padding: 10px;
    width:550px;
    background: #f9f9f9;
  }
  </style>
  