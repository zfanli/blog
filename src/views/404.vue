<template>
  <div class="error-404">
    <div class="head">
      <home-link :title="title"/>
    </div>
    <h1>404</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import HomeLink from '@/components/HomeLink.vue'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['title']),
    message() {
      const m = [
        '你找到了世界的边界。',
        '没想到在这里见到你了！',
        '你有没有想过这里或许不是你该来的地方？',
        '点击上面的 logo 可以让你回到首页。',
        '这里什么也没有。',
        '别在这里浪费时间了！',
        '你的目标应该是星辰大海，而不是这里。',
        '我时常会在这里记录一些笔记和总结。',
        '你要找的页面似乎不是这里。',
        '也许哪里出了点问题？',
      ]
      const time = '' + new Date().getTime()
      const seed = time.split('')[time.length - 1]
      return m[seed]
    },
  },
  components: {
    HomeLink,
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/constants.scss';

.error-404 {
  .head {
    text-align: left;
    color: $font-color + #2d8b6c;
    font-size: 1.5rem;
  }
}
</style>
