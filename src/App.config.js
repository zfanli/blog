// import avatar from './assets/avatar.png'

export default {
  info: {
    title: 'Richardzg', // use for homepage link
    name: 'Richard',
    bio: '我会不定期地记录一些笔记和总结。',
    avatar: '', // path to avatar image
    username: 'zfanli', // username of github
  },
  config: {
    ga: {
      id: 'UA-104770482-1', // tack id of google analysis
    },
    gitalk: () => ({
      clientID: 'de47adf4f9d0394257eb',
      clientSecret: '7619f44e8a16d8d6b450a588caf2e087f1fb8500',
      repo: 'comments', // repo for store comments
      owner: 'zfanli', // username
      admin: ['zfanli'], // array of usernames
      id: `blog/${location.hash}`, // uniqueness and less then 50
      distractionFreeMode: false, // masking on focus
    }),
  },
}
