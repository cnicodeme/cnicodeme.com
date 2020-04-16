<template>
    <section itemscope itemtype="http://schema.org/Blog">
        <ul class="articles">
            <li v-for="post in posts" :key="post.attributes.title">
                <nuxt-link :to="'posts/' + post.attributes.slug" :title="post.attributes.title"><h2>{{post.attributes.title}}</h2></nuxt-link>
                <p class="excerpt">{{ getDescription(post) }}</p>
            </li>
        </ul>
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
import { mapGetters } from 'vuex'
import desc from '~/plugins/desc'

export default {
  async asyncData({ app, params, store }) {
    return { posts: store.getters.posts }
  },
  /*
  computed: {
    ...mapGetters(['posts']),
  },
  */
  methods: {
    getDescription (post) {
      return desc(post)
    }
  }
}
</script>