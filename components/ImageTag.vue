
<template>
  <div class="image" :class="`align-${align}`">
      <a :href="maxSizeUrl" target="_blank">
        <img :data-src="url" :data-srcSet="this.srcSet" class="lazyload" />
      </a>
  </div>
</template>

<script>
import { resolve } from 'path'

export default {
    data () {
      return {
        srcSet: null
      }
    },
    props: {
        src: { type: String, required: true },
        alt: { type: String, required: false },
        filename: { type: String, required: false },
        caption: { type: String, required: false},
        width: { type: String },
        height: { type: String },
        align: { type: String, default: 'center' }
    },
    computed: {
      destinationFolder () {
        return this.$parent.$parent.destinationFolder
      },
      url () {
        let filename = this.src
        if (this.src.substr(0, 4) === 'http') {
            // Special treatment
            filename = this.download(this.src)
            if (process.server) {
              return this.src
            }
        }

        const result = require(`~/static/images/${this.destinationFolder}/${filename}`)
        this.srcSet = result.srcSet
        return result
      },
      maxSizeUrl () {
        if (this.url && this.url.images && this.url.images.length > 0) {
          return this.url.images[this.url.images.length - 1].path
        }
        
        return this.url
      }
    },
    methods: {
      download (src) {
        const url = require('url')

        // building the name
        let url_parts = url.parse(src)
        if (url_parts.pathname.slice(-1) === '/') {
            throw Exception('Missing "filename" parameter. Unable to guess from the URL.')
        }

        let filename = url_parts.pathname.substr(url_parts.pathname.lastIndexOf('/') + 1)
        let extension = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase()

        if (['gif', 'png', 'jpg', 'jpeg'].indexOf(extension) === -1) {
            throw Exception('Missing extension value in the URL. Unable to guess. The "Filename" parameter is required.')
        }

        let original_filename = filename
        if (this.filename) {
          filename = this.filename
        } else if (this.alt) {
          filename = this.slugify(this.alt) + '.' + extension
        }

        if (process.server) {
          const fs = require('fs')
          const request = require('request')

          let fullpath = resolve(process.cwd(), `./static/images/${this.destinationFolder}`)
          if (original_filename !== filename) {
            if (fs.existsSync(`${fullpath}/${original_filename}`)) {
              console.log(`Deleting file ${fullpath}/${original_filename}`)
              fs.unlinkSync(`${fullpath}/${original_filename}`)
            }
          }
          
          if (!fs.existsSync(`${fullpath}/${filename}`)) {
              console.log(`Downloading file: ${src} to ${fullpath}/${filename}`)
              fs.mkdirSync(fullpath, { recursive: true })
              request(src).pipe(fs.createWriteStream(`${fullpath}/${filename}`))
          }
        }

        return filename
      },
      slugify (str) {
        return str
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g,'-')
          .replace(/^-+/, '')          // Trim - from start of text
          .replace(/-+$/, '');         // Trim - from end of text
      }
    }
}
</script>

<style scoped lang="scss">
a {
  border-bottom: none !important;
  img {
    transition: all ease .3s;
    opacity: 0;
    border: solid 2px #bbb;
    border-radius: 5px;

    &.lazyloading {
      opacity: 1;
      filter: blur(15px);
    }
    &.lazyloaded {
      opacity: 1;
    }
  }

  &:hover img {
    border-color: #666666
  }
}

.align-center { text-align: center }
.align-left { text-align: left }
.align-right { text-align: right }
</style>