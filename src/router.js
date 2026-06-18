import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import ChapterPage from './components/ChapterPage.vue';
import TableOfContents from '@/views/TableOfContents.vue';
import test from '@/App.vue';



const routes = [
  {
    path: '/test',
    name: 'joe',
    component: test,
  }, 
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
  { path: '/toc', name: 'toc', component: TableOfContents },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
