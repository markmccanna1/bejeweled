jewel.screens['main-menu'] = (function() {
  var dom = jewel.dom,
  game = jewel.game,
  firstRun = true

  function setup(){
    dom.bind('#main-menu ul.menu', 'click', function(e) {
      if (e.target.nodeName.toLowerCase() === 'button') {
        var action = e.target.getAttribute('name')
        game.showScreen(action)
      }
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

//the first time the main menu is displayed the event handling is set up so that clicking on the menu item
// takes the user to the appropriate screens
