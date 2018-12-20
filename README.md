# richardzg

Simple blog site, build with Vue.js, and styling heavily copied from [gaearon/overreacted.io](https://github.com/gaearon/overreacted.io).

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

Edit `src/App.config.js` to configure this app.

```js
import avatar from './assets/avatar.png'

export default {
  info: {
    title: 'use for home link',
    name: 'your name',
    bio: 'your bio',
    avatar, // path to avatar
    username: 'username of github for make a link',
    social: { // for generate social link in footer
      github: 'https://github.com/(your username here)',
      others: 'link/to/others/social/site',
    },
  },
  config: {
    // delete this block to disable ga
    ga: {
      id: 'tack id of google analysis',
    },
    // delete this block to disable gitalk
    gitalk: () => ({
      clientID: 'client id',
      clientSecret: 'client secret',
      repo: 'repo for store comments',
      owner: 'username of owner',
      admin: ['array of usernames'],
      id: 'uniqueness and less then 50', // location.path
      distractionFreeMode: false, // masking on focus
    }),
  },
}
```

## Front Matter

Front matter of post file.

```yaml
---
title: title of post # *required
subtitle: some descriptions about this post # *required
date: 2018-12-16 00:00:00 +0800 # *required, time zone is optional
# NOTICE: `date` is used as unique id to initial comment issue by gitalk, so DO NOT change it after comment issue was created! Otherwise new issue will be created.
lastUpdateTime: 2018-12-20 13:01:37 +0800 # *optional, show at post page if exists
externalCSS: file name of external CSS if need # optional
tags: # optional, show at homepage if exists
  - tags list
  - it's an array
---

...

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
