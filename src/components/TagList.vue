<template>
  <small class="tags" v-if="tags">
    <span>标签：</span>
    <span class="tag" v-for="tag in tags" :key="tag">{{ tag }}</span>
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
.tags {
  line-height: 1.75rem;

  .tag {
    background-color: #f5f5f5;
    color: #e685a2;
    padding: 0.1rem 0.2rem;
    border-radius: 5px;
    margin: 0 0.2rem;
    cursor: pointer;

    &:hover {
      color: #d23669;
    }
  }
}
</style>
