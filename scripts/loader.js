var jewel = {
  screens: {}
}

window.addEventListener('load', function() {
  Modernizr.load([
    {
    load : ['scripts/sizzle.js',
            'scripts/dom.js',
            'scripts/game.js',
            'scripts/screen.splash.js',
            'scripts/screen.main-menu.js'],

    //called when all files have finished loading and executing
    complete: function() {
      console.log('all files loaded')
      jewel.game.showScreen('splash-screen')
    }
    }
  ])
}, false)