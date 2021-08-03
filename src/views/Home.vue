<template>
  <div class="wrapper" ref="wrapper">
    <div class="stars"></div>
    <div class="stars"></div>
    <div class="stars"></div>

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
    if (this.$tools.mobile) {
      this.$refs.stage.style.transition = "transform .2s ease";
      this.$refs.wrapper.addEventListener("touchmove", (e) => {
        e.preventDefault();
        this.parallax(e.touches[0]);
      });
    }
  },

  unmounted() {
    window.removeEventListener("mousemove", this.parallax);
  },

  methods: {
    parallax({ clientX, clientY }) {
      const { innerWidth, innerHeight } = window,
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
@function make-stars($n) {
  $value: 0 0 #fff;
  @for $i from 1 through $n {
    $value: #{$value}, #{random(1000) / 10}vw #{random(1000) / 10}vh #fff;
  }
  @return $value;
}

$stars-large: 100;
$stars-small: 25;
$stars-ratio: (1, 2, 6);
$anime-duration: 40s;

$font-size: 4rem;
$font-size-mobile: 2rem;
$font-color: #fe214f;
$perspective: 60rem;
$divide-height: 4px;
$divide-position: 49%;

.wrapper {
  background-image: radial-gradient(
    ellipse at bottom,
    #1b2735 0%,
    #090a0f 100%
  );
  perspective: $perspective;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;

  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-transform: uppercase;
    text-align: center;
    transform-style: preserve-3d;

    .menu-item {
      cursor: pointer;
      color: transparent;
      position: relative;
      font-size: $font-size;
      font-weight: bold;
      line-height: 1.2;

      @media screen and (max-width: 580px) {
        font-size: $font-size-mobile;
        line-height: 1.5;
      }

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
        white-space: nowrap;
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

  .stars {
    position: absolute;
    background-color: transparent;
    top: 0;
    left: 0;
    border-radius: 50%;

    &::after {
      content: "";
      position: absolute;
      top: 100vh;
    }
  }

  .stars:nth-child(1) {
    height: 3px;
    width: 3px;
    animation: star-moves $anime-duration * 3 linear infinite;

    &::after {
      height: 3px;
      width: 3px;
    }
  }

  .stars:nth-child(2) {
    height: 2px;
    width: 2px;
    animation: star-moves $anime-duration * 2 linear infinite;

    &::after {
      height: 2px;
      width: 2px;
    }
  }

  .stars:nth-child(3) {
    height: 1px;
    width: 1px;
    animation: star-moves $anime-duration linear infinite;

    &::after {
      height: 1px;
      width: 1px;
    }
  }

  @for $i from 1 through 3 {
    .stars:nth-child(#{$i}),
    .stars:nth-child(#{$i})::after {
      box-shadow: make-stars($stars-large * nth($stars-ratio, $i));
    }
  }

  @media screen and (max-width: 580px) {
    @for $i from 1 through 3 {
      .stars:nth-child(#{$i}),
      .stars:nth-child(#{$i})::after {
        box-shadow: make-stars($stars-small * nth($stars-ratio, $i));
      }
    }
  }
}

@keyframes star-moves {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, -100vh, 0);
  }
}
</style>
