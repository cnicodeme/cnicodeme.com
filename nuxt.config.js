import path from 'path'
import FMMode from 'frontmatter-markdown-loader/mode'
import glob from 'glob'
import fs from 'fs'
import moment from 'moment'
const frontmatter = require('front-matter')
const htmlToText = require('html-to-text');

const builtAt = new Date().toISOString()
const baseUrl = 'https://cnicodeme.com';

async function getDynamicPaths(urlFilepathTable) {
  return [].concat(
    ...Object.keys(urlFilepathTable).map(url => {
      var filepathGlob = urlFilepathTable[url];
      let r = glob
        .sync(filepathGlob, { cwd: 'content/' })
        .map(filepath => {
          let stats = fs.statSync(`content/${filepath}`)
          let slug = path.basename(filepath, '.md')
          slug = slug.substr(slug.indexOf('-') + 1)
          return {
            url: `${url}${slug}`,
            lastmod: stats.mtime
          }
        });
      return r
    })
  );
}

async function create(feed) {
  feed.options = {
    title: "Cyril Nicodeme's blog",
    link: 'https://cnicodeme.com/atom.xml',
    description: 'Adventures of a web developer.'
  }

  /*
   * This is really dirty
   * We load the markdown a shit-ton of time over the Nuxt process,
   * because we can't access the store at this stage :/
   */

  const posts = glob
    .sync('**/*.md', { cwd: 'content/posts/' })
    .map(filepath => {
      let slug = path.basename(filepath, '.md')
      slug = slug.substr(slug.indexOf('-') + 1)

      const content = fs.readFileSync(`./content/posts/${filepath}`, 'utf8');
      let post = frontmatter(content)
      let body = htmlToText.fromString(post.body)
      return {
        title: post.attributes.title,
        date: post.attributes.date,
        id: slug,
        link: 'https://cnicodeme.com/posts/' + slug,
        description: post.attributes.description || body.substr(250) + '...',
        content: body
      }
    });
  
  posts
    .sort((a, b) =>
      moment(b.date, 'YYYY-MM-DD').diff(moment(a.date, 'YYYY-MM-DD'))
    )
    .forEach(post => {
      feed.addItem(post)
    })

  feed.addContributor({
    name: 'Cyril Nicodeme',
    link: 'https://cnicodeme.com/'
  })
}

export default async () => {
  return {
    mode: 'universal',
    /*
    ** Headers of the page
    */
    head: {
      titleTemplate: (titleChunk) => {
        // If undefined or blank then we don't need the hyphen
        return titleChunk ? `${titleChunk} - cnicodeme.com` : 'Adventures of a web developer.';
      },
      meta: [
        // General
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: "Adventures of a web developer." },
        { hid: 'apple-mobile-web-app-title',name: 'apple-mobile-web-app-title', content: 'Adventures of a web developer.' },
        { hid: 'author', name: 'author', content: 'Cyril Nicodeme' },
        // Twitter
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', name: 'twitter:site', content: '@cx42net' },
        { hid: 'twitter:creator', name: 'twitter:creator', content: '@cx42net' },
        { hid: 'twitter:title', name: 'twitter:title', content: "Cyril Nicodeme's blog" },
        { hid: 'twitter:description', name: 'twitter:description', content: "Adventures of a web developer." },
        // { hid: 'twitter:image', name: 'twitter:image', content: null },

        // Facebook
        { hid: 'og:title', name: 'og:title', content: "Cyril Nicodeme's blog" },
        { hid: 'og:site_name', name: 'og:site_name', content: "Cyril Nicodeme" },
        { hid: 'og:description', name: 'og:description', content: "Adventures of a web developer." },
        { hid: 'og:url', name: 'og:url', content: 'https://cnicodeme.com' },
        // { hid: 'og:image', name: 'og:image', content: null },
        { hid: 'og:type', name: 'og:type', content: 'blog' },
        { hid: 'og:locale', name: 'og:locale', content: 'en_US' },
        { property: 'og:updated_time', content: builtAt }
      ],
      link: [
        // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'alternate', type: 'application/atom+xml', title: 'Cyril Nicodeme', href: '/atom.xml' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Cyril Nicodeme', href: '/feed.xml' }

      ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: { color: '#fff' },
    /*
    ** Global CSS
    */
    css: [
      '@/assets/css/general.scss'
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
      '~/plugins/lazysizes.client',
      '~/plugins/filters',
      '~/plugins/jsonld',
      '~/plugins/disqus'
    ],
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
      ['@nuxtjs/google-analytics', {
        id: 'UA-17593304-1'
      }]
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
      'nuxt-responsive-loader',
      '@nuxtjs/sitemap',
      '@nuxtjs/feed'
    ],
    /*
    ** Response loader properties
    */
    responsiveLoader: {
      name: 'images/[name]-[width].[ext]',
      sizes: [320, 640, 768, 960, 1024, 1280, 1600, 1920],
      quality: 85,
      adapter: require('responsive-loader/sharp'),
    },
    /**
    ** Sitemap properties
    */
    sitemap: {
      hostname: 'https://cnicodeme.com',
      gzip: false, // No need, we are not heavy
      routes: async () => {
        let routes = await getDynamicPaths({
          'posts/': 'posts/**/*.md',
        })

        // We sort the posts by most recent first
        routes.sort((a, b) =>
          moment(b.lastmod, 'YYYY-MM-DD').diff(moment(a.lastmod, 'YYYY-MM-DD'))
        )

        const latestChange = routes[0].lastmod
        routes.push({
          'url': '/',
          lastmod: latestChange
        })

        return routes.map((r) => {
          return {
            url: r.url,
            lastmod: r.lastmod,
            changefreq: 'monthly',
            priority: 1
          }
        })
      }
    },
    /*
    ** Feed properties
    */
    feed: async () => {
      return [
        {
          path: '/feed.xml',
          create: create,
          type: 'rss2',
        },
        {
          path: '/atom.xml',
          create: create,
          type: 'atom1',
        }
      ]
    },
    /*
    ** Build configuration
    */
    build: {
      /*
      ** You can extend webpack config here
      */
     extend (config, { isDev, isClient, loaders: { vue } }) {
        if (isClient) {
          vue.transformAssetUrls.img = ['data-src', 'src']
          vue.transformAssetUrls.source = ['data-srcset', 'srcset']
        }
        config.resolve.alias['vue'] = 'vue/dist/vue.common'

        config.module.rules.push({
          test: /\.md$/,
          include: path.resolve(__dirname, "content"),
          loader: 'frontmatter-markdown-loader',
          options: {
            mode: [FMMode.HTML],
            vue: {
              root: 'post-content'
            }
          }
        });

      }
    },
    /*
    ** Generate configuration
    */
    generate: {
      dir: 'dist',
      // minify: false, // Doesn't work great :s
      devtools: false,
      async routes () {
        let routes = await getDynamicPaths({
          'posts/': 'posts/**/*.md',
        })

        return routes.map(r => r.url)
      }
    }
  }
}