jewel.display = (function() {
  var cursor,
  dom = jewel.dom,
  $ = dom.$,
  canvas, ctx,
  cols, rows, 
  jewelSize, 
  firstRun = true,
  jewels


  function moveJewels(movedJewels, callback){
    var n = movedJewels.length,
    mover, i
    for (i = 0; i < n; i++){
      mover = movedJewels[i]
      clearJewel(mover.fromX, mover.fromY)
    }
    for (i = 0; i < n; i++){
      mover = movedJewels[i]
      drawJewel(mover.type, mover.toX, mover.toY)
    }
    callback()
  }

  function removeJewels(removedJewels, callback){
    var n = removedJewels.length
    for (var i = 0; i < n; i++){
      clearJewel(removedJewels[i].x, removedJewels[i].y)
    }
    callback()
  }
  //this clears the jewel at the cursor position and redraws the jewel
  function clearCursor(){
    if (cursor) {
      var x = cursor.x,
      y = cursor.y

      clearJewel(x,y)
      //so its clearing the jewel and not drawing the other one
      // theres no jewels array defined
      drawJewel(jewels[x][y], x,y)
    }
  }

  function clearJewel(x,y){
    ctx.clearRect(x * jewelSize, y * jewelSize, jewelSize, jewelSize)
  }

  function setCursor(x,y,selected){
    clearCursor()
    if (arguments.length > 0) {
      cursor = {
        x: x,
        y: y,
        selected: selected
      }
    } else {
      cursor = null
    }
    renderCursor()
  }

  function drawJewel(type, x, y) {
  // console.log('images/jewels' + jewelSize + '.png')
    // console.log(type)
    var image = jewel.images['images/jewels' + jewelSize + '.png']

    ctx.drawImage(image, type * jewelSize, 0, jewelSize, jewelSize,
                  x * jewelSize, y * jewelSize, jewelSize, jewelSize)
  }

  //this function clears the entire canvas before iterating over all
  // board positions to paint a jewel image in each cell
  // a draw jewel helper function takes care of the actual drawing
  // the display module has no concept of the game state, it just
  // knows what it was told to draw 
  function redraw(newJewels, callback){
    var x, y
    jewels = newJewels
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (x = 0; x < cols; x++) {
      for (y = 0; y < rows; y++) {
        drawJewel(jewels[x][y], x, y) 
      }
    }
    callback()
    renderCursor()
  }

  function renderCursor(){
    if (!cursor) {
      return
    }
    // console.log(cursor.x)
    var x = cursor.x,
    y = cursor.y

    clearCursor()

    if (cursor.selected) {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = 0.8
      // console.log(jewels)
      drawJewel(jewels[x][y], x, y)
      ctx.restore()
    }
    ctx.save()
    ctx.lineWidth = 0.05 * jewelSize
    ctx.strokeStyle = 'rgba(250,250,150,0.8)'
    ctx.strokeRect( (x + 0.05) * jewelSize, (y + 0.05) * jewelSize, 0.9 * jewelSize, 0.9 * jewelSize)
    ctx.restore()
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

    boardElement.appendChild(canvas)
    boardElement.appendChild(createBackground())
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
    setCursor: setCursor,
    moveJewels: moveJewels,
    removeJewels: removeJewels
  }
})()