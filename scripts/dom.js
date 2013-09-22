jewel.dom = (function() {
  var $ = Sizzle

  function hasClass(el, clsName) {
    var regex = new RegExp('(^|\\s)' + clsName + '(\\s|$)')
    return regex.test(el.className)
  }

  function addClass(el, clsName) {
    if (!hasClass(el, clsName)) {
      el.className += ' ' + clsName
    }
  }

  function removeClass(el, clsName) {
    var regex = new RegExp('(^|\\s)' + clsName + '(\\s|$)')
    el.className = el.className.replace(regex, ' ')
  }

  function bind(element, event, handler) {
    if (typeof element == 'string') {
      element = $(element)[0]
    }
    element.addEventListener(event, handler, false)
  }

  return {
    $ : $,
    hasClass : hasClass,
    addClass : addClass,
    removeClass : removeClass,
    bind : bind
  }
})()


// all game modules are properties of the jewel namespace
// thyere basically just objects with public methods
// this is the module patter:
// all functionality is defined indisde an anonymous function that returns
// an object literal with references to the functions that should
// be exposed to the outside world
// the anonymous function is immediately invoked and the return value is assigned
// to a property on the jewel namespace object

// this is an easy way to keep the global scope pure