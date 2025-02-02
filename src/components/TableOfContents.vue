<template>
    <div>
      <div v-for="(book, index) in books" :key="index">
        <h2>{{ book.book }}</h2>
        <div v-for="(halacha, halachaIndex) in book.halachos" :key="halachaIndex">
          <h3 @click="toggleHalacha(halachaIndex)">{{ halacha.title }}</h3>
          <div v-show="activeHalacha === halachaIndex">
            <div v-for="(perek, perekIndex) in halacha.perek" :key="perekIndex">
              <h4 @click="goToChapter(perek.shiur)">{{ perek.title }}</h4>
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
        books: [],
        activeHalacha: null,
      };
    },
    props: {
      jsonData: Array,
    },
    methods: {
      toggleHalacha(index) {
        this.activeHalacha = this.activeHalacha === index ? null : index;
      },
      goToChapter(shiur) {
        this.$router.push({ name: 'chapter', params: { shiur } });
      },
    },
    created() {
      this.books = this.jsonData;
    },
  };
  </script>
  