<template>
  <div class="content-loading">
    <div class="head"/>
    <h1 class="c-title"/>
    <small class="c-info">
      <span class="c-info-time"></span>
      <span class="c-info-tea" v-for="(_, i) in new Array(4).fill(1)" :key="i"/>
      <span class="c-info-read-time"></span>
      <small class="tags">
        <span class="tag" v-for="(_, i) in new Array(4).fill(1)" :key="i"/>
      </small>
    </small>
    <div class="c-body">
      <p class="p" v-for="(_, i) in new Array(15).fill(1)" :key="i">
        <span class="holder" v-html="space[i % 3]"/>
      </p>
    </div>
    <div class="hr"/>
    <div class="head"/>
    <div class="intro">
      <div class="intro-avatar"></div>
      <div class="intro-body">
        <div class="intro-name"/>
        <div class="intro-bio"/>
      </div>
    </div>
    <div class="other-posts">
      <div class="holder"/>
      <div class="holder"/>
    </div>
    <div class="comment">
      <div class="meta">
        <div class="item"/>
        <div class="item"/>
      </div>
      <div class="body" v-for="(_, i) in new Array(2).fill(1)" :key="i">
        <div class="body-avatar"/>
        <div class="body-box"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      space: [
        new Array(290).join('&nbsp;'),
        new Array(190).join('&nbsp;'),
        new Array(380).join('&nbsp;'),
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/animation.scss';
@import '../styles/constants.scss';

.content-loading {
  text-align: left;

  .c-title,
  .c-info .c-info-time,
  .c-info .c-info-tea,
  .c-info .c-info-read-time,
  .c-info .tags .tag,
  .c-body .p .holder,
  .hr,
  .intro .intro-avatar,
  .intro .intro-body .intro-name,
  .intro .intro-body .intro-bio,
  .other-posts .holder,
  .comment .item,
  .comment .up-avatar,
  .comment .up-box,
  .comment .body-avatar,
  .comment .body-box,
  .head {
    background-color: $loading-bg-color;
    animation: coloring 2s infinite linear;
  }

  .head {
    height: 1.25rem;
    margin: 0.4375rem 0;
    width: 8rem;
  }

  .c-title {
    height: 2.5rem;
    margin-top: 3rem;
    margin-bottom: 0.5rem;
    width: 80%;
  }

  .c-info {
    display: block;
    height: 4.5rem;
    margin-bottom: 1.75rem;

    .c-info-time,
    .c-info-tea,
    .c-info-read-time {
      height: 0.8rem;
      margin: 0.35rem 0;
      display: inline-block;
    }

    .c-info-time {
      width: 20%;
    }

    .c-info-read-time {
      width: 10%;
    }

    .c-info-tea {
      width: 1rem;
      margin-left: 0.5rem;
    }

    .tags {
      display: block;

      .tag {
        display: inline-block;
        width: 2rem;
        height: 0.8rem;
        margin: 0.35rem 0;
        margin-right: 0.5rem;

        &:nth-child(even) {
          width: 4rem;
        }
      }
    }
  }

  .c-body {
    .p {
      width: fit-content;
      white-space: normal;
      word-break: break-word;
    }
  }

  .hr {
    width: 100%;
    height: 0.3rem;
    margin-bottom: 1.75rem;
  }

  .intro {
    display: flex;
    margin-bottom: 4.5rem;
    margin-top: 1.75rem;

    .intro-avatar {
      border-radius: 1.75rem;
      height: 3.5rem;
      width: 3.5rem;
      margin-right: 0.875rem;
    }

    .intro-body {
      line-height: 1.75rem;

      .intro-name,
      .intro-bio {
        width: 12rem;
        margin: 0.375rem 0;
        height: 1rem;
      }
    }
  }

  .other-posts {
    .holder {
      height: 1rem;
      width: 60%;
      margin-bottom: 0.75rem;

      &:nth-child(1) {
        width: 40%;
      }
    }
  }

  .comment {
    .meta {
      display: flex;
      height: 1rem;
      padding: 1.25rem 0;
      margin: 1.25rem 0;
      align-items: center;
      border-bottom: 1px solid $loading-bg-color;

      .item {
        height: 0.8rem;
        margin: 0.1rem 0;
        width: 4rem;

        &:nth-child(2) {
          margin-left: auto;
        }
      }
    }

    .body {
      margin-top: 1.25rem;
      display: flex;

      .body-avatar {
        height: 50px;
        width: 50px;
        border-radius: 25px;
      }

      .body-box {
        margin-left: 1.25rem;
        height: 4.5rem;
        flex-grow: 1;
        border-radius: 5px;
      }
    }
  }
}
</style>

