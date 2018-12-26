<template>
  <div class="intro">
    <blog-avatar class="intro-avatar" :src="avatar"/>
    <div class="intro-body">
      <div class="intro-name">
        这是
        <a
          class="intro-link link"
          :href="`https://github.com/${username}`"
          target="_blank"
        >{{ name }}</a>
        的个人博客，
      </div>
      <div class="intro-bio">{{ bio }}</div>
    </div>
  </div>
</template>

<script>
import BlogAvatar from '@/components/BlogAvatar.vue'

export default {
  components: {
    BlogAvatar,
  },
  props: {
    avatar: String,
    username: String,
    name: String,
    bio: String,
  },
}
</script>

<style lang="scss" scoped>
.intro {
  text-align: left;
  display: flex;
  margin-bottom: 4.5rem;

  .intro-avatar {
    margin-right: 0.875rem;
  }

  .intro-body {
    line-height: 1.75rem;
  }
}
</style>
