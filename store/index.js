import moment from 'moment'

// Helped by https://github.com/mazipan/nuxt-blog/

export const state = () => ({
  posts: []
})

export const getters = {
  posts(state) {
    return state.posts
  },
  post: (state) => (slug) => {
    return state.posts.find(x => x.attributes.slug === slug)
  },
  nextPost: (state) => (slug) => {
    const postIndex = state.posts.findIndex((a) => a.attributes.slug === slug)

    if (postIndex > 0) {
      return state.posts[postIndex - 1]
    }
  },
  previousPost: (state) => (slug) => {
    const postIndex = state.posts.findIndex((a) => a.attributes.slug === slug)

    if (postIndex < state.posts.length) {
      return state.posts[postIndex + 1]
    }
  }
}

export const mutations = {
  set(state, data) {
    state.posts = data
  }
}

export const actions = {
  async nuxtServerInit ({ commit }) {
    const resolve = await require.context('~/content/posts', true, /\.md$/)
    let posts = resolve.keys().map((key) => {
      const post = resolve(key)
      let slug = key.substr(key.indexOf('-') + 1)
      post.attributes.slug = slug.substr(0, slug.lastIndexOf('.'))

      return post
    })

    // sort by date
    posts.sort((a, b) =>
      moment(b.attributes.date, 'YYYY-MM-DD').diff(moment(a.attributes.date, 'YYYY-MM-DD'))
    )
    commit('set', posts)
  }
}
