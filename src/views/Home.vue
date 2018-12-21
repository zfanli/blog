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
    <div class="post" v-for="p in postList" :key="p.attributes.date">
      <router-link :to="`/post/${p.attributes.title}`" class="post-title">{{ p.attributes.title }}</router-link>
      <small class="post-info">
        <span>{{ p.attributes.formatedDate }}</span>
        <span>{{ ' • ' }}</span>
        <span>{{ p.attributes.timeToRead }}</span>
      </small>
      <p class="post-subtitle">{{ p.attributes.subtitle }}</p>
      <tags-list :tags="p.attributes.tags"/>
    </div>
    <social-links class="footer" :social="social"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeLink from '@/components/HomeLink.vue'
import BlogAvatar from '@/components/BlogAvatar.vue'
import TagsList from '@/components/TagsList.vue'
import SocialLinks from '@/components/SocialLinks.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState(['title', 'name', 'bio', 'avatar', 'username', 'social']),
    ...mapGetters(['postList']),
  },
  components: {
    HomeLink,
    BlogAvatar,
    TagsList,
    SocialLinks,
  },
}
</script>

<style lang="scss">
@import '@/styles/constants.scss';

.home {
  .head {
    text-align: left;
    font-size: 2.5rem;
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
      line-height: 1.75rem;
      display: block;
    }

    .post-subtitle {
      line-height: 1.75rem;
      margin: 0;
    }
  }

  .footer {
    margin-top: 4.375rem;
    padding-top: 1.75rem;
  }
}
</style>

