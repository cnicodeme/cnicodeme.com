const regex = /(<([^>]+)>)/gi

export default function (post) {
    if (post.attributes.description) {
        return post.attributes.description
    }

    if (post.html.indexOf('<!-- more -->') > -1) {
        return post.html.substr(0, post.html.indexOf('<!-- more -->')).replace(regex, "")
    }

    return post.html.replace(regex, "").replace(/^(.{140}[^\s]*).*/, "$1") + '...'
}
