import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import ChapterPage from './components/ChapterPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/chapter/:shiur',
    name: 'chapter',
    component: ChapterPage,
    props: true, // This will pass the `shiur` parameter to the component
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
