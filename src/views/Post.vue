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
      <span class="c-info-lut" v-if="post.attributes.lastUpdateTime">{{ lastUpdateTime }}</span>
      <tags-list class="c-info-tags" :tags="post.attributes.tags"/>
    </small>
    <div v-html="render(post.body)" :class="`c-body ${post.attributes.externalCSS}`"/>
    <hr>
    <div class="head bottom">
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
    <div class="other-posts">
      <router-link
        class="link"
        v-if="otherPosts.previous"
        :to="`/post/${otherPosts.previous}`"
      >← {{ otherPosts.previous }}</router-link>
      <router-link
        class="link"
        v-if="otherPosts.next"
        :to="`/post/${otherPosts.next}`"
      >{{ otherPosts.next }} →</router-link>
    </div>
    <div id="gitalk-container"/>
  </div>
</template>

<script>
import HomeLink from '@/components/HomeLink.vue'
import BlogAvatar from '@/components/BlogAvatar.vue'
import TagsList from '@/components/TagsList.vue'
import render from '@/utils/markdown'
import gitalk from '@/utils/gitalk'
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    postTitle: String,
  },
  components: {
    HomeLink,
    BlogAvatar,
    TagsList,
  },
  computed: {
    ...mapState(['title', 'name', 'bio', 'avatar', 'username']),
    ...mapGetters(['postIds', 'postList']),
    post() {
      return this.$store.getters.getPostByTitle(this.postTitle)
    },
    otherPosts() {
      // get id
      const id = new Date(this.post.attributes.date).getTime()
      // get current index
      const index = this.postIds.indexOf(String(id))
      // get max length
      const maxLength = this.postIds.length
      // get previous post if exists
      const previous = index - 1 < 0 ? null : this.postList[index - 1]
      // get next post if exists
      const next = index + 1 > maxLength - 1 ? null : this.postList[index + 1]
      return {
        previous: !previous ? null : previous.attributes.title,
        next: !next ? null : next.attributes.title,
      }
    },
    lastUpdateTime() {
      const dt = new Date(this.post.attributes.lastUpdateTime)
      const year = dt.getFullYear()
      const month = dt.getMonth() + 1
      const day = dt.getDate()
      return `最后更新于 ${year}年 ${month}月 ${day}日`
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
    margin: 0;
    margin-top: 2rem;
    font-weight: 900;

    // font-family: 'PaytoneOne-Regular', 'Microsoft YaHei', 'Yuanti SC', sans-serif;
  }

  .c-info {
    margin-bottom: 1.75rem;
    display: block;
    line-height: 1.5rem;

    .c-info-lut,
    .c-info-tags {
      display: block;
    }
  }

  .c-body {
    & > div {
      margin-bottom: 1.75rem;
    }
  }

  .other-posts {
    .link {
      display: block;
      width: fit-content;
      margin-bottom: 1rem;
    }
  }

  .head.bottom {
    margin-bottom: 2rem;
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
}
</style>
