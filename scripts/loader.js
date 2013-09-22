var jewel = {
  screens: {}
}

window.addEventListener('load', function() {
  
  //this test determines whether the standalone mode is enabled
  // because the question doesnt make senese on non-ios devices, we
  // treat a non-existent standalone property as if its running in standalone mode

  Modernizr.addTest('standalone', function() {
    return (window.navigator.standalone != false)
  })


  //loading has been divided into 2 stages, the second stage is only activated if the game is running in 
  // standalone mode
  // stage 1
  Modernizr.load([
    {
    load : [
            'scripts/sizzle.js',
            'scripts/dom.js',
            'scripts/game.js'
            // 'scripts/screen.splash.js',
            // 'scripts/screen.main-menu.js'
            ]
    },
    {
      test: Modernizr.standalone,
      yep: 'scripts/screen.splash.js',
      nope: 'scripts/screen.install.js',
      complete: function(){
        jewel.game.setup()
        if (Modernizr.standalone) {
          jewel.game.showScreen('splash-screen')
        } else {
          jewel.game.showScreen('install-screen')
        }
      }
    }
  ])

  // stage 2
  if(Modernizr.standalone) {
    Modernizr.load([
    {
      load: ['scripts/screen.main-menu.js']
    }])
  }
    //called when all files have finished loading and executing
  //   complete: function() {
  //     console.log('all files loaded')
  //     jewel.game.showScreen('splash-screen')
  //   }
  //   }
  // ])
}, false)