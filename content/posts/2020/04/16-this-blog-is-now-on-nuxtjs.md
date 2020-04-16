---
title: 'This blog is now on NuxtJS 😀'
thumbnail: nuxt.jpg
date: 2020-04-16 20:59:27
---

<image-tag src="https://madewithnetwork.ams3.cdn.digitaloceanspaces.com//spatie-space-production/3075/nuxtjs-2.jpg" filename="nuxt.jpg" />

It's been quite some time that I wanted to change the engine behind [cnicodeme.com](https://cnicodeme.com) but I didn't know which one to choose.

Previously, this blog was using [Hexo](https://hexo.io). It's a nice tool to quickly generate a static website/blog, but it's quite limited when you want to do a bit more than just blogging.

I had my eyes on VuePress a bit but was open to other tools. My only requirements were using either Python or Javascript, with a preference for Javascript for its popularity (and thus more chances to have some interesting modules ready).

I quickly narrowed down to Gatsby and Nuxt, and since I'm not a big fan of React, the decision to try Nuxt was made.

<!-- more -->

Now, I had to understand how everything works. For this, I'm grateful for [Derkinzi.de](https://derkinzi.de/nuxt-jam-stack/), which gave me enough great stuff to get started.

After that, I had to implement all the nifty things that make this blog running. Not all is perfect, mostly the fact that the markdown content is loaded (and compiled!) almost every time needed (Routes, Feeds, posts, etc). I'll work on that.

So here's what I worked on:
 * Implemented Markdown for the blog post. This was quite hard because I wanted to implement a custom Image processor in the markdown...
 * Custom Image processor, that locally download external images and generate various sizes of them.
 * A Sitemap generator, that includes custom routes
 * A Feed generator, in both Atom and RSS2
 * Prism plugins for syntax highlighting
 * Disqus plugin for the comments
 * Advanced meta tags details for social networks and JSON-LD

The website is already available publicly at [Github](https://github.com/cnicodeme/cnicodeme.com), so you can already take a look and see for yourself, but I plan to make a dedicated blog post explaining how I've implemented every part to help anyone.
