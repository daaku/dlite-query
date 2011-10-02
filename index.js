var _ = require('underscore')
  , Delegator = require('delegator')

exports = module.exports = function(query, context) {
  if (!(this instanceof exports)) return new exports(query, context)
  this.query = query
  this.context = context
}

exports.prototype.all = function() {
  if (typeof this.query === 'string')
    return (this.context || document).querySelectorAll(this.query)
  if (_.isArray(this.query)) return this.query
  return [this.query]
}

exports.prototype.head = function() {
  if (typeof this.query === 'string')
    return (this.context || document).querySelector(this.query)
  if (_.isArray(this.query)) return this.query[0]
  return this.query
}

exports.prototype.map = function(cb) {
  return _.map(this.all(), cb)
}

exports.prototype.val = function(val) {
  if (typeof val == 'undefined') return this.head().value
  this.map(function(el) { el.value = val })
  return this
}

exports.prototype.attr = function(name, val) {
  if (typeof val == 'undefined') return this.head().getAttribute(name)
  this.map(function(el) { el.setAttribute(name, val) })
  return this
}

exports.prototype.data = function(name, val) {
  return this.attr('data-' + name, val)
}

exports.prototype.css = function(name, val) {
  if (typeof val == 'undefined') return this.head().style[name]
  this.map(function(el) { el.style[name] = val })
  return this
}

exports.prototype.remove = function() {
  this.map(function(el) { el.parentNode.removeChild(el) })
  return this
}

exports.prototype.html = function(html) {
  if (typeof html == 'undefined') return this.head().innerHTML
  this.map(function(el) { el.innerHTML = html })
  return this
}

exports.prototype.adjacentHTML = function(where, content) {
  this.map(function(el) { el.insertAdjacentHTML(where, content) })
  return this
}

exports.prototype.on = function(type, handler) {
  Delegator.listen(this.context, this.query, type, handler)
  return this
}
