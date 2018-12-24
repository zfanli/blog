<template>
  <div class="home-loading">
    <div class="head"/>
    <div class="intro">
      <div class="intro-avatar"/>
      <div class="intro-body">
        <div class="intro-name"/>
        <div class="intro-bio"/>
      </div>
    </div>
    <div class="post" v-for="(_, i) in new Array(3).fill(1)" :key="i">
      <div class="post-title"/>
      <small class="post-info">
        <span class="post-time"/>
        <span class="post-tea" v-for="(_, i) in new Array(4).fill(1)" :key="i"/>
        <span class="post-read-time"/>
      </small>
      <div class="post-subtitle"/>
      <small class="tags">
        <span class="tag" v-for="(_, i) in new Array(4).fill(1)" :key="i"/>
      </small>
    </div>
    <div class="footer">
      <div class="footer-link" v-for="(_, i) in new Array(2).fill(1)" :key="i"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/animation.scss';
@import '../styles/constants.scss';

.home-loading {
  .head,
  .intro .intro-avatar,
  .intro .intro-body .intro-name,
  .intro .intro-body .intro-bio,
  .post .post-title,
  .post .post-subtitle,
  .post .post-time,
  .post .post-tea,
  .post .post-read-time,
  .post .tags .tag-label,
  .post .tags .tag,
  .footer .footer-link {
    background-color: $loading-bg-color;
    animation: coloring 2s infinite linear;
  }

  .head {
    height: 1.5rem;
    width: 13rem;
    margin-top: 1rem;
    margin-bottom: 3.5rem;
  }

  .intro {
    display: flex;
    margin-bottom: 4.5rem;

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

  .post {
    text-align: left;
    margin: 3.5rem 0;

    .post-title {
      height: 1.5rem;
      width: 60%;
      margin-bottom: 0.5rem;
    }

    .post-info {
      display: block;
      height: 1.75rem;

      .post-time,
      .post-tea,
      .post-read-time {
        height: 0.8rem;
        display: inline-block;
        margin: 0.5rem 0;
      }

      .post-time {
        width: 32%;
      }

      .post-tea {
        width: 1rem;
        margin-left: 0.5rem;
      }

      .post-read-time {
        width: 10%;
      }
    }

    .post-subtitle {
      height: 1rem;
      margin: 0.375rem 0;
      width: 80%;
    }

    .tags {
      height: 1.75rem;
      display: block;

      .tag-label,
      .tag {
        &:nth-child(even) {
          width: 4rem;
        }

        display: inline-block;
        height: 0.8rem;
        margin: 0.5rem 0;
        margin-right: 0.5rem;
        width: 2rem;
      }
    }
  }

  .footer {
    text-align: left;
    margin-top: 4.375rem;
    padding-top: 1.75rem;
    height: 1rem;

    .footer-link {
      width: 4rem;
      height: 1rem;
      display: inline-block;
      margin-right: 0.5rem;
    }
  }
}
</style>
