<template>
  <div class="home">
    <div class="head">
      <home-link :title="title"/>
    </div>
    <div class="intro">
      <blog-avatar class="home-avatar" :src="avatar"/>
      <div class="intro-body">
        <div class="intro-name">
          <a class="intro-link" :href="`https://github.com/${username}`" target="_blank">{{ name }}</a>
          的个人博客，
        </div>
        <div class="intro-bio">{{ bio }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeLink from '@/components/HomeLink.vue'
import BlogAvatar from '@/components/BlogAvatar.vue'
import { mapState } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState(['title', 'name', 'bio', 'avatar', 'username']),
  },
  components: {
    HomeLink,
    BlogAvatar,
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/common.scss';

.home {
  .head {
    text-align: left;
    font-size: 2.5rem;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
      'Microsoft YaHei', 'Hiragino', sans-serif;
    font-weight: 900;
    color: #333;
    margin-bottom: 2.5rem;
  }

  .intro {
    text-align: left;
    display: flex;

    .home-avatar {
      margin-right: 0.875rem;
    }

    .intro-body {
      line-height: 1.75rem;

      .intro-name {
        .intro-link {
          text-decoration: none;
          box-shadow: 0 1px 0 0 currentColor;
          color: $font-color;
        }
      }
    }
  }
}
</style>

