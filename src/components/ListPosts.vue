<template>
  <div class="post-list">
    <div class="post" v-for="p in posts" :key="p.attributes.date">
      <router-link :to="`/post/${p.attributes.title}`" class="post-title">{{ p.attributes.title }}</router-link>
      <small class="post-info">
        <span>{{ p.attributes.formatedDate }}</span>
        <span>{{ ' • ' }}</span>
        <span>{{ p.attributes.timeToRead }}</span>
      </small>
      <p class="post-subtitle">{{ p.attributes.subtitle }}</p>
      <list-tags :tags="p.attributes.tags"/>
    </div>
  </div>
</template>

<script>
import ListTags from '@/components/ListTags.vue'

export default {
  components: {
    ListTags,
  },
  props: {
    posts: Array,
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/constants.scss';

.post-list {
  .post {
    text-align: left;
    margin: 3.5rem 0;

    .post-title {
      font-size: 1.5rem;
      font-weight: 900;
      text-decoration: none;
      color: $font-color;
      display: inline-block;
    }

    .post-info {
      line-height: 1.75rem;
      display: block;
    }

    .post-subtitle {
      line-height: 1.75rem;
      margin: 0;
    }
  }
}
</style>
