<template>
  <div id="app">
    <h2>Template</h2>
    <p>@ibsheet/loader v{{loaderVersion}}</p>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import loader from '@ibsheet/loader';
import router from './router';

export default {
  name: 'app',
  data() {
    return {
      loaderVersion: loader.version
    }
  },
  created() {
    loader.config({
      registry: [
        {
          name: 'ibsheet',
          baseUrl: '/ibsheet',
          plugins: ['excel', 'common', 'dialog'],
        }
      ]
    })
  },
  router
};
</script>
