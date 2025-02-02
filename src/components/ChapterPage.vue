<template>
    <div>
      <!-- Navigation buttons -->
      <div class="nav-buttons">
        <button @click="goToShiur(shiur - 1)" :disabled="shiur <= 1">Previous</button>
        <button @click="goToShiur(shiur + 1)">Next</button>
      </div>
  
      <h2 v-html="fullChapterTitle" class="halacha-title"></h2>
  
      <div v-if="chapterText.length > 0">
        <div v-for="(paragraph, index) in chapterText" :key="index" class="halpart">
          <p class="hebtext">
            <strong v-if="autonum" class="paragraph-number">{{ getHebrewNumber(index + startOffset) }}. </strong>
            <span v-html="paragraph[0]"></span>
          </p>
          <p class="entext">
            <strong v-if="autonum" class="paragraph-number">{{ getEnglishNumber(index + startOffset) }}. </strong>
            <span v-html="paragraph[1]"></span>
          </p>
        </div>
      </div>
      <p v-else>Loading chapter...</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        chapterTitle: '', // Halachos name
        chapterNumber: '', // Hebrew + English chapter number
        chapterText: [],
        autonum: true, // Default to true for automatic numbering
        startOffset: 0, // Keeps track of where the paragraph numbering starts
        hebrewNumbers: [
          'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
          'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז', 'יח', 'יט', 'כ',
          'כא', 'כב', 'כג', 'כד', 'כה', 'כו', 'כז', 'כח', 'כט', 'ל',
          'לא', 'לב', 'לג', 'לד', 'לה', 'לו', 'לז', 'לח', 'לט', 'מ', 
        ]
      };
    },
    props: {
      shiur: Number, // Global chapter number
    },
    computed: {
      fullChapterTitle() {
        return `${this.chapterTitle}<br>פרק ${this.chapterNumber} - Shiur ${this.shiur}`;
      }
    },
    watch: {
      shiur(newShiur) {
        this.loadChapter(newShiur);
      },
    },
    created() {
      this.loadChapter(this.shiur);
    },
    methods: {
      async loadChapter(shiur) {
        try {
          const mappingData = await fetch('/src/assets/json/chapter_mapping.json').then(res => res.json());
  
          if (!mappingData[shiur]) {
            console.error(`No mapping found for shiur ${shiur}`);
            return;
          }
  
          const { file, index, start, end } = mappingData[shiur];
  
          const hebrewData = await fetch(`/src/assets/json/${file}_he.json`).then(res => res.json());
          const englishData = await fetch(`/src/assets/json/${file}_en.json`).then(res => res.json());
  
          this.chapterTitle = hebrewData.heTitle;
          this.chapterNumber = this.getHebrewNumber(index);
  
          this.chapterText = this.mergeTexts(hebrewData.text[index], englishData.text[index]);
  
          if (start) {
            this.chapterText = this.chapterText.slice(start - 1);
            this.startOffset = start - 1;
          } else {
            this.startOffset = 0;
          }
  
          if (end) {
            this.chapterText = this.chapterText.slice(0, end - start + 1);
          }
  
          if (hebrewData.autonum !== undefined) {
            this.autonum = hebrewData.autonum;
          }
  
        } catch (error) {
          console.error('Error loading chapter data:', error);
        }
      },
      mergeTexts(hebrewText, englishText) {
        const maxLength = Math.max(hebrewText.length, englishText.length);
        return Array.from({ length: maxLength }, (_, i) => [hebrewText[i] || '', englishText[i] || '']);
      },
      getHebrewNumber(index) {
        return this.hebrewNumbers[index] || index + 1;
      },
      getEnglishNumber(index) {
        return index + 1;
      },
      goToShiur(newShiur) {
        const newShiurNumber = Number(newShiur); // Explicitly convert to a number
        if (newShiurNumber >= 1) {
          this.$router.push({ name: 'chapter', params: { shiur: newShiurNumber } });
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .nav-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  </style>
  