<template>
  <div>
    <div>{{ post.attributes.title }}</div>
    <div v-html="render(post.body)"/>
  </div>
</template>

<script>
import render from '@/utils/markdown'
import highlight from '@/utils/highlight'

export default {
  props: {
    title: String,
  },
  computed: {
    post() {
      return this.$store.getters.getPostByTitle(this.title)
    },
  },
  methods: {
    render,
  },
  mounted() {
    highlight()
  },
  updated() {
    highlight()
  },
}
</script>

<style lang="scss" scoped>
@import '~prismjs/themes/prism-tomorrow.css';
</style>
