<template>
  <div id="app">
    <router-view/>
    <scroll-to-top/>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { IMPORT_POST_DYNAMIC, SET_THE_REAL_LENGTH } from './actions'
import ScrollToTop from '@/components/ScrollToTop.vue'
import list from './pages'

export default {
  components: {
    ScrollToTop,
  },
  methods: {
    ...mapMutations({
      setRealLength: SET_THE_REAL_LENGTH,
    }),
    ...mapActions({
      importPostDynamic: IMPORT_POST_DYNAMIC,
    }),
  },
  created() {
    // set the real length of post list
    this.setRealLength(list.length)
    // loading posts dynamically
    list.map(l => this.importPostDynamic(l))
  },
}
</script>

<style lang="scss">
@import './styles/common.scss';
@import './styles/fonts.scss';

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, 'STYuanti', 'Yuanti SC',
    'Microsoft YaHei', '微软雅黑', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  max-width: 750px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 2.5rem 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 751px) {
    padding: 2.5rem;
  }
}
</style>
