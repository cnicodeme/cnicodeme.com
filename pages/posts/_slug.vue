<template>
  <div>
    <article class="article" itemscope itemtype="http://schema.org/BlogPosting">
        <link itemprop="mainEntityOfPage" :href="`/posts/${$route.params.slug}`" />
        <meta itemprop="inLanguage" content="en" />
        <h1 itemprop="headline name">{{ post.attributes.title }}</h1>
        <div class="details">
            Written on
            <span><time :datetime="post.attributes.date" itemprop="dateCreated datePublished dateModified">{{ post.attributes.date|dateformat("MMM D, YYYY") }}</time></span>
            - 
            <span class="reading-time" itemprop="timeRequired">{{ readingTime(post.html, 'min read') }}</span>
        </div>
        <main itemprop="articleBody">
            <p class="sub" v-if="inCategory('Case Study')">
                Every week, I write about a product that appeared on ProductHunt and share my thoughts.
                I am not affiliated with <template v-if="post.attributes.product_name">{{ post.attributes.product_name }}</template><template v-else>the service</template> and the content of the post here are my points of view uniquely.
                The idea is to give some feedback and hopefully share some valuables tips on how to grow a business.
            </p>

            <Markdown :html="post.html" :destinationFolder="destinationFolder" />
            <!--<Markdown :html="post.html" :render-func="post.vue.renderFunc" :static-render-funcs="post.vue.staticRenderFuncs" />-->

            <p class="conclusion" v-if="inCategory('Case Study')">
                What did you think? Do you agree or not at all? Share your thoughts on the comments 🙂<br />
                <small>(This review is my advice on <template v-if="post.attributes.product_name">{{ post.attributes.product_name }}</template><template v-else>the service</template> and mine only. It might not be correct or justified to implement them.)</small>
            </p>
        </main>
        <div class="read-next">
            <div class="previous">
              <nuxt-link v-if="previous" :to="`/posts/${previous.slug}`" :title="`Read my prev article: ${previous.title}`">←&nbsp;{{ previous.title }}</nuxt-link>
            </div>
            <div class="next">
              <nuxt-link v-if="next" :to="`/posts/${next.slug}`" :title="`Read my next article: ${next.title}`">{{ next.title }}&nbsp;→</nuxt-link>
            </div>
        </div>
    </article>

    <div v-if="post.attributes.comments" class="disqus-comments" itemprop="comment">
        <div class="comments">
            <vue-disqus shortname="cx42net" :identifier="$route.params.slug" :url="'https://cnicodeme.com/' + $route.path"></vue-disqus>
        </div>
    </div>
  </div>
</template>

<script>
import Markdown from '~/components/Markdown'
import desc from '~/plugins/desc'
import moment from 'moment'
const readingTime = require('reading-time');

export default {
  components: { Markdown },
  async asyncData({ app, params, store }) {
    let previous = store.getters.previousPost(params.slug)
    let next = store.getters.nextPost(params.slug)
    let post = store.getters.post(params.slug)

    return {
      post: {
        attributes: post.attributes,
        html: post.html,
        /*vue: {
          renderFunc: `(${post.vue.render})`,
          staticRenderFuncs: `[${post.vue.staticRenderFns}]`,
        }*/
      },
      previous: (previous ? previous.attributes : null),
      next: (next ? next.attributes : null )
    }
  },
  computed: {
    destinationFolder () {
      return moment(this.post.attributes.date).format('YYYY/MM-DD')
    },
    thumbnail () {
      if (this.post.attributes.thumbnail) {
        return require(`~/static/images/${this.destinationFolder}/${this.post.attributes.thumbnail}`)
      }
    }
  },
  methods: {
    readingTime (content) {
      return readingTime(content).text
    },
    inCategory(cat) {
      if (!this.post.attributes.categories) {
        return false
      }
      return this.post.attributes.categories.indexOf(cat) > -1
    },
    getDescription () {
      return desc(this.post)
    }
  },
  head() {
    const head = {
      title: this.post.attributes.title,
      meta: [
        // Global
        { hid: 'description', name: 'description', content: this.getDescription() },
        { hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: this.post.attributes.title + ' - cnicodeme.com' },

        { hid: 'article:published_time', property: 'article:published_time', content: this.post.attributes.date },
        { hid: 'article:modified_time', property: 'article:modified_time', content: this.post.attributes.date },

        // Fb
        { hid: 'og:title', name: 'og:title', content: this.post.attributes.title + ' - cnicodeme.com' },
        { hid: 'og:description', name: 'og:description', content: this.getDescription() },
        { hid: 'og:url', name: 'og:url', content: 'https://cnicodeme.com' + this.$route.path },
        
        // Twitter
        { hid: 'twitter:card', name: 'twitter:card', content: (this.thumbnail ? 'summary_large_image' : 'summary') },
        { hid: 'twitter:title', name: 'twitter:title', content: this.post.attributes.title + ' - cnicodeme.com' },
        { hid: 'twitter:description', name: 'twitter:description', content: this.getDescription() },
      ],
      link: [{ rel: 'canonical', href: 'https://cnicodeme.com' + this.$route.path }]
    }

    if (this.thumbnail) {
      head.meta.push({ hid: 'twitter:image', name: 'twitter:image', content: this.thumbnail })
      head.meta.push({ hid: 'og:image', name: 'og:image', content: this.thumbnail })
    }

    return head
  },
  jsonld () {
    const jsonld = {
      "@context": "https://schema.org/",
      "@type": "Article",
      "author": {
        "@type": "Person",
        "name": "Cyril NICODEME",
        "image": "https://www.gravatar.com/avatar/27dd30e7355a2f2740b636da145c4903?s=256",
        "sameAs": ["https://cnicodeme.com", "https://twitter.com/cx42net/"]
      },
      "headline": this.post.title,
      "url": 'https://cnicodeme.com' + this.$route.path,
      "datePublished": this.post.attributes.date,
      "dateModified": this.post.attributes.date,
      "publisher": {
        "@type": "Organization",
        "name": "Cnicodeme.com",
        /*
        "logo": {
          "@type": "ImageObject",
          "url": "https://hackersandslackers-cdn.storage.googleapis.com/2020/03/logo-blue-full.png",
          "width": 60,
          "height": 60
        }
        */
      },
      "description": this.getDescription(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://cnicodeme.com"
      }
    }

    if (this.thumbnail) {
      jsonld['image'] = {
        "@type": "ImageObject",
        "url": 'https://cnicodeme.com' + this.thumbnail.src,
        "width": this.thumbnail.width,
        "height": this.thumbnail.height
      }
    }

    return jsonld
  }
}
</script>