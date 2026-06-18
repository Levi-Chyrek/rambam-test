<template>
    <div>      
        <div class="chaptitle_bar" style="display:flex;gap:10px;justify-content: space-between;">
            <button @click="GotoToc = !GotoToc" class="back-btn">Back</button>
            <h2 @click="goToTocPage" v-html="fullChapterTitle" class="halacha-title toc-link"></h2>
            <button @click="showSettings = !showSettings" class="settings-btn" title="settings">Settings</button>
        </div>

        <!-- Settings Panel -->
        <div v-if="showSettings" class="settings-panel">
            <h3>Layout Options</h3>
            <button @click="setLayout('column')">Stacked</button>
            <button @click="setLayout('row')">Side-by-Side (Translation First)</button>
            <button @click="setLayout('row-reverse')">Side-by-Side (Hebrew First)</button>

            <h3>Translation</h3>
            <label>
                <input type="checkbox" v-model="showTranslation" @change="saveSettings" /> Show Translation
            </label>

            <h3>Font Size</h3>
            <button @click="adjustFontSize(-1)">-</button>
            <span>{{ fontSize }}px</span>
            <button @click="adjustFontSize(1)">+</button>
        </div>

        <!-- Navigation buttons -->
        <div class="nav-buttons">
            <button @click="goToShiur(shiur - 1)" :disabled="shiur <= 1">Previous</button>
            <button @click="goToShiur(shiur+1)">Next</button>
        </div>

        <div v-if="chapterText.length > 0">
            <div v-for="(paragraph, index) in chapterText" :key="index" class="halpart" :style="{ flexDirection: layout, fontSize: fontSize + 'px' }">
                <p class="hebtext">
                    <strong v-if="autonum" class="paragraph-number">{{ getHebrewNumber(index + startOffset) }}. </strong>
                    <span v-html="paragraph[0]"></span>
                </p>
                <p v-if="showTranslation" class="entext">
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
            chapterTitle: '',
            chapterNumber: '',
            chapterText: [],
            autonum: true,
            startOffset: 0,
            showSettings: false,
            layout: 'column',
            showTranslation: true,
            fontSize: 16
        };
    },
    props: {
        shiur: Number,
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
        this.loadSettings();
    },
    methods: {
        async loadChapter(shiur) {
            try {
                const mappingData = await fetch('/src/assets/json/chapter_mapping.json').then(res => res.json());
                if (!mappingData[shiur]) return;

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
            return Array.from({ length: Math.max(hebrewText.length, englishText.length) }, (_, i) => [hebrewText[i] || '', englishText[i] || '']);
        },
        getHebrewNumber(index) {
            return ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז', 'יח', 'יט', 'כ'][index] || index + 1;
        },
        getEnglishNumber(index) {
            return index + 1;
        },
        goToShiur(newShiur) {
            if (newShiur >= 1) {
                this.$router.push({ name: 'chapter', params: { shiur: Number(newShiur) } });
            }
        },
        goToTocPage() {
            this.$router.push({ name: 'toc' }); // Ensure 'toc' is a valid route name in your router
        },
        setLayout(type) {
            this.layout = type;
            this.saveSettings();
        },
        adjustFontSize(change) {
            this.fontSize = Math.max(12, this.fontSize + change);
            this.saveSettings();
        },
        saveSettings() {
            localStorage.setItem('layout', this.layout);
            localStorage.setItem('showTranslation', this.showTranslation);
            localStorage.setItem('fontSize', this.fontSize);
        },
        loadSettings() {
            const savedLayout = localStorage.getItem('layout');
            const savedShowTranslation = localStorage.getItem('showTranslation');
            const savedFontSize = localStorage.getItem('fontSize');

            if (savedLayout) this.layout = savedLayout;
            if (savedShowTranslation !== null) this.showTranslation = savedShowTranslation === 'true';
            if (savedFontSize) this.fontSize = parseInt(savedFontSize, 10);
        }
    }
};
</script>
