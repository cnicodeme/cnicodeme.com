<template>
  <article class="page" itemscope itemtype="http://schema.org/BlogPosting">
    <h1 itemprop="headline name">{{ content.attributes.title }}</h1>
    <main itemprop="articleBody" id="article-body">
      <Markdown :html="content.html" />
    </main>
  </article>
</template>


<script>
import Markdown from '~/components/Markdown'

export default {
  components: { Markdown },
  data () {
    const content = require('~/content/about.md')
    return { content }
  },
  head () {
    const title = 'About me'
    const description = "Hey 👋 I'm Cyril Nicodeme, a passionate French developer. I built and sold Voilanorbert (https://voilanorbert.com), Selldom (https://selldom.io) and Transferslot (https://transferslot.com). I'm currently running ImprovMX.com and PDFShift.io. Feel free to reach out and talk about anything 😃"

    return {
      title: title,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 'apple-mobile-web-app-title',name: 'apple-mobile-web-app-title', content: `${title} - cnicodeme.com` },
        // Fb
        { hid: 'og:type', property: 'og:type', content: 'profile' },
        { hid: 'og:title', name: 'og:title', content: `${title} - cnicodeme.com` },
        { hid: 'og:description', name: 'og:description', content: description },
        { hid: 'og:url', name: 'og:url', content: 'https://cnicodeme.com' + this.$route.path },
        
        // Twitter
        { hid: 'twitter:title', name: 'twitter:title', content: `${title} - cnicodeme.com` },
        { hid: 'twitter:description', name: 'twitter:description', content: description },
      ]
    }
  }
}
</script>