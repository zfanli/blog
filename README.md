# richardzg

Simple blog site, build with Vue.js, and styling heavily copied from [gaearon/overreacted.io](https://github.com/gaearon/overreacted.io).

This repo is for edit posts. Blog developing at [here](https://github.com/zfanli/pure-blog).

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

## Configuration

View [Pure-Blog](https://github.com/zfanli/pure-blog).

## Commit labels

- `update`: version update.
- `docs`: updates about read me file or other docs.
- `post`: updates about posts.

## Problems log

**404 when typing post's URL in address bar directly**

State: **Solved**

Cause:

All posts are imported dynamically **after** the app is mounted. And when typing the post's url in address bar directly, the router will search the post **immediately**, but at that time, posts were not yet be imported entirely. So the result is not found, and redirected to 404 page.

The flow is like this:

1. app mounted
2. data loading started
3. searching post by title -> not found
4. data loading ended -> the data was imported at this time
5. 404 page showed -> because not found was raised at No.3

Solution:

I have found a new solution. There are no need of navigation guard.

For the first, let's just route to the post page, then show a loading page if data was not yet be imported, and do not check anything until data loading was finished. Use the `watch` mechanism to check `post`'s changes, and only when data was loaded, for my code, the `isLoading` flag is set to false, then react to the existence of `post`, the result could be 2 ways, one is the `post` does exist then show its details, the another one is the `post` does not exist so redirect to 404.

This way can solves the problem perfectly, whatever typing the url directly, or reload current page manually. For the old solution I have wrote below, it has a probability of directs to 404 page randomly and unexpectedly, because both the mounted hook and the navigation guard will not waiting for data loading.

For more details, see the code below.

```js
...
  watch: {
    // watching the `post` data
    post(newPost, oldPost) {
      // this is the key point of the solution,
      // if the post has been changed,
      // do nothing if the `isLoading` flag is true,
      // because the data was not yet be imported entirely,
      // we have to wait for it
      if (this.isLoading) return

      // this function is for check if the new post exists,
      // it will return false if not exist,
      // and we will do nothing if so
      if (!this.checkPostExist(newPost)) {
        return
      }

      // others to do while route changed
      const newId = new Date(newPost.attributes.date).getTime()
      const oldId = new Date(oldPost.attributes.date).getTime()
      if (newId !== oldId) {
        // update gitalk while route changed
        this.initialGitalk(newId)
        // update external css file if exists
        this.importExternalCSSFile()
      }
    },
  },
  mounted() {
    // just as we said before,
    // mounted hook is also has to wait for loading
    if (this.isLoading) return

    // 404 if post does not exist
    if (!this.checkPostExist(this.post)) {
      return
    }

    // others to do for initialization

    // initial gitalk
    const id = new Date(this.post.attributes.date).getTime()
    this.initialGitalk(id)

    this.importExternalCSSFile()
  },
...
```

_OLD SOLUTION_

The navigation guard search post used the store module directly, by `import store from './store'`, and after some tries finally I found that use store object bundled with app will avoid access before data is loaded.

I do not know the reason exactly, but it seems the store bundled with app will call after data is loaded, maybe that is why it is different with the store imported directly from module.

The solution is avoid to use the store directly from module, but use it by the callback of `next()`.

For more details, below is the code that has the problem.

```js
import store from './store'

...

beforeEnter: (to, from, next) => {
  const title = to.params.postTitle
  if (!store.getters.getPostByTitle(title)) {
    next('/404')
  } else {
    next()
  }
}
```

And, use the callback of `next()` for check the store will solve this problem.

```js
beforeEnter: (to, from, next) => {
  const title = to.params.postTitle
  next(vm => {
    if (!vm.$store.getters.getPostByTitle(title)) {
      next('/404')
    }
  })
}
```

But there are one more thing need to care about, the process redirect to 404 pages will be done while the callback is called, it means before that, the component still will be created and mounted, although it will be redirected to 404 page finally, but some errors will happen before that.

To avoid these errors, we should add a `v-if` clause for controlling, make it to be showed only when data exists. For my situation, `post` is the data to be showed, so I wrote below code to avoid those errors.

```html
<template>
  <div class="content" v-if="post">...</div>
</template>
```

---

_2018/12/13_

The things seem like a little bit complicated.

The `VuePress` is really useful, but its document does not look like easy to understand.

Its old version is featureless, and the new version is still in alpha phase.

Finally, fortunately, the Vue.js is also a powerful framework, I can use it to build a simple SPA site first.

And then, let me complete it with VuePress or other tools gradually.

---

_2018/11/25_

I have to update this README just for make a commit to beautify my dashboard XD.

I finally found out a solution for static site comment support, it's the `gitalk`.

It means I can get a almost full features blog just use VuePress + gitalk to build my blog!

Amazing!

What a useful tool!

I'll going to do some practices with it.

Give me more time!

---

_2018/11/22_

It looks still have a lot of works to build even the simplest one.

But today, I found a convenient tool to build a static site, the VuePress, a SSG or static site generator.

Even though I haven't used Vue, but it looks interesting, and I'm interested in it for long time ago.

But I have using React for a long time, for build old one of my blog, both of them is awesome!

For now, my target is to build the simplest one, seems the VuePress is a good choice!

Just try it!

So, I have to remove my React develope environment, and initial the project withe VuePress.

Ok, no more talking, just doing it!

---

_2018/11/21_

For this version, I'm planing to build a simplest site just for show my blog posts.

It was painful to build and then release a full features blog site that with a beautiful front-end UI and a powerful back-end server.

I was planing for my new blog site from Jan of this year, but as you can see, almost 10 months past, the new blog was still working in progress.

I have too much things plan to do after I have built this blog, but it just like the bottleneck, it's blocking me on the way!

After spent a lot of time for consider how can I broke the bottleneck, now I have the answer.

I have created this new repository to instead of the old one, and start by build a simplest site which don't even have a back-end server.

The new simplest one is going to be hosted by GitHub pages service in my plan, and it only need to show posts list and show the content of each post.

Don't even need features like comment or searching, these features will be joined step by step, and the first step is build the simplest one.
