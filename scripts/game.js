jewel.game = (function() {
  var dom = jewel.dom
  $ = dom.$

  //hide the active screen if any, and show the screen with the specified id
  //this made need an extra argument 
  function showScreen(screenId){
    var activeScreen = $('#game .screen.active')[0]

    screen = $('#' + screenId)[0]
    
    if (activeScreen) {
      dom.removeClass(activeScreen, 'active')
    }
    // dom.addClass(screen, 'active')
    //extract screen paramters from arguments
    // i want to disect this
    var args = Array.prototype.slice.call(arguments, 1)
    //^ the showScreen function should support any 
    // any number of parameters that must be passed on to the relevant screen
    // module
    // it does so by calling the run method on the screen via its apply method
    // and passing it the remaining arguments 

    //when a function is called, all arguments are accessible via an object called arguments, even if 
    // they are not named like screenId.
    // the arguments object is what is called array-like, that is, it behaves like an array
    // the arguments object is a list of elements and has a length property, 
    // the arguments object doesnt have a slice method,
    // so what you can do is use the slice function form the Array prototype on the arguments object
    // in JS, functions are objects just like everything else, all functions have a call method, which can
    // be used to invoke the function as if it were called on another object
    // you simply pass this other objects as the first paramter to call
    // if the function takes any paramters, theyre just passed in afterwards
    // hte array functions dont require the object theyre called on to be a true array.
    // any array like object works fine

    //the function call can be used to invoke the function as if it were another object

    // functions have also have a method called apply, 
    // this method is similar to call(), but instead of supplying the function parameters directly as
    // arguments to call(), you supply an array of values as the second parameter
    //this is used below to call run on the screen module, using its own remaining arguments

    //run the screen module
    // so apply is being called on run, the first paramter the object the run is being invoked on
    //so run is being called on jewe.screens[screenId], and run is being passed the array args as a 
    // paramater for run itself

    //run now accepts the get loadProgress function from here, its passed to the splash screen
    // object, which now nows about the load status of the game
    jewel.screens[screenId].run.apply(jewel.screens[screenId], args)
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
    createBackground()
  }


  function createBackground(){
    if(!Modernizr.canvas) return
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    background = $('#game .background')[0],
    rect = background.getBoundingClientRect(),
    gradient, i

    canvas.width = rect.width
    canvas.height = rect.height

    ctx.scale(rect.width, rect.height)
    gradient = ctx.createRadialGradient(
      .25, .15, .5,
      .25, .15, 1)
    gradient.addColorStop(0,'rgb(55,65,0)')
    gradient.addColorStop(1, 'rgb(0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0,0,1,1)
    ctx.strokeStyle = 'rgba(255,255,255,.02)'
    ctx.strokeStyle = 'rgba(0,0,0,0,.2)'
    ctx.lineWidth = 0.008
    ctx.beginPath()
    for (i = 0; i < 2; i+= 0.02) {
      ctx.moveTo(i, 0)
      ctx.lineTo(i - 1, 1)
    }
    ctx.stroke()
    background.appendChild(canvas)
  }

  //expose public methods
  return {
    showScreen : showScreen,
    setup : setup
  }

})()