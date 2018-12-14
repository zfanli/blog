<template>
  <img class="avatar" :src="avatar" alt="avatar">
</template>

<script>
import defaultAvatar from '@/assets/default_avatar.svg'

export default {
  props: {
    src: String,
  },
  computed: {
    avatar() {
      return this.src ? this.src : defaultAvatar
    },
  },
}
</script>

<style lang="scss">
.avatar {
  width: 3.5rem;
  height: 3.5rem;
  display: block;
  background-color: #333;
  color: white;
}
</style>
