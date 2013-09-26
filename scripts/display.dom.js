//this module displays the board using css without using the canvas element
jewel.display = (function() {
  var dom = jewel.dom,
  $ = dom.$,
  cols, rows,
  jewelSize, firstRun = true,
  jewelSprites

  function initialize(callback) {
    // initialize the board
    if (firstRun) {
      setup()
      firstRun = false
    }
    callback()
  }

  //unlike the redraw function in the canvas based display module,
  // this function doesnt so much draw the jewels as it changes them
  // the div elements with the background image are already there, you just need to adjust their
  // background position
  // because the font-size of the board is set specififally to match the size of a jewel, the number of em units
  // you need to offset the background is simply equal to the jewel type
  function redraw(jewels, callback) {
    // redraw board
    var x, y
    for (x = 0; x < cols; x++) {
      for (y = 0; y < rows; y++) {
        drawJewel(jewels[x][y],x,y,0,0)
      }
    }
    callback()
  }

  function drawJewel(type, x, y) {
    // the sprites are in order of their type, they have a background position which is what decides
    // what to display
    var sprite = jewelSprites[x][y]
    sprite.style.backgroundPosition = type + 'em 0em'
    sprite.style.display = 'block'
  }

  function createBackground(){
    var x,y,cell,
    background = document.createElement('div')
    for (x = 0; x < cols; x++){
      for (y = 0; y < cols; y++){
        if ((x + y) % 2) {
          cell = document.createElement('div')
          cell.style.left = x + 'em'
          cell.style.top = y + 'em'
          background.appendChild(cell)
        }
      }
    }
    dom.addClass(background, 'board-bg')
    return background
  }


  //the setup function creates a container div
  // to hold the jewel sprites
  // the nested loops create a sprite div element for each position
  // on the board
  // the jewel size is used to assign the appropriate jewel background
  // image before the jewel div is added to the container
  // the sprite div elements are also stored in a two dimensional array
  // so you can easily reference them later
  // 

  // because the size of the board can change as a result of a user switching device
  // orientation, the selected jewel background might end up too small or large
  // one way to fix this situation is to check the background images whenever an
  // orientation change is detected
  // by setting the background image size to 100%, you can make sure taht
  // a single jewel always fits the size of its div element
  function setup() {

    var boardElement = $('#game-screen .game-board')[0],
    container = document.createElement('div'),
    sprite, x, y

    cols = jewel.settings.cols
    rows = jewel.settings.rows

    jewelSize = jewel.settings.jewelSize
    jewelSprites = []

    for (x = 0; x < cols; x++) {
      jewelSprites[x] = []
      for (y = 0; y < cols; y++) {
        sprite = document.createElement('div')
        dom.addClass(sprite, 'jewel')
        sprite.style.left = x + 'em'
        sprite.style.top = y + 'em'
        sprite.style.backgroundImage = 'url(images/jewels' + jewelSize + '.png)'
        sprite.style.backgroundSize = (jewel.settings.numJewelTypes * 100) + '%'
        jewelSprites[x][y] = sprite
        container.appendChild(sprite)
      }
    }
    dom.addClass(container, 'dom-container')
    boardElement.appendChild(createBackground())
    boardElement.appendChild(container)
  }

  return {
    initialize : initialize, 
    redraw : redraw
  }
})()