/*****
 * Static Files
 */
const langs = ['en']

const fs = require('fs')
const fm = require('front-matter')
const md = require('markdown-it')({html: true})
const mdDirs = [
  'backgrounds',
  'rules',
  'grenades',
  'tools',
  'conditions',
  'class_features',
  'races',
  'feats',
  'spells',
  'programs',
  'vehicles'
]


// changelog
const path = `./static/data/general/changelog`
const files = fs.readdirSync(path)
const items = files.map((file) => {
  const fc = fm(fs.readFileSync(`${path}/${file}`, 'utf8'))
  let item = {...fc.attributes, html: md.render(fc.body)}
  item.id = file.replace(/.md$/, '')
  item.date = new Date(item.date)
  item.slug = file.replace(/.md$/, '')
  item.url = `/changelog/${item.slug}`
  return item
})
items.reverse()
fs.writeFileSync(`${path}.json`, JSON.stringify(items, null, 2))



for (let lang of langs) {
  for (let dir of mdDirs) {
    const path = `./static/data/${lang}/${dir}`
    const files = fs.readdirSync(path)

    const items = files.map((file) => {
      const fc = fm(fs.readFileSync(`${path}/${file}`, 'utf8'))
      let item = {...fc.attributes, html: md.render(fc.body)}
      item.id = file.replace(/.md$/, '')
      switch (dir) {
        case 'rules':
          const fileParts = file.split('-')
          item.section = Number.parseInt(fileParts[0])
          item.subSection = Number.parseInt(fileParts[1])
          item.id = file.replace(/\.md$/g, '')
          item.hash = fileParts.splice(2).join('-').replace(/\.md$/g, '')
          break
        default:
          break
      }
      return item
    })
    fs.writeFileSync(`${path}.json`, JSON.stringify(items, null, 2))
  }
}


// process jsDirs
const jsonDirs = ['classes', 'bestiary']

for (let lang of langs) {
  for (let dir of jsonDirs) {
    const path = `./static/data/${lang}/${dir}`
    const files = fs.readdirSync(path)
    let items = files.map((file) => {
      const item = JSON.parse(fs.readFileSync(`${path}/${file}`, 'utf8'))
      if (dir === 'classes') {
        const progression = JSON.parse(fs.readFileSync(`./static/data/general/progressions/${file}`, 'utf8'))
        item.progression = progression
      }
      return item
    })
    fs.writeFileSync(`${path}.json`, JSON.stringify(items, null, 2))
  }
}
