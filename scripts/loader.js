var jewel = {
  screens: {},
  settings: {
    rows: 8,
    cols: 8,
    baseScore: 100,
    numJewelTypes: 7,

    //using keywords like this makes it easy to change the game controls
    // without having to modify the game code
    // you can also enable user defined controls
    // the bind function is used to attach handler functions to game actions
    // whenever the input module detects some form of user input that should trigger
    // that action, all the handler functions are called one by one
    controls: {
      KEY_UP : 'moveUp',
      KEY_LEFT: 'moveLeft',
      KEY_DOWN: 'moveDown',
      KEY_RIGHT: 'moveRight',
      KEY_ENTER: 'selectJewel',
      KEY_SPACE: 'selectJewel',
      CLICK: 'selectJewel',
      TOUCH: 'selectJewel'
    }
  },
  images : {}

}

window.addEventListener('load', function() {
  //determine jewel size
  var jewelProto = document.getElementById('jewel-proto'),
  rect = jewelProto.getBoundingClientRect()
  jewel.settings.jewelSize = rect.width
  
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

  var numPreload = 0,
  numLoaded = 0

  yepnope.addPrefix('loader', function(resource) {
    //loading file
    var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url)
    resource.noexec = isImage
    numPreload++

    resource.autoCallback = function(e) {
    //executes when the image is loaded
      numLoaded++
      if (isImage) {
        var image = new Image()
        image.src = resource.url
        jewel.images[resource.url] = image
      }
    }
    return resource
  })


  //the splash screen doesnt have access to this method normally, so were going
  // to modify showScreen in the game module so that it accepts parameters
  // and passes them on to activated screen modules
  function getLoadProgress(){
    if (numPreload > 0) {
      return numLoaded / numPreload
    } else {
      return 0
    }
  }


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
          // the progress function is now being passed to the splash 
          // screen so it can use the function to track how the loading 
          // progresses
          // you can use the same pattern in other situations, like passing score values to
          // the high score screen
          jewel.game.showScreen('splash-screen', getLoadProgress)
        } else {
          jewel.game.showScreen('install-screen')
        }
      }
    }
  ])

  // stage 2
  if(Modernizr.standalone) {
    // Modernizr.canvas = false
    Modernizr.load([
    {
      // you can simulate missing canvas support to trigger the DOM display be setting Modernizr.canvas to false
      // before the loading starts, by doing so you override whatever value Modernizr decided on in its feature detection
      test: Modernizr.canvas,
      yep: 'loader!scripts/display.canvas.js',
      nope: 'loader!scripts/display.dom.js'
    },{
      //adding the preload prefix to the board.worker file tells the program
      // to load it but not execute it

      //this works
      // test: Modernizr.webworkers,
      // yep: ['loader!scripts/board.worker-interface.js',
      //       'loader!scripts/board.js',
      //       'preload!scripts/board.worker.js'],
      // nope: 'loader!scripts/board.js'


      test: Modernizr.webworkers,
      yep: ['loader!scripts/board.worker-interface.js',
            'preload!scripts/board.worker.js'],
      nope: 'loader!scripts/board.js'
    },{
      load : [
              'loader!scripts/screen.main-menu.js',
              'loader!scripts/display.canvas.js',
              'loader!scripts/input.js',
              'loader!scripts/screen.main-menu.js',
              'loader!scripts/screen.game.js',
              'loader!images/jewels' + jewel.settings.jewelSize + '.png'
              ]
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