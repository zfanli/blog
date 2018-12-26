<template>
  <home-loading v-if="isLoading"/>
  <div v-else class="home">
    <div class="head">
      <link-home :title="title"/>
    </div>
    <blog-intro :avatar="avatar" :username="username" :name="name" :bio="bio"/>
    <post-list :posts="postList"/>
    <link-socials class="footer" :social="social"/>
  </div>
</template>

<script>
// @ is an alias to /src
import LinkHome from '@/components/LinkHome.vue'
import BlogIntro from '@/components/BlogIntro.vue'
import PostList from '@/components/PostList.vue'
import LinkSocials from '@/components/LinkSocials.vue'
import HomeLoading from '@/views/HomeLoading.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState(['title', 'name', 'bio', 'avatar', 'username', 'social']),
    ...mapGetters(['postList', 'isLoading']),
  },
  components: {
    LinkHome,
    BlogIntro,
    PostList,
    LinkSocials,
    HomeLoading,
  },
}
</script>

<style lang="scss">
.home {
  .head {
    text-align: left;
    font-size: 2.5rem;
    font-weight: 900;
    color: #333;
    margin-bottom: 2.5rem;
  }

  .footer {
    margin-top: 4.375rem;
    padding-top: 1.75rem;
  }
}
</style>

