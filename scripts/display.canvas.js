jewel.display = (function() {
  var dom = jewel.dom,
  $ = dom.$,
  canvas, ctx,
  cols, rows, 
  jewelSize, 
  firstRun = true,
  jewels


  function drawJewel(type, x, y) {
    // console.log('images/jewels' + jewelSize + '.png')
    // console.log(type)
    var image = jewel.images['images/jewels' + jewelSize + '.png']
    // console.log(jewelSize)
    // console.log(jewelSize * x)
    // console.log(jewelSize * y)

    ctx.drawImage(image, type * jewelSize, 0, jewelSize, jewelSize,
                  x * jewelSize, y * jewelSize, jewelSize, jewelSize)
  }

  //this function clears the entire canvas before iterating over all
  // board positions to paint a jewel image in each cell
  // a draw jewel helper function takes care of the actual drawing
  // the display module has no concept of the game state, it just
  // knows what it was told to draw 
  function redraw(newJewels, callback){
    var x, y,
    jewels = newJewels
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (x = 0; x < cols; x++) {
      for (y = 0; y < rows; y++) {
        drawJewel(jewels[x][y], x, y) 
      }
    }
    callback()
  }

  function createBackground(){
    var background = document.createElement('canvas'),
    bgctx = background.getContext('2d')
    dom.addClass(background, 'background')
    background.width = cols * jewelSize
    background.height = rows * jewelSize
    bgctx.fillStyle = 'rgba(225,235,255,.15)'

    for(var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {
        // huh?
        if ((x + y) % 2) {
          bgctx.fillRect(x*jewelSize, y*jewelSize, jewelSize, jewelSize)
        }
      }
    }
    return background
  }

  function setup(){
    var boardElement = $('#game-screen .game-board')[0]
    cols = jewel.settings.cols
    rows = jewel.settings.rows

    jewelSize = jewel.settings.jewelSize
    canvas = document.createElement('canvas')
    ctx = canvas.getContext('2d')

    dom.addClass(canvas, 'board')
    canvas.width = cols * jewelSize
    canvas.height = rows * jewelSize

    boardElement.appendChild(createBackground())
    boardElement.appendChild(canvas)
  }

  function initialize(callback){
    if (firstRun) {
      setup()
      firstRun = false
    }
    callback()
  }

  return {
    initialize : initialize,
    redraw : redraw,
  }
})()