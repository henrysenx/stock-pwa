<template>
  <div id="app">
    <Header v-if="showHeader" />
    <main class="">
      <router-view />
    </main>
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {
    Header,
  },
  data() {
    return {
      currentPath: this.$route.path,
    };
  },
  computed: {
    showHeader() {
      // Hide header only on landing page
      return this.$route.path !== '/';
    },
  },
  watch: {
    '$route.path'(newPath) {
      this.currentPath = newPath;
    },
  },
};
</script>

<style scoped>
</style>
