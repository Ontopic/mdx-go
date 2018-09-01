import path from 'path'
import match from 'minimatch'

console.log(__PATTERN__)

const context = require.context(__DIRNAME__, true, /\.(js|md|mdx)$/)
const REG = new RegExp('\.doc\.(md|mdx)$')

export const routes = context.keys()
  .map(key => {
    console.log(key, REG, REG.test(key))
    return key
  })
  .map(key => {
  const extname = path.extname(key)
  const name = path.basename(key, extname)
  if (/^_/.test(name)) return null
  const dirname = path.dirname(key).replace(/^\./, '')
  const exact = name === 'index'
  const pathname = dirname + '/' + (exact ? '' : name)

  const mod = context(key)
  const Component = mod.default
  if (typeof Component !== 'function') return null
  return {
    key,
    extname,
    name,
    exact,
    dirname,
    path: pathname,
    module: mod,
    Component,
  }
}).filter(Boolean)

routes.index = routes.find(route => route.path === '/')
routes.notFound = routes.find(route => route.name === '404') || {
  Component: () => 'not found'
}

export default routes
