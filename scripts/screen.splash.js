jewel.screens['splash-screen'] = (function(){
  var game = jewel.game,
  dom = jewel.dom,
  firstRun = true

  function setup(){
    dom.bind('#splash-screen', 'click', function(){
      game.showScreen('main-menu')
    })
  }

  function run(){
    if (firstRun) {
      setup()
      firstRun = false
    }
  }

  return {
    run : run
  }
})()

// the first time it is called, the public run method calls the setup function, this
// function sets an event handler on the screen element that switches screens when the user
// clicks the screen