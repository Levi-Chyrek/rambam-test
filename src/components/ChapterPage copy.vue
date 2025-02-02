<template>
  <div>
      
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
        'לא', 'לב', 'לג', 'לד', 'לה', 'לו', 'לז', 'לח', 'לט', 'מ', 'מא', 'מב', 'מג', 'מד', 'מה', 'מו', 'מז', 'מח', 'מט', 'נ', 'נא', 'נב', 'נג', 'נד', 'נה', 'נו', 'נז', 'נח', 'נט', 'ס', 'סא', 'סב', 'סג', 'סד', 'סה', 'סו', 'סז', 'סח', 'סט', 'ע', 'עא', 'עב', 'עג', 'עד', 'עה', 'עו', 'עז', 'עח', 'עט', 'פ', 'פא', 'פב', 'פג', 'פד', 'פה', 'פו', 'פז', 'פח', 'פט', 'צ', 'צא', 'צב', 'צג', 'צד', 'צה', 'צו', 'צז', 'צח', 'צט', 'ק', 'קא', 'קב', 'קג', 'קד', 'קה', 'קו', 'קז', 'קח', 'קט', 'קי', 'קיא', 'קיב', 'קיג', 'קיד', 'קטו', 'קטז', 'קיז', 'קיח', 'קיט', 'קכ', 'קכא', 'קכב', 'קכג', 'קכד', 'קכה', 'קכו', 'קכז', 'קכח', 'קכט', 'קל', 'קלא', 'קלב', 'קלג', 'קלד', 'קלה', 'קלו', 'קלז', 'קלח', 'קלט', 'קמ', 'קמא', 'קמב', 'קמג', 'קמד', 'קמה', 'קמו', 'קמז', 'קמח', 'קמט', 'קנ', 'קנא', 'קנב', 'קנג', 'קנד', 'קנה', 'קנו', 'קנז', 'קנח', 'קנט', 'קס', 'קסא', 'קסב', 'קסג', 'קסד', 'קסה', 'קסו', 'קסז', 'קסח', 'קסט', 'קע', 'קעא', 'קעב', 'קעג', 'קעד', 'קעה', 'קעו', 'קעז', 'קעח', 'קעט', 'קפ', 'קפא', 'קפב', 'קפג', 'קפד', 'קפה', 'קפו', 'קפז', 'קפח', 'קפט', 'קצ', 'קצא', 'קצב', 'קצג', 'קצד', 'קצה', 'קצו', 'קצז', 'קצח', 'קצט', 'ר', 'רא', 'רב', 'רג', 'רד', 'רה', 'רו', 'רז', 'רח', 'רט', 'רי', 'ריא', 'ריב', 'ריג', 'ריד', 'רטו', 'רטז', 'ריז', 'ריח', 'ריט', 'רכ', 'רכא', 'רכב', 'רכג', 'רכד', 'רכה', 'רכו', 'רכז', 'רכח', 'רכט', 'רל', 'רלא', 'רלב', 'רלג', 'רלד', 'רלה', 'רלו', 'רלז', 'רלח', 'רלט', 'רמ', 'רמא', 'רמב', 'רמג', 'רמד', 'רמה', 'רמו', 'רמז', 'רמח', 'רמט', 'רנ', 'רנא', 'רנב', 'רנג', 'רנד', 'רנה', 'רנו', 'רנז', 'רנח', 'רנט', 'רס', 'רסא', 'רסב', 'רסג', 'רסד', 'רסה', 'רסו', 'רסז', 'רסח', 'רסט', 'רע', 'רעא', 'רעב', 'רעג', 'רעד', 'רעה', 'רעו', 'רעז', 'רעח', 'רעט', 'רפ', 'רפא', 'רפב', 'רפג', 'רפד', 'רפה', 'רפו', 'רפז', 'רפח', 'רפט', 'רצ', 'רצא', 'רצב', 'רצג', 'רצד', 'רצה', 'רצו', 'רצז', 'רצח', 'רצט', 'ש', 'שא', 'שב', 'שג', 'שד', 'שה', 'שו', 'שז', 'שח', 'שט', 'שי', 'שיא', 'שיב', 'שיג', 'שיד', 'שטו', 'שטז', 'שיז', 'שיח', 'שיט', 'שכ', 'שכא', 'שכב', 'שכג', 'שכד', 'שכה', 'שכו', 'שכז', 'שכח', 'שכט', 'של', 'שלא', 'שלב', 'שלג', 'שלד', 'שלה', 'שלו', 'שלז', 'שלח', 'שלט', 'שמ', 'שמא', 'שמב', 'שמג', 'שמד', 'שמה', 'שמו', 'שמז', 'שמח', 'שמט', 'שנ', 'שנא', 'שנב', 'שנג', 'שנד', 'שנה', 'שנו', 'שנז', 'שנח', 'שנט', 'שס', 'שסא', 'שסב', 'שסג', 'שסד', 'שסה', 'שסו', 'שסז', 'שסח', 'שסט', 'שע', 'שעא', 'שעב', 'שעג', 'שעד', 'שעה', 'שעו', 'שעז', 'שעח', 'שעט', 'שפ', 'שפא', 'שפב', 'שפג', 'שפד', 'שפה', 'שפו', 'שפז', 'שפח', 'שפט', 'שצ', 'שצא', 'שצב', 'שצג', 'שצד', 'שצה', 'שצו', 'שצז', 'שצח', 'שצט', 'ת', 'תא', 'תב', 'תג', 'תד', 'תה', 'תו', 'תז', 'תח', 'תט', 'תי', 'תיא', 'תיב', 'תיג', 'תיד', 'תטו', 'תטז', 'תיז', 'תיח', 'תיט', 'תכ', 'תכא', 'תכב', 'תכג', 'תכד', 'תכה', 'תכו', 'תכז', 'תכח', 'תכט', 'תל', 'תלא', 'תלב', 'תלג', 'תלד', 'תלה', 'תלו', 'תלז', 'תלח', 'תלט', 'תמ', 'תמא', 'תמב', 'תמג', 'תמד', 'תמה', 'תמו', 'תמז', 'תמח', 'תמט', 'תנ', 'תנא', 'תנב', 'תנג', 'תנד', 'תנה', 'תנו', 'תנז', 'תנח', 'תנט', 'תס', 'תסא', 'תסב', 'תסג', 'תסד', 'תסה', 'תסו', 'תסז', 'תסח', 'תסט', 'תע', 'תעא', 'תעב', 'תעג', 'תעד', 'תעה', 'תעו', 'תעז', 'תעח', 'תעט', 'תפ', 'תפא', 'תפב', 'תפג', 'תפד', 'תפה', 'תפו', 'תפז', 'תפח', 'תפט', 'תצ', 'תצא', 'תצב', 'תצג', 'תצד', 'תצה', 'תצו', 'תצז', 'תצח', 'תצט', 'תק', 'תקא', 'תקב', 'תקג', 'תקד', 'תקה', 'תקו', 'תקז', 'תקח', 'תקט', 'תקי', 'תקיא', 'תקיב', 'תקיג', 'תקיד', 'תקטו', 'תקטז', 'תקיז', 'תקיח', 'תקיט', 'תקכ', 'תקכא', 'תקכב', 'תקכג', 'תקכד', 'תקכה', 'תקכו', 'תקכז', 'תקכח', 'תקכט', 'תקל', 'תקלא', 'תקלב', 'תקלג', 'תקלד', 'תקלה', 'תקלו', 'תקלז', 'תקלח', 'תקלט', 'תקמ', 'תקמא', 'תקמב', 'תקמג', 'תקמד', 'תקמה', 'תקמו', 'תקמז', 'תקמח', 'תקמט', 'תקנ', 'תקנא', 'תקנב', 'תקנג', 'תקנד', 'תקנה', 'תקנו', 'תקנז', 'תקנח', 'תקנט', 'תקס', 'תקסא', 'תקסב', 'תקסג', 'תקסד', 'תקסה', 'תקסו', 'תקסז', 'תקסח', 'תקסט', 'תקע', 'תקעא', 'תקעב', 'תקעג', 'תקעד', 'תקעה', 'תקעו', 'תקעז', 'תקעח', 'תקעט', 'תקפ', 'תקפא', 'תקפב', 'תקפג', 
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
        // Load the mapping file to find the correct JSON & index
        const mappingData = await fetch('/src/assets/json/chapter_mapping.json').then(res => res.json());

        if (!mappingData[shiur]) {
          console.error(`No mapping found for shiur ${shiur}`);
          return;
        }

        const { file, index, start, end } = mappingData[shiur];

        // Load the correct halachos JSON file
        const hebrewData = await fetch(`/src/assets/json/${file}_he.json`).then(res => res.json());
        const englishData = await fetch(`/src/assets/json/${file}_en.json`).then(res => res.json());

        // Set title (Halachos name) and chapter number
        this.chapterTitle = hebrewData.heTitle;
        this.chapterNumber = this.getHebrewNumber(index); // Converts chapter index to Hebrew

        // Extract the correct chapter (perek)
        this.chapterText = this.mergeTexts(hebrewData.text[index], englishData.text[index]);

        // If start is specified, adjust the chapter text
        if (start) {
          this.chapterText = this.chapterText.slice(start - 1);
          this.startOffset = start - 1;
        } else {
          // If no start is specified, reset startOffset for default numbering
          this.startOffset = 0;
        }

        // If end is specified, slice the chapter to that end point
        if (end) {
          this.chapterText = this.chapterText.slice(0, end - start + 1);
        }

        // Check if autonum is specified in the chapter's JSON data
        if (hebrewData.autonum !== undefined) {
          this.autonum = hebrewData.autonum; // Set autonum based on the JSON
        }

      } catch (error) {
        console.error('Error loading chapter data:', error);
      }
    },
    mergeTexts(hebrewText, englishText) {
      const maxLength = Math.max(hebrewText.length, englishText.length);
      const mergedText = [];
      for (let i = 0; i < maxLength; i++) {
        mergedText.push([
          hebrewText[i] || '',
          englishText[i] || ''
        ]);
      }
      return mergedText;
    },
    getHebrewNumber(index) {
      return this.hebrewNumbers[index] || index + 1; // Fallback to Arabic numbers if out of range
    },
    getEnglishNumber(index) {
      return index + 1; // Arabic numerals
    },
  },
};
</script>
