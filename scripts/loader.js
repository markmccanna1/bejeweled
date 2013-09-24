var jewel = {
  screens: {},
  settings: {
    rows: 8,
    cols: 8,
    baseScore: 100,
    numJewelTypes: 7
  }
}

window.addEventListener('load', function() {
  
  //this test determines whether the standalone mode is enabled
  // because the question doesnt make senese on non-ios devices, we
  // treat a non-existent standalone property as if its running in standalone mode

  Modernizr.addTest('standalone', function() {
    return (window.navigator.standalone != false)
  })


  //this prefix allows you to add preload to the file paths passed to modernizr's load function
  // if the file has the prefix, the script doesnt execute

  yepnope.addPrefix('preload', function(resource) {
    resource.noexec = true
    return resource
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
      load: [
              'scripts/screen.main-menu.js'
              // 'scripts/board.js'
            ]
    },
    {
      //adding the preload prefix to the board.worker file tells the program
      // to load it but not execute it
      test: Modernizr.webworkers,
      yep: ['scripts/board.worker-interface.js',
            'preload!scripts/board.worker.js'],
      nope: 'scripts/board.js'
    }
    ])
  }
    //called when all files have finished loading and executing
  //   complete: function() {
  //     console.log('all files loaded')
  //     jewel.game.showScreen('splash-screen')
  //   }
  //   }
  // ])
}, false)