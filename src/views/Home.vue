<template>
  <div class="home">
    <div class="head">
      <home-link :title="title"/>
    </div>
    <div class="intro">
      <blog-avatar class="intro-avatar" :src="avatar"/>
      <div class="intro-body">
        <div class="intro-name">
          这是
          <a class="intro-link" :href="`https://github.com/${username}`" target="_blank">{{ name }}</a>
          的个人博客，
        </div>
        <div class="intro-bio">{{ bio }}</div>
      </div>
    </div>
    <div class="post" v-for="p in postList" :key="p.attributes.date">
      <router-link to class="post-title">{{ p.attributes.title }}</router-link>
      <small class="post-info">
        <span class="post-info-date">{{ formatDate(p.attributes.date) }}</span>
        <span>{{ ' · ' }}</span>
        <span>{{ timeToRead(p.body.length) }}</span>
      </small>
      <p class="post-subtitle">{{ p.attributes.subtitle }}</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeLink from '@/components/HomeLink.vue'
import BlogAvatar from '@/components/BlogAvatar.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState(['title', 'name', 'bio', 'avatar', 'username']),
    ...mapGetters(['postList']),
  },
  components: {
    HomeLink,
    BlogAvatar,
  },
  methods: {
    formatDate(date) {
      const d = new Date(date)
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const day = d.getDate()
      return `${year}年 ${month}月 ${day}日`
    },
    timeToRead(length) {
      const time = Math.round(length / 500)
      const tea = new Array(Math.round(time / 5)).join('☕')
      return `${tea} 阅读时间${time}分钟`
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/common.scss';
@import '@/styles/font.scss';

.home {
  .head {
    text-align: left;
    font-size: 2.5rem;
    font-family: 'PaytoneOne-Regular', 'Microsoft YaHei', 'Hiragino', sans-serif;
    font-weight: 900;
    color: #333;
    margin-bottom: 2.5rem;
  }

  .intro {
    text-align: left;
    display: flex;
    margin-bottom: 4.5rem;

    .intro-avatar {
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
      line-height: 1.5rem;
      display: block;
    }

    .post-subtitle {
      line-height: 1.5rem;
    }
  }
}
</style>

