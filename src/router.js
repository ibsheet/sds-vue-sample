import VueRouter from 'vue-router';
import Template from './components/Template.vue';

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'page1', component: Template },
  ]
});

export default router;