<template>
  <div id="app">
    <home-link :title="blogTitle"/>
    <router-view/>
  </div>
</template>

<script>
import HomeLink from '@/components/HomeLink.vue'

import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['blogTitle']),
  },
  components: {
    HomeLink,
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
