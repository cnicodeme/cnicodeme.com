#!/usr/bin/env node

const fs = require('fs')
const moment = require('moment')

function slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g,'-')
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
  }

const args = process.argv.slice(2)
if (args.length !== 1) {
    console.error('npm run create "Title of the post"')
    process.exit(1)
}

const today = new Date()
let date = moment.utc(today)
let dateStr = date.format('YYYY-MM-DD HH:mm:ss')
let filepath = '/content/posts/'
filepath += date.format('YYYY/MM/DD-')
filepath += slugify(args[0])
filepath += '.md'

const folder = filepath.substring(0, filepath.lastIndexOf("/") + 1);
fs.mkdirSync(process.cwd() + folder, { recursive: true })

fs.writeFileSync(process.cwd() + filepath, `---
title: '${args[0]}'
description: ""
# thumbnail: header.png
date: ${dateStr}
categories:
  - Case Study
tags:
  - Development
  - Study
  - Advices
---

`);

console.log(`File created at ${filepath}`)
process.exit(0)
