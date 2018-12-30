<template>
  <div class="scroll-to-top">
    <transition name="zero" type="transition">
      <div v-show="isShow" class="zero" @click="cliackHandler" title="点击回到顶部">
        <span class="arrow">V</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      position: 0,
    }
  },
  methods: {
    cliackHandler() {
      this.isShow = false
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    triggerDisplayOnScroll() {
      const ah = window.screen.availHeight
      const sy = window.scrollY
      if (sy > ah) {
        // current scroll postion minus the old one
        const direction = sy - this.position
        // greater than 0 means down
        if (direction > 0) {
          // turn off is display is on
          if (this.isShow) {
            this.isShow = false
          }
        } else if (direction < 0) {
          // turn on if display is off
          if (!this.isShow) {
            this.isShow = true
          }
        }
        this.position = sy
      } else {
        // reset isShow flag
        if (this.isShow) {
          this.isShow = false
        }
      }
    },
  },
  created() {
    // listen on scroll event
    window.addEventListener('scroll', this.triggerDisplayOnScroll)
  },
}
</script>

<style lang="scss" scoped>
@keyframes swing {
  0% {
    transform: translate3d(0, -5%, 0) rotate(180deg);
  }
  50% {
    transform: translate3d(0, 10%, 0) rotate(180deg);
  }
  100% {
    transform: translate3d(0, -5%, 0) rotate(180deg);
  }
}

.scroll-to-top {
  z-index: 99;

  .zero {
    cursor: pointer;
    font-family: 'PaytoneOne-Regular', 'Microsoft YaHei', 'Yuanti SC',
      sans-serif;
    position: fixed;
    bottom: 50px;
    right: 50px;
    height: 50px;
    width: 50px;
    background-color: #ffabc7;
    border-radius: 25px;
    color: white;
    font-size: 35px;
    line-height: 50px;

    @media (min-width: 900px) {
      right: calc((100vw - 850px) / 2);
    }

    .arrow {
      display: block;
      transform: rotate(180deg);
      animation: swing 4s ease-out infinite;
    }
  }
}
</style>
<style lang="scss">
.zero-enter-active,
.zero-leave-active {
  transition: all 0.3s ease;
}
.zero-enter-to,
.zero-leave {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
.zero-enter,
.zero-leave-to {
  opacity: 0;
  transform: translate3d(0, -200%, 0);
}
</style>

