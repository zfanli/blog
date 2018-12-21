<template>
  <div class="social-links">
    <div class="links" v-for="(k, i) in Object.keys(social)" :key="k">
      <a class="link" :href="social[k]">{{ k }}</a>
      <span v-if="i + 1 !== Object.keys(social).length" class="link-separator">•</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    social: Object,
  },
}
</script>

<style lang="scss" scoped>
.social-links {
  text-align: left;

  .links {
    display: inline-block;

    .link-separator {
      padding: 0 0.4rem;
      font-size: 0.5rem;
    }
  }
}
</style>
