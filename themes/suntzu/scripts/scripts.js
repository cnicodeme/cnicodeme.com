/* global hexo document */
'use strict';

const path = require('path')
const moment = require('moment')
const fs = require('fs')
const url = require('url')
const request = require('request')

let slugify = (str) => {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g,'-')
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
        ;
}

let getDestinationFolder = (post) => {
    return '/static/images/' + post.date.format('YYYY/MM-DD') + '/'
}

let getFileUrl = (path, options, post) => {
    let destinationFolder = getDestinationFolder(post)
    if (!path) {
        return path
    }

    if (path.substr(0, 4).toLowerCase() !== 'http') {
        return destinationFolder + path
    }
    // building the name
    let url_parts = url.parse(path)
    if (url_parts.pathname.slice(-1) === '/') {
        throw Exception('Missing "filename" parameter. Unable to guess from the URL.')
    }

    let filename = url_parts.pathname.substr(url_parts.pathname.lastIndexOf('/') + 1)
    let extension = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase()

    if (['gif', 'png', 'jpg', 'jpeg'].indexOf(extension) === -1) {
        throw Exception('Missing extension value in the URL. Unable to guess. The "Filename" parameter is required.')
    }

    if (options) {
        let original_filename = filename
        if (options.hasOwnProperty('filename') && options.filename) {
            filename = options.filename
        } else if (options.hasOwnProperty('alt') && options.alt) {
            filename = slugify(options.alt) + '.' + extension;
        }

        // This is for dev purposes
        if (filename != original_filename) {
            if (fs.existsSync('./' + hexo.config.source_dir + destinationFolder + original_filename)) {
                fs.unlinkSync('./' + hexo.config.source_dir + destinationFolder + original_filename)
            }
        }
    }

    if (!fs.existsSync('./' + hexo.config.source_dir + destinationFolder + filename)) {
        fs.mkdirSync('./' + hexo.config.source_dir + destinationFolder, { recursive: true })
        request(path).pipe(fs.createWriteStream('./' + hexo.config.source_dir + '/' + destinationFolder + filename))
    }

    return destinationFolder + filename
}


hexo.extend.tag.env.addGlobal('image_tag', function (path, options) {
    if (!options) options = {}

    let fileUrl = getFileUrl(path, options, this.ctx);

    if (!options.hasOwnProperty('cls')) {
        options['cls'] = 'center'
    }

    let tag = '<div class="image image-' + options.cls + '"><a href="' + fileUrl + '" target="_blank"><img src="' + fileUrl + '" '
    if (options.hasOwnProperty('alt') && typeof(options.alt) === 'string' && options.alt !== '') tag += 'alt="' + options.alt.replace('"', '&#34;') + '" '
    tag += '/></a>'

    if (options.caption) {
        tag += '<span>' + options.caption + '</san>'
    }

    return tag + '</div>'
})

// If config.lowercase is set, convert post slugs to all lowercase.
hexo.extend.filter.register('new_post_path', function (data, replace) {
    if (typeof data === 'string'  && hexo.config.lowercase) {
        data = path.dirname(data) + path.sep + path.basename(data).toLowerCase();
    }
    return data;
});

hexo.extend.helper.register('in_category', function (data, category) {
    if (data === undefined || data === null) {
        return false
    }

    return data.slug === category
})

hexo.extend.filter.register('before_post_render', function (post) {
    if (post.thumbnail) {
        post.thumbnail = getFileUrl(post.thumbnail, null, post)
    }
})

hexo.extend.filter.register('before_render:nunjucks', function SplitFilter (env) {
    env.addFilter('json', function (str) {
        for (let k in str) {
            switch (typeof(str[k])) {
                case 'boolean':
                case 'number':
                case 'string':
                    console.log('\x1b[31m' + k + '\x1b[0m: \x1b[32m' + str[k] + '\x1b[0m')
                    break;
                case 'function':
                case 'symbol':
                case 'object':
                    if (str[k] === null) {
                        console.log('\x1b[31m' + k + '\x1b[0m:  \x1b[32mnull\x1b[0m')
                    }
                    else if ('length' in str[k] && typeof(str[k].length) === 'number') {
                        console.log('\x1b[31m' + k + '\x1b[0m:  \x1b[32mArray of length ' + str[k].length + '\x1b[0m')
                    } else {
                        console.log('\x1b[31m' + k + '\x1b[0m:  \x1b[32mObject\x1b[0m')
                    }
                    break;
                default:
                    console.log('WHAT?')
            }
        }
    })

    env.addFilter('date', function(date, format) {
        return moment(date).format(format)
    })
})