<template>
  <small class="tag-list" v-if="tags">
    <span>标签：</span>
    <router-link class="tag" v-for="tag in tags" :key="tag" :to="`/tags/${tag}`">{{ tag }}</router-link>
  </small>
</template>

<script>
export default {
  props: {
    tags: Array,
  },
}
</script>

<style lang="scss" scoped>
.tag-list {
  line-height: 1.75rem;

  .tag {
    background-color: #f5f5f5;
    color: #e685a2;
    padding: 0.1rem 0.2rem;
    border-radius: 5px;
    margin: 0 0.2rem;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      color: #d23669;
    }
  }
}
</style>
