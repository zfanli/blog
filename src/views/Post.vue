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
    <div v-html="render(post.body)"/>
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
      if (gitalk) {
        const newId = new Date(newPost.attributes.date).getTime()
        const oldId = new Date(oldPost.attributes.date).getTime()
        if (newId !== oldId) {
          document.getElementById('gitalk-container').innerHTML = ''
          gitalk(newId).render('gitalk-container')
        }
      }
    },
  },
  mounted() {
    const id = new Date(this.post.attributes.date).getTime()
    console.log(id)
    gitalk(id).render('gitalk-container')
  },
}
</script>

<style lang="scss" scoped>
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
}
</style>
