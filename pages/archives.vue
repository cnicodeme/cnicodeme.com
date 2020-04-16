<template>
    <section class="archives">
        <div v-for="year in years" :key="year.display">
          <h2>{{ year.display }}</h2>
          <ul>
            <li v-for="post in year.posts" :key="post.slug">
              <nuxt-link :to="`/posts/${post.slug}`" :title="post.title">
                <h3>{{ post.title }}</h3>
              </nuxt-link>
              <time :datetime="post.date">{{ post.date|dateformat('MMMM DD, YYYY') }}</time>
            </li>
          </ul>
        </div>

        <!--
        <ul class="pagination" v-if="page.prev || page.next">
            <li v-if="page.prev">
                <nuxt-link to="/" title="View older posts →">Recent posts →</nuxt-link>
                <a href="{{ url_for('/' + config.pagination_dir + '/' + page.prev if page.prev > 1 else '/') }}"</a>
            </li>
            <li v-if="page.next">
                <nuxt-link to="/" title="← Back to latest posts">← View older posts</nuxt-link>
                <a href="{{ url_for('/' + config.pagination_dir + '/' + page.next) }}" title="← Back to latest posts">← View older posts</a>
            </li>
        </ul>
        -->
    </section>
</template>
<script>
import moment from 'moment'
import desc from '~/plugins/desc'

export default {
  async asyncData({ app, params, store }) {
    const posts = store.getters.posts

    let years = {}
    for (let i = 0; i < posts.length; i++) {
      // We set "y" because otherwise the dict is with int (with type string) and will be ordered ...
      const key = 'y' + moment(posts[i].attributes.date).format('YYYY')
      if (!(key in years)) {
        years[key] = {
          'display': key.substr(1),
          'posts': []
        }
      }

      years[key]['posts'].push(posts[i].attributes)
    }
    return { years }
  },
  methods: {
    getDescription (post) {
      return desc(post)
    }
  }
}
</script>