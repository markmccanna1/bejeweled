jewel.game = (function() {
  var dom = jewel.dom
  $ = dom.$

  //hide the active screen if any, and show the screen with the specified id
  function showScreen(screenId){
    var activeScreen = $('#game .screen.active')[0]

    screen = $('#' + screenId)[0]

    if (activeScreen) {
      dom.removeClass(activeScreen, 'active')
    }
    // dom.addClass(screen, 'active')

    //run the screen module
    jewel.screens[screenId].run()
    //display the html
    dom.addClass(screen, 'active')
  }

  //this setup function should be invoked once before the first screen is shown
  function setup(){
    //disable native touchmove behavior to prevent overscroll
    dom.bind(document, 'touchmove', function(event) {
      event.preventDefault()
    })

    //hide the address bar on android devices
    if (/Android/.test(navigator.userAgent)) {
      $('html')[0].style.height = '200%'
      setTimeout(function() {
        window.scrollTo(0,1)
      }, 0)
    }
  }

  //expose public methods
  return {
    showScreen : showScreen,
    setup : setup
  }

})()