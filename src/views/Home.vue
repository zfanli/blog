<template>
  <div class="wrapper">
    <div class="menu" ref="stage">
      <div v-for="item in menu" :key="item.name" class="menu-item">
        {{ item.name }}
        <span class="mask">{{ item.name }}</span>
        <span class="mask">
          <span>{{ item.name }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  name: "Home",
  inject: ["menu"],

  data() {
    return {
      offset: 10,
      childOffset: 20,
    };
  },

  mounted() {
    this.parallax = debounce(this.parallax, 10);
    window.addEventListener("mousemove", this.parallax);
    if (this.$tools.mobile)
      this.$refs.stage.style.transition = "transform .2s ease";
  },

  unmounted() {
    window.removeEventListener("mousemove", this.parallax);
  },

  methods: {
    parallax(e) {
      const { clientX, clientY } = e,
        { innerWidth, innerHeight } = window,
        offsetX = 0.5 - clientX / innerWidth,
        offsetY = 0.5 - clientY / innerHeight,
        dy = -offsetX * this.offset + "px",
        rotateY = offsetX * this.offset * 2 + "deg",
        rotateX = -offsetY * this.offset + "deg";

      // memo: use the other axis to do the rotate animation base on mouse movement
      // when move on the x axis: rotate base on the y axis so the closest side of the target becomes bigger
      // and vice versa

      // animate the wrapper
      this.$refs.stage.style.transform = `translate3d(0, ${dy}, 0) rotateY(${rotateY}) rotateX(${rotateX})`;

      let offset = this.childOffset;
      for (let el of this.$refs.stage.children) {
        const tx = offsetX * offset,
          ty = offsetY * offset;
        // animate the children
        el.style.transform = `translate3d(${tx}px, ${ty}px, 20px)`;
        offset -= 4;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$font-size: 4rem;
$font-color: #ff3366;
$perspective: 60rem;
$divide-height: 4px;
$divide-position: 49%;

.wrapper {
  background: linear-gradient(45deg, #002b2a, #005352);
  perspective: $perspective;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-transform: uppercase;
    text-align: center;
    transform-style: preserve-3d;
    line-height: 1.2;

    .menu-item {
      cursor: pointer;
      color: transparent;
      position: relative;
      font-size: $font-size;
      font-weight: bold;

      &::before {
        content: "";
        display: block;
        position: absolute;
        top: $divide-position - 0.1;
        left: -10%;
        right: -10%;
        background-color: $font-color;
        height: $divide-height;
        border-radius: $divide-height;
        transform: scale(0);
        transition: all 0.8s cubic-bezier(0.15, 1, 0.4, 1);
        z-index: 1;
      }

      .mask {
        display: block;
        height: $divide-position;
        overflow: hidden;
        position: absolute;
        top: 0;
        color: $font-color;
        transition: all 0.8s cubic-bezier(0.15, 1, 0.4, 1);
      }

      .mask + .mask {
        top: $divide-position - 0.1;
        height: 100 - $divide-position + 0.1;

        span {
          display: block;
          transform: translateY(-$divide-position);
        }
      }

      &:hover {
        &::before {
          transform: scale(1);
        }

        .mask {
          color: white;
          transform: skew(12deg) translateX(4px);
        }

        .mask + .mask {
          transform: skew(12deg) translateX(-4px);
        }
      }
    }
  }
}
</style>
