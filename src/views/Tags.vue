<template>
  <div class="tags">
    <link-home :title="title"/>

    <div class="tag-list">
      <router-link
        :class="`tag ${tag === t ? 'active' : ''}`"
        :to="`/tags/${t}`"
        v-for="t in tagNames"
        :key="t"
      >
        <span class="tag-name">{{ t }}</span>
        <span class="tag-count">{{ tags[t] }}</span>
      </router-link>
    </div>

    <list-posts :posts="getPostByTag(tag)"/>

    <link-socials :social="social"/>
  </div>
</template>

<script>
import LinkHome from '@/components/LinkHome.vue'
import ListPosts from '@/components/ListPosts.vue'
import LinkSocials from '@/components/LinkSocials.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    LinkHome,
    ListPosts,
    LinkSocials,
  },
  props: {
    tag: String,
  },
  computed: {
    ...mapState(['title', 'social']),
    ...mapGetters(['tags', 'getPostByTag']),
    tagNames() {
      return Object.keys(this.tags).sort((a, b) => this.tags[b] - this.tags[a])
    },
  },
  methods: {
    checkTagExist(tag) {
      // if path variable `tag` exists,
      // check if it is contained by `tags`
      // if it is a invalid value, route to tags' home page
      if (tag && !this.tags[tag]) {
        this.$router.push('/tags')
      }
    },
  },
  created() {
    this.checkTagExist(this.tag)
  },
  watch: {
    // watch `tag` and check if it exists when changed
    tag(nTag) {
      this.checkTagExist(nTag)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/constants.scss';

.tags {
  text-align: left;

  .tag-list {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;

    .tag {
      background-color: #f5f5f5;
      padding: 0.2rem 0.5rem;
      margin: 0.5rem;
      line-height: 1.5rem;
      color: #e685a2;
      border-radius: 5px;
      text-decoration: none;

      &.active {
        background-color: #ffeff4;
        color: #d23669;

        .tag-count {
          background-color: #d23669;
        }
      }

      .tag-count {
        display: inline-block;
        text-align: center;
        background-color: #e685a2;
        color: #fff;
        border-radius: 0.5rem;
        margin-left: 0.5rem;
        min-width: 1rem;
        min-height: 1rem;
      }
    }
  }
}
</style>
