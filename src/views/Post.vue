<template>
  <post-loading v-if="isLoading"/>
  <div class="content" v-else-if="post">
    <div class="head">
      <link-home :title="title"/>
    </div>
    <h1 class="c-title">{{ post.attributes.title }}</h1>
    <small class="c-info">
      <span>{{ post.attributes.formatedDate }}</span>
      <span>{{ ' • ' }}</span>
      <span>{{ post.attributes.timeToRead }}</span>
      <span class="c-info-lut" v-if="post.attributes.lastUpdateTime">{{ lastUpdateTime }}</span>
      <list-tags class="c-info-tags" :tags="post.attributes.tags"/>
    </small>
    <box-warning v-if="warnMessage" :msg="warnMessage"/>
    <div v-html="render(post.body)" :class="`c-body ${post.attributes.externalCSS}`"/>
    <hr>
    <div class="head bottom">
      <link-home :title="title"/>
    </div>
    <blog-intro :avatar="avatar" :username="username" :name="name" :bio="bio"/>
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
import LinkHome from '@/components/LinkHome.vue'
import BlogIntro from '@/components/BlogIntro.vue'
import ListTags from '@/components/ListTags.vue'
import BoxWarning from '@/components/BoxWarning.vue'
import PostLoading from '@/views/PostLoading.vue'
import render from '@/utils/markdown'
import gitalk from '@/utils/gitalk'
import { mapState, mapGetters } from 'vuex'
import zoomer from 'medium-zoom'

export default {
  props: {
    postTitle: String,
  },
  components: {
    LinkHome,
    BlogIntro,
    ListTags,
    BoxWarning,
    PostLoading,
  },
  computed: {
    ...mapState(['title', 'name', 'bio', 'avatar', 'username']),
    ...mapGetters(['postIds', 'postList', 'isLoading']),
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
      const last = this.post.attributes.lastUpdateTime
      // do nothing if last update time does not exist
      if (!last) return null

      const dt = new Date(last)
      const year = dt.getFullYear()
      const month = dt.getMonth() + 1
      const day = dt.getDate()
      return `最后更新于 ${year}年 ${month}月 ${day}日`
    },
    warnMessage() {
      const last =
        this.post.attributes.lastUpdateTime || this.post.attributes.date
      if (last) {
        const now = new Date().getTime()
        const target = new Date(last).getTime()
        // 31536000000: the total milliseconds of the full year
        // compare the update time with current time
        if (now - target > 31536000000) {
          return '最后更新时间距今已经超过一年。'
        }
      }
      return null
    },
  },
  methods: {
    render,
    importExternalCSSFile() {
      // update external css if need
      const externalCSS = this.post.attributes.externalCSS
      if (externalCSS) {
        import(/* webpackChunkName: "external-css" */ `../pages/externalCSS/${externalCSS}.scss`)
      }
    },
    checkPostExist(post) {
      if (!post) {
        this.$router.push('/404')
        return false
      }
      return true
    },
    initialGitalk(id) {
      const gt = document.getElementById('gitalk-container')
      if (gitalk && gt) {
        gt.innerHTML = ''
        gitalk(id).render('gitalk-container')
      }
    },
    registerImageZoomer() {
      zoomer('img', { background: '#fff' })
    },
  },
  watch: {
    post(newPost, oldPost) {
      // wait for loading
      if (this.isLoading) return

      // check if new post does not exist
      // if so then show 404
      if (!this.checkPostExist(newPost)) {
        return
      }

      const newId = new Date(newPost.attributes.date).getTime()
      const oldId = new Date(oldPost.attributes.date).getTime()
      if (newId !== oldId) {
        // update gitalk while route changed
        this.initialGitalk(newId)
        // update external css file if exists
        this.importExternalCSSFile()
      }
    },
  },
  mounted() {
    // wait for loading
    if (this.isLoading) return

    // 404 if post does not exist
    if (!this.checkPostExist(this.post)) {
      return
    }

    // initial gitalk with current id
    const id = new Date(this.post.attributes.date).getTime()
    this.initialGitalk(id)

    this.importExternalCSSFile()

    // register image zoomer
    this.registerImageZoomer()
  },
  updated() {
    this.registerImageZoomer()
  },
}
</script>

<style lang="scss">
@import '../styles/theme.css';

.content {
  text-align: left;

  .c-title {
    margin: 0;
    margin-top: 2rem;
    font-weight: 900;
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
}
</style>
