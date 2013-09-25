jewel.screens['splash-screen'] = (function(){
  var game = jewel.game,
  dom = jewel.dom,
  $ = dom.$
  firstRun = true


  // this setup function starts a cycle that keeps calling checkProgress() until 
  // get load progress returns 1
  function setup(getLoadProgress){
    var scr = $('#splash-screen')[0]

    function checkProgress(){
      var p = getLoadProgress() * 100
      $('.indicator', scr)[0].style.width = p + '%'
      if (p === 100) {
        $('.continue', scr)[0].style.display = 'block'
        dom.bind(scr, 'click', function() {
          jewel.game.showScreen('main-menu')
        })
      } else {
        setTimeout(checkProgress, 30)
      }
    }
    checkProgress()
  }

  function run(getLoadProgress){
    if (firstRun) {
      setup(getLoadProgress)
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