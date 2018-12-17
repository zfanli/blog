<template>
  <div class="content">
    <div class="head">
      <home-link :title="title"/>
    </div>
    <h1 class="c-title">{{ post.attributes.title }}</h1>
    <small class="c-info">
      <span>{{ post.attributes.formatedDate }}</span>
      <span>{{ ' • ' }}</span>
      <span>{{ post.attributes.timeToRead }}</span>
    </small>
    <div v-html="render(post.body)" :class="`c-body ${post.attributes.externalCSS}`"/>
    <div id="gitalk-container"/>
  </div>
</template>

<script>
import HomeLink from '@/components/HomeLink.vue'
import render from '@/utils/markdown'
import gitalk from '@/utils/gitalk'
import { mapState } from 'vuex'

export default {
  props: {
    postTitle: String,
  },
  components: {
    HomeLink,
  },
  computed: {
    ...mapState(['title']),
    post() {
      return this.$store.getters.getPostByTitle(this.postTitle)
    },
  },
  methods: {
    render,
  },
  watch: {
    post(newPost, oldPost) {
      const newId = new Date(newPost.attributes.date).getTime()
      const oldId = new Date(oldPost.attributes.date).getTime()
      if (newId !== oldId) {
        // update gitalk while route chnaged
        if (gitalk) {
          document.getElementById('gitalk-container').innerHTML = ''
          gitalk(newId).render('gitalk-container')
        }

        // update external css if need
        const externalCSS = this.post.attributes.externalCSS
        if (externalCSS) {
          import(/* webpackChunkName: "external-css" */ `../pages/externalCSS/${externalCSS}.scss`)
        }
      }
    },
  },
  mounted() {
    // initial gitalk
    const id = new Date(this.post.attributes.date).getTime()
    gitalk(id).render('gitalk-container')

    // initial loading external css file if exists
    const externalCSS = this.post.attributes.externalCSS
    if (externalCSS) {
      import(/* webpackChunkName: "external-css" */ `../pages/externalCSS/${externalCSS}.scss`)
    }
  },
}
</script>

<style lang="scss">
@import '../styles/theme.css';
@import '../styles/constants.scss';

.content {
  text-align: left;

  .head {
    color: $font-color + #2d8b6c;
    font-size: 1.5rem;
  }

  .c-title {
    margin-top: 2rem;
    font-weight: 900;
    // font-family: 'PaytoneOne-Regular', 'Microsoft YaHei', 'Yuanti SC', sans-serif;
  }

  .c-info {
    margin-bottom: 1.75rem;
    display: block;
    line-height: 1.5rem;
  }

  .c-body {
    & > div {
      margin-bottom: 1.75rem;
    }
  }
}
</style>
